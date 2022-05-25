define(['index',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
], function (index) {

    attendanceGRUModal.$inject = ['$rootScope', '$scope','$modalInstance', '$state', '$stateParams', '$location',
                                  'TOTVSEvent','hrs.abiAnalysisAttendance.Factory','listGru', 'attendance', 'cddRessusAbiDados',
                                  'disclaimers', 'tmpUnselectedAttendance', 'saveAttendanceGRU'];

    function attendanceGRUModal($rootScope, $scope, $modalInstance, $state, $stateParams, $location,
                                TOTVSEvent, abiAnalysisAttendanceFactory, listGru, attendance, cddRessusAbiDados, 
                                disclaimers, tmpUnselectedAttendance, saveAttendanceGRU) {
        
        var _self = this;
        _self.listGru = listGru;
        _self.disclaimers = disclaimers;
        _self.tmpUnselectedAttendance = tmpUnselectedAttendance;
        _self.cddRessusAbiDados = cddRessusAbiDados;
        _self.saveAttendanceGRU = saveAttendanceGRU;
        
        this.init = function (){
            if (!angular.isUndefined(attendance)){
                for (var i = _self.listGru.length - 1; i >= 0; i--) {
                    if(_self.listGru[i].cddGru == attendance.cddGru){
                        _self.listGru[i].$selected = true;
                    }
                }
            }
        };

        this.save = function () {
            var cddGRUAux = 0;

            /* se nada foi selecionado, salva sem codigo de GRU */
            var selectedItemAux = _self.table.getSelectedItems();

            if (selectedItemAux.length > 0) {
                cddGRUAux = selectedItemAux[0].cddGru;
            }

            if (angular.isUndefined(attendance)){
                $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'Atenção!',
                    text: 'Somente os atendimentos com status Aguardando GRU ou Aguardando Pagamento serão atualizados. '
                        + 'Confirma?',
                    cancelLabel: 'Cancelar',
                    confirmLabel: 'Confirmar',
                    size: 'md',
                    callback: function (hasChooseYes) {
                        if (hasChooseYes) {
                            _self.saveAttendanceGRU(_self.cddRessusAbiDados, cddGRUAux, _self.disclaimers, _self.tmpUnselectedAttendance);        
                        }
                    }
                });
            } else {                
                _self.saveAttendanceGRU(_self.cddRessusAbiDados, cddGRUAux, _self.disclaimers, _self.tmpUnselectedAttendance);                
            }

            _self.cancel();
         };         

         this.cancel = function () {
            $modalInstance.close();
         };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        }); 
    }
    index.register.controller('hrs.attendanceGRUModal.Control', attendanceGRUModal);
});