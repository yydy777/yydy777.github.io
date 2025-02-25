// header.js  

// 使用innerHTML添加内容到指定id
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('header').innerHTML = `  

    <a class="off-canvas-toggle btn btn-link btn-action" href="#sidebar">
      <i class="icon icon-menu"></i>
    </a>
    <div class="btns d-flex">  
       <input class="docs-search form-input" type="text" placeholder="搜索一下" id="searchInput">  
       <button class="btn ml-1" onclick="search('baidu')">百度</button>  
       <button class="btn btn-primary ml-1" onclick="search('bing')">必应</button>  
    </div>

    `;
});