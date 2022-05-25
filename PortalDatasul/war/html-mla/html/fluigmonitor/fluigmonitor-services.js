define([
	'index',
	'/dts/mla/js/api/mlaapi016.js'
], function(index) {	
	
	// #############################################################################################
	// ### CONTROLLER LISTAGEM - Listagem dos erros de integração MLA X Fluig
	// #############################################################################################
	fluigMonitorListController.$inject = ['$rootScope', '$stateParams', '$state', '$modal', '$scope', 'totvs.app-main-view.Service', 'mla.mlaapi016.Factory', 'mla.fluigmonitor.ModalAdvancedSearch', 'toaster','customization.generic.Factory', '$injector', '$timeout', '$totvsprofile', '$filter', 'TOTVSEvent'];
	function fluigMonitorListController($rootScope, $stateParams, $state, $modal, $scope, appViewService, mlaapi016, modalFluigMonitorAdvancedSearch, toaster, customizationService, $injector, $timeout, $totvsprofile, $filter, TOTVSEvent) {
		var fluigMonitorListCtrl = this;
		
		fluigMonitorListCtrl.modelListCount = 0;
		fluigMonitorListCtrl.completeModel = {};
		fluigMonitorListCtrl.modelList = [];
		fluigMonitorListCtrl.basicFilter = '';
		fluigMonitorListCtrl.disclaimers = [];
		fluigMonitorListCtrl.currentuser = undefined;
		fluigMonitorListCtrl.filters = {};
		fluigMonitorListCtrl.orderby =  [{title:$rootScope.i18n('l-generation-date'), property:"nr-trans", asc:false, default:true},
										 {title:$rootScope.i18n('l-document'), property:"cdn-tip-docto"},
										 {title:$rootScope.i18n('l-error-type'), property:"cdn-tip-erro"},
										 {title:$rootScope.i18n('l-document-key'), property:"cod-chave-docto"}];	
		fluigMonitorListCtrl.processRelatedErrors = false;
		fluigMonitorListCtrl.selectedOrderBy = this.orderby[0];

		/* 
		 * Objetivo: Executar os métodos iniciais da tela
		 * Parâmetros:
		 * Observações: Este é o primeiro método que é executado quando a tela é aberta.
		 */
		fluigMonitorListCtrl.init = function(){

			/*Cria a aba para essa tela*/
			createTab = appViewService.startView($rootScope.i18n('l-integration-pendencies-mla-fluig-plural'), 'mla.fluigMonitor.ListCtrl', fluigMonitorListCtrl);
            previousView = appViewService.previousView;
            
            /*Impede o carregamento da tela ao trocar de abas*/
            if(	createTab === false){
            	return;
        	}
        	fluigMonitorListCtrl.currentuser = $rootScope.currentuser.login;
        	// Carrega as preferências do usuário e a lista de requisições
	        $totvsprofile.remote.get('/dts/mla/fluigmonitor', 'processRelatedErrors', function(result) {
        		if(result[0]) {
	        		fluigMonitorListCtrl.processRelatedErrors = result[0].dataValue;
	        	} else {
	        		fluigMonitorListCtrl.processRelatedErrors = true;	
	        	}
			});

            fluigMonitorListCtrl.loadComplete = false;

            fluigMonitorListCtrl.integrationErrors = [];
            fluigMonitorListCtrl.selected = [];

            fluigMonitorListCtrl.loadDefaults();
            fluigMonitorListCtrl.load(false);
			
			customizationService.callEvent('mla.fluigMonitor', 'initEvent', fluigMonitorListCtrl);
		};		

		/* 
		 * Objetivo: Carregar as informações padrões de inicialização da tela.
		 * Parâmetros:
		 * Observações: Carrega os parâmetros padrões da tela: filtro rápido, filtros, ordenação
		 */

		fluigMonitorListCtrl.loadDefaults = function(){

			fluigMonitorListCtrl.disclaimers.push(modelToDisclaimer('sendError', 'l-send-error'));
			fluigMonitorListCtrl.disclaimers.push(modelToDisclaimer('handlingError', 'l-handling-error'));
			fluigMonitorListCtrl.disclaimers.push(modelToDisclaimer('cancelError', 'l-cancel-error'));
			
		};
		/* 
		 * Objetivo: buscar as informações no ERP
		 * Parâmetros:
		 * Observações: - getDocumentosDoUsuario - Busca o nome dos documentos 						
		 */
		fluigMonitorListCtrl.load = function(isMore){
			var parameter = [];	
			var parameters = new Object();

			// Configurações dos parâmetros utilizados na busca
			parameters.sortBy = this.selectedOrderBy.property;
			parameters.orderAsc  = this.selectedOrderBy.asc;
			parameters.basicFilter = this.basicFilter;		
			parameters.rLastIntegrationErrorRowid     = isMore ? fluigMonitorListCtrl.completeModel.rLastIntegrationErrorRowid   : undefined;
			parameters.rLastUnintegratedPendencyRowid = isMore ? fluigMonitorListCtrl.completeModel.rLastUnintegratedPendencyRowid   : undefined;
			
			// Transforma os disclaimers em parâmetros para a api
		   	angular.forEach(fluigMonitorListCtrl.disclaimers, function(disclaimer) {
		   		if(typeof disclaimer.value == "string" && disclaimer.value.indexOf("&nbsp;") > -1) { /* Ranges */
			   		parameter = getParameterFromDisclaimer(disclaimer.property);
		   			if(parameter) {		   				
			   			parameters[disclaimer.property + 'Ini'] = parameter[0];	
			   			parameters[disclaimer.property + 'End'] = parameter[1];	
		   			}
		   		} else { /* Campos normais */ 
					parameters[disclaimer.property] = disclaimer.value;
		   		}
            });

            var procedureParameters = {};
	   		procedureParameters.ttListParameters = parameters;
	   		procedureParameters.currentTTIntegrationErrorsList = [];

	   		if(isMore) {	   			
	   			this.modelList.forEach(function(integrationError){
   					procedureParameters.currentTTIntegrationErrorsList.push({'cdn-seq': integrationError['cdn-seq'], 
   																			 'nr-trans' : integrationError['nr-trans'],
   																			 'cdn-tip-erro' : integrationError['cdn-tip-erro']});
	   			});
	   		}

	   		mlaapi016.getListIntegrationErrors({}, procedureParameters, function(result) {	
	            if(result['ttIntegrationErrors']) {
	            	
	            	fluigMonitorListCtrl.completeModel = result;
	            	if(isMore){
            			fluigMonitorListCtrl.modelList = $.merge(fluigMonitorListCtrl.modelList, result['ttIntegrationErrors']);
	            	}else{
	            		fluigMonitorListCtrl.modelList = result['ttIntegrationErrors'];	            			
	            	}        			
        			fluigMonitorListCtrl.modelListCount = result.iCount;
	            } else {
	            	fluigMonitorListCtrl.modelListCount = 0;
	            }
	        });
		};

		/* 
		 * Objetivo: Remover um filtro aplicado na consulta
		 * Parâmetros: disclaimer: objeto do filtro a ser removido
		 * Observações: 
		 */
		fluigMonitorListCtrl.removeDisclaimer = function(disclaimer) {
			var index = fluigMonitorListCtrl.disclaimers.indexOf(disclaimer);
			var hasDefaultValue = false;
			if (index != -1) {				
		   		
		   		fluigMonitorListCtrl.disclaimers.splice(index,1);
		   		if(disclaimer.property == 'unintegrated'){
		   			fluigMonitorListCtrl.loadDefaults();
		   		}
		   		fluigMonitorListCtrl.load(false);
			}	   		
		}

		/* 
		 * Objetivo: Abre a modal de pesquisa avançada
		 * Parâmetros: 
		 * Observações: 
		 */
		fluigMonitorListCtrl.openAdvancedSearch = function(){
	        var modalInstance = modalFluigMonitorAdvancedSearch.open({disclaimers: fluigMonitorListCtrl.disclaimers})
	        	.then(function(result) {
	        		fluigMonitorListCtrl.advancedSearchFilters = result;
	    			fluigMonitorListCtrl.parseModelToDisclaimer(result);
	    			fluigMonitorListCtrl.load(false);
    		});
		}

		/* 
		 * Objetivo: Transforma os parâmetros recebidos da modal (pesquisa avançada)
		 * Parâmetros: filters - parâmetros recebidos da modal
		 * Observações: 
		 */

		this.parseModelToDisclaimer = function(filters){
			fluigMonitorListCtrl.disclaimers = [];			

			for (key in filters) {
				var model = filters[key];
				var disclaimer = {};				


				switch(key){
					case 'sendError':
						if(model) fluigMonitorListCtrl.disclaimers.push(modelToDisclaimer(key, 'l-send-error'));
						break;
					case 'handlingError':
						if(model) fluigMonitorListCtrl.disclaimers.push(modelToDisclaimer(key, 'l-handling-error'));
						break;
					case 'cancelError':
						if(model) fluigMonitorListCtrl.disclaimers.push(modelToDisclaimer(key, 'l-cancel-error'));
						break;
					case 'unintegrated':
						if(model) fluigMonitorListCtrl.disclaimers.push(modelToDisclaimer(key, 'l-unintegrated'));
						break;
					case 'transactionNumber':
						if(model.start || model.end) {
							disclaimer = modelToDisclaimer(key, 'l-transaction', model.start, model.end);
							disclaimer.hide = ((!model.start || model.start == "") && 
								model.end.toUpperCase() == "999999999") ? true : false;
							fluigMonitorListCtrl.disclaimers.push(disclaimer);
						}
						break;
					case 'documentCode':
						if(model.start || model.end) {
							disclaimer = modelToDisclaimer(key, 'l-document-code', model.start, model.end);
							disclaimer.hide = ((!model.start || model.start == "") && 
								model.end.toUpperCase() == "999") ? true : false;
							fluigMonitorListCtrl.disclaimers.push(disclaimer);
						}
						break;
					case 'generationDate':
						if(model.start || model.end) {
							disclaimer = modelToDisclaimer(key, 'l-generation', model.start, model.end, undefined, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc'));
							fluigMonitorListCtrl.disclaimers.push(disclaimer);
						}
						break;
					case 'approvalDate':
						if(model.start || model.end) {
							disclaimer = modelToDisclaimer(key, 'l-approval', model.start, model.end, undefined, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc'));
							fluigMonitorListCtrl.disclaimers.push(disclaimer);
						}
						break;
					case 'rejectionDate':
						if(model.start || model.end) {
							disclaimer = modelToDisclaimer(key, 'l-rejection', model.start, model.end, undefined, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc'));
							fluigMonitorListCtrl.disclaimers.push(disclaimer);
						}
						break;
					case 'approvalUser':
						if(model.start || model.end) {
							disclaimer = modelToDisclaimer(key, 'l-approver', model.start, model.end);
							disclaimer.hide = ((!model.start || model.start == "") && 
								model.end.toUpperCase() == "ZZZZZZZZZZZZ") ? true : false;
							fluigMonitorListCtrl.disclaimers.push(disclaimer);
						}
						break;
					case 'documentKey':
						if(model.start){
							disclaimer = modelToDisclaimer(key, 'l-document-key', model.start);
							var documentKey = "";
							for (idx in model.start) {
								documentKey += model.start[idx];
							}
							disclaimer.hide = (documentKey == "")  ? true : false;

							fluigMonitorListCtrl.disclaimers.push(disclaimer);
						}

						break;
				}	
			}
		}		
		/* Cria um disclaimer a partir das informações recebidas 
		* property: nome do disclaimer
		* title: Título do disclaimer (será exibido em tela)
		* start: valor inicial
		* end: valor final
		* unique: Identifica se o disclaimer é uma faixa ou não
		* filter: filtro customozida para o disclaimer ex: date, number
		* format: formato a ser utilizado no filtro
		* fixed: identifica se o disclaimer será fixo ou não
		*/
		function modelToDisclaimer(property, title, start, end, unique, filter, format, fixed) {			
			var disclaimer = {};
			disclaimer.property = property;
			disclaimer.title = $rootScope.i18n(title);
			disclaimer.fixed = fixed || false;

			if(start != undefined && angular.isObject(start)){
				var value = '';
				for(idx in start){
					value = (value != '')?(value + ' | ' + start[idx]):start[idx];
				}
				disclaimer.title += ': ' + value;
				disclaimer.value = value;
				return disclaimer;

			} else if(start != undefined && end != undefined) {
				if(start != end) {
					if(!filter)
						disclaimer.title += ': ' + start + ' ' + $rootScope.i18n('l-to', [], 'dts/mcc') + ' ' + end;
					else
						disclaimer.title += ': ' + filter(start, format) + ' ' + $rootScope.i18n('l-to', [], 'dts/mcc') + ' ' + filter(end, format);
				} else {
					if(!filter)
						disclaimer.title += ': ' + start;
					else
						disclaimer.title += ': ' + filter(start, format);
				}
			} else if((start != undefined && end == undefined) && !unique) {
				if(!filter)
					disclaimer.title += ': ' + $rootScope.i18n('l-bigger-or-equal', [], 'dts/mcc') + ': ' + start;
				else
					disclaimer.title += ': ' + $rootScope.i18n('l-bigger-or-equal', [], 'dts/mcc') + ': ' + filter(start, format);
			} else if((start == undefined && end != undefined) && !unique) {
				if(!filter)
					disclaimer.title += ': ' + $rootScope.i18n('l-smaller-or-equal', [], 'dts/mcc') + ': ' + end;
				else
					disclaimer.title += ': ' + $rootScope.i18n('l-smaller-or-equal', [], 'dts/mcc') + ': ' + filter(end, format);
			} else if(unique && start != undefined) {
				if(!filter)
					disclaimer.title += ': ' + start;
				else
					disclaimer.title += ': ' + filter(start, format);				
				disclaimer.value = start;
				return disclaimer;
			} else if(!start && !end) { // Campos lógicos (se entrou aqui é true)
				disclaimer.value = true;
				return disclaimer;
			}

			if(start != undefined && start != 'undefined') disclaimer.value = start; 		 // Deve aceitar valores em branco
			disclaimer.value += '&nbsp;';
			if(end != undefined && end != 'undefined') disclaimer.value += end; // Deve aceitar valores em branco
			return disclaimer;
		}
		/* 
		 * Objetivo: Retorna um objeto com valor inicial e final de acordo com a propriedade do disclamer 
		 			 para criar um range de valores no filtro com base no disclamer
		 * Parâmetros: property: nome do disclamer
		 * Observações: 
		 */
		function getParameterFromDisclaimer(property){
			var value = undefined;
	   		$.grep(fluigMonitorListCtrl.disclaimers, function(e){
	   			if(e.property === property){
					value = e.value.split("&nbsp;");
					return;
   				}
	   		});	   		
	   		if(value[0] == 'undefined') value[0] = undefined;
	   		if(value[1] == 'undefined') value[1] = undefined;
	   		return value;
		};

		// Função executada após a troca de ordenação 
		// order: ordernação escolhida pelo usuário
		fluigMonitorListCtrl.orderByChanged = function(order){
			fluigMonitorListCtrl.selectedOrderBy = order;
			fluigMonitorListCtrl.load(false);
		}
			
		// Realiza a integração da transação ou lote da transação
		fluigMonitorListCtrl.integrate = function(nrTrans){

			var list = [];
			if(nrTrans){
				list.push({'nr-trans': nrTrans});
			}else{
				for(i = 0; i < fluigMonitorListCtrl.modelList.length; i++){
					
					if(fluigMonitorListCtrl.modelList[i].$selected){
						var included = false;
					    for(count = 0; count < list.length; count++){
					    	if(list[count]['nr-trans'] == fluigMonitorListCtrl.modelList[i]['nr-trans'])
					    		included = true;
					    }
					    if(!included)
							list.push({'nr-trans': fluigMonitorListCtrl.modelList[i]['nr-trans']});
					}
				}
			}
			
			if(list.length > 0){
				if(fluigMonitorListCtrl.advancedSearchFilters)
					pUnintegrated = fluigMonitorListCtrl.advancedSearchFilters.unintegrated;
				else
					pUnintegrated = false;
				mlaapi016.executeFluigIntegration({}, {ttIntegrateTransactionFluig:list, lUnintegrated:pUnintegrated}, function(result) {	
					fluigMonitorListCtrl.load(false);
	            });

			}else{
				toaster.pop('error','',$rootScope.i18n('l-invalid-selection-help'));
			}
		}

		/* Objetivo: Iniciar a tela (executa o método inicial - MENU HTML) */
		if($rootScope.currentuserLoaded){
			fluigMonitorListCtrl.init();
		}

		/* Objetivo: Iniciar a tela (executa o método inicial - PORTAL) */
		$scope.$on(TOTVSEvent.currentuserLoaded, function(event){
			fluigMonitorListCtrl.init();
		});

	}	

	// *************************************************************************************
	// *** SERVICE MODAL ADVANCED SEARCH
	// *************************************************************************************
	modalFluigMonitorAdvancedSearch.$inject = ['$modal'];
	function modalFluigMonitorAdvancedSearch($modal) {
		this.open = function (params) {			
			var instance = $modal.open({
				templateUrl: '/dts/mla/html/fluigmonitor/fluigmonitor.advanced.search.html',
				controller: 'mla.fluigmonitor.AdvancedSearchCtrl as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { 
                    parameters: function () { return params; } 
                }
			});
			return instance.result;
		}
	};

	// ########################################################
    // ### CONTROLLER MODAL ADVANCED SEARCH
	// ########################################################
    modalFluigMonitorAdvancedSearchController.$inject = ['$rootScope', '$scope', '$modalInstance', 'mla.mlaapi016.Factory', 'parameters'];
    function modalFluigMonitorAdvancedSearchController($rootScope, $scope, $modalInstance, mlaapi016, parameters) {
        // *********************************************************************************
		// *** Variables
		// *********************************************************************************
        var fluigMonitorAdvancedSearchControl = this;
        fluigMonitorAdvancedSearchControl.disclaimers = [];
        fluigMonitorAdvancedSearchControl.parameters = [];
        fluigMonitorAdvancedSearchControl.documentKeyComposition = [];
        fluigMonitorAdvancedSearchControl.model = {};   
        fluigMonitorAdvancedSearchControl.todayTimestamp = new Date().getTime();   

               
        // *********************************************************************************
		// *** Functions
		// *********************************************************************************
		fluigMonitorAdvancedSearchControl.init = function(){
			fluigMonitorAdvancedSearchControl.parseDisclaimerToModel();

			if(fluigMonitorAdvancedSearchControl.model.unintegrated == undefined)
				fluigMonitorAdvancedSearchControl.model.unintegrated = false;

            if(fluigMonitorAdvancedSearchControl.model.documentCode)
				fluigMonitorAdvancedSearchControl.changeDocumentCode();
		}
		fluigMonitorAdvancedSearchControl.getCheckBoxValue = function(){
			return fluigMonitorAdvancedSearchControl.model.sendError;
		}
		fluigMonitorAdvancedSearchControl.changeErrorsOrUnintegrated = function(){

			fluigMonitorAdvancedSearchControl.model.sendError = (!fluigMonitorAdvancedSearchControl.model.unintegrated);
			fluigMonitorAdvancedSearchControl.model.handlingError = (!fluigMonitorAdvancedSearchControl.model.unintegrated);
			fluigMonitorAdvancedSearchControl.model.cancelError = (!fluigMonitorAdvancedSearchControl.model.unintegrated);
			
		}

		// Transforma os disclaimers recebidos em parâmetros para a modal (setar os campos da pesquisa avançada)
		fluigMonitorAdvancedSearchControl.parseDisclaimerToModel = function(){
			// Transforma os disclaimers em parâmetros para a api
		   	angular.forEach(fluigMonitorAdvancedSearchControl.disclaimers, function(disclaimer) {
		   		
		   		if(typeof disclaimer.value == "string" && disclaimer.value.indexOf("&nbsp;") > -1){ /* Ranges */	
		   			parameter = fluigMonitorAdvancedSearchControl.getParameterFromDisclaimer(disclaimer.property);
		   			if(parameter){		   				
		   				if(disclaimer.property.match(/Date*/)){ // Se for do tipo date converte para integer		
							fluigMonitorAdvancedSearchControl.model[disclaimer.property] = {start: parseInt(parameter[0],10), end: parseInt(parameter[1],10)};
		   				}else{
		   					fluigMonitorAdvancedSearchControl.model[disclaimer.property] = {};		   					
	   						if(parameter[0]) fluigMonitorAdvancedSearchControl.model[disclaimer.property].start = parameter[0];
	   						if(parameter[1]) fluigMonitorAdvancedSearchControl.model[disclaimer.property].end = parameter[1];
		   				}		   				
		   			}
		   		}else { /* Campos normais */
		   			if(disclaimer.property == "documentKey"){
		   				if(disclaimer.value.indexOf("|") > -1){
		   					arrayValue = disclaimer.value.split("|");
		   					startValue = {};
		   					for (i = 0; i < arrayValue.length; i++) { 
		   						startValue[i] = (arrayValue[i]).trim();
							}
							fluigMonitorAdvancedSearchControl.model[disclaimer.property] = {start: startValue};

		   				}else{
		   					startValue = { 0 : disclaimer.value};
		   					fluigMonitorAdvancedSearchControl.model[disclaimer.property] = {start: startValue};
		   				}

		   			}else{
						fluigMonitorAdvancedSearchControl.model[disclaimer.property] = disclaimer.value;
					}
		   		}
            });    
		}

		// Retorna um objeto da lista de disclaimers recebidos de acordo com o nome da propriedade
		fluigMonitorAdvancedSearchControl.getParameterFromDisclaimer = function(property){
			var value = undefined;
	   		$.grep(fluigMonitorAdvancedSearchControl.disclaimers, function(e){
	   			if(e.property === property){
					value = e.value.split("&nbsp;");
					return;
   				}
	   		});	   		
	   		if(value[0] == 'undefined') value[0] = undefined;
	   		if(value[1] == 'undefined') value[1] = undefined;
	   		return value;
		};

		fluigMonitorAdvancedSearchControl.apply = function() {			
			$modalInstance.close(fluigMonitorAdvancedSearchControl.model);
		}
		
		fluigMonitorAdvancedSearchControl.cancel = function() {
			$modalInstance.dismiss('cancel');
		}
		fluigMonitorAdvancedSearchControl.changeDocumentCode = function(){
			if(fluigMonitorAdvancedSearchControl.model.documentCode.start == fluigMonitorAdvancedSearchControl.model.documentCode.end){
					var documentCode = fluigMonitorAdvancedSearchControl.model.documentCode.start;
					mlaapi016.getDocumentKeyComposition({pDocumentCode:documentCode}, function(result){
						if(result){
							fluigMonitorAdvancedSearchControl.documentKeyComposition = result;
						}
					});
			}else{
				fluigMonitorAdvancedSearchControl.documentKeyComposition = [];
				fluigMonitorAdvancedSearchControl.model.documentKey = "";
			}
		}


		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************
		$scope.$on('$destroy', function () {
			fluigMonitorAdvancedSearchControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
		    $modalInstance.dismiss('cancel');
		});

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************		
        fluigMonitorAdvancedSearchControl.disclaimers = parameters.disclaimers;

        fluigMonitorAdvancedSearchControl.init(); 
    }
	
	// ########################################################
	// ### Registers
	// ########################################################
	index.register.controller('mla.fluigmonitor.ListCtrl', fluigMonitorListController);

	//Advanced Search
    index.register.controller('mla.fluigmonitor.AdvancedSearchCtrl', modalFluigMonitorAdvancedSearchController);
	index.register.service('mla.fluigmonitor.ModalAdvancedSearch', modalFluigMonitorAdvancedSearch);
});
