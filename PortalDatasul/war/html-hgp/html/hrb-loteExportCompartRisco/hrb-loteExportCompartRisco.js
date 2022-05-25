define(['index',
    '/dts/hgp/html/hrb-loteExportCompartRisco/controller/loteExportCompartRiscoListController.js',
    '/dts/hgp/html/hrb-loteExportCompartRisco/maintenance/controller/loteExportCompartRiscoMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrb-loteExportCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrb-loteExportCompartRisco.start', {
                url: '/dts/hgp/hrb-loteExportCompartRisco/?showAsTable',
                controller: 'hrb.loteExportCompartRiscoList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrb-loteExportCompartRisco/ui/loteExportCompartRiscoList.html'
            })
            
            .state('dts/hgp/hrb-loteExportCompartRisco.detail', {         
                url: '/dts/hgp/hrb-loteExportCompartRisco/detail/:cdUnidadeDestino/:nrLoteExp',
                controller: 'hrb.loteExportCompartRiscoMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrb-loteExportCompartRisco/maintenance/ui/loteExportCompartRiscoMaintenance.html'
            });
            
});


