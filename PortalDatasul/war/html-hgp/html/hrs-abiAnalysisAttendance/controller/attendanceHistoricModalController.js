define(['index',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/abiServicesModalController.js',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/justificationsMotiveModalController.js',    
	'/dts/hgp/html/hrs-abiAnalysisAttendance/maintenance/controller/abiAnalysisAttendanceSupportingDocumentsController.js',
], function (index) {

    attendanceHistoricModalController.$inject = ['$rootScope', '$scope','$modalInstance', '$state', '$stateParams', '$location',
                                                'TOTVSEvent','hrs.abiAnalysisAttendance.Factory', 'ressusAbiAtendim', '$filter'];
    function attendanceHistoricModalController($rootScope, $scope, $modalInstance, $state, $stateParams, $location,
                                              TOTVSEvent,  abiAnalysisAttendanceFactory, ressusAbiAtendim, $filter) {

        var _self = this;
        _self.historicAttendanceList = [];

        this.cancel = function () {           
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {
            abiAnalysisAttendanceFactory.getAttendanceHistoric(ressusAbiAtendim.cddRessusAbiAtendim,
                function(result){                    
                  _self.historicAttendanceList = result.tmpRessusHistorAtendim;
                  _self.historicAttendanceList = $filter('orderBy')(_self.historicAttendanceList, 'cddRessusHistorAtendim');
            });
        }

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        }); 
    }
    index.register.controller('hrs.attendanceHistoricModalController.Control', attendanceHistoricModalController);
});

