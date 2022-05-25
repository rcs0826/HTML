define([
	'index',
    '/dts/mcc/js/api/ccapi362.js',
    '/dts/mcc/html/requestquotation/modal/requestquotation.advanced.search.ctrl.js',
    '/dts/mcc/html/requestquotation/modal/requestquotation.sendedquotation.crtl.js'
], function(index) {
    
    requestQuotationListController.$inject = ['$rootScope', '$scope', '$state','$filter', 'toaster', 'totvs.app-main-view.Service', 'mcc.ccapi362.Factory', 'TOTVSEvent', 'mcc.requestquotation.modal.ModalAdvancedSearch','mcc.requestquotation.modal.ModalSendedQuotationByProcess','$location'];
    function requestQuotationListController($rootScope, $scope, $state, $filter, toaster, appViewService, ccapi362, TOTVSEvent, modalAdvancedSearch, modalSendedQuotationByProcess, $location) {
        var ctrl = this;

        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        ctrl.hasNext = false;
        ctrl.disclaimers = [];
        ctrl.defaultDisclaimersValue = [];
        ctrl.basicFilter = "";      
        ctrl.completeModel = {};        
        ctrl.modelList = [];  
        ctrl.orderby = [
            {
                title: $rootScope.i18n('l-process', [], 'dts/mcc'), 
                property: "cdd-solicit", 
                asc:false,
                default:true
            }              
        ];
        ctrl.loaded = false;

        // *********************************************************************************
        // *** Functions
        // *********************************************************************************

        // # Purpose: Método de inicialização
        // # Parameters: 
        // # Notes:       
        ctrl.init = function() {      
            createTab = appViewService.startView(
                $rootScope.i18n('l-quotation-process-plural', [], 'dts/mcc'),
                'mcc.requestquotation.ListCtrl',
                ctrl
            );
            
            ctrl.attOrderbyList(ctrl.selectedOrderBy);

            if( createTab === false && appViewService && appViewService.previousView && appViewService.previousView.name &&
                appViewService.previousView.name !== "dts/mcc/requestquotation.edit" && 
                appViewService.previousView.name !== "dts/mcc/requestquotation.new"){
                return;
            }

            if(!ctrl.loaded) { 
                ctrl.loaded = true;
                ctrl.loadDefaults();
            }               
            ctrl.load(false);
        };
        
        // # Purpose: Carregar disclaimers padrões da listagem
        // # Parameters: 
        // # Notes: 
        ctrl.loadDefaults = function(){ 
            ctrl.selectedOrderBy = ctrl.orderby[0];
            ctrl.disclaimers = [];
               
            ctrl.disclaimers.push(modelToDisclaimer('withoutSending', 'l-without-sending'));
            ctrl.disclaimers.push(modelToDisclaimer('withSending', 'l-with-sending'));
            ctrl.disclaimers.push(modelToDisclaimer('partialResponded', 'l-partially-responded'));
            ctrl.disclaimers.push(modelToDisclaimer('totallyResponded', 'l-totally-responded'));
            ctrl.disclaimers.push(modelToDisclaimer('partialQuoted', 'l-partially-quoted'));
            ctrl.disclaimers.push(modelToDisclaimer('buyer', 'l-buyer', $rootScope.currentuser.login, $rootScope.currentuser.login));
            
        };

        // # Purpose: Carregar os registros da listagem
        // # Parameters: isMore: Identifica se são mais registros ou não (paginação)
        // # Notes: 
        ctrl.load = function(isMore) {  
            var parameter = []; 
            var parameters = new Object();

            // Configurações dos parâmetros utilizados na busca
            parameters.sortBy = ctrl.selectedOrderBy.property;
            parameters.orderAsc  = ctrl.selectedOrderBy.asc;
            
            parameters.basicFilter = ctrl.basicFilter;      

            parameters.rLastRowid   = isMore ? ctrl.completeModel.rLastRowid   : undefined;
            
            // Transforma os disclaimers em parâmetros para a api
            angular.forEach(ctrl.disclaimers, function(disclaimer) {
                if(typeof disclaimer.value == "string" && disclaimer.value.indexOf("&nbsp;") > -1) { /* Ranges */
                    parameter = ctrl.getParameterFromDisclaimer(disclaimer.property);
                    if(parameter) {                     
                        if(parameter[0]) {
                            parameters[disclaimer.property + 'Ini'] = parameter[0]; 
                        }
                        
                        if(parameter[1]) {
                            parameters[disclaimer.property + 'End'] = parameter[1]; 
                        }
                    }
                } else { /* Campos normais */ 
                    parameters[disclaimer.property] = disclaimer.value;
                }
            });
            var procedureParameters = {};
            procedureParameters.ttListParameters = parameters;
            procedureParameters.currentTTQuotationProcessList = [];

            if(isMore) {             
                ctrl.modelList.forEach(function(obj){
                    procedureParameters.currentTTQuotationProcessList.push({'cdd-solicit': obj['cdd-solicit']});
                });
            }

            ccapi362.getListQuotationProcess({}, procedureParameters, function(result) {   
                if(result['ttQuotationProcessList']) {
                    ctrl.completeModel = result;
                    if(isMore){
                        ctrl.modelList = $.merge(ctrl.modelList, result['ttQuotationProcessList']);
                    }else{
                        ctrl.modelList = result['ttQuotationProcessList'];                         
                    }   
                    
                    ctrl.setClassByStatus();
                    ctrl.hasNext = result.lHasNext;
                } else {
                    ctrl.hasNext = false;
                }
            });
        };

        // # Purpose: Seta a classe do css conforme a situação do processo
        // # Parameters:
        // # Notes: 
        ctrl.setClassByStatus = function(){

            /* 1 - Sem Envio
               2 - Com Envio
               3 - Respondido Parcial
               4 - Respondido Total
               5 - Cotado Parcial
               6 - Finalizado */

            for (var i = ctrl.modelList.length - 1; i >= 0; i--) {
                ctrl.modelList[i]['legendClass'] = 'tag-' + ctrl.modelList[i]['situacao'];
            }
        }

        // # Purpose: Retorna os valores do disclaimer em um array
        // # Parameters: 
        // #            property: nome do disclaimer
        // # Notes: 
        ctrl.getParameterFromDisclaimer = function(property){
            var value = undefined;
            $.grep(ctrl.disclaimers, function(e){
                if(e.property === property){
                    value = e.value.split("&nbsp;");
                    return;
                }
            });
            if(value[0] == 'undefined') value[0] = undefined;
            if(value[1] == 'undefined') value[1] = undefined;
            return value;
        }

        // # Purpose: Deletar um disclaimer
        // # Parameters: 
        // #            disclaimer: disclaimer a ser removido
        // # Notes: 
        ctrl.removeDisclaimer = function(disclaimer) {
            var index = ctrl.disclaimers.indexOf(disclaimer);
            var hasDefaultValue = false;
            if (index != -1) {              
                $.grep(ctrl.defaultDisclaimersValue, function(e){
                    if(e.property === disclaimer.property){
                        ctrl.disclaimers[index] = e;
                        hasDefaultValue = true;
                        return;
                    }
                });
                if(!hasDefaultValue){
                    ctrl.disclaimers.splice(index,1);
                }
                ctrl.load(false);
            }           
        }

        // # Purpose: Função executada após a troca de ordenação 
        // # Parameters: 
        // #            order: ordernação escolhida pelo usuário
        // # Notes: 
        ctrl.orderByChanged = function(order){
            ctrl.selectedOrderBy = order;
            ctrl.load(false);
        }

        // # Purpose: Cria um disclaimer a partir das informações recebidas 
        // # Parameters: 
        // #            property: nome do disclaimer
        // #            title: Título do disclaimer (será exibido em tela)
        // #            start: valor inicial
        // #            end: valor final
        // #            unique: Identifica se o disclaimer é uma faixa ou não
        // #            filter: filtro customozida para o disclaimer ex: date, number
        // #            format: formato a ser utilizado no filtro
        // #            fixed: identifica se o disclaimer será fixo ou não
        // # Notes: 
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

        // # Purpose: Transforma os parâmetros recebidos da modal (pesquisa avançada)
        // # Parameters: 
        // #            filters: parâmetros recebidos da modal
        // # Notes: 
        ctrl.parseModelToDisclaimer = function(filters){
            ctrl.disclaimers = [];          

            for (key in filters) {
                var model = filters[key];
                var disclaimer = {};    
                
                switch(key) {
                    case 'withoutSending':
                        if(model) ctrl.disclaimers.push(modelToDisclaimer(key, 'l-without-sending'));
                        break;
                    case 'withSending':
                        if(model) ctrl.disclaimers.push(modelToDisclaimer(key, 'l-with-sending'));
                        break;
                    case 'partialResponded':
                        if(model) ctrl.disclaimers.push(modelToDisclaimer(key, 'l-partially-responded'));
                        break;
                    case 'totallyResponded':
                        if(model) ctrl.disclaimers.push(modelToDisclaimer(key, 'l-totally-responded'));
                        break;
                    case 'partialQuoted':
                        if(model) ctrl.disclaimers.push(modelToDisclaimer(key, 'l-partially-quoted'));
                        break;
                    case 'finalized':
                        if(model) ctrl.disclaimers.push(modelToDisclaimer(key, 'l-finalized'));
                        break;
                    case 'validateShowType':
                        if(model) ctrl.disclaimers.push(modelToDisclaimer(key, 'l-only-expired'));
                        break;
                    case 'quotationProcess':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-quotation-process', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == 0) && model.end == 999999999999999) ? true : false;
                            ctrl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'processDescription':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-description', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ") ? true : false;
                            ctrl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'creationDate':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-creation-date', model.start, model.end, undefined, $filter('date'), $rootScope.i18n('l-date-format', [], 'dts/mcc'));
                            ctrl.disclaimers.push(disclaimer);
                        }   
                        break;
                    case 'orderline':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-purchase-orderline', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == 0) && model.end == 99999999) ? true : false;
                            ctrl.disclaimers.push(disclaimer);
                        }
                        break;
                    case 'buyer':
                        if(model.start || model.end) {
                            disclaimer = modelToDisclaimer(key, 'l-buyer', model.start, model.end);
                            disclaimer.hide = ((!model.start || model.start == "") && model.end.toUpperCase() == "ZZZZZZZZZZZZ") ? true : false;
                            ctrl.disclaimers.push(disclaimer);
                        }
                        break;
                }
            }
        }

        // # Purpose: atualizar o componente gráfico de ordenação na tela.
        // # Parameters: 
        // #            selected: ordenação selecionada
        // # Notes: 
        ctrl.attOrderbyList = function(selected){
            if(selected){
                for (var i = 0; i < ctrl.orderby.length; i++) {
                    if(ctrl.orderby[i]['property'] == selected.property){
                        ctrl.orderby[i]['default'] = true;
                        ctrl.orderby[i]['asc'] = selected.asc;
                    }else{
                        ctrl.orderby[i]['default'] = false;
                    }
                }
            }
        }

        // # Purpose: Abre a tela de Busca Avançada
        // # Parameters:
        // # Notes: 
        ctrl.openAdvancedSearch = function() {
            var modalInstance = modalAdvancedSearch.open({disclaimers: ctrl.disclaimers})
            .then(function(result) {
                ctrl.parseModelToDisclaimer(result);
                ctrl.load(false);
            });
        }

        // # Purpose: Remove o processo de cotação
        // # Parameters: 
        // #            quotationProcess: Objeto contendo dados do processo de cotação
        // # Notes: 
        ctrl.onRemoveQuotationProcess = function(quotationProcess) {

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // título da mensagem
                text: $rootScope.i18n('l-delete-quotation-process-msg', [], 'dts/mcc'), // texto da mensagem
                cancelLabel: 'l-no', // label do botão cancelar
                confirmLabel: 'l-yes', // label do botão confirmar
                callback: function(isPositiveResult) { // função de retorno
                    if (isPositiveResult) { // se foi clicado o botão confirmar
                    
                        var params = {'pQuotationProcessNumber' : quotationProcess['cdd-solicit']}; //número do processo
                        ccapi362.removeQuotationProcess(params, function(result){
                            if(!result['$hasError']){
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success',
                                    title: $rootScope.i18n('l-quotation-process', [], 'dts/mcc'),
                                    detail: $rootScope.i18n('l-quotation-process', [], 'dts/mcc') + ': ' + quotationProcess['cdd-solicit'] + ', ' +
                                    ($rootScope.i18n('l-success-deleted', [], 'dts/mcc')) + '!'
                                });
                                // Carrega a tela novamente com o que foi gravado
                                ctrl.load(false);
                            }
                        });
                    }
                }
            });
        };

        // # Purpose: Abre tela de solicitações enviadas
        // # Parameters: 
        // #            quotationProcess: Objeto contendo dados do processo de cotação
        // # Notes: 
        ctrl.onSentRequests = function (quotationProcess) {
            params = {quotationProcessNumber : quotationProcess['cdd-solicit']} //número do processo
            var modalInstance = modalSendedQuotationByProcess.open(params).then(function(result) {});
        };

        // # Purpose: Apresenta a tela com as respostas de cotação para o processo
        // # Parameters: 
        // #     processNumber: Número do processo de cotação
        // # Notes:
        ctrl.onQuotationAnswers = function(processNumber){ 
            var quoteParams = {};
            quoteParams.processNumber    = processNumber;
            quoteParams.pending          = false;
            quoteParams.quoted           = true;
            quoteParams.confirmed        = true;
            quoteParams.received         = true;
            quoteParams.deleted          = true;
            quoteParams.approved         = true;
            quoteParams.quotationDateIni = new Date(0).getTime();
            quoteParams.buyer            = '';
            
            $rootScope.mccQuoteParams = quoteParams;
            $location.path('dts/mcc/quotation/');   
        };

        
        if ($rootScope.currentuserLoaded) { ctrl.init(); }
        
        // *********************************************************************************
        // *** Events Listeners
        // *********************************************************************************
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            ctrl.init();
        }); 
    }
    index.register.controller('mcc.requestquotation.ListCtrl', requestQuotationListController);
});
