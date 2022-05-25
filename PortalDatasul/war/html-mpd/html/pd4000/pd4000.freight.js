/* global TOTVSEvent, angular*/
define(['index'], function(index) {
    
    modalFreightcontroller.$inject = [
        '$rootScope',
        'mpd.fchdis0051.Factory', 
        'modalParams', 
        '$modalInstance', 
        'customization.generic.Factory',
        'TOTVSEvent',
        '$filter'];

    function modalFreightcontroller(
        $rootScope,
        fchdis0051, 
        modalParams, 
        $modalInstance, 
        customService,
        TOTVSEvent,
        $filter) {

        var modalFreightcontroller = this;
        var i18n = $filter('i18n');

        this.myParams = angular.copy(modalParams);

        this.nrPedido = this.myParams.nrPedido;

        this.close = function() {
            $modalInstance.dismiss('cancel');
        }

        this.getSimulationResult = function() {

            fchdis0051.freightSimulation({
                vehicleType: modalFreightcontroller.vehicleType,
                freightClass: modalFreightcontroller.freightClass,
                operationType: modalFreightcontroller.operationType,
                considNegoc: /* modalFreightcontroller.considNegoc*/ false,
                nrPedido: modalFreightcontroller.nrPedido
            },function(result) {
                
                modalFreightcontroller.listResult = result;

            })
        };

        this.confirm = function() {

            if(!modalFreightcontroller.mantemSimul) {

                if(!modalFreightcontroller.gridSelectedSimulation) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        title: $rootScope.i18n('Nenhuma Simulação Selecionada!', [], 'dts/mpd'),
                        detail: $rootScope.i18n('Por favor selecionar uma simulação para que seja gravada e enviada para o Gestão de Fretes com a Nota Fiscal.', [], 'dts/mpd'),
                        timeout: 100000,
                        type: 'warning',
                    });
                } else {
                    this.selectedSimulation = {};

                    this.selectedSimulation.nomeTransp = modalFreightcontroller.gridSelectedSimulation.nomeTransp;
                    this.selectedSimulation.codTransp = modalFreightcontroller.gridSelectedSimulation.codTransp;
                    this.selectedSimulation.cgcTransp = modalFreightcontroller.gridSelectedSimulation.cgcTransp;
                    this.selectedSimulation.nomeRota = modalFreightcontroller.gridSelectedSimulation.nomeRota;
                    this.selectedSimulation.codRota = modalFreightcontroller.gridSelectedSimulation.codRota;
                    this.selectedSimulation.tipoCapac = modalFreightcontroller.gridSelectedSimulation.tipoCapac;
                    this.selectedSimulation.vlFrete = modalFreightcontroller.gridSelectedSimulation.vlFrete;
                    this.selectedSimulation.vlFreteImp = modalFreightcontroller.gridSelectedSimulation.vlFreteImp;
                    this.selectedSimulation.dtEntrega = modalFreightcontroller.gridSelectedSimulation.dtEntrega;
                    this.selectedSimulation.hraEntrega = modalFreightcontroller.gridSelectedSimulation.hraEntrega;

                    fchdis0051.saveFreightSimulation({
                        nrPedido: modalFreightcontroller.nrPedido
                    },this.selectedSimulation,
                    function(result){
                        if (!result.messages) {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                title: $rootScope.i18n('Simulação de Frete gravada com sucesso!'),
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

    index.register.controller('salesorder.pd4000Freight.Controller', modalFreightcontroller);

});
