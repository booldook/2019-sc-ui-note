// firebase init
firebase.initializeApp({
	apiKey: "AIzaSyBdqHr1B8-GGa1UpavRBGo2wfDMSTpXFuI",
	authDomain: "booldook-note3.firebaseapp.com",
	databaseURL: "https://booldook-note3.firebaseio.com",
	projectId: "booldook-note3",
	storageBucket: "booldook-note3.appspot.com",
	messagingSenderId: "59442077127"
});

// 전역변수/함수 설정
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var db = firebase.database();
var ref = null;
function zp(n) {
	if(n < 10) return '0'+n;
	else return n;
}

// 최초실행함수
(function init(){
	db.ref("root/users").on("child_added", onAdd);
	db.ref("root/users").on("child_removed", onRev);
	db.ref("root/users").on("child_changed", onChg);
	db.ref("root/gbooks").on("child_added", onAdd2);
	db.ref("root/gbooks").on("child_removed", onRev2);
	db.ref("root/gbooks").on("child_changed", onChg2);
})();

// DB 저장
$("#bt_join").click(function(){
	db.ref("root/users").push({
		name: $("#name").val(),
		email: $("#email").val(),
		pass: $("#pass").val()
	}).key;
});

$("#bt_save").click(function(){
	db.ref("root/gbooks").push({
		writer: $("#writer").val(),
		content: $("#content").val(),
		wdate: new Date().getTime()
	}).key;
});

function dataRev(obj) {
	var $tr = $(obj).parent().parent();
	var id = $tr.attr("id");
	db.ref("root/gbooks/"+id).remove();
}

// DB 이벤트 콜백
function onAdd(data) {
	console.log(data);
}

function onChg(data) {
	console.log(data);
}

function onRev(data) {
	console.log(data);
}

function onAdd2(data) {
	var d = new Date(data.val().wdate);
	var dt = d.getFullYear() + "-" + zp(d.getMonth()+1) + "-" + zp(d.getDate()) + " " + zp(d.getHours()) + ":" + zp(d.getMinutes()) + ":" + zp(d.getSeconds());
	var html = '<tr id="'+data.key+'">';
	html += '<td>'+data.val().writer+'</td>';
	html += '<td>'+dt+'</td>';
	html += '<td>'+data.val().content+'</td>';
	html += '<td><i class="fas fa-window-close" onclick="dataRev(this);"></i></td>';
	html += '</tr>';
	$("#gbook_tb > tbody").prepend(html);
}

function onChg2(data) {
	console.log(data);
}

function onRev2(data) {
	$("#"+data.key).remove();
}





// auth 로그인/로그아웃 이벤트
$("#bt_login_google").click(function(){
	auth.signInWithPopup(googleAuth);
	//auth.signInWithRedirect(googleAuth);
});
$("#bt_logout_google").click(function(){
	auth.signOut();
});

// auth 이벤트 콜백
auth.onAuthStateChanged(function(data){
	if(data == null) {
		$(".google_icon").children("img").attr("src", "");
		$(".google_cont").children("div").html("");
		$(".google_icon").hide();
		$(".google_cont").hide();
		$("#bt_login_google").show();
		$("#bt_logout_google").hide();
	}
	else {
		$(".google_icon").children("img").attr("src", data.photoURL);
		$(".google_cont").children("div").eq(0).html(data.displayName);
		$(".google_cont").children("div").eq(1).html(data.email);
		$(".google_icon").show();
		$(".google_cont").show();
		$("#bt_login_google").hide();
		$("#bt_logout_google").show();
	}
});