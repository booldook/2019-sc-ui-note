var db = firebase.database();
var ref = null;

db.ref("root/test").on("child_added", onAdd);
db.ref("root/test").on("child_removed", onRev);
function onAdd(data) {
	var html = `
	<li id="${data.key}">
		<span>${data.val().content}</span>
		<i class="fas fa-window-close" onclick="dataRev(this);"></i>
	</li>`;
	$(".conts").prepend(html);
}
function onRev(data) {
	$("#"+data.key).remove();
}

$("#bt_save").on("click", function(){
	db.ref("root/test").push({
		content: $("#content").val()
	}).key;
	$("#content").val('');
});
function dataRev(obj) {
	var key = $(obj).parent().attr("id");
	db.ref("root/test/"+key).remove();
}
