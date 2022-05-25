$(document).ready(function(){
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