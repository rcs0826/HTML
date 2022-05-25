define(['index',
        '/dts/hgp/html/util/customFilters.js',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
], function (index) {

    abiServicesModalController.$inject = ['$rootScope', '$scope','$modalInstance', '$state', '$stateParams', '$location', '$filter',
                                          'hrs.abiAnalysisAttendance.Factory', 'impugnation', 'attendance', 'action', 'TOTVSEvent', '$timeout'];
    function abiServicesModalController($rootScope, $scope, $modalInstance, $state, $stateParams, $location, $filter,
                                       abiAnalysisAttendanceFactory, impugnation, attendance, action, TOTVSEvent, $timeout) {

        var _self = this;
        _self.action = action;

        this.cancel = function () {
            $modalInstance.dismiss('cancel');             
        };        

        this.save = function () {
            var selectedItemsAux = _self.tableServices.getSelectedItems();
            var lgMainSelected = false;

            for (var i = selectedItemsAux.length - 1; i >= 0; i--) {
                selectedItemsAux[i].idPai = impugnation.id;
                /* Se o servico principal for selecionado, aplica o motivo de impugnacao para o atendimento */
                if(selectedItemsAux[i].inTipoServicoRessus == 1){
                    lgMainSelected = true;
                }
            }

            if(_self.tableServices.getItems().length == _self.tableServices.getSelectedItems().length
            || lgMainSelected == true){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'information',
                    title: 'O serviço principal foi selecionado para o motivo. O motivo será aplicado ao atendimento.'
                });

                $modalInstance.close([]);
            }else{
                $modalInstance.close(selectedItemsAux);
            }
        };

        this.init = function () {
            abiAnalysisAttendanceFactory.getRessusAbiAtendimServices(attendance.cddRessusAbiAtendim, function(result){
                var tmpMovementRessus  = result.tmpMovementRessus;
                var tmpRessusAbiProced = result.tmpRessusAbiProced;

                for (var i = tmpMovementRessus.length - 1; i >= 0; i--) {
                    tmpMovementRessus[i].servico = {};
                    tmpMovementRessus[i].$selected = false;

                    for (var j = tmpRessusAbiProced.length - 1; j >= 0; j--) {
                        if(tmpRessusAbiProced[j].cddRessusAbiProced == tmpMovementRessus[i].cddRessusAbiProced){
                              tmpMovementRessus[i].servico = tmpRessusAbiProced[j];
                              tmpMovementRessus[i].inTipoServicoRessus = tmpRessusAbiProced[j].inTipoServicoRessus;
                        }
                    }                  

                    for (var j = impugnation.servicos.length - 1; j >= 0; j--) {
                       if (impugnation.servicos[j].cddRessusAbiProced == tmpMovementRessus[i].cddRessusAbiProced){
                            tmpMovementRessus[i].$selected = true;
                       }
                    }
                }

                /* Ordena por Principal, Especial e Secundário */
                _self.abiServices = $filter('orderBy')(tmpMovementRessus, 'inTipoServicoRessus');
            });
        };          

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        }); 
    }
    index.register.controller('hrs.abiServicesModalController.Control', abiServicesModalController);
});

