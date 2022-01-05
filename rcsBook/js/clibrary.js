var loader = null;//FLUIGC.loading(window);
var myModal;
/*******************************************************************************
 * Ativação dos componentes
 ******************************************************************************/
$(document).ready(function() {
	/** Atribuição de funções* */
    FLUIG.addNavcontaner();
	FLUIG.addLimitCarac();
    FLUIG.addSelSem();
    FLUIG.addFunctionRowTable();
    FLUIG.addIdTable();
    FLUIG.addLinkNavtabs();
    FLUIG.addSelDataset();
    FLUIG.addQuestReadonly();
    //FLUIG.getUser();
});
var FLUIG = {	    
    /***************************************************************************
     * Adiciona a função de habilitar - desabilitar divs nas abas 
     * *************************************************************************
     * 
     * @param Sem parametros
     * @return Sem retorno
     **************************************************************************/
     addNavcontaner:function(){
            $("[navcontaner]").click(function(){
            var navcontaner = this.getAttribute("navcontaner");
            var group = this.getAttribute("group");
            var child = document.getElementById(group).childNodes;
            
            for(var i=0; i<child.length; i++){
                if(child[i].nodeType == 1){
                    FLUIG.hide("#"+child[i].id, (child[i].id != navcontaner));
                }
            }           
        }); 
    },
    /***************************************************************************
     * Adiciona limitador de caracteres em um campo
     * *************************************************************************
     * 
     * @param Sem parametros
     * @return Sem retorno
     **************************************************************************/
    addLimitCarac:function(){
        var obj = $("[setLimitCarac]");
        var objNow;
        
        for (var i = 0; i < obj.length; i++) {
            objNow = obj[i];
            $("#" + objNow.id).on("input",function() {
                FLUIG.setLimitCaracter(this,this.getAttribute("setLimitCarac"));
            });         
        }
    },
    /***************************************************************************
     * Adiciona Semáforo de cores em um select
     * *************************************************************************
     * 
     * @param Sem parametros
     * @return Sem retorno
     **************************************************************************/
    addSelSem:function(){
        $("[selSem]").on("change", function(){
                if(this.value == 1){
                    $("#"+this.id).attr("style","color:#138513;background-color:#95F994;");  
                }
                else if(this.value == 2){
                    $("#"+this.id).attr("style","color:#D81212;background-color:#F5A7A7;");
                }                     
                else {
                    $("#"+this.id).attr("style","color:#0D11B9;background-color:#B9BAF1;");
                }                 
        });
        $("[selSem]").change();
    },
    /***************************************************************************
     * Adiciona o RE e/ou o Usuário nos campos marcados
     * *************************************************************************
     * 
     * @param Sem parametros
     * @return Sem retorno
     **************************************************************************/
	getUser:function(){
		var user = "", re = "";
		try{
			user = WCMAPI.user;
			re = WCMAPI.re;
		}
		catch (e) {
			user = parent.WCMAPI.user;
			re = parent.WCMAPI.re;
		}
		$("[user]").val(user);
		$("[re]").val(re);	
	},    
    /***************************************************************************
     * Função auxiliar de Preenchimento de campos de seleção 
     * da tela de atributos
     * *************************************************************************
     * 
     * @param obj = JSON de configuração 
     * @param callback = função acionada após o processo
     * @param callback = função acionada após o processo
     * @return Sem retorno
     **************************************************************************/
    selectFilterValues:function(obj,callback){
        var filter = new Array();           
        for (var i = 0; i < obj.filter.length; i++) {
            filter.push(FLUIG.getSimpleConstraint(obj.filter[i].col,obj.filter[i].val));
        }       
                        
        var qtd = FLUIG.addSelFilterValue(obj.idObj ,obj.dataset, obj.coluns ,filter);
        if(qtd == 1){
            callback();
        }
        else{
            $("#"+obj.idObj).on("change",function(){
                callback();
            });
        } 
    },
	/***************************************************************************
	 * Adiciona o atributo "lastid" e "id" com o valor do Atributo "tablename", 
	 * se não houver
	 * *************************************************************************
	 * 
	 * @param Sem Parâmetros
	 * @return Sem retorno
	 **************************************************************************/
	addIdTable:function(){
		$("[tablename]").attr("lastid","0");
		var table = $("[tablename]");
		for (var i = 0; i < table.length; i++) {
			table[i].setAttribute("id",table[i].getAttribute("tablename"));
		}
	},
	/***************************************************************************
	 * Função de troca de abas em objetos Nav
	 * *************************************************************************
	 * 
	 * @param Sem Parâmetros
	 * @return Sem retorno
	 **************************************************************************/
	activeNav:function(obj, pos){
		var objNow = obj.parentNode.childNodes;
		for (var i = 0; i < objNow.length; i++) {
			if(objNow[i].nodeType == 1){
				objNow[i].removeAttribute("class");
			}
		}
		objNow[pos].setAttribute("class","active");
	},
	/***************************************************************************
	 * Adiciona função de troca de abas em objetos Nav
	 * *************************************************************************
	 * 
	 * @param Sem Parâmetros
	 * @return Sem retorno
	 **************************************************************************/
	addLinkNavtabs:function(){
		var obj = $(".nav-tabs");
		var navs = "", objNow,cont="";
		for (var i = 0; i < obj.length; i++) {
			objNow = obj[i].childNodes;
			for (var x = 0; x < objNow.length; x++) {
				if(objNow[x].nodeType == 1){
					objNow[x].setAttribute("onclick","FLUIG.activeNav(this,"+x+")");
				}
			}		
		}
	},
	/***************************************************************************
	 * Adiciona a função de acrescentar linhas em uma tabela
	 * *************************************************************************
	 * 
	 * @param Sem Parâmetros
	 * @return Sem retorno
	 **************************************************************************/
	addFunctionRowTable : function() {
		var obj = $("[addrowtable]");
		var objNow;
		
		for (var i = 0; i < obj.length; i++) {
			objNow = obj[i];
			$("#" + objNow.id).on("click",function() {
				FLUIG.addRowTable(this.getAttribute("addrowtable"),true);
			});			
		}
	},
	/***************************************************************************
	 * Adiciona linhas em uma tabela
	 * *************************************************************************
	 * 
	 * @param Sem Parâmetros
	 * @return Sem retorno
	 **************************************************************************/
	addRowTable : function(idTable,addtrash){
		var lastId = $("#"+idTable).attr("lastid");
		var row = $("#"+idTable+" tbody tr:first-child").html();	
		var trash = (addtrash)?'<td><span class="fluigicon fluigicon-trash icon-md" onclick="FLUIG.delRowTable(this)" /></td>':'';

		lastId = (lastId == '' || lastId == 'NaN')?1:parseInt(lastId) + 1;
		//lastId = parseInt(lastId) + 1;
		row = row.replace(/(.id=")/g,'id="'+lastId+"___").replace(/(.name=")/g,'name="'+lastId+"___");
		$("#"+idTable+" tbody ").append('<tr nrow >'+row+trash+'</tr>');	
		$("#"+idTable).attr("lastid",lastId);
		
		return lastId;
	},
	/***************************************************************************
	 * Apaga a linhas em uma tabela
	 * *************************************************************************
	 * 
	 * @param objeto Row
	 * @return Sem retorno
	 **************************************************************************/
	delRowTable:function(obj){
		//obj.parentNode.parentNode.innerHTML = "";
		obj.parentNode.parentNode.remove();
	},
	/***************************************************************************
	 * Retorna se o valor é nulo ou vazio
	 * *************************************************************************
	 * 
	 * @param valor
	 * @return Sem retorno
	 **************************************************************************/
    isNullOrEmpty:function(val){
      var ret = false;
      
      if(val == null){
        ret = true;
      }
      else if(val == undefined){
        ret =  true;
      }
      else if(val.toString().trim() == ""){
        ret = true;
      }
      
      return ret;
    },
	/***************************************************************************
	 * Apaga todas as linhas de uma tabela
	 * *************************************************************************
	 * 
	 * @param id da tabela
	 * @return Sem retorno
	 **************************************************************************/
	delRows:function(nomeTabela) {
		var tb = $("#" + nomeTabela + " tbody [nrow]");
		for (var i = 0; i < tb.length; i++) {
			//tb[i].innerHTML = "";
			tb[i].remove();
		}
	},
	/***************************************************************************
	 * Lista os combobox com atributos "questreadonly"
	 * *************************************************************************
	 * 
	 * @param Sem Parâmetros
	 * @return Sem retorno
	 **************************************************************************/
	addQuestReadonly : function() {
		var obj = $("[questreadonly]");
		var questReadonly = "", objNow;
		for (var i = 0; i < obj.length; i++) {
			objNow = obj[i];
			$("#" + objNow.id).on("change",function() {
				FLUIG.isReadonly(
						this.getAttribute("questreadonly"),
						(FLUIG.getValueSelect(this.id) != "true")
				);
			});
		}
	},
	/***************************************************************************
	 * Lista os combobox com atributos "dataset"
	 * *************************************************************************
	 * 
	 * @param Sem Parâmetros
	 * @return Sem retorno
	 **************************************************************************/
	addSelDataset : function() {
		var obj = $("[dataset]");
		for (var i = 0; i < obj.length; i++) {
			FLUIG.addSelValue(obj[i]);
		}
	},
	/***************************************************************************
	 * Preenche os Combobox com as informações de um datasets
	 * *************************************************************************
	 * 
	 * @param obj: objeto combobox
	 * @return Sem retorno
	 **************************************************************************/
	addSelValue : function(obj) {
		var dataset = obj.getAttribute("dataset");
		var datasetkey = obj.getAttribute("datasetkey");
		var datasetvalue = obj.getAttribute("datasetvalue");
		var addblankline = obj.getAttribute("addblankline");
		var sel = (addblankline != 'true')? '' : '<option value="" readonly="readonly" selected="selected" >Selecione</option>';

		var ds = DatasetFactory.getDataset(dataset, [datasetvalue, datasetkey], null, [datasetvalue]);
		for (var i = 0; i < ds.values.length; i++) {
			sel += '<option value="' + ds.values[i][datasetkey] + '" >'
					+ ds.values[i][datasetvalue] + '</option>';
		}
		obj.innerHTML = sel;
	},
	/***************************************************************************
	 * Preenche os Combobox com as informações de um datasets com filtro
	 * *************************************************************************
	 * 
	 * @param idObj:id do objeto (String)
	 * @param dataset: Nome do dataset (String)
	 * @param coluns: Colunas [valor, descrição] (Array)
	 * @param filter: Objeto Contraint (Array Constraint)
	 * @return Sem retorno
	 **************************************************************************/
	addSelFilterValue : function(idObj,dataset,coluns,filter) {
		var sel = '<option value="" readonly="readonly" selected="selected" >Selecione</option>';
		var ret = 0;
		var col = (coluns.length == 1)?coluns[0]:coluns[1];
		
		if(idObj != null || dataset != null || coluns != null || filter != null){
			var ds = DatasetFactory.getDataset(dataset, coluns, filter, [col]);
            
            if(ds.values == undefined){
                return;
            }
            
			sel = (ds.values.length == "1")?"":sel;
			for (var i = 0; i < ds.values.length; i++) {
				sel += '<option value="' + ds.values[i][coluns[0]] + '" >';
				sel += (coluns.length == 1)?ds.values[i][coluns[0]]:ds.values[i][coluns[1]];
				sel += '</option>';
			}
			ret = ds.values.length;
		}		
		$("#"+idObj).html(sel);
		
		return ret;
	},
    /***************************************************************************
     * Função de obriga a validação do campo
     * *************************************************************************
     * 
     * @param id: do objeto
     * @param cond: true/false
     * @return Sem retorno
     **************************************************************************/
    isRequired : function(id, cond) {
        if (cond) {
            $(id).attr("required", true);
        } else {
            $(id).removeAttr("required");
        }
    },
    /***************************************************************************
     * Função de bloqueia objetos
     * *************************************************************************
     * 
     * @param id: do objeto
     * @param cond: true/false
     * @return Sem retorno
     **************************************************************************/
    isReadonly : function(id, cond) {
        if (cond) {
            $(id).attr("readonly", true);
        } else {
            $(id).removeAttr("readonly");
        }
    },   
    /***************************************************************************
     * Valida data inicial com data final
     * *************************************************************************
     * 
     * @param dti: data inicial
     * @param dtf: data final
     * @return thue/false
     **************************************************************************/ 
    valid2Dt:function(dti,dtf){
          var dtfi = this.parseDateInt(dti);
          var dtff = this.parseDateInt(dtf);
          
          if(dtfi > dtff){
            return false;
          }
          return true;
    }, 
	/***************************************************************************
	 * Função de esconder objetos
	 * *************************************************************************
	 * 
	 * @param id: do objeto
	 * @param cond: true/false
	 * @return Sem retorno
	 **************************************************************************/
	hide : function(id, cond) {
		if (cond) {
			$(id).fadeOut();
		} else {
			$(id).fadeIn();
		}
	},
    /***************************************************************************
     * Formata uma data para Pt-Br
     * *************************************************************************
     * 
     * @param dt: Data a ser convertida
     * @return Data convertida
     **************************************************************************/
    parseDatePTBR:function(dt){
    	if(dt == ""){
    		return dt;
    	}
        dt = dt.toString().replace("-","/").replace("-","/");
        var vet = dt.split("/"); 
        var ret = "";
        
        if((vet[0]).split("").length == 4 ){
          ret = vet[2] +"/"+vet[1] +"/"+vet[0];
        }
        else{
          ret = dt;
        }
        return ret;
      },
    /***************************************************************************
     * Formata uma data para Americana
     * *************************************************************************
     * 
     * @param dt: Data a ser convertida
     * @return Data convertida
     **************************************************************************/
    parseDateEUA:function(dt){
      dt = dt.toString().replace("-","/").replace("-","/");
      var vet = dt.split("/"); 
      var ret = "";
            
      if((vet[0]).split("").length == 4 ){
          ret = vet[0] +"-"+vet[1] +"-"+vet[2];
      }
      else{
          ret = vet[2] +"-"+vet[1] +"-"+vet[0];
      }

      return ret;
    },
    /***************************************************************************
     * Verifica se contaim um valor em um vetor
     * *************************************************************************
     * 
     * @param vet Vetor a ser comparado;
     * @param val: Valor de verificação;
     * @return true/false;
     **************************************************************************/
    containsVet:function(vet,val){
        for(var i=0; i<vet.length; i++){    
          if(vet[i] == val){
            return true;
          }
        }
        return false;
      },
    /***************************************************************************
     * Verifica se contaim um valor em uma string
     * *************************************************************************
     * 
     * @param valor: Valor a ser verificado;
     * @param contain: Valor a ser verificado;
     * @return true/false;
     **************************************************************************/
    contains:function(valor, contain){
        if(valor.indexOf(contain) != -1){
             return true;
        }
        return false;
     },
    /***************************************************************************
     * Cria uma Contraint simple de Dataset
     * *************************************************************************
     * 
     * @param col: Nome do filtro;
     * @param val: Valor do filtro;
     * @return Objeto constraint;
     **************************************************************************/
    getSimpleConstraint:function(col,val){
      	return (DatasetFactory.createConstraint(col, val, val, ConstraintType.MUST));
    },
    /***************************************************************************
     * Mostra um pop-up em CSS
     * *************************************************************************
     * 
     * @param title: Título do Pop-up
     * @param html: Corpo da mensagem (HTML)
     * @param callback: Função a ser chamada no botão de confirmação (pode ser nulo)
     * @return Sem retorno
     **************************************************************************/
    modal:function(title,html,callback){
    	var btObj = new Array();
    	var btSelect = {
            'label': 'Adicionar',
            'bind': 'data-select',
        };
        
        if(callback != null){
        	btObj.push(btSelect);
        }
    	btObj.push({
            'label': 'Fechar',
            'autoClose': true
        });
    	
      myModal = FLUIGC.modal({
    	    title: title,
    	    content: html,
    	    id: 'fluig-modal',
    	    actions: btObj
    	}, function(err, data) {
    	    if(err) {
    	        // do error handling
    	    } 
    	    else {
    	    	if(callback != null){
    		       $("[data-select]").on("click",function(){
    		    	   callback();
    		       });
    	        }
    	    }
    	});
        $("#toaster").focus();
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
	/***************************************************************************
	 * Traz  os dados de um dataset
	 * *************************************************************************
	 * 
	 * @param nameDataset: Nome do dataset
	 * @param selector: Seletor da div (Ex: #result)
     * @param callback: Função a ser efetuada após o processo (Pode ser nulo)
	 * @return Sem Retorno
	 **************************************************************************/
	getTabDataset: function(nameDataset,selector,callback){
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

    	param.name = nameDataset;
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
    			erro : function(res) {
    				alert("Erro");
    				return;
    			}
    	});
    	//======================================
    },    
    /***************************************************************************
     * Limita a quantidade de Caracteres em um elemento
     * *************************************************************************
     * 
     * @param obj: Objeto HTML (input,textarea)
     * @param qtd: Quantidade limite de caracteres 
     * @return Sem Retorno
     **************************************************************************/
      setLimitCaracter:function(obj,qtd){
            var val = obj.value;
            var idCont = 'qtdc'+obj.id;
            var calc = obj.value.length;
            if(!document.getElementById(idCont)){                      
                var element = document.createElement('input');
                element.setAttribute('type', 'text'); 
                element.setAttribute('id', idCont); 
                element.setAttribute('readonly', true); 
                element.setAttribute('class', 'limitCaracter'); 
                element.setAttribute('size', qtd.toString().length);
                obj.after(element);
            }
            var objQtd = document.getElementById(idCont);
            calc = parseInt(qtd) - calc;
            if(calc < 0){
                calc = 0;
                val = val.substring(0,parseInt(qtd));
            }
            objQtd.value = calc;
            obj.value = val;
      },
	/***************************************************************************
	 * Retorna o valor do objeto "Select"
	 * *************************************************************************
	 * 
	 * @param id - do objeto
	 * @return Valor selecionado
	 **************************************************************************/
	getValueSelect : function(id) {
        if(document.getElementById(id)){
            var x = document.getElementById(id);
            for (var i = 0; i < x.length; i++) {
                if (x[i].selected == true) {
                    return x[i].value;
                }
            }    
        }
        else{
            console.error(id+" não foi encontrado.");
        }
		
		return "";
	},    
    
    /***************************************************************************
     * Retorna o valor do objeto "Checbox ou Radio"
     * *************************************************************************
     * 
     * @param parname - nome do objeto
     * @return Valor selecionado
     **************************************************************************/
    getValueChecked:function(parname){
          var x = document.getElementsByName(parname); 
          for (var i = 0; i < x.length; i++) {
              if (x[i].checked == true) { 
                  return x[i].value;
              }
          }
          return "";
      }, 
    /***************************************************************************
     * Retorna a descrição do objeto "Select"
     * *************************************************************************
     * 
     * @param id - do objeto
     * @return Valor selecionado
     **************************************************************************/
    getDescSelect:function(id){
        if( document.getElementById(id)){
            var x = document.getElementById(id);
                for (var i = 0; i < x.length; i++) {
                    if (x[i].selected == true) {
                        return x[i].innerHTML;
                    }
                }  
        }                
            return "";
     },
    /***************************************************************************
     * Insere um valor do objeto "Select"
     * *************************************************************************
     * 
     * @param id - do objeto
     * @param val - valor do Objeto
     * @return retorna o valor
     **************************************************************************/
     setValueSelect:function(id,val){
            var x = document.getElementById(id);    
            for (var i = 0; i < x.length; i++) {
                x[i].selected = false;
                if (x[i].value == val) {
                    x[i].selected = true;
                }
            }            
            return x;
     },          
    /***************************************************************************
     * Insere um valor do objeto "Select"
     * *************************************************************************
     * 
     * @param id - do objeto
     * @param desc - valor do Objeto (Descrição)
     * @return retorna o valor
     **************************************************************************/
     setValueSelectDesc:function(id,desc){
            var x = document.getElementById(id);    
            for (var i = 0; i < x.length; i++) {
                x[i].selected = false;
                if (x[i].innerHTML == desc) {
                    x[i].selected = true;
                }
            }
     },
    /***************************************************************************
     * Insere um valor do objeto "Check ou Radio"
     * *************************************************************************
     * 
     * @param id - do objeto
     * @param val - valor do Objeto
     * @return retorna o valor
     **************************************************************************/
     setValueChecked:function(prname,val){
            var x = document.getElementsByName(prname);    
            for (var i = 0; i < x.length; i++) {
                x[i].checked = false;
                if (x[i].value == val) {
                    x[i].checked = true;
                }
            }
     },
	/***************************************************************************
	 * Calcula as horas
	 * *************************************************************************
	 * 
	 * @param val1 - Horário (00:00)
	 * @param val2 - Horário (00:00 ou 00)
	 * @param menos - Subtração (true), Soma (false)
	 * @return Valor calulado
	 **************************************************************************/
	calcHour:function(val1,val2,menos){
        var hs1 = val1.toString().split(':');
        var hs2 = val2.toString().split(':');
        var horas = 0, minutos = 0, result;
        
        if(hs1.length != 2){
            return false;
        }
        
        if (hs1.length != 2) {
    		return false;
    	}
        
        if(hs2.length != 2){
        	hs2 = ["00",val2];
        }
        
    	if (menos || menos == true) {
    		minutos = parseInt(hs1[1]) - parseInt(hs2[1]);

    		if (parseInt(hs1[1]) < parseInt(hs2[1])) {
    			loop = parseInt(parseInt(hs2[1] / 61)) + 1;
    			for (var i = 0; i < loop; i++) {
    				minutos = minutos + 60;
    				horas--;
    			}
    		}
    		horas = (parseInt(hs1[0]) - parseInt(hs2[0])) + horas;
    	} 
    	else {
    		minutos = parseInt(hs1[1]) + parseInt(hs2[1]);
    		loop = parseInt(minutos / 60);
    		for (var i = 0; i < loop; i++) {
    			minutos = minutos - 60;
    			horas++;
    		}
    		horas = horas + parseInt(hs1[0]) + parseInt(hs2[0]);
    	}
    	result = ((horas < 10) ? "0" + horas : horas).toString() + ":" + ((minutos < 10) ? "0" + minutos : minutos).toString();

    	return result;  
    },
    
    /***************************************************************************
     * Valida o período por tempo
     * *************************************************************************
     * 
     * @param hrinicio  - Início periodo (00:00)
     * @param hrfim     - Final periodo (00:00)
     * @param hrcompare - Horário a ser comparado (00:00)
     * @return true/false
     **************************************************************************/
    isPeriodTime:function(hrinicio,hrfim,hrcompare){        
        hrcompare = hrcompare.split(":");
        hrinicio = hrinicio.split(":");
        hrfim = hrfim.split(":");

        hrinicio[0] = (hrinicio[0] == "00")?"0":FLUIG.retZeroEsq(hrinicio[0]);
        hrfim[0] = (hrfim[0] == "00")?"24":hrfim[0];
         
         // Valida os valores dos campos inicio e fim
         if(parseInt(hrinicio[0]) > parseInt(hrfim[0])){
              return false;
         }
         else  if(parseInt(hrinicio[0]) == parseInt(hrfim[0]) && parseInt(hrinicio[1]) > parseInt(hrfim[1])){
               return false;
         }
        
         // Valida o periodo
        if(parseInt(hrcompare[0]) >= parseInt(hrinicio[0]) && parseInt(hrcompare[0]) <= parseInt(hrfim[0])){
            if(parseInt(hrcompare[0]) == parseInt(hrfim[0])){
                if(parseInt(hrcompare[1]) <= parseInt(hrfim[1])){
                    return true;
                }
                else{
                    return false;
                }
            }
            return true;
        }
        else{
            return false;
        }
    }, /***************************************************************************
     * Valida o período por data
     * *************************************************************************
     * 
     * @param dtinicio  - Início periodo (2020-01-01)
     * @param dtfim     - Final periodo (2020-01-30)
     * @param dtcompare - Data a ser comparado (2020-01-10)
     * @return true/false
     **************************************************************************/
    isPeriodDate:function(dtinicio,dtfim,dtcompare){                
        dtinicio = parseInt(dtinicio.replace(/(-)/g,""));
        dtfim = parseInt(dtfim.replace(/(-)/g,""));
        
        if(dtcompare == null){
            dtcompare = this.parseDateInt(this.getDate());
        }
        else{
            dtcompare = parseInt(dtcompare.replace(/(-)/g,""));
        }
       
         // Valida os valores dos campos inicio e fim
        if(dtinicio < dtcompare && dtcompare < dtfim){
             return true;
        }
        else{
            return false;
        }
    },
    /***************************************************************************
     * Retorna o horário atual
     * *************************************************************************
     * 
     * @param Sem parâmetro; 
     * @return Hora atual
     **************************************************************************/
    getTime:function(){
        var today = new Date();
        var minute = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
        var hour = today.getHours() < 10 ? '0' + today.getHours() : today.getHours();
        var horas = (hour + ':' + minute + ":00");  
        return horas;  
       } ,
    /***************************************************************************
     * Retira os Zeros a esquerda
     * *************************************************************************
     * 
     * @param val: Valor a ser tratado;
     * @return Valor tratado
     **************************************************************************/
    retZeroEsq:function(val){
        var  vet = val.split("")
          ,result = ""
          ,nzero = false;
        
        for(var i = 0; i<vet.length; i++){
          if(nzero){
            result += vet[i];
          }
          else if(parseInt(vet[i]) != 0){
            result += vet[i];
            nzero = true;
          }
        }
        return result;  
    },    
    /***************************************************************************
    * Cria uma constraint para o objeto "getDataset"
    * *************************************************************************
    * 
    * @param Vetor Constraint
    * @param Campo para captura
    * @return Sem retorno
    **************************************************************************/
     getConstraint:function(vet,id){
        var val = $("#"+id).val();
        vet.push(DatasetFactory.createConstraint(id, val, val, ConstraintType.MUST));
    },     
    /***************************************************************************
    * Retorna a data em inteiro "yyymmdd"
    * *************************************************************************
    * 
    * @param dt: data
    * @return "yyymmdd"
    **************************************************************************/
    parseDateInt:function(dt){
      dt = dt.toString().replace("-","/").replace("-","/");
      var vet = dt.split("/"); 
      var ret = "";
            
      if((vet[0]).split("").length == 4 ){
          ret = vet[0] +""+vet[1] +""+vet[2];
      }
      else{
          ret = vet[2] +""+vet[1] +""+vet[0];
      }

      return parseInt(ret);
    },     
    /***************************************************************************
    * Retorna uma data formato PT-BR
    * *************************************************************************
    * 
    * @param Sem parametro
    * @return dd/mm/yyyy
    **************************************************************************/
    getDate:function(){
             var today = new Date();
             var year = today.getFullYear();
             var month = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : (today.getMonth() + 1);
             var day = today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
             var dtAtual = (day + '/' + month + '/' + year);  
             return dtAtual;
     },
    /***************************************************************************
     * Valida os campos com atributo "required"
     * *************************************************************************
     * 
     * @param id
     * @return Sem retorno
     **************************************************************************/
    validInputs:function(id){
        id = (id == null)?"":id;
        id = (id == "")?"":id + "  ";
        var campos = $(id+"[required]");
        var msg = "";
        
        for (var i = 0; i < campos.length; i++) {
            
             if(campos[i].type == "select-one" && FLUIG.getValueSelect(campos[i].id) == ""){
                 msg += "Selecione uma alternativa no campo '"+campos[i].title+"'. <br />";
             }
            else if($("#"+campos[i].id).val().trim() == ""){
                 msg += "Campo '"+campos[i].title+"' não pode ser vazio.<br />";
             }   
        }
        if(msg != ""){
            FLUIG.message("d",msg,"Atenção");
            return 0;
        }
        else{
            return 1;
        }
    },
    /***************************************************************************
     * Retorna o valor de um campo tratado de uma tabela
     * *************************************************************************
     * 
     * @param newId: número da linha
     * @param nameInput: nome do campo
     * @return Valor tratado
     **************************************************************************/
    getValIT:function(newId,nameInput){
        var ret = $("#"+newId+"___"+nameInput).val();
        if(ret == undefined || ret == null){
            ret = "";
        }
        return ret;
    },
    /***************************************************************************
     * Insere um valor de um campo tratado de uma tabela
     * *************************************************************************
     * 
     * @param newId: número da linha
     * @param nameInput: nome do campo
     * @param valor: Valor a ser inputado
     * @return Sem retorno
     **************************************************************************/
    setValIT:function(newId,nameInput,valor){
        if(valor == undefined || valor == null){
            valor = "";
        }
        $("#"+newId+"___"+nameInput).val(valor).attr("title",valor);
    },
    /***************************************************************************
     * Reorganiza um vetor (precisa da função alfMax)
     * *************************************************************************
     * 
     * @param vet:Vetor a ser organizado
     * @return Vetor organizado
     **************************************************************************/    
    vetReorg:function(vet){
        var ct = vet.length;
        var tmp;                        
        for(var i=0; i<ct;i++){
            for(var x=0; x<ct;x++){
                if(this.alfMax(vet[i],vet[x])){
                    tmp = vet[i];
                    vet[i] = vet[x];
                    vet[x] = tmp;
                }
            }
        }      
       return vet;
    },                    
    /***************************************************************************
     * Retorna um arquivo para download 
     * *************************************************************************
     * 
     * @param filename: nome do arquivo com extenção
     * @param idTable: ID da tabela
     * @return Sem retorno
     **************************************************************************/
    htmlTableToCSV:function(filename, idTable){
             var element = document.createElement('a'); 
             var table = document.getElementById(idTable).innerHTML;
             table = table.replace(/&(.*?);/g, "");
             table = table.replace(/<(.td?)>/g, ";");
             table = table.replace(/<(.th?)>/g, ";");
             table = table.replace(/<(.tr?)>/g, "\n");
             table = table.replace(/<(.*?)>/g, "");
             
             element.setAttribute('href', 'data:application/octet-stream;charset=ISO-8859-1,' + encodeURIComponent(table));
             element.setAttribute('download', filename);
          
             element.style.display = 'none';
             document.body.appendChild(element);
          
             element.click();
          
             document.body.removeChild(element);
    },    
    /***************************************************************************
     * Desabilita ou habilita os options de um select
     * *************************************************************************
     * 
     * @param id: id do objeto
     * @param dis: true/false
     * @return Sem retorno
     **************************************************************************/
    disableSelect:function(id, dis){
        var x = document.getElementById(id);
        for (var i = 0; i < x.length; i++) {
            x[i].disabled = dis;
        }
    },
    /***************************************************************************
     * Verifica se o valor1 é maior que o valor2, baseado na tabela ASSII
     * *************************************************************************
     * 
     * @param val1: número a ser comparado
     * @param val2: número a ser comparado
     * @return true/false
     **************************************************************************/
    alfMax:function(val1, val2){
        var vm1 = val1.toString().split().length;
        var vm2 = val2.toString().split().length;
        var ct = (vm1 < vm2)?vm1:vm2;
        val1 = val1.toString();
        val2 = val2.toString();
      for(var i=0; i< ct; i++){
          if((val1[i]).toString().charCodeAt(0) < (val2[i]).toString().charCodeAt(0)){
              return true;
          }
      }
      return false;
    },
    /***************************************************************************
     * Faz a sincronisação do dataset
     * *************************************************************************
     * 
     * @param nameDataset: Nome do dataset
     * @return Sem retorno
     **************************************************************************/
    datasetSync:function(nameDataset){
        var urlpost = "/ecm/api/rest/ecm/dataset/datasetSync";            
        var param = {"datasetId":nameDataset};
        $.ajax({
            type : "POST",
            url : urlpost,
            contentType : "application/json",
            dataType : "JSON",
            data : JSON.stringify(param),   
            success : function(res) {
                FLUIG.message("s","Dataset está sendo Sincronizado",res.content);
            },
            error : function(res) {
                FLUIG.message("d",res.message,res.content);
            }
        }); 
    }    
}