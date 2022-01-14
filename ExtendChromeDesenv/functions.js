$(document).ready(function(){
	chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, function (tabs) {
		//$("#head").attr('src',getUrl(tabs[0].url)+'/webdesk/vcXMLRPC.js');
		var cod = '$("#logged-user-name").html();';
		getValue(cod,"#infoUser","html");		
            
	     /*Atalhos*/
	     $("#btPesq").click(function(){
	     	var id = document.getElementById("txtInstance").value;
			goLink("ProcessInstanceID",id);	     	
	     });
	     $("#btDSync").click(function(){
	     	var ds = ($("#txtDataset").val() == "")?RCS.getValueSelect("dataset"):$("#txtDataset").val();
			goLink("DsSync",ds);
	     });
	     $("#btBP").click(function(){goLink("pageProcessPes","X");});
	     $("#btUsu").click(function(){goLink("pageUsu","X");});
		 $("#btGrp").click(function(){goLink("pageGrp","X");});
		 $("#btRol").click(function(){goLink("pageRol","X");});
		 $("#btApp").click(function(){goLink("pageApp","X");});
		 $("#btAPI").click(function(){goLink("pageAPI","X");});
		 $("#btWSDL").click(function(){goLink("pageWSDL","X");});	     
	     $("#btLog").click(function(){goLink("Log","X");});

	     $("#dsPage").click(function(){});
	     /* Importador em Massa*/
	     $("#btGrup").click(function(){importador(this.id);});
	     $("#btPape").click(function(){importador(this.id);});
	     $("#btLimp").click(function(){$("#txtCodiDesc").val(""); });

	     /* Dataset View */
    	 var that = WDataset;  	
         $('#dataset').on('change',function(){
         	that.getTabDat();
         });
         $('#btPesqDat').on('click',function(){
         	that.getTabDat();
         });
         $('#btAddFil').on('click',function(){
         	that.setFilter();
         });
         $('#Limpar').on('click',function(){
         	that.clearFilter();
         });
         $('#btDSincronizar').on('click',function(){
         	that.datasetSync();
         });
         $('#btDownloadCSV').on('click',function(){
         	that.downloadCSV();
         });
         $('#code').on('click',function(){
         	that.code();
         });    
	     that.init();
	 });
});

function importador(id){
	alert(id);
	let txt = $("#txtCodiDesc").val();
	let row = txt.split("\n");
	try{
		for (var i = 0; i < row.length; i++) {		
			let col = (row[i]).split(";");
			if (col.length == 2) {
				if(id == "btGrup"){
					FLUIG.groupCreate(col[0],col[1]);
				}
				else{
					FLUIG.roleCreate(col[0],col[1]);
				}
			}
		}
		alert("Cadastrado efetuado");
	}
	catch(e){
		throw e.message;
	}
}
/**************************************************************************
* 	Abre uma nova aba no workFlow
* *************************************************************************
* 
* @param Sem parâmetro;
* @return Sem retorno;
**************************************************************************/
function goLink(link,param){
	var url = "";
	var typeUrl = 1;
	
	if(param.trim() != ""){
		switch(link){
			case "ProcessInstanceID": url = "/pageworkflowview?app_ecm_workflowview_detailsProcessInstanceID="+param; break;
			case "DsSync": url = "/datasetsync?datasetId="+param; break;
			case "pageUsu": url = "/wcmuserpage"; break;
			case "pageGrp": url = "/wcmgrouppage"; break;
			case "pageRol": url = "/wcmrolepage"; break;
			case "pageApp": url = "/applicationcenter"; break;
			case "pageProcessPes": url = "/pageprocesssearch"; break;	
			case "pageAPI": url = "/api"; typeUrl=0; break;
			case "pageWSDL": url = "/services"; typeUrl=0; break;
			case "Log": url = "/portal/api/rest/wcm/service/userlog/downloadServerLog"; typeUrl=0; break;
		}
		chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
			url = getUrl(typeUrl,tabs[0].url) + url;
			window.open(url);
		});
	}
}

/**************************************************************************
* 	Faz Download do log Completo
* *************************************************************************
* 
* @param Sem parâmetro;
* @return Sem retorno;
**************************************************************************/
function getLog(){
	chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
		var url = getUrl(tabs[0].url)+"/portal/api/rest/wcm/service/userlog/downloadServerLog";
		window.open(url);
	});
}

/**************************************************************************
* 	Captura o Host de uma URL
* *************************************************************************
* 
* @param url: Endereço do site;
* @return: host;
**************************************************************************/
function getUrl(type,url){	
	var vet = url.split("/");
	if(type == 0){
		return vet[0] +"//"+vet[2];
	}
	else{
		return vet[0] +"//"+vet[2]+"/"+vet[3]+"/"+vet[4]+"/"+vet[5];
	}
}	

