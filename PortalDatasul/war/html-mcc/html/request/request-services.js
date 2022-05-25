define([
	'index',
	'/dts/mcc/js/api/ccapi354.js',
	'/dts/mcc/html/followup/followup-services.js',
    '/dts/mcc/js/zoom/referencia.js',
    '/dts/mcc/js/zoom/tab-unidade.js',
    '/dts/mcc/js/zoom/sub-div-ordem.js',
    '/dts/utb/js/zoom/cta-ctbl-integr.js',
    '/dts/utb/js/zoom/ccusto.js',
    '/dts/men/js/zoom/item.js',
    '/dts/mcc/js/zoom/utiliz-natu-despes.js',
    '/dts/mcc/js/zoom/utilizacao-mater.js',
    '/dts/mcc/js/zoom/requisicao.js',
    '/dts/mpd/js/zoom/estabelec.js',
    '/dts/mcc/js/zoom/requisitante.js',    
    '/dts/mcc/js/mcc-legend-service.js'
], function(index) {

	// ########################################################
	// ### CONTROLLER LISTAGEM
	// #######################################a#################
	requestListController.$inject = ['$rootScope', '$scope', '$state', '$filter', '$totvsprofile', 'totvs.app-main-view.Service', 'mcc.ccapi354.Factory',
	'mcc.request.ModalChangeSight', 'mcc.request.ModalAdvancedSearch', 'mcc.followup.ModalFollowUp', 'mcc.zoom.serviceLegend', 'TOTVSEvent'];
	function requestListController($rootScope, $scope, $state, $filter, $totvsprofile, appViewService, requestFactory, modalChangeSight, modalRequestAdvancedSearch, modalFollowup, legendService, TOTVSEvent) {
		var requestListControl = this;

		// *********************************************************************************
	    // *** Variables
	    // *********************************************************************************
	    $scope.module = ($state.is('dts/mcc/request.start') || $state.is('dts/mcc/request.search')) ? 'mcc' : 'mce';
		this.isJustForView = $state.is('dts/'+$scope.module+'/request.search');

		this.modelListCount = 0;
		this.disclaimers = [];
		this.defaultDisclaimersValue = [];
		this.basicFilter = "";
		this.enableUpdate = false;
		this.currentuser = undefined;
		this.sight = 0;
		this.completeModel = {};
		this.modelList = [];
		this.orderby = [
			{
				title: $rootScope.i18n('l-request', [], 'dts/mcc'),
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
				title: $rootScope.i18n('l-type', [], 'dts/mcc'),
			 	property: "tp-requis",
			 	asc:true
			},
			{
				title: $rootScope.i18n('l-requisition-date', [], 'dts/mcc'),
				property: "dt-requisicao",
				asc:true
			},
			{
				title: $rootScope.i18n('l-item', [], 'dts/mcc'),
				property: "it-codigo",
				asc:true
			},
			{
				title: $rootScope.i18n('l-delivery-date', [], 'dts/mcc'),
				property: "dt-entrega",
				asc:true
			}
		];
		this.selectedOrderBy = this.orderby[0];
		this.loaded = false;

	    // *********************************************************************************
	    // *** Functions
	    // *********************************************************************************
		this.loadDefaults = function(){ // Carregar disclaimers defaults da listagem
			this.disclaimers = [];
			var MonthAgoDate = new Date();
			MonthAgoDate.setMonth(MonthAgoDate.getMonth()-1);

			if(this.sight == 0 && this.orderby[3]){
				this.orderby.splice(4, 2);
			}

			this.disclaimers.push(modelToDisclaimer('statusOpen', 'l-open'));
			this.disclaimers.push(modelToDisclaimer('statusIncomplete', 'l-incomplete'));
			this.disclaimers.push(modelToDisclaimer('approved', 'l-approved-gen'));
			this.disclaimers.push(modelToDisclaimer('notApproved', 'l-not-approved'));
			this.disclaimers.push(modelToDisclaimer('inventoryRequest', 'l-inventory'));
			this.disclaimers.push(modelToDisclaimer('purchaseRequest', 'l-purchase'));
			this.disclaimers.push(modelToDisclaimer('quotationRequest', 'l-quotation'));
			this.disclaimers.push(modelToDisclaimer('date', 'l-date', MonthAgoDate.getTime(), new Date().getTime(), null, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc')));
			this.disclaimers.push(modelToDisclaimer('requester', 'l-requester', $rootScope.currentuser.login, $rootScope.currentuser.login));
		};

		// Carregar os registros da listagem
		// isMore: Identifica se são mais registros ou não (paginação)
		this.load = function(isMore) {

			var parameter = [];
			var parameters = new Object();

			// Configurações dos parâmetros utilizados na busca
			parameters.sortBy = this.selectedOrderBy.property;
			parameters.orderAsc  = this.selectedOrderBy.asc;

			parameters.sight  = this.sight;
			parameters.basicFilter = this.basicFilter;

			parameters.cCodEstabelec 	   = isMore ? this.completeModel.cCodEstabelec       : undefined;
			parameters.rLastRequestRowid   = isMore ? this.completeModel.rLastRequestRowid   : undefined;
			parameters.rLastRequestItRowid = isMore ? this.completeModel.rLastRequestItRowid : undefined;

			/* Parâmetros usados apenas no html.cc0325 (mcc/requesttoprocess) */
			parameters.requesttoprocess = false;
			parameters.lowPriority = true;
			parameters.mediumPriority = true;
			parameters.highPriority = true;
			parameters.veryHighPriority = true;
			parameters.buyerIni = "";
			parameters.buyerEnd = "ZZZZZZZZZZZZ";

			// Transforma os disclaimers em parâmetros para a api
		   	angular.forEach(this.disclaimers, function(disclaimer) {
		   		if(typeof disclaimer.value == "string" && disclaimer.value.indexOf("&nbsp;") > -1) { /* Ranges */
			   		parameter = requestListControl.getParameterFromDisclaimer(disclaimer.property);
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

	   		if(isMore && this.sight == 0) {
	   			this.modelList.forEach(function(request){
   					procedureParameters.currentTTRequestList.push({'nr-requisicao': request['nr-requisicao']});
	   			});
	   		}

	        requestFactory.getListRequests({}, procedureParameters, function(result) {
	            if(result['ttRequestList']) {

	            	if(requestListControl.sight == 1) {
            			$.each(result['ttRequestList'], function(index, value) {
            				result['ttRequestList'][index]['it-codigo-link'] = encodeURIComponent(encodeURIComponent(result['ttRequestList'][index]['it-codigo']));
            			});
	            	};

	            	requestListControl.completeModel = result;
	            	if(isMore){
            			requestListControl.modelList = $.merge(requestListControl.modelList, result['ttRequestList']);
	            	}else{
	            		requestListControl.modelList = result['ttRequestList'];
	            	}
        			requestListControl.enableUpdate = result.lEnableUpdate;
        			requestListControl.modelListCount = result.iCount;
	            } else {
	            	requestListControl.modelListCount = 0;
	            }
	        });
		};

		this.getParameterFromDisclaimer = function(property){
			var value = undefined;
	   		$.grep(this.disclaimers, function(e){
	   			if(e.property === property){
					value = e.value.split("&nbsp;");
					return;
   				}
	   		});
	   		if(value[0] == 'undefined') value[0] = undefined;
	   		if(value[1] == 'undefined') value[1] = undefined;
	   		return value;
		}

		// Deletar um disclaimer
		// disclaimer: disclaimer a ser removido
		this.removeDisclaimer = function(disclaimer) {
			var index = requestListControl.disclaimers.indexOf(disclaimer);
			var hasDefaultValue = false;
			if (index != -1) {
		   		$.grep(requestListControl.defaultDisclaimersValue, function(e){
		   			if(e.property === disclaimer.property){
   						requestListControl.disclaimers[index] = e;
   						hasDefaultValue = true;
   						return;
	   				}
		   		});
		   		if(!hasDefaultValue){
		   			requestListControl.disclaimers.splice(index,1);
		   		}
		   		requestListControl.load(false);
			}
		}

		// Abre a modal de configurações e após o "aplicar" salva a configuração do usuário em seu perfil
		this.settings = function(){
	        var modalInstance = modalChangeSight.open({
	            sight: requestListControl.sight}).then(function(result) {
	            	if(requestListControl.sight != result.sight) {
	            		requestListControl.modelList = [];
	            		requestListControl.modelListCount = 0;
	            		$totvsprofile.remote.set('/dts/mcc/request', {dataCode: 'pageSight', dataValue: result.sight }, function(profileResult) {
	            			requestListControl.sight = result.sight;

	            			if(requestListControl.sight == 0 && requestListControl.orderby[3]) {
								requestListControl.orderby.splice(4, 2); // Retirar os filtros que não são aplicados a requisição
								requestListControl.selectedOrderBy = requestListControl.orderby[0]; // Seleciona o filtro padrão
							}else { // Adiciona os filtros para os itens da requisição
								requestListControl.orderby.push({title: $rootScope.i18n('l-item', [], 'dts/mcc'), property: "it-codigo", asc:true});
								requestListControl.orderby.push({title: $rootScope.i18n('l-delivery-date', [], 'dts/mcc'), property: "dt-entrega", asc:true});
							}

							/* remove o filtro por descrição caso altere a visão (sight) da tela */
							var removedDisclaimer = false;
							for(var i=0;i<requestListControl.disclaimers.length;i++){
								if(requestListControl.sight == 1 && requestListControl.disclaimers[i].property == "descriptionRequest"){
									requestListControl.removeDisclaimer(requestListControl.disclaimers[i]);
									removedDisclaimer = true;
									break;
								}else{
									if(requestListControl.sight != 1 && requestListControl.disclaimers[i].property == "descriptionItem"){
										requestListControl.removeDisclaimer(requestListControl.disclaimers[i]);
										removedDisclaimer = true;
										break;
									}
								}
							}
							if(!removedDisclaimer)
	            				requestListControl.load(false);								   
						});	
	            	}	                       
	    		});			
		};

		// Tradução dos tipos de requisição
		/* tpRequis: Tipo da requisição
		 * 	1: Estoque
		 * 	2: Compra
		 * 	3: Cotação
		*/
		this.translateRequestType = function(tpRequis) {
	    	return legendService.requestType.NAME(tpRequis);
	    }

		// Função executada após a troca de ordenação
		// order: ordernação escolhida pelo usuário
		this.orderByChanged = function(order){
			requestListControl.selectedOrderBy = order;
			requestListControl.load(false);
		}

		// Abre a modal de pesquisa avançãda
		this.openAdvancedSearch = function(){
	        var modalInstance = modalRequestAdvancedSearch.open({disclaimers: requestListControl.disclaimers, sight: requestListControl.sight})
	        	.then(function(result) {
	    			requestListControl.parseModelToDisclaimer(result);
	    			requestListControl.load(false);
    		});
		}

		/* Abre a modal para visualizar e adicionar os follow-ups
	  	* doc: Tipo do documento
		*    1 - Requisi‡Æo de Estoque
		*    2 - Solicita‡Æo de Compra
		*    3 - Solicita‡Æo de Cota‡Æo
		*    4 - Ordem de Compra
		*    5 - Cota‡Æo
		*    6 - Pedido de Compra
		* docNumber: Número do documento (requisição)
		* item: Código do item
 		* seqItem: Sequência do item
		* vendor: Código do fornecedor
		* seqQuote: Sequência da cotação ou ordem de compra no caso de pedido
		*/
		this.followUp = function(doc, docNumber, item, seqItem, vendor, seqQuote){
	        var modalInstance = modalFollowup.open({doc: doc, docNumber: docNumber, item: item, seqItem: seqItem, vendor: vendor, seqQuote: seqQuote});
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
		this.parseModelToDisclaimer = function(filters){
			this.disclaimers = [];

			for (key in filters) {
				var model = filters[key];
				var disclaimer = {};

				if(key == 'statusOpen') {
					if(model) this.disclaimers.push(modelToDisclaimer(key, 'l-open'));
				}else if(key == 'statusIncomplete') {
					if(model) this.disclaimers.push(modelToDisclaimer(key, 'l-incomplete'));
				}else if(key == 'statusClosed') {
					if(model) this.disclaimers.push(modelToDisclaimer(key, 'l-closed'));
				}else if(key == 'statusWithOrder') {
					if(model) this.disclaimers.push(modelToDisclaimer(key, 'l-with-order'));
				}else if(key == 'approved') {
					if(model) this.disclaimers.push(modelToDisclaimer(key, 'l-approved-gen'));
				}else if(key == 'notApproved') {
					if(model) this.disclaimers.push(modelToDisclaimer(key, 'l-not-approved'));
				}else if(key == 'inventoryRequest') {
					if(model) this.disclaimers.push(modelToDisclaimer(key, 'l-inventory'));
				}else if(key == 'purchaseRequest') {
					if(model) this.disclaimers.push(modelToDisclaimer(key, 'l-purchase'));
				}else if(key == 'quotationRequest') {
					if(model) this.disclaimers.push(modelToDisclaimer(key, 'l-quotation'));
				}else if(key == 'date') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-date', model.start, model.end, undefined, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc'));
						requestListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'requestNumber') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-request-number', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == 0) && model.end == 999999999) ? true : false;
						requestListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'site') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-site', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZ") ? true : false;
						requestListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'requester') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-requester', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZ") ? true : false;
						requestListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'descriptionItem') {					
					if(model) {
						disclaimer = modelToDisclaimer(key, 'l-description', model, undefined, true);						
						disclaimer.hide = (!model || model == "") ? true : false;
						requestListControl.disclaimers.push(disclaimer);
					}					
				}else if(key == 'descriptionRequest') {					
					if(model) {
						disclaimer = modelToDisclaimer(key, 'l-description', model, undefined, true);
						disclaimer.hide = (!model || model == "") ? true : false;
						requestListControl.disclaimers.push(disclaimer);
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
					if(itemDisclaimer.value) requestListControl.disclaimers.push(itemDisclaimer);
				}else if(key == 'itemDescription') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-item-description', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ") ? true : false;
						requestListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'itemCompCode') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-supplementary-code', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZZZZZZZZZ") ? true : false;
						requestListControl.disclaimers.push(disclaimer);
					}
				}else if(key == 'itemCompInfo') {
					if(model.start || model.end) {
						disclaimer = modelToDisclaimer(key, 'l-supplementary-info', model.start, model.end);
						disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZZZZZ") ? true : false;
						requestListControl.disclaimers.push(disclaimer);
					}
				}
			}
		}

    	// Remover requisição
    	// request: Requisição a ser removida
	    this.onRemoveRequest = function(request) {
			var textMsgRemoveRequest;
			if ( request['cod-id-ext'] != "" && 
				 request['cod-id-ext'] != "undefined" && 
				 request['cod-id-ext'] != undefined) {
				textMsgRemoveRequest = $rootScope.i18n('l-confirm-delete-operation-app-extern', [], 'dts/mcc');
			} else {
				textMsgRemoveRequest = $rootScope.i18n('l-confirm-delete-operation', [], 'dts/mcc');			
			}
	        // envia um evento para perguntar ao usuário
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', // titlo da mensagem
	            text: textMsgRemoveRequest, // texto da mensagem
	            cancelLabel: 'l-no', // label do botão cancelar
	            confirmLabel: 'l-yes', // label do botão confirmar
	            callback: function(isPositiveResult) { // função de retorno
	                if (isPositiveResult) { // se foi clicado o botão confirmar
	                	// chama o metodo de remover registro do service
	                    requestFactory.deleteRecord(request['nr-requisicao'], function(result) {
	                        if (!result['$hasError']) {
	                            // notifica o usuario que o registro foi removido
	                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                                type: 'success', // tipo de notificação
	                                title: $rootScope.i18n('l-request', [], 'dts/mcc'), // titulo da notificação
	                                // detalhe da notificação
	                                detail: $rootScope.i18n('l-request', [], 'dts/mcc') + ': '
	                                    + request['nr-requisicao'] + ', ' +
	                                    $rootScope.i18n('l-success-deleted', [], 'dts/mcc') + '!'
	                            });
	                            requestListControl.load(false);
	                        }
	                    });
	                }
	            }
	        });
	    };

	    // Remover um item da requisição
	    // item: Item a ser removido
	    this.onRemoveRequestItem = function(item){
	    	//if(!this.enableUpdate) return;
			// envia um evento para perguntar ao usuário
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', // titlo da mensagem
	            text: $rootScope.i18n('l-confirm-delete-operation', [], 'dts/mcc'), // texto da mensagem
	            cancelLabel: 'l-no', // label do botão cancelar
	            confirmLabel: 'l-yes', // label do botão confirmar
	            callback: function(isPositiveResult) { // função de retorno
	                if (isPositiveResult) { // se foi clicado o botão confirmar
	                	// chama o metodo de remover registro do service
	                    requestFactory.removeRequestItem({pNrRequisicao: item['nr-requisicao'], pSequencia: item['sequencia'], pItCodigo: item['it-codigo']}, function(result) {
	                        if (!result['$hasError']) {
	                            // notifica o usuario que o registro foi removido
	                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                                type: 'success', // tipo de notificação
	                                title: $rootScope.i18n('l-request-item', [], 'dts/mcc'), // titulo da notificação
	                                // detalhe da notificação
	                                detail: $rootScope.i18n('l-request-item', [], 'dts/mcc') + ': '
	                                    + item['nr-requisicao'] + ', ' +
	                                    $rootScope.i18n('l-success-deleted', [], 'dts/mcc') + '!'
	                            });
                        		requestListControl.load(false);
	                        }
	                    });
	                }
	            }
	        });
	    };

	    // *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	    this.init = function() {
            createTab = appViewService.startView(
	        	$state.is('dts/'+$scope.module+'/request.search') ? $rootScope.i18n('l-view-requests', [], 'dts/mcc') : $rootScope.i18n('l-requests', [], 'dts/mcc'),
	            $state.is('dts/'+$scope.module+'/request.search') ? 'mcc.request.SearchListCtrl' : 'mcc.request.ListCtrl',
	            requestListControl
            );

           	this.currentuser = $rootScope.currentuser.login;

			if(createTab === false && appViewService && appViewService.previousView && appViewService.previousView.name &&
	           ((this.isJustForView && appViewService.previousView.name  == "dts/"+$scope.module+"/request.start" ||
	           	!this.isJustForView && appViewService.previousView.name == "dts/"+$scope.module+"/request.search") ||
	            appViewService.previousView.name.toLowerCase().indexOf("dts/"+$scope.module+"/request") == -1) &&
	        	requestListControl.modelList.length > 0) {
	        	return;
	    	}

        	// Carrega as preferências do usuário e a lista de requisições
	        $totvsprofile.remote.get('/dts/mcc/request', 'pageSight', function(result) {
        		if(result[0] && result[0].dataValue) {
	        		requestListControl.sight = result[0].dataValue;
	        	} else {
	        		requestListControl.sight = 0;
	        	}

	        	if(!requestListControl.loaded) {
	        		requestListControl.loaded = true;
	        		requestListControl.loadDefaults();
	        	}
	        	requestListControl.load(false);
			});
	    };

	    if ($rootScope.currentuserLoaded) { this.init(); }

	    // *********************************************************************************
	    // *** Events Listeners
	    // *********************************************************************************

	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        requestListControl.init();
	    });
	}

	// *************************************************************************************
	// *** SERVICE MODAL FOLLOWUP
	// *************************************************************************************
	modalFollowup.$inject = ['$modal'];
	function modalFollowup($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/followup/followup.modal.html',
				controller: 'mcc.followup.modalFollowupCtrl as controller',
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

	// *************************************************************************************
	// *** SERVICE MODAL ADVANCED SEARCH
	// *************************************************************************************
	modalRequestAdvancedSearch.$inject = ['$modal'];
	function modalRequestAdvancedSearch($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/request/list/request.advanced.search.html',
				controller: 'mcc.request.AdvancedSearchCtrl as controller',
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
    modalRequestAdvancedSearchController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters'];
    function modalRequestAdvancedSearchController($rootScope, $scope, $modalInstance, parameters) {
        // *********************************************************************************
		// *** Variables
		// *********************************************************************************
        var RequestAdvancedSearchControl = this;
        this.disclaimers = [];
        this.parameters = [];
        this.model = {};
        this.todayTimestamp = new Date().getTime();

        // *********************************************************************************
		// *** Functions
		// *********************************************************************************
		this.init = function(){
			this.sight = parameters.sight;
			this.parseDiscaimerToModel();
		}

		// Transforma os disclaimers recebidos em parâmetros para a modal (setar os campos da pesquisa avançada)
		this.parseDiscaimerToModel = function(){
			// Transforma os disclaimers em parâmetros para a api
		   	angular.forEach(this.disclaimers, function(disclaimer) {

		   		if(typeof disclaimer.value == "string" && disclaimer.value.indexOf("&nbsp;") > -1){ /* Ranges */
		   			parameter = RequestAdvancedSearchControl.getParameterFromDisclaimer(disclaimer.property);
		   			if(parameter){
		   				if(disclaimer.property.match(/date*/)){ // Se for do tipo date converte para integer
							RequestAdvancedSearchControl.model[disclaimer.property] = {start: parseInt(parameter[0],10), end: parseInt(parameter[1],10)};
		   				}else{
		   					RequestAdvancedSearchControl.model[disclaimer.property] = {};
	   						if(parameter[0]) RequestAdvancedSearchControl.model[disclaimer.property].start = parameter[0];
	   						if(parameter[1]) RequestAdvancedSearchControl.model[disclaimer.property].end = parameter[1];
		   				}
		   			}
		   		}else { /* Campos normais */
					RequestAdvancedSearchControl.model[disclaimer.property] = disclaimer.value;
		   		}
            });
		}

		// Retorna um objeto da lista de disclaimers recebidos de acordo com o nome da propriedade
		this.getParameterFromDisclaimer = function(property){
			var value = undefined;
	   		$.grep(this.disclaimers, function(e){
	   			if(e.property === property){
					value = e.value.split("&nbsp;");
					return;
   				}
	   		});
	   		if(value[0] == 'undefined') value[0] = undefined;
	   		if(value[1] == 'undefined') value[1] = undefined;
	   		return value;
		};

		this.apply = function() {
			$modalInstance.close(this.model);
		}

		this.cancel = function() {
			$modalInstance.dismiss('cancel');
		}

        // *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
        this.disclaimers = parameters.disclaimers;

        this.init();
        // *********************************************************************************
		// *** Events Listners
		// *********************************************************************************
		$scope.$on('$destroy', function () {
			RequestAdvancedSearchControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		    $modalInstance.dismiss('cancel');
		});
    }

    // *********************************************************************************
    // *** SERVICE MODAL CONFIGURAÇÕES
    // *********************************************************************************
    modalChangeSight.$inject = ['$modal'];
    function modalChangeSight ($modal) {

		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/request/list/request.change.sight.html',
				controller: 'mcc.request.ChangeSightCtrl as controller',
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

    // *********************************************************************************
    // *** SERVICE MODAL REQUEST QUESTION
    // *********************************************************************************
    modalRequestQuestion.$inject = ['$modal'];
    function modalRequestQuestion ($modal) {
    	console.info("modalRequestQuestion");
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/mcc/html/request/edit/request.modal.question.html',
				controller: 'mcc.request.RequestQuestionModalCtrl as controller',
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



	// ########################################################
    // ### CONTROLLER MODAL CONFIGURAÇÕES
	// ########################################################
    requestListChangeSightController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters'];
    function requestListChangeSightController($rootScope, $scope, $modalInstance, parameters) {
        // *********************************************************************************
		// *** Variables
		// *********************************************************************************
        var requestListChangeSightControl = this;
        this.sight = 0;
        // *********************************************************************************
		// *** Functions
		// *********************************************************************************
		this.apply = function() {
			$modalInstance.close({sight: this.sight});
		}

		this.cancel = function() {
			$modalInstance.dismiss('cancel');
		}

        // *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
        this.sight = parameters.sight;

        // *********************************************************************************
		// *** Events Listners
		// *********************************************************************************
		$scope.$on('$destroy', function () {
			requestListChangeSightControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		    $modalInstance.dismiss('cancel');
		});
    }

    // ########################################################
    // ### CONTROLLER MODAL REQUEST QUESTION
	// ########################################################
    requestQuestionModalController.$inject = ['$rootScope', '$scope', '$modalInstance', 'parameters'];
    function requestQuestionModalController($rootScope, $scope, $modalInstance, parameters) {
        // *********************************************************************************
		// *** Variables
		// *********************************************************************************
        var requestQuestionModalControl = this;

        // *********************************************************************************
		// *** Functions
		// *********************************************************************************

		requestQuestionModalControl.cancel = function() {
			$modalInstance.dismiss('cancel');
		}

		requestQuestionModalControl.requestQuestionResponse = function(confirm){
	    	$modalInstance.close({changeRequestStatus: confirm});
	    }

        // *********************************************************************************
		// *** Events Listners
		// *********************************************************************************
		$scope.$on('$destroy', function () {
			requestQuestionModalControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
		    $modalInstance.dismiss('cancel');
		});
    }

	// ########################################################
	// ### CONTROLLER DETALHE
	// ########################################################
	requestDetailController.$inject = ['$rootScope', '$scope', '$stateParams', '$state', 'totvs.app-main-view.Service', 'mcc.ccapi354.Factory', 'mcc.zoom.serviceLegend', '$window', 'mcc.followup.ModalFollowUp', 'TOTVSEvent'];
    function requestDetailController($rootScope, $scope, $stateParams, $state, appViewService, requestFactory, legendService, $window, modalFollowup, TOTVSEvent) {
    	var requestDetailControl = this;

    	// *********************************************************************************
	    // *** Variáveis
	    // *********************************************************************************
	    this.model = {}; // mantem o conteudo do registro em detalhamento
	    this.listOfItems = []; // Itens da requisição
	    this.listOfItemsCount = 0; // Qtd itens da requisição
	    this.requestNumber = undefined;
	    this.enableUpdate = true;
	    this.isValidRequest = false;
	    $scope.module = $state.is('dts/mcc/request.detail') || $state.is('dts/mcc/request.searchDetail') ? 'mcc' : 'mce';
	    this.isJustForView = $state.is('dts/'+$scope.module+'/request.searchDetail') || $state.is('dts/mce/cd1409.requestDetail') || $state.is('dts/mce/cd1410.requestDetail');
	    this.previousView = undefined;
	    this.cd1409 = false;
        this.cd1410 = false;

	    // *********************************************************************************
	    // *** Methods
	    // *********************************************************************************
	    // metodo de leitura do regstro
	    this.load = function(id) {
	        this.model  = {}; // zera o model
	        this.loaded = false;
	        // chama a factory para retornar a requisição
	        requestFactory.getRequest({pNrRequisicao: id}, function(result) {
	            if (result['ttRequest'][0]) { // se houve retorno, carrega no model
	                requestDetailControl.model = result['ttRequest'][0];
	                requestDetailControl.requestNumber = result['ttRequest'][0]['nr-requisicao'];
	                requestDetailControl.isValidRequest = true;
	            } else {
	            	requestDetailControl.model = {};
	            	requestDetailControl.isValidRequest = false;
	            }
	            requestDetailControl.loaded = true;
	        });
	        requestDetailControl.loadItens(false);
	    }

	    this.translateRequestType = function(tpRequis) {
	    	return legendService.requestType.NAME(tpRequis);
	    }

		/* Abre a modal para visualizar e adicionar os follow-ups
	  	* doc: Tipo do documento
		*    1 - Requisi‡Æo de Estoque
		*    2 - Solicita‡Æo de Compra
		*    3 - Solicita‡Æo de Cota‡Æo
		*    4 - Ordem de Compra
		*    5 - Cota‡Æo
		*    6 - Pedido de Compra
		* docNumber: Número do documento (requisição)
		* item: Código do item
 		* seqItem: Sequência do item
		* vendor: Código do fornecedor
		* seqQuote: Sequência da cotação ou ordem de compra no caso de pedido
		*/
		this.followUp = function(doc, docNumber, item, seqItem, vendor, seqQuote){
	        var modalInstance = modalFollowup.open({doc: doc, docNumber: docNumber, item: item, seqItem: seqItem, vendor: vendor, seqQuote: seqQuote});
		}

    	// Retorna para a página anterior
	    this.back = function() {
	    	if(requestDetailControl.previousView && requestDetailControl.previousView.name) {
				requestDetailControl.backToList();
			} else {
				$window.history.back();
			}
	    }

        this.backToList = function() {
            if(requestDetailControl.cd1409) {
                if($state.is("dts/mce/cd1409.requestDetail")) {
                    $state.go('dts/mce/cd1409.start');
                }                                     
            } 
            else if(requestDetailControl.cd1410) {
                if($state.is("dts/mce/cd1410.requestDetail")) {
                    $state.go('dts/mce/cd1410.start');
                }                                     
            }
            else {
                if($state.is("dts/"+$scope.module+"/request.searchDetail")) {
                    $state.go('dts/'+$scope.module+'/request.search');
                } else {
                    $state.go('dts/'+$scope.module+'/request.start');
                }
            }
        };

	    // Executada quando o usuário clicar em "Aplicar" no componente totvs-editable
	    this.applyZoom = function(reqNumber) {
	    	if(reqNumber) {
	    		requestDetailControl.requestNumber = reqNumber;
	    		requestDetailControl.load(reqNumber);
    		}
	    }

	    // Carrega os itens da requisição
	    // isMore: Identifica se o usuário clicou em "Mais resultados" (paginação)
	    this.loadItens = function(isMore){
	        if(!isMore) { // Não é mais resultados
	        	this.listOfItems = [];

	        	// chama a factory para retornar os itens da requisição
		        requestFactory.getRequestItens({pNrRequisicao: requestDetailControl.requestNumber}, function(result) {
		            if (result['ttItRequisicaoResumida']) { // se houve retorno, carrega no model
		            	$.each(result['ttItRequisicaoResumida'], function(index, value) {
            				result['ttItRequisicaoResumida'][index]['it-codigo-link'] = encodeURIComponent(encodeURIComponent(result['ttItRequisicaoResumida'][index]['it-codigo']));
            			});
		                requestDetailControl.listOfItems = result['ttItRequisicaoResumida'];
		                requestDetailControl.listOfItemsCount = result.length;
		                requestDetailControl.enableUpdate = result.lHabilita;
		            }
		        });
	        }else {
	        	var lastItem = requestDetailControl.listOfItems[requestDetailControl.listOfItems.length - 1]; // Pega o último registro da lista
        		requestFactory.getRequestItens({pNrRequisicao: requestDetailControl.requestNumber,
        											  pRowidItRequisicao: lastItem['r-rowid']}, function(result) {
		            if (result['ttItRequisicaoResumida']) {
		                requestDetailControl.listOfItems.push.apply(requestDetailControl.listOfItems, result['ttItRequisicaoResumida']); // Adiciona os registros retornados na lista principal
		            }
		        });
	        }
	    }

	    // metodo para a ação de remover uma requisição
	    this.onRemove = function() {
	        // envia um evento para perguntar ao usuário
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', // titlo da mensagem
	            text: $rootScope.i18n('l-confirm-delete-operation', [], 'dts/mcc'), // texto da mensagem
	            cancelLabel: 'l-no', // label do botão cancelar
	            confirmLabel: 'l-yes', // label do botão confirmar
	            callback: function(isPositiveResult) { // função de retorno
	                if (isPositiveResult) { // se foi clicado o botão confirmar
	                	// chama o metodo de remover registro do service
	                    requestFactory.deleteRecord(requestDetailControl.model ['nr-requisicao'], function(result) {
	                        if (!result['$hasError']) {
	                            // notifica o usuario que o registro foi removido
	                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                                type: 'success', // tipo de notificação
	                                title: $rootScope.i18n('l-request', [], 'dts/mcc'), // titulo da notificação
	                                // detalhe da notificação
	                                detail: $rootScope.i18n('l-request', [], 'dts/mcc') + ': '
	                                    + requestDetailControl.model['nr-requisicao'] + ', ' +
	                                    $rootScope.i18n('l-success-deleted', [], 'dts/mcc') + '!'
	                            });
	                            // muda o state da tela para o state inicial, que é a lista
	                            $state.go('dts/'+$scope.module+'/request.start');
	                        }
	                    });
	                }
	            }
	        });
	    };

	    // Função para remoção de um item da requisição
	    // item: Item a ser removido
	    this.removeRequestItem = function(item){
	    	if (!this.enableUpdate) return;

			// envia um evento para perguntar ao usuário
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', // titlo da mensagem
	            text: $rootScope.i18n('l-confirm-delete-operation', [], 'dts/mcc'), // texto da mensagem
	            cancelLabel: 'l-no', // label do botão cancelar
	            confirmLabel: 'l-yes', // label do botão confirmar
	            callback: function(isPositiveResult) { // função de retorno
	                if (isPositiveResult) { // se foi clicado o botão confirmar
	                	// chama o metodo de remover registro do service
	                    requestFactory.removeRequestItem({pNrRequisicao: item['nr-requisicao'], pSequencia: item['sequencia'], pItCodigo: item['it-codigo']}, function(result) {
	                        if (!result['$hasError']) {
	                            // notifica o usuario que o registro foi removido
	                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                                type: 'success', // tipo de notificação
	                                title: $rootScope.i18n('l-request-item', [], 'dts/mcc'), // titulo da notificação
	                                // detalhe da notificação
	                                detail: $rootScope.i18n('l-request-item', [], 'dts/mcc') + ': '
	                                    + requestDetailControl.model['nr-requisicao'] + ', ' +
	                                    $rootScope.i18n('l-success-deleted', [], 'dts/mcc') + '!'
	                            });
                    	    	var index = requestDetailControl.listOfItems.indexOf(item);
								if (index != -1) {
									requestDetailControl.listOfItems.splice(index, 1);
									requestDetailControl.listOfItemsCount -= 1;
								}
	                        }
	                    });
	                }
	            }
	        });
	    }

	    // *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	    this.init = function() {

	    	requestDetailControl.cd1409 = $state.is('dts/mce/cd1409.requestDetail');
                requestDetailControl.cd1410 = $state.is('dts/mce/cd1410.requestDetail');
			
	    	// createTab para tela cd1409
	    	if(requestDetailControl.cd1409){
	    		createTab = appViewService.startView(
	    			$rootScope.i18n('l-realization') + ' ' + $rootScope.i18n('l-request'), 
	    		    'mcc.request.SearchItemDetailCtrl', 
	    			requestDetailControl
	    		);                
	    	} 
            // createTab para tela cd1410
	    	else if(requestDetailControl.cd1410){
	    		createTab = appViewService.startView(
	    			$rootScope.i18n('l-return-mce') + ' ' + $rootScope.i18n('l-request'), 
	    		    'mcc.request.SearchItemDetailCtrl', 
	    			requestDetailControl
	    		);
	    	}
               else {
	    		createTab = appViewService.startView(
	    			$state.is('dts/'+$scope.module+'/request.searchDetail') ? $rootScope.i18n('l-view-requests', [], 'dts/mcc') : $rootScope.i18n('l-requests', [], 'dts/mcc'),
	    			$state.is('dts/'+$scope.module+'/request.searchDetail') ? 'mcc.request.SearchDetailCtrl' : 'mcc.request.DetailCtrl',
	    			requestDetailControl
	    		);
	    	}
	    	
	    	requestDetailControl.previousView = (appViewService && appViewService.previousView)
	    									    ? appViewService.previousView : undefined;
	    	
	    	if(createTab === false && requestDetailControl.previousView && requestDetailControl.previousView.controller &&
	    		requestDetailControl.requestNumber == $stateParams.id &&
				!$rootScope.isCopyItemRequest &&
	    		requestDetailControl.previousView.controller != 'mcc.request.EditCtrl'     &&
	    		requestDetailControl.previousView.controller != 'mcc.request.ItemEditCtrl' &&
	    		requestDetailControl.previousView.controller != 'mcc.request.CopyItemCtrl' &&
                        (!requestDetailControl.cd1409 && !requestDetailControl.cd1410)) {
	    		return;
	    	}
	    	
	    	if ($stateParams && $stateParams.id) { // se houver parametros na URL
	    		requestDetailControl.requestNumber =  $stateParams.id;
				$rootScope.isCopyItemRequest = false;
	    		this.load($stateParams.id);
	    	}
	    }

	    // se o contexto da aplicação já carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { this.init(); }

	    // *********************************************************************************
	    // *** Events Listeners
	    // *********************************************************************************

	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        requestDetailControl.init();
	    });
	}

	// ########################################################
	// ### CONTROLLER DETALHE ITEM
	// ########################################################
	requestItemDetailController.$inject = ['$rootScope', '$scope', '$stateParams', '$state', '$location', 'totvs.app-main-view.Service', 'mcc.ccapi354.Factory', 'mcc.zoom.serviceLegend', '$window', 'TOTVSEvent'];
    function requestItemDetailController($rootScope, $scope, $stateParams, $state, $location, appViewService, requestFactory, legendService, $window, TOTVSEvent) {
    	var requestItemDetailControl = this;
    	// *********************************************************************************
	    // *** Variáveis
	    // *********************************************************************************
	    $scope.module = $state.is('dts/mcc/request.itemDetail') ||  $state.is('dts/mcc/request.searchItemDetail') ? 'mcc' : 'mce';
	    this.isJustForView = $state.is('dts/'+$scope.module+'/request.searchItemDetail') || $state.is('dts/mce/cd1409.itemRequestDetail') || $state.is('dts/mce/cd1410.itemRequestDetail'); 
	    this.requestNumber = undefined;
	    this.requestItemCod = undefined;
	    this.requestItemSeq = undefined;
	    this.enableUpdate = true;
	    this.model = {};
	    this.previousView = undefined;
	    this.showDetail = false;
	    this.cd1409 = false;
        this.cd1410 = false;

	    // *********************************************************************************
	    // *** Methods
	    // *********************************************************************************
	    /* Carrega os detalhes de um item
		* req: Número da requisição a qual o item pertence
		* seq: Sequência do item
		* item: Código do item
		*/
	    this.loadItem = function(req, seq, item){
	    	item = item || ""; // Se o código do item não estiver definido deve ser branco;
	    	item = decodeURIComponent(decodeURIComponent(decodeURIComponent(item)));

        	// chama a factory para retornar os detalhes do item da requisição
	        requestFactory.getRequestItem({pNrRequisicao: req, pSequencia: seq, pItCodigo: item}, function(result) {
	            if (result['dsItRequest']) { // Se houve retorno
            		requestItemDetailControl.model = result['dsItRequest'][0];
            		requestItemDetailControl.model['it-codigo-link'] = encodeURIComponent(encodeURIComponent(result['dsItRequest'][0]['it-codigo']));
            		requestItemDetailControl.requestNumber = result['dsItRequest'][0]['nr-requisicao'];
            		requestItemDetailControl.enableUpdate = result.lHabilita;
	            }
	        });
	    };

	    /*Retorna a descrição do tipo da requisição de acordo o tipo da requisição.
	    * tpRequis: Tipo da requisição
		*		1: Requisição de estoque
		*		2: Solicitação de compras
		*		3: Spçocotação de cotação
	    */
	    this.translateRequestType = function(tpRequis) {
	    	return legendService.requestType.NAME(tpRequis);
	    }

    	// Retorna para a página anterior
	    this.back = function() {
	    	if(requestItemDetailControl.previousView && requestItemDetailControl.previousView.name) {
		    	$location.$$search = {};
		    	var prev = requestItemDetailControl.previousView.name;
				switch(true) {
				    case prev == 'dts/'+$scope.module+'/request.start':
				        requestItemDetailControl.backToList();
				        break;
				    case prev == 'dts/'+$scope.module+'/request.search':
				        requestItemDetailControl.backToList();
				        break;
			        case prev == 'dts/'+$scope.module+'/request.edit':
			        	if($state.is('dts/'+$scope.module+'/request.searchItemDetail')) {
		        			requestItemDetailControl.backToList();
		        		} else {
		        			$location.path('dts/'+$scope.module+'/request/edit/'+requestItemDetailControl.requestNumber);
		        		}
			        	break;
		        	case prev == 'dts/'+$scope.module+'/request.itemCopy':
		        		if($state.is('dts/'+$scope.module+'/request.searchItemDetail')) {
	        				requestItemDetailControl.backToList();
	        			} else {
        					$location.path('dts/'+$scope.module+'/request/item/copy/'+$stateParams.previous);
	        			}
		        		break;
	        		case prev == 'dts/'+$scope.module+'/request.detail':
    					requestItemDetailControl.backToDetail();
	    				break;
					case prev == 'dts/'+$scope.module+'/request.searchDetail':
						requestItemDetailControl.backToDetail();
						break;
					case prev == "dts/mce/cd1409.start":					
					 	requestItemDetailControl.backToList();
				        break;
					case prev == "dts/mce/cd1409.requestDetail":					
					 	requestItemDetailControl.backToDetail();
	    				break;
                    case prev == "dts/mce/cd1410.start":					
					 	requestItemDetailControl.backToList();
				        break;
					case prev == "dts/mce/cd1410.requestDetail":					
					 	requestItemDetailControl.backToDetail();
	    				break;    
				    default:
				    	requestItemDetailControl.backToList();
	    				break;
				}
			} else {
				$window.history.back();
			}
        }

        this.backToList = function() {	
            if(requestItemDetailControl.cd1409) {
                // DIRECIONA PARA A TELA DE ATENDIMENTO DE REQUISIÇÕES - CD1409
                if($state.is("dts/mce/cd1409.itemRequestDetail")) {
                    $state.go('dts/mce/cd1409.start');
                }                 
            }
            else if(requestItemDetailControl.cd1410) {
                // DIRECIONA PARA A TELA DE DEVOLUCAO DE REQUISIÇÕES - CD1410
                if($state.is("dts/mce/cd1410.itemRequestDetail")) {
                    $state.go('dts/mce/cd1410.start');
                }                 
            }
            else {
                if($state.is('dts/'+$scope.module+'/request.searchItemDetail')) {
                    $state.go('dts/'+$scope.module+'/request.search');
                } else {
                    $state.go('dts/'+$scope.module+'/request.start');
                }
            }
        }

        this.backToDetail = function() {
            if(requestItemDetailControl.cd1409) {
                // DIRECIONA PARA A TELA DE DETALHE DA REQUISCAO - CD1409
                if($state.is("dts/mce/cd1409.itemRequestDetail")) {
                    $state.go('dts/mce/cd1409.requestDetail');
                }                 
            } 
            else if(requestItemDetailControl.cd1410) {
                // DIRECIONA PARA A TELA DE DETALHE DA REQUISCAO - CD1410
                if($state.is("dts/mce/cd1410.itemRequestDetail")) {
                    $state.go('dts/mce/cd1410.requestDetail');
                }                 
            }
            else {
                if($state.is('dts/'+$scope.module+'/request.searchItemDetail')) {
                    $location.path('dts/'+$scope.module+'/request/search/detail/'+requestItemDetailControl.requestNumber);
                } else {
                    $location.path('dts/'+$scope.module+'/request/detail/'+requestItemDetailControl.requestNumber);
                }
            }    
        }

        // *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
        this.init = function() {

            // VERIFICA SE FOI CHAMADO DA TELA DE ATENDIMENTO DE REQUISIÇÕES(CD1409 ou CD1410)
            requestItemDetailControl.cd1409 = $state.is('dts/mce/cd1409.itemRequestDetail');
            requestItemDetailControl.cd1410 = $state.is('dts/mce/cd1410.itemRequestDetail');

            // createTab para tela cd1409
            if(requestItemDetailControl.cd1409){
                createTab = appViewService.startView(
                    $rootScope.i18n('l-realization') + ' ' + $rootScope.i18n('l-request'), 
                    'mcc.request.SearchItemDetailCtrl', 
                    requestItemDetailControl
                );
            } 
            // createTab para tela cd1410
            else if(requestItemDetailControl.cd1410){
                createTab = appViewService.startView(
                    $rootScope.i18n('l-return-mce') + ' ' + $rootScope.i18n('l-request'), 
                    'mcc.request.SearchItemDetailCtrl', 
                    requestItemDetailControl
                );
            } else {
                createTab = appViewService.startView(
                     $state.is('dts/'+$scope.module+'/request.searchItemDetail')  ? $rootScope.i18n('l-view-requests', [], 'dts/mcc') : $rootScope.i18n('l-requests', [], 'dts/mcc'),
                     $state.is('dts/'+$scope.module+'/request.searchItemDetail')  ? 'mcc.request.SearchItemDetailCtrl' : 'mcc.request.ItemDetailCtrl',
                     requestItemDetailControl
                );
            }
            

            this.previousView = (appViewService && appViewService.previousView)
                                ? appViewService.previousView : undefined;

            this.showDetail = this.previousView && this.previousView.name &&
                              (this.previousView.name == "dts/"+$scope.module+"/request.detail" ||
                               this.previousView.name == "dts/"+$scope.module+"/request.searchDetail" ||
                               this.previousView.name == "dts/mce/cd1409.requestDetail" ||
                               this.previousView.name == "dts/mce/cd1410.requestDetail") ? true : false;
                
            /*Troca de abas*/
            if(createTab === false &&
                this.requestNumber  == $stateParams.req   &&
                this.requestItemSeq == $stateParams.seq &&
                (($stateParams.item && this.requestItemCod == $stateParams.item) || //Tratamento para item branco
                  (!$stateParams.item && this.requestItemCod == '')) && 
                !requestItemDetailControl.cd1409 &&
		        !requestItemDetailControl.cd1410 && 
		        this.previousView.name != "dts/mcc/request.itemEdit" &&
		        this.previousView.name != "dts/mcc/request.detail"){					
                return;
            }

            this.requestNumber  = $stateParams.req  || 0;
        	this.requestItemCod = $stateParams.item || "";
			this.requestItemSeq = $stateParams.seq  || 0;
	        requestItemDetailControl.loadItem($stateParams.req, $stateParams.seq, $stateParams.item);
	    }

	    // se o contexto da aplicação já carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { this.init(); }

	    // *********************************************************************************
	    // *** Events Listeners
	    // *********************************************************************************
	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        requestDetailControl.init();
	    });
	}

	// ########################################################
	// ### CONTROLLER EDIÇÃO/CRIAÇÃO REQUISIÇÃO
	// ########################################################
	requestEditController.$inject = ['$rootScope', '$scope', '$stateParams', '$location', '$state', 'totvs.app-main-view.Service', 'mcc.ccapi354.Factory', 'totvs.utils.Service', '$timeout', '$window', 'mcc.followup.ModalFollowUp', 'TOTVSEvent'];
    function requestEditController($rootScope, $scope, $stateParams, $location, $state, appViewService, requestFactory, totvsUtilsService, $timeout, $window, modalFollowup, TOTVSEvent) {
    	RequestEditControl = this;

    	// *********************************************************************************
	    // *** Atributos
	    // *********************************************************************************
	    this.requestNumber = undefined;
	    this.model = {}; // mantem o conteudo do registro em edição/inclusão
	    this.isUpdate = false;
	    this.listOfItems = undefined;
	    this.listOfItemsCount = 0;
	    this.enableUpdate = false;
	    this.savedAndContinued = false;
    	$scope.module = ($state.is('dts/mcc/request.new') || $state.is('dts/mcc/request.edit')) ? 'mcc' : 'mce';
    	// *********************************************************************************
	    // *** Methods
	    // *********************************************************************************

	    // Carrega as informações da requisição a ser editada
	    // id: Número da requisição
	    this.loadUpdate = function(id) {
	    	this.model = {}; // zera o model
	        // chama o servico para retornar o registro
	        requestFactory.getRequestToUpdate({pNrRequisicao:id}, function(result) {
	        	if (result['ttRequestDefault']) { // se houve retorno, carrega no model
	                RequestEditControl.model = result['ttRequestDefault'][0];
	                RequestEditControl.enableFields = [];
	                for(i=0; i < result["ttEnableFields"].length; i++){
	                	RequestEditControl.enableFields[result["ttEnableFields"][i].campo] = result["ttEnableFields"][i].habilitado;
	                }
	                fieldFocus();
	            }
	        });
	        this.loadItens(false);
	    }

	    // Executada ao clicar em "Salvar e Novo"
	    this.saveNew = function(){
	    	this.savedAndContinued = true;
	    	this.save();
	    }

	    // método que retorna os valores default criação da requisição
	    this.loadNew = function(){
	    	requestFactory.getDefaults(function(result) {
	            if (result['ttRequestDefault']) { // se houve retorno, carrega no model
	                RequestEditControl.model = result["ttRequestDefault"][0];

					if ($scope.module == 'mcc') {
						RequestEditControl.model['tp-requis'] = 2;
					}

					RequestEditControl.enableFields = [];
	                for(i=0; i < result["ttEnableFields"].length; i++){
	                	RequestEditControl.enableFields[result["ttEnableFields"][i].campo] = result["ttEnableFields"][i].habilitado;
	                }
	                fieldFocus();
	            }
	        });
	    }

	    // Carrega os itens da requisição
	    // isMore: Identifica se o usuario clicou em "Mais resultados" para realziar a paginação
	    this.loadItens = function(isMore){
	        if(!isMore) { // Não é mais resultados
	        	// chama a factory para retornar os itens da requisição
		        requestFactory.getRequestItens({pNrRequisicao: RequestEditControl.requestNumber}, function(result) {
		            if (result['ttItRequisicaoResumida']) { // se houve retorno, carrega no model
		            	$.each(result['ttItRequisicaoResumida'], function(index, value) {
            				result['ttItRequisicaoResumida'][index]['it-codigo-link'] = encodeURIComponent(encodeURIComponent(result['ttItRequisicaoResumida'][index]['it-codigo']));
            			});

		                RequestEditControl.listOfItems = result['ttItRequisicaoResumida'];
		                RequestEditControl.listOfItemsCount = result.length;
		                RequestEditControl.enableUpdate = result.lHabilita;
		            }
		        });
	        }else {
	        	var lastItem = RequestEditControl.listOfItems[RequestEditControl.listOfItems.length - 1]; // Pega o último registro da lista
        		requestFactory.getRequestItens({pNrRequisicao: RequestEditControl.requestNumber,
        											  pRowidItRequisicao: lastItem['r-rowid']}, function(result) {
		            if (result['ttItRequisicaoResumida']) {
		                RequestEditControl.listOfItems.push.apply(RequestEditControl.listOfItems, result['ttItRequisicaoResumida']); // Adiciona os registros retornados na lista principal
		            }
		        });
	        }
	    }

		/* Abre a modal para visualizar e adicionar os follow-ups
	  	* doc: Tipo do documento
		*    1 - Requisi‡Æo de Estoque
		*    2 - Solicita‡Æo de Compra
		*    3 - Solicita‡Æo de Cota‡Æo
		*    4 - Ordem de Compra
		*    5 - Cota‡Æo
		*    6 - Pedido de Compra
		* docNumber: Número do documento (requisição)
		* item: Código do item
 		* seqItem: Sequência do item
		* vendor: Código do fornecedor
		* seqQuote: Sequência da cotação ou ordem de compra no caso de pedido
		*/
		this.followUp = function(doc, docNumber, item, seqItem, vendor, seqQuote){
	        var modalInstance = modalFollowup.open({doc: doc, docNumber: docNumber, item: item, seqItem: seqItem, vendor: vendor, seqQuote: seqQuote});
		}

	    // Remoção de um item da requisição
	    // item: Item a ser removido
	    this.removeRequestItem = function(item){
			// envia um evento para perguntar ao usuário
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', // titlo da mensagem
	            text: $rootScope.i18n('l-confirm-delete-operation', [], 'dts/mcc'), // texto da mensagem
	            cancelLabel: 'l-no', // label do botão cancelar
	            confirmLabel: 'l-yes', // label do botão confirmar
	            callback: function(isPositiveResult) { // função de retorno
	                if (isPositiveResult) { // se foi clicado o botão confirmar
	                	// chama o metodo de remover registro do service
	                    requestFactory.removeRequestItem({pNrRequisicao: item['nr-requisicao'], pSequencia: item['sequencia'], pItCodigo: item['it-codigo']}, function(result) {
	                        if (!result['$hasError']) {
	                            // notifica o usuario que o registro foi removido
	                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                                type: 'success', // tipo de notificação
	                                title: $rootScope.i18n('l-request-item', [], 'dts/mcc'), // titulo da notificação
	                                // detalhe da notificação
	                                detail: $rootScope.i18n('l-request-item', [], 'dts/mcc') + ': '
	                                    + RequestEditControl.model['nr-requisicao'] + ', ' +
	                                    $rootScope.i18n('l-success-deleted', [], 'dts/mcc') + '!'
	                            });
                    	    	var index = RequestEditControl.listOfItems.indexOf(item);
								if (index != -1) {
									RequestEditControl.listOfItems.splice(index, 1);
									RequestEditControl.listOfItemsCount -= 1;
								}
	                        }
	                    });
	                }
	            }
	        });
	    }

	    // Salva a edição (se for uma edição)
	    // Salva a criação do registro (se for uma criação)
	    this.save = function() {
	
			RequestEditControl.requestNumber = RequestEditControl.model['nr-requisicao'];
			
	        // verificar se o formulario tem dados invalidos
	        if (this.isInvalidForm()) { return; }

	        // se for a tela de edição, faz o update
	        if ($state.is('dts/'+$scope.module+'/request.edit')) {
	            requestFactory.updateRecord(this.model, function(result) {
	            	if(!result.$hasError){ // se gravou o registro com sucesso
		                RequestEditControl.onSaveUpdate(true);
	            	}
	            });
	        } else { // senão faz o create
	            requestFactory.saveRecord(this.model, function(result) {
	                if(!result.$hasError){ // se gravou o registro com sucesso
	                	RequestEditControl.onSaveUpdate(false);
                	}
	            });
				this.loadNew();
	        }
	    }

	    // metodo para notificar o usuario da gravaçao do registro com sucesso e realizar lógicas de redirecionamento
	    this.onSaveUpdate = function(isUpdate) {

	    	if (!this.savedAndContinued) {
    			RequestEditControl.redirectToItem(isUpdate);
	    	}

	        // notifica o usuario que conseguiu salvar o registro
	        $rootScope.$broadcast(TOTVSEvent.showNotification, {
	            type: 'success',
	            title: $rootScope.i18n('l-request', [], 'dts/mcc'),
	            detail: $rootScope.i18n('l-request', [], 'dts/mcc') + ': ' + RequestEditControl.requestNumber + ', ' +
	            (isUpdate ? $rootScope.i18n('l-success-updated', [], 'dts/mcc') : $rootScope.i18n('l-success-created', [], 'dts/mcc')) + '!'
	        });

	        if (this.savedAndContinued) {
        		this.model = {};
        		this.savedAndContinued = false;
        		this.loadNew();
        		fieldFocus();
	        }
	    }

	    // Cancelar operação de criação ou editação e retornar para a página anterior
	    this.cancel = function() {
	        // solicita que o usuario confirme o cancelamento da edição/inclusão
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-cancel-operation', [], 'dts/mcc'),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {
	                	if(RequestEditControl.previousView && RequestEditControl.previousView.name) {
		                	switch(RequestEditControl.previousView.name) {
							    case "dts/mcc/request.start":
							        $state.go('dts/'+$scope.module+'/request.start');
							        break;
							    case "dts/mcc/request.detail":
							        $location.path('dts/'+$scope.module+'/request/detail/' + RequestEditControl.model['nr-requisicao']);
							        break;
							    default:
							        $state.go('dts/'+$scope.module+'/request.start');
							        break;
							}
						} else {
							$window.history.back();
						}
	                }
	            }
	        });
	    }

	    // metodo para verificar se o formulario é válido
	    this.isInvalidForm = function() {
	        var messages = [];
	        var isInvalidForm = false;

			// verifica se o número da requisição foi informado
	        if (!this.model['nr-requisicao'] || this.model['nr-requisicao'].length == 0) {
	            isInvalidForm = true;
	            messages.push('l-request-number');
	        }

	        // verifica se o estabelecimento foi informado
	        if (!this.model['cod-estabel'] || this.model['cod-estabel'].length == 0) {
	            isInvalidForm = true;
	            messages.push('l-site');
	        }

	        // verifica se o emitente foi informado
	        if (!this.model['nome-abrev'] || this.model['nome-abrev'].length === 0) {
	            isInvalidForm = true;
	            messages.push('l-requester');
	        }

	        // verifica se a data da requisição foi informada
	        if (!this.model['dt-requisicao'] || this.model['dt-requisicao'].length == 0) {
	            isInvalidForm = true;
	            messages.push('l-requisition-date');
	        }

	        // verifica se o tipo da requisição foi informada
	        if (!this.model['tp-requis'] || this.model['tp-requis'].length == 0) {
	            isInvalidForm = true;
	            messages.push('l-type');
	        }

	        // se for invalido, monta e mostra a mensagem
	        if (isInvalidForm) {
	            var warning = $rootScope.i18n('l-field', [], 'dts/mcc');
	            if (messages.length > 1) {
	                warning = $rootScope.i18n('l-fields', [], 'dts/mcc');
	            }
	            angular.forEach(messages, function(item) {
	                warning = warning + ' ' + $rootScope.i18n(item) + ',';
	            });
	            if (messages.length > 1) {
	                warning = warning + ' ' + $rootScope.i18n('l-requireds', [], 'dts/mcc');
	            } else {
	                warning = warning + ' ' + $rootScope.i18n('l-required', [], 'dts/mcc');
	            }
	            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'error',
	                title: $rootScope.i18n('l-attention', [], 'dts/mcc'),
	                detail: warning
	            });
	        }
	        return isInvalidForm;
	    }

	    // redireciona para a tela de detalhar
	    this.redirectToItem = function(isUpdate) {
	    	if(isUpdate){
	        	$state.go('dts/'+$scope.module+'/request.start');
        	}else {
        		$location.path('dts/'+$scope.module+'/request/item/new/' + RequestEditControl.requestNumber );
        	}
	    }

		/* Foco no primerio campo */
	    function fieldFocus() {
        	$timeout(function() {
	        	if(!$('#requestNumber').find('input:last').prop('disabled')) {
	        		totvsUtilsService.focusOn('requestNumber');
	        	} else {
					totvsUtilsService.focusOn('requestDeliveryPlace');
	        	}
        	}, 100);
	    }

	    // *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	    this.init = function() {
	        createTab = appViewService.startView($rootScope.i18n('l-requests', [], 'dts/mcc'), 'mcc.request.EditCtrl', RequestEditControl);

	        RequestEditControl.isUpdate = $state.is('dts/'+$scope.module+'/request.edit');;
	       	RequestEditControl.showDetail = (appViewService && appViewService.previousView && appViewService.previousView.controller &&
	       								    (appViewService.previousView.controller == 'mcc.request.ListCtrl'))
       									 	? false : true;
	       	RequestEditControl.previousView = (appViewService && appViewService.previousView)
	       									  ? appViewService.previousView : undefined;

	        if(	appViewService && appViewService.previousView && appViewService.previousView.name &&
	        	createTab === false &&
	        	(appViewService.previousView.name.toLowerCase().indexOf("dts/"+$scope.module+"/request") == -1 ||
	             appViewService.previousView.name.toLowerCase().indexOf("dts/"+$scope.module+"/request.search") > -1)) {
	        	return;
	    	}

	        this.model = {};

	        // se houver parametros na URL
	        if ($stateParams && $stateParams.id) {
	        	this.requestNumber = $stateParams.id;
	            this.loadUpdate($stateParams.id);
	        }else { // se não, incica com o model em branco (inclusão)
	            this.loadNew(); //busca os valores defaults para criação do registro.
	        }
	    }

	    // se o contexto da aplicação já carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { this.init(); }

	    // *********************************************************************************
	    // *** Events Listners
	    // *********************************************************************************

	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        RequestEditControl.init();
	    });
    }

	// ########################################################
	// ### CONTROLLER EDIÇÃO/CRIAÇÃO ITEM DA REQUISIÇÃO
	// ########################################################
	requestItemEditController.$inject = ['$rootScope', '$scope', '$stateParams', '$window', '$location', '$state',
	'totvs.app-main-view.Service', 'mcc.ccapi354.Factory', 'mcc.referencia.zoom', 'mcc.tab-unidade.zoom', 'utb.cta-ctbl-integr.zoom',
	'utb.ccusto.zoom', 'men.item.zoom', 'mcc.utilizacao-mater.zoom' ,'$timeout', 'totvs.utils.Service', 'TOTVSEvent', 'mcc.request.ModalRequestQuestion'];
    function requestItemEditController($rootScope, $scope, $stateParams, $window, $location, $state, appViewService, requestFactory, referenceZoomService, UMZoomService, serviceIntegrationAcct, serviceCostCenter, serviceItem, serviceUtilizationCode, $timeout, totvsUtilsService, TOTVSEvent, modalRequestQuestion) {
    	var requestItemEditControl = this;
    	// *********************************************************************************
	    // *** Atributos
	    // *********************************************************************************
	    this.model = {};
	    this.ttRequestDefaultOld = {};
	    this.priorities = [
	    	{
	    		'name': $rootScope.i18n('l-low', [], 'dts/mcc'),
	    		'value': 3
	    	},
	    	{
	    		'name': $rootScope.i18n('l-medium', [], 'dts/mcc'),
				'value': 2
	    	},
	    	{
	    		'name': $rootScope.i18n('l-high', [], 'dts/mcc'),
				'value': 1
	    	},
	    	{
	    		'name': $rootScope.i18n('l-very-high', [], 'dts/mcc'),
				'value': 0
		}];

		this.serviceReference = referenceZoomService; // Zoom de referência (serviço)
		this.serviceUM = UMZoomService; // Zoom de unidade de medida (serviço)
		this.serviceIntegrAcct = serviceIntegrationAcct; // Zoom de conta (serviço)
		this.serviceCostCenter = serviceCostCenter; // Zoom de centro de custo (serviço)
		this.serviceItem = serviceItem;
		this.serviceUtilizationCode = serviceUtilizationCode;

	    this.savedAndContinued = false; // Identifica se o usuário clicou em salvar e continuar, ou seja, inclusão de outro item.
	    this.redirect = false;
	    this.requestNumber = undefined;
	    this.isUpdate = false;
	    this.showDetail = false;

	    this.referenceZoomField = {};
	    this.UMZoomField = {};
	    this.integrationAccountZoomField = {};
	    this.costCenterZoomField = {};
	    this.itemZoomField = {};
	    this.utilizationZoomField = {};

	    this.integrationAccountInit = {};
	    this.costCenterInit = {};
	    this.utilizationCodeInit = {};
	    $scope.module = ($state.is('dts/mcc/request.itemNew') || $state.is('dts/mcc/request.itemEdit')) ? 'mcc' : 'mce';

	    /* Variáveis para evento de tab no select */
	    $scope.selectControllers = {};
	    $scope.selectIds = {};
	    $scope.find = {};
	    $scope.oldValues = {};

    	// *********************************************************************************
	    // *** Methods
	    // *********************************************************************************

	    /*===============
	    ** Métodos para evento de tab no select
	    ========================================*/
	    this.initSelects = function(select, id) {
	    	$scope.selectControllers[id] = select;
	    	$scope.selectIds[id] = '#'+id;
	    	$scope.find[id] = false;
	    	$scope.oldValues[id] = '';
	    }

	    function loadSelectValue(value, id) {
	    	var promise;
	    	if(value && angular.isObject(value)) {
	    		value = value[$scope.selectIds[selectId]];
	    	}

	    	switch(id) {
			    case 'it-codigo':
			        promise = serviceItem.getObjectFromValue(value, undefined);
			        break;
			    case 'un':
			    	promise = UMZoomService.getObjectFromValue(value, undefined);
			        break;
		        case 'cod-refer':
			    	promise = referenceZoomService.getObjectFromValue(value, undefined);
			        break;
		        case 'cod-utiliz':
			    	promise = serviceUtilizationCode.getObjectFromValue(value, requestItemEditControl.utilizationCodeInit);
			        break;
		        case 'ct-codigo':
			    	promise = serviceIntegrationAcct.getObjectFromValue(value, requestItemEditControl.integrationAccountInit);
			        break;
		        case 'sc-codigo':
			    	promise = serviceCostCenter.getObjectFromValue(value, requestItemEditControl.costCenterInit);
			        break;
			}

			if(promise) {
				if(promise.then) {
					promise.then(function(data) {
						if(data) $scope.selectControllers[id].select(data);
					});
				} else {
					$scope.selectControllers[id].select(promise);
				}
			} else {
				$scope.selectControllers[id].select($scope.selectControllers[id].selected);
			}
	    }

	    function selectDefaultValue() {
			if(data && data.hasOwnProperty(id)) {
				$scope.selectControllers[id].select(data);
			}  else {
				$scope.selectControllers[id].select($scope.selectControllers[id].selected);
			}
	    }

	    this.refreshLists = function(search, id) {
			if($scope.find[id] && $scope.oldValues[id] !== search) {
		    	switch(id) {
				    case 'it-codigo':
				        serviceItem.getItems(search);
				        break;
				    case 'un':
				    	UMZoomService.getUMs(search);
			    	case 'cod-refer':
			    		referenceZoomService.getReferences(search);
				        break;
			        case 'cod-utiliz':
			    		serviceUtilizationCode.getUtilizations(search, requestItemEditControl.utilizationCodeInit);
				        break;
			        case 'ct-codigo':
			    		serviceIntegrationAcct.getIntegrationAccounts(search, requestItemEditControl.integrationAccountInit);
				        break;
			        case 'sc-codigo':
			    		serviceCostCenter.getCostCenters(search, requestItemEditControl.costCenterInit);
				        break;
				}
			}
	    }

	    $timeout(function() {
			$('#it-codigo').find('input.ui-select-search').keydown(function(e) {
				if(e.keyCode == 9) selectKeyDown('it-codigo');
			});
			$('#it-codigo').find('input.ui-select-search').focusin(function() {
				selectFocusin('it-codigo');
			});

			$('#un').find('input.ui-select-search').keydown(function(e) {
				if(e.keyCode == 9) selectKeyDown('un');
			});
			$('#un').find('input.ui-select-search').focusin(function() {
				selectFocusin('un');
			});

			$('#cod-refer').find('input.ui-select-search').keydown(function(e) {
				if(e.keyCode == 9) selectKeyDown('cod-refer');
			});
			$('#cod-refer').find('input.ui-select-search').focusin(function() {
				selectFocusin('cod-refer');
			});

			$('#cod-utiliz').find('input.ui-select-search').keydown(function(e) {
				if(e.keyCode == 9) selectKeyDown('cod-utiliz');
			});
			$('#cod-utiliz').find('input.ui-select-search').focusin(function() {
				selectFocusin('cod-utiliz');
			});

			$('#ct-codigo').find('input.ui-select-search').keydown(function(e) {
				if(e.keyCode == 9) selectKeyDown('ct-codigo');
			});
			$('#ct-codigo').find('input.ui-select-search').focusin(function() {
				selectFocusin('ct-codigo');
			});

			$('#sc-codigo').find('input.ui-select-search').keydown(function(e) {
				if(e.keyCode == 9) selectKeyDown('sc-codigo');
			});
			$('#sc-codigo').find('input.ui-select-search').focusin(function() {
				selectFocusin('sc-codigo');
			});
	    }, 550);

	    function selectKeyDown(id) {
			$scope.find[id] = false;
			if($scope.oldValues[id] !== $scope.selectControllers[id].search) {
				loadSelectValue($scope.selectControllers[id].search, id);
			} else {
				$scope.selectControllers[id].select($scope.selectControllers[id].selected);
			}
	    }

	    function selectFocusin(id) {
			if($scope.selectControllers[id].selected !== undefined) {
		    	switch(id) {
			        case 'ct-codigo':
			        	$scope.selectControllers[id].search = $scope.selectControllers[id].selected['cod_cta_ctbl'];
			    		$scope.oldValues[id] = $scope.selectControllers[id].selected['cod_cta_ctbl'];
				        break;
			        case 'sc-codigo':
			        	$scope.selectControllers[id].search = $scope.selectControllers[id].selected['cod_ccusto'];
			    		$scope.oldValues[id] = $scope.selectControllers[id].selected['cod_ccusto'];
				        break;
			        default:
			        	$scope.selectControllers[id].search = $scope.selectControllers[id].selected[id];
			        	$scope.oldValues[id] = $scope.selectControllers[id].selected[id];
			        	break;
				}
			} else {
				$scope.selectControllers[id].search = '';
			}

			if(!$scope.find[id]) {
				$scope.selectControllers[id].items = [];
			}
			$scope.find[id] = true;
	    }
	    /*==========================
	    ** Fim métodos para evento de tab no select
	    ============*/

	    /* Carrega os dados do item a ser editado
		* requestNumber: Número da requisição a qual o item pertence
		* sequence: Sequênca do item
		* item: Código do item
		*/
	    this.loadUpdate = function(requestNumber, sequence, item) {
	    	this.model = {}; // zera o model

	        // chama o servico para retornar o registro
	    	requestFactory.getRequestItemForEdit({pNrRequisicao: requestNumber, pSequencia: sequence, pItCodigo: item},function(result) {
	    		if(result['ttRequest']) {
	    			requestItemEditControl.afterLoadRequestItem(result);
	    		}
	        });
	    }

	    // Retorna os valores default de um item da requisição
	    // requestNumber: Número da requisição a qual o item pertence
	    this.loadNew = function(requestNumber) {
	    	requestFactory.getDefaultsItem({pNrRequisicao: requestNumber},function(result) {
	    		if(result['ttRequest']) {
	    			requestItemEditControl.afterLoadRequestItem(result);
	            }
	        });
	    }

	    // Método executado após carregar as informações do item, seja na inclusão ou edição do mesmo
	    this.afterLoadRequestItem = function(result) {
			requestItemEditControl.model.ttRequest = result['ttRequest'][0]; // Dados da requisição
			requestItemEditControl.model.ttRequestItemDefault = result['ttRequestItemDefault'][0]; // Dados do item
			requestItemEditControl.model.ttGenericBusinessUnit = result['ttGenericBusinessUnit']; // Unidades de negócio
		    requestItemEditControl.model.showBusinessUnit = result.lExibeUnidNegoc; // Se as unidades de negócio são visíveis
    		requestItemEditControl.model.enableBusinessUnit = result.lHabilitaUnidNegoc; // Se as unidades de negócio são editáveis
			requestItemEditControl.model.hidePrice = result.lOcultaPreco; // Se o preço unitário deve ser ocultado
    		requestItemEditControl.model.ttBusinessUnit = result['ttBusinessUnit']; // Unidades de negócio selecionáveis (combo box)

    		// Objeto inicial passado por parâmetro para o zoom de contas
			requestItemEditControl.integrationAccountInit = {params: {'cod_empres_ems_2': result['ttIntegrationAccountCCenterVO2'][0]['company'],
														  			'dat_trans': result['ttIntegrationAccountCCenterVO2'][0]['dateMovto']},
					                                         filters: {'cod_modul_dtsul': result['ttIntegrationAccountCCenterVO2'][0]['module'],
					                                                   'cod_plano_cta_ctbl': result['ttIntegrationAccountCCenterVO2'][0]['accountPlan']}};

           	// Objeto inicial passado por parâmetro para o zoom de centro de custo
       		requestItemEditControl.costCenterInit = {filters: {'cod_plano_ccusto': result['ttIntegrationAccountCCenterVO2'][0]['centerCostPlan']},
													params:  {'cod_empres_ems_2': result['ttIntegrationAccountCCenterVO2'][0]['company'],
													           'dat_trans': result['ttIntegrationAccountCCenterVO2'][0]['dateMovto']}};

           	requestItemEditControl.setDescriptions(); // Seta as decrições dos campos de zoom

			// Habilitar e desabilitar campos
            requestItemEditControl.enableFields = [];
            for(i=0; i < result["ttEnableFields"].length; i++){
            	requestItemEditControl.enableFields[result["ttEnableFields"][i].campo] = result["ttEnableFields"][i].habilitado;
            }
            fieldFocus(); // Focus no primeiro campo
            requestItemEditControl.calculateTotalPercentageBusinessUnit(undefined);
	    }

	    // Função executada quando o usuário retirar o foco do campo (leave)
	    // Responsável por enviar as informações atuais do formulário e retornar valores atualizados
	    // field: nome do campo em que foi executado o leave
	    this.fieldLeave = function(field, newValue) {
	    	if($state.is('dts/'+$scope.module+'/request.itemEdit')) {
	    		pAction = "UPDATE";
	    	} else {
	    		pAction = "CREATE";
    		}

    		if(field !== 'num-ord-inv') {
	    		$scope.selectControllers[field].select(newValue);
	    		if($scope.selectControllers[field].selected) {
	    			$scope.oldValues[field] = $scope.selectControllers[field].selected[field];
	    		}
    		}

    		if(field == 'num-ord-inv' && newValue) {
    			if(newValue && newValue instanceof Object) {
					this.model.ttRequestItemDefault[field] = parseInt(newValue['num-ord-magnus'], 10);
    			} else if(newValue) {
					this.model.ttRequestItemDefault[field] = parseInt(newValue, 10);
    			} else {
    				this.model.ttRequestItemDefault[field] = 0;
    			}
	    	} else if(field == 'cod-utiliz') {
	    		if (newValue['_'] != undefined)
					newValue['des-utiliz'] = newValue['_']['des-utiliz'];
				this.model.ttRequestItemDefault['utilizationCode'] = newValue ? newValue[field] : "";
	    	} else if(field == 'ct-codigo') {
	    		this.model.ttRequestItemDefault[field] = newValue ? newValue['cod_cta_ctbl'] : "";
	    	} else if(field == 'sc-codigo') {
	    		this.model.ttRequestItemDefault[field] = newValue ? newValue['cod_ccusto'] : "";
    		} else {
				this.model.ttRequestItemDefault[field] = newValue ? newValue[field] : "";
    		}

	    	requestFactory.onLeaveItemRequisicao({pAction: pAction, pField: field}, {'ttRequestItemOriginal': this.model.ttRequestItemDefault, 'ttGenericBusinessUnitOriginal': this.model.ttGenericBusinessUnit}, function(result) {
	    		if (result['ttRequestItemDefault']) {
					requestItemEditControl.model.ttRequestItemDefault = result['ttRequestItemDefault'][0];
					requestItemEditControl.model.ttGenericBusinessUnit = result['ttGenericBusinessUnit']; // Unidades de negócio

	    			// Habilitar e desabilitar campos
					requestItemEditControl.enableFields = [];
		            for(i=0; i < result["ttEnableFields"].length; i++) {
		            	requestItemEditControl.enableFields[result["ttEnableFields"][i].campo] = result["ttEnableFields"][i].habilitado;
		            }
		            requestItemEditControl.setDescriptions();
	            }
	        });

	    }

	    // Adiciona uma nova unidade de negócio ao item (com informações default)
	    this.addBusinessUnit = function() {
	    	this.model.ttGenericBusinessUnit.push({'cod_unid_negoc': "", 'des-unid-negoc': "", 'perc-unid-neg': 0});
	    }

	    // Remove uma unidade de negócio
	    // unit: Unidade de negócio a ser removida
	    this.removeBusinessUnit = function(unit) {
	    	var index = this.model.ttGenericBusinessUnit.indexOf(unit);
			if (index != -1) {
				this.model.ttGenericBusinessUnit.splice(index, 1);
				this.calculateTotalPercentageBusinessUnit(undefined);
			}
	    }

	    // Salva a criação ou edição de um item da requisição
	    this.save = function() {
	    	this.setModelFields();
	        // verificar se o formulario tem dados invalidos
	        if (this.isInvalidForm()) { return; }

	        // se for a tela de edição, faz o update
	        if ($state.is('dts/'+$scope.module+'/request.itemEdit')) {
				requestFactory.createUpdateRequestItem({pAction: "UPDATE", pLastItem: true}, {'ttRequestItemOriginal': [this.model.ttRequestItemDefault], 'ttGenericBusinessUnit': this.model.ttGenericBusinessUnit}, function(result) {
	            	if(!result['$hasError']){
    					requestItemEditControl.onSaveUpdate(true);
	            	}
	            });
	        } else { // senão faz o create
        		this.saveItem(true);
	        }
	    }

	    // Funação executada quando o usuário clicar no botão "Salvar e novo"
	    // Responsável por zerar os campos e carregar os valores default do novo item
	    this.saveNew = function(){
	    	this.setModelFields();
	    	if (this.isInvalidForm()) { return; }

	    	this.savedAndContinued = true;
	    	this.redirect = true;
	    	this.saveItem(false);
	    }

	    // Faz uma requisição ao servidor passando o item a ser criado
	    this.saveItem = function(isLastItem){
	    	if(requestItemEditControl.model.ttRequest && requestItemEditControl.model.ttRequest.situacao == 3){
		    	modalRequestQuestion.open({}).then(function(result) {
					var changeRequestStatus = false;
					if(result && result.changeRequestStatus){
						changeRequestStatus = true;
					}

					requestFactory.createUpdateRequestItem_v2( {pAction: "CREATE", pLastItem: isLastItem, pChangeRequestStatus: changeRequestStatus}, 
															{'ttRequestItemOriginal': [requestItemEditControl.model.ttRequestItemDefault], 
															 'ttGenericBusinessUnit': requestItemEditControl.model.ttGenericBusinessUnit}, function(result) {
						if(!result['$hasError'])
							requestItemEditControl.onSaveUpdate($state.is('dts/'+$scope.module+'/request.itemEdit'));
		            });		    		
				});
		    }else{
		    	requestFactory.createUpdateRequestItem( {pAction: "CREATE", pLastItem: isLastItem}, 
														{'ttRequestItemOriginal': [requestItemEditControl.model.ttRequestItemDefault], 
														 'ttGenericBusinessUnit': requestItemEditControl.model.ttGenericBusinessUnit}, function(result) {
					if(!result['$hasError'])
						requestItemEditControl.onSaveUpdate($state.is('dts/'+$scope.module+'/request.itemEdit'));
	            });
		    }
	    }

    	// Seta as descrições do campos em tela de acordo com os recebidos do servidor
	    this.setDescriptions = function(){
	    	this.referenceZoomField = {};
	    	this.UMZoomField = {};
	    	this.itemZoomField = {};
	    	this.utilizationZoomField = {};

			requestItemEditControl.utilizationCodeInit = {
				property: ['cod-nat-despesa'],
				value: [this.model.ttRequestItemDefault['cod-nat-despesa']]
			};

	    	this.referenceZoomField['cod-refer'] = this.model.ttRequestItemDefault['cod-refer'] || "";
	    	this.referenceZoomField['descricao'] = this.model.ttRequestItemDefault['desc-refer'] || "";
	    	this.UMZoomField['un'] = this.model.ttRequestItemDefault['un'] || "";
	    	this.UMZoomField['descricao'] = this.model.ttRequestItemDefault['desc-un'] || "";
	    	this.itemZoomField['it-codigo'] = this.model.ttRequestItemDefault['it-codigo'] || "";
	    	this.itemZoomField['desc-item'] = this.model.ttRequestItemDefault['desc-item'] || "";
	    	this.utilizationZoomField['cod-utiliz'] = this.model.ttRequestItemDefault['utilizationCode'] || "";
	    	this.utilizationZoomField['des-utiliz'] = this.model.ttRequestItemDefault['utilizationCodeDesc'] || "";

    		// Descrição da conta
    		if(requestItemEditControl.model.ttRequestItemDefault['ct-codigo']) {
				var promiseAccount = this.serviceIntegrAcct.getObjectFromValue(requestItemEditControl.model.ttRequestItemDefault['ct-codigo'],
															  	 	 		   requestItemEditControl.integrationAccountInit);
				if (promiseAccount) {
					if (promiseAccount.then) {
						promiseAccount.then(function (data) {
							requestItemEditControl.integrationAccountZoomField = data;
						});
					} else {
						requestItemEditControl.integrationAccountZoomField = {};
					}
				}
			} else {
				requestItemEditControl.integrationAccountZoomField = {};
			}

			if(requestItemEditControl.model.ttRequestItemDefault['sc-codigo']) {
				var promiseCostCenter = this.serviceCostCenter.getObjectFromValue(requestItemEditControl.model.ttRequestItemDefault['sc-codigo'],
															  	 	 		      requestItemEditControl.costCenterInit);
				if (promiseCostCenter) {
					if (promiseCostCenter.then) {
						promiseCostCenter.then(function (data) {
							requestItemEditControl.costCenterZoomField = data;
						});
					} else {
						requestItemEditControl.costCenterZoomField = {};
					}
				}
			} else {
				requestItemEditControl.costCenterZoomField = {};
			}
	    }

	    // Seta os campos da model com os dados informados em tela
	    this.setModelFields = function() {
	    	if(this.model.ttRequestItemDefault) {
	    		if(this.model.ttRequestItemDefault['hra-entrega'].length <= 4) {
	    			this.model.ttRequestItemDefault['hra-entrega'] = "0"+this.model.ttRequestItemDefault['hra-entrega'];
	    		}
		    	this.model.ttRequestItemDefault['cod-refer'] = this.referenceZoomField ? this.referenceZoomField['cod-refer'] : "";
		    	this.model.ttRequestItemDefault['un'] = this.UMZoomField ? this.UMZoomField['un'] : "";
		    	this.model.ttRequestItemDefault['ct-codigo'] = this.integrationAccountZoomField
		    	 											   ? this.integrationAccountZoomField['cod_cta_ctbl']
		    	 											   : "";
		    	this.model.ttRequestItemDefault['sc-codigo'] = this.costCenterZoomField
		    												   ? this.costCenterZoomField['cod_ccusto']
		    												   : "";
		    	this.model.ttRequestItemDefault['it-codigo'] = this.itemZoomField ? this.itemZoomField['it-codigo'] : "";
		    	this.model.ttRequestItemDefault['utilizationCode']  = this.utilizationZoomField ? this.utilizationZoomField['cod-utiliz'] : "";
	    	}
	    }

	    // metodo para notificar o usuario da gravaçao do registro com sucesso
	    // isUpdate: Identifica se é uma edição
	    this.onSaveUpdate = function(isUpdate) {

			if(requestItemEditControl.savedAndContinued) {
				requestItemEditControl.model = {};
				requestItemEditControl.loadNew(this.requestNumber);
				requestItemEditControl.savedAndContinued = false;
			} else {
	        	requestItemEditControl.redirectToDetail(); // redireciona a tela para a tela de detalhar
			}

	        // notifica o usuario que conseguiu salvar o registro
	        $rootScope.$broadcast(TOTVSEvent.showNotification, {
	            type: 'success',
	            title: $rootScope.i18n('l-request-item', [], 'dts/mcc'),
	            detail: $rootScope.i18n('l-request-item', [], 'dts/mcc') + ': ' + requestItemEditControl.requestNumber + ', ' +
	            (isUpdate ? $rootScope.i18n('l-success-updated', [], 'dts/mcc') : $rootScope.i18n('l-success-created', [], 'dts/mcc')) + '!'
	        });
	    }

	    // metodo para a ação de cancelar
	    this.cancel = function() {
	        // solicita que o usuario confirme o cancelamento da edição/inclusão
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-cancel-operation', [], 'dts/mcc'),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {
                		if(requestItemEditControl.redirect) { // Cancelou após ter salvo ao menos um item anteriormente
					    	requestFactory.updateApprovalInfo({}, requestItemEditControl.model.ttRequestItemDefault, function(result) {
				    			if(!result['$hasError']) {
		    						redirectCancel();
								}
					        });
                		} else {
                			redirectCancel();
            			}
	                }
	            }
	        });
	    };

	    function redirectCancel() {
	    	$location.$$search = {};
	    	if(appViewService && appViewService.previousView && appViewService.previousView.name) {
				switch(appViewService.previousView.name) {
				    case "dts/"+$scope.module+"/request.detail":
				    	$location.path('dts/'+$scope.module+'/request/detail/' + requestItemEditControl.model['ttRequestItemDefault']['nr-requisicao']);
				        break;
				    case "dts/"+$scope.module+"/request.start":
				        $location.path("dts/"+$scope.module+"/request");
				        break;
			        case "dts/"+$scope.module+"/dts/mcc/request.edit":
				        $location.path("dts/"+$scope.module+"/request/edit/"+requestItemEditControl.model['ttRequestItemDefault']['nr-requisicao']);
				        break;
			        case "dts/"+$scope.module+"/request.itemDetail":
		        		$location.path('dts/'+$scope.module+'/request/item/detail').search({
		        			"req": requestItemEditControl.model['ttRequestItemDefault']['nr-requisicao'],
		        			"seq": requestItemEditControl.model['ttRequestItemDefault']['sequencia'],
		        			"item": requestItemEditControl.model['ttRequestItemDefault']['it-codigo']
		        		});
			        	break;
				    default:
				    	$state.go('dts/'+$scope.module+'/request.start');
				    	break;
				}
			} else {
				$window.history.back();
			}
	    }

	    // metodo para verificar se o formulario é válido
	    this.isInvalidForm = function() {

	        var messages = [];

	        // verifica se a quantidade foi preenchida
	        if (!this.model['ttRequestItemDefault']['qt-a-atender'] || this.model['ttRequestItemDefault']['qt-a-atender'].length === 0) {
	            messages.push('l-quantity');
	        }

	        // verifica se a data de entrega foi preenchida
	        if (!this.model['ttRequestItemDefault']['dt-entrega'] || this.model['ttRequestItemDefault']['dt-entrega'].length === 0) {
	            messages.push('l-delivery-date');
	        }

        	var isInvalidForm = false;
	        if (messages.length > 0)
	        	isInvalidForm = true;

	        // se for invalido, monta e mostra a mensagem
	        if (isInvalidForm) {
	            var warning = $rootScope.i18n('l-field', [], 'dts/mcc');
	            if (messages.length > 1) {
	                warning = $rootScope.i18n('l-fields', [], 'dts/mcc');
	            }
	            angular.forEach(messages, function(item) {
	                warning = warning + ' ' + $rootScope.i18n(item) + ',';
	            });
	            if (messages.length > 1) {
	                warning = warning + ' ' + $rootScope.i18n('l-requireds', [], 'dts/mcc');
	            } else {
	                warning = warning + ' ' + $rootScope.i18n('l-required', [], 'dts/mcc');
	            }
	            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'error',
	                title: $rootScope.i18n('l-attention', [], 'dts/mcc'),
	                detail: warning
	            });
	        }

	        return isInvalidForm;
	    }

	    // redireciona para a tela de detalhar
	    this.redirectToDetail = function() {
	    	$location.path('dts/'+$scope.module+'/request/detail/' + this.model['ttRequestItemDefault']['nr-requisicao']);
	    }

	    // Calcula o total (porcentagem) das unidades de negócio do item
	    // businessUnit: Unidade de negócio que está sendo preenchida pelo usuário
	    this.calculateTotalPercentageBusinessUnit = function(businessUnit){

	    	if(businessUnit && businessUnit['perc-unid-neg'] > 100) {
    			businessUnit['perc-unid-neg'] = 100;
	    	} else if(businessUnit && businessUnit['perc-unid-neg'] < 0) {
    			businessUnit['perc-unid-neg'] = 0;
	    	}

	    	this.totalPercentageBusinessUnit = 0;
	    	if(this.model['ttGenericBusinessUnit']){
				angular.forEach(this.model['ttGenericBusinessUnit'], function(businessUnit) {
			  		requestItemEditControl.totalPercentageBusinessUnit += businessUnit['perc-unid-neg'];
			  	});
	    	}

	    	if(this.totalPercentageBusinessUnit > 100){
	            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'error',
	                title: $rootScope.i18n('l-attention', [], 'dts/mcc'),
	                detail: $rootScope.i18n('l-total-percentage-is-more-than-100', [], 'dts/mcc')
	            });
	    	}
	    }

	    function fieldFocus() {
        	$timeout(function() {
	        	if(!$('#it-codigo').find('input:last').prop('disabled')) {
	        		totvsUtilsService.focusOn('it-codigo');
	        	} else if(!$('#cod-refer').find('input:last').prop('disabled')) {
					totvsUtilsService.focusOn('cod-refer');
	        	} else if(!$('#requestQuantity').find('input:last').prop('disabled')) {
					totvsUtilsService.focusOn('requestQuantity');
	        	} else if(!$('#un').find('input:last').prop('disabled')) {
					totvsUtilsService.focusOn('un');
	        	} else if(!$('#requestDeliveryDate').find('input:last').prop('disabled')) {
					totvsUtilsService.focusOn('requestDeliveryDate');
	        	}
        	}, 100);
	    }

	    // *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	    this.init = function() {
	        createTab = appViewService.startView($rootScope.i18n('l-requests', [], 'dts/mcc'), 'mcc.request.ItemEditCtrl', requestItemEditControl);
	        requestItemEditControl.isUpdate = $state.is('dts/'+$scope.module+'/request.itemEdit');

        	var isAppViewServiceDefined = appViewService && appViewService.previousView && appViewService.previousView.name ? true : false;

        	requestItemEditControl.showDetail = isAppViewServiceDefined && appViewService.previousView.name == "dts/"+$scope.module+"/request.detail" ? true : false;
	        requestItemEditControl.showItemDetail = isAppViewServiceDefined && appViewService.previousView.name == "dts/"+$scope.module+"/request.itemDetail" ? true : false;

	        // Se for uma inserção
	        if(	isAppViewServiceDefined === true && createTab === false &&
	        	(appViewService.previousView.name.toLowerCase().indexOf("dts/"+$scope.module+"/request") == -1 ||
	        	appViewService.previousView.name.toLowerCase().indexOf("dts/"+$scope.module+"/request.search") > -1)) {
	        	return;
	        }

	        this.model = {};
	        if($stateParams) {
	        	this.model = {};
	        	// Se o item não estive definido é item com código branco || Remove caracteres especiais codificados
        		$stateParams.item = !$stateParams.item ? "" : decodeURIComponent(decodeURIComponent(decodeURIComponent($stateParams.item)));

		        if ($stateParams.req && $stateParams.seq && this.isUpdate) {
		            this.loadUpdate($stateParams.req, $stateParams.seq, $stateParams.item);
		            this.requestNumber = $stateParams.req;
		        } else if($stateParams.req && !this.isUpdate) {
		            this.loadNew($stateParams.req);
		            this.requestNumber = $stateParams.req;
		        }
	        }
	    }

	    // se o contexto da aplicação já carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { this.init(); }

	    // *********************************************************************************
	    // *** Events Listners
	    // *********************************************************************************

	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        requestItemEditControl.init();
	    });
    }

    /*##############
    ##  CONTROLLER COPIAR ITENS
    #############################*/

	requestItemCopyController.$inject = ['$rootScope', '$scope', '$stateParams', '$window', '$location', '$state', 'totvs.app-main-view.Service', 'mcc.ccapi354.Factory', 'mcc.tab-unidade.zoom', '$timeout', 'totvs.utils.Service', 'TOTVSEvent'];
    function requestItemCopyController($rootScope, $scope, $stateParams, $window, $location, $state, appViewService, requestFactory, serviceUM, $timeout, totvsUtilsService, TOTVSEvent){
    	var requestItemCopyControl = this;
    	// *********************************************************************************
	    // *** Atributos
	    // *********************************************************************************
	    this.listOfItems = [];
	    this.itemsToCopy = [];
	    this.destiny = undefined;
	    this.sourceRequest = undefined;
	    this.sourceRequestOld = undefined;
	    this.tpRequis = undefined;
	    this.serviceUM = serviceUM;
	    $scope.module = $state.is('dts/mcc/request.itemCopy') ? 'mcc' : 'mce';
	    this.showDetail = false;
	    this.savedAndContinue = false;
	    this.loaded = false;
	    this.isAppViewServiceDefined = false;

		// *********************************************************************************
	    // *** Functions
	    // *********************************************************************************
	    // Carrega os itens da requisição origem (informada pelo usuário)
	    this.load = function(requisicao) {
	    	if(!requisicao) return;

	    	if(requisicao != requestItemCopyControl.sourceRequestOld) {
	    		requestItemCopyControl.sourceRequestOld = requisicao;
				requestFactory.getSummaryRequestItem({pNrRequisicaoOrig: requisicao, pNrRequisicaoDest: requestItemCopyControl.destiny}, function(result) {
		            if (result['ttSummaryRequestItemCopy']) {
            			$.each(result['ttSummaryRequestItemCopy'], function(index, value) {
            				result['ttSummaryRequestItemCopy'][index]['it-codigo-link'] = encodeURIComponent(encodeURIComponent(result['ttSummaryRequestItemCopy'][index]['it-codigo']));
            			});

		            	requestItemCopyControl.loaded = true;
		                requestItemCopyControl.listOfItems = result['ttSummaryRequestItemCopy'];
		                requestItemCopyControl.tpRequis = result.pTipRequis;

		                if(requestItemCopyControl.listOfItems[0]['hra-entrega'].indexOf(":") < 0){
		                	if(requestItemCopyControl.listOfItems[0]['hra-entrega'].length == 5){
		                		hora = requestItemCopyControl.listOfItems[0]['hra-entrega'].substr(1,2);
		                		minuto = requestItemCopyControl.listOfItems[0]['hra-entrega'].substr(3,2);
		                	}else{
		                		hora = requestItemCopyControl.listOfItems[0]['hra-entrega'].substr(0,2);
		                		minuto = requestItemCopyControl.listOfItems[0]['hra-entrega'].substr(2,2);
		                	}
		                	requestItemCopyControl.listOfItems[0]['hra-entrega'] = hora+":"+minuto;
		                }
		            } else {
		            	requestItemCopyControl.loaded = false;
		            }
		            if(result.$hasError) requestItemCopyControl.loaded = false;
		        });
	        }
	    };

	    // Ao pressionar enter deve realizar a busca dos itens da requisição
	    this.keyPress = function(keyEvent) {
			if (keyEvent.which === 13) { // Enter
				this.load(this.sourceRequest);
			}
	    };

	    // Método executado ao clicar em aplicar no componente totvs-editable da unidades de medida
	    // Realiza a alteração da unidade de medida do item
	    // value: unidade de medida escolhida pelo usuário
	    this.applyUN = function(value, item) {
	    	if(value && item){
	    		item['un-desc'] = value.descricao;
				item.un = value.un;
	    	}
	    }

	    // Salvar e continuar
	    this.saveNew = function() {
	        requestItemCopyControl.savedAndContinue = true;
	        requestItemCopyControl.save();
	    }

	    // Copia os itens da requisição origem para a destino
	    this.save = function(){
	    	this.itemsToCopy = [];
		   	angular.forEach(this.listOfItems, function(item) {
   				if(item.$selected){
   					var itemToCopy = {};
   					angular.copy(item, itemToCopy);

					if(itemToCopy['hra-entrega'].length <= 4) {
						itemToCopy['hra-entrega'] = "0"+itemToCopy['hra-entrega'];
					}
					requestItemCopyControl.itemsToCopy.push(itemToCopy);
   				}
            });

            if(this.itemsToCopy.length <= 0){
	 			$rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'error',
	                title: $rootScope.i18n('l-attention', [], 'dts/mcc'),
	                detail: $rootScope.i18n('l-select-at-least-one-item', [], 'dts/mcc')
	            });
            	return;
            }

            requestFactory.copyItemRequest({pNrRequisicao: requestItemCopyControl.destiny}, requestItemCopyControl.itemsToCopy, function(result) {
    			if(!result['$hasError']){
    				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		                type: 'success',
		                title: $rootScope.i18n('l-request-items', [], 'dts/mcc'),
		                detail: $rootScope.i18n('l-request-items', [], 'dts/mcc') + ' ' + requestItemCopyControl.destiny + ' ' + $rootScope.i18n('l-success-copied-s', [], 'dts/mcc') + '!'
	            	});

    				if(requestItemCopyControl.savedAndContinue) {
				        requestItemCopyControl.listOfItems = [];
				        requestItemCopyControl.sourceRequest = undefined;
				        requestItemCopyControl.sourceRequestOld = undefined;
				        requestItemCopyControl.savedAndContinue = false;
				        requestItemCopyControl.loaded = false;
				        totvsUtilsService.focusOn('sourceRequest');
    				} else {
    					if(requestItemCopyControl.isAppViewServiceDefined) {
	    					if(requestItemCopyControl.previousView.name == 'dts/'+$scope.module+'/request.start') {
								$rootScope.isCopyItemRequest = true; //Verificar se foi realizada cópia para recarregar a tela
					    		$state.go('dts/'+$scope.module+'/request.start');
					    	} else if(requestItemCopyControl.previousView.name == 'dts/'+$scope.module+'/request.detail') {
				    			$location.path('dts/'+$scope.module+'/request/detail/'+requestItemCopyControl.destiny);
					    	} else {
								$rootScope.isCopyItemRequest = true;
					    		$state.go('dts/'+$scope.module+'/request.start');
					    	}
				    	} else {
				    		$window.history.back();
				    	}
    				}
    			}
	        });
	    };

	    // Cancelar operação de cópia (volta para a tela anterior)
	    this.cancel = function(){
	        // solicita que o usuario confirme o cancelamento da edição/inclusão
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-cancel-operation', [], 'dts/mcc'),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {
	                	if(requestItemCopyControl.isAppViewServiceDefined) {
					    	if(requestItemCopyControl.previousView.name == 'dts/'+$scope.module+'/request.start') {
					    		$state.go('dts/'+$scope.module+'/request.start');
					    	} else if(requestItemCopyControl.previousView.name == 'dts/'+$scope.module+'/request.detail') {
				    			$location.path('dts/'+$scope.module+'/request/detail/'+requestItemCopyControl.destiny);
					    	} else {
					    		$state.go('dts/'+$scope.module+'/request.start');
					    	}
				    	} else {
				    		$window.history.back();
				    	}
	                }
	            }
	        });
	    }

	    // *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	    this.init = function() {
	        createTab = appViewService.startView($rootScope.i18n('l-requests', [], 'dts/mcc'), 'mcc.request.CopyItemCtrl', requestItemCopyControl);
        	requestItemCopyControl.isAppViewServiceDefined = appViewService && appViewService.previousView && appViewService.previousView.name ? true : false;

        	requestItemCopyControl.previousView = requestItemCopyControl.isAppViewServiceDefined ? appViewService.previousView : undefined;

        	if(requestItemCopyControl.isAppViewServiceDefined && appViewService.previousView.name.toLowerCase().indexOf("dts/"+$scope.module+"/request") > -1) {
        		requestItemCopyControl.showDetail = (appViewService.previousView.controller == "mcc.request.DetailCtrl") ? true : false;
	        }
	        this.loaded = false;

	        if(	createTab == false && requestItemCopyControl.isAppViewServiceDefined &&
    	 	 	requestItemCopyControl.destiny == $stateParams.req &&
	        	(appViewService.previousView.name.toLowerCase().indexOf("dts/"+$scope.module+"/request") == -1 ||
				appViewService.previousView.name.toLowerCase().indexOf("search") > -1 						   ||
	        	appViewService.previousView.name.toLowerCase() == 'dts/'+$scope.module+'/request.itemDetail'.toLowerCase())) {
	        	return;
	        }

	        this.listOfItems = [];
	        this.sourceRequest = undefined;
	        this.sourceRequestOld = undefined;

	        if($stateParams && $stateParams.req){
	        	requestItemCopyControl.destiny = $stateParams.req;
	        }
	    }

	    // se o contexto da aplicação já carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { requestItemCopyControl.init(); }

	    // *********************************************************************************
	    // *** Events Listners
	    // *********************************************************************************

	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        requestItemCopyControl.init();
	    });
    }

	// ########################################################
	// ### Registers
	// ########################################################
	index.register.controller('mcc.request.ListCtrl', requestListController);
	index.register.controller('mcc.request.SearchListCtrl', requestListController);

	index.register.controller('mcc.request.DetailCtrl', requestDetailController);
	index.register.controller('mcc.request.SearchDetailCtrl', requestDetailController);
	index.register.controller('mcc.request.EditCtrl', requestEditController);

	index.register.controller('mcc.request.ItemDetailCtrl', requestItemDetailController);
	index.register.controller('mcc.request.SearchItemDetailCtrl', requestItemDetailController);
	index.register.controller('mcc.request.ItemEditCtrl', requestItemEditController);

	index.register.controller('mcc.request.CopyItemCtrl', requestItemCopyController);

	// Modal
	index.register.controller('mcc.request.ChangeSightCtrl', requestListChangeSightController);
    index.register.controller('mcc.request.AdvancedSearchCtrl', modalRequestAdvancedSearchController);
    index.register.controller('mcc.request.RequestQuestionModalCtrl', requestQuestionModalController);

	index.register.service('mcc.request.ModalChangeSight', modalChangeSight);
    index.register.service('mcc.followup.ModalFollowUp', modalFollowup);
	index.register.service('mcc.request.ModalAdvancedSearch', modalRequestAdvancedSearch);
	index.register.service('mcc.request.ModalRequestQuestion', modalRequestQuestion);
});
