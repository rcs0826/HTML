define([
	'index',
    '/dts/mcc/js/zoom/ordem-compra.js',
    '/dts/mcc/js/zoom/comprador.js',
    '/dts/mpd/js/zoom/emitente.js',
    '/dts/mpd/js/zoom/mensagem.js',
    '/dts/mcc/js/api/ccapi362.js',    
    '/dts/mcc/js/mcc-utils.js',
    '/dts/mcc/html/requestquotation/modal/requestquotation.sendedquotation.order.crtl.js',
    '/dts/mcc/html/requestquotation/modal/requestquotation.configemail.vendor.crtl.js',
    '/dts/mcc/html/requestquotation/modal/requestquotation.sending.confirm.crtl.js',
    '/dts/mcc/html/requestquotation/modal/requestquotation.configemail.crtl.js',
    '/dts/mcc/html/requestquotation/modal/requestquotation.vendors.order.crtl.js'
], function(index) {

    // **************************************************************************************
	// *** CONTROLLER - EDIT
	// **************************************************************************************	
	requestQuotationEditController.$inject = ['$rootScope', '$totvsresource','$scope', '$timeout', '$totvsprofile', '$state', '$window', '$stateParams', 'totvs.app-main-view.Service', 'TOTVSEvent', 'mcc.ccapi362.Factory','mcc.utils.Service','mcc.requestquotation.modal.ModalVendorsOrder','mcc.requestquotation.modal.ModalSendedQuotation', 'mcc.requestquotation.modal.ModalConfigVendorEmail', 'mcc.requestquotation.modal.ModalConfirmSending', 'mcc.requestquotation.modal.ModalConfigEmail', '$location', '$q'];
	function requestQuotationEditController($rootScope, $totvsresource, $scope, $timeout, $totvsprofile, $state, $window, $stateParams, appViewService, TOTVSEvent, ccapi362, serviceUtils, modalVendorsOrder, modalSendedQuotation, modalConfigVendorEmail, modalConfirmSending, modalConfigEmail, $location, $q) {
        var ctrl = this;
        ctrl.model = {};
	    ctrl.model['ttClicbusinessIntegration'] = {};
        ctrl.model['ttClicbusinessIntegration']['param-clic'] = true;
        ctrl.statusClass = "status-1";
        ctrl.suggestVendorRelated = true;
        ctrl.purchaseorderlineAdd = "";
        ctrl.enableSendButton = false;
        ctrl.enableAnswersQuotationButton = false;
        ctrl.previusState = "";
        ctrl.valorcomprador = "";
        
        /*****
        ** Fun????o de busca de do usu??rio
        ** username: Nome do usu??rio logado        
        **************************/
        ctrl.getUser =  function (Username,email) { 
            
            var resource = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi358/return_user?&username='+Username +'&email='+email, {}, { 
                DTSGet: { 
                    method: 'get',
                    isArray: true
                }
            });
            
            if (Username && !(Username instanceof Object)) {
                return resource.TOTVSGet({
                    REST_user: Username,
                    //: init ? init.gotomethod : undefined
                }, undefined, {noErrorMessage: true}, true);              
            }            
        };

        /*****
        ** Fun????o de chamada asincrona para buscar usu??rio        
        **************************/
        ctrl.asyncUserCall = function () {
            return $q(function(resolve, reject) {
                setTimeout(function() {
                    resolve(ctrl.getUser($rootScope.currentuser.username, $rootScope.currentuser.email));            
                }, 1000);
            });
        };

        
        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************   

        // # Purpose: M??todo de inicializa????o
        // # Parameters: 
        // # Notes: 
        ctrl.init = function() {
            createTab = appViewService.startView($rootScope.i18n('l-quotation-process-plural', [], 'dts/mcc'), 'mcc.requestquotation.EditCtrl', ctrl);
            
            if (ctrl.previusState == "") {
                ctrl.previusState = appViewService.previousView.name.toLowerCase();
            }
            
            gridVendorsOrder = [];
            
            ctrl.isUpdate = $state.is('dts/mcc/requestquotation.edit');
           
            if(appViewService && appViewService.lastAction && appViewService.lastAction == "changetab" 
                && appViewService.previousView.name.toLowerCase().indexOf("dts/mcc/requestquotation") == -1
                && appViewService.previousView.name.toLowerCase().indexOf("dts/mcc/purchaseorderline.start") == -1){
                return;
            }

            /* REMOVIDO DA PRIMEIRA VERS??O A SER DISPONIBILIZADA*/
            //busca informa????es da integra????o com o Clicbusiness
            //ctrl.clicbusinessIntegration();
                        
            // se houver parametros na URL
            processId = ($stateParams && $stateParams.id)?$stateParams.id:0;
            if (ctrl.isUpdate) {
                ctrl.loadUpdate(processId);               
            }else{ // se n??o, inicia com o model em branco (inclus??o)              
                ctrl.loadNew(); //busca os valores defaults para cria????o do registro.
            }

            var promise = ctrl.asyncUserCall();    
            promise.then(function(sucess) {                        
                ctrl.valorcomprador = sucess.REST_user;                
            }, function(fail) {
                ctrl.valorcomprador = "";                
            });

            ctrl.purchaseorderlineAdd  = undefined;
            ctrl.purchaseorderlineZoom = undefined;
        }

        // # Purpose: M??todo que busca informa????es sobre a integra????o com o clicbusiness
        // # Parameters: 
        // # Notes: 
        ctrl.clicbusinessIntegration = function(){
            ccapi362.returnIntegrationClicbusiness(function(result){
                if(result && result.length > 0){
                    ctrl.model.ttClicbusinessIntegration = result[0];
                    ctrl.model['clicbusinessVisible'] = ctrl.model.ttClicbusinessIntegration['visivel-clic'];
                }
            });
        }

        // # Purpose: M??todo que busca as informa????es padr??es para a cria????o de uma nova solicita????o
        // # Parameters: 
        // # Notes: 
        ctrl.loadNew = function(){
            /*Tratamento quando a tela ?? aberta pela listagem de ordens. 
              As ordens selecionadas ser??o automaticamente vinculadas ao novo processo de cota????o*/
            var ttPurchaseOrderlinesList = [];
            if($rootScope.mccPurchaseOrderLines){
                ctrl.openedByPurchaseOrderLines = (($rootScope.mccPurchaseOrderLines).length > 0);
                for (var i = ($rootScope.mccPurchaseOrderLines).length - 1; i >= 0; i--) {
                    ttPurchaseOrderlinesList.push({'numero-ordem': ($rootScope.mccPurchaseOrderLines[i])});
                }
            }
            
            $rootScope.mccPurchaseOrderLines = null;
            
            ccapi362.getNewQuotationProcess({}, ttPurchaseOrderlinesList, function(result){
                ctrl.afterGetData(result);
            });
        }

        
        // # Purpose: M??todo que busca as informa????es de um processo de cota????o
        // # Parameters: 
        // #     quotationProcessCode: C??digo do processo de cota????o
        // # Notes: 
        ctrl.loadUpdate = function(quotationProcessCode){
            ccapi362.getQuotationProcess({'pQuotationProcessNumber' : quotationProcessCode}, function(result){
                ctrl.afterGetData(result);
            });
        }
        
        // # Purpose: M??todo executado ap??s a busca das informa????es
        // # Parameters: 
        // #     result: Dados retornados dos m??todos de busca
        // # Notes: 
        ctrl.afterGetData = function(result){
            ctrl.enableAnswersQuotationButton = false;
            
            if(result){
                ctrl.model.ttQuotationProcess = result['ttQuotationProcess'][0];
                ctrl.model.ttPurchRequisitionInfo = result['ttPurchRequisitionInfo'];
                ctrl.model.ttVendorList = result['ttVendorList'];

                ctrl.statusClass = "status-"+ctrl.model.ttQuotationProcess['situacao'];
                for (var i = ctrl.model.ttPurchRequisitionInfo.length - 1; i >= 0; i--) {
                    ctrl.model.ttPurchRequisitionInfo[i]['itemStatusClass'] = "status-item-" + ctrl.model.ttPurchRequisitionInfo[i]['situacao-solic'];
                    
                    if (ctrl.model.ttPurchRequisitionInfo[i]['situacao-solic'] != 1 &&
                        ctrl.model.ttPurchRequisitionInfo[i]['situacao-solic'] != 2) {
                        ctrl.enableAnswersQuotationButton = true;
                    }
                }
                
                //Habilita bot??o de envio se existirem ordens no processo
                ctrl.enableSendButton = (ctrl.model.ttPurchRequisitionInfo.length > 0); 
               
                //Tratamento dos campos datetime
                ctrl.model.ttQuotationProcess['dtm-expirac'] = serviceUtils.millisToUTCDate(ctrl.model.ttQuotationProcess['dtm-expirac']);
                ctrl.model.ttQuotationProcess['dtm-liber'] = serviceUtils.millisToUTCDate(ctrl.model.ttQuotationProcess['dtm-liber']);
				ctrl.model.ttQuotationProcess['dtm-criac'] = serviceUtils.millisToUTCDate(ctrl.model.ttQuotationProcess['dtm-criac']);
                
                $location.path('dts/mcc/requestquotation/edit/' + ctrl.model.ttQuotationProcess['cdd-solicit']);
            }
        }

		// # Purpose: M??todo que grava as informa????es de um processo de cota????o no banco
        // # Parameters: 
        // # Notes: 
        ctrl.onSave = function(){
            // verificar se o formulario tem dados invalidos
            if (ctrl.isInvalidForm()) { return; }
            
            ccapi362.saveQuotationProcess({},{'pcAction' : 'UPDATE',
                                              'ttQuotationProcess' : ctrl.model.ttQuotationProcess}, function(result){
                if(!result['$hasError']){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-quotation-process', [], 'dts/mcc'),
                        detail: $rootScope.i18n('l-quotation-process', [], 'dts/mcc') + ': ' + result['pQuotationProcessNumber'] + ', ' +
                        (ctrl.isUpdate ? $rootScope.i18n('l-success-updated', [], 'dts/mcc') : $rootScope.i18n('l-success-created', [], 'dts/mcc')) + '!'
                    });
                    $location.path('dts/mcc/requestquotation/edit/' + result['pQuotationProcessNumber']);
                }
            });
        }
        
        // # Purpose: Envia as ordens do processo de cota????o para os fornecedores
        // # Parameters: 
        // # Notes: 
        ctrl.onSendRequest = function(){
            if(ctrl.enableSendButton){
                params = {suggestVendorRelated : ctrl.suggestVendorRelated, //Sugere fornecedor relacionado ao item
                        quotationProcessNumber : ctrl.model.ttQuotationProcess['cdd-solicit']}; //processo de cota????o

                var modalInstance = modalConfirmSending.open(params).then(function(result) {
                    ctrl.loadUpdate(ctrl.model.ttQuotationProcess['cdd-solicit']);
                });
            }
        }
        
        // # Purpose: Apresenta a tela com as respostas de cota????o para o processo
        // # Parameters: 
        // # Notes:
        ctrl.onQuotationsAnswersProcess = function(){ 
            if (ctrl.enableAnswersQuotationButton) {
                var quoteParams = {};
                quoteParams.processNumber   = ctrl.model.ttQuotationProcess['cdd-solicit'];
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
            }
        };

        // # Purpose: M??todo respons??vel por chamar o m??todo para salvar os dados no banco
        // # Parameters: 
        // # Notes: Este m??todo ?? chamado na atualiza????o dos campos da tela.
        ctrl.updateEditable = function(){
            setTimeout(function(){
                ctrl.onSave();
            }, 10);
        }

        // # Purpose: M??todo para verificar se o formulario ?? v??lido
        // # Parameters: 
        // # Notes: 
        ctrl.isInvalidForm = function() {            
            var messages = [];
            var isInvalidForm = false;
            
            var requireLabels = {
                'cod-usuar-solic' : 'l-buyer',
            }
            for (var field in requireLabels) {
                if (!ctrl.model.ttQuotationProcess[field] || 
                    ctrl.model.ttQuotationProcess[field].length == 0) {
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

        // ***************************************************************************
        //                  M??todos da listagem de Ordens
        // ***************************************************************************

        // # Purpose: Adiciona ordem de compra na lista de itens do processo de cota????o 
        // # Parameters: 
        // # Notes: 
        ctrl.addPurchaseOrderline = function(){
            if(ctrl.purchaseorderlineAdd){
                var ttPurchaseOrderlinesList = [];
                /*Se for selecionado mais de uma ordem retornar?? um objeto com um array de ordens*/
                if(ctrl.purchaseorderlineAdd instanceof Object){
                    if (ctrl.purchaseorderlineAdd.objSelected){
                        for (var i = 0; i < ctrl.purchaseorderlineAdd.objSelected.length; i++) {
                            ttPurchaseOrderlinesList.push({'numero-ordem': ctrl.purchaseorderlineAdd.objSelected[i]['numero-ordem']});
                        }
                    }else{
                        ttPurchaseOrderlinesList.push({'numero-ordem': ctrl.purchaseorderlineAdd['numero-ordem']});
                    }
                }else{
                    ttPurchaseOrderlinesList.push({'numero-ordem': ctrl.purchaseorderlineAdd});
                }

                /*Verifica se j?? existe a ordem na lista de ordens*/
                for (var i = ttPurchaseOrderlinesList.length - 1; i >= 0; i--) {
                    for (var j = ctrl.model.ttPurchRequisitionInfo.length - 1; j >= 0; j--) {
                        if(ttPurchaseOrderlinesList[i] && 
                           ctrl.model.ttPurchRequisitionInfo[j]['numero-ordem'] == 
                           ttPurchaseOrderlinesList[i]['numero-ordem']){
                            /*Se j?? estiver vinculada remove do array*/
                            ttPurchaseOrderlinesList.splice(i, 1);
                        }
                    }
                }

                /* Executa m??todo de vincula????o das ordens ao processo de cota????o*/
                if(ttPurchaseOrderlinesList.length > 0){

                    var params = {'pQuotationProcessNumber' : (ctrl.model.ttQuotationProcess['cdd-solicit']), //n??mero do processo
                              'ttPurchaseOrderlinesList' : ttPurchaseOrderlinesList}; // lista de ordens a serem vinculadas
                       
                    ccapi362.linkOrderlinesToQuotationProcess({}, params, function(result){
                        if(!result['$hasError']){
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type: 'success',
                                title: $rootScope.i18n('l-quotation-process', [], 'dts/mcc'),
                                detail: $rootScope.i18n('l-quotation-process', [], 'dts/mcc') + ': ' + ctrl.model.ttQuotationProcess['cdd-solicit'] + ', ' +
                                (ctrl.isUpdate ? $rootScope.i18n('l-success-updated', [], 'dts/mcc') : $rootScope.i18n('l-success-created', [], 'dts/mcc')) + '!'
                            });
                        }
                        // Carrega a tela novamente com o que foi gravado
                        ctrl.loadUpdate(ctrl.model.ttQuotationProcess['cdd-solicit']); 
                        ctrl.purchaseorderlineAdd = undefined;
                    });
                }
                
            }else{
                //Mensagem ordem n??o informada
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error', // tipo de notifica????o
                    title: $rootScope.i18n('l-attention', [], 'dts/mcc'), // titulo da notifica????o
                    detail: $rootScope.i18n('l-select-at-least-one-item', [], 'dts/mcc') // detalhe da notifica????o
                });   
            }
            ctrl.purchaseorderlineAdd = undefined;
        }

        // # Purpose: Questionar ao usu??rio se ele deseja replicar a altera????o para todas as ordens do processo
        // # Parameters:         
        // # Notes: 
        ctrl.onChangeSuggestVendorRelated = function(){

            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // t??tulo da mensagem
                text: $rootScope.i18n('l-confirm-suggest-vendors-all-orders-msg', [], 'dts/mcc'), // texto da mensagem
                cancelLabel: 'l-no', // label do bot??o cancelar
                confirmLabel: 'l-yes', // label do bot??o confirmar
                callback: function(isPositiveResult) { // fun????o de retorno
                    if (isPositiveResult) { // se foi clicado o bot??o confirmar
                        ccapi362.saveItemFornecByProcessQuotation({},{'pQuotationProcessNumber' : ctrl.model.ttQuotationProcess['cdd-solicit'],
                                                                      'pOnlyVendorItem' : ctrl.suggestVendorRelated}, function(result){});      
                    }                        
                }
            });
        };

        // # Purpose: Envia a solicita????o de cota????o
        // # Parameters: 
        // #     orderlineNumber: N??mero da ordem de compra
        // # Notes: 
        ctrl.onSendQuotation = function(orderlineNumber){};

        // # Purpose: Abre tela de fornecedores da ordem de compra
        // # Parameters: 
        // #     purchaseOrderNumber: N??mero da ordem de compra
        // # Notes: 
        ctrl.onOrderVendors = function(purchaseOrderNumber){
            params = {purchaseOrderNumber : purchaseOrderNumber, //n??mero da ordem
                      suggestVendorRelated : ctrl.suggestVendorRelated, // paramtetro sugere item x fornec
                      cddSolicit : ctrl.model.ttQuotationProcess['cdd-solicit']} //n??mero do processo

            var modalInstance = modalVendorsOrder.open(params).then(function(result) {});
        };

        // # Purpose: Efetua a desvincula????o da ordem
        // # Parameters: 
        // #     orderlineNumber: N??mero da ordem de compra
        // # Notes:
        ctrl.onUnlinkOrderLine = function(orderlineNumber){
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // t??tulo da mensagem
                text: $rootScope.i18n('l-delete-link-order-line-quotation-process-msg', [], 'dts/mcc'), // texto da mensagem
                cancelLabel: 'l-no', // label do bot??o cancelar
                confirmLabel: 'l-yes', // label do bot??o confirmar
                callback: function(isPositiveResult) { // fun????o de retorno
                    if (isPositiveResult) { // se foi clicado o bot??o confirmar

                        //Valida se a ordem pode ser desvinculada, 
                        ccapi362.validateDeleteQuotationProcessItem({'pQuotationProcessNumber' : ctrl.model.ttQuotationProcess['cdd-solicit'], 
                                                                     'pOrderLineNumber' : orderlineNumber}, function(result){
                            if(!result['$hasError']){
                                //caso n??o tenha resposta de cota????o mas j?? tenha sido enviada a fornecedores questiona se deseja prosseguir
                                if (result['plQuotationProcessSent']){
                                    $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                                        title: 'l-question', // t??tulo da mensagem
                                        text: $rootScope.i18n('l-order-line-sent-confirm-delete-msg', [], 'dts/mcc'), // texto da mensagem
                                        cancelLabel: 'l-no', // label do bot??o cancelar
                                        confirmLabel: 'l-yes', // label do bot??o confirmar
                                        callback: function(isPositiveResult) { // fun????o de retorno
                                            if (isPositiveResult) { // se foi clicado o bot??o confirmar
                                                ctrl.deleteQuotationProcessItem(ctrl.model.ttQuotationProcess['cdd-solicit'],
                                                                                orderlineNumber);
                                            }
                                        }
                                    });
                                }else{
                                    ctrl.deleteQuotationProcessItem(ctrl.model.ttQuotationProcess['cdd-solicit'],
                                                                    orderlineNumber);
                                }
                            }
                            
                        });
                    }
                }
            });
        };

        // # Purpose: Elimina o relacionamento da ordem de compra com o processo de cota????o ap??s valida????es
        // # Parameters: 
        // #     quotationProcessNumber: N??mero do processo de cota????o
        // #     orderlineNumber: N??mero da ordem de compra
        // # Notes:
        ctrl.deleteQuotationProcessItem = function(quotationProcessNumber, orderlineNumber){
            ccapi362.unlinkOrderLineFromQuotationProcess({'pQuotationProcessNumber' : quotationProcessNumber, 
                                                          'pOrderLineNumber' : orderlineNumber},function(result){
                if(!result['$hasError']){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-quotation-process', [], 'dts/mcc'),
                        detail: $rootScope.i18n('l-quotation-process', [], 'dts/mcc') + ': ' + quotationProcessNumber + ', ' +
                        (ctrl.isUpdate ? $rootScope.i18n('l-success-updated', [], 'dts/mcc') : $rootScope.i18n('l-success-created', [], 'dts/mcc')) + '!'
                    });
                    ctrl.loadUpdate(ctrl.model.ttQuotationProcess['cdd-solicit']);
                }
            })
        }

        // # Purpose: Apresenta as respostas dessa ordem
        // # Parameters: 
        // #     orderlineNumber: N??mero da ordem de compra
        // # Notes:
        ctrl.onAnswersOrder = function(orderlineNumber){};

        // # Purpose: Apresenta a tela com as situa????es dos envios
        // # Parameters: 
        // #     orderlineNumber: N??mero da ordem de compra
        // # Notes:
        ctrl.onSolicitationsOrder = function(orderlineNumber){
            params = {purchOrderLineNumber : orderlineNumber, //n??mero da ordem
                      cddSolicit : ctrl.model.ttQuotationProcess['cdd-solicit']} //n??mero do processo

            var modalInstance = modalSendedQuotation.open(params).then(function(result) {});
        };

        // # Purpose: Apresenta a tela com as respostas de cota????o para a ordem
        // # Parameters: 
        // #     orderlineNumber: N??mero da ordem de compra
        // # Notes:
        ctrl.onQuotationAnswers = function(orderlineNumber){ 
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
            $location.path('dts/mcc/quotation/');   
        };

        // ***************************************************************************
        //                  M??todos da listagem de Fornecedores
        // ***************************************************************************

        // # Purpose: Adiciona fornecedores ao processo de cota????o 
        // # Parameters: 
        // # Notes: 
        ctrl.addVendor = function(){            
            if(ctrl.model && ctrl.model.ttCotacaoItem && ctrl.model.ttCotacaoItem['cod-emitente']){
                
                ccapi362.linkVendorsToQuotationProcess({'pQuotationProcessNumber' : ctrl.model.ttQuotationProcess['cdd-solicit'], 
                                                        'pVendorNumber' : ctrl.model.ttCotacaoItem['cod-emitente']},function(result){
                    if(!result['$hasError']){
                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type: 'success',
                            title: $rootScope.i18n('l-msg-vendor-linked-sucess', [], 'dts/mcc'),
                            detail: $rootScope.i18n('l-msg-vendor-linked-sucess', [], 'dts/mcc')
                        });
                        ctrl.model.ttCotacaoItem['cod-emitente'] = "";
                        ctrl.loadUpdate(ctrl.model.ttQuotationProcess['cdd-solicit']);
                    }
                });
            }
        };

        // # Purpose: Busca fornecedores do Clicbusiness
        // # Parameters: 
        // # Notes: 
        ctrl.searchVendorClicbusiness = function(){};
        
        // # Purpose: Desvincula o fornecedor do Processo de Cota????o
        // # Parameters: 
        // #     vendorObj: Objeto com as informa????es do fornecedor
        // # Notes: 
        ctrl.onUnlinkVendor = function(vendorObj){
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question', // t??tulo da mensagem
                text: $rootScope.i18n('l-delete-link-vendor-quotation-process-msg', [], 'dts/mcc'), // texto da mensagem
                cancelLabel: 'l-no', // label do bot??o cancelar
                confirmLabel: 'l-yes', // label do bot??o confirmar
                callback: function(isPositiveResult) { // fun????o de retorno
                    if (isPositiveResult) { // se foi clicado o bot??o confirmar
                        //Valida se a ordem pode ser desvinculada, 
                        ccapi362.unlinkVendorFromQuotationProcess({'pQuotationProcessNumber' : ctrl.model.ttQuotationProcess['cdd-solicit'], 
                                                                   'pVendorCode' : vendorObj['cod-emitente']}, function(result){
                            if(!result['$hasError']){
                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success',
                                    title: $rootScope.i18n('l-quotation-process', [], 'dts/mcc'),
                                    detail: $rootScope.i18n('l-quotation-process', [], 'dts/mcc') + ': ' + ctrl.model.ttQuotationProcess['cdd-solicit'] + ', ' +
                                    (ctrl.isUpdate ? $rootScope.i18n('l-success-updated', [], 'dts/mcc') : $rootScope.i18n('l-success-created', [], 'dts/mcc')) + '!'
                                });
                                ctrl.loadUpdate(ctrl.model.ttQuotationProcess['cdd-solicit']);
                            }
                            
                        });
                    }
                }
            });
        }

        // # Purpose: Configurar e-mail (Cabe??alho)
        // # Parameters: 
        // # Notes: 
        ctrl.onConfigureEmailHeader = function(){};

        // # Purpose: Imprime planilha das ordens vinculadas a solicita????o de cota????o sem fornecedores
        // # Parameters: 
        // # Notes: 
        ctrl.onPrintSpreadsheetHeader = function(){
            ccapi362.printSpreadSheetWithoutVendor({'pQuotationProcessNumber' : ctrl.model.ttQuotationProcess['cdd-solicit']},function(result){
                if(!result['$hasError']){
                    var cFile = "";
                    if(result && result.cFile)
                        cFile = result.cFile;
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-file-successfully-generated', [], 'dts/mcc'),
                        detail: cFile
                    });
                }
            });
        };

        // # Purpose: Imprime planilha de cota????o 
        // #          com as informa????es do fornecedor
        // # Parameters: 
        // #     vendorObj: Objeto com as informa????es do fornecedor
        // # Notes: 
        ctrl.onPrintSpreadsheet = function(vendorObj){
            ccapi362.printSpreadSheetWithVendor({'pQuotationProcessNumber' : ctrl.model.ttQuotationProcess['cdd-solicit'],
                                                 'pVendorCode' : vendorObj['cod-emitente'],
                                                 'pSuggestVendorRelated' : ctrl.suggestVendorRelated}, //Sugere fornecedor relacionado ao item
                                                 function(result){
                if(!result['$hasError']){
                    var cFile = "";
                    if(result && result.cFile)
                        cFile = result.cFile;
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-file-successfully-generated', [], 'dts/mcc'),
                        detail: cFile
                    });
                }
            });
        }

        // # Purpose: Abrir portal de compras
        // # Parameters: 
        // # Notes: 
        ctrl.onPurchasePortal = function(){};
        
        // # Purpose: Configura informa????es de envio de e-mail para o fornecedor
        // # Parameters: 
        // #     vendorObj: Objeto com as informa????es do fornecedor
        // # Notes: 
        ctrl.onConfigureEmail = function(vendorObj){
            params = {vendorNumber : vendorObj['cod-emitente'], //c??digo do fornecedor
                      cddSolicit : ctrl.model.ttQuotationProcess['cdd-solicit']}; //processo de cota????o

            var modalInstance = modalConfigVendorEmail.open(params).then(function(result) {
                ctrl.loadUpdate(ctrl.model.ttQuotationProcess['cdd-solicit']);
            });
        }

        // # Purpose: Configura informa????es de envio de e-mail do cabe??alho
        // # Parameters: 
        // # Notes: 
        ctrl.onConfigureEmailHeader = function(){
            params = {cddSolicit : ctrl.model.ttQuotationProcess['cdd-solicit']}; //processo de cota????o

            var modalInstance = modalConfigEmail.open(params).then(function(result) {});
        }

        // # Purpose: Tratamento quando tecla ?? acionada 
        // #          no campo de ordem de compra
        // # Parameters: 
        // #     event: Conte??do do evento keyPress
        // # Notes: 
        ctrl.onKeyPressOrderLine = function(event){
            event.stopImmediatePropagation();

            //quando acionado o enter a regra do bot??o vincular deve ser executada
            if(event.which === 13){ //Enter
                event.preventDefault();
                ctrl.addPurchaseOrderline();
            }
            return false;
        }

        // # Purpose: Executado ao alterar o conte??do do campo ordem-compra
        // # Parameters: 
        // # Notes: Utilizado para controlar o valor do campo quando o usu??rio limpa o valor, ou altera manualmente
        ctrl.onChangeOrderlineAux = function(){
            if(ctrl.purchaseorderlineZoom && ctrl.purchaseorderlineZoom['numero-ordem'] && ctrl.purchaseorderlineZoom['numero-ordem'] != ctrl.purchaseorderlineAdd){
                ctrl.purchaseorderlineAdd = ctrl.purchaseorderlineZoom['numero-ordem'];
            }
        }

        // # Purpose: Executado ao alterar manualmente o valor do campo ordem-compra
        // # Parameters: 
        // # Notes: ao alterar o campo manualmente, zera o valor selecionado no zoom para que o campo "Selecionados" do zoom n??o fique errado
        ctrl.onChangeOrderlineField = function(){
            if(ctrl.purchaseorderlineAdd == null || ctrl.purchaseorderlineAdd == undefined || ctrl.purchaseorderlineAdd == ""){
                ctrl.purchaseorderlineZoom = undefined;
            }else{
                if(ctrl.purchaseorderlineZoom && ctrl.purchaseorderlineZoom['numero-ordem'] && ctrl.purchaseorderlineZoom['numero-ordem'] != ctrl.purchaseorderlineAdd){
                    ctrl.purchaseorderlineZoom = undefined;
                }
            }            
        }
        
        // # Purpose: Executado ao selecionar registros no zoom de ordem e confirmar
        // # Parameters: 
        // #     selected: registro selecionado
        // # Notes: 
        ctrl.onChangeOrderline = function(selected){
            if (selected.objSelected){
                ctrl.purchaseorderlineAdd = selected;
            }else{
                if(selected['numero-ordem']){
                    ctrl.purchaseorderlineAdd = selected['numero-ordem'];
                }
            }
        }
        // # Purpose: Fechar a tela de inclus??o/Edi????o
        // # Parameters: 
        // # Notes: 
        ctrl.onCancel = function(){
            if(ctrl.openedByPurchaseOrderLines){
                appViewService.removeView(appViewService.getPageActive());
                $state.go(ctrl.previusState);
            }else{
                $state.go('dts/mcc/requestquotation.start');
            }
        }
	
         // se o contexto da aplica????o j?? carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { ctrl.init(); }
         
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
         
        // # Purpose: cria um listerner de evento para inicializar o 
        // #          controller somente depois de inicializar o contexto da aplica????o.
        // # Parameters: 
        // # Notes: 
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            ctrl.init();
        });    

        // # Purpose: Limpa vari??vel com o controller
        // # Parameters: 
        // # Notes: 
         $scope.$on('$destroy', function () {
            ctrl = undefined;
        });

    }

    // *********************************************************************************
    // *** Modal Fornecedores
    // *********************************************************************************
    modalVendorsOrder.$inject = ['$modal'];
    function modalVendorsOrder ($modal) {
    
        this.open = function (params) {         
            var instance = $modal.open({
                templateUrl: '/dts/mcc/html/requestquotation/modal/requestquotation.vendors.order.html',
                controller: 'mcc.requestquotation.modal.VendorsOrderCtrl as controller',
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
    // *** Modal Solicita????es enviadas
    // *********************************************************************************
    modalSendedQuotation.$inject = ['$modal'];
    function modalSendedQuotation ($modal) {
    
        this.open = function (params) {   
            var instance = $modal.open({
                templateUrl: '/dts/mcc/html/requestquotation/modal/requestquotation.sendedquotation.order.html',
                controller: 'mcc.requestquotation.modal.SendedQuotationCtrl as controller',
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
    // *** Modal Configura????o de E-mail por fornecedor
    // *********************************************************************************
    modalConfigVendorEmail.$inject = ['$modal'];
    function modalConfigVendorEmail ($modal) {
    
        this.open = function (params) {   
            var instance = $modal.open({
                templateUrl: '/dts/mcc/html/requestquotation/modal/requestquotation.configemail.vendor.html',
                controller: 'mcc.requestquotation.modal.ConfigVendorEmailCtrl as controller',
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
    // *** Modal Confirma????o de Envio
    // *********************************************************************************
    modalVendorsOrder.$inject = ['$modal'];
    function modalConfirmSending ($modal) {
    
        this.open = function (params) {         
            var instance = $modal.open({
                templateUrl: '/dts/mcc/html/requestquotation/modal/requestquotation.sending.confirm.html',
                controller: 'mcc.requestquotation.modal.ConfirmSendingCtrl as controller',
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
    // *** Modal Configura????o de E-mail gen??rica
    // *********************************************************************************
    modalConfigVendorEmail.$inject = ['$modal'];
    function modalConfigEmail ($modal) {
    
        this.open = function (params) {   
            var instance = $modal.open({
                templateUrl: '/dts/mcc/html/requestquotation/modal/requestquotation.configemail.html',
                controller: 'mcc.requestquotation.modal.ConfigEmailCtrl as controller',
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

    index.register.controller('mcc.requestquotation.EditCtrl', requestQuotationEditController);
    index.register.service('mcc.requestquotation.modal.ModalVendorsOrder', modalVendorsOrder);
    index.register.service('mcc.requestquotation.modal.ModalSendedQuotation', modalSendedQuotation);
    index.register.service('mcc.requestquotation.modal.ModalConfigVendorEmail', modalConfigVendorEmail);
    index.register.service('mcc.requestquotation.modal.ModalConfirmSending', modalConfirmSending);
    index.register.service('mcc.requestquotation.modal.ModalConfigEmail', modalConfigEmail);
});
