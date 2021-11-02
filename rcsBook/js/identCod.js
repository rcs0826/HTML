var objCab = new Array();
$(document).ready(function(){
	$("#btIden").click(function(){
		var tp = RCS.getValueSelect("slTipoCodi");
		var trat = RCS.getValueSelect("slTrat");
		var ent = $("#txtEntr").val();
		var ret = ent;

		switch(trat){
			case "1":
				ret = ret.trim();
				break;
			case "2":
				ret = RCS.clearWhiteLine("txtEntr");
				break;
			case "3":
				ret = RCS.clearDoubleWhiteLine("txtEntr");
				break;
			case "4":
				ret = ret.replace(/\/\/(.*?)\n/g,"");
				break;
			case "5":
				ret = (RCS.clearWhiteLine("txtEntr")).trim();
				break;
		}

		switch(tp){
			case "1":
				ret = vkbeautify.xml(ret);
				break;
			case "2":
				ret = vkbeautify.json(ret);
				break;
			case "3":
				ret = vkbeautify.css(ret);
				break;
			case "4":
				ret = vkbeautify.sql(ret);
				break;
		}
		$("#txtSaid").val(ret);
	});
	$("#btMini").click(function(){
		var tp = RCS.getValueSelect("slTipoCodi");
		var ent = $("#txtEntr").val();
		var ret = "";

		switch(tp){
			case "1":
				ret = vkbeautify.xmlmin(ent);
				break;
			case "2":
				ret = vkbeautify.jsonmin(ent);
				break;
			case "3":
				ret = vkbeautify.cssmin(ent);
				break;
			case "4":
				ret = vkbeautify.sqlmin(ent);
				break;
		}
		$("#txtSaid").val(ret);
	});
	$("#btLimp").click(function(){
		$("#txtEntr").val("");
		$("#txtSaid").val("");
	});
	$("#btCopi").click(function(){
		RCS.copyClipboard("txtSaid");
	});
	$("#btInsCab").click(function(){
		$("#txtSaid").val(cabecalho($("#txtSaid").val()));
	});
});

/***************************************************************************
* 	Mapeia e inclui o cabeçalho
* *************************************************************************
* 
* @param val: 
* @return Sem retorno;
**************************************************************************/
function cabecalho(val){
	var objCab = new Array();
	var vet = val.split("\n");
	var ret = "";
	var obj = new Object();
	var guia = -1;
	var twith = false;

	for (var i = 0; i < vet.length; i++) {
		if (RCS.contains(vet[i],"function ") || RCS.contains(vet[i],":function")) {
			if(i==0 || !RCS.contains(vet[i-1],"*******/")){
				guia++;
				obj.params = getCabecalho(vet[i]);
				obj.return = false;
				obj.row = i;
				twith = true;

				objCab.push(obj);
				obj = new Object();
			}
		}
		else if(RCS.contains(vet[i],"return ")){
			objCab[guia].return = true;
			twith = false;
		}
	}
	var insert = "";
	for (var i = 0; i < objCab.length; i++) {
		insert = objCab[i].params;
		insert += "* @return";		
		insert += (objCab[i].return)?": \n":" Sem retorno;\n";
		insert += "**************************************************************************/\n";
		vet[objCab[i].row] = insert + vet[objCab[i].row];
	}

	for (var i = 0; i < vet.length; i++) {
		ret += vet[i] + "\r\n";
	}

	return ret;
}
/***************************************************************************
* 	Criador de Cabeçalho
* *************************************************************************
* 
* @param val: Linha com a função;
* @return: Começo do cabeçalho;
**************************************************************************/
function getCabecalho(val){
	var vet = val.split("");
	var ini = 0;
	var fim = 0;
	for (var i = 0; i < vet.length; i++) {
		if (vet[i] == "(") {
			ini = i+1;
		}
		if (vet[i] == ")") {
			fim = i;
		}
	}

	var ret = "/**************************************************************************\n"
            + "* \t\n"
            + "* *************************************************************************\n"
            + "* \n";

	var params = val.substring(ini,fim);
	params = params.split(",");

	if (params != 0) {
		for (var i = 0; i < params.length; i++) {
			ret += "* @param "+(params[i]).trim()+": \n";			
		}
	}
	else{
		ret += "* @param Sem parâmetro;\n" ;
	}
    
    return ret;
}