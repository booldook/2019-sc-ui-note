var config = {
	apiKey: "AIzaSyBdqHr1B8-GGa1UpavRBGo2wfDMSTpXFuI",
	authDomain: "booldook-note3.firebaseapp.com",
	databaseURL: "https://booldook-note3.firebaseio.com",
	projectId: "booldook-note3",
	storageBucket: "booldook-note3.appspot.com",
	messagingSenderId: "59442077127"
};
firebase.initializeApp(config);

var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();

$("#bt_login_google").click(function(){
	auth.signInWithPopup(googleAuth);
	//auth.signInWithRedirect(googleAuth);
});
$("#bt_logout_google").click(function(){
	auth.signOut();
});
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