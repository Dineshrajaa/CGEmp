$(document).ready(function(){
	var dbName;
	document.addEventListener('deviceready',function(){
		 dbName=window.sqlitePlugin.openDatabase({name: "cgemp.db"});
		alert("Created DB");
	});
	//DOM Loaded Completely
	$("#updatebtn").hide();
	$("#editbtn").tap(function(){
		$('.editing').attr('readonly', false);
		$("#updatebtn").show();
	});
});