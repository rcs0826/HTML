define(['index',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
], function (index) {

    attendanceSituationModal.$inject = ['$rootScope', '$scope','$modalInstance', '$state', '$stateParams', '$location',
                                        'TOTVSEvent','hrs.abiAnalysisAttendance.Factory','listSituation', 'cddRessusAbiDados',
                                        'saveAttendanceSituation'];

    function attendanceSituationModal($rootScope, $scope, $modalInstance, $state, $stateParams, $location,
                                      TOTVSEvent, abiAnalysisAttendanceFactory, listSituation, cddRessusAbiDados, 
                                      saveAttendanceSituation) {
        
        var _self = this;
        _self.listSituation = listSituation;
        _self.cddRessusAbiDados = cddRessusAbiDados;
        _self.saveAttendanceSituation = saveAttendanceSituation;
        
        this.init = function (){
            _self.nmSituacao = _self.listSituation[0].nmSituacao;
            _self.idSituacao = _self.listSituation[0].idSituacao;
        };

        this.save = function () {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'Atenção!',
                text: 'Somente os atendimentos com status Importação com Erro ou Análise serão atualizados. '
                    + 'Confirma?',
                cancelLabel: 'Cancelar',
                confirmLabel: 'Confirmar',
                size: 'md',
                callback: function (hasChooseYes) {
                    if (hasChooseYes) {
                        _self.saveAttendanceSituation(_self.cddRessusAbiDados, _self.idSituacao);        
                    }
                }
            });

            _self.cancel();
         };         

         this.onSituationChange = function(){
            angular.forEach(_self.listSituation, function(situation){
                if (situation.nmSituacao === _self.nmSituacao){
                    _self.idSituacao = situation.idSituacao;
                }
            });
         };

         this.cancel = function () {
            $modalInstance.close();
         };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        }); 
    }
    index.register.controller('hrs.attendanceSituationModal.Control', attendanceSituationModal);
});