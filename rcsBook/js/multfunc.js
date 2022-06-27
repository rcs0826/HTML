var objCab = new Array();
$(document).ready(function(){	
	$("#btGetColCSV").click(function(){		
		let ini = $("#txtPref").val();
		ini = (ini.trim() == "")?0:parseInt(ini);
		let entrada = $("#txtEntr").val();
		entrada = entrada.split("\n");
		let vet;
		let saida = "";
		try{
			for (var i = 0; i < entrada.length; i++) {
				vet = (entrada[i]).toString().split(";");
				saida += vet[ini];
				if (i < entrada.length) {
					saida += "\n";
				}
			}
		}
		catch(e){
			alert(e.message);
		}
		$("#txtSaid").val(saida);
	});
	$("#btTagHtml").click(function(){
		let entrada = $("#txtEntr").val();
		let saida = entrada.replace(/<[^>]*>/g,"");
		saida = RCS.clearWhiteLine(saida);

		let vet = saida.split('\n');
		let text = "";
		for (var i = 0; i < vet.length; i++) {
			if ((vet[i]).trim() != "\n") {				
				text += (vet[i]).trim();
				if (i < vet.length) {
					text += '\n';
				}	
			}
		}
		$("#txtSaid").val(text);
	});
	$("[btIden]").click(function(){
		var tp = this.getAttribute("tipo");
		var ent = $("#txtEntr").val();
		var ret = ent;
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
		$("#txtSaid").val(cabecalho($("#txtEntr").val()));
	});
	$("#btClassCS").click(function(){
		classCS();
	});
	$("#btClassCSS").click(function(){
		classCSS();
	});	
	$("#btReplace").click(function(){
		console.info("btReplace");
		let ini = $("#txtPref").val();
		let fim = $("#txtSulf").val();
		let entrada = $("#txtEntr").val();
		let saida = entrada.replaceAll(ini,fim)		
		$("#txtSaid").val(saida);				
	});
	$("#btSustring").click(function(){
		let ini = $("#txtPref").val();
		let fim = $("#txtSulf").val();
		let entrada = $("#txtEntr").val();
		let vet = entrada.split("\n");
		let saida = "";

		for (var i = 0; i < vet.length; i++) {
			ini = (ini.trim() != "")?ini:"0";
			fim = (fim.trim() != "")?fim:((vet[i]).toString().length);
			saida += (vet[i]).substring(parseInt(ini), parseInt(fim));
			if(i < vet.length){
				saida += "\n";
			}
		}
		$("#txtSaid").val(saida);		
	});
	$("#btRetNum").click(function(){
		let entrada = $("#txtEntr").val();
		let saida = entrada.replace(/\d+/g, "");
		$("#txtSaid").val(saida);		
	});
	$("#btTrim2").click(function(){
		let entrada = $("#txtEntr").val();
		let saida = entrada.replace(/ /g,"");		
		$("#txtSaid").val(saida);		
	});
	$("#btZeroEsc").click(function(){
		let entrada = $("#txtEntr").val();
		entrada = entrada.replace(/ /g,"§");
		let vet = entrada.split("\n");
		let saida = "";
		let vet2;
				
		for (let i = 0; i < vet.length; i++) {
			vet2 = (vet[i]).split("§");		
			
			for (let x = 0; x < vet2.length; x++) {
				saida += RCS.retZeroEsq(vet2[x]);	

				if(x < vet2.length){
					saida += " ";
				}
			}
			if(i < vet.length){
				saida += "\n";
			}
		}
		$("#txtSaid").val(saida);
	});

	$("[funccase]").click(function(){
		let val = this.getAttribute("funccase");
		let entrada = $("#txtEntr").val();
		let saida = "";
		let t = true;

		switch(val){
			case "u":
				saida = entrada.toUpperCase();
				break;
			case "l":
				saida = entrada.toLowerCase();
				break;
			case "f":
				for (var i = 0; i < entrada.length; i++) {
					if(t){
						saida += (entrada[i]).toUpperCase();
						t = false;
					}
					else{
						saida += (entrada[i]).toLowerCase();
						t = (entrada[i] == " " || entrada[i] == "\n")?true:false;
					}					
				}
				break;
		}
		$("#txtSaid").val(saida);
	});

	$("#btTxtHtml").click(function(){
		$("#txtSaid").val(RCS.textHtml("txtEntr"));
	});
	$("#btRetDup").click(function(){
		retDuplicidade();
	});

    $("[btCopi]").click(function(){
        RCS.copyClipboard("txtSaid");
    });

	$("#btReorg").click(function(){	
		reorganisar();
	});	

	$("#btRetDupReorg").click(function(){
		retDuplReorg();
	});

	$("#btInv").click(function(){		
		let entrada = $("#txtEntr").val();
		let saida = $("#txtSaid").val();
		$("#txtEntr").val(saida);
		$("#txtSaid").val(entrada);		
	});
	$("#btRetLinEmp").click(function(){
    	var txtEntr = $("#txtEntr").val();
    	txtEntr = RCS.clearWhiteLine(txtEntr);
    	$("#txtSaid").val(txtEntr); 
	});
	$("#btRetLinRed").click(function(){
    	var txtEntr = $("#txtEntr").val();
		txtEntr = RCS.clearDoubleWhiteLine(txtEntr);
    	$("#txtSaid").val(txtEntr); 
	});
	$("#btRetCom").click(function(){
    	var txtEntr = $("#txtEntr").val();
		txtEntr = txtEntr.replace(/\/\/(.*?)\n/g,"");
    	$("#txtSaid").val(txtEntr); 
	});
	$("#btTrim").click(function(){	
		textareaTrim();
	});	
	$("#btTrimLimEmp").click(function(){	
    	var txtEntr = $("#txtEntr").val();
    	txtEntr = RCS.clearWhiteLine(txtEntr);
		let vet = txtEntr.split('\n');
		let text = "";
		for (var i = 0; i < vet.length; i++) {			
			text += (vet[i]).trim() + '\n';
		}
		$("#txtSaid").val(text);
	});
    $("#btCopi","[btCopi]").click(function(){
        RCS.copyClipboard("txtSaid");
    });
    $("[limpent]").click(function(){
    	$("#txtEntr").val("");    	
    });
    $("#btLimpTudo").click(function(){
    	$("#txtPref").val("");
    	$("#txtSulf").val("");
    	$("#txtEntr").val("");
    	$("#txtSaid").val("");
    });
    $("#btProc").click(function(){
        var txtEntr = $("#txtEntr").val();
        var txtPref = $("#txtPref").val();
        var vet = txtEntr.split("\n"); 
        var ret = "";
        for (var i = 0; i < vet.length; i++) {
            if(RCS.contains(vet[i],txtPref)){
                ret += (i+1) + ": "+ (vet[i]).trim() + "\n";
            }
        }
        $("#txtSaid").val(ret);
    });
    $("#btSubs").click(function(){
    	var txtEntr = $("#txtEntr").val();
    	var txtPref = $("#txtPref").val();
    	var txtSulf = $("#txtSulf").val();
    	var ret = "";
    	var retp = "";
    	var txtSaid = "";
        var vet = txtEntr.split("\n");

    	for (var i = 0; i < vet.length; i++) {
            ret = vet[i];
    		retp = ret.replaceAll("{rep}","").replaceAll("{num}","");
    		ret = ret.replaceAll("{rep}",retp).replaceAll("{num}",(i+1));    		
    		txtSaid += txtPref.replaceAll("{rep}",retp).replaceAll("{num}",(i+1)) 
    				+ ret 
    				+ txtSulf.replaceAll("{rep}",retp).replaceAll("{num}",(i+1)) 
    				+ "\n";
    	}

    	$("#txtSaid").val(txtSaid);    	
    });
    $("#btCtI").click(function(){         
        $("#txtSaid").val(RCS.csvTOinsert($("#txtPref").val(),$("#txtEntr").val()));     
    });
});
function textareaTrim(){		
	let entrada = $("#txtEntr").val();
	let vet = entrada.split('\n');
	let text = "";
	for (var i = 0; i < vet.length; i++) {			
		text += (vet[i]).trim() + '\n';
	}
	$("#txtSaid").val(text);	
}
function retDuplReorg(){
	let vetDupli = new Array();
	let entrada = $("#txtEntr").val();
	let vet = entrada.split('\n');
	let text = "";
	RCS.vetReorg(vet);
	for (var i = 0; i < vet.length; i++) {			
		if(!RCS.containsVet(vetDupli, vet[i])){
			vetDupli.push(vet[i]);
		}
	}
	for (var i = 0; i < vetDupli.length; i++) {			
		text += vetDupli[i] + '\n';
	}
	
	$("#txtSaid").val(text);
}
function retDuplicidade(){
		let vetDupli = new Array();
		let entrada = $("#txtEntr").val();
		let vet = entrada.split('\n');
		let text = "";
		for (var i = 0; i < vet.length; i++) {			
			if(!RCS.containsVet(vetDupli, vet[i])){
				vetDupli.push(vet[i]);
			}
		}
		for (var i = 0; i < vetDupli.length; i++) {			
			text += vetDupli[i] + '\n';
		}
		$("#txtSaid").val(text);	
}
function reorganisar(){	
	let entrada = $("#txtEntr").val();
	let vet = entrada.split('\n');
	let text = "";
	RCS.vetReorg(vet);		
	for (var i = 0; i < vet.length; i++) {			
		text += vet[i] + '\n';
	}
	$("#txtSaid").val(text);		
}
function classCS(){
	let entrada = $("#txtEntr").val();
    let tp = "public int {class} { get; set; }";
    let result = "";
    let t = true;
    let saida = "";

	for (var i = 0; i < entrada.length; i++) {
		if(t){
			saida += (entrada[i]).toUpperCase();
			t = false;
		}
		else{
			saida += (entrada[i]).toLowerCase();
			t = (entrada[i] == " " || entrada[i] == "\n")?true:false;
		}					
	}
	saida = saida.replaceAll(" ","");
	let vet = saida.split('\n');
        
    for (var i = 0; i < vet.length; i++) {
    	result += tp.replace("{class}", vet[i]);
    	if (i<vet.length) {
    		result += "\n";
    	}
    }

    $("#txtSaid").val(result);
}
function classCSS(){
	let entrada = $("#txtEntr").val();
	let tp1 = "private string _{classLC} = string.Empty;";
    let tp2 = "public string {classFP}\n"
            + "{\n"
            + "   get { return _{classLC}; }\n"
            + "   set{ _{classLC} = value.Trim(); }\n"
            + "}";
    let result1 = "";
    let result2 = "";
    let t = true;
    let saida = "";

	for (var i = 0; i < entrada.length; i++) {
		if(t){
			saida += (entrada[i]).toUpperCase();
			t = false;
		}
		else{
			saida += (entrada[i]).toLowerCase();
			t = (entrada[i] == " " || entrada[i] == "\n")?true:false;
		}					
	}
	saida = saida.replaceAll(" ","");
	let vet = saida.split('\n');
        
    for (var i = 0; i < vet.length; i++) {
    	result1 += tp1.replaceAll("{classLC}", (vet[i]).toLowerCase());
    	result2 += tp2.replaceAll("{classLC}", (vet[i]).toLowerCase()).replace("{classFP}", vet[i]);
    	if (i<vet.length) {
    		result1 += "\n";
    		result2 += "\n";
    	}
    }

    $("#txtSaid").val(result1+result2);
}
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
		if ((RCS.contains(vet[i],"function ") || RCS.contains(vet[i],":function")) && (!RCS.contains(vet[i],"success:") && !RCS.contains(vet[i],"error:")) ) {
			if(i==0 || !RCS.contains(vet[i-1],"*******/")){
			    //objCab[guia].return = false;
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
		insert += (objCab[i].return)?": ;\n":" Sem retorno;\n";
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
			ret += "* @param "+(params[i]).trim()+": ;\n";			
		}
	}
	else{
		ret += "* @param Sem parâmetro;\n" ;
	}
    
    return ret;
}

    