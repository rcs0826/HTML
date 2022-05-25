define(['index',
    '/healthcare/hrb/html/loteImportCompartRisco/controller/loteImportCompartRiscoListController.js',
    '/healthcare/hrb/html/loteImportCompartRisco/maintenance/controller/loteImportCompartRiscoMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrb/loteImportCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrb/loteImportCompartRisco.start', {
                url: '/healthcare/hrb/loteImportCompartRisco/?showAsTable',
                controller: 'hrb.loteImportCompartRiscoList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrb/html/loteImportCompartRisco/ui/loteImportCompartRiscoList.html'
            })
            
            .state('healthcare/hrb/loteImportCompartRisco.detail', {         
                url: '/healthcare/hrb/loteImportCompartRisco/detail/:cdContratante/:nrLoteImp',
                controller: 'hrb.loteImportCompartRiscoMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrb/html/loteImportCompartRisco/maintenance/ui/loteImportCompartRiscoMaintenance.html'
            });
            
});


