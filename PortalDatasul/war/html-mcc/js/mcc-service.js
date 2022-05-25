define([
    'index',
    '/dts/mcc/js/zoom/referencia.js',
    '/dts/mpd/js/zoom/cliente.js',
    '/dts/mpd/js/zoom/ped-venda.js',
    '/dts/mpd/js/zoom/ped-item.js',
    '/dts/mcc/js/api/ccapi352.js'
], function (index) {

    // *********************************************************************************
    // *** Controller Edição do Prazo de Entrega
    // *********************************************************************************
    controllerDeliveryScheduleEdit.$inject = ['$rootScope', '$scope', '$filter', '$modalInstance', 'parameters', 'mcc.ccapi352.Factory', 'TOTVSEvent'];
    function controllerDeliveryScheduleEdit($rootScope, $scope, $filter, $modalInstance, parameters, purchaseOrderLineFactory, TOTVSEvent) {
        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        var DeliveryScheduleEditControl = this; 
        DeliveryScheduleEditControl.deliverySchedule = {}; //Entrega corrente
        DeliveryScheduleEditControl.deliveryScheduleList = []; //Lista de entregas da ordem
        DeliveryScheduleEditControl.showSaveContinueButton = true; //Indica se apresenta botão "Salvar e Novo"
        DeliveryScheduleEditControl.qtdTotalDeliveries = 0; //Quantidade total das entregas
        DeliveryScheduleEditControl.customerOrderItemSequenceZoomInit = {}; //Filtro do zoom de item do pedido
        DeliveryScheduleEditControl.customerOrderZoomInit = {}; //Filtro do zoom de pedido do cliente
        DeliveryScheduleEditControl.customerZoomField = {}; //Objeto do zoom de cliente
        DeliveryScheduleEditControl.enableFields = []; //Lista para habilitar ou desabilitar campos
        // *********************************************************************************
        // *** Functions
        // ********************************************************************************* 

        //Método de inicialização do controller
        DeliveryScheduleEditControl.init = function () {
            DeliveryScheduleEditControl.deliveryScheduleList = parameters.deliverySchedules;
            DeliveryScheduleEditControl.purchaseOrderline = parameters.purchaseOrderline;
            DeliveryScheduleEditControl.load();
            
        }       

        //Carrega as informações
        DeliveryScheduleEditControl.load = function(){
            if(parameters.action == "CREATE"){
                
                DeliveryScheduleEditControl.deliverySchedule['numero-ordem'] = DeliveryScheduleEditControl.purchaseOrderline['numero-ordem'];
                purchaseOrderLineFactory.setDefaultsDeliverySchedule({'pType':"CREATE", 'pFieldName' : ""},{'ttPurchaseRequisition': DeliveryScheduleEditControl.purchaseOrderline, 'ttDeliverySchedule': DeliveryScheduleEditControl.deliverySchedule}, function(result){
                    if(result){
                        DeliveryScheduleEditControl.deliverySchedule = result['ttDeliveryScheduleDefault'][0];
                        DeliveryScheduleEditControl.qtdTotalDeliveries = 0;
                        DeliveryScheduleEditControl.deliveryScheduleList.forEach(function(delivery) {
                            DeliveryScheduleEditControl.qtdTotalDeliveries += Number(delivery['quantidade']);
                        });
                        var quantity = (Number(DeliveryScheduleEditControl.purchaseOrderline['qt-solic']) > DeliveryScheduleEditControl.qtdTotalDeliveries)?
                                       (Number(DeliveryScheduleEditControl.purchaseOrderline['qt-solic']) - DeliveryScheduleEditControl.qtdTotalDeliveries):0;
                        quantity = (quantity > 9999999.9999)?9999999.9999 : quantity;
                        DeliveryScheduleEditControl.deliverySchedule['quantidade']  = quantity;
                        DeliveryScheduleEditControl.deliverySchedule['parcela'] = getNextSequence();
                        for(i=0; i < result["ttEnableFields"].length; i++){
                            DeliveryScheduleEditControl.enableFields[result["ttEnableFields"][i].campo] = result["ttEnableFields"][i].habilitado;
                        }
                    }
                });

            }else{
                DeliveryScheduleEditControl.showSaveContinueButton = false;
                DeliveryScheduleEditControl.deliverySchedule = parameters['currentDelivery'];
                purchaseOrderLineFactory.setDefaultsDeliverySchedule({'pType':"UPDATE", 'pFieldName' : ""},{'ttPurchaseRequisition': DeliveryScheduleEditControl.purchaseOrderline, 'ttDeliverySchedule': DeliveryScheduleEditControl.deliverySchedule}, function(result){
                    if(result){
                        DeliveryScheduleEditControl.deliverySchedule = result['ttDeliveryScheduleDefault'][0];
                        for(i=0; i < result["ttEnableFields"].length; i++){
                            DeliveryScheduleEditControl.enableFields[result["ttEnableFields"][i].campo] = result["ttEnableFields"][i].habilitado;
                        }
                        DeliveryScheduleEditControl.setCustomerOrderZoomInit();
                        DeliveryScheduleEditControl.setCustomerOrderItemSequenceZoomInit();
                        
                        DeliveryScheduleEditControl.customerZoomField = {'cod-emitente' : DeliveryScheduleEditControl.deliverySchedule['cod-emitente'],
                                                                         'nome-abrev' : DeliveryScheduleEditControl.deliverySchedule['nome-abrev']};
                    }
                });                
            }
        }

        //Confirma as alterações
        //saveAndContinue: Indica se foi utilizada a opção "Salvar e Novo"
        DeliveryScheduleEditControl.apply = function (saveAndContinue) {
            if (DeliveryScheduleEditControl.isInvalidForm()) { return; }

            if(!DeliveryScheduleEditControl.deliverySchedule['nome-abrev'])
                DeliveryScheduleEditControl.deliverySchedule['nome-abrev'] = '';

            if(!DeliveryScheduleEditControl.deliverySchedule['pedido-clien'])
                DeliveryScheduleEditControl.deliverySchedule['pedido-clien'] = '';

            if(!DeliveryScheduleEditControl.deliverySchedule['nr-sequencia'])
                DeliveryScheduleEditControl.deliverySchedule['nr-sequencia'] = 0;

            //valida data de ressuprimento
            if((parameters.requisitionAction == "CREATE" || 
               (parameters.requisitionAction == "UPDATE" && parameters.action == "CREATE")) &&
               DeliveryScheduleEditControl.deliverySchedule['data-entrega'] < 
               DeliveryScheduleEditControl.purchaseOrderline['dt-ressup']){
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'l-question', // titulo da mensagem
                    text: $rootScope.i18n('l-confirm-delivery-date-change-msg', [], 'dts/mcc').replace('&1', $filter('date')(DeliveryScheduleEditControl.purchaseOrderline['dt-ressup'],$rootScope.i18n('l-date-format', [], 'dts/mcc'))), // texto da mensagem
                    cancelLabel: 'l-no', // label do botão cancelar
                    confirmLabel: 'l-yes', // label do botão confirmar
                    callback: function(isPositiveResult) { // função de retorno
                        if (isPositiveResult) { // se foi clicado o botão confirmar
                            DeliveryScheduleEditControl.deliverySchedule['data-entrega'] = 
                            DeliveryScheduleEditControl.purchaseOrderline['dt-ressup'];
                        }
                        DeliveryScheduleEditControl.saveDelivery(saveAndContinue);
                    }
                });
            }else{
                DeliveryScheduleEditControl.saveDelivery(saveAndContinue);
            }

        }

        //Efetiva a criação/alteração da entrega
        //saveAndContinue: indica se deve fechar a tela ou permitir incluir uma nova entrega
        DeliveryScheduleEditControl.saveDelivery = function(saveAndContinue){
            var foundDelivery = false;
            for(i=0; i < DeliveryScheduleEditControl.deliveryScheduleList.length; i++){
                if(DeliveryScheduleEditControl.deliveryScheduleList[i]['parcela'] == DeliveryScheduleEditControl.deliverySchedule['parcela']){
                    DeliveryScheduleEditControl.deliveryScheduleList[i] = DeliveryScheduleEditControl.deliverySchedule;
                    foundDelivery = true;
                }
            }
            if(!foundDelivery)
                DeliveryScheduleEditControl.deliveryScheduleList.push(DeliveryScheduleEditControl.deliverySchedule);

            if(saveAndContinue){
                $rootScope.$broadcast("mcc.deliveryschedulechange.event", DeliveryScheduleEditControl.deliveryScheduleList);
                DeliveryScheduleEditControl.deliverySchedule = {};
                DeliveryScheduleEditControl.load();
            }else{
                $modalInstance.close(DeliveryScheduleEditControl.deliveryScheduleList);
            }
        }

        //Método para verificar se o formulario é válido
        DeliveryScheduleEditControl.isInvalidForm = function() {            
            var messages = [];
            var isInvalidForm = false;
            
            var requireLabels = {
                'quantidade' : 'l-quantity',
                'data-entrega' : 'l-delivery-date'
            }
            for (var field in requireLabels) {
                if(field == 'quantidade'){
                    DeliveryScheduleEditControl.deliverySchedule[field] = Number(DeliveryScheduleEditControl.deliverySchedule[field]);
                }
                if (!DeliveryScheduleEditControl.deliverySchedule[field] || 
                    DeliveryScheduleEditControl.deliverySchedule[field].length == 0) {
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

        //Método executado ao alterar o cliente
        DeliveryScheduleEditControl.changeCustomer = function(){
            DeliveryScheduleEditControl.deliverySchedule['cod-emitente'] = (DeliveryScheduleEditControl.customerZoomField)?DeliveryScheduleEditControl.customerZoomField['cod-emitente']:0;
            DeliveryScheduleEditControl.deliverySchedule['nome-abrev'] = (DeliveryScheduleEditControl.customerZoomField)?DeliveryScheduleEditControl.customerZoomField['nome-abrev']:'';
            DeliveryScheduleEditControl.setCustomerOrderZoomInit();

        }

        //Método executado ao alterar o pedido do cliente
        DeliveryScheduleEditControl.changeCustomerOrder = function(){
            DeliveryScheduleEditControl.setCustomerOrderItemSequenceZoomInit();

        }

        //Seta o filtro do zoom de Pedido do Cliente
        DeliveryScheduleEditControl.setCustomerOrderZoomInit = function(){
            DeliveryScheduleEditControl.customerOrderZoomInit = {property:'nome-abrev',
                                                                 value: {
                                                                    start : DeliveryScheduleEditControl.deliverySchedule['nome-abrev'],
                                                                    end : DeliveryScheduleEditControl.deliverySchedule['nome-abrev']
                                                                        }
                                                                };
        }

         //Seta o filtro do zoom de item do pedido do cliente
        DeliveryScheduleEditControl.setCustomerOrderItemSequenceZoomInit = function(){
            DeliveryScheduleEditControl.customerOrderItemSequenceZoomInit = {filter: {
                                                                                 'nome-abrev': DeliveryScheduleEditControl.deliverySchedule['nome-abrev'],
                                                                                 'nr-pedcli' : DeliveryScheduleEditControl.deliverySchedule['pedido-clien']
                                                                                },
                                                                            gotomethod : 'gotokeypedcli'
                                                                            };
        }

        //Cancela as alterações
        DeliveryScheduleEditControl.cancel = function () {
            $modalInstance.dismiss('cancel');
        }
        
        //Busca próxima sequência da parcela
        function getNextSequence(){
            var lastSeq = 0;

            DeliveryScheduleEditControl.deliveryScheduleList.forEach(function(delivery) {
                if(delivery['parcela'] > lastSeq){
                    lastSeq = delivery['parcela'];
                }
            });

            return lastSeq + 1;
        }
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        DeliveryScheduleEditControl.init();

        // ********************************************************************************* 
        // *** Events Listners
        // *********************************************************************************
        $scope.$on('$destroy', function () {
            DeliveryScheduleEditControl = undefined;
        });

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });
    }

    // *********************************************************************************
    // *** Controller Configurações Prazo de Entrega
    // *********************************************************************************
    controllerDeliveryScheduleSettings.$inject = ['$scope', '$modalInstance', 'parameters'];
    function controllerDeliveryScheduleSettings($scope, $modalInstance, parameters) {
        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        var DeliveryScheduleSettingsControl = this; 
        
        DeliveryScheduleSettingsControl.model = {};       
        // *********************************************************************************
        // *** Functions
        // *********************************************************************************   

        //Aplica as alterações da tela de configuração das parcelas     
        DeliveryScheduleSettingsControl.apply = function () {

            var settings = {initialDate : DeliveryScheduleSettingsControl.model.intervalDeliveryDate.startDate,
                            finalDate : DeliveryScheduleSettingsControl.model.intervalDeliveryDate.endDate,
                            allowMinimumLot:  DeliveryScheduleSettingsControl.model.allowMinimumLot,
                            allowDifferentMultipleLot:  DeliveryScheduleSettingsControl.model.allowDifferentMultipleLot,
                            exportSchedule:  DeliveryScheduleSettingsControl.model.exportSchedule};

            $modalInstance.close(settings);
        }

        //Cancela as alterações da tela de configuração das parcelas
        DeliveryScheduleSettingsControl.cancel = function () {
            $modalInstance.dismiss('cancel');
        }

        //Método de inicialização
        DeliveryScheduleSettingsControl.init = function () {

            DeliveryScheduleSettingsControl.model = {
                'intervalDeliveryDate' : {
                    'startDate' : parameters.initialDate,
                    'endDate' : parameters.finalDate
                },
                'allowMinimumLot' : parameters.allowMinimumLot,
                'allowDifferentMultipleLot' : parameters.allowDifferentMultipleLot,
                'exportSchedule' : parameters.exportSchedule
            };       

        }

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        DeliveryScheduleSettingsControl.init();
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        $scope.$on('$destroy', function () {
            DeliveryScheduleSettingsControl = undefined;
        });
    }

    // *********************************************************************************
    // *** Controller Tela de Questionamento do Split
    // *********************************************************************************
    controllerSplitQuestion.$inject = ['$scope', '$modalInstance', 'parameters', 'mcc.ccapi352.Factory'];
    function controllerSplitQuestion($scope, $modalInstance, parameters, purchaseOrderLineFactory) {
        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        var SplitQuestionControl = this; 
        
        SplitQuestionControl.model = {};       
        // *********************************************************************************
        // *** Functions
        // *********************************************************************************   

        //Aplica as alterações da tela de questionamento do split   
        SplitQuestionControl.apply = function () {
            SplitQuestionControl.prepareExecuteSplit('apply');
        }

        //Cancela as alterações da tela de questionamento do split 
        SplitQuestionControl.cancel = function () {
            SplitQuestionControl.prepareExecuteSplit('cancel');
        }

        //Executa split conforme ação da tela
        //action: Ação realizada na tela (APPLY ou CANCEL)
        SplitQuestionControl.prepareExecuteSplit = function(action){
            if(action == 'cancel' || (!SplitQuestionControl.model.splitDeliveryVendors && !SplitQuestionControl.model.showSplit)){

                purchaseOrderLineFactory.prepareExecuteSplitPurchaseRequisition({purchaseRequisition: parameters['numero-ordem'], 'executeSplit': false}, function(result){
                    if(!result.$hasError){
                        $modalInstance.close({'showSplit': false,
                                              'ttSplitReturn' : result});
                    }
                })
            }else{
                if(SplitQuestionControl.model.splitDeliveryVendors && !SplitQuestionControl.model.showSplit){
                    purchaseOrderLineFactory.prepareExecuteSplitPurchaseRequisition({purchaseRequisition: parameters['numero-ordem'], 'executeSplit': true}, function(result){
                        if(!result.$hasError){
                            $modalInstance.close({'showSplit': false,
                                                  'ttSplitReturn' : result});
                        }
                    })
                }else if(SplitQuestionControl.model.splitDeliveryVendors && SplitQuestionControl.model.showSplit){
                    $modalInstance.close({'showSplit': true});
                }
            }
        }

        //Método de inicialização
        SplitQuestionControl.init = function () {

            SplitQuestionControl.model = {
                'splitDeliveryVendors' : (parameters && parameters.splitDeliveryVendors)?parameters.splitDeliveryVendors:true,
                'showSplit' : (parameters && parameters.showSplit)?parameters.showSplit:true
            };       

        }

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        SplitQuestionControl.init();
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        $scope.$on('$destroy', function () {
            SplitQuestionControl = undefined;
        });
    }

    // *********************************************************************************
    // *** Controller Tela de Definição do Split
    // *********************************************************************************
    controllerSplitDefine.$inject = ['$scope', '$modalInstance', 'parameters', 'mcc.ccapi352.Factory'];
    function controllerSplitDefine($scope, $modalInstance, parameters, purchaseOrderLineFactory) {
        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
        var SplitDefineControl = this; 
        
        SplitDefineControl.model = {};      
        SplitDefineControl.model['splitPurchaseRequisitionList'] = [];
        // *********************************************************************************
        // *** Functions
        // *********************************************************************************   

        //Aplica as alterações da tela de definição do split   
        SplitDefineControl.apply = function () {
            SplitDefineControl.prepareExecuteSplit('apply');
        }

        //Cancela as alterações da tela de definição do split 
        SplitDefineControl.cancel = function () {
           SplitDefineControl.prepareExecuteSplit('cancel');
        }

        //Executa split conforme ação da tela
        SplitDefineControl.prepareExecuteSplit = function(action){
            if(action == 'cancel' ){
                purchaseOrderLineFactory.prepareExecuteSplitPurchaseRequisition({purchaseRequisition: parameters['numero-ordem'], 'executeSplit': false}, function(result){
                    if(!result.$hasError){
                        $modalInstance.close({'ttSplitReturn' : result});
                    }
                })
            }else{
                purchaseOrderLineFactory.executeSplitPurchaseRequisition({purchaseRequisition: parameters['numero-ordem'], 'executeSplit': true, 'ttSplitPurchRequis' : SplitDefineControl.model.splitPurchaseRequisitionList}, function(result){
                    if(!result.$hasError){
                        $modalInstance.close({'ttSplitReturn' : result});
                    }
                })
            }
        }

        //Método de inicialização
        SplitDefineControl.init = function () {
            SplitDefineControl.model['numero-ordem'] = parameters['numero-ordem'];
            SplitDefineControl.model['qt-solic'] = parameters['qt-solic'];
            SplitDefineControl.model['splitPurchaseRequisitionList'] = parameters.splitPurchaseRequisitionList;

            var param = {};
            param['purchaseRequisition'] = parameters['numero-ordem'];
            param['executeSplit'] = true;
            purchaseOrderLineFactory.prepareSplitPurchaseRequisition(param, function(result){
                SplitDefineControl.model.splitPurchaseRequisitionList = result;

            });

        }

        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            $modalInstance.dismiss('cancel');
        });

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        SplitDefineControl.init();
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
        $scope.$on('$destroy', function () {
            SplitDefineControl = undefined;
        });
    }

    // *********************************************************************************
    // *** Service do módulo de compras
    // *********************************************************************************
    mccService.$inject = ['$rootScope','$modal'];
    function mccService($rootScope, $modal){


       var service = { 
            openDeliveryEditModal : function(params){
                //Abre a modal de edição da entrega
                var instance = $modal.open({
                    templateUrl: '/dts/mcc/html/deliveryschedule/edit/deliveryschedule.edit.html',
                    controller: 'mcc.service.EditDeliveryScheduleCtrl as controller',
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: { 
                        parameters: function () { return params; } 
                    }
                });
                instance.result.then(function (result) {
                    $rootScope.$broadcast("mcc.deliveryschedulechange.event", result);
                }, function () {
                });
            },
            openDeliverySettingsModal : function(params){
                //Abre a modal de configuração das regras das entregas
                var instance = $modal.open({
                    templateUrl: '/dts/mcc/html/deliveryschedule/edit/deliveryschedule.settings.html',
                    controller: 'mcc.service.SettingsDeliveryScheduleCtrl as controller',
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: { 
                        parameters: function () { return params; } 
                    }
                });
                instance.result.then(function (result) {
                    $rootScope.$broadcast("mcc.deliveryschedulerules.event", result);
                }, function () {
                });
            },
            openSplitQuestionModal : function(params){
                //Abre a modal de questionamento do split
                var instance = $modal.open({
                    templateUrl: '/dts/mcc/html/purchaseorderline/edit/purchaseorderline.split.question.html',
                    controller: 'mcc.service.SplitQuestionCtrl as controller',
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: { 
                        parameters: function () { return params; } 
                    }
                });
                instance.result.then(function (result) {
                    $rootScope.$broadcast("mcc.purchasesplitquestion.event", result);
                }, function () {
                });
            },
            openSplitDefineModal : function(params){
                //Abre a modal de definição do split
                var instance = $modal.open({
                    templateUrl: '/dts/mcc/html/purchaseorderline/edit/purchaseorderline.split.define.html',
                    controller: 'mcc.service.SplitDefineCtrl as controller',
                    backdrop: 'static',
                    keyboard: false,
                    size: 'lg',
                    resolve: { 
                        parameters: function () { return params; } 
                    }
                });
                instance.result.then(function (result) {
                    $rootScope.$broadcast("mcc.purchasesplitdefine.event", result);
                }, function () {
                });
            }
        }
        return service;
    }
    index.register.service('mcc.service.mccService', mccService);
    index.register.controller('mcc.service.EditDeliveryScheduleCtrl', controllerDeliveryScheduleEdit);
    index.register.controller('mcc.service.SettingsDeliveryScheduleCtrl', controllerDeliveryScheduleSettings);
    index.register.controller('mcc.service.SplitQuestionCtrl', controllerSplitQuestion);
    index.register.controller('mcc.service.SplitDefineCtrl', controllerSplitDefine);

});