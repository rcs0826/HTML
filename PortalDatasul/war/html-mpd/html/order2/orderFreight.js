/* global TOTVSEvent, angular*/
define(['index'], function(index) {

    modalFreightController.$inject = [
        '$rootScope',
        'mpd.fchdis0064.Factory',
        'modalParams',
        '$modalInstance',
        'TOTVSEvent',
        '$filter'];

    function modalFreightController(
        $rootScope,
        fchdis0064,
        modalParams,
        $modalInstance,
        TOTVSEvent,
        $filter) {

        var modalFreightController = this;
        var i18n = $filter('i18n');

        this.myParams = angular.copy(modalParams);

        this.nrPedido = this.myParams.nrPedido;

        this.close = function() {
            $modalInstance.dismiss('cancel');
        }

        this.getSimulationResult = function() {

            fchdis0064.freightSimulation({
                vehicleType: modalFreightController.vehicleType,
                freightClass: modalFreightController.freightClass,
                operationType: modalFreightController.operationType,
                considNegoc: /* modalFreightcontroller.considNegoc*/ false,
                nrPedido: modalFreightController.nrPedido
            },function(result) {

                modalFreightController.listResult = result;

            })
        };

        this.confirm = function() {

            if(!modalFreightController.mantemSimul) {

                if(!modalFreightController.gridSelectedSimulation) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        title: $rootScope.i18n('l-no-simulation-selected', [], 'dts/mpd'),
                        detail: $rootScope.i18n('l-record-and-send-simulation', [], 'dts/mpd'),
                        timeout: 100000,
                        type: 'warning',
                    });
                } else {
                    this.selectedSimulation = {};

                    this.selectedSimulation.nomeTransp = modalFreightController.gridSelectedSimulation.nomeTransp;
                    this.selectedSimulation.codTransp = modalFreightController.gridSelectedSimulation.codTransp;
                    this.selectedSimulation.cgcTransp = modalFreightController.gridSelectedSimulation.cgcTransp;
                    this.selectedSimulation.nomeRota = modalFreightController.gridSelectedSimulation.nomeRota;
                    this.selectedSimulation.codRota = modalFreightController.gridSelectedSimulation.codRota;
                    this.selectedSimulation.tipoCapac = modalFreightController.gridSelectedSimulation.tipoCapac;
                    this.selectedSimulation.vlFrete = modalFreightController.gridSelectedSimulation.vlFrete;
                    this.selectedSimulation.vlFreteImp = modalFreightController.gridSelectedSimulation.vlFreteImp;
                    this.selectedSimulation.dtEntrega = modalFreightController.gridSelectedSimulation.dtEntrega;
                    this.selectedSimulation.hraEntrega = modalFreightController.gridSelectedSimulation.hraEntrega;

                    fchdis0064.saveFreightSimulation({
                        nrPedido: modalFreightController.nrPedido
                    },this.selectedSimulation,
                    function(result){
                        if (!result.messages) {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                title: $rootScope.i18n('l-freight-simulation-saved'),
                                timeout: 100000,
                                type: 'success'
                            });
                            $modalInstance.dismiss('cancel');
                        }
                    })
                }
            }
            else {
                this.close();
            }
        };
    }

    index.register.controller('salesorder.orderFreight.controller', modalFreightController);
});