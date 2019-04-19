/***** 공통사항 *****/
var auth = firebase.auth();
var db = firebase.database();
var storage = firebase.storage();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var root = storage.ref().child("imgs");
var user = null;
function modalOpen(headTxt, contTxt) {
	$("#modal_head").html(headTxt);
	$("#modal_cont").html(contTxt);
	$("#modal").css("display", "flex");
}
$("#bt_modal_close").click(function(e) {
	e.stopPropagation();
	$("#modal_head").html('');
	$("#modal_cont").html('');
	$("#modal").css("display", "none");
});
function splitName(name) {
	var obj = {};
	var arr = name.split('.');
	obj.time = new Date().getTime();
	obj.ext = arr.pop();
	obj.oriFile = arr.join('.');
	obj.oriName = obj.oriFile + '.' + obj.ext;
	obj.newFile = obj.time + '-' + Math.floor(Math.random() * 90 + 10);
	obj.newName = obj.newFile + '.' + obj.ext;
	return obj;
}
function localDate(ts) {
	var d = new Date(ts);
	var dt = '';
	//dt += d.getFullYear().toString().substring(2, 4) + '-';
	dt += d.getFullYear() + '-';
	dt += zp(d.getMonth() + 1) + '-';
	dt += zp(d.getDate()) + ' ';
	dt += zp(d.getHours()) + ':';
	dt += zp(d.getMinutes()) + ':';
	dt += zp(d.getSeconds());
	return dt;
}
function zp(n) {
	if(n < 10) return '0'+n;
	else return n;
}

/***** 사용자 인증 *****/
auth.onAuthStateChanged(function(data){
	user = data;
	if(user == null) chgState('');
	else chgState('S');
});
$("#bt_signin, #bt_signin2").click(function(){
	auth.signInWithPopup(googleAuth);
});
$("#bt_signout").click(function(){
	auth.signOut();
});

/***** 데이터 이벤트 *****/
$("#bt_save").click(onSave);
function onSave(){
	var file = $("#pds")[0].files[0];
	var gFile = splitName(file.name);
	var data = null;
	$(".loader").css("display", "flex");
	var uploader = root.child(gFile.newName).put(file);
	uploader.on('state_changed', uploadIng, uploadErr, uploadDone);
	function uploadIng(snapshot) {
		data = snapshot;
		var progress = (data.bytesTransferred / data.totalBytes) * 100;
		$(".loader > .txt").html(Math.ceil(progress) + '%');
	}
	function uploadErr(err) {
		$(".loader").css("display", "none");
		modalOpen("경고", "파일업로드에 실패하였습니다.");
	}
	function uploadDone() {
		$(".loader").css("display", "none");
		data.ref.getDownloadURL().then(function(url) {
			var saveData = {};
			saveData.content = $("#content").val();
			saveData.oriName = gFile.oriName;
			saveData.newName = gFile.newName;
			saveData.wdate = gFile.time;
			saveData.size = file.size;
			saveData.url = url;
			db.ref("root/uploads/"+user.uid).push(saveData).key;
			db.ref("root/uploads/"+user.uid).on("child_added", function(data){
				var html = '';
				html += '<li>원본파일명 : '+data.val().oriName+'</li>';
				html += '<li>저장파일명 : '+data.val().newName+'</li>';
				html += '<li>저장된위치 : <a href="'+data.val().url+'" target="_blank">'+data.val().url+'</a></li>';
				html += '<li>저장된시간 : '+localDate(data.val().wdate)+'</li>';
				html += '<li>파일사이즈 : '+data.val().size+'</li>';
				html += '<li>남긴한마디 : '+data.val().content+'</li>';
				html += '<li><img src="'+data.val().url+'" class="img"></li>';
				$(".console").html(html);
			});
		});
	}
}
// uploader.on("state_changed", 함수1, 함수2, 함수3);
// 함수1: 진행중, 함수2: 진행에러, 함수3: 진행완료


/***** UI 변경 *****/
function chgState(chk) {
	switch(chk) {
		case "S" :
			// signin
			$(".signs > .photos").show();
			$(".signs > .conts").show();
			$("#bt_signin").hide();
			$("#bt_signout").show();
			$(".signs > .photos > img").attr("src", user.photoURL);
			$(".signs > .conts > div").eq(0).text(user.displayName);
			$(".signs > .conts > div").eq(1).text(user.email);
			$("#bt_modal_close").show();
			$("#bt_signin2").hide();
			$("#bt_modal_close").trigger("click");
			break;
		default :
			// signout
			$(".signs > .photos").hide();
			$(".signs > .conts").hide();
			$("#bt_signin").show();
			$("#bt_signout").hide();
			$(".signs > .photos > img").attr("src", "");
			$(".signs > .conts > div").html("");
			$("#bt_modal_close").hide();
			$("#bt_signin2").show();
			modalOpen("알림", "로그인을 하셔야 사이트를 이용하실 수 있습니다.<br>하단의 구글 로그인을 이용하세요.");
			break;
	}
}

/*
var cart = "2-4-255,14-8-0,5278-1-0";
var arr2 = cart.split(",");
var prds = [];
for(var i=0 in arr2) {
	prds[i] = arr2[i].split("-");
}
console.log(prds);
*/