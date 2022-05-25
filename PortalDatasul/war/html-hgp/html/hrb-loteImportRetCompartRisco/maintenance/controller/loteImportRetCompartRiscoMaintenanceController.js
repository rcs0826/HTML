define(['index', 
        '/dts/hgp/html/js/util/DateTools.js',
        '/dts/hgp/html/js/util/StringTools.js',
        '/dts/hgp/html/hrb-loteImportRetCompartRisco/loteImportRetCompartRiscoFactory.js'
    ], function(index) {

    loteImportRetCompartRiscoMaintenanceController.$inject = ['$rootScope', '$scope','$state', '$stateParams', 'totvs.utils.Service', 'totvs.app-main-view.Service','$location','hrb.loteImportRetCompartRisco.Factory','TOTVSEvent', '$timeout'];
	function loteImportRetCompartRiscoMaintenanceController($rootScope, $scope, $state, $stateParams, totvsUtilsService, appViewService, $location, loteImportRetCompartRiscoFactory , TOTVSEvent, $timeout) {

		var _self = this;
        $scope.StringTools = StringTools;
        _self.listItemInfoClasses = "col-sm-4 col-md-4 col-lg-4 col-sm-height"; 

        this.cleanModel = function (){
            _self.loteImportRetCompartRisco = {};
            _self.loteImportRetBenefs = {};
        }

        this.init = function(){
            appViewService.startView("Detalhes Lote de Importação Retorno Compartilhamento de Riscos",
            'hrb.loteImportRetCompartRiscoMaintenance.Control', 
            _self);
            
            if(appViewService.lastAction != 'newtab'
            && _self.currentUrl == $location.$$path){
                return;
            }

            _self.cleanModel();  
            
            _self.currentUrl = $location.$$path; 
            
            if (!angular.isUndefined($stateParams.cdUnidadeDestino)
            &&  !angular.isUndefined($stateParams.nrLoteExp)
            &&  !angular.isUndefined($stateParams.nrSequenciaLote)) { 
                loteImportRetCompartRiscoFactory.prepareDataToMaintenanceWindow($stateParams.cdUnidadeDestino, $stateParams.nrLoteExp, $stateParams.nrSequenciaLote,
                    function (result) {
                        if (result) {
                            _self.loteImportRetCompartRisco = result.tmpLoteImportRetCompartRisco[0];
                            _self.loteImportRetBenefs = result.tmpLoteImportRetBenef;
                        }
                    });
            } 
                               
            _self.action = 'DETAIL';
        };

        this.onCancel = function(){
            appViewService.removeView({active: true,
                                        name  : 'Detalhes Lote de Importação Retorno Compartilhamento de Riscos',
                                        url   : _self.currentUrl}); 
            return;            
        };

        $scope.$on('$viewContentLoaded', function(){
            _self.init();
        }); 
	}
	
	index.register.controller('hrb.loteImportRetCompartRiscoMaintenance.Control', loteImportRetCompartRiscoMaintenanceController);	
});


