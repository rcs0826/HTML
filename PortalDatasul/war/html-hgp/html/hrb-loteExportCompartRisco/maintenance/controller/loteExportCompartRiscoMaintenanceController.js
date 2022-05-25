define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/js/util/StringTools.js',
        '/dts/hgp/html/hrb-loteExportCompartRisco/loteExportCompartRiscoFactory.js'
    ], function(index) {

    loteExportCompartRiscoMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hrb.loteExportCompartRisco.Factory','TOTVSEvent', '$timeout'];
	function loteExportCompartRiscoMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, loteExportCompartRiscoFactory , TOTVSEvent, $timeout) {

		var _self = this;
        $scope.StringTools = StringTools;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 

        this.cleanModel = function (){
            _self.loteExportCompartRisco = {};
            _self.loteExportBenefs = {};
        }

        this.init = function(){
            appViewService.startView("Detalhes Lote de Exportação Compartilhamento de Riscos",
            'hrb.loteExportCompartRiscoMaintenance.Control', 
            _self);
            
            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.cleanModel();  
            
            _self.currentUrl = $location.$$path; 
            
            if (!angular.isUndefined($stateParams.cdUnidadeDestino)
            &&  !angular.isUndefined($stateParams.nrLoteExp)) { 
                loteExportCompartRiscoFactory.prepareDataToMaintenanceWindow($stateParams.cdUnidadeDestino, $stateParams.nrLoteExp,
                    function (result) {
                        if (result) {
                            _self.loteExportCompartRisco = result.tmpLoteExportCompartRisco[0];
                            _self.loteExportBenefs = result.tmpLoteExportBenef;
                        }
                    });
            } 
                               
            _self.action = 'DETAIL';
        };

        this.onCancel = function(){
            appViewService.removeView({active: true,
                                        name  : 'Detalhes Lote de Exportação Compartilhamento de Riscos',
                                        url   : _self.currentUrl}); 
            return;            
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hrb.loteExportCompartRiscoMaintenance.Control', loteExportCompartRiscoMaintenanceController);	
});


