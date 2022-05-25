define(['index',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
    '/dts/hgp/html/hrs-assocvaConverMovto/assocvaConverMovtoFactory.js',
    '/dts/hgp/html/enumeration/abiStatusEnumeration.js',
    '/dts/hgp/html/hrs-ressusAbiImportation/ressusAbiImportationFactory.js',
    '/dts/hgp/html/js/util/StringTools.js',
], function (index) {

    statusModalController.$inject = ['$rootScope', '$scope','$modalInstance', '$state',  '$location',
                                          'TOTVSEvent', 
                                          '$timeout',
                                          'hrs.ressusAbiImportation.Factory',
                                          'ressusAbiImportationListController', 
                                          'selectedressusAbiImportation'];
    function statusModalController($rootScope, $scope, $modalInstance, $state,  $location,
                                        TOTVSEvent,  
                                        $timeout,
                                        ressusAbiImportationFactory,
                                        ressusAbiImportationListController,
                                        selectedressusAbiImportation) {

        var _self = this;
        $scope.ABI_STATUS_ENUM  = ABI_STATUS_ENUM;

        _self.ressusAbiImportationListController = ressusAbiImportationListController;
        _self.selectedressusAbiImportation       = selectedressusAbiImportation;

        this.save = function () {

            _self.selectedressusAbiImportation.idiStatus = _self.idiStatus;

            ressusAbiImportationFactory.saveRessusAbiDados(_self.selectedressusAbiImportation,
                function (result) {
                    if(result.$hasError == true){
                        return;
                    }

                    $modalInstance.dismiss('cancel');
            });
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {
            
            _self.currentUrl = $location.$$path;
            _self.idiStatus = _self.selectedressusAbiImportation.idiStatus;
        };

        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this, statusModalController);
    }

    index.register.controller('hrs.statusModal.control', statusModalController);
});


