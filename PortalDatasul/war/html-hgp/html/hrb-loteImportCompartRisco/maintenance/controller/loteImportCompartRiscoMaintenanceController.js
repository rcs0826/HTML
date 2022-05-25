define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/js/util/StringTools.js',
        '/dts/hgp/html/hrb-loteImportCompartRisco/loteImportCompartRiscoFactory.js'
    ], function(index) {

    loteImportCompartRiscoMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hrb.loteImportCompartRisco.Factory','TOTVSEvent', '$timeout'];
	function loteImportCompartRiscoMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, loteImportCompartRiscoFactory , TOTVSEvent, $timeout) {

		var _self = this;
        $scope.StringTools = StringTools;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 

        this.cleanModel = function (){
            _self.loteImportCompartRisco = {};
            _self.loteImportBenefs = {};
        }

        this.init = function(){
            appViewService.startView("Detalhes Lote de Importação Compartilhamento de Riscos",
            'hrb.loteImportCompartRiscoMaintenance.Control', 
            _self);
            
            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.cleanModel();  
            
            _self.currentUrl = $location.$$path; 
            
            if (!angular.isUndefined($stateParams.cdContratante)
            &&  !angular.isUndefined($stateParams.nrLoteImp)) { 
                loteImportCompartRiscoFactory.prepareDataToMaintenanceWindow($stateParams.cdContratante, $stateParams.nrLoteImp,
                    function (result) {
                        if (result) {
                            _self.loteImportCompartRisco = result.tmpLoteImportCompartRisco[0];
                            _self.loteImportBenefs = result.tmpLoteImportBenef;
                        }
                    });
            } 
                               
            _self.action = 'DETAIL';
        };

        this.onCancel = function(){
            appViewService.removeView({active: true,
                                        name  : 'Detalhes Lote de Importação Compartilhamento de Riscos',
                                        url   : _self.currentUrl}); 
            return;            
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hrb.loteImportCompartRiscoMaintenance.Control', loteImportCompartRiscoMaintenanceController);	
});


