var cred = new Object();
	cred.companyId = 1;
	cred.username = "rogerio.santana";
	cred.password = "fluig@123";
	
var url = "/webdesk/ECMDatasetService";
var ds = new Array();
var ds2 = new Array();
var objTemp,infoDataset = new Object();
var HelloWorld = {
    message: null,

    init: function () {
    	this.datasetSelect();
    	menu('IES');
    	tipoCodigo('Tabela');
    },

    bindings: {
        local: {
            'show-message': ['click_showMessage']
        }
    },

    showMessage: function () {
        $div = $('#helloMessage_' + this.instanceId);
        $message = $('<div>').addClass('message').append(this.message);
        $div.append($message);
    },
    datasetSelect: function(){
    	var sel = '<option value=""></option>';
    	$.get(	 '/ecm/api/rest/ecm/dataset/list'//'/ecm/api/rest/ecm/dataset/getDatasets'
    		     , {}            
    		     , function(res) { 
    		    	 setTimeout(function(){
    		    	 for(var i=0; i<res.content.length; i++){
    		    		 if(res.content[i].type == "CUSTOM"){
    		    			 sel += '<option value="'+res.content[i].datasetId+'">'+res.content[i].datasetDescription+'</option>';
    		    				    			 
    		    			 objTemp = new Object();
    		    			 objTemp.datasetId = res.content[i].datasetId;
    		    			 objTemp.datasetDescription = res.content[i].datasetDescription;
    		    			 objTemp.datasetImpl = res.content[i].datasetImpl;
    		    			 objTemp.datasetBuilder = res.content[i].datasetBuilder;
    		    			 
    		    			 ds.push(objTemp);
    		    		 }
    		    	 }		    	 
    		    	 $("#selDataset").html(sel);
    		    		radioImportExport(ds,"divAtual","cbAtual");
    		     	},1000);
    		     }
    		     ,"JSON"  
    		 );
    }
};
var ECMDatasetService = {
		loadDataset:function(name){ 
			var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dataservice.ecm.technology.totvs.com/">'
					+ '<soapenv:Header/>'
					+ '<soapenv:Body>'
					+ '<ws:loadDataset>'
					+ '<companyId>'+cred.companyId+'</companyId>'
					+ '<username>'+cred.username+'</username>'
					+ '<password>'+cred.password+'</password>'
					+ '<name>'+name+'</name>'
					+ '</ws:loadDataset>'
					+ '</soapenv:Body>'
					+ '</soapenv:Envelope>';
			
			return xml;
		},
		listDataset:function(companyId,username,password){
			var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dataservice.ecm.technology.totvs.com/">'
				    + '<soapenv:Header/>'
				    + '<soapenv:Body>'
				    + '<ws:findAllFormulariesDatasets>'
				    + '<companyId>'+companyId+'</companyId>'
				    + '<username>'+username+'</username>'
				    + '<password>'+password+'</password>'
				    + '</ws:findAllFormulariesDatasets>'
				    + '</soapenv:Body>'
				    + '</soapenv:Envelope>';
			
			return xml;
		},
		updateDataset:function(name,description,impl){
			var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dataservice.ecm.technology.totvs.com/">'
				+ '<soapenv:Header/>'
				+ '<soapenv:Body>'
				+ '<ws:updateDataset>'
				+ '<companyId>'+cred.companyId+'</companyId>'
				+ '<username>'+cred.username+'</username>'
				+ '<password>'+cred.password+'</password>'
				+ '<name>'+name+'</name>'
				+ '<description>'+description+'</description>'
				+ '<impl>'+impl+'</impl>'
				+ '</ws:updateDataset>'
				+ '</soapenv:Body>'
				+ '</soapenv:Envelope>';
			
			return xml;
		},
		createDataset:function(name,description,impl){
			var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dataservice.ecm.technology.totvs.com/">'
				+ '<soapenv:Header/>'
				+ '<soapenv:Body>'
				+ '<ws:addDataset>'
				+ '<companyId>'+cred.companyId+'</companyId>'
				+ '<username>'+cred.username+'</username>'
				+ '<password>'+cred.password+'</password>'
				+ '<name>'+name+'</name>'
				+ '<description>'+description+'</description>'
				+ '<impl>'+impl+'</impl>'
				+ '</ws:addDataset>'
				+ '</soapenv:Body>'
				+ '</soapenv:Envelope>';
			
			return xml;
		},
		deleteDataset:function(name){
			var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ws="http://ws.dataservice.ecm.technology.totvs.com/">'
				+ '<soapenv:Header/>'
				+ '<soapenv:Body>'
				+ '<ws:deleteDataset>'
				+ '<companyId>'+cred.companyId+'</companyId>'
				+ '<username>'+cred.username+'</username>'
				+ '<password>'+cred.password+'</password>'
				+ '<name>'+name+'</name>'
				+ '</ws:deleteDataset>'
				+ '</soapenv:Body>'
				+ '</soapenv:Envelope>';
			
			return xml;
		}
};


