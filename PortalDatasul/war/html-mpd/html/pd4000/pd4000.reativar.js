/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    modalReativarcontroller.$inject = [
        'mpd.fchdis0051.Factory', 
        'modalParams', 
        'customization.generic.Factory',
        '$modalInstance'];

    function modalReativarcontroller(
        fchdis0051, 
        modalParams, 
        customService,
        $modalInstance) {

        var modalReativarcontroller = this;

        this.myParams = angular.copy(modalParams);

        this.motivo = '';

        this.selectMotivo = function () {
            modalReativarcontroller.motivo = modalReativarcontroller.codSuspend.narrativa;
        }

        this.close = function() {
            $modalInstance.dismiss('cancel');
        }

        this.confirm = function() {
            fchdis0051.suspendReactivateOrder(
                {
                    nrPedido: modalReativarcontroller.myParams.nrPedido,                        
                },{
                    codMotivo: modalReativarcontroller.codSuspend['cod-motivo'],
                    descMotivo: modalReativarcontroller.motivo,
                    ttOrderParameters: modalReativarcontroller.myParams.orderParameters 
                }, function(data) {
                    customService.callCustomEvent("reactivateOrder", {
                        controller:modalReativarcontroller,
                        result: data 
                    });

                    if (!data.$hasError)
                        $modalInstance.close('confirm');
                }
            );
        };
    }

    index.register.controller('salesorder.pd4000Reativar.Controller', modalReativarcontroller);

});
