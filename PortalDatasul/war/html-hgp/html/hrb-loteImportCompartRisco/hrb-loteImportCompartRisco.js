define(['index',
    '/dts/hgp/html/hrb-loteImportCompartRisco/controller/loteImportCompartRiscoListController.js',
    '/dts/hgp/html/hrb-loteImportCompartRisco/maintenance/controller/loteImportCompartRiscoMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrb-loteImportCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrb-loteImportCompartRisco.start', {
                url: '/dts/hgp/hrb-loteImportCompartRisco/?showAsTable',
                controller: 'hrb.loteImportCompartRiscoList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrb-loteImportCompartRisco/ui/loteImportCompartRiscoList.html'
            })
            
            .state('dts/hgp/hrb-loteImportCompartRisco.detail', {         
                url: '/dts/hgp/hrb-loteImportCompartRisco/detail/:cdContratante/:nrLoteImp',
                controller: 'hrb.loteImportCompartRiscoMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrb-loteImportCompartRisco/maintenance/ui/loteImportCompartRiscoMaintenance.html'
            });
            
});


