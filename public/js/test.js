var db = firebase.database();
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
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

/***** 사용자 인증 *****/
auth.onAuthStateChanged(function(data){
	user = data;
	if(user == null) chgState('');
	else {
		chgState('S');
		dbInit();
	}
});
$("#bt_signin, #bt_signin2").click(function(){
	auth.signInWithPopup(googleAuth);
});
$("#bt_signout").click(function(){
	auth.signOut();
});

/***** 데이터베이스 콜백 *****/
function dbInit() {
	db.ref("root/tests/"+user.uid).on("child_added", onAdd);
	db.ref("root/tests/"+user.uid).on("child_removed", onRev);
}
function onAdd(data) {
	var html = '<tr id="'+data.key+'">';
	html += '<td>'+data.val().content+'</td>';
	html += '<td class="text-center"><button onclick="dataRev(this);" class="btn btn-danger btn-sm">삭제</button></td>';
	html += '</tr>';
	$("#lists > tbody").prepend(html);
}
function onRev(data) {
	$("#"+data.key).remove();
}

/***** 이벤트 *****/
$("#bt_save").click(function(){
	var content = $("#content").val();
	if(content == "") {
		modalOpen("경고", "내용을 입력하세요.");
		return false;
	}
	else {
		db.ref("root/tests/"+user.uid).push({
			content: content,
			wdate: new Date().getTime()
		}).key;
	}
	$("#content").val('');
});
function dataRev(obj) {
	key = $(obj).parent().parent().attr("id");
	db.ref("root/tests/"+user.uid+"/"+key).remove();
}

/***** 상태(UI)변경함수 *****/
function chgState(chk) {
	switch(chk) {
		case "C" :
			break;
		case "R" :
			break;
		case "U" :
			break;
		case "S" :
			//로그인UI
			$("#lists > tbody").empty();
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
			chgState('R');
			break;
		default :
			//로그인UI
			$("#lists > tbody").empty();
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