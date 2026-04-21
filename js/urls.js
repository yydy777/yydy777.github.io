
let isTaskRunning = false;
let openedTabs = [];
let lastActiveTab = null;
let currentIdx = 0;

function initTags() {
	document.querySelectorAll('.tag[data-url]').forEach(tag => {
		tag.addEventListener('click', function() {
			document.getElementById('prefixInput').value = this.getAttribute('data-url');
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
			document.getElementById('mainInput').value = text;
			resetProgress();
		}
		addLog(`已同步剪贴板内容到${target === 'prefix' ? '前缀' : '主体'}`);
	} catch (err) {
		alert("无法访问剪贴板，请手动粘贴。");
	}
}

function formatContent() {
	const prefix = document.getElementById('prefixInput').value.trim();
	let list = getList();
	if (list.length === 0) return;
	list = [...new Set(list)];
	if (!prefix) {
		list = list.map(item => {
			let url = item;
			if (!url.startsWith('http') && !url.startsWith('//')) url = 'http://' + url;
			if (!url.endsWith('/') && !url.includes('?') && !url.includes('#')) url = url + '/';
			return url;
		});
		addLog("完成标准化格式处理");
	} else {
		addLog("完成数据去重处理");
	}
	document.getElementById('mainInput').value = list.join('\n');
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

function getList() { return document.getElementById('mainInput').value.split('\n').map(s => s.trim()).filter(Boolean); }

async function runTask() {
	if (isTaskRunning) return;
	const list = getList();
	if (!list.length) { addLog("错误：未检测到有效数据"); return; }
	
	isTaskRunning = true;
	document.getElementById('stopBtn').style.display = 'inline-block';
	
	const isLoop = document.getElementById('loopMode').checked;
	const prefix = document.getElementById('prefixInput').value;
	const group = parseInt(document.getElementById('groupSize').value) || 0;
	const delay = parseInt(document.getElementById('delayTime').value) || 0;
	
	let end = (group > 0) ? Math.min(currentIdx + group, list.length) : list.length;
	
	for (let i = currentIdx; i < end; i++) {
		if (!isTaskRunning) break;
		let val = list[i];
		let url = prefix.includes("{val}") ? prefix.replace("{val}", val) : val;
		
		if (!url.includes("://") && !prefix.includes("{val}")) {
			url = (prefix ? (prefix.endsWith('/') ? prefix : prefix + '/') : '') + val;
			if (!url.startsWith('http')) url = 'http://' + url;
		}

		if (document.getElementById('closePrev').checked && lastActiveTab) lastActiveTab.close();
		try {
			let win = window.open(url, "_blank");
			if (win) { openedTabs.push(win); lastActiveTab = win; }
		} catch (e) { addLog("弹窗拦截，请检查权限"); }
		
		currentIdx = i + 1;
		updateStats();
		if (delay > 0 && i < end - 1) await new Promise(r => setTimeout(r, delay));
	}
	
	if (currentIdx >= list.length && isLoop) currentIdx = 0;
	isTaskRunning = false;
	document.getElementById('stopBtn').style.display = 'none';
	updateStats();
	addLog("任务当前阶段已完成");
}

function clearData(type) {
	if (type === 'prefix') { document.getElementById('prefixInput').value = ""; saveData(); }
	else { document.getElementById('mainInput').value = ""; currentIdx = 0; updateStats(); }
	addLog(`已清空${type === 'prefix' ? '前缀' : '内容'}`);
}

function resetProgress() { currentIdx = 0; updateStats(); addLog("进度归零"); }
function stopTask() { isTaskRunning = false; addLog("已人工停止运行"); }
function closeTabs() { openedTabs.forEach(t => t && !t.closed && t.close()); openedTabs = []; addLog("已执行强制关窗"); }
function saveData() { localStorage.setItem('pei_prefix', document.getElementById('prefixInput').value); }

function setExample() { 
	document.getElementById('prefixInput').value = ""; 
	document.getElementById('mainInput').value = "192.168.1.1\nbaidu.com\nbing.com";
	updateStats();
	addLog("载入测试样例数据");
}

async function copyContent() { await navigator.clipboard.writeText(document.getElementById('mainInput').value); addLog("内容已复制到剪切板"); }

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
