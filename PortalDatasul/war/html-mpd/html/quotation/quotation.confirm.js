/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    modalConfirmQuotationcontroller.$inject = [
        'mpd.fchdis0067.Factory', 
        'mpd.fchdis0066.Factory', 
        'modalParams', 
        '$modalInstance', 
        'customization.generic.Factory',
        '$filter',
        '$scope',
        '$rootScope',
        'TOTVSEvent'];

    function modalConfirmQuotationcontroller(
        fchdis0067, 
        fchdis0066, 
        modalParams, 
        $modalInstance, 
        customService,
        $filter,
        $scope,
        $rootScope,
        TOTVSEvent) {

        var controller = this;        
        controller.order = angular.copy(modalParams.order);
        controller.bussinessContexts =  modalParams.bussinessContexts;
        controller.validationLoaded = false;

        controller.customerWithNumber = controller.order['cod-emitente'] + ' - ' + controller.order['nome-abrev']
        
        var params = {
            nrPedido: controller.order['nr-pedido'],
        };

        fchdis0066.validQuotation(params, function (data) {
            controller.newNrPedCli = data.nrPedido;
            controller.selfNrPedido = angular.copy(data.nrPedido);
            controller.validInvoiceExport = data.validInvoiceExport;
            controller.nrInvoiceExport = data.nrInvoiceExport; 
            controller.validationLoaded = true;

        });

        this.close = function() {
            $modalInstance.dismiss('cancel');
        }

        this.confirm = function() {

            if (!controller.newNrPedCli) {
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    title: $rootScope.i18n('l-warning'),
                    detail: $rootScope.i18n('msg-inform-the-customer-order') + '.',
                    type: 'warning',
                });
            } else {
                if (controller.validInvoiceExport && !controller.nrInvoiceExport) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        title: $rootScope.i18n('l-warning'),
                        detail: $rootScope.i18n('msg-inform-export-process') + '.',
                        type: 'warning',
                    });
                } else {

                    if(!controller.nrInvoiceExport){
                        controller.nrInvoiceExport = " ";
                    }

                    var paramsProcessQuotation = {
                        nrCotac: controller.order['nr-pedido'],
                        nrPedido: controller.selfNrPedido,
                        nrPedidoCliente: controller.newNrPedCli,
                        nrInvoiceExport: controller.nrInvoiceExport,
                        validExport: controller.validInvoiceExport
                    };

                    fchdis0066.process(paramsProcessQuotation, function (result) {
                        if (!result.$hasError) {

                            if (controller.bussinessContexts) {
                                if(controller.bussinessContexts.getContextData('selected.sales.order').orderId == controller.order['nr-pedido']) {
                                    controller.bussinessContexts.removeContext('selected.sales.order');
                                }
                            }

                            $modalInstance.close('confirm');
                        }
                    });

                }
            }
        };

        this.validatorNrPedCli = function(){
            if(controller.newNrPedCli){
                if(controller.newNrPedCli.length > 12){
                    controller.newNrPedCli = controller.newValue;
                }else{
                    controller.newValue = controller.newNrPedCli;
                }
            }
		};

        this.validatorExportProcess = function(){
            if(controller.nrInvoiceExport){
                if(controller.nrInvoiceExport.length > 12){
                    controller.nrInvoiceExport = controller.newValue;
                }else{
                    controller.newValue = controller.nrInvoiceExport;
                }
            }
		};

    }

    index.register.controller('salesorder.portalQuotationConfirm.Controller', modalConfirmQuotationcontroller);

});
