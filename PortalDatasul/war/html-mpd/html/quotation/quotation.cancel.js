/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    modalCancelcontroller.$inject = [
        'mpd.fchdis0067.Factory', 
        'mpd.fchdis0066.Factory', 
        'modalParams', 
        '$modalInstance', 
        'customization.generic.Factory',
        '$filter'];

    function modalCancelcontroller(
        fchdis0067, 
        fchdis0066, 
        modalParams, 
        $modalInstance, 
        customService,
        $filter) {

        var modalCancelcontroller = this;
        var i18n = $filter('i18n');

        this.myParams = angular.copy(modalParams);

        this.showSave = this.myParams.showSave;

        this.motivoCancelamento = '';

        if (this.myParams.tipo == "quotation") {
            modalCancelcontroller.tipo = i18n('l-quotations');
        } else if (this.myParams.tipo == "item") {
            modalCancelcontroller.tipo = i18n('l-cod-item');
        }

        this.dataCancelamento = new Date();

        this.selectMotivo = function () {
            modalCancelcontroller.motivoCancelamento = modalCancelcontroller.codCancela.narrativa;
        }

        this.close = function() {
            $modalInstance.dismiss('cancel');
        }

        this.confirm = function() {

            if (modalCancelcontroller.myParams.tipo == "item") {

                fchdis0067.cancelQuotationItems(
                    {
                        nrPedido: modalCancelcontroller.myParams.nrPedido, 
                    }, {
                        descMotivo: modalCancelcontroller.motivoCancelamento,
                        ttOrderItemsSelected: modalCancelcontroller.myParams.ttOrderItemsSelected
                    }, function(data) {
                        customService.callCustomEvent("cancelOrderItems", {
                            controller:modalCancelcontroller,
                            result: data 
                        });

                        setTimeout(function () {
                            $modalInstance.close('confirm');
                        }, 100);
                    }
                );

            } else if (this.myParams.tipo == "quotation") {

                fchdis0066.cancelQuotation(
                    {
                        nrPedido: modalCancelcontroller.myParams.nrPedido,
                    },{
                        descMotivo: modalCancelcontroller.motivoCancelamento,
                    }, function(data) {
                        customService.callCustomEvent("cancelOrder", {
                            controller:modalCancelcontroller,
                            result: data 
                        });

                        if (!data.$hasError) {
                            setTimeout(function () {
                                $modalInstance.close('confirm');
                            }, 100);
                        }
                    }
                );
            } else if (this.myParams.tipo == "entrega") {
                
                fchdis0067.cancelQuotationItemDeliveries(
                    {
                        nrPedido: modalCancelcontroller.myParams.nrPedido, 
                    }, {
                        descMotivo: modalCancelcontroller.motivoCancelamento,
                        ttOrderDelivery: modalCancelcontroller.myParams.ttOrderDelivery
                    }, function(data) {
                        customService.callCustomEvent("cancelQuotationItemDeliveries", {
                            controller:modalCancelcontroller,
                            result: data 
                        });
                        
                        setTimeout(function () {
                            $modalInstance.close('confirm');
                        }, 100);
                    }
                ); 
            }
        };
    }

    index.register.controller('salesorder.portalQuotationCancel.Controller', modalCancelcontroller);

});
