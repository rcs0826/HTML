var tc = setInterval(function (){
	timeMessage();    
},100000);
$(document).ready(function(){
	$("#bthtmlexpress").click(function(){
		$("#iframeindex").attr("src","HTML_Express.html");
	});
	$("#btformcreator").click(function(){
		$("#iframeindex").attr("src","formCreate.html");
	});
	$("#btapoioform").click(function(){
		$("#iframeindex").attr("src","Apoio_Form.html");
	});
	$("#btdatasetmanager").click(function(){
		$("#iframeindex").attr("src","datasetManager.html");
	});
	$("#btprefsufx").click(function(){
		$("#iframeindex").attr("src","prefSulf.html");
	});
	$("#btascii").click(function(){
		$("#iframeindex").attr("src","ASCII.html");
	});
	$("#btidentcod").click(function(){
		$("#iframeindex").attr("src","IdentCod.html");
	});
	$("#btmult").click(function(){
		$("#iframeindex").attr("src","index2.html");
	});
	timeMessage();
});
function timeMessage(){
	var today = new Date();
	var hour = today.getHours();
	if(hour < 12){
		RCS.digitalEfect("titleTime",2,"🌞 Bom Dia!");
	}
	else if(hour > 17){
		RCS.digitalEfect("titleTime",2,"🌚 Boa Noite!");
	}
	else{
		RCS.digitalEfect("titleTime",2,"⛅ Boa Tarde!");
	}
}