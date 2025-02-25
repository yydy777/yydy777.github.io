function search(engine) {  
  const searchInput = document.getElementById('searchInput');  
  const query = encodeURIComponent(searchInput.value);  
  let url;  
    
  switch (engine) {  
    case 'baidu':  
      url = `https://www.baidu.com/s?wd=${query}`;  
      break;  
    case 'bing':  
      url = `https://www.bing.com/search?q=${query}`;  
      break;  
    default:  
      console.error('Unsupported search engine');  
      return;  
  }  
    
  window.open(url, '_blank');  
}