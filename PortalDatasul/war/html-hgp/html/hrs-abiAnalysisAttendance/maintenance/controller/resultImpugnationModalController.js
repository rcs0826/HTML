define(['index',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
        '/dts/hgp/html/enumeration/impugnationResultEnumenration.js',
], function (index) {

    resultImpugnationModalController.$inject = ['$rootScope', '$scope','$modalInstance', '$location', 'TOTVSEvent', 
                                                'hrs.abiAnalysisAttendance.Factory',
                                                'hrs.ressusAbiImportation.Factory',
                                                'analisysAttendance',
                                                'cddRessusAbiDados',
                                                'idPermissao'];
    function resultImpugnationModalController($rootScope, $scope, $modalInstance,  $location, TOTVSEvent, 
                                                abiAnalysisAttendanceFactory,
                                                ressusAbiImportationFactory, 
                                                analisysAttendance,
                                                cddRessusAbiDados,
                                                idPermissao) {

        var _self = this;

        $scope.IMPUGNATION_RESULT_ENUM  = IMPUGNATION_RESULT_ENUM;

        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";

        _self.listItemInfoClasses2col = "col-sm-6 col-md-6 col-lg-6 col-sm-height";
        _self.listItemInfoClasses3col = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.listItemInfoClasses4col = "col-sm-3 col-md-3 col-lg-3 col-sm-height";
        _self.listItemInfoClasses6col = "col-sm-2 col-md-2 col-lg-2 col-sm-height";

        _self.analisysAttendance = analisysAttendance;

        _self.cddRessusAbiDados = cddRessusAbiDados;
        _self.idPermissao = idPermissao;

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.save = function(){        

            abiAnalysisAttendanceFactory.saveImpugnationResult(_self.analisysAttendance.cddRessusAbiAtendim,
                                                               _self.idiResult,      
                function(result){
                    if(result.$hasError == true){
                        return;
                    }

                    _self.invalidateAttendance(_self.analisysAttendance);
                    
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success', title: 'Resultado aplicado ao atendimento ' + _self.analisysAttendance.cddAtendim
                    }); 
                    $modalInstance.dismiss('sucess');
                }
            );
        };

        this.init = function () {
            _self.currentUrl = $location.$$path;
        };

        this.invalidateAttendance = function(attendance){
            //dispara um evento pra lista atualizar o registro
            $rootScope.$broadcast('invalidateAttendance',
                    {cddRessusAbiAtendim: attendance.cddRessusAbiAtendim,
                     cddRessusAbiDados: cddRessusAbiDados});
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this, resultImpugnationModalController);
    }

    index.register.controller('hrs.resultImpugnationModalController.Control', resultImpugnationModalController);
});


