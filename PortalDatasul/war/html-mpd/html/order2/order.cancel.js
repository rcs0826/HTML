/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    modalCancelcontroller.$inject = [
        'mpd.fchdis0063.Factory', 
        'mpd.fchdis0064.Factory', 
        'modalParams', 
        '$modalInstance', 
        'customization.generic.Factory',
        '$filter',
        '$scope'];

    function modalCancelcontroller(
        fchdis0063, 
        fchdis0064, 
        modalParams, 
        $modalInstance, 
        customService,
        $filter,
        $scope) {

        var modalCancelcontroller = this;
        var i18n = $filter('i18n');

        this.myParams = angular.copy(modalParams);

        this.showSave = this.myParams.showSave;

        this.motivoCancelamento = '';

        if (this.myParams.tipo == "order") {
            modalCancelcontroller.tipo = i18n('l-pedido');
        } else if (this.myParams.tipo == "item") {
            modalCancelcontroller.tipo = i18n('l-cod-item');
        } else if (this.myParams.tipo == "entrega") {
            modalCancelcontroller.tipo = i18n('l-cod-entrega');
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

                fchdis0063.cancelOrderItems(
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

            } else if (this.myParams.tipo == "order") {

                fchdis0064.cancelOrder(
                    {
                        nrPedido: modalCancelcontroller.myParams.nrPedido,                        
                    },{
                        descMotivo: modalCancelcontroller.motivoCancelamento,
                        ttOrderParameters: modalCancelcontroller.myParams.orderParameters 
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
                fchdis0063.cancelOrderItemDeliveries(
                    {
                        nrPedido: modalCancelcontroller.myParams.nrPedido, 
                    }, {
                        descMotivo: modalCancelcontroller.motivoCancelamento,
                        ttOrderDelivery: modalCancelcontroller.myParams.ttOrderDelivery
                    }, function(data) {
                        customService.callCustomEvent("cancelOrderItemDeliveries", {
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

    index.register.controller('salesorder.portalOrderCancel.Controller', modalCancelcontroller);

});
