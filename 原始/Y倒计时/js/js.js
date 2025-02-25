k = 1;
ks = 1;

function start() {
	ks = 1;
	document.getElementById("remind").style.visibility = "visible";
	s = document.getElementById("s").value;
	f = document.getElementById("f").value;
	m = document.getElementById("m").value;
	if (k == 1) {
		k = 0;
		countdown();
	} else {
		alert("请先停止上次的倒计时闹铃，再开始新的！");
	}
}

function wtime() {
	setTimeout("countdown()", 1000);
}

function countdown() {
	if (ks == 1) { //停止或开始
		document.getElementById("m").value = m;
		if (m > 0) {
			m--;
			wtime();
		} else {
			if (f > 0) {
				m = 59;
				f--;
				document.getElementById("f").value = f;
				wtime();
			} else {
				if (s > 0) {
					f = 60;
					s--;
					document.getElementById("s").value = s;
					wtime();
				} else {
					cancel();
				}
			}
		}
	} //停止或开始
}

function cancel() {
	var audio = document.getElementById('music');
	document.getElementById('music').src = "music/" + document.getElementById("v").value + ".mp3";
	audio.play();
	document.getElementById("remind").innerHTML = "倒计时已结束";
	a = 1;
	action();
}

function stop() {
	//k=0 进行倒计时；k=1音乐播放中
	ks = 0; //停止倒计时
	var audio = document.getElementById('music');
	audio.pause();
	document.getElementById("remind").innerHTML = "正在倒计时";
	document.getElementById("remind").style.visibility = "hidden";
	a = 2;
	k = 1; //先ks赋值1在k开始循环
}
function clearinput() {
	stop();
	document.getElementById("s").value="0";
	document.getElementById("f").value="0";
	document.getElementById("m").value="0";
	}
function action() {
	setTimeout("ac()", 500);
}

function ac() {
	if (a == 1) {
		document.getElementById("remind").style.visibility = "visible";
		a = 0;
		action();
	} else if (a == 0) {
		document.getElementById("remind").style.visibility = "hidden";
		a = 1;
		action();
	}
}

