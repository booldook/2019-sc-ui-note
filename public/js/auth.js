// firebase init
firebase.initializeApp({
	apiKey: "AIzaSyBdqHr1B8-GGa1UpavRBGo2wfDMSTpXFuI",
	authDomain: "booldook-note3.firebaseapp.com",
	databaseURL: "https://booldook-note3.firebaseio.com",
	projectId: "booldook-note3",
	storageBucket: "booldook-note3.appspot.com",
	messagingSenderId: "59442077127"
});

// 전역변수 설정
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var db = firebase.database();
var ref = null;

// 최초실행함수
(function init(){
	db.ref("root/users").on("child_added", onAdd);
	db.ref("root/users").on("child_removed", onRev);
	db.ref("root/users").on("child_changed", onChg);
})();

// DB 저장
$("#bt_join").click(function(){
	db.ref("root/users").push({
		name: $("#name").val(),
		email: $("#email").val(),
		pass: $("#pass").val()
	}).key;
});

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