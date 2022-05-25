define(['index',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
], function (index) {

    abiAnalysisAttendanceMovementRestrictions.$inject = ['$rootScope', '$scope','$modalInstance', '$state', '$stateParams', '$location',
                                                         'TOTVSEvent','hrs.abiAnalysisAttendance.Factory','movto'];
    function abiAnalysisAttendanceMovementRestrictions($rootScope, $scope, $modalInstance, $state, $stateParams, $location,
                                                       TOTVSEvent,  abiAnalysisAttendanceFactory,movto) {

        var _self = this;
        _self.restrictionsList = [];
        _self.movto = movto;

        this.cancel = function () {
           $modalInstance.close();             
        };

        this.init = function () {   
          _self.restrictionsList = [];

          abiAnalysisAttendanceFactory.getMovementRestriction(movto.cddRessusAbiProced, function (result) {
                if (result) {  

                  _self.restrictionsList = result;
                }
          });
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        }); 
    }
    index.register.controller('hrs.abiAnalysisAttendanceMovementRestrictions.Control', abiAnalysisAttendanceMovementRestrictions);
});

