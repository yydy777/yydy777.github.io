
let isTaskRunning = false;
let openedTabs = [];
let lastActiveTab = null;
let currentIdx = 0;

// --- 支持撤销的赋值函数 ---
function updateInputWithUndo(text) {
	const input = document.getElementById('mainInput');
	input.focus();
	input.setSelectionRange(0, input.value.length);
	const success = document.execCommand('insertText', false, text);
	if (!success) {
		input.value = text;
	}
}

// --- 撤销功能 ---
function undoAction() {
	const input = document.getElementById('mainInput');
	input.focus();
	document.execCommand('undo', false, null);
	updateStats();
	addLog("已执行撤销操作");
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
		addLog(`已粘贴内容到${target === 'prefix' ? '前缀' : '主体'}`);
	} catch (err) {
		alert("无法访问剪贴板，请手动粘贴。");
	}
}

// --- 去重功能 ---
function removeDuplicates(isSilent = false) {
	const list = getList();
	if (list.length === 0) return;
	const newList = [...new Set(list)];
	const newText = newList.join('\n');
	
	if (newText !== document.getElementById('mainInput').value.trim()) {
		updateInputWithUndo(newText);
	}
	
	updateStats();
	if (!isSilent) addLog("去重整理完成");
}

// --- 格式化功能：已去掉前缀限制，强制执行 ---
function formatContent() {
	let list = getList();
	if (list.length === 0) return;

	// 强制对每一行进行网址补全处理
	const formattedList = list.map(item => {
		let url = item;
		// 补全协议头
		if (!url.startsWith('http') && !url.startsWith('//')) {
			url = 'http://' + url;
		}
		// 补全尾部斜杠（如果不含参数或锚点）
		if (!url.endsWith('/') && !url.includes('?') && !url.includes('#')) {
			url = url + '/';
		}
		return url;
	});

	updateInputWithUndo(formattedList.join('\n'));
	addLog("内容格式化处理完成（已强制补全协议与斜杠）");
	updateStats();
}

function toggleResetVisibility() {
	const isLoop = document.getElementById('loopMode').checked;
	document.getElementById('resetBtn').style.display = isLoop ? 'none' : 'inline-block';
}

function updateStats() {
	const list = getList();
	const total = list.length;
	const percent = total > 0 ? Math.round((currentIdx / total) * 100) : 0;
	document.getElementById('valTotal').innerText = total;
	document.getElementById('valCurrent').innerText = currentIdx;
	document.getElementById('valPercent').innerText = percent + "%";
	document.getElementById('progressFill').style.width = percent + "%";
}

function getList() { 
	return document.getElementById('mainInput').value.split('\n')
		   .map(s => s.trim())
		   .filter(Boolean); 
}

async function runTask() {
	if (isTaskRunning) return;
	
	// 任务开始前自动去重
	removeDuplicates(true); 
	
	const list = getList();
	if (!list.length) { addLog("错误：未检测到有效数据"); return; }
	
	isTaskRunning = true;
	document.getElementById('stopBtn').style.display = 'inline-block';
	
	const isLoop = document.getElementById('loopMode').checked;
	const prefix = document.getElementById('prefixInput').value.trim();
	const group = parseInt(document.getElementById('groupSize').value) || 0;
	const delay = parseInt(document.getElementById('delayTime').value) || 0;
	
	let end = (group > 0) ? Math.min(currentIdx + group, list.length) : list.length;
	
	for (let i = currentIdx; i < end; i++) {
		if (!isTaskRunning) break;
		let val = list[i];
		let url = "";

		if (prefix !== "") {
			if (prefix.includes("{val}")) {
				url = prefix.replace("{val}", val);
			} else {
				url = prefix.endsWith('/') ? prefix + val : prefix + '/' + val;
			}
			if (!url.startsWith('http') && !url.startsWith('//')) url = 'http://' + url;
		} else {
			url = val;
			if (!url.startsWith('http') && !url.startsWith('//')) url = 'http://' + url;
		}

		if (document.getElementById('closePrev').checked && lastActiveTab) {
			try { lastActiveTab.close(); } catch(e) {}
		}

		try {
			let win = window.open(url, "_blank");
			if (win) { openedTabs.push(win); lastActiveTab = win; }
		} catch (e) { addLog("窗口被拦截，请允许弹出窗口"); }
		
		currentIdx = i + 1;
		updateStats();
		if (delay > 0 && i < end - 1) await new Promise(r => setTimeout(r, delay));
	}
	
	if (currentIdx >= list.length && isLoop) currentIdx = 0;
	isTaskRunning = false;
	document.getElementById('stopBtn').style.display = 'none';
	updateStats();
	addLog("批量操作完成");
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
	addLog(`已清空${type === 'prefix' ? '前缀' : '内容'}`);
}

function resetProgress() { currentIdx = 0; updateStats(); addLog("进度已重置"); }
function stopTask() { isTaskRunning = false; addLog("已停止运行"); }
function closeTabs() { openedTabs.forEach(t => t && !t.closed && t.close()); openedTabs = []; addLog("已关闭已开页面"); }
function saveData() { localStorage.setItem('pei_prefix', document.getElementById('prefixInput').value); }

function setExample() { 
	document.getElementById('prefixInput').value = "https://www.baidu.com/s?wd={val}"; 
	updateInputWithUndo("123\n爬虫\nPython");
	currentIdx = 0;
	updateStats();
	addLog("已载入测试数据");
}

async function copyContent() { 
	await navigator.clipboard.writeText(document.getElementById('mainInput').value); 
	addLog("内容已复制到剪贴板"); 
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
	toggleResetVisibility();
	updateStats();
};
