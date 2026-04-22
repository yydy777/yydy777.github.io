
let isTaskRunning = false;
let openedTabs = [];
let lastActiveTab = null;
let currentIdx = 0;

function updateInputWithUndo(text) {
	const input = document.getElementById('mainInput');
	input.focus();
	input.setSelectionRange(0, input.value.length);
	const success = document.execCommand('insertText', false, text);
	if (!success) { input.value = text; }
}

function undoAction() {
	const input = document.getElementById('mainInput');
	input.focus();
	document.execCommand('undo', false, null);
	updateStats();
	addLog("已撤销上一步操作");
}

function initTags() {
	document.querySelectorAll('.tag[data-url]').forEach(tag => {
		tag.addEventListener('click', function() {
			document.getElementById('prefixInput').value = tag.getAttribute('data-url');
			saveData();
		});
	});
}

async function pasteTo(target) {
	try {
		const text = await navigator.clipboard.readText();
		if (target === 'prefix') {
			document.getElementById('prefixInput').value = text;
			saveData();
		} else {
			updateInputWithUndo(text);
			resetProgress();
		}
		addLog(`内容已粘贴至${target === 'prefix' ? '前缀' : '主体'}`);
	} catch (err) { alert("剪贴板访问被拒绝"); }
}

function removeDuplicates(isSilent = false) {
	const list = getList();
	if (list.length === 0) return;
	const newList = [...new Set(list)];
	const newText = newList.join('\n');
	if (newText !== document.getElementById('mainInput').value.trim()) {
		updateInputWithUndo(newText);
	}
	updateStats();
	if (!isSilent) addLog("数据去重整理完成");
}

function formatContent() {
	let list = getList();
	if (list.length === 0) return;
	const formatted = list.map(item => {
		let url = item;
		if (!url.startsWith('http') && !url.startsWith('//')) url = 'http://' + url;
		if (!url.endsWith('/') && !url.includes('?') && !url.includes('#')) url = url + '/';
		return url;
	});
	updateInputWithUndo(formatted.join('\n'));
	addLog("网址格式化补全完成");
	updateStats();
}

function updateStats() {
	const list = getList();
	const total = list.length;
	const percent = total > 0 ? Math.round((currentIdx / total) * 100) : 0;
	
	document.getElementById('valTotal').innerText = total;
	document.getElementById('valCurrent').innerText = currentIdx;
	document.getElementById('valPercent').innerText = percent + "%";
	document.getElementById('progressFill').style.width = percent + "%";

	const resetBtn = document.getElementById('resetBtn');
	resetBtn.style.display = currentIdx > 0 ? 'inline-block' : 'none';
}

function getList() { 
	return document.getElementById('mainInput').value.split('\n').map(s => s.trim()).filter(Boolean); 
}

async function runTask() {
	if (isTaskRunning) return;
	removeDuplicates(true); 
	const list = getList();
	if (!list.length) { addLog("无有效内容可打开"); return; }
	
	isTaskRunning = true;

	const isLoop = document.getElementById('loopMode').checked;
	const prefix = document.getElementById('prefixInput').value.trim();
	const group = parseInt(document.getElementById('groupSize').value) || 0;
	const delay = parseInt(document.getElementById('delayTime').value) || 0;
	
	let end = (group > 0) ? Math.min(currentIdx + group, list.length) : list.length;
	
	for (let i = currentIdx; i < end; i++) {
		if (!isTaskRunning) break;
		let val = list[i];
		let url = prefix !== "" ? (prefix.includes("{val}") ? prefix.replace("{val}", val) : prefix + val) : val;
		
		if (!url.startsWith('http') && !url.startsWith('//')) url = 'http://' + url;

		if (document.getElementById('closePrev').checked && lastActiveTab) {
			try { lastActiveTab.close(); } catch(e) {}
		}

		try {
			let win = window.open(url, "_blank");
			if (win) { openedTabs.push(win); lastActiveTab = win; }
		} catch (e) { addLog("窗口被浏览器拦截"); }
		
		currentIdx = i + 1;
		updateStats();
		if (delay > 0 && i < end - 1) await new Promise(r => setTimeout(r, delay));
	}
	
	if (currentIdx >= list.length && isLoop) currentIdx = 0;
	isTaskRunning = false;

	updateStats();
	addLog("批量操作结束");
}

function clearData(type) {
	if (type === 'prefix') { 
		document.getElementById('prefixInput').value = ""; 
		saveData(); 
	} else { 
		updateInputWithUndo(""); 
		currentIdx = 0; 
		updateStats(); 
	}
	addLog(`已清空${type === 'prefix' ? '前缀' : '主体'}`);
}

function resetProgress() { currentIdx = 0; updateStats(); addLog("进度已重置"); }

function closeTabs() { openedTabs.forEach(t => t && !t.closed && t.close()); openedTabs = []; addLog("已关闭标签页"); }
function saveData() { localStorage.setItem('pei_prefix', document.getElementById('prefixInput').value); }

function setExample() { 
	document.getElementById('prefixInput').value = "https://www.baidu.com/s?wd={val}"; 
	updateInputWithUndo("Python\n123\n爬虫");
	currentIdx = 0;
	updateStats();
	addLog("载入示例数据");
}

async function copyContent() { 
	await navigator.clipboard.writeText(document.getElementById('mainInput').value); 
	addLog("内容已复制"); 
}

function addLog(msg) {
	const area = document.getElementById('logArea');
	const div = document.createElement('div');
	div.innerHTML = `> [${new Date().toLocaleTimeString()}] ${msg}`;
	area.prepend(div);
}

window.onload = () => {
	initTags();
	const saved = localStorage.getItem('pei_prefix');
	if (saved) document.getElementById('prefixInput').value = saved;
	updateStats();
};

