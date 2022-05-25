define(['index',
        '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
], function (index) {

    abiAttendanceModalController.$inject = ['$scope', '$modalInstance', 'totvs.utils.Service', 
                'hrs.abiAnalysisAttendance.Factory','ressusAbiImportation'];
    function abiAttendanceModalController($scope, $modalInstance, totvsUtilsService, 
                 abiAnalysisAttendanceFactory,ressusAbiImportation) {

        var _self = this;
        _self.ressusAbiImportation = ressusAbiImportation;
        _self.limit = 50;
        _self.ressusAbiAttendanceList = [];
        _self.ressusAbiAttendanceListCount = 0;

        this.init = function(){  
            _self.search(false);
            
        };

        this.search = function(isMore) {

            startAt = 0;

            if (isMore) {
                startAt = _self.ressusAbiAttendanceList.length + 1;
            } else {
                _self.ressusAbiAttendanceList = [];
            }

            abiAnalysisAttendanceFactory.getRessusAbiAtendim(_self.ressusAbiImportation.cddRessusAbiDados,startAt,_self.limit,
                function (result) {

                    if(result.$hasError == true){
                        return;
                    }

                    if (result) {
                         angular.forEach(result, function (value) {

                            if (value && value.$length) {
                               _self.ressusAbiAttendanceListCount = value.$length;
                            }
                            _self.ressusAbiAttendanceList.push(value);
                    });
                }
            });
        };
        
        this.cancel = function () {
            //limpa o movimento da area de edicao e fecha o modal
            $modalInstance.dismiss('cancel');
        };

        $scope.$watch('$viewContentLoaded', function() {
            _self.init();
        });
    }
    index.register.controller('hrs.abiAttendanceModalController', abiAttendanceModalController);
});
