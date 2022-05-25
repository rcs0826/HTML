define(['index',    
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/js/util/DateTools.js',    
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js'    
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************
    noticeBillingImportErrorMessagesController.$inject = ['$rootScope','$scope', '$modalInstance', 
    '$timeout', '$state', 'TOTVSEvent', 'hrc.noticeBillingImport.Factory','cddSeq'];
    function noticeBillingImportErrorMessagesController($rootScope,$scope, $modalInstance,
        $timeout, $state, TOTVSEvent, noticeBillingImportFactory, cddSeq) {

        var _self = this;
        this.model = {};
        this.listAvisosCobErrorMessages = "";
        this.listAvisosCobErrorMessagesCount = 0;
        this.hasDoneSearch = false;
        this.cddSeq = cddSeq;
        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {    
            noticeBillingImportFactory.getErrorMessages(cddSeq ,
                function (result){
                    if (result != null){
                        _self.listAvisosCobErrorMessages = result.tmpErrorMessages;                             
                        _self.listAvisosCobErrorMessagesCount = result.tmpErrorMessages.length;
                    }
                    _self.hasDoneSearch = true;
            });
     
        };

        $scope.$watch('$viewContentLoaded', function () {            
            _self.init();
        });

        $.extend(this, noticeBillingImportErrorMessagesController);
    }

    index.register.controller('hrc.noticeBillingImportErrorMessages.Control', noticeBillingImportErrorMessagesController);
});

