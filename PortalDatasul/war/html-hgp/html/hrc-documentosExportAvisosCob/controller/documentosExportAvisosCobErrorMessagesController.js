define(['index',    
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/js/util/DateTools.js',    
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js'    
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************
    documentosExportAvisosCobErrorMessagesController.$inject = ['$rootScope','$scope', '$modalInstance', 
    '$timeout', '$state', 'TOTVSEvent', 'hrc.documentosExportAvisosCob.Factory','idSeqAvisoCob'];
    function documentosExportAvisosCobErrorMessagesController($rootScope,$scope, $modalInstance,
        $timeout, $state, TOTVSEvent, documentosExportAvisosCobFactory, idSeqAvisoCob) {

        var _self = this;
        this.model = {};
        this.listAvisosCobErrorMessages = "";
        this.listAvisosCobErrorMessagesCount = 0;
        this.hasDoneSearch = false;
        this.idSeqAvisoCob = idSeqAvisoCob;
        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {    
            documentosExportAvisosCobFactory.getErrorMessages(idSeqAvisoCob ,
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

        $.extend(this, documentosExportAvisosCobErrorMessagesController);
    }

    index.register.controller('hrc.documentosExportAvisosCobErrorMessages.Control', documentosExportAvisosCobErrorMessagesController);
});

