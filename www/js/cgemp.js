$(document).ready(function(){
	var dbName;
	var gId;

	//Method to display Toast Alerts
	function toastAlert(msg){
		window.plugins.toast.showLongBottom(msg);
	}

	
						/**Methods related to Database**/
	
	//Method to Initialize DB
	function dbtInitialize(){
		if (window.openDatabase) {
			dbName.transaction(function(tx){
				tx.executeSql("create table if not exists cgemptable(wId integer primary key,wName text,wMobile text,wSalary real)");
				
				});
		}
		else{
			alert("Sorry You can't Save data");
		}
	}

	//Method to save Employee Profile
	function saveProfile(){
		var pname=$("#ename").val();
		var pmobile=$("#emobile").val();
		var psal=$("#esal").val();
		dbName.transaction(function(tx){
			tx.executeSql("insert into cgemptable(wName,wMobile,wSalary) values(?,?,?)",[pname,pmobile,psal]);
			});
		toastAlert("Saved Profile");
		$("#emplist").html("");			
		$(":mobile-pagecontainer").pagecontainer("change","#homePage");
		readProfile();
	}

	//Method to Make fields Editable
	function makeitEditable(){		
		$('.editing').attr('readonly', false);
		$("#updatebtn").button('enable');		
	}

	//Method to List Employee Profile
	function listProfile(transaction,results){
		//$("#emplist").html("");
		for(var i=0;i<results.rows.length;i++){
			var row=results.rows.item(i);
			$("#emplist").append("<li id='"+row.wId+"' class='wl'><a href='#'>"+row.wName+"</a></li>");
		}
		$("#emplist").listview("refresh");
	}

	//Method to Read Employee Profile for Listing
	function readProfile(){		
		dbName.transaction(function(tx){
			tx.executeSql("select * from cgemptable",[],listProfile);
		});
	}

	//Method to Update existing Profiles
	function updateProfile(transaction,results){
		var row=results.rows.item(0);
		$(":mobile-pagecontainer").pagecontainer("change","#viewPage");
		gId=row.wId;
		$("#updatebtn").button('disable');
		$("#dname").val(row.wName);
		$("#dsal").val(row.wSalary);
		$("#dmbl").val(row.wMobile);		
	}

	//Updates the Table row
	$("#updatebtn").tap(function(){			
			var uname=$("#dname").val();
			var usal=$("#dsal").val();
			var umbl=$("#dmbl").val();
			dbName.transaction(function(tx){
				tx.executeSql("update cgemptable set wName=?,wMobile=?,wSalary=? where wId='"+gId+"'",[uname,umbl,usal]);
			});
			toastAlert("Updated Successfully");
			$(":mobile-pagecontainer").pagecontainer("change","#homePage");
			$("#emplist").html("");
			readProfile();
		});

	//Method to Read Selected Employee Profile for Editing
	function editProfile(sid){
		dbName.transaction(function(tx){			
			tx.executeSql('select * from cgemptable where wId = "'+ sid+ '"', [], updateProfile);
		});
	}

	

		/**End of Database related Functions**/

	/**Methods which are executed when Device is Ready**/
	document.addEventListener('deviceready',function(){
		 dbName=window.sqlitePlugin.openDatabase({name: "cgemp.db"});		
		dbtInitialize();
		readProfile();
	});
	
		/**InAppBrowser Methods**/
		function informer(){
			
			var officeSite=window.open('http://www.cgvakindia.com/','_blank','location=yes','closebuttoncaption=Ok','toolbarposition=top');
		}
	
		/**Function Calls**/

	//Save Employee Profile
	$("#savebtn").tap(saveProfile);

	//Make Elements Editable
	$("#editbtn").click(makeitEditable);

	//Display AddPage
	$("#vapbtn").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#addPage");
	});

	//Display InappBrowser
	$("#infobtn").tap(informer);

	//Display HomePage
	$(".home").tap(function(){
		$(":mobile-pagecontainer").pagecontainer("change","#homePage");
	});

	//Displays the details of the selected Employee to View/Edit	
	$(document).on("tap","#emplist li",function(){
				editProfile($(this).attr('id'));
		});
	
	//DOM Loaded Completely
});