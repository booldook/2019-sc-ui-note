var auth = firebase.auth();
var googleAuth = new firebase.auth.GoogleAuthProvider();

$("#bt_login_google").click(function(){
	//auth.signInWithPopup(googleAuth);
	auth.signInWithRedirect(googleAuth);
});