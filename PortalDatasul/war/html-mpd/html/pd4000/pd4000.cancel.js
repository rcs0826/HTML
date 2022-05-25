/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    modalCancelcontroller.$inject = [
        'mpd.fchdis0051.Factory', 
        'modalParams', 
        '$modalInstance', 
        'customization.generic.Factory',
        '$filter'];

    function modalCancelcontroller(
        fchdis0051, 
        modalParams, 
        $modalInstance, 
        customService,
        $filter) {

        var modalCancelcontroller = this;
        var i18n = $filter('i18n');

        this.myParams = angular.copy(modalParams);

        this.showSave = this.myParams.showSave;

        this.motivoCancelamento = '';

        if (this.myParams.tipo == "order") {
            modalCancelcontroller.tipo = i18n('Pedido');
        } else if (this.myParams.tipo == "item") {
            modalCancelcontroller.tipo = i18n('Item');
        } else if (this.myParams.tipo == "entrega") {
            modalCancelcontroller.tipo = i18n('Entrega');
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

                fchdis0051.cancelOrderItems(
                    {
                        nrPedido: modalCancelcontroller.myParams.nrPedido, 
                    }, {
                        codMotivo: modalCancelcontroller.codCancela['cod-motivo'],
                        descMotivo: modalCancelcontroller.motivoCancelamento,
                        dtCancela: modalCancelcontroller.dataCancelamento,
                        ttOrderItemsSelected: modalCancelcontroller.myParams.ttOrderItemsSelected
                    }, function(data) {
                        customService.callCustomEvent("cancelOrderItems", {
                            controller:modalCancelcontroller,
                            result: data 
                        });
                        
                        $modalInstance.close('confirm');
                    }
                );

            } else if (this.myParams.tipo == "order") {

                fchdis0051.cancelOrder(
                    {
                        nrPedido: modalCancelcontroller.myParams.nrPedido,                        
                    },{
                        codMotivo: modalCancelcontroller.codCancela['cod-motivo'],
                        descMotivo: modalCancelcontroller.motivoCancelamento,
                        dtCancela: modalCancelcontroller.dataCancelamento,
                        ttOrderParameters: modalCancelcontroller.myParams.orderParameters 
                    }, function(data) {
                        customService.callCustomEvent("cancelOrder", {
                            controller:modalCancelcontroller,
                            result: data 
                        });
                        
                        if (!data.$hasError)
                            $modalInstance.close('confirm');
                    }
                );
            } else if (this.myParams.tipo == "entrega") {
                fchdis0051.cancelOrderItemDeliveries(
                    {
                        nrPedido: modalCancelcontroller.myParams.nrPedido, 
                    }, {
                        codMotivo: modalCancelcontroller.codCancela['cod-motivo'],
                        descMotivo: modalCancelcontroller.motivoCancelamento,
                        dtCancela: modalCancelcontroller.dataCancelamento,
                        ttOrderDelivery: modalCancelcontroller.myParams.ttOrderDelivery
                    }, function(data) {
                        customService.callCustomEvent("cancelOrderItemDeliveries", {
                            controller:modalCancelcontroller,
                            result: data 
                        });
                        $modalInstance.close('confirm');
                    }
                );
            }
        };
    }

    index.register.controller('salesorder.pd4000Cancel.Controller', modalCancelcontroller);

});
