/***** 공통사항 *****/
var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();

/***** 인증처리 *****/
auth.onAuthStateChanged(onAuth);
function onAuth(data) {
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
	}
}
$("#bt_signin").on("click", function() {
	auth.signInWithPopup(googleAuth);
});
$("#bt_signout").on("click", function() {
	auth.signOut();
});