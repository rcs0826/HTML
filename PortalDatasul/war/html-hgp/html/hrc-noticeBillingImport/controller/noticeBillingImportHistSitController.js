define(['index',    
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/js/util/DateTools.js',    
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js'    
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************
    noticeBillingImportHistSitController.$inject = ['$rootScope','$scope', '$modalInstance', 
    '$timeout', '$state', 'TOTVSEvent', 'hrc.noticeBillingImport.Factory','cddSeq'];
    function noticeBillingImportHistSitController($rootScope,$scope, $modalInstance,
        $timeout, $state, TOTVSEvent, noticeBillingImportFactory, cddSeq) {

        var _self = this;
        this.model = {};
        this.listAvisosCobHistSit = "";
        this.listAvisosCobHistSitCount = 0;
        this.hasDoneSearch = false;
        this.cddSeq = cddSeq;
        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {    
            noticeBillingImportFactory.getBuscaHistSitDoc(cddSeq ,
                function (result){
                    if (result != null){
                        _self.listAvisosCobHistSit = result.tmpHistSitDoctoAvisoCobImp;                             
                        _self.listAvisosCobHistSitCount = result.tmpHistSitDoctoAvisoCobImp.length;
                    }
                    _self.hasDoneSearch = true;
            });
     
        };

        $scope.$watch('$viewContentLoaded', function () {            
            _self.init();
        });

        $.extend(this, noticeBillingImportHistSitController);
    }

    index.register.controller('hrc.noticeBillingImportHistSit.Control', noticeBillingImportHistSitController);
});

