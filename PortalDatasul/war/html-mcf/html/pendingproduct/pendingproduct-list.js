define(['index',
		'/dts/mcf/html/pendingproduct/pendingproduct-informConfiguration.js'
		], function(index) {

	pendingproductListCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$modal',
		'$filter',
		'$location',
		'totvs.app-main-view.Service',
		'mcf.pendingproduct.informConfiguration.modal',
		'cfapi004.Factory', /*Api de integracao com o produto*/
		'TOTVSEvent'
	];
	
	function pendingproductListCtrl($rootScope,
									 $scope,
									 $modal,
									 $filter,
									 $location,
									 appViewService,
									 modalInformConfiguration,
									 cfapi004,
									 TOTVSEvent) {
	
		var controller = this;	
		this.disclaimers    = [];   // array que mantem a lista de filtros aplicados
		var quickSearchText = "";   // atributo que contem o valor da pesquisa rapida
		var createTab;
		var previousView;

		controller.ttCotPendHTML = 
		[{
			itemCotacao : "",
			nrSequencia : 0,
			numCFG      : 0,
			nrPedido    : 0,
			nomeAbrev  	: "",
			origem  	: ""
		}];

		controller.advancedSearchPendencia = {
				itemCotacaoRange	: {"start":"", "end":"ZZZZZZZZZZZZZZZZ"},
				itemCotacaoIni		: '',
				itemCotacaoFim		: 'ZZZZZZZZZZZZZZZZ',
				nomeAbrevRange		: {"start":"", "end":"ZZZZZZZZZZZZ"},
				nomeAbrevIni		: '',
				nomeAbrevFim		: 'ZZZZZZZZZZZZ',
				unidNegocRange		: {"start":"", "end":"ZZZ"},
				unidNegocIni		: '',
				unidNegocFim		: 'ZZZ',
				nrPedidoRange		: {"start":0, "end":999999999},
				nrPedidoIni			: 0,
				nrPedidoFim			: 999999999,
				accord 				: { selection	: true,
	         		   					description	: true,
	         		   					parameters	: true}
		}
		
		controller.ttAdvancedSearchPendencia = {
				itemCotacaoIni	: '',
				itemCotacaoFim	: 'ZZZZZZZZZZZZZZZZ',
				nomeAbrevIni	: '',
				nomeAbrevFim	: 'ZZZZZZZZZZZZ',
				unidNegocIni	: '',
				unidNegocFim	: 'ZZZ',
				nrPedidoIni		: 0,
				nrPedidoFim		: 999999999
		}

		this.loadData = function() {				
			
			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
				ttAdvancedSearchPendencia:controller.ttAdvancedSearchPendencia,
				ttCotPendHTML:controller.ttCotPendHTML
			};
			cfapi004.listaPendenciaRecords(param, function(result) {
				controller.ttCotPendHTML	= result.ttCotPendHTML;
				controller.totalRecords 	= result.pTotRecord;
				controller.logHasMore 		= result.logHasMore;
				
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
		
	    this.openAdvancedSearch = function() {
	    	controller.quickSearchText = "";
	    	
	        var modalInstance = $modal.open({
	        	templateUrl: '/dts/mcf/html/pendingproduct/pendingproduct.advanced.search.html',
	        	controller: 'mcf.pendingproduct.SearchCtrl as controller',
	        	size: 'md',
	        	resolve: {
	        		model: function () {
	        			//passa o objeto com os dados da pesquisa avancada para o modal	  
	        			return controller.advancedSearchPendencia;
	        		}	        	        
	        	}
			});
			
	        // quando o usuario clicar em pesquisar:
	        modalInstance.result.then(function () {
	        	controller.ttAdvancedSearchPendencia.itemCotacaoIni  = controller.advancedSearchPendencia.itemCotacaoRange.start;
	        	controller.ttAdvancedSearchPendencia.itemCotacaoFim  = controller.advancedSearchPendencia.itemCotacaoRange.end;
	        	controller.ttAdvancedSearchPendencia.nomeAbrevIni    = controller.advancedSearchPendencia.nomeAbrevRange.start;
	        	controller.ttAdvancedSearchPendencia.nomeAbrevFim    = controller.advancedSearchPendencia.nomeAbrevRange.end;
	        	controller.ttAdvancedSearchPendencia.unidNegocIni    = controller.advancedSearchPendencia.unidNegocRange.start;
	        	controller.ttAdvancedSearchPendencia.unidNegocFim    = controller.advancedSearchPendencia.unidNegocRange.end;
	        	controller.ttAdvancedSearchPendencia.nrPedidoIni     = controller.advancedSearchPendencia.nrPedidoRange.start;
	        	controller.ttAdvancedSearchPendencia.nrPedidoFim     = controller.advancedSearchPendencia.nrPedidoRange.end;
	 	    	
	            controller.loadData();
	        });
	    }
	    
	    this.addDisclaimers = function() {	    	
	    	var busca  = '';
	    	
	        // reinicia os disclaimers
	    	controller.disclaimers = [];
	    	
			// Item Configurado
			if (controller.advancedSearchPendencia.itemCotacaoRange.start != ""
				|| controller.advancedSearchPendencia.itemCotacaoRange.end != "ZZZZZZZZZZZZZZZZ") {

				var deate = controller.advancedSearchPendencia.itemCotacaoRange.start;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearchPendencia.itemCotacaoRange.end;
				
				controller.addDisclaimer('itemConfig', deate, $rootScope.i18n('l-item-from') + ": " + deate);
			}
			// Nome Abreviados
			if (controller.advancedSearchPendencia.nomeAbrevRange.start != ""
				|| controller.advancedSearchPendencia.nomeAbrevRange.end != "ZZZZZZZZZZZZ") {

				var deate = controller.advancedSearchPendencia.nomeAbrevRange.start;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearchPendencia.nomeAbrevRange.end;
				
				controller.addDisclaimer('nomeAbrev', deate, $rootScope.i18n('l-customer-from') + ": " + deate);
			}
			// Nome Abreviados
			if (controller.advancedSearchPendencia.unidNegocRange.start != ""
				|| controller.advancedSearchPendencia.unidNegocRange.end != "ZZZ") {

				var deate = controller.advancedSearchPendencia.unidNegocRange.start;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearchPendencia.unidNegocRange.end;
				
				controller.addDisclaimer('unidNegoc', deate, $rootScope.i18n('l-business-unit-from') + ": " + deate);
			}
			// Nome Abreviados
			if (controller.advancedSearchPendencia.nrPedidoRange.start != 0
				|| controller.advancedSearchPendencia.nrPedidoRange.end != 999999999) {

				var deate = controller.advancedSearchPendencia.nrPedidoRange.start;
				deate = deate + " " + $rootScope.i18n('l-to') + " ";
				deate = deate + controller.advancedSearchPendencia.nrPedidoRange.end;
				
				controller.addDisclaimer('nrPedido', deate, $rootScope.i18n('l-pedido-from') + ": " + deate);
			}

	    }
	    
	    this.addDisclaimer = function(property, value, label) {
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
			
			if (disclaimer.property == 'itemConfig') {
				controller.advancedSearchPendencia.itemCotacaoRange.start 	= "";
				controller.advancedSearchPendencia.itemCotacaoRange.end		= "ZZZZZZZZZZZZZZZZ"
				controller.ttAdvancedSearchPendencia.itemCotacaoIni   		= controller.advancedSearchPendencia.itemCotacaoRange.start;
				controller.ttAdvancedSearchPendencia.itemCotacaoFim   		= controller.advancedSearchPendencia.itemCotacaoRange.end;
			}
			if (disclaimer.property == 'nomeAbrev') {
				controller.advancedSearchPendencia.nomeAbrevRange.start = "";
				controller.advancedSearchPendencia.nomeAbrevRange.end 	= "ZZZZZZZZZZZZ";
				controller.ttAdvancedSearchPendencia.nomeAbrevIni   		= controller.advancedSearchPendencia.nomeAbrevRange.start;
				controller.ttAdvancedSearchPendencia.nomeAbrevFim   		= controller.advancedSearchPendencia.nomeAbrevRange.end;
			}

			if (disclaimer.property == 'unidNegoc') {
				controller.advancedSearchPendencia.unidNegocRange.start = "";
				controller.advancedSearchPendencia.unidNegocRange.end	="ZZZ";
				controller.ttAdvancedSearchPendencia.unidNegocIni   	= controller.advancedSearchPendencia.unidNegocRange.start;
				controller.ttAdvancedSearchPendencia.unidNegocFim   	= controller.advancedSearchPendencia.unidNegocRange.end;
			}
			if (disclaimer.property == 'nrPedido') {
				controller.advancedSearchPendencia.nrPedidoRange.start 	= 0;
				controller.advancedSearchPendencia.nrPedidoRange.end 	= 999999999;
				controller.ttAdvancedSearchPendencia.nrPedidoIni   		= controller.advancedSearchPendencia.nrPedidoRange.start;
				controller.ttAdvancedSearchPendencia.nrPedidoFim   		= controller.advancedSearchPendencia.nrPedidoRange.end;

			}
					
	        // limpa texto da pesquisa rapida
	        if (controller.quickSearchText) {
	        	controller.quickSearchText = "";
				controller.advancedSearchPendencia.nrPedidoIni       = 0;
				controller.advancedSearchPendencia.nrPedidoFim       = 999999999;
				controller.ttAdvancedSearchPendencia.nrPedidoIni    = controller.advancedSearchPendencia.nrPedidoIni;
				controller.ttAdvancedSearchPendencia.nrPedidoFim    = controller.advancedSearchPendencia.nrPedidoFim;
				controller.advancedSearchPendencia.nomeAbrevIni      = '';
				controller.advancedSearchPendencia.nomeAbrevFim      = 'ZZZZZZZZZZZZ';
				controller.ttAdvancedSearchPendencia.nomeAbrevIni    = controller.advancedSearchPendencia.nomeAbrevIni;
				controller.ttAdvancedSearchPendencia.nomeAbrevFim    = controller.advancedSearchPendencia.nomeAbrevFim;
			}

	        controller.loadData();
	    }

	    this.search = function() {
	    	this.loadDataQuickSearch();
	    	this.addQuickSearchDisclaimer();
			
			if (!controller.quickSearchText) {
				controller.advancedSearchPendencia.nrPedidoIni       = 0;
				controller.advancedSearchPendencia.nrPedidoFim       = 999999999;
				controller.ttAdvancedSearchPendencia.nrPedidoIni    = controller.advancedSearchPendencia.nrPedidoIni;
				controller.ttAdvancedSearchPendencia.nrPedidoFim    = controller.advancedSearchPendencia.nrPedidoFim;
				controller.advancedSearchPendencia.nomeAbrevIni      = '';
				controller.advancedSearchPendencia.nomeAbrevFim      = 'ZZZZZZZZZZZZ';
				controller.ttAdvancedSearchPendencia.nomeAbrevIni    = controller.advancedSearchPendencia.nomeAbrevIni;
				controller.ttAdvancedSearchPendencia.nomeAbrevFim    = controller.advancedSearchPendencia.nomeAbrevFim;
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
		

		this.openConfiguration = function(cItemCotacao, cNrEstrut, pTpProcess){
			
			$location.path('dts/mcf/smartconfiguration/configuration/' + cItemCotacao + '/' + cNrEstrut + '/' + pTpProcess );

		}

		this.loadDataQuickSearch = function() {
	        // valores default para o inicio e pesquisa
	        var startAt    = 0;
	        var where      = '';
	        var lBusca     = false;
	        var properties = [];
	        var values     = [];
			
	        if (controller.quickSearchText){
	        	
	        	lNumbers = (controller.quickSearchText.match(/^[0-9]+$/) != null);
		        
		        // Verificar tamanho do texto, porque numero de configuracao tem limite 7
	        	if (lNumbers && controller.quickSearchText.length > 9){
	        		lNumbers = false;
	        	}
	        	
				if (lNumbers) { // Numero
	        		controller.ttAdvancedSearchPendencia.nrPedidoIni    = controller.quickSearchText;
	        		controller.ttAdvancedSearchPendencia.nrPedidoFim    = controller.quickSearchText;
	        		controller.ttAdvancedSearchPendencia.nomeAbrevIni 	= '';
	        		controller.ttAdvancedSearchPendencia.nomeAbrevFim 	= 'ZZZZZZZZZZZZ';
	        	} else {
	        		controller.ttAdvancedSearchPendencia.nomeAbrevIni = controller.quickSearchText;
	        		controller.ttAdvancedSearchPendencia.nomeAbrevFim = controller.quickSearchText;
	        		controller.ttAdvancedSearchPendencia.nrPedidoIni     = 0;
	        		controller.ttAdvancedSearchPendencia.nrPedidoFim     = 999999999;
	        	}
		        
				// monta os parametros para o service

		        controller.loadData(); 
	        } else {
	        	controller.loadData();
	        }
	    }

		this.deletePending = function(cNomeAbrev, iNrPedido, iNrSequencia){
			
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
        		// Confirma eliminacao da pendencia?
				title: 'l-question',
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				text: $rootScope.i18n('l-delete-pending'),
				callback: function (isPositiveResult) {
					
					if (isPositiveResult){

						var param = {
							pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
							pNomeAbrev:cNomeAbrev,
							pNrPedido:iNrPedido,
							pNrSequencia:iNrSequencia
						};
						cfapi004.deletePending(param, function(result) {
							controller.loadData();
						})
					}
				}
			})			
		}
		
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************		
		this.init = function() {
			
			createTab = appViewService.startView($rootScope.i18n('l-pendingproduct'), 'mcf.pendingproduct.ListCtrl', controller);
			previousView = appViewService.previousView;
			
			if (previousView.controller) {		
	            // Validacao para nao recarregar os dados ao trocar de aba
				if (createTab === false && previousView.controller !== "mcf.pendingproduct.DetailCtrl") {
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
	pendingproductSearchCtrl.$inject = [ 	    
 		'$modalInstance', 
 		'$scope',
 	    'model',
 	    '$filter'];
 	
 	function pendingproductSearchCtrl ($modalInstance,$scope,model,$filter) {
 	      		 	
 	    // recebe os dados de pesquisa atuais e coloca no controller
 	    this.advancedSearchPendencia = model;
 	    
	    this.closeOther = false;
	    $scope.oneAtATime = true;
	    
	    $scope.status = {
    	    isFirstOpen: true,
    	    isFirstDisabled: false
	    };

 	    // acao de pesquisar
 	    this.search = function () {
 	    	
 	        // close e o fechamento positivo
 	        $modalInstance.close();
 	    }
 	     
 	    // acao de fechar
 	    this.close = function () {
 	        // dismiss e o fechamento quando cancela ou quando clicar fora do modal (ESC)
 	        $modalInstance.dismiss();
 	    }
 	}

 	index.register.controller('mcf.pendingproduct.ListCtrl', pendingproductListCtrl);
	index.register.controller('mcf.pendingproduct.SearchCtrl', pendingproductSearchCtrl);
			
});