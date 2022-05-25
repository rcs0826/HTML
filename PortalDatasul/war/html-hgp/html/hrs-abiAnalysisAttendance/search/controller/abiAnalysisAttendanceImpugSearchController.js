define(['index',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
], function (index) {

    abiAnalysisAttendanceImpugSearchController.$inject = ['$rootScope', '$scope','$modalInstance', '$location', 'TOTVSEvent', 
                                                            'hrs.abiAnalysisAttendance.Factory', 'nrAih', 'cdProtocoloAbi'];
    function abiAnalysisAttendanceImpugSearchController($rootScope, $scope, $modalInstance,  $location, TOTVSEvent, 
                                                         abiAnalysisAttendanceFactory, nrAih, cdProtocoloAbi) {

        var _self = this;

        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.impugdHistoric = [];

        this.nrAih = nrAih;
        this.cdProtocoloAbi = cdProtocoloAbi;

        _self.model = {}; 

        this.close = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {
            _self.currentUrl = $location.$$path;

            abiAnalysisAttendanceFactory.getAbiAnalysisAttendanceImpugHist(this.nrAih, this.cdProtocoloAbi,
                function (result) {
                    if(!angular.isUndefined(result)){
                        angular.forEach(result, function (value, key) {
                            value.vl_impugnacao = StringTools.formatNumberToCurrency(value.vl_impugnacao)
                            _self.impugdHistoric.push(value);
                        });
                    }
            });

        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this, abiAnalysisAttendanceImpugSearchController);
    }

    index.register.controller('hrs.abiAnalysisAttendanceImpugSearch.Control', abiAnalysisAttendanceImpugSearchController);
});


