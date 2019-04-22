// jQuery
/*
$("#bt_save").click(function(){
	$("#content").css({"background-color":"yellow", "border-color": "red"});
});
$("#bt_cancel").click(function(){
	$("#content").css({"background-color":"white", "border-color": "#ccc"});
});
*/
// ES5
/*
document.getElementById("bt_save").addEventListener("click", function(){
	var bgColor = document.getElementById("content").style.backgroundColor;
	console.log(bgColor);
	document.getElementById("content").style.backgroundColor = "yellow";
	document.getElementById("content").style.borderColor = "red";
});
document.getElementById("bt_cancel").addEventListener("click", function(){
	document.getElementById("content").style.backgroundColor = "white";
	document.getElementById("content").style.borderColor = "#ccc";
});
*/

// ES6
document.querySelector("#bt_save").addEventListener("click", () => {
	document.querySelector("#content").style.backgroundColor = "yellow";
	document.querySelector("#content").style.borderColor = "red";
});
document.querySelector("#bt_cancel").addEventListener("click", () => {
	document.querySelector("#content").style.backgroundColor = "white";
	document.querySelector("#content").style.borderColor = "#ccc";
});

//jQuery
$(".btn").each(function(){
	$(this).css("border-color", "black");
});

// ES5 - 선택자
var btSave = document.getElementById("bt_save");
var bts = document.getElementsByClassName("btn");
console.log(btSave);
console.log(bts[1]);
for(var i=0; i<bts.length; i++) {
	bts[i].style.borderColor = "green";
}


/* 
//	ES5(ie7,8,9,10,11-chrome,safari,opera)
document.getElementById("bt_save").addEventListener("click", function(){
	console.log(	document.getElementById("content").value	);
});

// ES6
document.querySelector("#bt_save").addEventListener("click", function(){
	const val = document.querySelector("#content").value;
	console.log(val);
});
 */