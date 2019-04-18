/***** 공통사항 *****/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var user = null;
var db = firebase.database();
var ref = null;
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
function localDate(ts) {
	var d = new Date(ts);
	console.log(	d.toString()	);
	console.log(	d.getFullYear()	);
	console.log(	zp(d.getMonth() + 1)	);
	console.log(	zp(d.getMonth() + 1)	);
}
function zp(n) {
	if(n < 10) return '0'+n;
	else return n;
}
localDate(1555479856067);

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
		$("#bt_modal_close").hide();
		$("#bt_signin2").show();
		modalOpen("알림", "로그인을 하셔야 사이트를 이용하실 수 있습니다.<br>하단의 구글 로그인을 이용하세요.");
	}
	else {
		$(".signs > .photos").show();
		$(".signs > .conts").show();
		$("#bt_signin").hide();
		$("#bt_signout").show();
		$(".signs > .photos > img").attr("src", data.photoURL);
		$(".signs > .conts > div").eq(0).text(data.displayName);
		$(".signs > .conts > div").eq(1).text(data.email);
		$("#bt_modal_close").show();
		$("#bt_signin2").hide();
		$("#bt_modal_close").trigger("click");
		dbInit();
	}
}
$("#bt_signin, #bt_signin2").on("click", function() {
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
	console.log(data.key);
	console.log(data.val());
	var html = '';
	var bTit = data.val().content.substring(0, 1);
	html += '<li class="list" id="'+data.key+'">';
	html += '<h1>'+bTit+'</h1>';
	html += '<div>';
	html += '<div class="title">'+data.val().content+'</div>';
	html += '<div class="wdate">2019-04-17 11:37:56</div>';
	html += '</div>';
	html += '<div><i class="fas fa-trash-alt"></i></div>';
	html += '</li>';
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