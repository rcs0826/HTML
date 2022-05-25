define([
	'index',
    '/dts/mcc/js/api/ccapi352.js',
    '/dts/mcc/html/currency/currency-services.js',
    '/dts/mcc/html/followup/followup-services.js',  
    '/dts/mcc/js/zoom/ordem-compra.js',
    '/dts/mcc/js/zoom/comprador.js',
    '/dts/mcc/js/zoom/requisitante.js',
    '/dts/mcc/js/zoom/tipo-rec-desp.js',
    '/dts/mcc/js/zoom/item-contrat.js',
    '/dts/mcc/js/zoom/tab-unidade.js',
    '/dts/mcc/js/zoom/proc-compra.js',
    '/dts/men/js/zoom/item.js',    
    '/dts/mpd/js/zoom/estabelec.js',
    '/dts/mce/js/zoom/deposito.js',
    '/dts/mcp/js/zoom/oper-ord.js',
    '/dts/mcp/js/zoom/ord-prod.js',    
    '/dts/utb/js/zoom/cta-ctbl-integr.js',
    '/dts/utb/js/zoom/ccusto.js',
    '/dts/mcc/js/zoom/sub-div-ordem.js',
    '/dts/mcc/js/zoom/referencia.js',
    '/dts/mpd/js/zoom/cliente.js',
    '/dts/mpd/js/zoom/ped-venda.js',
    '/dts/mpd/js/zoom/ped-item.js',
    '/dts/utb/js/zoom/empresa.js',
    '/dts/mcc/js/mcc-legend-service.js',
    '/dts/mcc/js/mcc-service.js'
], function(index) {

    // **************************************************************************************
	// *** CONTROLLER - DETAIL
	// **************************************************************************************	
	purchaseOrderLineDetailController.$inject = ['$rootScope', '$scope', '$stateParams', 'totvs.app-main-view.Service', 'mcc.ccapi352.Factory', 'mcc.currency.ModalChangeCurrency', '$location','TOTVSEvent', 'mcc.followup.ModalFollowUp'];
	function purchaseOrderLineDetailController($rootScope, $scope, $stateParams, appViewService, purchaseOrderLineFactory, modalChangeCurrency, $location, TOTVSEvent, modalFollowup) {
		var purchaseOrderLineDetailControl = this;
		
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

        purchaseOrderLineDetailControl.moeda = { 
    		'mo-codigo' : '0'
        };
        purchaseOrderLineDetailControl.opcaoConversao = 1; //Data da Cotação Fornecedor        
        purchaseOrderLineDetailControl.dataConversao = undefined;
        purchaseOrderLineDetailControl.quoteDetail = {};
        purchaseOrderLineDetailControl.apply = false;
        purchaseOrderLineDetailControl.qtdEntrega = purchaseOrderLineDetailControl.qtdCotacao = purchaseOrderLineDetailControl.qtdUnidadeNegocio = purchaseOrderLineDetailControl.qtdEvento = purchaseOrderLineDetailControl.qtdRecebimento = purchaseOrderLineDetailControl.qtdAlteracao = purchaseOrderLineDetailControl.qtdRequisicao = 0;
		// *********************************************************************************
		// *** Functions
		// *********************************************************************************
		/* Carrega os dados da ordem de compra */
		purchaseOrderLineDetailControl.load = function(numOrdem, dataConv, moeda) {			
            if (numOrdem) {
            
                purchaseOrderLineFactory.purchaseOrderLineDetails({pNrOrdem: numOrdem, 
                                                           pDate: dataConv, 
                                                           pCurrency: moeda['mo-codigo']}, function(order) {  
                        /* Zerar os contadores quando a requisição terminar */
                        purchaseOrderLineDetailControl.qtdEntrega = purchaseOrderLineDetailControl.qtdCotacao = 
                        purchaseOrderLineDetailControl.qtdUnidadeNegocio = purchaseOrderLineDetailControl.qtdEvento = 
                        purchaseOrderLineDetailControl.qtdRecebimento = purchaseOrderLineDetailControl.qtdAlteracao = 
                        purchaseOrderLineDetailControl.qtdRequisicao = 0;            
						
                        if (order[0]) {
                            purchaseOrderLineDetailControl.order = order;
                            purchaseOrderLineDetailControl.numOrdem = order[0]['numero-ordem'];
                            purchaseOrderLineDetailControl.itCodigo = order[0]['it-codigo'];

                    		/* Calcula quantidade de registros de cada temp-table. Serão exibidos nas abas  */
                    		if(order[0]['ttCotacaoItem'])
                    			purchaseOrderLineDetailControl.qtdCotacao = order[0]['ttCotacaoItem'].length;
                    		if(order[0]['ttPrazoCompra'])
                    			purchaseOrderLineDetailControl.qtdEntrega = order[0]['ttPrazoCompra'].length;   
                			if(order[0]['ttItRequisicao'])
                    			purchaseOrderLineDetailControl.qtdRequisicao = order[0]['ttItRequisicao'].length;
                			if(order[0]['ttUnidNegoc'])
                    			purchaseOrderLineDetailControl.qtdUnidadeNegocio = order[0]['ttUnidNegoc'].length; 
                			if(order[0]['ttRecebimento'])
                    			purchaseOrderLineDetailControl.qtdRecebimento = order[0]['ttRecebimento'].length;                  		
                    		if(order[0]['ttAltPed'])
                    			purchaseOrderLineDetailControl.qtdAlteracao = order[0]['ttAltPed'].length;                    		
                    		if(order[0]['ttEventoPed'])
                    			purchaseOrderLineDetailControl.qtdEvento = order[0]['ttEventoPed'].length;  
                        }else{
                            setTimeout(function () {
                                angular.element("#OrderLineZoomBox > a").trigger("click");
                            }, 100);
                            purchaseOrderLineDetailControl.numOrdem = undefined;
                        	purchaseOrderLineDetailControl.order = {};
                        }			
                    }
                );  
            }
		}
        
        /* Exibe a modal para efetuar a troca de moeda/opão de conversão. Ao confirmar, realiza uma nova busca e converte os valores de acordo com a nova moeda */
        purchaseOrderLineDetailControl.changeCurrency = function() {
            var modalInstance = modalChangeCurrency.open({
				                    moeda : purchaseOrderLineDetailControl.moeda,
                                    opcaoConversao : purchaseOrderLineDetailControl.opcaoConversao,
                                    dataConversao : purchaseOrderLineDetailControl.dataConversao
                                 }).then(function(result) {
                                        purchaseOrderLineDetailControl.moeda          = result.moeda;
                                        purchaseOrderLineDetailControl.opcaoConversao = result.opcaoConversao;
                                        purchaseOrderLineDetailControl.dataConversao  = result.dataConversao;
                                        purchaseOrderLineDetailControl.load(purchaseOrderLineDetailControl.numOrdem, 
                                                                        purchaseOrderLineDetailControl.dataConversao, 
                                                                        purchaseOrderLineDetailControl.moeda);
		                        });
        }

    	/* Busca os detalhes de cotação */
        purchaseOrderLineDetailControl.QuoteDetail = function(cotacao){    
        	if(!cotacao['cod-emitente-desc']){    	
	    		purchaseOrderLineFactory.orderLineQuoteDetail({pNrOrdem: cotacao['numero-ordem'],
														  	   pCodEmitente: cotacao['cod-emitente'],
														  	   pItCodigo: cotacao['it-codigo'],
														  	   pSeqCotac: cotacao['seq-cotac'],
														  	   pDate: purchaseOrderLineDetailControl.dataConversao,
														  	   pCurrency: purchaseOrderLineDetailControl.moeda['mo-codigo'],}, function(quoteDetail) {  				  	
					  	cotacao = $.extend(cotacao, quoteDetail[0]);  // Adiciona os detalhes da cotação no objeto cotação recebido por parâmetro;
	                }
	            );
            }
        };

        /* Aplicar alteração de ordem através do zoom de ordem de compra */
        purchaseOrderLineDetailControl.applyZoom = function(value){
            if(!value) return;
            purchaseOrderLineDetailControl.apply = true;   
            purchaseOrderLineDetailControl.zoomOrder = value;
            $location.path('dts/mcc/purchaseorderline/detail/' + value);            
        };

        /* Abre a modal para visualizar e adicionar os follow-ups 
        * doc: Tipo do documento                                                                                
        *    1 - Requisição de Estoque                                                                                        
        *    2 - Solicitação de Compra                                                                                        
        *    3 - Solicitação de Cotação                                                                                       
        *    4 - Ordem de Compra                                                                                              
        *    5 - Cotação                                                                                                      
        *    6 - Pedido de Compra  
        * docNumber: Número do documento
        * item: Código do item
        * seqItem: Sequência do item
        * vendor: Código do fornecedor
        * seqQuote: Sequência da cotação ou ordem de compra no caso de pedido                                                               
        */
        purchaseOrderLineDetailControl.followUp = function(doc, docNumber, item, seqItem, vendor, seqQuote){          
            if(purchaseOrderLineDetailControl.numOrdem !== undefined && purchaseOrderLineDetailControl.numOrdem !== "undefined"){
                var modalInstance = modalFollowup.open({doc: doc, docNumber: docNumber, item: item, seqItem: seqItem, vendor: vendor, seqQuote: seqQuote});
            }
        }
		
		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************		
		purchaseOrderLineDetailControl.init = function() {            
            var apply = purchaseOrderLineDetailControl.apply;
            createTab = appViewService.startView($rootScope.i18n('l-view-purchaseorderline'), 'mcc.purchaseorderline.DetailCtrl', purchaseOrderLineDetailControl);
            purchaseOrderLineDetailControl.apply = apply;

            if( (createTab == false && (purchaseOrderLineDetailControl.numOrdem == $stateParams.numeroOrdem)) && purchaseOrderLineDetailControl.apply == false) {
                return;
            }

            if ($stateParams && $stateParams.numeroOrdem) {
                purchaseOrderLineDetailControl.numOrdem = $stateParams.numeroOrdem;
                purchaseOrderLineDetailControl.apply = false;
                purchaseOrderLineDetailControl.zoomOrder = undefined;
                purchaseOrderLineDetailControl.load(purchaseOrderLineDetailControl.numOrdem, purchaseOrderLineDetailControl.dataConversao, purchaseOrderLineDetailControl.moeda);                
            } else {
                if(!purchaseOrderLineDetailControl.zoomOrder && !purchaseOrderLineDetailControl.numOrdem) {
                    setTimeout(function () {
                        angular.element("#OrderLineZoomBox > a").trigger("click");
                    }, 300);
                }
            }
		};
		
		if ($rootScope.currentuserLoaded) { this.init(); }
		
		// *********************************************************************************
		// *** Events Listeners
		// *********************************************************************************
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			purchaseOrderLineDetailControl.init();
		});	
	}
    // *********************************************************************************
    // *** Modal Moeda
    // *********************************************************************************
    modalChangeCurrency.$inject = ['$modal'];
    function modalChangeCurrency ($modal) {
    
        this.open = function (params) {         
            var instance = $modal.open({
                templateUrl: '/dts/mcc/html/currency/changecurrency.html',
                controller: 'mcc.currency.ChangeCurrencyCtrl as controller',
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
    
    // **************************************************************************************
    // *** CONTROLLER - LIST
    // **************************************************************************************   
    purchaseOrderLineListController.$inject = ['$rootScope', '$scope', '$state','$filter', 'toaster', 'totvs.app-main-view.Service', 'mcc.ccapi352.Factory', 'mcc.purchaseorderline.ModalAdvancedSearch', 'mcc.purchaseorderline.ModalTransferAndSetBuyer', 'mcc.followup.ModalFollowUp', 'TOTVSEvent', '$location'];
    function purchaseOrderLineListController($rootScope, $scope, $state, $filter, toaster, appViewService, purchaseOrderLineFactory, modalOrderlineAdvancedSearch, modalTransferAndSetBuyer, modalFollowup, TOTVSEvent, $location) {
        var purchaseOrderLineListControl = this;

        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        purchaseOrderLineListControl.isJustForView = $state.is('dts/mcc/purchaseorderline.search');
        purchaseOrderLineListControl.disclaimers = [];
        purchaseOrderLineListControl.defaultDisclaimersValue = [];
        purchaseOrderLineListControl.basicFilter = "";      
        purchaseOrderLineListControl.enableUpdate = false;
        purchaseOrderLineListControl.isPurchaseGroup = false;
        purchaseOrderLineListControl.currentuser = undefined;
        purchaseOrderLineListControl.completeModel = {};        
        purchaseOrderLineListControl.modelList = [];  
        purchaseOrderLineListControl.orderby = [
            {
                title: $rootScope.i18n('l-requisition', [], 'dts/mcc'), 
                property: "numero-ordem", 
                asc:false,
                default:true
            },              
            {
                title: $rootScope.i18n('l-emission-date', [], 'dts/mcc'), 
                property: "data-emissao", 
                asc:true
            },
            {
                title: $rootScope.i18n('l-delivery-date', [], 'dts/mcc'), 
                property: "data-entrega", 
                asc:true
            },
            {
                title: $rootScope.i18n('l-requisition-date', [], 'dts/mcc'), 
                property: "dt-requisicao", 
                asc:false
            },
            {
                title: $rootScope.i18n('l-site', [], 'dts/mcc'), 
                property: "cod-estabel", 
                asc:true
            },
            {
                title: $rootScope.i18n('l-status', [], 'dts/mcc'), 
                property: "situacao", 
                asc:true
            },
            {
                title: $rootScope.i18n('l-priority', [], 'dts/mcc'), 
                property: "prioridade-aprov", 
                asc:true
            }
        ];
        purchaseOrderLineListControl.loaded = false;

        // *********************************************************************************
        // *** Functions
        // *********************************************************************************
        purchaseOrderLineListControl.loadDefaults = function(){ // Carregar disclaimers defaults da listagem
            purchaseOrderLineListControl.selectedOrderBy = purchaseOrderLineListControl.orderby[0];
            purchaseOrderLineListControl.disclaimers = [];
            var MonthAgoDate = new Date();
            MonthAgoDate.setMonth(MonthAgoDate.getMonth()-1);   

            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('withoutQuote', 'l-without-quote'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('inQuotation', 'l-in-quotation'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('quoted', 'l-quoted'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('low', 'l-low-priority'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('medium', 'l-medium-priority'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('high', 'l-high-priority'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('veryHigh', 'l-very-high-priority'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('withPendency', 'l-pending-approval'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('withoutPendency', 'l-without-pendency'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('approved', 'l-approved'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('rejected', 'l-rejected'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('emissionDate', 'l-emission-date', MonthAgoDate.getTime(), new Date().getTime(), null, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc')));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('withExpectation', 'l-with-expectation'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('withoutExpectation', 'l-without-expectation'));
            purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('buyer', 'l-buyer', $rootScope.currentuser.login, $rootScope.currentuser.login));
            
            //Por grupo de compra
            if(purchaseOrderLineListControl.isPurchaseGroup){
                purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer('onlyBuyerGroup', 'l-only-buyer-group'));
            }
        };

        // Carregar os registros da listagem
        // isMore: Identifica se são mais registros ou não (paginação)
        purchaseOrderLineListControl.load = function(isMore) {  
            var parameter = []; 
            var parameters = new Object();

            // Configurações dos parâmetros utilizados na busca
            parameters.sortBy = purchaseOrderLineListControl.selectedOrderBy.property;
            parameters.orderAsc  = purchaseOrderLineListControl.selectedOrderBy.asc;
            
            parameters.basicFilter = purchaseOrderLineListControl.basicFilter;      

            parameters.cCodEstabelec       = isMore ? purchaseOrderLineListControl.completeModel.cCodEstabelec       : undefined;
            parameters.rLastOrderlineRowid   = isMore ? purchaseOrderLineListControl.completeModel.rLastOrderlineRowid   : undefined;
            
            // Transforma os disclaimers em parâmetros para a api
            angular.forEach(purchaseOrderLineListControl.disclaimers, function(disclaimer) {
                if(typeof disclaimer.value == "string" && disclaimer.value.indexOf("&nbsp;") > -1) { /* Ranges */
                    parameter = purchaseOrderLineListControl.getParameterFromDisclaimer(disclaimer.property);
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
            procedureParameters.currentTTOrderlineList = [];

            if(isMore) {             
                purchaseOrderLineListControl.modelList.forEach(function(orderline){
                    procedureParameters.currentTTOrderlineList.push({'numero-ordem': orderline['numero-ordem']});
                });
            }

            purchaseOrderLineFactory.getListOrderlines({}, procedureParameters, function(result) {   
                if(result['ttOrderlineList']) {
                    purchaseOrderLineListControl.completeModel = result;
                    if(isMore){
                        purchaseOrderLineListControl.modelList = $.merge(purchaseOrderLineListControl.modelList, result['ttOrderlineList']);
                    }else{
                        purchaseOrderLineListControl.modelList = result['ttOrderlineList'];                         
                    }                   
                    for (var i = purchaseOrderLineListControl.modelList.length - 1; i >= 0; i--) {
                        switch(purchaseOrderLineListControl.modelList[i]['situacao']){
                            case 1: //Sem Cotação
                                purchaseOrderLineListControl.modelList[i]['legendClass'] = 'tag-1';
                                break;
                            case 2: //Confirmada
                                if(purchaseOrderLineListControl.modelList[i]['qt-acum-rec'] == 0){ //Com Pedido
                                    purchaseOrderLineListControl.modelList[i]['legendClass'] = 'tag-4';    
                                }else if(purchaseOrderLineListControl.modelList[i]['qt-acum-rec'] > 0) //Recebida Parcial
                                    purchaseOrderLineListControl.modelList[i]['legendClass'] = 'tag-5';    
                                break;
                            case 3: //Cotada
                                purchaseOrderLineListControl.modelList[i]['legendClass'] = 'tag-3';
                                break;
                            case 4: //Eliminada
                                purchaseOrderLineListControl.modelList[i]['legendClass'] = 'tag-7';
                                break;
                            case 5: //Em Cotação
                                purchaseOrderLineListControl.modelList[i]['legendClass'] = 'tag-2';
                                break;
                            case 6: //Recebida Total
                                purchaseOrderLineListControl.modelList[i]['legendClass'] = 'tag-6';
                                break;

                        }
                    }
                }
            });
        };

        // Retorna os valores do disclaimer em um array
        // property: nome do disclaimer
        purchaseOrderLineListControl.getParameterFromDisclaimer = function(property){
            var value = undefined;
            $.grep(purchaseOrderLineListControl.disclaimers, function(e){
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
        purchaseOrderLineListControl.removeDisclaimer = function(disclaimer) {
            var index = purchaseOrderLineListControl.disclaimers.indexOf(disclaimer);
            var hasDefaultValue = false;
            if (index != -1) {              
                $.grep(purchaseOrderLineListControl.defaultDisclaimersValue, function(e){
                    if(e.property === disclaimer.property){
                        purchaseOrderLineListControl.disclaimers[index] = e;
                        hasDefaultValue = true;
                        return;
                    }
                });
                if(!hasDefaultValue){
                    purchaseOrderLineListControl.disclaimers.splice(index,1);
                }
                purchaseOrderLineListControl.load(false);
            }           
        }
        // Função executada após a troca de ordenação 
        // order: ordernação escolhida pelo usuário
        purchaseOrderLineListControl.orderByChanged = function(order){
            purchaseOrderLineListControl.selectedOrderBy = order;
            purchaseOrderLineListControl.load(false);
        }

        // Abre a modal de pesquisa avançada
        purchaseOrderLineListControl.openAdvancedSearch = function(){
            var modalInstance = modalOrderlineAdvancedSearch.open({disclaimers: purchaseOrderLineListControl.disclaimers})
                .then(function(result) {
                    purchaseOrderLineListControl.parseModelToDisclaimer(result);
                    purchaseOrderLineListControl.load(false);
            });
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

            if(start != undefined && start != 'undefined') disclaimer.value = start;         // Deve aceitar valores em branco
            disclaimer.value += '&nbsp;';
            if(end != undefined && end != 'undefined') disclaimer.value += end; // Deve aceitar valores em branco
            return disclaimer;
        }

        // Transforma os parâmetros recebidos da modal (pesquisa avançada)
        // filters: parâmetros recebidos da modal
        purchaseOrderLineListControl.parseModelToDisclaimer = function(filters){
            purchaseOrderLineListControl.disclaimers = [];          

            for (key in filters) {
                var model = filters[key];
                var disclaimer = {};                

                switch(key) {
                    case 'withoutQuote':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-without-quote'));
                        break;
                    case 'inQuotation':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-in-quotation'));
                        break;
                    case 'quoted':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-quoted'));
                        break;
                    case 'withOrder':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-with-purchase-order'));
                        break;
                    case 'partialReceived':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-partial-received'));
                        break;
                    case 'totalReceived':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-total-received'));
                        break;
                    case 'deleted':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-deleted'));
                        break;
                    case 'low':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-low-priority'));
                        break;
                    case 'medium':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-medium-priority'));
                        break;
                    case 'high':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-high-priority'));
                        break;
                    case 'veryHigh':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-very-high-priority'));
                        break;
                    case 'withPendency':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-pending-approval'));
                        break;
                    case 'withoutPendency':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-without-pendency'));
                        break;
                    case 'approved':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-approved'));
                        break;
                    case 'rejected':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-rejected'));
                        break;
                    case 'withExpectation':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-with-expectation'));
                        break;
                    case 'withoutExpectation':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-without-expectation'));
                        break;

                    case 'orderline':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-requisition', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == 0) && model.end == 99999999) ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'emissionDate':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-emission-date', model.start, model.end, undefined, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc'));
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }   
                        break;
                    case 'deliveryDate':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-delivery-date', model.start, model.end, undefined, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc'));
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }   
                        break;
                    case 'site':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-site', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZ") ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'requestNumber':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-request', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == 0) && model.end == 999999999) ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'requester':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-requester', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZ") ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'processQuotationNumber':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-quotation-process', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == 0) && model.end == 999999999999999) ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'contractNumber':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-contract', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == 0) && model.end == 999999999) ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'orderNumber':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-order', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == 0) && model.end == 99999999) ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'shortName':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-short-name', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZ") ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'description':
                        if(model) {
                            disclaimer = modelToDisclaimer(key, 'l-supplementary-description', model, undefined, true);                       
                            disclaimer.hide = (!model || model == "") ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }    
                        break;
                    case 'itemCode':
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
                        if(itemDisclaimer.value) purchaseOrderLineListControl.disclaimers.push(itemDisclaimer);
                        break;
                    case 'itemDescription':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-item-description', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ") ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'itemCompCode':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-supplementary-code', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZZZZZZZZZ") ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'itemCompInfo':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-supplementary-info', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZZZZZ") ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'itemNarrative':
                        if(model) {
                            disclaimer = modelToDisclaimer(key, 'l-item-text', model, undefined, true);                       
                            disclaimer.hide = (!model || model == "") ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }    
                        break;
                    case 'buyer':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-buyer', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZ") ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'onlyBuyerGroup':
                        if(model) purchaseOrderLineListControl.disclaimers.push(modelToDisclaimer(key, 'l-only-buyer-group'));
                        break;
                    case 'purchaseGroup':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-purchase-group', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZ") ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'originalBuyer':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-original-buyer', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZ") ? true : false;
                            purchaseOrderLineListControl.disclaimers.push(disclaimer);
                        }
                        break;
                }
            }
        }
        // Remover ordem de compra
        // orderline: Ordem a ser removida
        purchaseOrderLineListControl.onRemoveOrderline = function(orderline) {
            // envia um evento para perguntar ao usuário
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // titlo da mensagem
                text: $rootScope.i18n('l-confirm-delete-operation', [], 'dts/mcc'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar
                callback: function(isPositiveResult) { // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar
                        // chama o metodo de remover registro do service
                        purchaseOrderLineFactory.deleteRecord(orderline['numero-ordem'], function(result) {
                            if (!result['$hasError']) {
                                // notifica o usuario que o registro foi removido
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success', // tipo de notificação
                                    title: $rootScope.i18n('l-requisition', [], 'dts/mcc'), // titulo da notificação
                                    // detalhe da notificação
                                    detail: $rootScope.i18n('l-requisition', [], 'dts/mcc') + ': '
                                        + orderline['numero-ordem'] + ', ' +
                                        $rootScope.i18n('l-success-deleted', [], 'dts/mcc') + '!'
                                });                             
                                purchaseOrderLineListControl.load(false);
                            }
                        });
                    }
                }
            });
        };
        // Transferir ordem de compra para outro comprador e Definir comprador para ordens que não possuem comprador
        // orderline: Ordem a ser alterada
        // action: Ação executada (setBuyer, transfer)
        purchaseOrderLineListControl.transferAndSetBuyer = function(orderline, action){
            var procedureParameters = {};
            var currentTTOrderlineList = [];
            var countSelected = 0;

            procedureParameters.currentTTOrderlineList = [];

            if(orderline == null){
                purchaseOrderLineListControl.modelList.forEach(function(item){
                    if(item.$selected){
                        countSelected++;
                        currentTTOrderlineList.push({'numero-ordem': item['numero-ordem']});
                    }
                });
            }else{
                countSelected = 1;
                currentTTOrderlineList.push({'numero-ordem': orderline['numero-ordem']});
            }
            if (countSelected == 0){
                toaster.pop('error',$rootScope.i18n('l-attention', [], 'dts/mcc'),$rootScope.i18n('l-select-at-least-one-item'));              
            }else{

                var originalBuyer = (orderline == null || action == 'setBuyer' )?null:orderline['cod-comprado'];
                var modalInstance = modalTransferAndSetBuyer.open({originalBuyer: originalBuyer, action: action})
                    .then(function(result) {

                       
                        
                    procedureParameters.pcBuyerDestination = result['buyerDestination'];
                    procedureParameters.pcAction = action;
                    procedureParameters.currentTTOrderlineList = currentTTOrderlineList;

                    purchaseOrderLineFactory.transferAndSetBuyer(procedureParameters, function(result) {
                        if (!result['$hasError'] && result['plUpdated']) {
                            // notifica o usuario que a ordem de compra foi transferida
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success', // tipo de notificação
                                title: $rootScope.i18n('l-purchase-orderline', [], 'dts/mcc'), // titulo da notificação
                                // detalhe da notificação
                                detail: ((action == 'transfer')?$rootScope.i18n('l-purchase-orderline', [], 'dts/mcc') + ' ' +
                                    $rootScope.i18n('l-success-transfered', [], 'dts/mcc') + '!':$rootScope.i18n('l-buyer', [], 'dts/mcc') + ' ' +
                                    $rootScope.i18n('l-success-defined-msg', [], 'dts/mcc') + '!')
                            });                             
                            purchaseOrderLineListControl.load(false);
                        }
                    });
                });
            }
        };

        /* Abre a modal para visualizar e adicionar os follow-ups 
        * doc: Tipo do documento                                                                                
        *    1 - Requisição de Estoque                                                                                        
        *    2 - Solicitação de Compra                                                                                        
        *    3 - Solicitação de Cotação                                                                                       
        *    4 - Ordem de Compra                                                                                              
        *    5 - Cotação                                                                                                      
        *    6 - Pedido de Compra  
        * docNumber: Número do documento
        * item: Código do item
        * seqItem: Sequência do item
        * vendor: Código do fornecedor
        * seqQuote: Sequência da cotação ou ordem de compra no caso de pedido                                                               
        */
        purchaseOrderLineListControl.followUp = function(doc, docNumber, item, seqItem, vendor, seqQuote){          
            var modalInstance = modalFollowup.open({doc: doc, docNumber: docNumber, item: item, seqItem: seqItem, vendor: vendor, seqQuote: seqQuote});
        }

        /*
         * Objetivo: Abertura da tela de solicitação de cotação
         * Parâmetros: purchOrderLine: Número da ordem de compra
         * Observações:
         */
        purchaseOrderLineListControl.requestQuotation = function(purchOrderLine){   
            var purchaseorderlines = [];
            
            if (purchOrderLine) {
                purchaseorderlines.push(purchOrderLine);
            } else { 
                for(var i = 0; i < purchaseOrderLineListControl.modelList.length; i++){
                    if (purchaseOrderLineListControl.modelList[i].$selected) {
                        purchaseorderlines.push(purchaseOrderLineListControl.modelList[i]['numero-ordem']);
                    }
                }
            }
            
            $rootScope.mccPurchaseOrderLines = purchaseorderlines;
            $location.path('dts/mcc/requestquotation/new');
        } 

        /*
         * Objetivo: Apresenta a tela com as respostas de cotação para a ordem
         * Parâmetros: purchOrderLine: Número da ordem de compra
         * Observações:
         */
        purchaseOrderLineListControl.onQuotationAnswers = function(orderlineNumber){ 
            var quoteParams = {};
            quoteParams.purchOrderLine   = orderlineNumber;
            quoteParams.pending          = false;
            quoteParams.quoted           = true;
            quoteParams.confirmed        = true;
            quoteParams.received         = true;
            quoteParams.deleted          = true;
            quoteParams.approved         = true;
            quoteParams.quotationDateIni = new Date(0).getTime();
            quoteParams.buyer            = '';
            
            $rootScope.mccQuoteParams = quoteParams;
            
            if (purchaseOrderLineListControl.isJustForView) {
                $location.path('dts/mcc/quotation/search');  
            } else {
                $location.path('dts/mcc/quotation/');  
            }
        };

        /*
         * Objetivo: Apresenta a tela para inclusão de cotação
         * Parâmetros: purchOrderLine: Número da ordem de compra
         * Observações:
         */
        purchaseOrderLineListControl.onAddQuotation = function(orderlineNumber) {
            $rootScope.mccQuoteParam = orderlineNumber;
            $location.path('dts/mcc/quotation/new').search({addquotation:true});
        };

        /*
         * Objetivo: atualizar o componente gráfico de ordenação na tela.
         * Parâmetros: ordenação selecionada
         * Observações:
         */
        purchaseOrderLineListControl.attOrderbyList = function(selected){
            if(selected){
                for (var i = 0; i < purchaseOrderLineListControl.orderby.length; i++) {
                    if(purchaseOrderLineListControl.orderby[i]['property'] == selected.property){
                        purchaseOrderLineListControl.orderby[i]['default'] = true;
                        purchaseOrderLineListControl.orderby[i]['asc'] = selected.asc;
                    }else{
                        purchaseOrderLineListControl.orderby[i]['default'] = false;
                    }
                }
            }
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************        
        purchaseOrderLineListControl.init = function() {      
            createTab = appViewService.startView(
                $state.is('dts/mcc/purchaseorderline.search') ? $rootScope.i18n('l-view-purchaseorderline-plural', [], 'dts/mcc') : $rootScope.i18n('l-purchase-orderlines', [], 'dts/mcc'),
                $state.is('dts/mcc/purchaseorderline.search') ? 'mcc.purchaseorderline.SearchListCtrl' : 'mcc.purchaseorderline.ListCtrl',
                purchaseOrderLineListControl
            );
            
            purchaseOrderLineListControl.attOrderbyList(purchaseOrderLineListControl.selectedOrderBy);

            purchaseOrderLineListControl.currentuser = $rootScope.currentuser.login;
            if(createTab === false && appViewService && appViewService.previousView && appViewService.previousView.name &&
               ((purchaseOrderLineListControl.isJustForView && appViewService.previousView.name  == "dts/mcc/purchaseorderline.list" ||
                !purchaseOrderLineListControl.isJustForView && appViewService.previousView.name == "dts/mcc/purchaseorderline.search") ||
                appViewService.previousView.name == "dts/mcc/purchaseorderline.detail" ||
                appViewService.previousView.name.toLowerCase().indexOf("dts/mcc/purchaseorderline") == -1 ) && 
                purchaseOrderLineListControl.modelList.length > 0) {
                return;
            }

            //Verifica se está configurado por Comprador ou Grupo de Compra
            purchaseOrderLineFactory.getCheckByPurchaseGroup({}, function(result) {  
                purchaseOrderLineListControl.isPurchaseGroup = result['lPurchaseGroup'];   

                if(!purchaseOrderLineListControl.loaded) { 
                    purchaseOrderLineListControl.loaded = true;
                    purchaseOrderLineListControl.loadDefaults();
                }               
                purchaseOrderLineListControl.load(false);
            });
             
            purchaseOrderLineListControl.selected = [];
        };
        
        if ($rootScope.currentuserLoaded) { purchaseOrderLineListControl.init(); }
        
        // *********************************************************************************
        // *** Events Listeners
        // *********************************************************************************
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            purchaseOrderLineListControl.init();
        }); 
    }
    
    // ########################################################
    // ### CONTROLLER EDIÇÃO/CRIAÇÃO ORDEM
    // ########################################################
    purchaseOrderLineEditController.$inject = ['$rootScope', '$scope',  '$stateParams', '$location','$filter', '$state', 'totvs.app-main-view.Service', 'mcc.ccapi352.Factory', 'totvs.utils.Service', '$timeout', '$window', 'mpd.estabelecSE.zoom', 'mcc.service.mccService','mcc.zoom.serviceLegend','utb.empresa.zoom', 'TOTVSEvent', 'totvs.app-notification.Service'];
    function purchaseOrderLineEditController($rootScope, $scope, $stateParams, $location, $filter, $state, appViewService, purchaseOrderLineFactory, totvsUtilsService, $timeout, $window, serviceSite, serviceMcc, serviceLegend, serviceCompany, TOTVSEvent, appNotificationService) {
        PurchaseOrderlineEditControl = this;

        // *********************************************************************************
        // *** Atributos
        // *********************************************************************************
        
        PurchaseOrderlineEditControl.isUpdate = false; //Indica se é alteração
        PurchaseOrderlineEditControl.isCopy = false; //Indica se é uma cópia
        PurchaseOrderlineEditControl.saveAndNew = false; //Indica se deseja salvar e criar novo
        PurchaseOrderlineEditControl.action = "CREATE"; //Tipo de ação: "CREATE" ou "UPDATE"
        PurchaseOrderlineEditControl.companyInvestmentOrder = 0; //Empresa da ordem de investimento
        PurchaseOrderlineEditControl.qtdTotalDeliveries = 0; //Quantidade total das entregas
        PurchaseOrderlineEditControl.purchaseTypes = []; //Lista do campo "natureza"
        PurchaseOrderlineEditControl.icmsTypes = []; //Lista do campo "ICMS"
        PurchaseOrderlineEditControl.approvalPriorities = []; //Lista do campo "Prioridades de Aprovação"
        PurchaseOrderlineEditControl.enableFields = []; //Lista para habilitar ou desabilitar campos
        PurchaseOrderlineEditControl.model = {}; // mantem o conteudo do registro em edição/inclusão
        PurchaseOrderlineEditControl.investmentOrderInit = {}; //Filtro do zoom de ordem de investimento
        PurchaseOrderlineEditControl.operationInit = {}; //Filtro do zoom de operação
        PurchaseOrderlineEditControl.itemContractZoomInit  = {}; //Filtro do zoom de item do contrato
        PurchaseOrderlineEditControl.itemContractSelectInit  = {}; //Filtro do select de item do contrato
        PurchaseOrderlineEditControl.integrationAccountInit = {}; //Filtro da conta e centro de custo
        PurchaseOrderlineEditControl.group = {}; //Controle de abertura dos agrupadores
        PurchaseOrderlineEditControl.splitPurchaseRequisitionList = []; //Informações para split da ordem
        PurchaseOrderlineEditControl.ttSplitReturn = []; //Ordens criadas pelo split de ordens
        PurchaseOrderlineEditControl.accountZoomField = 0; //Zoom de conta contábil

        /* Carrega os dados da ordem a ser editada
        * orderlineNumber: Número da ordem de compra
        */
        PurchaseOrderlineEditControl.loadUpdate = function(orderlineNumber) {
            // chama o servico para retornar o registro
            purchaseOrderLineFactory.getPurchaseRequisition({pOrderlineNumber: orderlineNumber},{},function(result) {
                if(result['ttPurchaseRequisitionResult']) {
                    PurchaseOrderlineEditControl.afterLoadOrderline("", result);
                    fieldFocus();
                }               
            });
        }

        /* Carrega os dados da cópia da ordem
        * orderlineNumber: Número da ordem de compra a ser copiada
        */
        PurchaseOrderlineEditControl.loadCopy = function(orderlineNumber) {
            // chama o servico para retornar o registro
            purchaseOrderLineFactory.getCopyRequisition({purchaseRequisition: orderlineNumber},function(result) {
                if(result['ttPurchaseRequisitionResult']) {
                    PurchaseOrderlineEditControl.afterLoadOrderline("", result);
                    fieldFocus();
                }               
            });
        }

        // Retorna os valores default de uma ordem de compra
        PurchaseOrderlineEditControl.loadNew = function() {
            PurchaseOrderlineEditControl.model['ttDeliverySchedule'] = [];
            PurchaseOrderlineEditControl.calculateTotalDeliveryQuantity();
            purchaseOrderLineFactory.getDefaultsOrderline(function(result) {
                if(result['ttPurchaseRequisitionResult']) {
                    PurchaseOrderlineEditControl.afterLoadOrderline("", result);   
                    fieldFocus();                            
                }
            });
        }

        // Salva a criação ou edição de uma ordem de compra
        PurchaseOrderlineEditControl.save = function() {
           PurchaseOrderlineEditControl.onSaveUpdate();
        }

        // Função executada quando o usuário clicar no botão "Salvar e novo"
        // Responsável por zerar os campos e carregar os valores default do novo item
        PurchaseOrderlineEditControl.saveNew = function(){
            PurchaseOrderlineEditControl.saveAndNew = true;
            PurchaseOrderlineEditControl.onSaveUpdate();
        }

        // Cancelar operação de criação ou editação e retornar para a página anterior
        PurchaseOrderlineEditControl.cancel = function() {
            // solicita que o usuario confirme o cancelamento da edição/inclusão
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-cancel-operation', [], 'dts/mcc'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        if(PurchaseOrderlineEditControl.previousView && PurchaseOrderlineEditControl.previousView.name) {

                             switch(PurchaseOrderlineEditControl.previousView.name) {
                                
                                case "dts/mcc/purchaseorderline.detail":
                                    $location.path('dts/mcc/purchaseorderline/detail/' + PurchaseOrderlineEditControl.model.ttPurchaseRequisition['numero-ordem']);
                                    break;
                                default:
                                    $state.go('dts/mcc/purchaseorderline.start');
                                    break;
                            }                       
                        } else { 
                            $window.history.back();
                        }
                    }
                }
            });
        }

        // Método de validação das informações antes da gravação
        // isUpdate: Identifica se é uma edição
        PurchaseOrderlineEditControl.onSaveUpdate = function() {
             // verificar se o formulario tem dados invalidos
            if (PurchaseOrderlineEditControl.isInvalidForm()) { return; }

            if(PurchaseOrderlineEditControl.action == "CREATE"){
                //valida data de ressuprimento
                if((!PurchaseOrderlineEditControl.model.ttDeliverySchedule ||
                    PurchaseOrderlineEditControl.model.ttDeliverySchedule.length == 0) &&
                    PurchaseOrderlineEditControl.model.ttPurchaseRequisition['data-entrega'] < 
                    PurchaseOrderlineEditControl.model.ttPurchaseRequisition['dt-ressup']){
                    $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                        title: 'l-question', // titulo da mensagem
                        text: $rootScope.i18n('l-confirm-delivery-date-change-msg', [], 'dts/mcc').replace('&1', $filter('date')(PurchaseOrderlineEditControl.model.ttPurchaseRequisition['dt-ressup'],$rootScope.i18n('l-date-format', [], 'dts/mcc'))), // texto da mensagem
                        cancelLabel: 'l-no', // label do botão cancelar
                        confirmLabel: 'l-yes', // label do botão confirmar
                        callback: function(isPositiveResult) { // função de retorno
                            if (isPositiveResult) { // se foi clicado o botão confirmar
                               PurchaseOrderlineEditControl.model.ttPurchaseRequisition['data-entrega'] = 
                               PurchaseOrderlineEditControl.model.ttPurchaseRequisition['dt-ressup'];
                            }
                            PurchaseOrderlineEditControl.saveRequisition();
                        }
                    });
                }else{
                    if(PurchaseOrderlineEditControl.isCopy){
                        /*Na cópia caso haja apenas uma entrega deverá questionar se deseja alterar a data 
                        para a data de ressuprimento. Caso haja mais de uma entrega deve questionar se deseja gravar assim ou ajustar manualmente.*/
                        
                        if(PurchaseOrderlineEditControl.model.ttDeliverySchedule.length == 1){
                            if(PurchaseOrderlineEditControl.model.ttDeliverySchedule[0]['data-entrega'] < 
                               PurchaseOrderlineEditControl.model.ttPurchaseRequisition['dt-ressup']){
                                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                                    title: 'l-question', // titulo da mensagem
                                    text: $rootScope.i18n('l-confirm-delivery-date-change-msg', [], 'dts/mcc').replace('&1', $filter('date')(PurchaseOrderlineEditControl.model.ttPurchaseRequisition['dt-ressup'],$rootScope.i18n('l-date-format', [], 'dts/mcc'))), // texto da mensagem
                                    cancelLabel: 'l-no', // label do botão cancelar
                                    confirmLabel: 'l-yes', // label do botão confirmar
                                    callback: function(isPositiveResult) { // função de retorno
                                        if (isPositiveResult) { // se foi clicado o botão confirmar
                                            PurchaseOrderlineEditControl.model.ttDeliverySchedule[0]['data-entrega'] = 
                                            PurchaseOrderlineEditControl.model.ttPurchaseRequisition['dt-ressup'];
                                        }
                                        PurchaseOrderlineEditControl.saveRequisition();
                                    }
                                });
                            }else{
                                PurchaseOrderlineEditControl.saveRequisition();
                            }
                        }else{
                            foundMinorDate = false;
                            for (var i = 0; i < PurchaseOrderlineEditControl.model.ttDeliverySchedule.length; i++) {
                                if(PurchaseOrderlineEditControl.model.ttDeliverySchedule[i]['data-entrega'] < 
                                   PurchaseOrderlineEditControl.model.ttPurchaseRequisition['dt-ressup'])
                                   foundMinorDate = true; 
                            }
                            if(foundMinorDate){
                                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                                    title: 'l-question', // titulo da mensagem
                                    text: $rootScope.i18n('l-confirm-delivery-date-minor-resupply-msg', [], 'dts/mcc').replace('&1', $filter('date')(PurchaseOrderlineEditControl.model.ttPurchaseRequisition['dt-ressup'],$rootScope.i18n('l-date-format', [], 'dts/mcc'))), // texto da mensagem
                                    cancelLabel: 'l-no', // label do botão cancelar
                                    confirmLabel: 'l-yes', // label do botão confirmar
                                    callback: function(isPositiveResult) { // função de retorno
                                        if (isPositiveResult) { // se foi clicado o botão confirmar
                                            PurchaseOrderlineEditControl.saveRequisition();
                                        }
                                    }
                                });
                            }else{
                                PurchaseOrderlineEditControl.saveRequisition();
                            }
                        }
                    }else{
                        PurchaseOrderlineEditControl.saveRequisition();
                    }
                }
            }else{
                PurchaseOrderlineEditControl.saveRequisition();
            }
        }
        //Método de gravação das informações na criação ou alteração da ordem
        PurchaseOrderlineEditControl.saveRequisition = function(){
            purchaseOrderLineFactory.saveRequisition({pcAction: PurchaseOrderlineEditControl.action}, {'ttPurchaseRequisition': PurchaseOrderlineEditControl.model.ttPurchaseRequisition, 'ttDeliverySchedule': PurchaseOrderlineEditControl.model.ttDeliverySchedule, 'ttGenericBusinessUnit': PurchaseOrderlineEditControl.model.ttGenericBusinessUnit, 'ttParamConfigRules' : PurchaseOrderlineEditControl.model.ttParamConfigRules}, function(result) {
                if(!result['$hasError']){
                    if(result['plCanExecute'] === true){ //Apresenta pergunta sobre split da ordem
                        serviceMcc.openSplitQuestionModal({'numero-ordem': PurchaseOrderlineEditControl.model.ttPurchaseRequisition['numero-ordem']});
                    }else{
                        PurchaseOrderlineEditControl.finalizeSave();
                    }
                }else{
                    if(result['piNewOrderlineNumber']){
                        PurchaseOrderlineEditControl.model.ttPurchaseRequisition['numero-ordem'] = result['piNewOrderlineNumber'];
                    }
                }
            });
        }
        //Finaliza o processo de inclusão/alteração redirecionando a tela e notificando o usuário
        PurchaseOrderlineEditControl.finalizeSave = function(){
            if(PurchaseOrderlineEditControl.saveAndNew) {
                PurchaseOrderlineEditControl.loadNew();
                PurchaseOrderlineEditControl.saveAndNew = false;
            } else {                
                $location.path('dts/mcc/purchaseorderline');
            }       
         
            // notifica o usuario que conseguiu salvar o registro
            if(PurchaseOrderlineEditControl.ttSplitReturn && PurchaseOrderlineEditControl.ttSplitReturn.length > 0){
                PurchaseOrderlineEditControl.ttSplitReturn.forEach(function(orderline) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-purchase-orderline', [], 'dts/mcc'),
                        detail: $rootScope.i18n('l-purchase-orderline', [], 'dts/mcc') + ': ' + orderline['numero-ordem'] + ', ' +
                        (PurchaseOrderlineEditControl.isUpdate ? $rootScope.i18n('l-success-updated', [], 'dts/mcc') : $rootScope.i18n('l-success-created', [], 'dts/mcc')) + '!'
                    });
                });
            }else{
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'success',
                    title: $rootScope.i18n('l-purchase-orderline', [], 'dts/mcc'),
                    detail: $rootScope.i18n('l-purchase-orderline', [], 'dts/mcc') + ': ' + PurchaseOrderlineEditControl.model.ttPurchaseRequisition['numero-ordem'] + ', ' +
                    (PurchaseOrderlineEditControl.isUpdate ? $rootScope.i18n('l-success-updated', [], 'dts/mcc') : $rootScope.i18n('l-success-created', [], 'dts/mcc')) + '!'
                });
            }
        }

        // metodo para verificar se o formulario é válido
        PurchaseOrderlineEditControl.isInvalidForm = function() {            
            var messages = [];
            var isInvalidForm = false;
            
            var requireLabels = {
                'numero-ordem' : 'l-purchase-orderline',
                'qt-solic' : 'l-quantity',
                'un' : 'l-measure-unit',
                'cod-estabel' : 'l-site',
                'dep-almoxar' : 'l-warehouse',
                'cod-comprado' : 'l-buyer',
                'requisitante' : 'l-requester'
            }
            for (var field in requireLabels) {
                if (!PurchaseOrderlineEditControl.model.ttPurchaseRequisition[field] || 
                    PurchaseOrderlineEditControl.model.ttPurchaseRequisition[field].length == 0) {
                    isInvalidForm = true;
                    messages.push(requireLabels[field]);
                }
            }
           
            // se for invalido, monta e mostra a mensagem
            if (isInvalidForm) {
                var warning = $rootScope.i18n('l-field', [], 'dts/mcc');
                if (messages.length > 1) {
                    warning = $rootScope.i18n('l-fields', [], 'dts/mcc');
                }
                angular.forEach(messages, function(item) {
                    warning = warning + ' ' + $rootScope.i18n(item) + ((messages.length > 1)?',':'');
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

        // Função executada quando o usuário retirar o foco do campo (leave)
        // Responsável por enviar as informações atuais do formulário e retornar valores atualizados
        // field: nome do campo em que foi executado o leave        
        PurchaseOrderlineEditControl.fieldLeave = function(field) {
            PurchaseOrderlineEditControl.updateModel(field);
            purchaseOrderLineFactory.getFieldDefaults({pType: PurchaseOrderlineEditControl.action, pFieldName: field}, {'ttPurchaseRequisition': PurchaseOrderlineEditControl.model.ttPurchaseRequisition, 'ttGenericBusinessUnitOriginal': PurchaseOrderlineEditControl.model.ttGenericBusinessUnit},function(result) {
                PurchaseOrderlineEditControl.afterLoadOrderline(field, result);                               
            });
        }

        //Função que atualiza o model com as informações da tela
        //field: campo que está sendo alterado
        PurchaseOrderlineEditControl.updateModel = function(field){
            //Validação que evita leva pro progress valor nulo
            if(!PurchaseOrderlineEditControl.model['ttPurchaseRequisition'][field])
                PurchaseOrderlineEditControl.model['ttPurchaseRequisition'][field] = "";
            if(field == "nr-contrato"){
                PurchaseOrderlineEditControl.model['ttPurchaseRequisition']['nr-contrato'] = (PurchaseOrderlineEditControl.contract)?PurchaseOrderlineEditControl.contract['nr-contrato']:0;
                PurchaseOrderlineEditControl.model['ttPurchaseRequisition']['num-seq-item'] = (PurchaseOrderlineEditControl.contract)?PurchaseOrderlineEditControl.contract['num-seq-item']:0;
            }else if('ct-codigo'){
                PurchaseOrderlineEditControl.model['ttPurchaseRequisition']['ct-codigo'] = (PurchaseOrderlineEditControl.accountZoomField)?PurchaseOrderlineEditControl.accountZoomField:'';
            }
        }
        //Função que atualiza a tela com as informações do model
        //field: campo que está sendo alterado
        PurchaseOrderlineEditControl.updateView = function(field){
            switch(field){
                case "it-codigo":
                    PurchaseOrderlineEditControl.updateItemDependencies();
                    break;
                case "cod-estabel":
                    PurchaseOrderlineEditControl.updateSiteDependencies();
                    break;
                case "ordem-servic":
                    PurchaseOrderlineEditControl.updateServiceOrderDependencies();
                    break;
                case "": /*Abertura de tela na criação, alteração ou copia*/
                    PurchaseOrderlineEditControl.updateItemDependencies();
                    PurchaseOrderlineEditControl.updateSiteDependencies();
                    PurchaseOrderlineEditControl.updateServiceOrderDependencies();
                    if(PurchaseOrderlineEditControl.isUpdate || PurchaseOrderlineEditControl.isCopy)
                        PurchaseOrderlineEditControl.calculateTotalDeliveryQuantity();

                    break;
            }
                PurchaseOrderlineEditControl.accountZoomField = PurchaseOrderlineEditControl.model.ttPurchaseRequisition['ct-codigo'];
            /*Calcula percentual das unidades de negócio*/
            PurchaseOrderlineEditControl.calculateTotalPercentageBusinessUnit(undefined);
        }

        // Método executado após carregar as informações da ordem, seja na inclusão ou edição do mesmo
        //field: Campo que está sendo alterado, quando for default terá valor ""(Branco)
        //result: resultado do método que busca as informações
        PurchaseOrderlineEditControl.afterLoadOrderline = function(field, result){
            if(PurchaseOrderlineEditControl.isUpdate
                && field == "nr-contrato" 
                && PurchaseOrderlineEditControl.model.ttPurchaseRequisition 
                && PurchaseOrderlineEditControl.model.ttPurchaseRequisition['nr-contrato']
                && result['ttPurchaseRequisitionResult'][0]
                && PurchaseOrderlineEditControl.model.ttPurchaseRequisition.narrativa.trim() != "" 
                && PurchaseOrderlineEditControl.model.ttPurchaseRequisition.narrativa.trim() != result['ttPurchaseRequisitionResult'][0]['narrativa']){
                return appNotificationService.question({
                        title: 'l-question',
                        text: $rootScope.i18n('l-use-description-of-the-contract-item', [], 'dts/mcc'),
                        cancelLabel: 'l-no',
                        confirmLabel: 'l-yes',
                        callback: function(isPositiveResult) {
                            PurchaseOrderlineEditControl.continueAfterLoadOrderline(field, result, isPositiveResult);
                        }
                    });                
            }else{
                PurchaseOrderlineEditControl.continueAfterLoadOrderline(field, result, true);
            }            
        }

        //Método executado após carregar as informações da ordem e validar se deve alterar a narrativa da ordem de compra, seja na inclusão ou edição do mesmo
        //field: Campo que está sendo alterado, quando for default terá valor ""(Branco)
        //result: resultado do método que busca as informações
        //useDescOfItemOfContract: flag que indica se deve utilizar a narrativa do item do contrato ou não
        PurchaseOrderlineEditControl.continueAfterLoadOrderline = function(field, result, useDescOfItemOfContract){
            if(result['ttPurchaseRequisitionResult'][0]){
                oldDescription = null;
                if(!useDescOfItemOfContract && PurchaseOrderlineEditControl.model.ttPurchaseRequisition.narrativa)
                    oldDescription = PurchaseOrderlineEditControl.model.ttPurchaseRequisition.narrativa;
                PurchaseOrderlineEditControl.model['ttPurchaseRequisition'] = result['ttPurchaseRequisitionResult'][0];
                if(!useDescOfItemOfContract && oldDescription)
                    PurchaseOrderlineEditControl.model.ttPurchaseRequisition.narrativa = oldDescription;
                PurchaseOrderlineEditControl.model['ttGenericBusinessUnit'] = result['ttGenericBusinessUnit']; // Unidades de negócio
                PurchaseOrderlineEditControl.model['showBusinessUnit'] = result.pVisibleBusinessUnit; // Se as unidades de negócio são visíveis
                PurchaseOrderlineEditControl.model['ttBusinessUnit'] = result['ttBusinessUnit']; // Unidades de negócio selecionáveis (combo box)
                PurchaseOrderlineEditControl.model['enableBusinessUnit'] = (PurchaseOrderlineEditControl.model.showBusinessUnit && 
                                                                            PurchaseOrderlineEditControl.model.ttPurchaseRequisition['ct-codigo'] &&
                                                                            !PurchaseOrderlineEditControl.model.ttPurchaseRequisition['ordem-servic']);

                if(result['ttDeliverySchedule'])
                    PurchaseOrderlineEditControl.model['ttDeliverySchedule'] = result['ttDeliverySchedule'];
                for(i=0; i < result["ttEnableFields"].length; i++){
                    PurchaseOrderlineEditControl.enableFields[result["ttEnableFields"][i].campo] = result["ttEnableFields"][i].habilitado;
                }
                PurchaseOrderlineEditControl.enableFields['cod-unid-negoc'] = PurchaseOrderlineEditControl.model.enableBusinessUnit;
                if(result['ttIntegrationAccountCCenterVO2'][0]){
                    PurchaseOrderlineEditControl.model['ttIntegrationAccountCCenter'] = result['ttIntegrationAccountCCenterVO2'][0];
                }

                PurchaseOrderlineEditControl.updateView(field);
            }
        }

        // Define o foco no primeiro campo habilitado
        function fieldFocus() {         
            $timeout(function() {
                if(!$('#orderlineNumber').find('input:last').prop('disabled')) {
                    totvsUtilsService.focusOn('orderlineNumber');
                } else if(!$('#item').find('input:last').prop('disabled')) {
                    totvsUtilsService.focusOn('item');
                } else if(!$('#quantity').find('input:last').prop('disabled')) {
                    totvsUtilsService.focusOn('quantity');
                } else if(!$('#unitOfMeasure').find('input:last').prop('disabled')) {
                    totvsUtilsService.focusOn('unitOfMeasure');
                } else if(!$('#deliveryDate').find('input:last').prop('disabled')) {
                    totvsUtilsService.focusOn('deliveryDate');
                } 
            }, 100);
        }

        /*Atualiza elementos que dependem da informação do item*/
        PurchaseOrderlineEditControl.updateItemDependencies = function(){
            if(PurchaseOrderlineEditControl.model.ttPurchaseRequisition['it-codigo'] == undefined)
                PurchaseOrderlineEditControl.model.ttPurchaseRequisition['it-codigo'] = "";

            PurchaseOrderlineEditControl.itemContractZoomInit = {filter : {'it-codigo' : PurchaseOrderlineEditControl.model.ttPurchaseRequisition['it-codigo']}};
            if(PurchaseOrderlineEditControl.model.ttPurchaseRequisition['it-codigo'] != "")
                PurchaseOrderlineEditControl.itemContractSelectInit = {gotomethod : 'gotokeyitem', filter : {'it-codigo' : PurchaseOrderlineEditControl.model.ttPurchaseRequisition['it-codigo']}};
            else
                PurchaseOrderlineEditControl.itemContractSelectInit = {gotomethod : 'gotokeyitembranco', filter : {'it-codigo' : PurchaseOrderlineEditControl.model.ttPurchaseRequisition['it-codigo']}};
            
            PurchaseOrderlineEditControl.contract = PurchaseOrderlineEditControl.model.ttPurchaseRequisition['nr-contrato'];

        }

        /*Atualiza elementos que dependem da informação do estabelecimento*/
        PurchaseOrderlineEditControl.updateSiteDependencies = function(){
            if (PurchaseOrderlineEditControl.model['ttPurchaseRequisition']['cod-estabel']){
                if(PurchaseOrderlineEditControl.model.ttIntegrationAccountCCenter){
                    // Objeto inicial passado por parâmetro para o zoom de contas
                    PurchaseOrderlineEditControl.integrationAccountInit = {params: {'cod_empres_ems_2': PurchaseOrderlineEditControl.model.ttIntegrationAccountCCenter['company'],
                                                                            'dat_trans': PurchaseOrderlineEditControl.model.ttIntegrationAccountCCenter['dateMovto']},
                                                                     filters: {'cod_modul_dtsul': PurchaseOrderlineEditControl.model.ttIntegrationAccountCCenter['module'],
                                                                               'cod_plano_cta_ctbl': PurchaseOrderlineEditControl.model.ttIntegrationAccountCCenter['accountPlan']}};

                    // Objeto inicial passado por parâmetro para o zoom de centro de custo
                    PurchaseOrderlineEditControl.costCenterInit = {filters: {'cod_plano_ccusto': PurchaseOrderlineEditControl.model.ttIntegrationAccountCCenter['centerCostPlan']},
                                                            params:  {'cod_empres_ems_2': PurchaseOrderlineEditControl.model.ttIntegrationAccountCCenter['company'],
                                                                       'dat_trans': PurchaseOrderlineEditControl.model.ttIntegrationAccountCCenter['dateMovto']}};
                }

                var promiseSite = serviceSite.getObjectFromValue(PurchaseOrderlineEditControl.model['ttPurchaseRequisition']['cod-estabel']);
                if (promiseSite) {
                    if(promiseSite.then){
                        promiseSite.then(function(data) {
                            // Objeto inicial passado por parâmetro para o zoom de ordem de investimento
                            PurchaseOrderlineEditControl.investmentOrderInit = {filter: {'ep-codigo': data['ep-codigo']},
                                                                                method: 'gotoempresaordem'};
                            var promiseCompany = serviceCompany.getObjectFromValue(data['ep-codigo']);
                            if(promiseCompany){
                                if(promiseCompany.then){
                                    promiseCompany.then(function(company){
                                        PurchaseOrderlineEditControl.companyInvestmentOrder = company['cod_empresa'] + " - " + company['nom_abrev'];
                                    });
                                }
                            }
                        });
                    }
                }
            }
        };

        /*Atualiza elementos que dependem da informação da ordem de produção*/
        PurchaseOrderlineEditControl.updateServiceOrderDependencies = function(){
            if(PurchaseOrderlineEditControl.model.ttPurchaseRequisition['ordem-servic'])
                PurchaseOrderlineEditControl.operationInit = {filter : {'nr-ord-produ' : PurchaseOrderlineEditControl.model.ttPurchaseRequisition['ordem-servic']}}
        }

        //Expande e Contrai os agrupadores
        PurchaseOrderlineEditControl.onExpandAll = function(){
            //Se houver algum grupo fechado abre todos, senão fecha todos

            PurchaseOrderlineEditControl.group.authorities.open = 
            PurchaseOrderlineEditControl.group.supplements.open = 
            PurchaseOrderlineEditControl.group.deliveries.open = 
            PurchaseOrderlineEditControl.group.integrations.open = 
            PurchaseOrderlineEditControl.group.description.open = 
            PurchaseOrderlineEditControl.group.businessunit.open = (!PurchaseOrderlineEditControl.group.authorities.open ||
                                                                    !PurchaseOrderlineEditControl.group.supplements.open ||
                                                                    !PurchaseOrderlineEditControl.group.deliveries.open ||
                                                                    !PurchaseOrderlineEditControl.group.integrations.open ||
                                                                    !PurchaseOrderlineEditControl.group.description.open ||
                                                                    !PurchaseOrderlineEditControl.group.businessunit.open);
        };

        //Método de manipulação das regras de parcelamento
        PurchaseOrderlineEditControl.onSetRules = function(){
            serviceMcc.openDeliverySettingsModal(PurchaseOrderlineEditControl.model.ttParamConfigRules);
        }

        //Método de criação da parcela
        PurchaseOrderlineEditControl.onAddDelivery = function(){
            var params = {'action' : "CREATE",
                          'requisitionAction' : PurchaseOrderlineEditControl.action,
                          'purchaseOrderline' : PurchaseOrderlineEditControl.model.ttPurchaseRequisition,
                          'deliverySchedules': PurchaseOrderlineEditControl.model.ttDeliverySchedule};
     
            serviceMcc.openDeliveryEditModal(params);
        }

        //Método de alteração da parcela
        //delivery: Entrega a ser alterada
        PurchaseOrderlineEditControl.onEditDelivery = function(delivery){
            var params = {'action' : "UPDATE",
                          'requisitionAction' : PurchaseOrderlineEditControl.action,
                          'purchaseOrderline' : PurchaseOrderlineEditControl.model.ttPurchaseRequisition,
                          'currentDelivery' : delivery,
                          'deliverySchedules': PurchaseOrderlineEditControl.model.ttDeliverySchedule};
     
            serviceMcc.openDeliveryEditModal(params);
        }
        //Método de eliminação da entrega
        //delivery: entrega a ser eliminada
        PurchaseOrderlineEditControl.onRemoveDelivery = function(delivery){
            for (var i = PurchaseOrderlineEditControl.model.ttDeliverySchedule.length - 1; i >= 0; i--) {
                if(delivery['numero-ordem'] === PurchaseOrderlineEditControl.model.ttDeliverySchedule[i]['numero-ordem'] &&
                   delivery['parcela'] === PurchaseOrderlineEditControl.model.ttDeliverySchedule[i]['parcela']){
                    PurchaseOrderlineEditControl.model.ttDeliverySchedule.splice(i,1);
                    PurchaseOrderlineEditControl.calculateTotalDeliveryQuantity();
                }
            }
        }

        //Método que calcula a quantidade total nas entregas
        PurchaseOrderlineEditControl.calculateTotalDeliveryQuantity = function(){
            PurchaseOrderlineEditControl.qtdTotalDeliveries = 0;
            PurchaseOrderlineEditControl.model.ttDeliverySchedule.forEach(function(delivery) {
                PurchaseOrderlineEditControl.qtdTotalDeliveries = Number(PurchaseOrderlineEditControl.qtdTotalDeliveries) + Number(delivery['quantidade']);
            });
           
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************         
        PurchaseOrderlineEditControl.init = function() {
            //Definições padrões
            PurchaseOrderlineEditControl.populateDefaultsLists();
            
            createTab = appViewService.startView($rootScope.i18n('l-purchase-orderlines', [], 'dts/mcc'), 'mcc.purchaseorderline.EditCtrl', PurchaseOrderlineEditControl);
            
            PurchaseOrderlineEditControl.isUpdate = $state.is('dts/mcc/purchaseorderline.edit');
            PurchaseOrderlineEditControl.action = (PurchaseOrderlineEditControl.isUpdate)?"UPDATE":"CREATE";
            PurchaseOrderlineEditControl.isCopy = $state.is('dts/mcc/purchaseorderline.copy');
            PurchaseOrderlineEditControl.showDetail = (appViewService && appViewService.previousView && appViewService.previousView.controller &&
                                            (appViewService.previousView.controller == 'mcc.purchaseorderline.ListCtrl'))
                                            ? false : true;
            PurchaseOrderlineEditControl.previousView = (appViewService && appViewService.previousView)
                                              ? appViewService.previousView : undefined;

            if( appViewService && appViewService.previousView && appViewService.previousView.name &&
                createTab === false &&              
                (appViewService.previousView.name.toLowerCase().indexOf("dts/mcc/purchaseorderline") == -1 || 
                 appViewService.previousView.name.toLowerCase().indexOf("dts/mcc/purchaseorderline.search") > -1 ||
                 appViewService.previousView.name.toLowerCase().indexOf("dts/mcc/purchaseorderline.detail") > -1)) {
                return;
            }

            PurchaseOrderlineEditControl.model['ttPurchaseRequisition'] = {};

            // se houver parametros na URL
            if ($stateParams && $stateParams.id && PurchaseOrderlineEditControl.isUpdate) {
                PurchaseOrderlineEditControl.loadUpdate($stateParams.id);               
            }else if($stateParams && $stateParams.id && PurchaseOrderlineEditControl.isCopy){
                PurchaseOrderlineEditControl.loadCopy($stateParams.id);  
            }else { // se não, inicia com o model em branco (inclusão)              
                PurchaseOrderlineEditControl.loadNew(); //busca os valores defaults para criação do registro.
            }
        }

        // Adiciona uma nova unidade de negócio ao item (com informações default)
        PurchaseOrderlineEditControl.addBusinessUnit = function() {
            PurchaseOrderlineEditControl.model.ttGenericBusinessUnit.push({'cod_unid_negoc': "", 'des-unid-negoc': "", 'perc-unid-neg': 0});            
        }

        // Remove uma unidade de negócio
        // unit: Unidade de negócio a ser removida
        PurchaseOrderlineEditControl.removeBusinessUnit = function(unit) {
            var index = PurchaseOrderlineEditControl.model.ttGenericBusinessUnit.indexOf(unit);
            if (index != -1) {
                PurchaseOrderlineEditControl.model.ttGenericBusinessUnit.splice(index, 1);
                PurchaseOrderlineEditControl.calculateTotalPercentageBusinessUnit(undefined);
            }
        }

        // Calcula o total (porcentagem) das unidades de negócio do item
        // businessUnit: Unidade de negócio que está sendo preenchida pelo usuário
        PurchaseOrderlineEditControl.calculateTotalPercentageBusinessUnit = function(businessUnit){   

            if(businessUnit && businessUnit['perc-unid-neg'] > 100) {
                businessUnit['perc-unid-neg'] = 100;
            } else if(businessUnit && businessUnit['perc-unid-neg'] < 0) {
                businessUnit['perc-unid-neg'] = 0;
            }

            PurchaseOrderlineEditControl.totalPercentageBusinessUnit = 0;           
            if(PurchaseOrderlineEditControl.model['ttGenericBusinessUnit']){
                angular.forEach(PurchaseOrderlineEditControl.model['ttGenericBusinessUnit'], function(businessUnit) {
                    PurchaseOrderlineEditControl.totalPercentageBusinessUnit += businessUnit['perc-unid-neg'];
                });
            }

            if(PurchaseOrderlineEditControl.totalPercentageBusinessUnit > 100){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention', [], 'dts/mcc'),
                    detail: $rootScope.i18n('l-total-percentage-is-more-than-100', [], 'dts/mcc')
                });
            }
        }

        //Cria listas com informações padrões
        PurchaseOrderlineEditControl.populateDefaultsLists = function(){
            PurchaseOrderlineEditControl.group = {
                authorities  : { open : false },
                supplements  : { open : false },
                deliveries   : { open : false },
                integrations : { open : false },
                description  : { open : false },
                businessunit : { open : false }
            };
            PurchaseOrderlineEditControl.model['ttParamConfigRules'] = {
                'initialDate' : new Date(),
                'finalDate' : new Date(2099,11,31),
                'allowMinimumLot' : false,
                'allowDifferentMultipleLot' : false,
                'exportSchedule' : false
            };       
            

            for (var i = 1; i <= 3; i++) {
                PurchaseOrderlineEditControl.purchaseTypes.push({'name' : serviceLegend.purchaseTypes.NAME(i),
                                                                 'value' : i});
            }
            for (var i = 1; i <= 2; i++) {
                PurchaseOrderlineEditControl.icmsTypes.push({'name' : serviceLegend.icmsTypes.NAME(i),
                                                             'value' : i});
            }
            
            for (var i = 3; i >= 0; i--) {
                PurchaseOrderlineEditControl.approvalPriorities.push({'name' : serviceLegend.approvalPriorities.NAME(i),
                                                                      'value' : i});
            }
        }

        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { PurchaseOrderlineEditControl.init(); }
         
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
         
        // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            PurchaseOrderlineEditControl.init();
        });    

        /* Atualiza model das entregas após fechar a modal 
           event: Dados do Evento
           deliverySchedules: Entregas retornadas da tela de inclusão/Alteração */
        $scope.$on("mcc.deliveryschedulechange.event", function(event, result){
            PurchaseOrderlineEditControl.model.ttDeliverySchedule = result;
            PurchaseOrderlineEditControl.calculateTotalDeliveryQuantity();
        });

        /* Atualiza model das regras da entrega após fechar a modal 
           event: Dados do Evento
           rules: Regras das entregas retornadas da tela de configuração das regras */
        $scope.$on("mcc.deliveryschedulerules.event", function(event, rules){
            PurchaseOrderlineEditControl.model.ttParamConfigRules = rules;
        });

        /* Retorno da tela de questionamento do split
           event: Dados do Evento
           params: Parametros retornadas da tela de questionamento do split */
        $scope.$on("mcc.purchasesplitquestion.event", function(event, params){
            PurchaseOrderlineEditControl.ttSplitReturn = params.ttSplitReturn;
            if(!params.showSplit){
                PurchaseOrderlineEditControl.finalizeSave();
                    
            }else{
                var parameters = {'numero-ordem': PurchaseOrderlineEditControl.model.ttPurchaseRequisition['numero-ordem'],
                                  'qt-solic': PurchaseOrderlineEditControl.model.ttPurchaseRequisition['qt-solic'],
                                  'splitPurchaseRequisitionList' : PurchaseOrderlineEditControl.splitPurchaseRequisitionList};
                serviceMcc.openSplitDefineModal(parameters);
            }
        });

        /* Retorno da tela de definição do split 
           event: Dados do Evento
           params: Parametros retornadas da tela de confirmação do split */
        $scope.$on("mcc.purchasesplitdefine.event", function(event,params){
            PurchaseOrderlineEditControl.ttSplitReturn = params.ttSplitReturn;
            PurchaseOrderlineEditControl.finalizeSave();
        });

        $scope.$on('$destroy', function () {
            PurchaseOrderlineEditControl = undefined;
        });
        
    }

    // *************************************************************************************
    // *** SERVICE MODAL ADVANCED SEARCH
    // *************************************************************************************
    modalOrderlineAdvancedSearch.$inject = ['$modal'];
    function modalOrderlineAdvancedSearch($modal) {
        this.open = function (params) {         
            var instance = $modal.open({
                templateUrl: '/dts/mcc/html/purchaseorderline/list/purchaseorderline.advanced.search.html',
                controller: 'mcc.purchaseorderline.AdvancedSearchCtrl as controller',
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
    modalOrderlineAdvancedSearchController.$inject = ['$scope', '$modalInstance', 'parameters', 'mcc.ccapi352.Factory'];
    function modalOrderlineAdvancedSearchController($scope, $modalInstance, parameters, purchaseOrderLineFactory) {
        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        var OrderlineAdvancedSearchControl = this;
        OrderlineAdvancedSearchControl.disclaimers = [];
        OrderlineAdvancedSearchControl.parameters = [];
        OrderlineAdvancedSearchControl.model = {};   
        OrderlineAdvancedSearchControl.todayTimestamp = new Date().getTime();        
        OrderlineAdvancedSearchControl.isPurchaseGroup = false;

        // *********************************************************************************
        // *** Functions
        // *********************************************************************************
        OrderlineAdvancedSearchControl.init = function(){
            OrderlineAdvancedSearchControl.parseDisclaimerToModel();
            purchaseOrderLineFactory.getCheckByPurchaseGroup({}, function(result) {  
                OrderlineAdvancedSearchControl.isPurchaseGroup = result['lPurchaseGroup'];   
            });
        }

        // Transforma os disclaimers recebidos em parâmetros para a modal (setar os campos da pesquisa avançada)
        OrderlineAdvancedSearchControl.parseDisclaimerToModel = function(){
            // Transforma os disclaimers em parâmetros para a api
            angular.forEach(OrderlineAdvancedSearchControl.disclaimers, function(disclaimer) {
                
                if(typeof disclaimer.value == "string" && disclaimer.value.indexOf("&nbsp;") > -1){ /* Ranges */    
                    parameter = OrderlineAdvancedSearchControl.getParameterFromDisclaimer(disclaimer.property);
                    if(parameter){                      
                        if(disclaimer.property.match(/Date*/)){ // Se for do tipo date converte para integer                            
                            OrderlineAdvancedSearchControl.model[disclaimer.property] = {start: (parameter[0])?parseInt(parameter[0],10):undefined, end: (parameter[1])?parseInt(parameter[1],10):undefined};
                        }else{
                            OrderlineAdvancedSearchControl.model[disclaimer.property] = {};                           
                            if(parameter[0]) OrderlineAdvancedSearchControl.model[disclaimer.property].start = parameter[0];
                            if(parameter[1]) OrderlineAdvancedSearchControl.model[disclaimer.property].end = parameter[1];
                        }                       
                    }
                }else { /* Campos normais */
                    OrderlineAdvancedSearchControl.model[disclaimer.property] = disclaimer.value;                 
                }
            });    
        }

        // Retorna um objeto da lista de disclaimers recebidos de acordo com o nome da propriedade
        //property: propriedade utlizada para criar o disclaimer
        OrderlineAdvancedSearchControl.getParameterFromDisclaimer = function(property){
            var value = undefined;
            $.grep(OrderlineAdvancedSearchControl.disclaimers, function(e){
                if(e.property === property){
                    value = e.value.split("&nbsp;");
                    return;
                }
            });         
            if(value[0] == 'undefined') value[0] = undefined;
            if(value[1] == 'undefined') value[1] = undefined;
            return value;
        };

        //Aplica os filtros definidos em tela
        OrderlineAdvancedSearchControl.apply = function() {           
            $modalInstance.close(OrderlineAdvancedSearchControl.model);
        }
        
        //Cancela a tela de filtro avançado
        OrderlineAdvancedSearchControl.cancel = function() {
            $modalInstance.dismiss('cancel');
        }
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************        
        OrderlineAdvancedSearchControl.disclaimers = parameters.disclaimers;

        OrderlineAdvancedSearchControl.init();        
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        $scope.$on('$destroy', function () {
            OrderlineAdvancedSearchControl = undefined;
        });

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {         
            $modalInstance.dismiss('cancel');
        });
    }
    

    // *************************************************************************************
    // *** SERVICE MODAL TRANSFER AND SET BUYER
    // *************************************************************************************
    modalTransferAndSetBuyer.$inject = ['$modal'];
    function modalTransferAndSetBuyer($modal) {
        this.open = function (params) {         
            var instance = $modal.open({
                templateUrl: '/dts/mcc/html/purchaseorderline/list/purchaseorderline.transfer.setbuyer.html',
                controller: 'mcc.purchaseorderline.TransferAndSetBuyerCtrl as controller',
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
    // ### CONTROLLER MODAL TRANSFET AND SET BUYER
    // ########################################################
    modalTransferAndSetBuyerController.$inject = ['$scope', '$modalInstance', 'parameters'];
    function modalTransferAndSetBuyerController($scope, $modalInstance, parameters) {
        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        var transferAndSetBuyerControl = this;
        transferAndSetBuyerControl.parameters = [];
        transferAndSetBuyerControl.model = {};   

        // *********************************************************************************
        // *** Functions
        // *********************************************************************************
        transferAndSetBuyerControl.init = function(){
            transferAndSetBuyerControl.model.buyerDestination = (parameters.originalBuyer != null)?parameters.originalBuyer:undefined;
            transferAndSetBuyerControl.action = parameters.action;
        }
 
        //Aplica a transferência ou definição do comprador
        transferAndSetBuyerControl.apply = function() {           
            $modalInstance.close(transferAndSetBuyerControl.model);
        }
        
        //Cancela a alteração do comprador
        transferAndSetBuyerControl.cancel = function() {
            $modalInstance.dismiss('cancel');
        }
        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************  
        transferAndSetBuyerControl.init();        
        // ********************************************************************************* 
        // *** Events Listners
        // *********************************************************************************
        $scope.$on('$destroy', function () {
            transferAndSetBuyerControl = undefined;
        });

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {         
            $modalInstance.dismiss('cancel');
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
         
    /*Referente a Modal de Filtro Avançado*/
    index.register.service('mcc.purchaseorderline.ModalAdvancedSearch', modalOrderlineAdvancedSearch);
    index.register.controller('mcc.purchaseorderline.AdvancedSearchCtrl', modalOrderlineAdvancedSearchController);

    /*Referente a Modal de Transferência e Definição de comprador*/
    index.register.service('mcc.purchaseorderline.ModalTransferAndSetBuyer', modalTransferAndSetBuyer);
    index.register.controller('mcc.purchaseorderline.TransferAndSetBuyerCtrl', modalTransferAndSetBuyerController);

    index.register.service('mcc.currency.ModalChangeCurrency', modalChangeCurrency);
    index.register.service('mcc.followup.ModalFollowUp', modalFollowup);

    index.register.controller('mcc.purchaseorderline.DetailCtrl', purchaseOrderLineDetailController);
    index.register.controller('mcc.purchaseorderline.ListCtrl', purchaseOrderLineListController);
    index.register.controller('mcc.purchaseorderline.EditCtrl', purchaseOrderLineEditController);
    index.register.controller('mcc.purchaseorderline.SearchListCtrl', purchaseOrderLineListController);
});
