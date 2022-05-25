define(['index',
    '/healthcare/hrb/html/loteImportRetCompartRisco/controller/loteImportRetCompartRiscoListController.js',
    '/healthcare/hrb/html/loteImportRetCompartRisco/maintenance/controller/loteImportRetCompartRiscoMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrb/loteImportRetCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrb/loteImportRetCompartRisco.start', {
                url: '/healthcare/hrb/loteImportRetCompartRisco/?showAsTable',
                controller: 'hrb.loteImportRetCompartRiscoList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrb/html/loteImportRetCompartRisco/ui/loteImportRetCompartRiscoList.html'
            })
            
            .state('healthcare/hrb/loteImportRetCompartRisco.detail', {         
                url: '/healthcare/hrb/loteImportRetCompartRisco/detail/:cdUnidadeDestino/:nrLoteExp/:nrSequenciaLote',
                controller: 'hrb.loteImportRetCompartRiscoMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrb/html/loteImportRetCompartRisco/maintenance/ui/loteImportRetCompartRiscoMaintenance.html'
            });
            
});