// Traz os codigos de um dataset
function getCodDataset(val){
	qtdRow = 1;
	qtdCol = 0;
	for(var i=0; i<ds.length; i++){
		if(val == ds[i].datasetId){
			$("#txtCodigo").val(ds[i].datasetImpl);
			infoDataset.datasetId = ds[i].datasetId;
			infoDataset.datasetDescription = ds[i].datasetDescription;
			infoDataset.datasetImpl = ds[i].datasetImpl;
			infoDataset.datasetBuilder = ds[i].datasetBuilder;

			$("#idTable").val(infoDataset.datasetId);
			$("#nameTable").val(infoDataset.datasetDescription);
			parseTable(infoDataset.datasetImpl);
			WebService.getTabDataset(val);
			return;
		}
	}
	$("#txtCodigo").val("");
};
var WebService = {
	// Acão de carregar o dataset
	loadDS:function(){
		post(url
		   , ECMDatasetService.loadDataset(RCS.getValueSelect("selDataset"))
		   , function(param){$("#txtCodigo").val(param.childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[2].innerHTML)});
	},
	listDS:function(){
		post($("#txtURL").val()+url
			 , ECMDatasetService.listDataset(1, $("#txtLogin").val(), $("#txtSenha").val())
			 , function(param){xmlToObj(param);});
	},
	//Acão de atualizar o dataset
	updateDS:function(){
		if(RCS.getValueSelect("selType") == "Tabela"){
			getCode("txtCodigo");
		}		
		post(url
		   , ECMDatasetService.updateDataset(RCS.getValueSelect("selDataset"),$("#nameTable").val(),$("#txtCodigo").val())
		   , "");
		//alert("Update do dataset " + RCS.getValueSelect("selDataset"));
		RCS.info("divMSG", "Update do dataset " + RCS.getValueSelect("selDataset"), "sucess");
	},
	// Acão de carregar o dataset
	deleteDS:function(){
		if(!confirm("Deseja realmente excluir esse dataset?, aperte 'ok' para confirmar!")){
			return;
		}
		post(url
		   , ECMDatasetService.deleteDataset(RCS.getValueSelect("selDataset"))
		   , function(x){RCS.setValueSelect("selDataset","");});
		$("#txtCodigo").val("");
		//alert("Deletado o dataset " + RCS.getValueSelect("selDataset"));
		RCS.info("divMSG", ("Deletado o dataset " + RCS.getValueSelect("selDataset")), "sucess");
		datasetSelect();
	},
	//Acão de criar um dataset
	createDS:function(){
		if(RCS.getValueSelect("selType") == "Tabela"){
			getCode("txtCodigo");
		}	
		
		if($("#idTable").val().trim() == ""){
			RCS.info("divMSG","Preencha o campo ID da tabela","erro");
		}
		else if($("#nameTable").val().trim() == ""){
			RCS.info("divMSG","Preencha o campo Nome da tabela","erro");
		}
		else if($("#txtCodigo").val().trim() == ""){
			RCS.info("divMSG","Crie uma tabela para enviar","erro");
		}
		else if(existDataset($("#idTable").val().trim())){
			RCS.info("divMSG","Já existe um dataset com este código","erro");
		}
		else{			
			post(url
			   , ECMDatasetService.createDataset($("#idTable").val(),$("#nameTable").val(),$("#txtCodigo").val())
			   , function(param){datasetSelect();});	

			//alert("Dataset " + $("#nameTable").val() + " criado");
			RCS.info("divMSG",("Dataset " + $("#nameTable").val() + " criado"), "sucess");
		}
	},
	//=================================================
    //	Traz  os dados de um dataset
    //=================================================
    getTabDataset: function(nameDataset){
    	//alert('getTabDataset');
    	var option;
    	// Objeto do Post
    	var param = new Object();
    	// Constraint
    	var cons = new Array();
    	// Objeto do Constraint
    	var conObj = new Object();	
    	conObj._field = "sqlLimit";
    	conObj._initialValue = "500";
    	conObj._finalValue = "500";
    	conObj._type = 1;
    	cons.push(conObj);

    	param.name = RCS.getValueSelect("selDataset");
    	param.fields = [];
    	param.constraints = cons;
    	param.order = null;
    	var ds,html,like="";
    	$.ajax({
    			type : "POST",
    			url : '/ecm/api/rest/ecm/dataset/datasetsListForm/',
    			contentType : "application/json",
    			dataType : "JSON",
    			data : JSON.stringify(param),	
    			success : function(res) {
    				ds=res;
    				//alert("ds.values.length: "+ds.values.length);
    				if(ds.values.length == 0){
    					$("#divTabView").html("<center><h1><hr />Não há dados<hr /></h1></center>");
    					return;
    				}
    				else{
    					html = "<table class='table table-striped'>";
    					html += "<tr>";
    					html += "<th>nRow</th>";
    					// Cria as colunas
    		    		for(var y=0;y<ds.columns.length;y++){
    		    			like = ds.columns[y];
    		    			if(like.indexOf("metadata#") == -1){
    		    				html += "<th>"+ds.columns[y]+"</th>";
    		    			}
    		    		}
    		    		html += "</tr>";
    		    		
    		    		// Cria as  linhas
    					for(var i =0;i<ds.values.length;i++){
    						html += "<tr>";
    						html += "<th>"+ (i+1) +"</th>";
    						for(var x=0;x<ds.columns.length;x++){
    							like = ds.columns[x];
        		    			if(like.indexOf("metadata#") == -1){
        		    				html += '<td>' + ds.values[i][ds.columns[x]]+ '</td>';
        		    			}
    						}  
        					html += "</tr>";  		    			
    		    		}
    					html += "</table>"; 
    					$("#divTabView").html(html);
    		    	}
    			},
    			erro : function(res) {
    				alert("Erro");
    				return;
    			}
    	});
    	//======================================
    }
}

// Evento POST
function post(urlpost,xml,func){
	//console.info(xml);
	var info = "urlpost: "
			 + urlpost
			 + "\r\nxml: "
			 + xml
			 + "\r\nfunc: "
			 + func.toString();
	console.info(info);
	$.ajax({
		type:"POST",
		url:urlpost,
		contentType:"text/xml; charset=\"ISO-8859-15\"",
		dataType:"xml",
		data:xml,	
		success:function(res) {
			//console.info("OK");
			if(func != "" && func != null && typeof(func) == "function"){
				func(res);
			} 
			//console.dir(res);
		},
		erro:function(res) {
			if(func != "" && func != null && typeof(func) == "function"){
				func("Erro: " + res);
			}
		}
	});
};
