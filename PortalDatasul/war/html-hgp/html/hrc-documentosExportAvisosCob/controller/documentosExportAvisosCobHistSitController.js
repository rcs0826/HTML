define(['index',    
    '/dts/hgp/html/js/util/StringTools.js',
    '/dts/hgp/html/js/util/DateTools.js',    
    '/dts/hgp/html/util/genericConfigController.js',
    '/dts/hgp/html/global-abstractController/AbstractAdvancedFilterController.js'    
], function (index) {

    // *************************************************************************************
    // *** CONTROLLER 
    // *************************************************************************************
    documentosExportAvisosCobHistSitController.$inject = ['$rootScope','$scope', '$modalInstance', 
    '$timeout', '$state', 'TOTVSEvent', 'hrc.documentosExportAvisosCob.Factory','idSeqAvisoCob'];
    function documentosExportAvisosCobHistSitController($rootScope,$scope, $modalInstance,
        $timeout, $state, TOTVSEvent, documentosExportAvisosCobFactory, idSeqAvisoCob) {

        var _self = this;
        this.model = {};
        this.listAvisosCobHistSit = "";
        this.listAvisosCobHistSitCount = 0;
        this.hasDoneSearch = false;
        this.idSeqAvisoCob = idSeqAvisoCob;
        this.cancel = function () {
            $modalInstance.close('close');
        };

        this.init = function () {    
            documentosExportAvisosCobFactory.getBuscaHistSitDoc(idSeqAvisoCob ,
                function (result){
                    if (result != null){
                        _self.listAvisosCobHistSit = result.tmpHistSitDoctoAvisoCob;                             
                        _self.listAvisosCobHistSitCount = result.tmpHistSitDoctoAvisoCob.length;
                    }
                    _self.hasDoneSearch = true;
            });
        };

        $scope.$watch('$viewContentLoaded', function () {            
            _self.init();
        });

        $.extend(this, documentosExportAvisosCobHistSitController);
    }

    index.register.controller('hrc.documentosExportAvisosCobHistSit.Control', documentosExportAvisosCobHistSitController);
});

