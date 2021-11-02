var ids = new Array('View','Create','Edit','IES','ICSV');
var qtdRow = 1;
var qtdCol = 0;
var vetValuesTables = new Array();
var vetValues = new Array();
var obj = new Object();

$(document).ready(function(){
	//datasetSelect();
	//menu('IES');
	menu('Create');
	tipoCodigo('Tabela');
});

//================================================================================
//		Cria uma lista com os datasets
//================================================================================
function radioImportExport(vet,idDiv,idObj){
	$("#"+idDiv).html("");
	for(var i=0;i <vet.length; i++){
		$("#"+idDiv).append(createCheckbox(+i,vet[i].datasetId,vet[i].datasetDescription));
	}
};
//================================================================================
//		Cria um input de CheckBox com Bootstrap
//================================================================================
function createCheckbox(name,value,desc){
	var inp = '<div class="col-md-12">'
		inp += '<div class="input-group"> '
		inp += '<span class="input-group-addon"> '
		inp += '<input type="checkbox" id="'+name+'" name="'+name+'" value="'+value+'">'
		inp += '</span> '
		inp += '<label class="form-control">'
		inp += desc
		inp += '</label>'
		inp += '</div>'
		inp += '</div>';
	
	return inp;	
};
//================================================================================
//		Transforma o Código em Tabela  
//================================================================================
function parseTable(cod){	
	vetValues = new Array();
	var line = cod.split(";");
	var col = 0, row = 0;
	var vet = null;
	for(var i=0;i<line.length; i++){
		if(RCS.contains(line[i], "addColumn")){			
			col++;
			obj = new Object();
			obj.id = "titleTable"+col;
			obj.value = line[i].replace('dataset.addColumn(','')
							   .replace('ds.addColumn(','')
			   				   .replace(')','')
			   				   .replace(';','').replace(/('|")/g,"")
							   .replace(/(\r\n|\n|\r|\t)/g,"");
			vetValues.push(obj);
		}
		else if(RCS.contains(line[i], "addRow")){
			row++;
			addRows(1);			
			vet = line[i].split(",");
			for(var x=0; x<vet.length; x++){
				obj = new Object();
				obj.id = "rowTable"+row+"_"+(x+1);
				obj.value = vet[x].replace('dataset.addRow(new Array(','')
								  .replace('ds.addRow(new Array(','')
				   				   .replace('"))','')
				   				   .replace(';','')
				   				   .replace('"','').replace(/('|")/g,"")
								   .replace(/(\r\n|\n|\r|\t)/g,"");
				vetValues.push(obj);
			}
			
		}
	}
	
	RCS.setValueSelect("selAddColums", col);
	qtdRow --;
	
	addColumn(col,false);
	setValuesTable(vetValues);
};
//================================================================================
//		Transforma uma tabela em Código  
//================================================================================
function getCode(idDiv){
	var tabTitle = $("[id^='titleTable']");
	var trRowTable = $("[id^='trRowTable']");
	var bk = "\r\n", tb = "\t";
	var id = "";
	var code = "/*"+bk+$("#nameTable").val()+" - "+$("#idTable").val()+bk+"*/"+bk;
	code += "function createDataset(fields, constraints, sortFields) {"+bk;
	code += tb+"var dataset = DatasetBuilder.newDataset();"+bk+bk;
	
	for(var t=1; t <= qtdCol; t++){
		code += tb+'dataset.addColumn("'+$("#titleTable"+t).val()+'");' +bk;
	}
	code += bk + tb;
	
	for(var x=0; x < trRowTable.length; x++){
		id = trRowTable[x].id.replace("trRowTable","");
		code += 'dataset.addRow(new Array(';
		for(var y=1; y <= qtdCol; y++){		
			code += '"'+$("#rowTable"+id+"_"+y).val()+'"';
			
			if(y != qtdCol){
				code += ",";
			}
		}
		code += '));' +bk + tb;
	}	
	code += bk+tb+"return dataset;"+bk;
	code += "}";
	$("#"+idDiv).val(code);
};
//================================================================================
//		Retorna os valores da Tabela 
//================================================================================
function setValuesTable(vet){
	//console.dir(vet);
	for(var i=0; i<vet.length; i++){
		$("#"+vet[i].id).val(vet[i].value);
	}	
};
//================================================================================
//			Captura os valores da Tabela 
//================================================================================
function getValuesTable(){
	var tabTitle = $("[id^='titleTable']");
	var tabRows = $("[id^='rowTable']");
	vetValuesTables = new Array();
	
	for(var t=0; t < tabTitle.length; t++){
		obj = new Object();
		obj.id = tabTitle[t].id;
		obj.value = tabTitle[t].value;
		vetValuesTables.push(obj);
	}
	
	for(var r=0; r < tabRows.length; r++){
		obj = new Object();
		obj.id = tabRows[r].id;
		obj.value = tabRows[r].value;
		vetValuesTables.push(obj);
	}	
	//vetValuesTables;
};
//================================================================================
//			Esconde as divs
//================================================================================
function tipoCodigo(param){
	$("[Codigo]").hide();
	$("[Tabela]").hide();
	
	$("["+param+"]").show();
};
//================================================================================
//			Adiciona Colunas
//================================================================================
function addColumn(qtd,getVal){	
	$("#divTab").html(col);
	if(qtdCol > parseInt(qtd)){
		if(!confirm("A quantidade de linhas é menor do que o atual, algumas informações irão se perder, aperte 'ok' para confirmar!")){
			RCS.setValueSelect("selAddColums", qtdCol);
			return;
		}
	}
	qtdCol = parseInt(qtd);
	var col = '<table class="table table-striped" id="tempTable" ><tr>';	
	for(var i=1; i <= qtdCol; i++){
		col += '<th><input type="text" placeholder="titleTable'+i+'" value="" id="titleTable'+i+'" class="form-control nameTable" /></th>';
	}	
	col += '</tr></table>';

	if(getVal){
		getValuesTable();
	}
	$("#divTab").html(col);
	addRows(0);
	setValuesTable(vetValuesTables);
};
//================================================================================
//			Adiciona Linhas
//================================================================================
function addRows(qtd){
	var row = '', id=0;
	var looping = (qtd == 0)?parseInt(qtdRow):1;
	var qtdCol = RCS.getValueSelect("selAddColums");
	qtdRow = qtdRow +parseInt(qtd);
	for(var x=1; x <=looping ; x++){
		id = (qtd == 0)?x:qtdRow;
		row += '<tr id="trRowTable'+id+'">';
		for(var i=1; i <= parseInt(qtdCol); i++){
			row += '<td><input type="text" placeholder="rowTable'+id+"_"+ i+'" value="" id="rowTable'+id+"_"+ i+'" class="form-control nameTable" /></td>';
		}	
		row += '</tr>';
	}		
	$("#tempTable").append(row);	
};
//================================================================================
//			Controle do Menu (Abas Croqui)
//================================================================================
function menu(aba) {	
	// Retira a classe 'active' e esconde as divs
	// Obs: vetor 'ids' está declarado
	for (var i = 0; i < ids.length; i++) {
		$('#menu' + ids[i]).removeClass('active');
		$('[' + ids[i] + ']').fadeOut();
	}
	// Adiciona a classe 'active' e mostra a div selecionada
	$('#menu' + aba).addClass('active');
	$('[' + aba + ']').fadeIn('slow');
};

//================================================================================
//			Esconde ou mostra o objeto
//================================================================================
function hide(id, val) {
	if (val) {
		$("." + id).hide();
	} else {
		$("." + id).show();
	}
};

//================================================================================
//			Limpa a div tabela e a textarea código
//================================================================================
function clearCT(){
	 qtdRow = 1;
	 qtdCol = 0;
	 $("#divTab").html("");
	 $("#txtCodigo").val("");
	 $("#idTable").val("");
	 $("#nameTable").val("");
	 RCS.setValueSelect("selAddColums",0);
	 RCS.setValueSelect("selDataset","");
};

//================================================================================
function xmlToObj(xml){
	ds2 = new Array();
	obj = new Object(xml);
	objTemp = new Object();
	var objXML = obj.childNodes[0].childNodes[0].childNodes[0].childNodes[0];
	var cont = objXML.childNodes.length;
	console.info("len: "+objXML.childNodes.length);
	console.dir(objXML);
	
	for(var i=0; i < cont; i++){
		if(objXML.childNodes[i].childNodes[4].innerHTML == "CUSTOM"){
			objTemp = new Object();
			objTemp.datasetId = objXML.childNodes[i].childNodes[1].innerHTML;
			objTemp.datasetDescription = objXML.childNodes[i].childNodes[1].innerHTML;
			ds2.push(objTemp);
		}
	}
	
	radioImportExport(ds2,"divOutro","cbOutro");
};
//================================================================================
//		Trancforma Arquivo Texto para Tabela
//================================================================================
function textToCSV(){	
	var csv = $("#txtCSV").val();
	if(csv.trim() != ""){
		clearCT();
		var delCol = $("#txtDelCol").val();
		var delLin = $("#txtDelLin").val();
		var regex = new RegExp(delLin); 
		var line = csv.split(regex);
		var col,title;

		regex = new RegExp(delCol); 
		vetValuesTables = new Array();
		qtdRow = line.length;
		console.info("qtdRow: "+qtdRow);
		
		for(var x=0; x<line.length; x++){
			col = (line[x]).split(regex);
			qtdCol = col.length;
			console.info("qtdCol: "+qtdCol);
			for(var y=0; y<col.length; y++){
				obj = new Object();
				title = (x == 0)?("titleTable"+(y+1)):"rowTable"+x+"_"+(y+1);
	
				obj.id = title;
				obj.value = col[y];
				vetValuesTables.push(obj);
			}
		}		
		qtdRow--;				
		RCS.setValueSelect("selAddColums",qtdCol);
		addColumn(qtdCol,false);
		menu('Create');		
	}
};
//================================================================================
//		Verifica se existe um dataset customisado no vetor
//================================================================================
function existDataset(nameDS){
	for(var i=0; i< ds.length; i++){
		if(nameDS == ds[i].datasetId){
			return true;
		}
	}
	return false;
};

	/*******************************************************************************
	 * Lê o arquivo CSV (que está em  memória do input="file") 
	 * 1) Cria uma tabela em HTML;
	 * 2) Cria um objeto com o resultado; (Matriz de array) 
	 * -------------------------------------------------------
	 * 
	 * @parameter Sem Parâmetros;
	 * @return Sem Retorno;
	 ******************************************************************************/
	function upload() {
		$("#txtCSV").html("");
		//exportUser.vetArray = new Array();
		//var title = [ "Filial","Matricula","Login","Senha","Nome Completo", "Email" ];
		var fileUpload = document.getElementById("arqCsvFile");
		var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;

		if (regex.test(fileUpload.value.toLowerCase())) {
			if (typeof (FileReader) != "undefined") {
				var reader = new FileReader();
				reader.onload = function(e) {
					var nameFile = fileUpload.value.split("\\");
					nameFile = (nameFile[nameFile.length-1]).replace(".csv","");

					$("#txtCSV").html(e.target.result);
					textToCSV();
					document.getElementById("idTable").value = nameFile.toLowerCase();
					document.getElementById("nameTable").value = nameFile;
					WebService.createDS();
				}
				reader.readAsText(fileUpload.files[0]);
			} else {
				alert("Atenção\r\nSeu navegador não suporta HTML5.");
			}
		} 
		else {
			alert("Atenção", "CSV inválido.");
		}
	}