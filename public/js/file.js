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
	var uploader = root.child(gFile.newName).put(file);
	uploader.on('state_changed', uploadIng, uploadErr, uploadDone);
	function uploadIng(snapshot) {
		data = snapshot;
		var progress = (data.bytesTransferred / data.totalBytes) * 100;
		console.log('업로드 진행률 : ' + progress + '%');
	}
	function uploadErr(err) {
		console.log(err);
	}
	function uploadDone() {
		data.ref.getDownloadURL().then(function(url) {
			console.log('파일위치 : ', url);
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