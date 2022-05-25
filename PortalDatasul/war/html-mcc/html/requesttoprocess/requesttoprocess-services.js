define([
	'index',
	'/dts/mcc/js/api/ccapi354.js',
	'/dts/mcc/html/request/request-services.js',
	'/dts/mcc/html/settingsordergenerator/settingsordergenerator-services.js',
	'/dts/mcc/html/fieldsreportconfig/fieldsreportconfig-services.js',
	'/dts/mcc/js/zoom/comprador.js'
], function(index) {

	// ########################################################
	// ### CONTROLLER LISTAGEM 
	// #######################################a#################
	requesttoprocessListController.$inject = ['$rootScope', '$scope','totvs.app-main-view.Service', 'mcc.ccapi354.Factory', 'mcc.ccapi361.Factory', '$filter','mcc.requesttoprocess.ModalAdvancedSearch', 'toaster', 'mcc.followup.ModalFollowUp', 'mcc.settingsordergenerator.ModalSettingsOrderGenerator', 'TOTVSEvent', 'mcc.fieldsreportconfig.fieldsReportConfigService','$totvsprofile', 'ReportService'];
	function requesttoprocessListController($rootScope, $scope, appViewService, ccapi354, ccapi361, $filter, modalRequestToProcessAdvancedSearch, toaster, modalFollowup, modalSettingsOrderGenerator, TOTVSEvent,fieldsReportConfigService, $totvsprofile, ReportService) {
		var requesttoprocessListControl = this;
		requesttoprocessListControl.disclaimers = [];
		requesttoprocessListControl.fieldsReportConfig = {};

		/*
		 * Objetivo: Método de inicialização da tela
		 * Parâmetros:
		 */
		requesttoprocessListControl.init = function(){
			createTab = appViewService.startView($rootScope.i18n('l-answering-requests'), 'mcc.requesttoprocess.ListCtrl', requesttoprocessListControl);

			if(appViewService.lastAction == "changetab")
				return;

			requesttoprocessListControl.hasNext = false;
			requesttoprocessListControl.disclaimers = [];
			requesttoprocessListControl.defaultDisclaimersValue = [];
			requesttoprocessListControl.basicFilter = "";
			requesttoprocessListControl.enableUpdate = false;
			requesttoprocessListControl.currentuser = undefined;
			requesttoprocessListControl.sight = 1;
			requesttoprocessListControl.completeModel = {};
			requesttoprocessListControl.modelList = [];

			requesttoprocessListControl.orderby = [
				{
					title: $rootScope.i18n('l-delivery-date', [], 'dts/mcc'), 
					property: "dt-entrega", 
					asc:true
				},
				{
					title: $rootScope.i18n('l-item', [], 'dts/mcc'), 
					property: "it-codigo", 
					asc:true
				},
				{
					title: $rootScope.i18n('l-solicitation', [], 'dts/mcc'), 
				 	property: "nr-requisicao", 
				 	asc:true,
				 	default:true
				},				
				{
					title: $rootScope.i18n('l-site', [], 'dts/mcc'), 
				 	property: "cod-estabel", 
				 	asc:true
				},
				{
					title: $rootScope.i18n('l-priority', [], 'dts/mcc'), 
				 	property: "prioridade-aprov", 
				 	asc:true
				},			
				{
					title: $rootScope.i18n('l-urgent', [], 'dts/mcc'), 
				 	property: "log-1", 
				 	asc:true
				}
			];

			requesttoprocessListControl.selectedOrderBy = requesttoprocessListControl.orderby[2];
			requesttoprocessListControl.loadDefaults();
			requesttoprocessListControl.loadSettings();
		}

		/*
		 * Objetivo: Busca as informações no progress
		 * Parâmetros: isMore: flag que identifica se é paginação (isMore = true) ou não
		 */
		requesttoprocessListControl.loadData = function(isMore){
			var parameter = [];	
			var parameters = new Object();

			// Configurações dos parâmetros utilizados na busca
			parameters.requesttoprocess = true;
			parameters.sight  = requesttoprocessListControl.sight;
			parameters.statusClosed = false;
			parameters.statusWithOrder = false;
			parameters.approved = true;
			parameters.notApproved = false;
			parameters.inventoryRequest = false;

			parameters.sortBy = requesttoprocessListControl.selectedOrderBy.property;
			parameters.orderAsc  = requesttoprocessListControl.selectedOrderBy.asc;
			
			
			parameters.basicFilter = requesttoprocessListControl.basicFilter;

			parameters.cCodEstabelec 	   = isMore ? requesttoprocessListControl.completeModel.cCodEstabelec       : undefined;
			parameters.rLastRequestRowid   = isMore ? requesttoprocessListControl.completeModel.rLastRequestRowid   : undefined;
			parameters.rLastRequestItRowid = isMore ? requesttoprocessListControl.completeModel.rLastRequestItRowid : undefined;

			// Transforma os disclaimers em parâmetros para a api
			angular.forEach(requesttoprocessListControl.disclaimers, function(disclaimer) {
				if(typeof disclaimer.value == "string" && disclaimer.value.indexOf("&nbsp;") > -1) { /* Ranges */
					parameter = requesttoprocessListControl.getParameterFromDisclaimer(disclaimer.property);
					if(parameter) {
						if(parameter[0] && disclaimer.property != 'itemCode') {
							parameters[disclaimer.property + 'Ini'] = parameter[0];	
						}

						if(parameter[1] && disclaimer.property != 'itemCode') {
							parameters[disclaimer.property + 'End'] = parameter[1];	
						}

						// Tratamento especial para o código do item pois deve aceitar código em branco "".
						if (disclaimer.property == 'itemCode') {
							if(parameter[0] != undefined && parameter[0] != 'undefined') {
								parameters[disclaimer.property + 'Ini'] = parameter[0];	
							}
							if(parameter[1] != undefined && parameter[1] != 'undefined') {
								parameters[disclaimer.property + 'End'] = parameter[1];	
							}
						}
					}
				} else { /* Campos normais */ 
					parameters[disclaimer.property] = disclaimer.value;
				}
			});


			var procedureParameters = {};
			procedureParameters.ttListParameters = parameters;
			procedureParameters.currentTTRequestList = [];				
		
			ccapi354.getListRequestsWithOutCount({}, procedureParameters, function(result) {
				if(result['ttRequestList']) {
					if(requesttoprocessListControl.sight == 1) {
						$.each(result['ttRequestList'], function(index, value) {
							result['ttRequestList'][index]['it-codigo-link'] = encodeURIComponent(encodeURIComponent(result['ttRequestList'][index]['it-codigo']));
						});
					};

					requesttoprocessListControl.completeModel = result;
					if(isMore){
						requesttoprocessListControl.modelList = $.merge(requesttoprocessListControl.modelList, result['ttRequestList']);
					}else{
						requesttoprocessListControl.modelList = result['ttRequestList'];	            			
					}        			
					
					requesttoprocessListControl.enableUpdate = result.lEnableUpdate;
					requesttoprocessListControl.hasNext = result.lHasNext;
				}else{
					requesttoprocessListControl.hasNext = false;
				}
			});
		}

		/*
		 * Objetivo: Retorna o valor do filtro/disclaimer
		 * Parâmetros:
		 */
		requesttoprocessListControl.getParameterFromDisclaimer = function(property){
			var value = undefined;
			$.grep(requesttoprocessListControl.disclaimers, function(e){
				if(e.property === property){
					value = e.value.split("&nbsp;");
					return;
				}
			});
			if(value[0] == 'undefined') value[0] = undefined;
			if(value[1] == 'undefined') value[1] = undefined;
			return value;
		}

		/*
		 * Objetivo: Busca as informações default no erp
		 * Parâmetros:
		 */
		requesttoprocessListControl.loadDefaults = function(){ // Carregar disclaimers defaults da listagem
			requesttoprocessListControl.disclaimers = [];
			var MonthAgoDate = new Date();
			MonthAgoDate.setMonth(MonthAgoDate.getMonth()-1);	

			if(requesttoprocessListControl.sight == 0 && requesttoprocessListControl.orderby[3]){
				requesttoprocessListControl.orderby.splice(4, 2);
			}

			requesttoprocessListControl.disclaimers.push(modelToDisclaimer('statusOpen', 'l-open'));
			requesttoprocessListControl.disclaimers.push(modelToDisclaimer('statusIncomplete', 'l-incomplete'));
			requesttoprocessListControl.disclaimers.push(modelToDisclaimer('purchaseRequest', 'l-purchase'));
			requesttoprocessListControl.disclaimers.push(modelToDisclaimer('quotationRequest', 'l-quotation'));
			requesttoprocessListControl.disclaimers.push(modelToDisclaimer('date', 'l-date', MonthAgoDate.getTime(), new Date().getTime(), null, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc')));
			requesttoprocessListControl.disclaimers.push(modelToDisclaimer('buyer', 'l-buyer', $rootScope.currentuser.login, $rootScope.currentuser.login));
			requesttoprocessListControl.disclaimers.push(modelToDisclaimer('lowPriority', 'l-low'));
			requesttoprocessListControl.disclaimers.push(modelToDisclaimer('mediumPriority', 'l-medium'));
			requesttoprocessListControl.disclaimers.push(modelToDisclaimer('highPriority', 'l-high'));
			requesttoprocessListControl.disclaimers.push(modelToDisclaimer('veryHighPriority', 'l-very-high'));

			requesttoprocessListControl.disclaimers.push(modelToDisclaimer('urgentYes', 'l-urgent'));
			requesttoprocessListControl.disclaimers.push(modelToDisclaimer('urgentNo', 'l-not-urgent'));

			ccapi361.getDefaultInformation({}, function(result) {
				requesttoprocessListControl.defaultInformation = result;				
				if(result.generateByPurchaseGroup)
					requesttoprocessListControl.disclaimers.push(modelToDisclaimer('onlyBuyerGroup','l-only-buyer-group'));

				requesttoprocessListControl.loadData();
			});
		};

		/* Retorna para a tela o nome da classe para alterar a cor na listagem */
		requesttoprocessListControl.getPriorityClass = function(priority){
			if(priority >= 0 && priority <=300)
				return "priority-1";
			if(priority > 300 && priority <=600)
				return "priority-2";
			if(priority > 600 && priority < 999)
				return "priority-3";
			if(priority == 999)
				return "priority-4";

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
			disclaimer.title = $rootScope.i18n(title, [], 'dts/mcc');
			disclaimer.fixed = fixed || false;

			if(start != undefined && end != undefined) {
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
				disclaimer.title = $rootScope.i18n(title, [], 'dts/mcc');	
				disclaimer.value = true;
				return disclaimer;
			}

			if(start != undefined && start != 'undefined') disclaimer.value = start; 		 // Deve aceitar valores em branco
			disclaimer.value += '&nbsp;';
			if(end != undefined && end != 'undefined') disclaimer.value += end; // Deve aceitar valores em branco
			return disclaimer;
		}

		// Transforma os parâmetros recebidos da modal (pesquisa avançada)
		// filters: parâmetros recebidos da modal
		requesttoprocessListControl.parseModelToDisclaimer = function(filters){
			requesttoprocessListControl.disclaimers = [];			

			for (key in filters) {
				var model = filters[key];
				var disclaimer = {};				
				if(key == 'statusOpen') {
					if(model) requesttoprocessListControl.disclaimers.push(modelToDisclaimer(key, 'l-open'));
				}else if(key == 'statusIncomplete') {
					if(model) requesttoprocessListControl.disclaimers.push(modelToDisclaimer(key, 'l-incomplete'));
				}else if(key == 'urgentYes') {
					if(model) requesttoprocessListControl.disclaimers.push(modelToDisclaimer(key, 'l-urgent'));
				}else if(key == 'urgentNo') {
					if(model) requesttoprocessListControl.disclaimers.push(modelToDisclaimer(key, 'l-not-urgent'));
				}else if(key == 'purchaseRequest') {
					if(model) requesttoprocessListControl.disclaimers.push(modelToDisclaimer(key, 'l-purchase'));
				}else if(key == 'quotationRequest') {
					if(model) requesttoprocessListControl.disclaimers.push(modelToDisclaimer(key, 'l-quotation'));					
				}else if(key == 'lowPriority') {
					if(model) requesttoprocessListControl.disclaimers.push(modelToDisclaimer(key, 'l-low'));
				}else if(key == 'mediumPriority') {
					if(model) requesttoprocessListControl.disclaimers.push(modelToDisclaimer(key, 'l-medium'));
				}else if(key == 'highPriority') {
					if(model) requesttoprocessListControl.disclaimers.push(modelToDisclaimer(key, 'l-high'));
				}else if(key == 'veryHighPriority') {
					if(model) requesttoprocessListControl.disclaimers.push(modelToDisclaimer(key, 'l-very-high'));
				}else if(key == 'alternativeRequest') {
					if(model) requesttoprocessListControl.disclaimers.push(modelToDisclaimer(key, 'l-alternatives-requests-only'));
				}else if(key == 'buyer') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-buyer', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZ") ? true : false;
						requesttoprocessListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'purchaseGroup') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-purchase-group', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZ") ? true : false;
						requesttoprocessListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'date') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-date', model.start, model.end, undefined, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc'));
						requesttoprocessListControl.disclaimers.push(disclaimer);
					}					
				}else if(key == 'requestNumber') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-request-number', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == 0) && model.end == 999999999) ? true : false;
						requesttoprocessListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'site') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-site', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZ") ? true : false;
						requesttoprocessListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'requester') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-requester', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZ") ? true : false;
						requesttoprocessListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'descriptionItem') {					
					if(model) {
						disclaimer = modelToDisclaimer(key, 'l-description-item-request-contains', model, undefined, true);						
						disclaimer.hide = (!model || model == "") ? true : false;
						requesttoprocessListControl.disclaimers.push(disclaimer);
					}					
				}else if(key == 'descriptionRequest') {					
					if(model) {
						disclaimer = modelToDisclaimer(key, 'l-commentary-solicitation-contains', model, undefined, true);						
						disclaimer.hide = (!model || model == "") ? true : false;
						requesttoprocessListControl.disclaimers.push(disclaimer);
					}					
				}else if(key == 'itemCode') { // Deve aceitar código branco ""					
					var itemDisclaimer = {};
					itemDisclaimer.property = key;
					itemDisclaimer.title = $rootScope.i18n('l-item', [], 'dts/mcc');

					if((model.start != undefined && model.end != undefined) && (model.start.length > 0 && model.end.length > 0)) { 
						if(model.start != model.end) {
							itemDisclaimer.title += ': ' + model.start + ' ' + $rootScope.i18n('l-to', [], 'dts/mcc') + ' ' + model.end;
						} else {
							itemDisclaimer.title += ': ' + model.start;
						}
						itemDisclaimer.value = model.start + '&nbsp;' + model.end;
					} else if(model.start != undefined && model.start.length > 0 && (model.end == undefined || model.end == "")) {
						itemDisclaimer.title += ': ' + $rootScope.i18n('l-bigger-or-equal', [], 'dts/mcc') + ': ' + model.start;
						itemDisclaimer.value = model.start + '&nbsp;undefined';
					} else if((model.start == undefined || model.start == "") && model.end != undefined && model.end.length > 0) {
						itemDisclaimer.title += ': ' + $rootScope.i18n('l-smaller-or-equal', [], 'dts/mcc') + ': ' + model.end;
						itemDisclaimer.value = 'undefined&nbsp;' + model.end;
					}

					itemDisclaimer.hide = ((!model.start || model.start == "") && (model.end && model.end.toUpperCase() == "ZZZZZZZZZZZZZZZZ")) ? true : false;
					if(itemDisclaimer.value) requesttoprocessListControl.disclaimers.push(itemDisclaimer);
				}else if(key == 'itemDescription') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-item-description', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ") ? true : false;
						requesttoprocessListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'itemCompCode') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-supplementary-code', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZZZZZZZZZ") ? true : false;
						requesttoprocessListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'itemCompInfo') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-supplementary-info', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZZZZZ") ? true : false;
						requesttoprocessListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'onlyBuyerGroup'){
					if(model) requesttoprocessListControl.disclaimers.push(modelToDisclaimer(key, 'l-only-buyer-group'));
				}
			}
		}

		// Deletar um disclaimer
		// disclaimer: disclaimer a ser removido
		requesttoprocessListControl.removeDisclaimer = function(disclaimer) {
			var index = requesttoprocessListControl.disclaimers.indexOf(disclaimer);
			var hasDefaultValue = false;
			if (index != -1) {
				$.grep(requesttoprocessListControl.defaultDisclaimersValue, function(e){
					if(e.property === disclaimer.property){
						requesttoprocessListControl.disclaimers[index] = e;
						hasDefaultValue = true;
						return;
					}
				});
				if(!hasDefaultValue){
					requesttoprocessListControl.disclaimers.splice(index,1);
				}
				requesttoprocessListControl.loadData(false);
			}
		}

		/* Alterar a ordenação selecionada em tela */
		requesttoprocessListControl.orderByChanged = function(orderBy){
			requesttoprocessListControl.selectedOrderBy = orderBy;
			requesttoprocessListControl.loadData(false);
		}

		/* Abrir a modal da pesquisa avançada */
		requesttoprocessListControl.openAdvancedSearch = function(){
			var modalInstance = modalRequestToProcessAdvancedSearch.open({disclaimers: requesttoprocessListControl.disclaimers, onlyBuyerGroup:requesttoprocessListControl.defaultInformation.generateByPurchaseGroup})
				.then(function(result) {
					requesttoprocessListControl.parseModelToDisclaimer(result);
					requesttoprocessListControl.loadData(false);
			});
		}

		
		/* Objetivo: Alterar o status da solicitação de compras 
		   Parâmetros: 	newValue: valor selecionado no combo (Aberta/Incompleta)
		 				request: array com os dados da requisição
		   Obs: Status: 1 - Aberta; 3 - Incompleta
		*/
		requesttoprocessListControl.changeStatus = function(newValue, request){
			request['situacao'] = newValue;
			if(parseInt(newValue) == 1)
				request['situacao-desc'] = $rootScope.i18n("l-open");
			else if(parseInt(newValue) == 3)
				request['situacao-desc'] = $rootScope.i18n("l-incomplete");

			ccapi354.updateStatus({}, request, function(result){
				toaster.pop('success', "",$rootScope.i18n('l-status') + " " + $rootScope.i18n('l-success-updated'));
				requesttoprocessListControl.loadData(false);
			});
		}

		/*
		 * Objetivo: Abre a modal do followUp
		 * Parâmetros:
		 */
		requesttoprocessListControl.followUp = function(requestItem){
			var modalInstance = modalFollowup.open({doc: requestItem['tp-requis'], docNumber: requestItem['nr-requisicao'], item: requestItem['it-codigo'], seqItem: requestItem['sequencia'], vendor: 0, seqQuote: 0});
		}

		/* Abrir tela de configuração da geração de ordens */
		requesttoprocessListControl.process = function(requestItem){
			requesttoprocessListControl.requestSelected = [];
			if(requestItem == null){
				for(var i=0;i<requesttoprocessListControl.modelList.length;i++){
					if(requesttoprocessListControl.modelList[i].$selected){
						requesttoprocessListControl.requestSelected.push(requesttoprocessListControl.requestToParam(requesttoprocessListControl.modelList[i]));
					}
				}

				if(requesttoprocessListControl.requestSelected.length <= 0){
					toaster.pop('error','',$rootScope.i18n('l-select-one-request'));
					return;
				}
			}else{
				requesttoprocessListControl.requestSelected.push(requesttoprocessListControl.requestToParam(requestItem));
			}

			var modalInstance = modalSettingsOrderGenerator.open({requestSelected: requesttoprocessListControl.requestSelected, defaultInformation: requesttoprocessListControl.defaultInformation})
				.then(function(result) {
					if(result.ttSummaryPurchRequisition && result.ttSummaryPurchRequisition.length > 0){
						requesttoprocessListControl.imprimir(result.ttSummaryPurchRequisition);
					}
					if(result.recarregar)
						requesttoprocessListControl.loadData();
			});
		}


		/* Transforma o registro da solicitação em um objeto json que será passado para o ERP */
		requesttoprocessListControl.requestToParam = function(requestItem){
			requestItemParam = {
				"desc-item": 		requestItem["desc-item"],
				"dt-entrega": 		requestItem["dt-entrega"],
				"estado": 			requestItem["estado"],
				"it-codigo": 		requestItem["it-codigo"],
				"log-1": 			requestItem["urgente"],
				"nr-requisicao": 	requestItem["nr-requisicao"],
				"qt-requisitada": 	requestItem["qt-requisitada"],
				"situacao": 		requestItem["situacao"],
				"un": 				requestItem["un"],
				"ct-codigo": 		"",
				"sc-codigo": 		"",
				"cod-estabel": 		requestItem["cod-estabel"],
				"nome-abrev": 		requestItem["nome-abrev"],
				"estado-desc": 		requestItem["estado-desc"],
				"situacao-desc": 	requestItem["situacao-desc"],
				"narrativa": 		requestItem["it-requisicao-narrativa"],
				"sequencia": 		requestItem["sequencia"],
				"hra-entrega": 		requestItem["hra-entrega"]
			};
			return requestItemParam;
		}

		/*
		 * Objetivo: abre a modal de configuração de impressão
		 * Parâmetros:
		 */
		requesttoprocessListControl.settings = function(){
			fieldsReportConfigService.open(requesttoprocessListControl.printConfig).then(function(result){
				/**** Quebrar o json das preferências de impressão em partes de 4000 caracteres ****/
				var profileDataArray = [];
				var profileData;
				var val = "";
				pref = JSON.stringify(result);
				prefLength = pref.length;
				breakLength = 3000;
				for(var i = 0;i<(prefLength/breakLength);i++){
					val = pref.substring((i*breakLength),((i+1)*breakLength));
					profileData = {dataCode:'printConfig'+i, dataValue: val };
					profileDataArray.push(profileData);
				}

				$totvsprofile.remote.set('/dts/mcc/requesttoprocess', profileDataArray , function(profileResult) {
					requesttoprocessListControl.printConfig.printParams = result.printParams;
					requesttoprocessListControl.printConfig.fieldsReportConfig = result.fieldsReportConfig;
				});
			});
		}

		/*
		 * Objetivo: Busca as informações padrões da configuração de impressão
		 * Parâmetros:
		 */
		requesttoprocessListControl.loadSettings = function(){
			requesttoprocessListControl.printConfig = {};
            requesttoprocessListControl.printConfig.columnsMode = false;
			ccapi354.getFieldsReportConfigDefault({}, function(result2) {
				requesttoprocessListControl.printConfig.printParams = {"detailInstallments":true};
				requesttoprocessListControl.printConfig.fieldsReportConfig = result2;

				/* Verifica preferência do usuário */
				$totvsprofile.remote.get('/dts/mcc/requesttoprocess', undefined, function(result) {
					if(result.length > 0){
						var full = "";
						var fullArray = {};
						for(var i=0;i<result.length;i++){
							if(result[i].dataCode.substring(0,11) == "printConfig")
								full = full + result[i].dataValue;
						}
						printConfigProfile = JSON.parse(full);

						/* Sobrescreve as preferências do usuário em cima das configurações default */
						if(!printConfigProfile.printParams || !printConfigProfile.fieldsReportConfig)
							return;						

						for(var i=0;i<requesttoprocessListControl.printConfig.fieldsReportConfig.length;i++){
							for(var j=0;j<printConfigProfile.fieldsReportConfig.length;j++){
								if(requesttoprocessListControl.printConfig.fieldsReportConfig[i].fieldName == printConfigProfile.fieldsReportConfig[j].fieldName)
									requesttoprocessListControl.printConfig.fieldsReportConfig[i].fieldShow = printConfigProfile.fieldsReportConfig[j].fieldShow;
							}
						}
						requesttoprocessListControl.printConfig.printParams = printConfigProfile.printParams;
					}
				});
			});
		}

		/*
		 * Objetivo: Função de impressão da ordem gerada
		 * Parâmetros: ttSummaryPurchRequisition: temp-table com as informações das ordens geradas
		 */
		requesttoprocessListControl.imprimir = function(ttSummaryPurchRequisition){
			data = {};
			if(ttSummaryPurchRequisition && ttSummaryPurchRequisition.length > 0)
				data.ttSummaryPurchRequisition = ttSummaryPurchRequisition;
			else
				return;
			
			data.ttPrintParams = requesttoprocessListControl.printConfig.printParams;
			data.ttFieldsReportConfig = {};
			for(var i=0;i<requesttoprocessListControl.printConfig.fieldsReportConfig.length;i++){
				data.ttFieldsReportConfig[requesttoprocessListControl.printConfig.fieldsReportConfig[i].fieldName] = requesttoprocessListControl.printConfig.fieldsReportConfig[i].fieldShow;
			}
			
			reportParams = {format:"xlsx",
							program:"/report/mcc/mcc0001",
							publish:false,
							download: true,
							dialect:"pt"};
			ReportService.run("mcc/rel_request", reportParams, data, function(response){				
			});
		}


		if ($rootScope.currentuserLoaded){ 
			requesttoprocessListControl.init(); 
		}

		// *********************************************************************************
		// *** Events Listeners
		// *********************************************************************************

		// cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			requesttoprocessListControl.init();
		});
	}



	// *************************************************************************************
	// *** SERVICE MODAL ADVANCED SEARCH
	// *************************************************************************************
	modalRequestToProcessAdvancedSearch.$inject = ['$modal'];
	function modalRequestToProcessAdvancedSearch($modal) {
		this.open = function (params) {			
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/requesttoprocess/list/requesttoprocess.advanced.search.html',
				controller: 'mcc.requesttoprocess.AdvancedSearchCtrl as controller',
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
    modalRequestToProcessAdvancedSearchController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters'];
    function modalRequestToProcessAdvancedSearchController($rootScope, $scope, $modalInstance, parameters) {
        // *********************************************************************************
		// *** Variables
		// *********************************************************************************
        var RequestToProcessAdvancedSearchControl = this;
        RequestToProcessAdvancedSearchControl.disclaimers = [];
        RequestToProcessAdvancedSearchControl.parameters = [];
        RequestToProcessAdvancedSearchControl.model = {};   
        RequestToProcessAdvancedSearchControl.todayTimestamp = new Date().getTime();        

        // *********************************************************************************
		// *** Functions
		// *********************************************************************************
		RequestToProcessAdvancedSearchControl.init = function(){
			RequestToProcessAdvancedSearchControl.parseDiscaimerToModel();
			RequestToProcessAdvancedSearchControl.checkOnlyBuyerGroup = parameters.onlyBuyerGroup;
		}

		// Transforma os disclaimers recebidos em parâmetros para a modal (setar os campos da pesquisa avançada)
		RequestToProcessAdvancedSearchControl.parseDiscaimerToModel = function(){
			// Transforma os disclaimers em parâmetros para a api
		   	angular.forEach(RequestToProcessAdvancedSearchControl.disclaimers, function(disclaimer) {
		   		if(typeof disclaimer.value == "string" && disclaimer.value.indexOf("&nbsp;") > -1){ /* Ranges */	
		   			parameter = RequestToProcessAdvancedSearchControl.getParameterFromDisclaimer(disclaimer.property);
		   			if(parameter){		   				
		   				if(disclaimer.property.match(/date*/)){ // Se for do tipo date converte para integer		   					
							RequestToProcessAdvancedSearchControl.model[disclaimer.property] = {start: (parameter[0])?parseInt(parameter[0],10):undefined, end: (parameter[1])?parseInt(parameter[1],10):undefined};
		   				}else{
		   					RequestToProcessAdvancedSearchControl.model[disclaimer.property] = {};		   					
	   						if(parameter[0]) RequestToProcessAdvancedSearchControl.model[disclaimer.property].start = parameter[0];
	   						if(parameter[1]) RequestToProcessAdvancedSearchControl.model[disclaimer.property].end = parameter[1];
		   				}		   				
		   			}
		   		}else { /* Campos normais */
					RequestToProcessAdvancedSearchControl.model[disclaimer.property] = disclaimer.value;					
		   		}
            });    
		}

		// Retorna um objeto da lista de disclaimers recebidos de acordo com o nome da propriedade
		RequestToProcessAdvancedSearchControl.getParameterFromDisclaimer = function(property){
			var value = undefined;
	   		$.grep(RequestToProcessAdvancedSearchControl.disclaimers, function(e){
	   			if(e.property === property){
					value = e.value.split("&nbsp;");
					return;
   				}
	   		});	   		
	   		if(value[0] == 'undefined') value[0] = undefined;
	   		if(value[1] == 'undefined') value[1] = undefined;
	   		return value;
		};

		RequestToProcessAdvancedSearchControl.apply = function() {			
			$modalInstance.close(RequestToProcessAdvancedSearchControl.model);
		}
		
		RequestToProcessAdvancedSearchControl.cancel = function() {
			$modalInstance.dismiss('cancel');
		}
		
        // *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************		
        RequestToProcessAdvancedSearchControl.disclaimers = parameters.disclaimers;

        RequestToProcessAdvancedSearchControl.init(); //inicializa a tela
        // *********************************************************************************
		// *** Events Listners
		// *********************************************************************************
		$scope.$on('$destroy', function () {
			RequestToProcessAdvancedSearchControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
		    $modalInstance.dismiss('cancel');
		});
    }

    // *************************************************************************************
	// *** SERVICE MODAL SETTINGS ORDER GENERATOR
	// *************************************************************************************
	modalSettingsOrderGenerator.$inject = ['$modal'];
	function modalSettingsOrderGenerator($modal) {
		this.open = function (params) {			
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/settingsordergenerator/settingsordergenerator.modal.html',
				controller: 'mcc.settingsordergenerator.modalSettingsOrderGeneratorCtrl as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { 
                    parameters: function () { return params; } 
                }
			});
			return instance.result;
		}
	}


	index.register.controller('mcc.requesttoprocess.ListCtrl', requesttoprocessListController);

	index.register.controller('mcc.requesttoprocess.AdvancedSearchCtrl', modalRequestToProcessAdvancedSearchController);
	index.register.service('mcc.requesttoprocess.ModalAdvancedSearch', modalRequestToProcessAdvancedSearch);

	index.register.service('mcc.settingsordergenerator.ModalSettingsOrderGenerator', modalSettingsOrderGenerator);
});