/// Lixo
/*
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
*/



//
function getValue(codget,id,tp){
	var jqurl = "https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js";
	
	chrome.tabs.executeScript( null, {file: "jquery-1.9.1.js"},function(){
		chrome.tabs.executeScript( null, {code: codget},function(results){ 
			if (tp == "html") {
				$(id).html(results);
			} else {
				$(id).val(results);
			}			
		});
	});
}
var WDataset = {
// Variáveis da widget    
    editMode: false,
    viewMode: false,
    message: null,

    init: function () {
    	this.getDataset(); 
    },

    bindings: {
        local: {
        	// Instancia as funções
            'getTabDat':['change_getTabDat'],
            'getTabDatPesq':['clickgetTabDat'],
            'setFilter':['clicksetFilter'],
            'clearFilter':['clickclearFilter'],
            'datasetSync':['clickdatasetSync'],
            'downloadCSV':['clickdownloadCSV'],
            'code':['clickcode']    
        }
    },
    code:function(){
        var ds = ($("#txtDataset").val() == "")?RCS.getValueSelect("dataset"):$("#txtDataset").val();
        var filter = $("[filterDS]");
        var cod = 'var c = new Array();\n';
         
        for(var i = 0; i < filter.length; i++) {
            cod += 'c.push(DatasetFactory.createConstraint("'
            cod += filter[i].value.split(";")[0]
            cod += '","'
            cod += filter[i].value.split(";")[1]
            cod += '","'
            cod += filter[i].value.split(";")[1]
            cod += '",ConstraintType.'+filter[i].value.split(";")[2]+'));\n';
        }
        cod += 'var ds = DatasetFactory.getDataset("'+ds+'",null,c,null);\n\n';
        cod += 'for (var i = 0; i < ds.values.length; i++) {\n';
        cod += '    ds.values[i];\n';
        cod += '}\n';
        cod += 'for (var i = 0; i < ds.rowsCount; i++) {\n';
        cod += '    ds.getValue(i,"");\n';
        cod += '}';
        
        $("#tempClipboard").val(cod);
        RCS.copyClipboard("tempClipboard");
        alert("Código do Dataset copiado para a área de transferência");
    },
    // Traz o Dataset em Tabela
    getTabDat:function(){
    	var ds = ($("#txtDataset").val() == "")?RCS.getValueSelect("dataset"):$("#txtDataset").val();
    	this.getTabDataset(ds);
    },
    clearFilter:function(){
    	$("#txtListFilt").html("");
    	$("#txtColuFilt").val("");
    	$("#txtDataset").val("");
    	RCS.setValueChecked("cbLike","");
    },
    getAutoDestroy:function(){
    	$("[filterds]").click(function(){
    		this.remove();
    	});
    },
    setFilter:function(){
    	 var col = ($("#txtColuFilt").val() == "")?RCS.getValueSelect("slColuFilt"):$("#txtColuFilt").val();
    	 var val =  $("#txtListFilt").html()
	         +"<input type='button' class='btn btn-success' filterDS value='"
	         + col +";"+$("#txtValoPesq").val()+";"+RCS.getValueSelect("slTipoCons")+";"+$("#cbLike").is(":checked")
	         +"'>";
		  $("#txtListFilt").html(val);
		  $("#txtValoPesq").val("");
		  $("#txtColuFilt").val("");
		  this.getAutoDestroy();
    },
    /***************************************************************************
     * Cria uma Contraint simple de Dataset
     * *************************************************************************
     * 
     * @param col: Nome do filtro;
     * @param val: Valor do filtro;
     * @return Objeto constraint;
     **************************************************************************/
    getSimpleConstraint:function(col,val,type,like){
    	var codtype;
    	
    	switch(type){
    		case "MUST":
    			codtype = 1;
    			break;
    		case "MUST_NOT":
    			codtype = 2;
    			break;
    		case "SHOULD":
    			codtype = 3;
    			break;
    		default:
    			codtype = 1;
    			break;
    	}
    	
    	if(like == "true"){
    		val = "%"+val+"%";
    	}

    	var conObj = new Object();	
    	conObj._field = col;
    	conObj._initialValue = val;
    	conObj._finalValue = val;
    	conObj._type = codtype;
    	conObj._likeSearch = (like == "true");
    	
      	return conObj;// (DatasetFactory.createConstraint(col, val, val, codtype,(like == "true")));
    },
    dsSearch:function(){
    	this.getTabDataset($("#datasetSearch").val());
    },
    downloadCSV:function(){
    	RCS.htmlTableToCSV(RCS.getDescSelect("dataset") + ".csv", "tableResultDataset");
    },    

    /***************************************************************************
     * Convert o Dataset Json em HTML (Table)
     * *************************************************************************
     * 
     * @param ds: Dataset
     * @param selector: Seletor da div (Ex: #result)
     * @param callback: Função a ser efetuada após o processo (Pode ser nulo)
     * @return Sem Retorno
     **************************************************************************/
    parseDSforHTML:function(ds,selector,callback) {
        if(ds.values.length == 0){
            $(selector).html("<center><h1><hr />Não há dados<hr /></h1></center>");
            return;
        }
        else{
            html = "<table id='tableResultDataset' class='table table-striped'>";
            html += "<tr>";
            html += "<th></th>";
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
            $(selector).html(html);
            
            if(callback != null && callback != undefined){
                callback();
            }
        }
    },
    //=================================================
    //	Traz  os dados de um dataset
    //=================================================
    getTabDatasetOld: function(nameDataset){
         var vet = new Array();
         var idResult = "#resultTurnOpen";
         var html ="";
         var filter = $("[filterDS]");
         var sqlLimit = $("#txtSqlLimit").val();
         
         // Cria a contraint para a pesquisa conforme o filtro na tela 
         for (var i = 0; i < filter.length; i++) {
               vet.push(this.getSimpleConstraint(
	            		   filter[i].value.split(";")[0],
	            		   filter[i].value.split(";")[1],
	            		   filter[i].value.split(";")[2],
	            		   filter[i].value.split(";")[3]
            		   ));               
         }   
         
         if(sqlLimit != "" && sqlLimit != "0"){
        	 vet.push(this.getSimpleConstraint("sqlLimit",sqlLimit,"MUST",false));
         }
        
         var ds = DatasetFactory.getDataset(nameDataset, null, vet, null);
         
         if(ds == "" ||ds == null || ds == {}){
        	 this.message("d","Dataset inexistente!");
        	 return;
         }
         
         // Se houver dados
         if(ds.values.length != 0){                    
            // Converte o json em tabela HTML
            this.parseDSforHTML(ds,idResult,null);     
            // Preenche o campo tipo select "Colunas para Filtro" com as colunas o tabela pesquisada.
            for (var i = 0; i < ds.columns.length; i++) {
                html += "<option value='"+ds.columns[i]+"'>"+ds.columns[i]+"</option>";
            }
                           
            $("#slColuFilt").html(html);
         }
         else{
             $(idResult).html("<h1>Não há dados</h1>");
             $("#slColuFilt").html("");
         }  
    },
	/***************************************************************************
	 * Traz  os dados de um dataset
	 * *************************************************************************
	 * 
	 * @param nameDataset: Nome do dataset
	 * @param selector: Seletor da div (Ex: #result)
     * @param callback: Função a ser efetuada após o processo (Pode ser nulo)
	 * @return Sem Retorno
	 **************************************************************************/
	getTabDataset: function(nameDataset){
		var selector = "#result";
        var html ="";
        var filter = $("[filterDS]");
        var sqlLimit = $("#txtSqlLimit").val();

    	var option;
    	// Objeto do Post
    	var param = new Object();
    	// Constraint
    	var cons = new Array();
    	// Objeto do Constraint
    	var conObj = new Object();	
    	//conObj._field = "sqlLimit";
    	//conObj._initialValue = "500";
    	//conObj._finalValue = "500";
    	//conObj._type = 1;
    	//cons.push(conObj);   	

    	 // Cria a contraint para a pesquisa conforme o filtro na tela 
         for (var i = 0; i < filter.length; i++) {
               cons.push(this.getSimpleConstraint(
	            		   filter[i].value.split(";")[0],
	            		   filter[i].value.split(";")[1],
	            		   filter[i].value.split(";")[2],
	            		   filter[i].value.split(";")[3]
            		   ));
         }   
         
         if(sqlLimit != "" && sqlLimit != "0"){
        	 cons.push(this.getSimpleConstraint("sqlLimit",sqlLimit,"MUST",false));
         }
         
         param.name = nameDataset;
    	 param.fields = [];
    	 param.constraints = cons;
    	 param.order = null;
    	 var ds,html,like="";

         chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
	    	$.ajax({
	    			type : "POST",
	    			url : getUrl(0,tabs[0].url)+'/ecm/api/rest/ecm/dataset/datasetsListForm/',
	    			contentType : "application/json",
	    			dataType : "JSON",
	    			data : JSON.stringify(param),	
	    			success : function(res) {
	    				ds=res;
	    				if(ds.values.length == 0){
	    					$(selector).html("<center><h1><hr />Não há dados<hr /></h1></center>");
	    					return;
	    				}
	    				else{
	    					html = "<table id='tableResultDataset' class='table table-striped'>";
	    					html += "<tr>";
	    					html += "<th></th>";
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
	    					$(selector).html(html);
	    					html="";
	    					for (var i = 0; i < ds.columns.length; i++) {
				                html += "<option value='"+ds.columns[i]+"'>"+ds.columns[i]+"</option>";
				            }
				                           
				            $("#slColuFilt").html(html);
	    		    	}
	    			},
	    			erro : function(res) {
	    				alert("Erro: "+res);
	    				return;
	    			}
	    	});
	    });
    	//======================================
    },
    
    // Lista todos os nomes dos Datasets
    getDataset: function(){
    	var option = "";
    	chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
    	$.get(getUrl(0,tabs[0].url)+'/ecm/api/rest/ecm/dataset/getDatasets'
    		     , {}            
    		     , function(res) { 
    		    	 for(var i=0; i<res.length; i++){
    		    		 try{
    		    			 option = "<option value='"+res[i].datasetPK.datasetId+"'>"+res[i].datasetPK.datasetId+" | "+res[i].datasetDescription+"</option>";
    		    			 $("#dataset").append(option);
    		    		 }
    		    		 catch (e) {}
    		    	 }
    		     }
    		     ,"JSON"  
    		 );
    	});
    },
    /***************************************************************************
     * Faz a sincronisação do dataset
     * *************************************************************************
     * 
     * @param nameDataset: Nome do dataset
     * @return Sem retorno
     **************************************************************************/
    datasetSync:function(){
    	var that = this;
    	var nameDataset = ($("#txtDataset").val() == "")?RCS.getValueSelect("dataset"):$("#txtDataset").val();
    	chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
	        var urlpost = getUrl(0,tabs[0].url)+"/ecm/api/rest/ecm/dataset/datasetSync";            
	        var param = {"datasetId":nameDataset};
	        $.ajax({
	            type : "POST",
	            url : urlpost,
	            contentType : "application/json",
	            dataType : "JSON",
	            data : JSON.stringify(param),   
	            success : function(res) {
	            	that.message("s","Dataset está sendo Sincronizado",res.content);
	            },
	            error : function(res) {
	            	that.message("d",res.message,res.content);
	            }
	        }); 
        });
    },

    /***************************************************************************
     * Toast - Menssagem de informação, erro ou aviso
     * *************************************************************************
     * 
     * @param msgType: typo da menssagem;
     * @param msgText: Mensagem a ser exibida;
     * @param ctitle: Título do erro;
     * @return Sem retorno
     **************************************************************************/
    message:function(msgType, msgText, ctitle){
		var title = "";
		switch(msgType){
			case "s":
				msgType = "success";
				title = "Sucesso";
				break;
			case "w":
				msgType = "warning";
				title = "Atenção";
				break;
			case "d":
			case "e":
				msgType = "danger";
				title = "Erro";
				break;
			default:
				msgType = "info";
				title = "Informação";
				break;
		}
		title = ((ctitle != null)?ctitle:title)+"<br />";
		FLUIGC.toast({
	        title: title,
	        message: msgText,
	        type: msgType
	    });
	}
};
var FLUIG = {
	//Cadastra um novo papél no Fluig
	roleCreate:function(code, description){		
		chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, function (tabs) {
			var urlpost = getUrl(0,tabs[0].url)+"/portal/api/rest/wcm/service/role/create";
			var param = {
				"formData": {
					"editCode": "",
					"addUsers": "",
					"data": "",
					"code": code,
					"description": description,
					"selectedItens": []
				},
				"config": {
					"validateFields": [
						{
							"key": "description"
						}
					]
				}
			};
	        				
	        $.ajax({
	        	type : "POST",
	        	url : urlpost,
	        	contentType : "application/json",
	        	dataType : "JSON",
	        	data : JSON.stringify(param),	
	        	success : function(res) {
	        		return res;
	        	},
	        	error : function(res) {
	        		alert("Erro " + res);
	        	}
	        });
        });
	},
	//Cadastra um novo grupo no Fluig
	groupCreate:function(code, description){	
		chrome.tabs.query({ "active": true, "lastFocusedWindow": true }, function (tabs) {	
			var urlpost = getUrl(0,tabs[0].url)+"/portal/api/rest/wcm/service/group/create";
			var param = {
					"formData": {
						"addUsers": "",
						"remUsers": "",
						"addRoles": "",
						"remRoles": "",
						"addChildGroups": "",
						"remChildGroups": "",
						"data": "",
						"groupCode": code,
						"groupDescription": description
					},
					"config": {
						"validateFields": [
							{
								"key": "groupCode"
							},
							{
								"key": "groupDescription"
							}
						]
					}
				};
	        				
	        $.ajax({
	        	type : "POST",
	        	url : urlpost,
	        	contentType : "application/json",
	        	dataType : "JSON",
	        	data : JSON.stringify(param),	
	        	success : function(res) {
	        		return res;
	        	},
	        	error : function(res) {
	        		alert("Erro " + res);
	        	}
	        });
        });
	}
};