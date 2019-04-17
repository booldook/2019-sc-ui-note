/***** 공통사항 *****/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var user = null;
var db = firebase.database();
var ref = null;
function modalOpen(headTxt, contTxt) {
	$("#modal_head").text(headTxt);
	$("#modal_cont").text(contTxt);
	$("#modal").css("display", "flex");
}
$("#bt_modal_close").click(function(e) {
	e.stopPropagation();
	$("#modal_head").text('');
	$("#modal_cont").text('');
	$("#modal").css("display", "none");
});

/***** 인증처리 *****/
auth.onAuthStateChanged(onAuth);
function onAuth(data) {
	user = data;
	if(data == null) {
		$(".signs > .photos").hide();
		$(".signs > .conts").hide();
		$("#bt_signin").show();
		$("#bt_signout").hide();
		$(".signs > .photos > img").attr("src", "");
		$(".signs > .conts > div").html("");
	}
	else {
		$(".signs > .photos").show();
		$(".signs > .conts").show();
		$("#bt_signin").hide();
		$("#bt_signout").show();
		$(".signs > .photos > img").attr("src", data.photoURL);
		$(".signs > .conts > div").eq(0).text(data.displayName);
		$(".signs > .conts > div").eq(1).text(data.email);
		dbInit();
	}
}
$("#bt_signin").on("click", function() {
	auth.signInWithPopup(googleAuth);
});
$("#bt_signout").on("click", function() {
	auth.signOut();
});

/***** 데이터베이스 콜백 *****/
function dbInit() {
	db.ref("root/notes/"+user.uid).on("child_added", onAdd);
	db.ref("root/notes/"+user.uid).on("child_removed", onRev);
	db.ref("root/notes/"+user.uid).on("child_changed", onChg);
}
function onAdd(data) {
	console.log(data);
}
function onRev(data) {
	console.log(data);
}
function onChg(data) {
	console.log(data);
}



/***** 데이터베이스 버튼 이벤트 *****/
$("#bt_new").on("click", function(){

});
$("#bt_save").on("click", function(){
	var content = $("#content").val();
	if(content == "") {
		modalOpen("경고", "내용을 입력하세요.");
		return false;
	}
	else {
		db.ref("root/notes/"+user.uid).push({
			content: content,
			wdate: new Date().getTime()
		}).key;
		$("#content").val('');
	}
});
$("#bt_up").on("click", function(){
	console.log("수정!");
});
$("#bt_cls").on("click", function(){

});


/*
<li class="list">
	<h1>테</h1>
	<div>
		<div class="title">테스트 입니다.</div>
		<div class="wdate">2019-04-17 11:37:56</div>
	</div>
	<div><i class="fas fa-trash-alt"></i></div>
</li>
*/