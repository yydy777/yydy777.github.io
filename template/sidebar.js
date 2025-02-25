// header.js  

// 使用innerHTML添加内容到指定id
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('sidebar').innerHTML = `  

    <div class="docs-brand"><a class="docs-logo" href="index.html">
        <img src="img/spectre-logo.svg" alt="Spectre.css CSS Framework">

        <small class="label label-secondary text-bold">YYDY</small>
      </a>
    </div>
    <div class="docs-nav">
      <div class="accordion-container">
      		
        <div class="accordion">
          <input id="accordion-getting-started" type="checkbox" name="docs-accordion-checkbox" hidden="" checked="checked" />
          <label class="accordion-header c-hand" for="accordion-getting-started">网址相关工具</label>
          <div class="accordion-body">
            <ul class="menu menu-nav">
              <li class="menu-item"><a href="urls.html">批量打开网页</a></li>
              <li class="menu-item"><a href="qr.html">二维码生成</a></li>
              <li class="menu-item"><a href="lan.html">局域网访问</a></li>
            </ul>
          </div>
        </div>
        	
        <div class="accordion">
          <input id="accordion-experimentals" type="checkbox" name="docs-accordion-checkbox" hidden="" checked="checked" />
          <label class="accordion-header c-hand" for="accordion-experimentals">时间日期工具</label>
          <div class="accordion-body">
            <ul class="menu menu-nav">
              <li class="menu-item"><a href="countdown.html">倒计时</a></li>
              <li class="menu-item"><a href="date.html">日期计算</a></li>
              <li class="menu-item"><a href="time.html">实时时间</a></li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    `;
});