define(['index'], function(index) {
	
	/**
	 * Controller List
	 */
	agendaListCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$modal',
		'$filter',
		'$stateParams',
		'$location',
		'totvs.app-main-view.Service',
		'fchmpo.fchmpoagenda.Factory',
		'helperLaborReport',
		'TOTVSEvent'
	];
	
	function agendaListCtrl($rootScope,
							 $scope,
							 $modal,
							 $filter,
							 $stateParams,
							 $location,
							 appViewService,							 
							 fchmpoagendaFactory,
							 helperLaborReport,
							 TOTVSEvent) {
	
		/**
		 * Variável Controller
		 */
		var controller = this;	
	
		/**
		 * Variáveis
		 */
		this.listResult = [];       // array que mantem a lista de registros
		this.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
		this.disclaimers = [];      // array que mantem a lista de filtros aplicados
		this.limitAt = 50;			// limite da busca
		this.startAt = 0;			// posição de inicio da busca
		this.iLengthPage = 0;  		// tamanho do resultado da busca
		this.isHide = false;   		// usado na validação do botão de mais resultados
		this.lPaginate = false;		// usado para validar se é para ser paginado ou não		
		var quickSearchText = "";   // atributo que contem o valor da pesquisa rápida		
		this.tecnico = "";			// usada para armazenar o técnico corrente
		this.listSelectTecnico = []; // usado para armazenar o técnico selecionado na lista de técnicos
		
		// definição de variavéis usada na busca inicial
		var dateIni = new Date();
		var auxDay = dateIni.getDate();
		dateIni.setDate(auxDay-6);
		// definição do objeto usado para fazer a busca simples com os valores iniciais
		controller.quickSearchText = {
				start: dateIni.getTime(),
				end: new Date().getTime()
			};
		
		// definição do objeto usado para fazer a busca avaçada com os valores iniciais
		this.advancedSearch = {
        		cdTecnico: this.tecnico,
    			initialEstabelec: "",   
    			finalEstabelec: "ZZZZZ", 
    			initialPlanejador: "",   
	            finalPlanejador: "ZZZZZZZZZZZZ",   
	            initialEquipe: "",   
	            finalEquipe: "ZZZZZZZZ",   
	            initialTag: "",
	            finalTag: "ZZZZZZZZZZZZZZZZ", 
	            initialEquipto: "",   
	            finalEquipto: "ZZZZZZZZZZZZZZZZ",   
	            initialOrdem: "0",     
	            finalOrdem: "999.999.999",
	            initialEspec : "",      
	            finalEspec : "ZZZZZZZZ",
	            initialUnidNegoc: "",
	            finalUnidNegoc: "ZZZ",
	            initialTipoManut: "0",
	            finalTipoManut: "99.999",
	            initialManut: "", 
	            finalManut: "ZZZZZZZZ",	                           
	            lPreventiva: true,
	            lCorretiva: true,
	            lPreditiva: true,
	            lOutros: true, 	            
	            lHoje: false, 
	            lAtrasado: true,
	            dateRange: {start: dateIni.getTime(),
	            			end: new Date().getTime(),
	            			startDate: dateIni,
	            			endDate: new Date()},	            
	            lEmDia: true,
	            lFinalizado: false,	            
	            lConflito: false,
	            startAt: 0,
	            limitAt: controller.limitAt,
	            accord : { periodSituation: true,
	            		   Statistics: false,
	            		   Selection: false}
				};
		
		
		this.enviaEmail = [];
		
		this.listSelectTecnicoAux = [];
		
		this.hifen = $rootScope.i18n('l-select-technician');
		
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************
		
		
	    /**
	     * Método para adicionar os disclaimers relativos a tela de pesquisa avançada
	     */ 
	    this.addDisclaimers = function() {
	        // reinicia os disclaimers
	        controller.disclaimers = [];        
	        
        	// verifica se há pesquisa rápida
	        if (controller.advancedSearch) {	            
	            // adicionar o disclaimer para a pesquisa rápida"
	            controller.addDisclaimer('advancedSearch', "*", $rootScope.i18n('l-advanced-search'));
	        }	        	        
	    }
	    
	    /**
	     * Adiciona um objeto na lista de disclaimers
	     */ 
	    this.addDisclaimer = function(property, value, label) {
	        controller.disclaimers.push({
	            property: property,
	            value: value,
	            title: label
	        });
	    }
	    
	    /**
	     * Remove um disclaimer
	     */
	    this.removeDisclaimer = function(disclaimer) {
	        // pesquisa e remove o disclaimer do array
	        var index = controller.disclaimers.indexOf(disclaimer);
	        if (index != -1) {
	            controller.disclaimers.splice(index, 1);
	        }
	        if (disclaimer.property == 'advancedSearch') {
	            controller.loadData();
	        }
	    }
	    
	    /**
		 * Adiciona disclaimers do filtro rápido
		 */
		this.addQuickSearchDisclaimer = function() {
			if (this.quickSearchText === "" || this.quickSearchText === undefined) {
				this.disclaimers = undefined;
			} else {
				var placeholder = "search";
				this.disclaimers = [{
					property : placeholder, 
					value : "*", 
					title : $rootScope.i18n("l-tasks") + " " + $rootScope.i18n("l-open-plural"),
					fixed : true
				}];
			}
		}
		// Filtra a lista de tecnicos de a cordo com o valor digitado
		this.getListTecnico = function(input){
			controller.listSelectTecnico = $filter('filter')(controller.listSelectTecnicoAux, {$:input});
		}		
		
		// Valida se o usuario corrente é tecnico, planejador ou gerente
		this.isTecnico = function(pTecnico, pSituacao){
			
			if (pSituacao == 3)
				return false;
			
			if (controller.isPlanejador == false){
				if (pTecnico == controller.infoTecnByUser.cdTecnico)
					return true; 
				
				return false;
			}			
			return true;
		}

		/**
		 * Abertura da tela de pesquisa avançada
		 */
	    this.openAdvancedSearch = function() {
	    	controller.advancedSearch.dateRange = {start : controller.quickSearchText.start,
	    										   startDate : new Date(controller.quickSearchText.start),
	    										   end : controller.quickSearchText.end,
	    										   endDate : new Date(controller.quickSearchText.end)};			
			
			var modalInstance = $modal.open({
	        	templateUrl: '/dts/mpo/html/agenda/agenda.advanced.search.html',
	        	controller: 'mpo.agenda.SearchCtrl as controller',
	        	size: 'lg',
	        	resolve: {
	        		model: function () {
	        			//passa o objeto com os dados da pesquisa avançada para o modal	  
	        			
	        			return controller.advancedSearch;
	        			
	        		}	        	        	
	        	}
	        });	        	       
	        
	        // quando o usuario clicar em pesquisar:
	        modalInstance.result.then(function () {	        	
	            // e chama o busca dos dados
	        	
	    		controller.quickSearchText = {start : new Date(controller.advancedSearch.dateRange.startDate).getTime(),
	    									  end   : new Date(controller.advancedSearch.dateRange.endDate).getTime()};
	    		
	    		controller.addDisclaimers();
	            controller.loadDataAdvancedSearch();
	        });
	    }

	    controller.changeDate = function(){
	    	if (controller.quickSearchText.start == null)
	    		controller.quickSearchText = {start : new Date(controller.advancedSearch.dateRange.startDate).getTime(),
	    									  end   : new Date(controller.advancedSearch.dateRange.endDate).getTime()};
	    	
	    }
	    
		/**
		 * Abertura da tela de pesquisa avançada
		 */
	    this.openEnviaEmail = function() {
	        var modalInstance = $modal.open({
	        	templateUrl: '/dts/mpo/html/agenda/agenda.sendemail.html',
	        	controller: 'mpo.agenda.SendEmailCtrl as controller',
	        	size: 'lg',
	        	resolve: {
	        		model: function () {
	        			//passa o objeto com os dados do email para o modal
	        			controller.enviaEmail = {};
	        			controller.enviaEmail.bodyEmail = [];
	        			controller.enviaEmail.headerEmail = {};
	        			angular.forEach(controller.listResult, function(value){ 
	        				controller.enviaEmail.bodyEmail.push({
			        			nome : controller.selectedTecnico.nomeCompl,
			        			situacao : value.situacao,
			        			hraInicial : value.hraInicial,
			        			datAgenda : $filter('date')(value.datAgenda,'dd/MM/yyyy'),        
			        			hraFinal : value.hraFinal,
			        			nrOrdem : value.nrOrdem,
			        			descOrdem : value.descOrdem,
			        			prioridade : value.prioridade,
			        			cdTarefa : value.cdTarefa,           
			        			descTarefa : value.descTarefa, 
			        			tpEspecial : value.tpEspecial,
			        			descEspecial : value.descEspecial,
			        			cdTurno : value.cdTurno,     
			        			descTurno : value.descTurno,
			        			cdTecnico : controller.selectedTecnico.cdTecnico,
			        			codEstabel : value.codEstabel, 
			        			estado : value.estadoOrd,   
			        			estadoTarefa : value.estadoTarefa,
			        			scCodigo : value.scCodigo 
	        				});
	        			});
	        			
	        			controller.enviaEmail.headerEmail = {
        					nome: controller.selectedTecnico.nomeCompl,
        					cdTecnico : controller.selectedTecnico.cdTecnico,
        					email : controller.selectedTecnico.email
	        			}

	        			return controller.enviaEmail;
	        		}	        	        	
	        	}
	        });
	    }
	        
	    // adiciona o tecnico selecionado ao filtros e executa a busca 
	    this.selectTecnico = function(){
	    	
	    	controller.tecnico = controller.selectedTecnico.cdTecnico;
	    	controller.advancedSearch.cdTecnico = controller.tecnico;
	    	controller.hifen = " - ";
	    	
	    	if (controller.quickSearchText.start == null || controller.quickSearchText.end == null){
	    		
	    		$rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'error',
	                title: $rootScope.i18n('l-attention'),
	                detail: $rootScope.i18n('msg-enter-period')
	            });  
	    		
	    	}else {	    	    		
	    		angular.forEach(controller.disclaimers, function(disclaimer){
	    			if (disclaimer.property == 'advancedSearch')
	    				controller.loadDataAdvancedSearch(false);
    				else
			        	controller.loadData(false);
			       
	    		});
	    	}
	    }
	    
	    /**
	     * Método de pesquisa para filtro rápido
	     */
	    this.search = function(isMore) {
	    	if (controller.tecnico != ""){
		    	if (controller.quickSearchText.start == null || controller.quickSearchText.end == null){
		    		
		    		$rootScope.$broadcast(TOTVSEvent.showNotification, {
		                type: 'error',
		                title: $rootScope.i18n('l-attention'),
		                detail: $rootScope.i18n('msg-enter-period')
		            });  
		    		
		    	}else
		    		this.loadDataQuickSearch(isMore);
	    	} else {
	    		$rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'error',
	                title: $rootScope.i18n('l-attention'),
	                detail: $rootScope.i18n('msg-select-technician')
	            }); 
	    	}
	    }
		
		/**
		 * Método de leitura dos dados
		 */
		this.loadData = function(isMore) {

	        // valores default para o inicio e pesquisa
	        var where = '';
	        controller.lPaginate = false;
	        controller.ttSelecaoConsultaAgenda = undefined;
	        
	        // se não é busca de mais dados, inicializa o array de resultado
	        if (!isMore) {
	            controller.listResult = [];
	            controller.totalRecords = 0;
	            controller.startAt = 1;
	        }
	        
			var dateIni = new Date();
			var auxDay = dateIni.getDate();
			dateIni.setDate(auxDay-6);
			
			controller.isHide = false;
			
			var parameters = {};
	        
        	if (controller.quickSearchText){
                parameters = {
	        		cdTecnico: controller.tecnico, 
	        		datAgendaIni: controller.quickSearchText.start,
	        		datAgendaFim: controller.quickSearchText.end
		        };      
        	}else {
		        parameters = {
		            cdTecnico: controller.tecnico,
		            datAgendaIni: dateIni.getTime(),
	            	datAgendaFim: new Date().getTime()
		        };
        	}
	
        	fchmpoagendaFactory.getListAgendaSearch(controller.startAt, controller.limitAt, parameters, function(result){        		
        		if (result) {	 	        		
        			
 	        		controller.iLengthPage = result.ttListAgenda.length;
 	        		controller.lPaginate = result['l-paginate'];
 	        		
 	        		if (!isMore)
                    	controller.totalRecords = controller.iLengthPage;
 	        		else
 	        			controller.totalRecords = controller.totalRecords + controller.iLengthPage;
 	        			 	        		
 	        		if (controller.startAt == 1)
 	        			controller.startAt = result['i-length-page'] + 1;
 	        		else
 	        			controller.startAt = controller.startAt + result['i-length-page'];
 	        		
 	        		// para cada item do result
	                angular.forEach(result.ttListAgenda, function (value) {	                    
	                	
	                	value.hraInicial = value.hraInicial.split(':');
	                	value.hraInicial = value.hraInicial[0] + ':' + value.hraInicial[1];
			        	
	                	value.hraFinal = value.hraFinal.split(':');
	                	value.hraFinal = value.hraFinal[0] + ':' + value.hraFinal[1];
	                	
	                    // adicionar o item na lista de resultado
                		controller.listResult.push(value);
                		
	                });
	                if (controller.disclaimers.length == 0 || controller.disclaimers[0].property != 'advancedSearch'){
                		controller.addQuickSearchDisclaimer();
                	}	  
	               
	                controller.isHide = true;
	            }
	        });   	
	    }
		
		/**
		 * Método de leitura dos dados
		 */
		this.loadDataQuickSearch = function(isMore) {
			if (controller.ttSelecaoConsultaAgenda != undefined){
				controller.advancedSearch.dateRange = {start : controller.quickSearchText.start,
													   startDate : new Date(controller.quickSearchText.start),
													   end : controller.quickSearchText.end,
													   endDate : new Date(controller.quickSearchText.end)};
				
				controller.loadDataAdvancedSearch(isMore);			
				
			} else {
				controller.advancedSearch.dateRange = {start : controller.quickSearchText.start,
													   startDate : new Date(controller.quickSearchText.start),
													   end : controller.quickSearchText.end,
													   endDate : new Date(controller.quickSearchText.end)};
				controller.loadData(isMore);
			}
			
		}		
		
		// Método que executa a busca avançada	
		this.loadDataAdvancedSearch = function(isMore) {
			
		    // valores default para o inicio e pesquisa
		    var where = '';
		    controller.lPaginate = false;
		    
		    // se não é busca de mais dados, inicializa o array de resultado
		    if (!isMore) {
		        controller.listResult = [];
		        controller.startAt = 1;
		    }
		    
		    // monta a lista de propriedades e valores a partir dos disclaimers
		    var parameters = [];
		    var properties = [];
		    var values = [];
			                        	
			controller.ttSelecaoConsultaAgenda = {
				cdTecnico: controller.tecnico,
				cEstabIni: controller.advancedSearch.initialEstabelec,   
				cEstabFim: controller.advancedSearch.finalEstabelec, 
				cPlanejadIni: controller.advancedSearch.initialPlanejador,   
			    cPlanejadFim: controller.advancedSearch.finalPlanejador,   
			    cEquipeIni: controller.advancedSearch.initialEquipe,   
			    cEquipeFim: controller.advancedSearch.finalEquipe,   
			    cTagIni: controller.advancedSearch.initialTag,
			    cTagFim: controller.advancedSearch.finalTag, 
			    cEquiptoIni: controller.advancedSearch.initialEquipto,   
			    cEquiptoFim: controller.advancedSearch.finalEquipto,   
			    iOrdIni: controller.advancedSearch.initialOrdem,     
			    iOrdFim: controller.advancedSearch.finalOrdem,
			    cEspecIni: controller.advancedSearch.initialEspec,      
			    cEspecFim: controller.advancedSearch.finalEspec,      
			    cUnidNegocIni: controller.advancedSearch.initialUnidNegoc,
			    cUnidNegocFim: controller.advancedSearch.finalUnidNegoc,
			    cTipoInicial: controller.advancedSearch.initialTipoManut,
			    cTipoFinal: controller.advancedSearch.finalTipoManut,
			    cdManutInicial: controller.advancedSearch.initialManut, 
			    cdManutFinal: controller.advancedSearch.finalManut,	                           
			    lPreventiva: controller.advancedSearch.lPreventiva,
			    lCorretiva: controller.advancedSearch.lCorretiva,
			    lPreditiva: controller.advancedSearch.lPreditiva,
			    lOutros: controller.advancedSearch.lOutros, 	            
			    lHoje: false, 
			    lTarefaAtrasada: controller.advancedSearch.lAtrasado, 
			    periodoInicial: new Date(controller.advancedSearch.dateRange.startDate).getTime(),
			    periodoFinal: new Date(controller.advancedSearch.dateRange.endDate).getTime(),
						        lAbertas: controller.advancedSearch.lEmDia,
						        lFechadas: controller.advancedSearch.lFinalizado,
						        lSomenteConflitos: controller.advancedSearch.lConflito,
						        startAt: controller.startAt,
						        limitAt: controller.limitAt};		

			auxtt = String(controller.ttSelecaoConsultaAgenda.iOrdIni).replace('.','');
			auxtt = auxtt.replace('.','');
			controller.ttSelecaoConsultaAgenda.iOrdIni = parseInt(auxtt);
			auxtt = String(controller.ttSelecaoConsultaAgenda.iOrdFim).replace('.','');
			auxtt = auxtt.replace('.','');
			controller.ttSelecaoConsultaAgenda.iOrdFim = parseInt(auxtt);			
			auxtt = String(controller.ttSelecaoConsultaAgenda.cTipoInicial).replace('.','');
			auxtt = auxtt.replace('.','');
			controller.ttSelecaoConsultaAgenda.cTipoInicial = parseInt(auxtt);
			auxtt = String(controller.ttSelecaoConsultaAgenda.cTipoFinal).replace('.','');
			auxtt = auxtt.replace('.','');
			controller.ttSelecaoConsultaAgenda.cTipoFinal = parseInt(auxtt);
	
			if (controller.tecnico != ""){
				controller.isHide = false;
				fchmpoagendaFactory.getListAgendaAdvancedSearch(controller.ttSelecaoConsultaAgenda, function(result){
					
					if (result) {	 	        								
						
						controller.iLengthPage = result.ttListAgenda.length;
						controller.lPaginate   = result['l-paginate'];
						
						if(!isMore)
							controller.totalRecords = controller.iLengthPage;
						else
							controller.totalRecords = controller.totalRecords + controller.iLengthPage;
						
					    // calcula o registro inicial da busca
					    if (controller.startAt == 1)
					    	controller.startAt = result['i-length-page'] + 1;
					    else
					    	controller.startAt = controller.startAt + result['i-length-page'];
						
						var auxDatAgenda = '';
				        // para cada item do result
				        angular.forEach(result.ttListAgenda, function (value) {
				            
				        	value.hraInicial = value.hraInicial.split(':');
				        	value.hraInicial = value.hraInicial[0] + ':' + value.hraInicial[1];
				        	
				            				        	
				        	value.hraFinal = value.hraFinal.split(':');
				        	value.hraFinal = value.hraFinal[0] + ':' + value.hraFinal[1];

				        	// adicionar o item na lista de resultado
				            controller.listResult.push(value);	  			    	        	
				        });
				        controller.isHide = true;
			        }
				});
			}else{
			    $rootScope.$broadcast(TOTVSEvent.showNotification, {
			        type: 'error',
				    title: $rootScope.i18n('l-attention'),
				    detail: $rootScope.i18n('msg-select-technician')
			    });       		
			}	        
		}		
		
		// define o objeto que servirá para a passagem de parâmetros para a tela de apontamento
		this.setParamAponta = function(param){
			
			helperLaborReport.data = {};
			
			helperLaborReport.data.cdTecnico = controller.tecnico;
			helperLaborReport.data.nrOrdem = param.nrOrdem;
			helperLaborReport.data.cdTarefa = param.cdTarefa;
			helperLaborReport.data.tpEspecial = param.tpEspecial;
			helperLaborReport.data.cdTurno = param.cdTurno;
			helperLaborReport.data.valDatHoraInvrtdaInicial = param.valDatHoraInvrtdaInicial;
			helperLaborReport.data.isDetalhe = "nao";
			helperLaborReport.data.datAgenda = param.datAgenda;
			helperLaborReport.data.hraInicial = param.hraInicial;
			helperLaborReport.data.hraFinal = param.hraFinal;
			
			$location.path('dts/mpo/agenda/laborreport/');
			
		}
		
		// define o objeto que servirá para a passagem de parâmetros para a tela de detalhe
		this.setParamDetail = function(param){
			
			helperLaborReport.data = {};
						
			helperLaborReport.data.cdTecnico = controller.tecnico;
			helperLaborReport.data.nrOrdem = param.nrOrdem;
			helperLaborReport.data.cdTarefa = param.cdTarefa;
			helperLaborReport.data.tpEspecial = param.tpEspecial;
			helperLaborReport.data.cdTurno = param.cdTurno;
			helperLaborReport.data.valDatHoraInvrtdaInicial = param.valDatHoraInvrtdaInicial;
			helperLaborReport.data.datAgenda = param.datAgenda;
			helperLaborReport.data.hraInicial = param.hraInicial;
			helperLaborReport.data.hraFinal = param.hraFinal;		
			helperLaborReport.data.isPlanejador = controller.isPlanejador;
			
			if (controller.infoTecnByUser == undefined)
				helperLaborReport.data.infoCdTecnico = "";
			else
				helperLaborReport.data.infoCdTecnico = controller.infoTecnByUser.cdTecnico;
			
			$location.path('dts/mpo/agenda/detail/');
			
		}
		
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
		
		this.init = function() {
			if (appViewService.startView(
				$rootScope.i18n('l-agenda-technician'), 
				'mpo.agenda.ListCtrl',
				controller
			)) {};
			
			controller.listSelectTecnico = [];
			
			if (controller.listSelectTecnicoAux.length > 0){ 
				controller.listSelectTecnico = controller.listSelectTecnicoAux;
			}else{
				fchmpoagendaFactory.getUserGroup($rootScope.currentuser.login,function(result){
					if (result){
						controller.isPlanejador = result.isPlanner;
						angular.forEach(result.ttListTecnico, function (value) {
							controller.infoTecnByUser = value;
			        	});

						if (controller.infoTecnByUser != undefined){
							controller.hifen = " - ";
							controller.tecnico = controller.infoTecnByUser.cdTecnico;
							controller.selectedTecnico = controller.infoTecnByUser;
						}
						else{
							controller.tecnico = "";
							controller.selectedTecnico = {
								nomeCompl : "",
								cdTecnico : ""
							}
						}
						
						controller.loadData(false);	
						
					}
				});
				
				fchmpoagendaFactory.getListTecnico(function(result){
	 	        	if (result) {
		                // para cada item do result
		                angular.forEach(result, function (value) {
		                    
		                    // adicionar o item na lista de resultado
		                    controller.listSelectTecnico.push(value);	                    
		                });
		                controller.listSelectTecnicoAux = controller.listSelectTecnico;
		            }
	 	        });
			}			
		}
		
		if ($rootScope.currentuserLoaded) { this.init(); }
		
		// *********************************************************************************
	    // *** Events Listeners
	    // *********************************************************************************
		
		$scope.$on('$destroy', function () {
			controller = undefined;
		});
		
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});
					
	}
	
	// *********************************************************************************
    // *** Controller Pesquisa Avançada
    // *********************************************************************************
	
	agendaSearchCtrl.$inject = [ 	    
 		'$modalInstance', 
 		'$scope',
 		'$filter',
 		'$rootScope',
 	    'model',
		'TOTVSEvent'];

	// controller da tela de busca avançada
 	function agendaSearchCtrl ($modalInstance,$scope,$filter,$rootScope,model,TOTVSEvent) {
 		
 		controller = this;
 		
 	    // recebe os dados de pesquisa atuais e coloca no controller
 	    this.advancedSearch = model;
 	    
	    this.closeOther = false;
	    $scope.oneAtATime = true;
	    
	    $scope.status = {
    	    isFirstOpen: true,
    	    isFirstDisabled: false
	    };
	    
	    this.changeInitialOrdem = function(){
	    	this.advancedSearch.initialOrdem = $filter('ordemFilter')(this.advancedSearch.initialOrdem);
	    }
	    this.changeFinalOrdem = function(){
	    	this.advancedSearch.finalOrdem = $filter('ordemFilter')(this.advancedSearch.finalOrdem);
	    }
	    this.changeInitialTipoManut = function(){
	    	this.advancedSearch.initialTipoManut = $filter('tipoManutFilter')(this.advancedSearch.initialTipoManut);
	    }
	    this.changeFinalTipoManut = function(){
	    	this.advancedSearch.finalTipoManut = $filter('tipoManutFilter')(this.advancedSearch.finalTipoManut);
	    }
	    
	    // ação de pesquisar
	    this.search = function () {
 	        // close é o fechamento positivo	    				
			if(!controller.advancedSearch.lEmDia && !controller.advancedSearch.lAtrasado && !controller.advancedSearch.lFinalizado){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
				    type: 'error',
				    title: ($rootScope.i18n('l-attention')),
				    detail: ($rootScope.i18n('msg-select-agenda-status'))
				});					
			}
			else if(controller.advancedSearch.dateRange.startDate == null || controller.advancedSearch.dateRange.endDate == null){		    		
	    		$rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'error',
	                title: $rootScope.i18n('l-attention'),
	                detail: $rootScope.i18n('msg-enter-period')
	            });  
			} else
				$modalInstance.close();
 	    }
 	      
 	    // ação de fechar
 	    this.close = function () {
 	        // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
 	        $modalInstance.dismiss();
 	    } 	    
 	     	    
 	}
 	
 	// controller da tela de enviar email
 	agendaSendEmailCtrl.$inject = ['$modalInstance', 
	 	                           '$scope',
	 	                           '$rootScope',
	 	                           '$filter',
	 	                           'model',
	 	                           'fchmpo.fchmpoagenda.Factory',
	 	                           'TOTVSEvent'];
 	
 	function agendaSendEmailCtrl ($modalInstance,$scope,$rootScope,$filter,model,fchmpoagenda,TOTVSEvent) {
 		
 		controller = this;
 		controller.params = {
			ttTecnEmail : {
				cdTecnico : "",     
			    nome : "",          
			    eMail: "",
			    assunto : "",       
			    cc : "",            
			    datCorte : new Date()      
			},
			ttAgendaVIEWAgenda : [{
				nome : "",
    			situacao : "",
    			hraInicial : "",
    			datAgenda : "",        
    			hraFinal : "",
    			nrOrdem : "",
    			descOrdem : "",
    			prioridade : "",
    			cdTarefa : "",
    			descTarefa : "", 
    			tpEspecial : "",
    			descEspecial : "",
    			cdTurno : "",     
    			descTurno : "",
    			cdTecnico : "",
    			codEstabel : "", 
    			estado : "",   
    			estadoTarefa : "",
    			scCodigo : ""				
			}]
    	};
 		controller.enviaEmail = {};
 		controller.bodyEmail = [];

 	    controller.enviaEmail.cdTecnico = $filter('tecnicoMask')(model.headerEmail.cdTecnico);
 		controller.enviaEmail.nome = model.headerEmail.nome;
 		controller.enviaEmail.email = model.headerEmail.email;

 	    controller.enviaEmail.assunto = $rootScope.i18n('l-agenda') + " " + controller.enviaEmail.cdTecnico + " " + controller.enviaEmail.nome;
 	    controller.enviaEmail.datCorte = new Date();
 	    
 	    // ação de pesquisar
 	    this.enviar = function () {
 	    	
 	        // close é o fechamento positivo 	    	
 	    	controller.params = {
    			ttTecnEmail : {
    				cdTecnico : controller.enviaEmail.cdTecnico,     
    			    nome : controller.enviaEmail.nome,          
    			    eMail : controller.enviaEmail.email,         
    			    assunto : controller.enviaEmail.assunto,       
    			    cc : controller.enviaEmail.copia,            
    			    datCorte : $filter('date')(controller.enviaEmail.datCorte, 'dd/MM/yyyy')
    			}
 	    	};
 	    	
 	    	if (controller.enviaEmail.copia == undefined)
 	    		controller.params.ttTecnEmail.cc = "";
 	    	
			controller.params.ttAgendaVIEWAgenda = model.bodyEmail;		
			angular.forEach(model.bodyEmail, function(value){
				controller.params.ttAgendaVIEWAgenda.push(value);
				controller.params.ttAgendaVIEWAgenda.datAgenda = $filter('date')(controller.params.ttAgendaVIEWAgenda.datAgenda, 'dd/MM/yyyy'); 
			});
 	    	
			fchmpoagenda.sendEmail(controller.params, function(result) {
 	    		if (!result.hasError)
        			controller.notify(result);	 
 	    	}); 
			
 	        $modalInstance.close();
 	    }
    	
 	    this.notify = function(result) {
	
			// notifica o usuario que conseguiu salvar o registro
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
			    type: 'success',
			    title: ($rootScope.i18n('l-attention')),
			    detail: ($rootScope.i18n('msg-email-success'))
			});
    	}
 	   
 	    // ação de fechar
 	    this.close = function () {
 	        // dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
 	        $modalInstance.dismiss();
 	    }
 	}
 
	index.register.controller('mpo.agenda.ListCtrl', agendaListCtrl);
	index.register.controller('mpo.agenda.SearchCtrl', agendaSearchCtrl);
	index.register.controller('mpo.agenda.SendEmailCtrl', agendaSendEmailCtrl);
	
	index.register.service('helperLaborReport',function(){
		// serviço para passagem de parametro
		return {
			data :{}
		};
	});	
});