define(['index',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
], function (index) {

    abiAnalysisAttendanceRefundSearchController.$inject = ['$rootScope', '$scope','$modalInstance', '$location', 'TOTVSEvent', 
                                                           'hrs.abiAnalysisAttendance.Factory','idBeneficiario'];
    function abiAnalysisAttendanceRefundSearchController($rootScope, $scope, $modalInstance,  $location, TOTVSEvent, 
                                                        abiAnalysisAttendanceFactory, idBeneficiario) {

        var _self = this;

        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.refundHistoric = [];

        _self.model = {}; 
        
        this.close = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {
            
            _self.currentUrl = $location.$$path;

            abiAnalysisAttendanceFactory.getAbiAnalysisAttendanceRefundHist(idBeneficiario, 
                function (result) {

                    if(!angular.isUndefined(result)){
                        angular.forEach(result, function (value, key) {
                            value.dt_emissao_guia = new Date(value.dt_emissao_guia).toLocaleDateString(); 
                            value.vl_tt_reembolso = StringTools.formatNumberToCurrency(value.vl_tt_reembolso)
                            value.vl_tt_ser_reembolsado = StringTools.formatNumberToCurrency(value.vl_tt_ser_reembolsado)

                            if (value.lg_guia_principal){
                                value.lg_guia_principal = "Sim";
                            }
                            else{
                                value.lg_guia_principal = "Não";
                            }

                            _self.refundHistoric.push(value);
                        });
                    }
            });

        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this, abiAnalysisAttendanceRefundSearchController);
    }

    index.register.controller('hrs.abiAnalysisAttendanceRefundSearch.Control', abiAnalysisAttendanceRefundSearchController);
});


