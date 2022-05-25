/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    modalSuspendcontroller.$inject = [
        'mpd.fchdis0051.Factory', 
        'modalParams', 
        'customization.generic.Factory',
        '$modalInstance'];

    function modalSuspendcontroller(
        fchdis0051, 
        modalParams,
        customService, 
        $modalInstance) {

        var modalSuspendcontroller = this;

        this.myParams = angular.copy(modalParams);

        this.motivo = '';

        this.selectMotivo = function () {
            modalSuspendcontroller.motivo = modalSuspendcontroller.codSuspend.narrativa;
        }

        this.close = function() {
            $modalInstance.dismiss('cancel');
        }

        this.confirm = function() {
            fchdis0051.suspendReactivateOrder(
                {
                    nrPedido: modalSuspendcontroller.myParams.nrPedido,                        
                },{
                    codMotivo: modalSuspendcontroller.codSuspend['cod-motivo'],
                    descMotivo: modalSuspendcontroller.motivo,
                    ttOrderParameters: modalSuspendcontroller.myParams.orderParameters 
                }, function(data) {
                    customService.callCustomEvent("suspendOrder", {
                        controller:modalSuspendcontroller,
                        result: data 
                    });
                    
                    if (!data.$hasError)
                        $modalInstance.close('confirm');
                }
            );
        };
    }

    index.register.controller('salesorder.pd4000Suspend.Controller', modalSuspendcontroller);

});
