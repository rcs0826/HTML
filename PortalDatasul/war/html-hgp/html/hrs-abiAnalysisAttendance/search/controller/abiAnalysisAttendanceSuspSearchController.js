define(['index',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
], function (index) {

    abiAnalysisAttendanceSuspSearchController.$inject = ['$rootScope', '$scope','$modalInstance', '$location', 'TOTVSEvent', 
                                                         'hrs.abiAnalysisAttendance.Factory','idBeneficiario'];
    function abiAnalysisAttendanceSuspSearchController($rootScope, $scope, $modalInstance, $location, TOTVSEvent, 
                                                        abiAnalysisAttendanceFactory, idBeneficiario) {

        var _self = this;

        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.suspHistoric = [];

        _self.model = {}; 

        this.close = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () { 
            _self.currentUrl = $location.$$path;

            var dtAux;

            abiAnalysisAttendanceFactory.getAbiAnalysisAttendanceSuspHist(idBeneficiario, 
                function (result) {

                    angular.forEach(result, function (value, key) {
                        
                        value.dt_inicio_suspensao = new Date(value.dt_inicio_suspensao).toLocaleDateString();
                        value.dt_fim_suspensao    = new Date(value.dt_fim_suspensao).toLocaleDateString();
                        
                        _self.suspHistoric.push(value);
                    });
                
            });
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this, abiAnalysisAttendanceSuspSearchController);
    }

    index.register.controller('hrs.abiAnalysisAttendanceSuspSearch.Control', abiAnalysisAttendanceSuspSearchController);
});


