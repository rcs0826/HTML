define(['index',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
], function (index) {

    attendanceErrorsModal.$inject = ['$rootScope', '$scope','$modalInstance', '$state', '$stateParams', '$location',
                                                         'TOTVSEvent','hrs.abiAnalysisAttendance.Factory','errorList'];
    function attendanceErrorsModal($rootScope, $scope, $modalInstance, $state, $stateParams, $location,
                                                       TOTVSEvent,  abiAnalysisAttendanceFactory,errorList) {

        var _self = this;
        _self.errorList = errorList;
        _self.gridOptions = _self.getGridOptions;

        this.cancel = function () {
           $modalInstance.close();             
        };

        this.init = function (){
          console.log('init'); 
        };


        this.getGridOptions = function () {

            var opts = {
                reorderable: true,
                columns: [
                    { field: 'cdnErro', title: 'Código', width: 100 },
                    { field: 'desErro', title: 'Descrição', width: 100 }
                ]
            };

            var deferred = $q.defer();

            deferred.resolve(opts);

            return deferred.promise;

        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        }); 
    }
    index.register.controller('hrs.attendanceErrorsModal.Control', attendanceErrorsModal);
});

