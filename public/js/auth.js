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
	console.log(data.displayName);
	console.log(data.email);
	console.log(data.photoURL);
	console.log(data.uid);
});