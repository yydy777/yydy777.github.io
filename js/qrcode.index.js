//二维码
// 初始化演示用的二维码  
var qrcodeDemo = new QRCode("qrcode", { width: 256, height: 256, text: ' ' });  

function generateQRCode() {  
	var inputText = document.getElementById("inputText").value;  
		if (inputText === '') {    
			// 如果输入框为空，提示用户输入内容    
			alert('请输入内容');    
			return; // 提前退出函数，不生成二维码    
		}    
	  
	// 清除旧的二维码元素（如果存在）  
	var qrcodeElement = document.getElementById('qrcode');  
	while (qrcodeElement.firstChild) {  
		qrcodeElement.removeChild(qrcodeElement.firstChild); // 移除所有子元素（如果有的话）  
	}  
	  
	// 生成新的二维码  
	new QRCode(qrcodeElement, { text: inputText, width: 256, height: 256, colorDark: "#000000", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.H });  
}  

// 清空输入框
function Clearcode() {
	document.getElementById('inputText').value = '';
}

// 二维码内容复制到剪切板
document.getElementById('copyButton').addEventListener('click', function() {  
	var inputValue = document.getElementById('inputText').value;  
	navigator.clipboard.writeText(inputValue).then(function() {  
		console.log('复制成功！');  
	}).catch(function(err) {  
		console.error('复制失败：', err);  
	});  
});  
// 剪切板粘贴到二维码框
document.getElementById('pasteButton').addEventListener('click', async () => {  
	try {  
		const text = await navigator.clipboard.readText();  
		document.getElementById('inputText').value = text;  
		console.log('粘贴成功！');  
	} catch (err) {  
		console.error('粘贴失败：', err);  
	}  
});  