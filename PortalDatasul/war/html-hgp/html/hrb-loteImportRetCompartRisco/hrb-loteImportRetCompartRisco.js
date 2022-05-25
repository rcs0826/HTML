define(['index',
    '/dts/hgp/html/hrb-loteImportRetCompartRisco/controller/loteImportRetCompartRiscoListController.js',
    '/dts/hgp/html/hrb-loteImportRetCompartRisco/maintenance/controller/loteImportRetCompartRiscoMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrb-loteImportRetCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrb-loteImportRetCompartRisco.start', {
                url: '/dts/hgp/hrb-loteImportRetCompartRisco/?showAsTable',
                controller: 'hrb.loteImportRetCompartRiscoList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrb-loteImportRetCompartRisco/ui/loteImportRetCompartRiscoList.html'
            })
            
            .state('dts/hgp/hrb-loteImportRetCompartRisco.detail', {         
                url: '/dts/hgp/hrb-loteImportRetCompartRisco/detail/:cdUnidadeDestino/:nrLoteExp/:nrSequenciaLote',
                controller: 'hrb.loteImportRetCompartRiscoMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrb-loteImportRetCompartRisco/maintenance/ui/loteImportRetCompartRiscoMaintenance.html'
            });
            
});


