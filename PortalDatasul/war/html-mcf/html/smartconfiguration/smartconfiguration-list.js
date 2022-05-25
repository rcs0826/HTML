define(['index',
		], function(index) {

	smartconfigurationListCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$modal',
		'$filter',
		'$location',
		'totvs.app-main-view.Service',
		'cfapi004.Factory', /*Api de integracao com o produto*/
		'totvs.app-notification.Service',
		'TOTVSEvent'
	];

	function smartconfigurationListCtrl($rootScope,
									 $scope,
									 $modal,
									 $filter,
									 $location,
									 appViewService,
									 cfapi004,
									 appNotificationService,
									 TOTVSEvent) {
	
		var controller = this;	
		this.disclaimers    = [];   // array que mantem a lista de filtros aplicados
		var quickSearchText = "";   // atributo que contem o valor da pesquisa rapida
		var createTab;
		var previousView;

		var day = new Date().getDate();
		var month = new Date().getMonth();
		var year = new Date().getFullYear(); 	     	    
		var startDate = new Date(year,(month - 1), 01);
		var endDate = new Date(year,month, day);

		controller.ttCotEstMastHTML = 
		[{
			itemCotacao  : "",
			numCFG       : 0,
			datCriacao   : "",
			userCriacao  : "",
			descricao    : "",
			indAprov     : 0,
			descItem     : "",
			cIndAprov    : "",
			rRowid       : ""
		}];

		controller.advancedSearch = {
				nrEstrutRange 	: {"start":0, "end":9999999},
				nrEstrutIni   	: 0,
				nrEstrutFim   	: 9999999,
				itemCotacaoRange: {"start":"", "end":"ZZZZZZZZZZZZZZZZ"},
				itemCotacaoIni	: '',
				itemCotacaoFim	: 'ZZZZZZZZZZZZZZZZ',
				usuCriacaoRange : {"start":"", "end":"ZZZZZZZZZZZZZZZZ"},
				usuCriacaoIni 	: '',
				usuCriacaoFim 	: 'ZZZZZZZZZZZZZZZZ',
				datCriacaoRange : {"startDate":startDate, "endDate":endDate},
				datCriacaoIni 	: startDate,
				datCriacaoFim 	: endDate,
				descricao     	: '',
				isAberto       	: true,
				isSuspenso     	: false,
				isEstrutAprov  	: false,
				isRotAprov     	: false,
				isProcAprov    	: false,
				accord        	: { selection: true,
	         		              	description: true,
	         		              	parameters: true}
		} 
		
		controller.ttAdvancedSearch = {
				nrEstrutIni     : 0,
				nrEstrutFim     : 9999999,
				itemCotacaoIni  : '',
				itemCotacaoFim  : 'ZZZZZZZZZZZZZZZZ',
				usuCriacaoIni   : '',
				usuCriacaoFim   : 'ZZZZZZZZZZZZZZZZ',
				datCriacaoIni	: startDate,
				datCriacaoFim   : endDate,
				descricao       : '',
				isAberto        : true,
				isSuspenso      : false,
				isEstrutAprov   : false,
				isRotAprov      : false,
				isProcAprov     : false
		}
		
		//var filter = "";

		this.loadData = function() {	
			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
				ttAdvancedSearch:controller.ttAdvancedSearch,
				ttCotEstMastHTML:controller.ttCotEstMastHTML,
				pTotRecord:0,
				logHasMore:false,
			};
			cfapi004.listaRecords(param, function(result) {
				controller.ttCotEstMastHTML	= result.ttCotEstMastHTML;
				controller.totalRecords 	= result.pTotRecord;
				controller.logHasMore = result.logHasMore;
				
				if(controller.logHasMore){
					controller.totalRecords += "+";

					appNotificationService.notify({
						type: 'info',
						title: ""+ $rootScope.i18n('l-attention') +"",
						size: 'md',
						detail: "" + $rootScope.i18n('l-alert500plus') +""
					});
				}
			});
			controller.addDisclaimers();
		}
		
		this.openConfiguration = function(){

			$location.url('dts/mcf/smartconfiguration/configuration///');

		}
		this.openReconfiguration = function(pItemCotacao, pNumCFG, pTpProcess){

			$location.path('dts/mcf/smartconfiguration/configuration/' + pItemCotacao + '/' + pNumCFG + '/' + pTpProcess);
		}
		

	    this.openAdvancedSearch = function() {
	    	controller.quickSearchText = "";
	    	
	        var modalInstance = $modal.open({
	        	templateUrl: '/dts/mcf/html/smartconfiguration/smartconfiguration.advanced.search.html',
	        	controller: 'mcf.smartconfiguration.SearchCtrl as controller',
	        	size: 'lg',
	        	resolve: {
	        		model: function () {
						//passa o objeto com os dados da pesquisa avancada para o modal	  
	        			return controller.advancedSearch;
	        		}	        	        
	        	}
			});
			
	        // quando o usuario clicar em pesquisar:
	        modalInstance.result.then(function () {

				controller.advancedSearch.datCriacaoIni = new Date(controller.advancedSearch.datCriacaoRange.startDate);
				controller.advancedSearch.datCriacaoFim = new Date(controller.advancedSearch.datCriacaoRange.endDate);
				
	        	controller.ttAdvancedSearch.nrEstrutIni     = controller.advancedSearch.nrEstrutRange.start;
	        	controller.ttAdvancedSearch.nrEstrutFim     = controller.advancedSearch.nrEstrutRange.end;
	        	controller.ttAdvancedSearch.itemCotacaoIni  = controller.advancedSearch.itemCotacaoRange.start;
	        	controller.ttAdvancedSearch.itemCotacaoFim  = controller.advancedSearch.itemCotacaoRange.end;
	        	controller.ttAdvancedSearch.usuCriacaoIni   = controller.advancedSearch.usuCriacaoRange.start;
	        	controller.ttAdvancedSearch.usuCriacaoFim   = controller.advancedSearch.usuCriacaoRange.end;
	        	controller.ttAdvancedSearch.datCriacaoIni   = controller.advancedSearch.datCriacaoIni;
	        	controller.ttAdvancedSearch.datCriacaoFim   = controller.advancedSearch.datCriacaoFim;
	        	controller.ttAdvancedSearch.descricao       = controller.advancedSearch.descricao;
	        	controller.ttAdvancedSearch.isAberto        = controller.advancedSearch.isAberto;
 	    		controller.ttAdvancedSearch.isSuspenso      = controller.advancedSearch.isSuspenso;	 	    
 	    		controller.ttAdvancedSearch.isEstrutAprov   = controller.advancedSearch.isEstrutAprov;
				controller.ttAdvancedSearch.isRotAprov      = controller.advancedSearch.isRotAprov;
				controller.ttAdvancedSearch.isProcAprov     = controller.advancedSearch.isProcAprov;

	            controller.loadData();
	        });
	    }
	
		this.formatDate = function (data) {
			myDate = new Date(data);
			dia = myDate.getDate();
			mes = myDate.getMonth() + 1;
			ano = myDate.getFullYear();

			var myNumber = 7;
			var formattedDia = ("0" + dia).slice(-2);
			var formattedMes = ("0" + mes).slice(-2);
			

			return formattedDia + '/' + formattedMes + '/' + ano;
		}

	    this.addDisclaimers = function() {	    	
	    	var busca  = '';
	    	
	        // reinicia os disclaimers
			controller.disclaimers = [];

	        // Data de criacao
	        if (controller.advancedSearch.datCriacaoIni && controller.advancedSearch.datCriacaoFim) {  
				var deateCriacao = this.formatDate(controller.advancedSearch.datCriacaoIni);
				deateCriacao = deateCriacao + " " + $rootScope.i18n('l-to') + " ";
				deateCriacao = deateCriacao + this.formatDate(controller.advancedSearch.datCriacaoFim);
	            
	            controller.addDisclaimer('dataCriacao', deateCriacao, $rootScope.i18n('l-creation-date') + ": " + deateCriacao);
			}
			// Item Configurado
			if (controller.advancedSearch.itemCotacaoRange.start != ""
				|| controller.advancedSearch.itemCotacaoRange.end != "ZZZZZZZZZZZZZZZZ") {

				var deate = controller.advancedSearch.itemCotacaoRange.start;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.itemCotacaoRange.end;
				
				controller.addDisclaimer('itemConfig', deate, $rootScope.i18n('l-item-configurado') + ": " + deate);
			}
			// Nr Configuracao
			if (controller.advancedSearch.nrEstrutRange.start != 0
				|| controller.advancedSearch.nrEstrutRange.end != 9999999) {

				var deate = controller.advancedSearch.nrEstrutRange.start;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.nrEstrutRange.end;
				
				controller.addDisclaimer('numConfig', deate, $rootScope.i18n('l-config') + ": " + deate);
			}
			// Usuario Criacao
			if (controller.advancedSearch.usuCriacaoRange.start != ""
				|| controller.advancedSearch.usuCriacaoRange.end != "ZZZZZZZZZZZZZZZZ") {

				var deate = controller.advancedSearch.usuCriacaoRange.start;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearch.usuCriacaoRange.end;
				
				controller.addDisclaimer('usuarioCriacao', deate, $rootScope.i18n('l-user-criacao') + ": " + deate);
			}
			// Aberto
			if (controller.advancedSearch.isAberto) {
				controller.addDisclaimer('isAberto', controller.advancedSearch.isAberto, $rootScope.i18n('l-open2'));
			}
			// Suspenso
			if (controller.advancedSearch.isSuspenso) {
				controller.addDisclaimer('isSuspenso', controller.advancedSearch.isSuspenso, $rootScope.i18n('l-suspended2'));
			}
			// Estrutura Aprovada
			if (controller.advancedSearch.isEstrutAprov) {
				controller.addDisclaimer('isEstrutAprov', controller.advancedSearch.isEstrutAprov, $rootScope.i18n('l-approved-structure'));
			}
			// Rotina Aprovada
			if (controller.advancedSearch.isRotAprov) {
				controller.addDisclaimer('isRotAprov', controller.advancedSearch.isRotAprov, $rootScope.i18n('l-approved-routing'));
			}
			// Suspenso
			if (controller.advancedSearch.isProcAprov) {
				controller.addDisclaimer('isProcAprov', controller.advancedSearch.isProcAprov, $rootScope.i18n('l-approved-process'));
			}
		}
	     // Adiciona um objeto na lista de disclaimers
		this.addDisclaimer = function (property, value, label) {
			controller.disclaimers.push({
				property: property,
				value: value,
				title: label
			});
		}

	    this.removeDisclaimer = function(disclaimer) {
	        // pesquisa e remove o disclaimer do array
	        var index = controller.disclaimers.indexOf(disclaimer);
	        
	        if (index != -1) {
	            controller.disclaimers.splice(index, 1);
	        }
			
	        // dependendo do disclaimer excluido, atualiza os dados do controller para atualizar a tela.
	        if (disclaimer.property == null)
	            controller.quickSearchText = '';
			
			if (disclaimer.property == 'dataCriacao') {
				if (   !controller.advancedSearch.isAberto
					&& !controller.advancedSearch.isSuspenso
					&& !controller.advancedSearch.isEstrutAprov
					&& !controller.advancedSearch.isRotAprov
					&& !controller.advancedSearch.isProcAprov){
					controller.advancedSearch.isAberto = true;
					controller.ttAdvancedSearch.isAberto  = controller.advancedSearch.isAberto;
				}

				controller.advancedSearch.datCriacaoIni = new Date(startDate);
				controller.advancedSearch.datCriacaoFim = new Date(endDate);
	        	controller.ttAdvancedSearch.datCriacaoIni   = controller.advancedSearch.datCriacaoIni;
	        	controller.ttAdvancedSearch.datCriacaoFim   = controller.advancedSearch.datCriacaoFim;
				
			}
			if (disclaimer.property == 'itemConfig') {
				controller.advancedSearch.itemCotacaoRange.start = "";
				controller.advancedSearch.itemCotacaoRange.end = "ZZZZZZZZZZZZZZZZ";
	        	controller.ttAdvancedSearch.itemCotacaoIni  = controller.advancedSearch.itemCotacaoRange.start;
	        	controller.ttAdvancedSearch.itemCotacaoFim  = controller.advancedSearch.itemCotacaoRange.end;
			}
			if (disclaimer.property == 'numConfig') {
				controller.advancedSearch.nrEstrutRange.start = 0;
				controller.advancedSearch.nrEstrutRange.end = 9999999;
	        	controller.ttAdvancedSearch.nrEstrutIni  	= controller.advancedSearch.nrEstrutRange.start;
	        	controller.ttAdvancedSearch.nrEstrutFim  	= controller.advancedSearch.nrEstrutRange.end;
			}
			if (disclaimer.property == 'usuarioCriacao') {
				controller.advancedSearch.usuCriacaoRange.start = "";
				controller.advancedSearch.usuCriacaoRange.end = "ZZZZZZZZZZZZZZZZ";
	        	controller.ttAdvancedSearch.usuCriacaoIni  = controller.advancedSearch.usuCriacaoRange.start;
	        	controller.ttAdvancedSearch.usuCriacaoFim  = controller.advancedSearch.usuCriacaoRange.end;
			}
			if (disclaimer.property == 'usuarioCriacao') {
				controller.advancedSearch.usuCriacaoRange.start = "";
				controller.advancedSearch.usuCriacaoRange.end = "ZZZZZZZZZZZZZZZZ";
	        	controller.ttAdvancedSearch.usuCriacaoIni  = controller.advancedSearch.usuCriacaoRange.start;
	        	controller.ttAdvancedSearch.usuCriacaoFim  = controller.advancedSearch.usuCriacaoRange.end;
			}
			if (disclaimer.property == 'isAberto') {
				controller.advancedSearch.isAberto = false;
	        	controller.ttAdvancedSearch.isAberto  = controller.advancedSearch.isAberto;
			}
			if (disclaimer.property == 'isSuspenso') {
				controller.advancedSearch.isSuspenso = false;
	        	controller.ttAdvancedSearch.isSuspenso  = controller.advancedSearch.isSuspenso;
			}
			if (disclaimer.property == 'isEstrutAprov') {
				controller.advancedSearch.isEstrutAprov = false;
	        	controller.ttAdvancedSearch.isEstrutAprov  = controller.advancedSearch.isEstrutAprov;
			}
			if (disclaimer.property == 'isRotAprov') {
				controller.advancedSearch.isRotAprov = false;
	        	controller.ttAdvancedSearch.isRotAprov  = controller.advancedSearch.isRotAprov;
			}
			if (disclaimer.property == 'isProcAprov') {
				controller.advancedSearch.isProcAprov = false;
	        	controller.ttAdvancedSearch.isProcAprov  = controller.advancedSearch.isProcAprov;
			}
		
			// limpa texto da pesquisa rapida
	        if (controller.quickSearchText) {
				controller.quickSearchText = "";
				controller.advancedSearch.nrEstrutRange.start 	 = 0;
				controller.advancedSearch.nrEstrutRange.end 	 = 9999999;
	        	controller.ttAdvancedSearch.nrEstrutIni  		 = controller.advancedSearch.nrEstrutRange.start;
	        	controller.ttAdvancedSearch.nrEstrutFim  		 = controller.advancedSearch.nrEstrutRange.end;
				controller.advancedSearch.itemCotacaoRange.start = "";
				controller.advancedSearch.itemCotacaoRange.end 	 = "ZZZZZZZZZZZZZZZZ";
	        	controller.ttAdvancedSearch.itemCotacaoIni  	 = controller.advancedSearch.itemCotacaoRange.start;
	        	controller.ttAdvancedSearch.itemCotacaoFim  	 = controller.advancedSearch.itemCotacaoRange.end;
	        }
	        
	        // recarrega os dados quando remove um disclaimer
	        controller.loadData();
	    }

	    this.search = function() {
	    	this.loadDataQuickSearch();
	    	this.addQuickSearchDisclaimer();
			
			if (!controller.quickSearchText) {
				controller.advancedSearch.nrEstrutRange.start 	 = 0;
				controller.advancedSearch.nrEstrutRange.end 	 = 9999999;
	        	controller.ttAdvancedSearch.nrEstrutIni  		 = controller.advancedSearch.nrEstrutRange.start;
	        	controller.ttAdvancedSearch.nrEstrutFim  		 = controller.advancedSearch.nrEstrutRange.end;
				controller.advancedSearch.itemCotacaoRange.start = "";
				controller.advancedSearch.itemCotacaoRange.end 	 = "ZZZZZZZZZZZZZZZZ";
	        	controller.ttAdvancedSearch.itemCotacaoIni  	 = controller.advancedSearch.itemCotacaoRange.start;
	        	controller.ttAdvancedSearch.itemCotacaoFim  	 = controller.advancedSearch.itemCotacaoRange.end;
			}
	    }	    

		this.addQuickSearchDisclaimer = function() {
			if (this.quickSearchText === "" || this.quickSearchText === undefined) {
				this.disclaimers = undefined;
			} else {
				var placeholder = $rootScope.i18n('l-quick-search');
				this.disclaimers = [{
					property : 'l-quick-search', 
					value : this.quickSearchText, 
					title : placeholder + ": " + this.quickSearchText
				}];
			}
		}

		this.loadDataQuickSearch = function() {
	        // valores default para o inicio e pesquisa
	        var startAt    = 0;
	        var where      = '';
	        var lBusca     = false;
	        var properties = [];
	        var values     = [];
	        var lNumbers   = false; 
	        
	        if (controller.quickSearchText){
	        	
	        	lNumbers = (controller.quickSearchText.match(/^[0-9]+$/) != null);
		        
	        	// Verificar tamanho do texto, porque numero de configuracao tem limite 7
	        	if (lNumbers && controller.quickSearchText.length > 7){
	        		lNumbers = false;
	        	}
	        	if (lNumbers) { // Numero
	        		controller.ttAdvancedSearch.nrEstrutIni    = controller.quickSearchText;
	        		controller.ttAdvancedSearch.nrEstrutFim    = controller.quickSearchText;
	        		controller.ttAdvancedSearch.itemCotacaoIni = '';
	        		controller.ttAdvancedSearch.itemCotacaoFim = 'ZZZZZZZZZZZZZZZZ';
	        	} else {
	        		controller.ttAdvancedSearch.itemCotacaoIni = controller.quickSearchText;
	        		controller.ttAdvancedSearch.itemCotacaoFim = controller.quickSearchText;
	        		controller.ttAdvancedSearch.nrEstrutIni    = 0
	        		controller.ttAdvancedSearch.nrEstrutFim    = 9999999;
	        	}
				
		        controller.loadData(); 
	        } else {
	        	controller.loadData();
	        }
		}	
		
		// Abrir Estrutura
		this.openStructure = function(pItemCotacao, pNumCFG) {

			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT 
				pItemCotacao:pItemCotacao,
				pNumCFG:pNumCFG
			};

			cfapi004.openStructure(param, function(result){
				if (result.$hasError){
					alert("Erro-61");
					if (controller.isModal) {
						alert("Erro-62");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-63");
						$window.history.back();
					}
					alert("Erro-64");
				}else if (result){
					if (result.length > 0){
						angular.forEach(result,function(resultErrors){
							controller.tgError = true;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						controller.loadData();
					}
				}
			});
		}
		// Abrir Roteiro
		this.openRouting = function(pItemCotacao, pNumCFG) {

			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT 
				pItemCotacao:pItemCotacao,
				pNumCFG:pNumCFG
			};

			cfapi004.openRouting(param, function(result){
				if (result.$hasError){
					alert("Erro-61");
					if (controller.isModal) {
						alert("Erro-62");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-63");
						$window.history.back();
					}
					alert("Erro-64");
				}else if (result){
					if (result.length > 0){
						angular.forEach(result,function(resultErrors){
							controller.tgError = true;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						controller.loadData();
					}
				}
			});
		}

		// Suspender
		this.toSuspendReative = function(pItemCotacao, pNumCFG) {
			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
				pItemCotacao:pItemCotacao,
				pNumCFG:pNumCFG
			};

			cfapi004.toSuspendReative(param, function(result){
				if (result.$hasError){
					alert("Erro-61");
					if (controller.isModal) {
						alert("Erro-62");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-63");
						$window.history.back();
					}
					alert("Erro-64");
				}else if (result){
					if (result.length > 0){
						angular.forEach(result,function(resultErrors){
							controller.tgError = true;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						controller.loadData();
					}
				}
			});
		}
		
		// Eliminar
		this.deleteConfiguration = function(pItemCotacao, pNumCFG) {
			
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
        		// Deseja eliminar configuracao 9999999 do item configurado ABCDEF ? 
				title: 'l-question',
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				text: '(25654) ' + $rootScope.i18n('l-confirm-delete-configuration', [pNumCFG, pItemCotacao]),
				callback: function (isPositiveResult) {
					
					if (isPositiveResult){
						
						var param = {
							pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
							pItemCotacao:pItemCotacao,
							pNumCFG:pNumCFG
						};

						cfapi004.deleteConfiguration(param, function(result){
							if (result.$hasError){
								alert("Erro-61");
								if (controller.isModal) {
									alert("Erro-62");
									$modalInstance.dismiss();
								}
								else {
									alert("Erro-63");
									$window.history.back();
								}
								alert("Erro-64");
							}else if (result){
								if (result.length > 0){
									angular.forEach(result,function(resultErrors){
										controller.tgError = true;
										if(resultErrors){
											var alert = {
												type: 'error',
												title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
												size: 'md',
												detail: resultErrors.ErrorDescription
											};
											appNotificationService.notify(alert);
										}
									});
								} else {
									controller.loadData();
								}
							}
						});
					}
				}
        	})
		}

		// Aprovar Estrutura
		this.approveStructure = function(pItemCotacao, pNumCFG) {
			
			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT 
				pItemCotacao:pItemCotacao,
				pNumCFG:pNumCFG
			};

			cfapi004.validateStructure(param, function(result){
				if (result.$hasError){
					alert("Erro-61");
					if (controller.isModal) {
						alert("Erro-62");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-63");
						$window.history.back();
					}
					alert("Erro-64");
				}else if (result){
					if (result.ttRowErrors.length > 0){
						angular.forEach(result.ttRowErrors,function(resultErrors){
							controller.tgError = true;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						switch (result.pResult) {
							case "FILHOS":
								$rootScope.$broadcast(TOTVSEvent.showQuestion, {
									// Deseja aprovar os filhos automaticamente? Para este processo ser aprovado, os seus filhos deverao star aprovados.
									title: 'l-question',
									cancelLabel: 'l-no',
									confirmLabel: 'l-yes',
									text: '(25873) ' + $rootScope.i18n('l-approve-compon-auto'),
									callback: function (isPositiveResult) {
										
										if (isPositiveResult){
											controller.efetivaStructure (pItemCotacao, pNumCFG);
										}
									}
								})
								break;
							case "ESTRUTURA":
								$rootScope.$broadcast(TOTVSEvent.showQuestion, {
									// A configuracao do item nao possui estrutura! Deseja aprovar assim?
									title: 'l-question',
									cancelLabel: 'l-no',
									confirmLabel: 'l-yes',
									text: '(26173) ' + $rootScope.i18n('l-approve-no-structure'), 
									callback: function (isPositiveResult) {
										if (isPositiveResult){
											controller.efetivaStructure (pItemCotacao, pNumCFG);
										}
									}
								})
								
								break;
							case "NOK":
								controller.efetivaStructure (pItemCotacao, pNumCFG);
								break;
							case "OK":
								controller.efetivaStructure (pItemCotacao, pNumCFG);
								break;
						}
					}
				}
			});
		}

		// Aprovar Estrutura
		controller.efetivaStructure = function(pItemCotacao, pNumCFG) {
			
			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
				pItemCotacao:pItemCotacao,
				pNumCFG:pNumCFG
			};

			cfapi004.approveStructure(param, function(result){
				if (result.$hasError){
					alert("Erro-61");
					if (controller.isModal) {
						alert("Erro-62");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-63");
						$window.history.back();
					}
					alert("Erro-64");
				}else if (result){
					if (result.length > 0){
						angular.forEach(result,function(resultErrors){
							controller.tgError = true;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						controller.loadData();
					}
				}
			});
		}

		// Aprovar Roteiro
		this.approveRouting = function(pItemCotacao, pNumCFG) {
			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
				pItemCotacao:pItemCotacao,
				pNumCFG:pNumCFG
			};

			cfapi004.validateRouting(param, function(result){
				if (result.$hasError){
					alert("Erro-61");
					if (controller.isModal) {
						alert("Erro-62");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-63");
						$window.history.back();
					}
					alert("Erro-64");
				}else if (result){
					if (result.ttRowErrors.length > 0){
						angular.forEach(result.ttRowErrors,function(resultErrors){
							controller.tgError = true;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						var resposta1 = false
						var resposta2 = false
						switch (result.pResult) {
							case "ROTEIRO+FILHOS":
								$rootScope.$broadcast(TOTVSEvent.showQuestion, {
									// A configuracao do item nao possui roteiro! Deseja aprovar  assim?
									title: 'l-question',
									cancelLabel: 'l-no',
									confirmLabel: 'l-yes',
									text: '(26173) ' + $rootScope.i18n('l-approve-no-routing'),
									callback: function (isPositiveResult1) {
										
										resposta1 = isPositiveResult1
										
										$rootScope.$broadcast(TOTVSEvent.showQuestion, {
											// Deseja aprovar os filhos automaticamente? Para este processo ser aprovado, os seus filhos deverao estar aprovados.
											title: 'l-question',
											cancelLabel: 'l-no',
											confirmLabel: 'l-yes',
											text: '(25873) ' + $rootScope.i18n('l-approve-compon-auto'),
											callback: function (isPositiveResult2) {
												
												resposta2 = isPositiveResult2
												
												if (resposta1 || resposta2){
													controller.efetivaRouting(pItemCotacao, pNumCFG, "ROTEIRO+FILHOS", resposta1, resposta2);
												}
											}
										})
									}
								})
								
								break;
							case "FILHOS":
								$rootScope.$broadcast(TOTVSEvent.showQuestion, {
									// Deseja aprovar os filhos automaticamente? Para este processo ser aprovado, os seus filhos deverao estar aprovados.
									title: 'l-question',
									cancelLabel: 'l-no',
									confirmLabel: 'l-yes',
									text: '(25873) ' + $rootScope.i18n('l-approve-compon-auto'),
									callback: function (isPositiveResult) {
										
										if (isPositiveResult){
											controller.efetivaRouting(pItemCotacao, pNumCFG, "FILHOS", true, true);
										}
									}
								})
								
								break;
							case "ROTEIRO":
								$rootScope.$broadcast(TOTVSEvent.showQuestion, {
									// A configuracao do item nao possui roteiro! Deseja aprovar assim?
									title: 'l-question',
									cancelLabel: 'l-no',
									confirmLabel: 'l-yes',
									text: '(26173) ' + $rootScope.i18n('l-approve-no-routing'),
									callback: function (isPositiveResult) {
										
										if (isPositiveResult){
											controller.efetivaRouting(pItemCotacao, pNumCFG, "ROTEIRO", true, true);
										}
									}
								})
								break;
							case "NOK": 
								controller.efetivaRouting(pItemCotacao, pNumCFG, "NOK", true, true);
								break;
								
							case "OK":
								controller.efetivaRouting(pItemCotacao, pNumCFG, "OK", true, true);
								break;
						}
					}
				}
			})
		}
		
		controller.atualizaVariaveisCusto = function(pItemCotacao, pNumCFG) {
			$location.path('dts/mcf/smartconfiguration/costvariable/' + pItemCotacao + '/' + pNumCFG);
		};


		controller.efetivaRouting = function(pItemCotacao, pNumCFG, pTipoRout, pQuestion1, pQuestion2) {
			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT 
				pItemCotacao:pItemCotacao,
				pNumCFG:pNumCFG,
				pTipoRout:pTipoRout,
				pQuestion1:pQuestion1,
				pQuestion2:pQuestion2
			};

			cfapi004.approveRouting(param, function(result){
				if (result.$hasError){
					alert("Erro-61");
					if (controller.isModal) {
						alert("Erro-62");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-63");
						$window.history.back();
					}
					alert("Erro-64");
				}else if (result){
					if (result.length > 0){
						angular.forEach(result,function(resultErrors){
							controller.tgError = true;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						controller.loadData();
					}
				}
			});
		}

		this.getUrlEncode = function(value) {
			return window.encodeURIComponent(value);
		};
		
		// Exporta para pedidos
		this.exportToOrder = function(pItemCotacao, pNumCFG) {
			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
				pItemCotacao:pItemCotacao,
				pNumCFG:pNumCFG
			};

			cfapi004.exportToOrderValid(param, function(result){
				if (result.$hasError){
					alert("Erro-61");
					if (controller.isModal) {
						alert("Erro-62");
						$modalInstance.dismiss();
					}
					else {
						alert("Erro-63");
						$window.history.back();
					}
					alert("Erro-64");
				}else if (result){
					if (result.ttRowErrors.length > 0){
						angular.forEach(result.ttRowErrors,function(resultErrors){
							controller.tgError = true;
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.ErrorNumber,
									size: 'md',
									detail: resultErrors.ErrorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					} else {
						if (result.pergunta == true){
							$rootScope.$broadcast(TOTVSEvent.showQuestion, {
								// Item do pedido atendido parcialmente. Continua exportacao ? 
								title: 'l-question',
								cancelLabel: 'l-no',
								confirmLabel: 'l-yes',
								text: '(28214) ' + $rootScope.i18n('l-continue-cf-export'),
								callback: function (isPositiveResult) {
									
									if (isPositiveResult){

										var param = {
											pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
											pItemCotacao:pItemCotacao,
											pNumCFG:pNumCFG
										};
										cfapi004.exportToOrder(param, function(result){})
									}
								}
							})
						} else {
							if (result.pergunta == false){
								var param = {
									pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
									pItemCotacao:pItemCotacao,
									pNumCFG:pNumCFG
								};
								cfapi004.exportToOrder(param, function(result){})
							}
						}
	
					}
				}
			})
		}
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************		
		this.init = function() {
			
			createTab = appViewService.startView($rootScope.i18n('l-productconfigured'), 'mcf.smartconfiguration.ListCtrl', controller);
			previousView = appViewService.previousView;
			
			if (previousView.controller == 'mcf.smartconfiguration.ConfigurationCtrl')
				appViewService.removePageById(appViewService.previousId);
			
			if (previousView.controller) {			
				// Validacao para nao recarregar os dados ao trocar de aba
				if (createTab === false) {
	                return;
				}
			}							
			controller.loadData();
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
    // *** Controller Pesquisa Avancada
    // *********************************************************************************	
	smartconfigurationSearchCtrl.$inject = [ 	    
		'$modalInstance', 
		'$scope',
		'model',
		'$filter'];
	
	function smartconfigurationSearchCtrl ($modalInstance,$scope,model,$filter) {
					   
		this.advancedSearch = model;
		
	   this.closeOther = false;
	   $scope.oneAtATime = true;
	   
	   $scope.status = {
		   isFirstOpen: true,
		   isFirstDisabled: false
	   };
	   
	   this.changeNrEstrutIni = function(){
		   model.nrEstrutIni = $filter('numberOnly')(model.nrEstrutIni);	
	   }
	   
	   this.changeNrEstrutFim = function(){
		   model.nrEstrutFim = $filter('numberOnly')(model.nrEstrutFim);
	   }

		// acao de pesquisar
		this.search = function () {
			
			// close o fechamento positivo
			$modalInstance.close();
		}
		 
		// acao de fechar
		this.close = function () {
			// dismissao fechamento quando cancela ou quando clicar fora do modal (ESC)
			$modalInstance.dismiss();
		}
	}	

	index.register.controller('mcf.smartconfiguration.ListCtrl', smartconfigurationListCtrl);
	index.register.controller('mcf.smartconfiguration.SearchCtrl', smartconfigurationSearchCtrl);
			
});

//

