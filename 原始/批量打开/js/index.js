function openWebsites() {  
  var prefixInput = document.getElementById("prefixInput").value;  
  var websitesInput = document.getElementById("websitesInput").value;  
  var websites = websitesInput.split("\n").filter(Boolean).map(function(url) {  
    return url.replace(/^\s+/g, ""); // 去除每一行开头的空格  
  });  
  var windowArray = [];  
  
  for (var i = 0; i < websites.length; i++) {  
    var url = websites[i];  
    if (!url.startsWith("http://") && !url.startsWith("https://")) {  
      if (prefixInput === "") {  
        // 如果前缀为空，自动添加http://协议到输入框内容中  
        url = "http://" + url;  
      } else {  
        // 如果前缀不为空，将前缀和协议添加到URL中  
        if (!prefixInput.startsWith("http://") && !prefixInput.startsWith("https://")) {  
          url = "http://" + prefixInput + url; // 添加http://协议和前缀  
        } else {  
          url = prefixInput + url; // 仅使用前缀，不添加协议  
        }  
      }  
    }  
    var newWindow = window.open(url);  
    windowArray.push(newWindow);  
  }  
}

function clearInput() {
	document.getElementById("websitesInput").value = ""; // 清空输入框内容
}
  function clearPrefix() {
	document.getElementById("prefixInput").value = ""; // 清空前缀内容
}

// 剪切板粘贴到内容框
document.getElementById('webButton').addEventListener('click', async () => {  
	try {  
		const text = await navigator.clipboard.readText();  
		document.getElementById('websitesInput').value = text;  
		console.log('粘贴成功！');  
	} catch (err) {  
		console.error('粘贴失败：', err);  
	}  
});  

// 点击按钮将按钮value传入输入框
// 为每个按钮添加点击事件监听器  
function handleButtonClick(event) {  
	// 获取输入框元素  
	var input = document.getElementById('prefixInput');  
		
	// 将按钮的value属性值设置为输入框的值  
	input.value = event.target.value;  
}  

