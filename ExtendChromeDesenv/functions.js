$(document).ready(function(){
	chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, function (tabs) {
    	/***********--Insere os  valores em uma página--*****************************/
	     var cod = 'document.getElementById("username").value = "rogerio.santana";'
	        cod += 'document.getElementById("password").value = "fluig@123";'
	        cod += 'document.getElementById("submitLogin").click();';
	     var codget = "document.getElementById('username').value;";
	     /***********--No 'results' retorna o valor do objeto--*****************************/
	     
		saldo();
		investido();
		lucro();
		regua();
	     
      	 /***************************************************************************/
	 });
});
function regua(){
	var rep = setInterval(function(){
		var id = "#txtRegua";
		var cod = "document.getElementsByClassName('chart-strike_svg')[0].childNodes[0].childNodes[4].innerHTML";
		//cod = "var oi = 3; oi";
		getValue(cod,id);
	},100);
}
function lucro(){
	var id = "#txtLucro";
	var cod = '$(".deals-controller__item.deals-controller__item_flexible.deals-controller__item_baseline > .deals-controller__cash > .amount").html();';
	getValue(cod,id);
}
function investido(){
	var id = "#txtInvestido";
	var cod = '$(".deals-controller__item_invested > .deals-controller__cash > .amount").html();';
	getValue(cod,id);
}
function saldo(){
	var id = "#txtSaldo";
	var cod = '$(".deals-controller__item_balance > .deals-controller__cash > .amount").html();';
	getValue(cod,id);
}


/** Log - FrontEnd **/
function log(msg,dir){
	console.log(msg);
	if(dir != null)
	console.dir(dir);
}


//
function getValue(codget,id){
	var jqurl = "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
	
	chrome.tabs.executeScript( null, {file: "jquery-1.9.1.js"},function(){
		chrome.tabs.executeScript( null, {code: codget},function(results){ $(id).val(results);} );
	});
}