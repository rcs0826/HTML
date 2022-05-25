define([ 
	'index',
	'/dts/mcc/js/api/ccapi367.js',
	'/dts/mcc/js/api/ccapi352.js',
	'/dts/mcc/html/quotation/list/quotation.advanced.search.ctrl.js',
	'/dts/mcc/html/fieldsreportconfig/fieldsreportconfig-services.js',
	'/dts/mcc/js/api/fchmatenterquotations.js',
    '/dts/mcc/js/api/fchmatfillquotations.js',
	'/dts/mcc/js/mcc-utils.js',
	'/dts/mcc/html/quotation/approvemodal/approvemodal-services.js',
	'/dts/mcc/html/quotation/approvemodal/approvemultiplequotationsmodal-services.js',
	'/dts/mcc/js/mcc-legend-service.js'
], function(index) {

	// ########################################################
	// ############# CONTROLLER LISTAGEM DA COTAÇÃO #############
	// ########################################################	
	quotationListController.$inject = ['$rootScope', '$scope', '$state', '$filter', 'totvs.app-main-view.Service', 'TOTVSEvent', 'mcc.quotation.advancedSearchModal', 'mcc.ccapi367.Factory', 'mcc.ccapi352.Factory', 'mcc.fchmatenterquotations.Factory', 'mcc.fchmatfillquotations.Factory', 'toaster', 'mcc.fieldsreportconfig.fieldsReportConfigService','$totvsprofile', '$location', 'customization.generic.Factory', 'mcc.quotation.approveModal', 'mcc.quotation.approveMultipleQuotationsModal', 'mcc.zoom.serviceLegend'];
	function quotationListController($rootScope, $scope, $state, $filter, appViewService, TOTVSEvent, advancedSearchModal, ccapi367, ccapi352, fchmatenterquotations, fchmatfillquotations, toaster, fieldsColumnConfigService, $totvsprofile, $location, customizationService, approveModal, approveMultipleQuotationsModal, serviceLegend){
		var quotationListControl = this;
		var gridAux = {};
		quotationListControl.hasPendingView = false;
		quotationListControl.loaded = false;
		quotationListControl.selectAll = false;
		quotationListControl.orderbyListDefault = [];
		quotationListControl.orderbyListUnlinked = [];
        quotationListControl.isJustForView = $state.is('dts/mcc/quotation.search');

		/*
		 * Objetivo: calcular tamanho do grid de cotações.
		*/
		quotationListControl.setAlturaGrid = function(){
			var w = window;
			var d = document;
			var e = d.documentElement;
			var g = d.getElementsByTagName('body')[0];
			
			y = w.innerHeight|| e.clientHeight|| g.clientHeight;

			//y = total do viewport
			//330 = altura dos componentes acima do grid
			//120 = altura dos botões de ação + altura das abas de últimas compras
			quotationListControl.altura = y - (330 + 120);
			if(quotationListControl.altura < 300)
				quotationListControl.altura = 300;
		}

		//evento de redimensionamento do browser
		window.onresize = function(event) {
			quotationListControl.setAlturaGrid();
		};

		/* 
		 * Objetivo: método de inicialização da tela
		 * Parâmetros: 
		 */
		quotationListControl.init = function() {
			createTab = appViewService.startView(
                $state.is('dts/mcc/quotation.search') ? $rootScope.i18n('l-view-quotation-plural') : $rootScope.i18n('l-quotations'), $state.is('dts/mcc/quotation.search') ? 'mcc.quotation.SearchListCtrl': 'mcc.quotation.ListCtrl', 
                quotationListControl
            );
			
						
			gridAux.selectedItem = quotationListControl.selectedItem;
			gridAux.selected = quotationListControl.selected;
			
			$("#menu-view").css({ 'display': "" }); //ao trocar de aba, perdia o scroll da janela
			if(appViewService && appViewService.lastAction && ((appViewService.lastAction == "changetab" || appViewService.lastAction == "changestate") && 
            appViewService.previousView.name !== "dts/mcc/quotation.edit" && 
            appViewService.previousView.name !== "dts/mcc/quotation.new" && 
            appViewService.previousView.name !== "dts/mcc/quotation.copy") &&
            appViewService.previousView.name !== "dts/mcc/requestquotation.new" &&
            $rootScope.mccQuoteParams == undefined) {
                setTimeout(function() {
                    quotationListControl.setVisibleColumns();
                }, 10);
                
                return;
			}

			if ($rootScope.mccQuoteParams != undefined) {
				quotationListControl.loaded = false;
			}

			quotationListControl.setAlturaGrid();
			if(!quotationListControl.loaded) { 
				quotationListControl.loaded = true;
				quotationListControl.loadDefaults();
			} else {              
				quotationListControl.loadData(false);	
			}
		}

        /*
		 * Objetivo: Carrega informações padrões da tela na abertura
		 * Parâmetros: 
		 * Observações:
		 */
        quotationListControl.loadDefaults = function(){ 
			quotationListControl.model = {};
			quotationListControl.isUnlinked = false;
			quotationListControl.orderbyListDefault =  [{title:$rootScope.i18n('l-orderline-number'), property:"numero-ordem", asc:false, default:true},
														{title:$rootScope.i18n('l-site'), property:"cod-estabel", asc:false},												
														{title:$rootScope.i18n('l-item-code'), property:"it-codigo", asc:false},
														{title:$rootScope.i18n('l-vendor'), property:"cod-emitente", asc:false},
														{title:$rootScope.i18n('l-quotation-date'), property:"data-cotacao", asc:false},
														{title:$rootScope.i18n('l-validity-days'), property:"dias-validade", asc:false},
														{title:$rootScope.i18n('l-deliverer-time'), property:"prazo-entreg", asc:false},
														{title:$rootScope.i18n('l-vendor-price'), property:"preco-fornec", asc:false},
														{title:$rootScope.i18n('l-request-quantity'), property:"qt-solic", asc:false}];
			
			quotationListControl.orderbyListUnlinked =  [{title:$rootScope.i18n('l-item-code'), property:"it-codigo", asc:false, default: true},
														{title:$rootScope.i18n('l-vendor'), property:"cod-emitente", asc:false},
														{title:$rootScope.i18n('l-quotation-date'), property:"data-cotacao", asc:false},
														{title:$rootScope.i18n('l-validity-days'), property:"dias-validade", asc:false},
														{title:$rootScope.i18n('l-deliverer-time'), property:"prazo-entreg", asc:false},
														{title:$rootScope.i18n('l-vendor-price'), property:"preco-fornec", asc:false}];
			quotationListControl.orderbyList = quotationListControl.orderbyListDefault;
			quotationListControl.orderBySelected = {};

			var MonthAgoDate = new Date();
			MonthAgoDate.setMonth(MonthAgoDate.getMonth()-1);
			
			quotationListControl.disclaimers = [];
		 	quotationListControl.disclaimers.push(modelToDisclaimer('withAnswer', 'l-with-answer'));	
            if ($rootScope.mccQuoteParams == undefined || 
                ($rootScope.mccQuoteParams != undefined && $rootScope.mccQuoteParams.pending && $rootScope.mccQuoteParams.pending == true)) {
                quotationListControl.disclaimers.push(modelToDisclaimer('withoutAnswer', 'l-pending'));
            }
		 	quotationListControl.disclaimers.push(modelToDisclaimer('rejected', 'l-rejected'));
		 	quotationListControl.disclaimers.push(modelToDisclaimer('withPendency', 'l-pending-approval'));
			quotationListControl.disclaimers.push(modelToDisclaimer('withoutPendency', 'l-without-pendency'));
            if ($rootScope.mccQuoteParams != undefined && $rootScope.mccQuoteParams.quotationDateIni != undefined) {
                quotationListControl.disclaimers.push(modelToDisclaimer('quotationDate', 'l-quotation-date', $rootScope.mccQuoteParams.quotationDateIni, new Date().getTime(), null, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc')));
            } else {
                quotationListControl.disclaimers.push(modelToDisclaimer('quotationDate', 'l-quotation-date', MonthAgoDate.getTime(), new Date().getTime(), null, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc')));
            }
			quotationListControl.disclaimers.push(modelToDisclaimer('notConfirmed', 'l-not-confirmed'));
            quotationListControl.disclaimers.push(modelToDisclaimer('inQuotation', 'l-in-quotation'));
            
            if ($rootScope.mccQuoteParams != undefined && $rootScope.mccQuoteParams.quoted && $rootScope.mccQuoteParams.quoted == true) {
                quotationListControl.disclaimers.push(modelToDisclaimer('quoted', 'l-quoted'));
            }
            
            if ($rootScope.mccQuoteParams != undefined && $rootScope.mccQuoteParams.confirmed && $rootScope.mccQuoteParams.confirmed == true) {
                quotationListControl.disclaimers.push(modelToDisclaimer('confirmed', 'l-confirmed-gen'));
            }
            
            if ($rootScope.mccQuoteParams != undefined && $rootScope.mccQuoteParams.received && $rootScope.mccQuoteParams.received == true) {
                quotationListControl.disclaimers.push(modelToDisclaimer('received', 'l-received'));
            }
            
            if ($rootScope.mccQuoteParams != undefined && $rootScope.mccQuoteParams.deleted && $rootScope.mccQuoteParams.deleted == true) {
                quotationListControl.disclaimers.push(modelToDisclaimer('deleted', 'l-deleted'));
            }
            
            if ($rootScope.mccQuoteParams != undefined && $rootScope.mccQuoteParams.approved && $rootScope.mccQuoteParams.approved == true) {
                quotationListControl.disclaimers.push(modelToDisclaimer('approved', 'l-approved'));
            }
            
            if ($rootScope.mccQuoteParams != undefined && $rootScope.mccQuoteParams.buyer != undefined) {
                if ($rootScope.mccQuoteParams.buyer != '') {
                    quotationListControl.disclaimers.push(modelToDisclaimer('buyer', 'l-buyer', $rootScope.mccQuoteParams.buyer, $rootScope.mccQuoteParams.buyer));
                }
            } else {
                quotationListControl.disclaimers.push(modelToDisclaimer('buyer', 'l-buyer', $rootScope.currentuser.login, $rootScope.currentuser.login));
            }
			quotationListControl.disclaimers.push(modelToDisclaimer('referencePriceType', 'l-reference-price',  $rootScope.i18n(serviceLegend.referencePriceType.NAME(1), [], 'dts/mcc'), undefined, true));
            
            if ($rootScope.mccQuoteParams != undefined) {
                if ($rootScope.mccQuoteParams.purchOrderLine) {
                    quotationListControl.disclaimers.push(modelToDisclaimer('orderline', 'l-requisition', $rootScope.mccQuoteParams.purchOrderLine, $rootScope.mccQuoteParams.purchOrderLine));  
                }
                
                if ($rootScope.mccQuoteParams.processNumber) {
                    quotationListControl.disclaimers.push(modelToDisclaimer('requestQuotation', 'l-quotation-process', $rootScope.mccQuoteParams.processNumber, $rootScope.mccQuoteParams.processNumber));  
                }
            }

            quotationListControl.getCurrencies();
		 	quotationListControl.loadSettings();                    
        };

		/*
		 * Objetivo: Busca a lista de cotações de acordo com os parâmetros estabelecidos
		 * Parâmetros: isMore: indica se é uma nova busca ou se é continuação de uma busca anterior (paginação)
		 * Observações:
		 */
		quotationListControl.loadData = function(isMore){
			var parameter = [];	
			var parameters = new Object();

			parameters.basicFilter = quotationListControl.searchInputText;
			parameters.cCodEstabelec = isMore ? quotationListControl.getListQuotationsResult.cCodEstabelec : undefined;
			parameters.rLastQuotationRowid = isMore ? quotationListControl.getListQuotationsResult.rLastQuotationRowid : undefined;
			parameters.rLastOrderlineRowid = isMore ? quotationListControl.getListQuotationsResult.rLastOrderlineRowid : undefined;
			parameters.rLastItQuotationProcessRowid = isMore ? quotationListControl.getListQuotationsResult.rLastItQuotationProcessRowid : undefined;
			parameters.rLastItemRowid = isMore ? quotationListControl.getListQuotationsResult.rLastItemRowid : undefined;


			// Transforma os disclaimers em parâmetros para a api
			angular.forEach(quotationListControl.disclaimers, function(disclaimer) {
				if(typeof disclaimer.value == "string" && disclaimer.value.indexOf("&nbsp;") > -1) { /* Ranges */
					parameter = quotationListControl.getParameterFromDisclaimer(disclaimer.property);
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
					if(disclaimer.property == "referencePriceType")
						parameters[disclaimer.property] = serviceLegend.referencePriceType.ID(disclaimer.value);
					else
						parameters[disclaimer.property] = disclaimer.value;
				}
			});

			var lUnlinked = false;
			if(quotationListControl.disclaimers.length){
				for(var i=0; i<quotationListControl.disclaimers.length; i++){
					if(quotationListControl.disclaimers[i].property == "unlinked"){
						lUnlinked = true;
						break;
					}
				}
			}
			if(quotationListControl.isUnlinked != lUnlinked){
				quotationListControl.isUnlinked = lUnlinked;
				if(lUnlinked)
					quotationListControl.orderbyList = quotationListControl.orderbyListUnlinked;
				else
					quotationListControl.orderbyList = quotationListControl.orderbyListDefault;
				
				quotationListControl.orderBySelected = quotationListControl.orderbyList[0];
			}
			parameters.sortBy = quotationListControl.orderBySelected.property;
			parameters.orderAsc = quotationListControl.orderBySelected.asc;
            parameters.currency = quotationListControl.currency;
            parameters.typeConversion = quotationListControl.dateOptionConvert;
            parameters.dateConversion = quotationListControl.dateConvert;

			quotationListControl.model.lastVendorItemPurchases = {};
			quotationListControl.model.lastItemPurchases = {};

			var procedureParameters = {};
			procedureParameters.ttListParametersQuotation = parameters;
			if(isMore)
				procedureParameters.currentTTQuotationList = quotationListControl.model.ttQuotationList;
			else
				procedureParameters.currentTTQuotationList = undefined;

			var currentSelectedItem = angular.copy(quotationListControl.selectedItem);
			var currentSelected = angular.copy(quotationListControl.selected);

			ccapi367.getListQuotations({}, procedureParameters,function(result){
				quotationListControl.getListQuotationsResult = result;
				quotationListControl.hasNext = result.lHasNext;
				quotationListControl.selectAll = false;
				if(isMore){
					quotationListControl.model.ttQuotationList = $.merge(quotationListControl.model.ttQuotationList, result['ttQuotationList']);
					setTimeout(function(){
						quotationListControl.selectedItem = currentSelectedItem;
						quotationListControl.selected = currentSelected;
						customizationService.callCustomEvent('afterLoadPendingViewMoreResults', quotationListControl);
					}, 10);
					
				}else{
					//Marca os registros que já estavam selecionados
					if(quotationListControl.selected.length > 0){
						for (let i = 0; i < quotationListControl.selected.length; i++) {
							const selElement = quotationListControl.selected[i];
							var quotationFound = false;
							for (let j = 0; j < result['ttQuotationList'].length; j++) {
								const quotation = result['ttQuotationList'][j];
								if (selElement['numero-ordem'] == quotation['numero-ordem'] &&
									selElement['cod-emitente'] == quotation['cod-emitente'] &&
									selElement['it-codigo']    == quotation['it-codigo'] &&
									selElement['seq-cotac']    == quotation['seq-cotac']){
										quotation['$selected'] = true;
										quotationListControl.selected[i] = quotation;
										quotationFound = true;
										break;
								}
							}
							//Se não encontrar a cotação elimina das selecionadas
							if(!quotationFound){
								quotationListControl.selected.splice(i, 1);
								i--;
							}
						}
						if(quotationListControl.selected.length == 1)
							quotationListControl.selectedItem = quotationListControl.selected[0];
						else
							quotationListControl.selectedItem = undefined;
					}
					quotationListControl.model.ttQuotationList = result['ttQuotationList'];
				}
					
				quotationListControl.valueSelected();
				quotationListControl.checkSelectedAll();

				if(!isMore){
					quotationListControl.hasPendingView = true;
					setTimeout(function(){
						quotationListControl.setVisibleColumns();
						quotationListControl.hasPendingView = false;
						customizationService.callCustomEvent('afterLoadPendingViewAdvancedSearch', quotationListControl);
						$scope.$apply();
					},10);
				}
				customizationService.callCustomEvent('afterLoad', quotationListControl);				
			});
		}

		/*
		 * Objetivo: Função de alteração do grid
		 * Parâmetros: e: evento de alteração
		 */
		quotationListControl.onChange = function(e){
			var kendo = e.sender;
			
			if(!kendo.dataItem(kendo.select())){
				quotationListControl.model.lastVendorItemPurchases = {};
                quotationListControl.model.lastItemPurchases = {};
				return;
			}

			// busca as informações das últimas compras do fornecedor
			params = {	purchaseRequisitionId: kendo.dataItem(kendo.select())["numero-ordem"],
						cItem: kendo.dataItem(kendo.select())['it-codigo'],
						unitOfMeasure: kendo.dataItem(kendo.select())['un'],
						vendorId: kendo.dataItem(kendo.select())['cod-emitente']};
            
			ccapi367.getLastPurchaseOfItemVendor({}, params,function(result){
				quotationListControl.model.lastVendorItemPurchases = result;
			});
            
            // busca as informações das últimas compras do item
			params = {	purchaseRequisitionId: kendo.dataItem(kendo.select())["numero-ordem"],
						site: kendo.dataItem(kendo.select())['cod-estabel'],
						cItem: kendo.dataItem(kendo.select())['it-codigo']};
			ccapi367.getLastPurchaseOfItem(params,function(result){
				quotationListControl.model.lastItemPurchases = result;
			});

			setTimeout(function(){
				quotationListControl.valueSelected();
				quotationListControl.checkSelectedAll();
			}, 10);

			customizationService.callCustomEvent('afterOnChange', quotationListControl);
		}

		/*
		 * Objetivo: Função chamada ao selecionar/deselecionar todos
		 * Parâmetros: event - Evento de click
		 * Observações: Marca ou desmarca todas as cotações
		 */
		quotationListControl.onChangeSelectAll = function(event){
			var currentQuotationList = angular.copy(quotationListControl.model.ttQuotationList);
		    var i = 0;
				
			if(quotationListControl.selectAll){
				for (i = 0; i < currentQuotationList.length; i++) {
					currentQuotationList[i]['$selected'] = true;
				}
				quotationListControl.selected = angular.copy(currentQuotationList);
				if (quotationListControl.selected.length == 1)
					quotationListControl.selectedItem = quotationListControl.selected[0];
				else 
					quotationListControl.selectedItem = undefined;

			}else{
				quotationListControl.selected = [];
				quotationListControl.selectedItem = undefined;
				for (i = 0; i < currentQuotationList.length; i++) {
					currentQuotationList[i]['$selected'] = false;
					
				}
			}
			gridAux.selected     = quotationListControl.selected;
			gridAux.selectedItem = quotationListControl.selectedItem;

			quotationListControl.model.ttQuotationList = angular.copy(currentQuotationList);

			quotationListControl.valueSelected();
		}

		/*
		 * Objetivo: Função chamada ao preencher o grid
		 * Parâmetros: data: dados que serão vinculados no grid
		 * Observações: método usado para recuperar os itens selecionados ao trocar de aba
		 */
		quotationListControl.onData = function(data){
			/* zera seleção ao trocar de estado (alterar uma cotação por exemplo) */
			if(appViewService.lastAction == "changestate" && appViewService.previousView.name != "dts/mcc/quotation.detail"){
				gridAux.selected     = quotationListControl.selected;
				gridAux.selectedItem = quotationListControl.selectedItem;
			}

			if(gridAux.selectedItem)
				quotationListControl.selectedItem = gridAux.selectedItem;
				
			if(gridAux.selected)
				quotationListControl.selected = gridAux.selected;

			var currentSelectedItem = angular.copy(quotationListControl.selectedItem);
			var currentSelected = angular.copy(quotationListControl.selected);

			setTimeout(function(){
				quotationListControl.selectedItem = angular.copy(currentSelectedItem);
				quotationListControl.selected     = angular.copy(currentSelected);
			},10);
			customizationService.callCustomEvent('afterOnData', quotationListControl);
		}

		/*
		 * Objetivo: Retorna o valor do filtro/disclaimer
		 * Parâmetros: property: nome do filtro aplicado
		 */
		quotationListControl.getParameterFromDisclaimer = function(property){
			var value = undefined;
			$.grep(quotationListControl.disclaimers, function(e){
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
		 * Objetivo: Abre a modal de configuração de colunas
		 * Parâmetros:
		 * Observações:
		 */
		quotationListControl.settings = function(){
			fieldsColumnConfigService.open(quotationListControl.columnsConfig).then(function(result){
				/**** Quebrar o json das preferências de impressão em partes de 4000 caracteres ****/
				var profileDataArray = [];
				var profileData;
				var val = "";
				pref = JSON.stringify(result);
				prefLength = pref.length;
				breakLength = 3000;
				for(var i = 0;i<(prefLength/breakLength);i++){
					val = pref.substring((i*breakLength),((i+1)*breakLength));
					profileData = {dataCode:'columnsConfig'+i, dataValue: val };
					profileDataArray.push(profileData);
				}

				$totvsprofile.remote.set('/dts/mcc/quotation', profileDataArray , function(profileResult) {
					quotationListControl.columnsConfig.fieldsReportConfig = result.fieldsReportConfig;
					quotationListControl.setVisibleColumns();
				});
			});
		}
        
		// # Purpose: Busca as informações padrões da configuração de coluna
		// # Parâmetros:
		// #
		quotationListControl.loadSettings = function(){
			quotationListControl.columnsConfig = {};
            quotationListControl.columnsConfig.columnsMode = true;
			ccapi367.getFieldsColumnsConfigDefault({}, function(result2) {
				quotationListControl.columnsConfig.fieldsReportConfig = result2;

				/* Verifica preferência do usuário */
				$totvsprofile.remote.clearCache('/dts/mcc/quotation', undefined);
				$totvsprofile.remote.get('/dts/mcc/quotation', undefined, function(result) {
					if(result.length > 0){
						var full = "";
						var fullArray = {};
						for(var i=0;i<result.length;i++){
							if(result[i].dataCode.substring(0,13) == "columnsConfig")
								full = full + result[i].dataValue;
						}
						columnsConfigProfile = JSON.parse(full);

						/* Sobrescreve as preferências do usuário em cima das configurações default */
						if(!columnsConfigProfile.fieldsReportConfig)
							return;						

						for(var i=0;i<quotationListControl.columnsConfig.fieldsReportConfig.length;i++){
							for(var j=0;j<columnsConfigProfile.fieldsReportConfig.length;j++){
								if(quotationListControl.columnsConfig.fieldsReportConfig[i].fieldName == columnsConfigProfile.fieldsReportConfig[j].fieldName)
									quotationListControl.columnsConfig.fieldsReportConfig[i].fieldShow = columnsConfigProfile.fieldsReportConfig[j].fieldShow;
							}
						}
						quotationListControl.setVisibleColumns();
					}
				});
			});
		}
        
        // # Purpose: Busca as informações de moedas
		// # Parâmetros:
		// #
		quotationListControl.getCurrencies = function() {
			fchmatfillquotations.getCurrencies({}, function(result) {
                quotationListControl.currencies = [];
                quotationListControl.currency   = 0;
                quotationListControl.dateOptionConvert = 1;
                
                for (i = 0; i < result.length; i++) {
                    quotationListControl.currencies.push({value: result[i]['mo-codigo'],
                                                          label: result[i]['mo-codigo'] + ' - ' + result[i]['descricao']});
                }
                if ($rootScope.mccQuoteParams == undefined) {
                    quotationListControl.openAdvancedSearch();
                } else {
                    $rootScope.mccQuoteParams = undefined;
                    quotationListControl.loadData(false);    
                }
			});
		}

		/*
		 * Objetivo: Apresenta as colunas no grid conforme configurações
		 * Parâmetros: 
		 * Observações:
		 */
		quotationListControl.setVisibleColumns = function(){
			var config, field = undefined;
			if(!quotationListControl.columnsConfig || !quotationListControl.columnsConfig.fieldsReportConfig)
				return;

			for(var j=0;j<quotationListControl.columnsConfig.fieldsReportConfig.length;j++){
				config = quotationListControl.columnsConfig.fieldsReportConfig[j];
				field = quotationListControl.getFieldByConfig(config.fieldName);
				
				if(field){
					for(var i=0;i<quotationListControl.myGrid.columns.length; i++){
						if(quotationListControl.myGrid.columns[i].field == '["' + field + '"]'){
							if(config.fieldShow){
								quotationListControl.myGrid.showColumn(i);
								quotationListControl.myGrid.autoFitColumn(i);
							}else{
								quotationListControl.myGrid.hideColumn(i);
							}
							break;
						}
					}
				}
			}
		}

		/*
		 * Objetivo: Busca o campo no grid correspondente ao item de configuração do usuário
		 * Parâmetros: 
		 * 			   fieldName - identificação do campo nas configurações do usuário
		 * Observações:
		 */
		quotationListControl.getFieldByConfig = function(fieldName){
			var object = {
				"cotacao-item_seq-cotac"              : "seq-cotac"              ,        
				"cotacao-item_numero-ordem"           : "numero-ordem"           ,        
				"ordem-compra_nr-processo"            : "nr-processo"            ,        
				"item-solicit-cotac_cdd-solicit"      : "nr-solicit-cotac"       ,        
				"cotacao-item_it-codigo"              : "it-codigo"              ,        
				"item_desc-item"                      : "it-codigo-desc"         ,        
				"ITEM_codigo-refer"                   : "cod-refer"              ,        
				"ITEM_inform-compl"                   : "inform-compl"           ,        
				"ordem-compra_cod-estabel"            : "cod-estabel"            ,        
				"cotacao-item_cod-emitente"           : "cod-emitente"           ,        
				"emitente_nome-abrev"                 : "nome-abrev"             ,        
				"emitente_nome-emit"                  : "nome-emit"              ,        
				"cotacao-item_data-cotacao"           : "data-cotacao-desc"      ,        
				"cotacao-item_un"                     : "un"                     ,        
				"ordem-compra_qt-solic"               : "qt-solic"               ,        
				"cotacao-item_cdn-fabrican"           : "cdn-fabrican"           ,        
				"fab-medic_nom-fabrican"              : "nom-fabrican"           ,        
				"cotacao-item_preco-fornec"           : "preco-fornec"           ,        
				"cotacao-item_mo-codigo"              : "mo-codigo"              ,        
				"moeda_descricao"                     : "mo-codigo-desc"         ,        
				"cotacao-item_cotacao-moeda"          : "cotacao-moeda"          ,        
				"cotacao-item_cod-transp"             : "cod-transp"             ,        
				"transporte_nome-abrev"               : "cod-transp-desc"        ,        
				"cotacao-item_taxa-financ"            : "taxa-financ"            ,        
				"cotacao-item_valor-taxa"             : "valor-taxa"             ,        
				"cotacao-item_nr-dias-taxa"           : "nr-dias-taxa"           ,        
				"cotacao-item_codigo-ipi"             : "codigo-ipi"             ,        
				"cotacao-item_frete"                  : "frete"                  ,        
				"cotacao-item_reajusta-cota"          : "reajusta-cotacao"       ,        
				"cotacao-item_possui-reaj"            : "possui-reaj"            ,        
				"cotacao-item_valor-frete"            : "valor-frete"            ,        
				"cotacao-item_dias-validade"          : "dias-validade"          ,        
				"cotacao-item_prazo-entreg"           : "prazo-entreg"           ,        
				"cotacao-item_aliquota-ipi"           : "aliquota-ipi"           ,        
				"cotacao-item_aliquota-icm"           : "aliquota-icm"           ,        
				"cotacao-item_aliquota-iss"           : "aliquota-iss"           ,        
				"cotacao-item_perc-descto"            : "perc-descto"            ,        
				"cotacao-item_valor-descto"           : "valor-descto"           ,        
				"cotacao-item_cod-cond-pag"           : "cod-cond-pag"           ,        
				"cond-pagto_descricao"                : "cod-cond-pag-desc"      ,        
				"cotacao-item_cod-comprado"           : "cod-comprado"           ,        
				"comprador_nome"                      : "cod-comprado-desc"      ,        
				"cotacao-item_contato"                : "contato"                ,        
				"cotacao-item_narrativa"              : "narrativa"              ,        
				"cotacao-item_cot-aprovada"           : "cot-aprovada"           ,        
                "cotacao-item_motivo-apr"             : "motivo-apr"             , 
				"cotacao-item_pend-aprov"             : "pend-aprov"             ,        
				"cotacao-item_rejeitada"              : "rejeitada"              ,        
				"cotacao-item_mapa-cotacao"           : "mapa-cotacao"           ,        
				"cotacao-item_cod-incoterm"           : "cod-incoterm"           ,        
				"cotacao-item_cod-pto-contr"          : "cod-pto-contr"          ,        
				"cotacao-item_cdn-pais-orig"          : "cdn-pais-orig"          ,        
				"cotacao-item_class-fiscal"           : "class-fiscal"           ,        
				"cotacao-item_regime-impot"           : "regime-impot"           ,        
				"cotacao-item_aliquota-ii"            : "aliquota-ii"            ,        
				"cotacao-item_itinerario"             : "itinerario"             ,        
				"cotacao-item_log-gerac-autom-despes" : "log-gerac-autom-despes" ,
                "cotacao-item_despesas-importacao"    : "despesas-importacao"    ,
				"item_un"                             : "un-interna"             ,
				"cotacao-item_preco-final"            : "preco-final"            ,
				"cotacao-item_preco-total"            : "preco-total"            ,
				"cotacao-item_preco-referencia"       : "preco-referencia"       ,
				"cotacao-item_prazo-medio-pagto"      : "prazo-medio-pagto"      , 
				"cotacao-item_sugerido"               : "suggested"
		};

			return object[fieldName];
		}

		/*
		 * Objetivo: Abre a modal de busca avançada
		 * Parâmetros:
		 * Observações:
		 */
		quotationListControl.openAdvancedSearch = function(){
			var params = {disclaimers: quotationListControl.disclaimers,
                          currencies: quotationListControl.currencies,
                          currency: quotationListControl.currency,
                          dateOptionConvert: quotationListControl.dateOptionConvert,
                          dateConvert: quotationListControl.dateConvert};
			var modalInstance = advancedSearchModal.open(params).then(function(result) {
				quotationListControl.parseModelToDisclaimer(result);
                quotationListControl.currency = result['currency'];
                quotationListControl.dateOptionConvert = result['dateOptionConvert'];  
                if (result['dateConvert']) {
                    quotationListControl.dateConvert = result['dateConvert'];
                }
				quotationListControl.loadData(false);
			});
		}

		/*
		 * Objetivo: Transforma os valores das variáveis do model em disclaimers para a tela.
		 * Parâmetros: filters: variáveis que armazenam os filtros aplicados na busca
		 * Observações:
		 */
		quotationListControl.parseModelToDisclaimer = function(filters){
			quotationListControl.disclaimers = [];

			for (key in filters) {
				var model = filters[key];
				var disclaimer = {};

				switch(key) {
					case 'withoutAnswer':
						if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-pending'));
					break;
					case 'withAnswer':
						if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-with-answer'));
					break;
					case 'unlinked':
						if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-unlinked'));
					break;
					case 'approved':
						if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-approved'));
					break;
					case 'rejected':
						if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-rejected'));
					break;
					case 'withPendency':
						if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-pending-approval'));
					break;
					case 'withoutPendency':
						if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-without-pendency'));
					break;
					/**** AGUARDANDO fase 2 do projeto.*****
					case 'genRespRecord':
						if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-generate-response-record'));
					break;
					case 'genRespWithItemVendor':
						if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-msg-generate-reponse-with-item-provider'));
					break;*/
					case 'vendorCode':
						if(model.start || model.end) {
							disclaimer = modelToDisclaimer(key, 'l-vendor', model.start, model.end);
							quotationListControl.disclaimers.push(disclaimer);
						}
					break;
					case 'orderline':
						if(model && (model.start || model.end)) {
							disclaimer = modelToDisclaimer(key, 'l-requisition', model.start, model.end);
							quotationListControl.disclaimers.push(disclaimer);
						}
					break;
					case 'requestQuotation':
						if(model && (model.start || model.end)) {
							disclaimer = modelToDisclaimer(key, 'l-quotation-process', model.start, model.end);
							quotationListControl.disclaimers.push(disclaimer);
						}
					break;
					case 'site':
						if(model && (model.start || model.end)) {
							disclaimer = modelToDisclaimer(key, 'l-site', model.start, model.end);
							quotationListControl.disclaimers.push(disclaimer);
						}
					break;
					case 'itemCode':
						if(model.start || model.end) {
							disclaimer = modelToDisclaimer(key, 'l-item-code', model.start, model.end);
							quotationListControl.disclaimers.push(disclaimer);
						}
					break;
					case 'itemDescription':
						if(model.start || model.end) {
							disclaimer = modelToDisclaimer(key, 'l-item-description', model.start, model.end);
							quotationListControl.disclaimers.push(disclaimer);
						}
					break;
					case 'itemCompCode':
						if(model.start || model.end) {
							disclaimer = modelToDisclaimer(key, 'l-supplementary-code', model.start, model.end);
							quotationListControl.disclaimers.push(disclaimer);
						}
					break;
					case 'itemCompInfo':
						if(model.start || model.end) {
							disclaimer = modelToDisclaimer(key, 'l-additional-info', model.start, model.end);
							quotationListControl.disclaimers.push(disclaimer);
						}
					break;	
					case 'quotationDate':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-quotation-date', model.start, model.end, undefined, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc'));
                            quotationListControl.disclaimers.push(disclaimer);
                        }   
					break;		
					case 'notConfirmed':
                        if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-not-confirmed'));
                        break;
                    case 'confirmed':
                        if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-confirmed-gen'));
                        break;
                    case 'quoted':
                        if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-quoted'));
                        break;
                    case 'inQuotation':
                        if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-in-quotation'));
                        break;
                    case 'received':
                        if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-received'));
                        break;
                    case 'deleted':
                        if(model) quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-deleted'));
						break;	
					case 'buyer':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-buyer', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZ") ? true : false;
                            quotationListControl.disclaimers.push(disclaimer);
                        }
						break;	
					case 'referencePriceType':
						if(model){
							model = parseInt(model);
							quotationListControl.disclaimers.push(modelToDisclaimer(key, 'l-reference-price',  $rootScope.i18n(serviceLegend.referencePriceType.NAME(model), [], 'dts/mcc'), undefined, true));
						}
						break;
					case 'priceTableRowid':
						if(model){
							disclaimer.property = key;
							disclaimer.title = $rootScope.i18n('l-price-table', [], 'dts/mcc') + ": " + filters['priceTableName'];
							disclaimer.value = model;
							quotationListControl.disclaimers.push(disclaimer);
						}
						break;
				}
			}
		}

		/*
		 * Objetivo: Seta opção seleciona todos de acordo com as cotações selecionadas
		 * Parâmetros: 
		 * Observações:
		 */
		quotationListControl.checkSelectedAll = function(){
			
			var hasNotSelected = false;
			for (let i = 0; i < quotationListControl.model.ttQuotationList.length; i++) {
				if(!quotationListControl.model.ttQuotationList[i]['$selected']){
					hasNotSelected = true;
					break;
				}
			}

			quotationListControl.selectAll = !hasNotSelected;
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

			if(start != undefined && start != 'undefined') 
				disclaimer.value = start;  // Deve aceitar valores em branco
			
			disclaimer.value += '&nbsp;';
			
			if(end != undefined && end != 'undefined') 
				disclaimer.value += end; // Deve aceitar valores em branco

			return disclaimer;
		}

		/*
		 * Objetivo: Deletar um disclaimer
		 * Parâmetros:disclaimer: disclaimer a ser removido
		 */
		quotationListControl.removeDisclaimer = function(disclaimer) {
			var index = quotationListControl.disclaimers.indexOf(disclaimer);
			if (index != -1) {
				if(quotationListControl.disclaimers[index].property == "basicFilter")
					quotationListControl.searchInputText = null;
				quotationListControl.disclaimers.splice(index,1);				
				quotationListControl.loadData(false);
			}
		}

		/*
		 * Objetivo: alterar a ordenação dos resultados
		 * Parâmetros: orderby: objeto que contém a ordenação selecionada pelo usuário em tela
		 * Observações: - orderby.property - nome do campo que será usado na ordenação
						- orderby.asc - indica se a ordenação é crescente (asc = true), ou decrescente (asc = false)

		 * Quando filtrado por cotações desvinculadas, as ordenações por "Estabelecimento" e "Quantidade Solicitada" não ficam disponíveis
		 */
		quotationListControl.selectOrderBy = function(orderby){
			quotationListControl.orderBySelected = orderby;
			quotationListControl.loadData(false);
		}

		/*
		 * Objetivo: Abre a tela de edição da cotação
		 * Parâmetros: 
		 */
		quotationListControl.editQuotation = function(){
			if(quotationListControl.selectedItem == undefined){
				if(quotationListControl.selected.length == 0)
					toaster.pop('warning', $rootScope.i18n('l-select-one-quote', undefined, 'dts/mcc'));
				else	
					toaster.pop('warning', $rootScope.i18n('l-select-only-one-quote', undefined, 'dts/mcc'));
				return;
			}
			var q = quotationListControl.selectedItem;
			location.href ="#/dts/mcc/quotation/edit?&ordem="+q["numero-ordem"]+"&item="+q["it-codigo"]+"&emitente="+q["cod-emitente"]+"&seq="+q["seq-cotac"];
		}
        
        /*
		 * Objetivo: Abre a tela para cópia de cotação
		 * Parâmetros: 
		 */
		quotationListControl.copyQuotation = function(){
			if(quotationListControl.selectedItem == undefined){
				if(quotationListControl.selected == undefined ||
                   quotationListControl.selected.length == 0)
					toaster.pop('warning', $rootScope.i18n('l-select-one-quote', undefined, 'dts/mcc'));
				else	
					toaster.pop('warning', $rootScope.i18n('l-select-only-one-quote', undefined, 'dts/mcc'));
				return;
			}
			var quote = quotationListControl.selectedItem;
			location.href ="#/dts/mcc/quotation/copy?&ordem="+quote["numero-ordem"]+"&item="+quote["it-codigo"]+"&emitente="+quote["cod-emitente"]+"&seq="+quote["seq-cotac"];
		}

		/*
		 * Objetivo: Abre a tela de detalhe da cotação
		 * Parâmetros: 
		 */
		quotationListControl.detailQuotation = function(){
			if(quotationListControl.selectedItem == undefined){
				if(quotationListControl.selected.length == 0)
					toaster.pop('warning', $rootScope.i18n('l-select-one-quote', undefined, 'dts/mcc'));
				else	
					toaster.pop('warning', $rootScope.i18n('l-select-only-one-quote', undefined, 'dts/mcc'));
				return;
			}
			var q = quotationListControl.selectedItem;
			location.href ="#/dts/mcc/quotation/detail?&ordem="+q["numero-ordem"]+"&item="+q["it-codigo"]+"&emitente="+q["cod-emitente"]+"&seq="+q["seq-cotac"];
		}
        
        /*
		 * Objetivo: Abre a tela de detalhe da ordem de compra
		 * Parâmetros: 
		 */
		quotationListControl.detailPurchaseOrderline = function(){
			if(quotationListControl.selectedItem == undefined){
				if(!quotationListControl.selected || quotationListControl.selected.length == 0)
					toaster.pop('warning', $rootScope.i18n('l-select-one-quote', undefined, 'dts/mcc'));
				else	
					toaster.pop('warning', $rootScope.i18n('l-select-only-one-quote', undefined, 'dts/mcc'));
				return;
			}
			
            var purchOrderLine = quotationListControl.selectedItem['numero-ordem'];         
            $location.path('dts/mcc/purchaseorderline/detail/' + purchOrderLine);    
		}

        /*
		 * Objetivo: Remove cotações
		 * Parâmetros: 
		 */
		quotationListControl.removeQuotations = function(){
            var ttDeleteQuotations = [];
            if(quotationListControl.selectedItem == undefined){
				if(quotationListControl.selected == undefined ||
				   quotationListControl.selected.length == 0) {
					toaster.pop('warning', $rootScope.i18n('l-select-one-quote', undefined, 'dts/mcc'));
                    return;
                } else {
                    for (var i = 0; i < quotationListControl.selected.length; i++) {
                        quote = {'numero-ordem': quotationListControl.selected[i]["numero-ordem"],
						         'cod-emitente': quotationListControl.selected[i]['cod-emitente'],
                                 'it-codigo': quotationListControl.selected[i]['it-codigo'],
                                 'seq-cotac': quotationListControl.selected[i]['seq-cotac']};
                        ttDeleteQuotations.push(quote);
                    }
                }	
			} else {
                quote = {'numero-ordem': quotationListControl.selectedItem["numero-ordem"],
						 'cod-emitente': quotationListControl.selectedItem['cod-emitente'],
                         'it-codigo': quotationListControl.selectedItem['it-codigo'],
                         'seq-cotac': quotationListControl.selectedItem['seq-cotac']};
                ttDeleteQuotations.push(quote);
            }
            
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // título da mensagem
                text: $rootScope.i18n('l-delete-quotation-msg', [], 'dts/mcc'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar
                callback: function(isPositiveResult) { // função de retorno
                    var hasSucess = false;
                    
                    if (isPositiveResult) { // se foi clicado o botão confirmar
                        fchmatenterquotations.removeQuotations(ttDeleteQuotations,function(result){
                            //Verifica se alguma cotação foi eliminada
                            for (var i = 0; i < result.length; i++) {
                                if (result[i]['l-eliminada'] == true) {
                                    hasSucess = true;
                                    break;
                                }
                            }
                            
                            if(hasSucess){                   
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success',
                                    title: $rootScope.i18n('l-quotation', [], 'dts/mcc'),
                                    detail: $rootScope.i18n('l-quotation-or-quotations', [], 'dts/mcc') + ' ' +
                                    ($rootScope.i18n('l-success-deleted', [], 'dts/mcc')) + '!'
                                });
                                // Carrega a tela novamente com o que foi gravado
                                quotationListControl.loadData(false);
                            }
                        });
                    }
                }
            });
		}
        
/*
		 * Objetivo: Solicitar cotações
		 * Parâmetros: 
		 */
		quotationListControl.requestQuotation = function(){      
            var purchaseorderlines = [];
            if(quotationListControl.selectedItem == undefined){
				if(quotationListControl.selected == undefined ||
				   quotationListControl.selected.length == 0) {
					toaster.pop('warning', $rootScope.i18n('l-select-one-quote', undefined, 'dts/mcc'));
                    return;
                } else {
                    for (var i = 0; i < quotationListControl.selected.length; i++) {
                        if (purchaseorderlines.indexOf(quotationListControl.selected[i]["numero-ordem"]) == -1) {
                            purchaseorderlines.push(quotationListControl.selected[i]["numero-ordem"]);
                        }
					}
                }	
			} else {
                if (purchaseorderlines.indexOf(quotationListControl.selectedItem["numero-ordem"]) == -1) {
                    purchaseorderlines.push(quotationListControl.selectedItem["numero-ordem"]);
                }
            }
            $rootScope.mccPurchaseOrderLines = purchaseorderlines;
            $location.path('dts/mcc/requestquotation/new');    
		}        

        /*
		 * Objetivo: Aprovar cotações
		 * Parâmetros: 
		 */
		quotationListControl.approveQuotation = function(){      
            var ttCotacaoItem = {};
            var ttQuotationsApprove = [];
            var vendor = {};
                        
            if(quotationListControl.selectedItem == undefined){
				if(quotationListControl.selected == undefined ||
				   quotationListControl.selected.length == 0) {
					toaster.pop('warning', $rootScope.i18n('l-select-one-quote', undefined, 'dts/mcc'));
                    return;
                } else {
                    for (var i = 0; i < quotationListControl.selected.length; i++) {
						quote = quotationListControl.selected[i];
					    
						ttQuotationsApprove.push(quote);
					}
					ccapi367.validateApproveLotQuotations(ttQuotationsApprove,function(result){
						var quotationApprovedList = [], quotationToApproveList = [];
				
						if(!result.$hasError){
							//Caso existam cotação a serem desconsideradas
							if(result.pWarningMsg){
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'warning',
                                    title: $rootScope.i18n('l-attention', [], 'dts/mcc'), // título da mensagem
                                    detail: result.pWarningMsg, // texto da mensagem
                                });    
							}
							if(result.ttQuotationsApproveResult.length && 
							   result.ttQuotationsApproveResult.length > 0){
								var approved = false;
								var listApprovedOrderlines = ""; 
								//Separa as cotações passíveis de aprovação das que são passíveis 
								//mas já tem outra cotação aprovada para a ordem
								for (var i = 0; i < result.ttQuotationsApproveResult.length; i++) {
									var quote = result.ttQuotationsApproveResult[i];

									for (var j = 0; j < ttQuotationsApprove.length; j++) {
										var quoteInfo = angular.copy(ttQuotationsApprove[j]);
										if(quoteInfo['numero-ordem'] == quote['numero-ordem'] &&
										   quoteInfo['cod-emitente'] == quote['cod-emitente'] &&
										   quoteInfo['it-codigo']    == quote['it-codigo'] &&
										   quoteInfo['seq-cotac']    == quote['seq-cotac']){
											if(quote['l-ok']){
												if(quote['l-oc-aprovada']){
													approved = true;
													if(listApprovedOrderlines.indexOf(quote['numero-ordem']) == -1)
														listApprovedOrderlines = (listApprovedOrderlines != "")?listApprovedOrderlines + ", " + quote['numero-ordem']:""+quote['numero-ordem'];
													quotationApprovedList.push(quoteInfo);
												}else{
													quotationToApproveList.push(quoteInfo);
												}
											}
											break;
										}
									}
								}

								if(approved){
									//Questiona se deseja alterar as cotações aprovadas das ordens
									$rootScope.$broadcast(TOTVSEvent.showQuestion, {
										title: 'l-question', // título da mensagem
										text: $rootScope.i18n('l-msg-other-quotation-pending-approved-lot', [], 'dts/mcc').replace("&1",listApprovedOrderlines), // texto da mensagem
										cancelLabel: 'l-no', // label do botão cancelar
										confirmLabel: 'l-yes', // label do botão confirmar
										callback: function(isPositiveResult) { // função de retorno
											if (isPositiveResult) { // se foi clicado o botão confirmar considera as cotações na aprovação
												quotationToApproveList = $.merge(quotationToApproveList, quotationApprovedList)
											}
											quotationListControl.openApproveMultipleModal(quotationToApproveList);

										}
									});     
								}else{
									quotationListControl.openApproveMultipleModal(quotationToApproveList);
								}
							}
						}
					}); 
                }	
			} else {
                quote = {'numero-ordem': quotationListControl.selectedItem["numero-ordem"],
                         'cod-emitente': quotationListControl.selectedItem['cod-emitente'],
                         'it-codigo': quotationListControl.selectedItem['it-codigo'],
                         'seq-cotac': quotationListControl.selectedItem['seq-cotac'],
                         'cot-aprovada': quotationListControl.selectedItem['cot-aprovada'],
                         'motivo-apr': quotationListControl.selectedItem['motivo-apr'],
                         'prazo-entreg': quotationListControl.selectedItem['prazo-entreg'],
                         'data-cotacao': quotationListControl.selectedItem['data-cotacao'] };
                ttQuotationsApprove.push(quote);

                ccapi367.validateApproveQuotations(ttQuotationsApprove,function(result){   
                    if (result[0]['l-ok']) {           
                        //Atualizar a cotação para aprovar
                        quote['cot-aprovada'] = true;
                        ttCotacaoItem = quote;

                        vendor['cod-emitente'] = quotationListControl.selectedItem['cod-emitente'];
                        vendor['nome-abrev']   = quotationListControl.selectedItem['nome-abrev'];

                        params = {ttCotacaoItem: ttCotacaoItem,
                                  vendor:vendor };
                        
                        //Já existe outra cotação aprovada para a ordem
                        if (result[0]['l-oc-aprovada']) {
                            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
								title: 'l-question', // título da mensagem
								text: $rootScope.i18n('l-msg-other-quotation-pending-approved', [], 'dts/mcc').replace("&1",quotationListControl.selectedItem["numero-ordem"]), // texto da mensagem
								cancelLabel: 'l-no', // label do botão cancelar
								confirmLabel: 'l-yes', // label do botão confirmar
								callback: function(isPositiveResult) { // função de retorno
									if (isPositiveResult) { // se foi clicado o botão confirmar
										quotationListControl.openApproveModal(params);
									}
								}
							});                          
                        } else {
                            quotationListControl.openApproveModal(params);            
                        }
                    }             
                });
            }         
		} 
		
		/*
		 * Objetivo: Abre a model para aprovação em lote
		 * Parâmetros: quotationList: Cotações a serem aprovadas
		 */
		quotationListControl.openApproveMultipleModal = function(quotationList){
			if(!quotationList || quotationList.length <= 0){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:'error', // tipo de mensagem
					title: $rootScope.i18n('l-quote-approval', [], 'dts/mcc'), // título da mensagem
					detail: $rootScope.i18n('l-msg-no-quotation-approved', [], 'dts/mcc'), // texto da mensagem
				});           
			}else if (quotationList.length == 1) {
				//Se restar apenas 1 cotação para aprovar abre a tela de aprovação individual

				//Atualizar a cotação para aprovar
				quotationList[0]['cot-aprovada'] = true;
				let vendor = {};
				vendor['cod-emitente'] = quotationList[0]['cod-emitente'];
				vendor['nome-abrev']   = quotationList[0]['nome-abrev'];

				params = {ttCotacaoItem: quotationList[0],
						  vendor:vendor };

				quotationListControl.openApproveModal(params);

			}else{
				//Se forem aprovadas várias cotações abre modal de aprovação de múltiplas cotações 
				for (let i = 0; i < quotationList.length; i++) {
					quotationList[i]['cot-aprovada'] = true;
				}

				params = {ttCotacaoItem: quotationList};
				var modalInstance = approveMultipleQuotationsModal.open(params).then(function(result){

					quotationListControl.loadData(false);
				})
			}
		}

        /*
		 * Objetivo: Abre a model de aprovação
		 * Parâmetros: params: Cotação a ser aprovada e fornecedor
		 */
		quotationListControl.openApproveModal = function(params){      
            var modalInstance = approveModal.open(params).then(function(result) {
                params.ttCotacaoItem['motivo-apr'] = result.comments;
                paramsApprove = {ttQuotations: params.ttCotacaoItem,
                                 ttDeliverySchedule: result.parts}
                fchmatenterquotations.aproveQuotation(paramsApprove, function(result){         
                    // Carrega a tela novamente 
                    quotationListControl.loadData(false);
                });
            });
        }
        
        /*
 		 * Objetivo: Totalizar as cotações selecionadas
 		 * Parâmetros:
 		 */
		quotationListControl.valueSelected = function() {
            quotationListControl.totalValueSelected  = 0;
            quotationListControl.currencySign = '';
            
            if(quotationListControl.selectedItem == undefined){
				if(quotationListControl.selected == undefined ||
				   quotationListControl.selected.length == 0) {
					quotationListControl.totalValueSelected  = 0;
                    quotationListControl.currencySign = '';
                } else {
                    for (var i = 0; i < quotationListControl.selected.length; i++) {
                        quotationListControl.totalValueSelected = quotationListControl.totalValueSelected + 
                                                                  quotationListControl.selected[i]["preco-total"];
					}
                }	
			} else {
                quotationListControl.totalValueSelected = quotationListControl.selectedItem["preco-total"];
                quotationListControl.currencySign = quotationListControl.selectedItem["mo-codigo-sigla"];                
            }
            
            if (quotationListControl.currencySign == '' && 
                quotationListControl.selected != undefined &&
                quotationListControl.selected[0] != undefined) {
                quotationListControl.currencySign = quotationListControl.selected[0]["mo-codigo-sigla"];
            }
		};

		/* Chama o método de inicialização da tela */ 
		if ($rootScope.currentuserLoaded){ 
			quotationListControl.init(); 
		}

		// *********************************************************************************
		// *** Events Listeners
		// *********************************************************************************

		// cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			quotationListControl.init();
		});
	}

	
	// ########################################################
	// ### Registro dos controllers
	// ########################################################	
	index.register.controller('mcc.quotation.ListCtrl', quotationListController);
    index.register.controller('mcc.quotation.SearchListCtrl', quotationListController);
});
