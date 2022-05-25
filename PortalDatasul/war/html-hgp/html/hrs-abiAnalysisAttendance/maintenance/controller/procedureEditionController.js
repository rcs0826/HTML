define(['index',
    '/dts/hgp/html/hrs-abiAnalysisAttendance/abiAnalysisAttendanceFactory.js',
    '/dts/hgp/html/js/util/StringTools.js',
], function (index) {

    procedureEditionController.$inject = ['$rootScope', '$scope','$modalInstance', '$state',  '$location',
                                          'TOTVSEvent', 
                                          'hrs.abiAnalysisAttendance.Factory',
                                          'procedure', 'idPermissao'];
    function procedureEditionController($rootScope, $scope, $modalInstance, $state,  $location,
                                        TOTVSEvent,  
                                        abiAnalysisAttendanceFactory,
                                         procedure, idPermissao) {

        var _self = this;
        
        _self.procedure = procedure;
        _self.idPermissao = idPermissao;
        
        $scope.StringTools = StringTools;
        
        _self.listItemInfoClasses2col = "col-sm-6 col-md-6 col-lg-6 col-sm-height";
        _self.listItemInfoClasses3col = "col-sm-4 col-md-4 col-lg-4 col-sm-height";
        _self.listItemInfoClasses4col = "col-sm-3 col-md-3 col-lg-3 col-sm-height";
        _self.listItemInfoClasses6col = "col-sm-2 col-md-2 col-lg-2 col-sm-height";
        

        this.save = function () {
            
        };

        this.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        this.init = function () {            
            _self.currentUrl = $location.$$path;
        };


        $scope.$watch('$viewContentLoaded', function () {
            _self.init();
        });

        $.extend(this, procedureEditionController);
    }

    index.register.controller('hrs.procedureEdition.control', procedureEditionController);
});


