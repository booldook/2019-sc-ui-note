/***** 공통사항 *****/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var user = null;
var db = firebase.database();
var ref = null;
var key = '';
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

/***** 인증처리 *****/
auth.onAuthStateChanged(onAuth);
function onAuth(data) {
	user = data;
	if(user == null) chgState('');
	else {
		chgState('R');
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
	var colors = ["cornflowerblue",	"darkcyan", "darkorange", "deeppink","steelblue"];
	var color = colors[Math.floor(Math.random()*5)];
	html += '<li class="list" id="'+data.key+'" onclick="dataChg(this);">';
	html += '<h1 style="background-color:'+color+'">'+bTit+'</h1>';
	html += '<div>';
	html += '<div class="title">'+data.val().content+'</div>';
	html += '<div class="wdate">'+localDate(data.val().wdate)+'</div>';
	html += '</div>';
	html += '<div><i class="fas fa-trash-alt" onclick="dataRev(this);"></i></div>';
	html += '</li>';
	$(".lists").prepend(html);
}
function onRev(data) {
	$("#"+data.key).remove();
}
function onChg(data) {
	console.log(data);
}



/***** 데이터베이스 버튼 이벤트 *****/
$("#bt_new").on("click", function(){
	chgState('C');
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
$("#content").click(function(){
	chgState('C');
});
function dataRev(obj) {
	var $li = $(obj).parent().parent();
	key = $li.attr("id");
	db.ref("root/notes/"+user.uid+"/"+key).remove();
}
function dataChg(obj) {
	var $li = $(obj);
	key = $li.attr("id");
	db.ref("root/notes/"+user.uid+"/"+key).once("value").then(function(data){
		$("#content").val(data.val().content);
		chgState('U');
	});
}


/***** 상태(UI)변경함수 *****/
function chgState(chk) {
	switch(chk) {
		case "C" :
			$("#bt_new").attr("disabled", false);
			$("#bt_save").attr("disabled", false);
			$("#bt_up").hide();
			$("#bt_cls").attr("disabled", false);
			break;
		case "R" :
			$("#bt_new").attr("disabled", false);
			$("#bt_save").attr("disabled", "disabled");
			$("#bt_up").hide();
			$("#bt_cls").attr("disabled", "disabled");
			$("#content").val('');
			//로그인UI
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
		case "U" :
			//실행문
			break;
		case "D" :
			//실행문
			break;
		default :
			$(".lists").empty();
			$("#bt_new").attr("disabled", "disabled");
			$("#bt_save").attr("disabled", "disabled");
			$("#bt_up").hide();
			$("#bt_cls").attr("disabled", "disabled");
			$("#content").val('');
			//로그인UI
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
<li class="list">
	<h1>테</h1>
	<div>
		<div class="title">테스트 입니다.</div>
		<div class="wdate">2019-04-17 11:37:56</div>
	</div>
	<div><i class="fas fa-trash-alt"></i></div>
</li>
*/