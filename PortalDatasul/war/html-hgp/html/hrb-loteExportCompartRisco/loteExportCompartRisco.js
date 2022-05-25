define(['index',
    '/healthcare/hrb/html/loteExportCompartRisco/controller/loteExportCompartRiscoListController.js',
    '/healthcare/hrb/html/loteExportCompartRisco/maintenance/controller/loteExportCompartRiscoMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrb/loteExportCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrb/loteExportCompartRisco.start', {
                url: '/healthcare/hrb/loteExportCompartRisco/?showAsTable',
                controller: 'hrb.loteExportCompartRiscoList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrb/html/loteExportCompartRisco/ui/loteExportCompartRiscoList.html'
            })
            
            .state('healthcare/hrb/loteExportCompartRisco.detail', {         
                url: '/healthcare/hrb/loteExportCompartRisco/detail/:cdUnidadeDestino/:nrLoteExp',
                controller: 'hrb.loteExportCompartRiscoMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrb/html/loteExportCompartRisco/maintenance/ui/loteExportCompartRiscoMaintenance.html'
            });
            
});


