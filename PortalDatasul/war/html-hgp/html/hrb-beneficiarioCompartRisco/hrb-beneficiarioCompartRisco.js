define(['index',
    '/dts/hgp/html/hrb-beneficiarioCompartRisco/controller/beneficiarioCompartRiscoListController.js',
    '/dts/hgp/html/hrb-beneficiarioCompartRisco/maintenance/controller/beneficiarioCompartRiscoMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrb-beneficiarioCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrb-beneficiarioCompartRisco.start', {
                url: '/dts/hgp/hrb-beneficiarioCompartRisco/?showAsTable',
                controller: 'hrb.beneficiarioCompartRiscoList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrb-beneficiarioCompartRisco/ui/beneficiarioCompartRiscoList.html'
            })
            
            .state('dts/hgp/hrb-beneficiarioCompartRisco.new', {
                url: '/dts/hgp/hrb-beneficiarioCompartRisco/new',
                controller: 'hrb.beneficiarioCompartRiscoMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrb-beneficiarioCompartRisco/maintenance/ui/beneficiarioCompartRiscoMaintenance.html'
            })

            .state('dts/hgp/hrb-beneficiarioCompartRisco.edit', {
                url: '/dts/hgp/hrb-beneficiarioCompartRisco/edit/:cdUnidade/:cdModalidade/:cdContrato/:cdBeneficiario/:dtInicio',
                controller: 'hrb.beneficiarioCompartRiscoMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrb-beneficiarioCompartRisco/maintenance/ui/beneficiarioCompartRiscoMaintenance.html'
            })
            
            .state('dts/hgp/hrb-beneficiarioCompartRisco.detail', {         
                url: '/dts/hgp/hrb-beneficiarioCompartRisco/detail/:cdUnidade/:cdModalidade/:cdContrato/:cdBeneficiario/:dtInicio',
                controller: 'hrb.beneficiarioCompartRiscoMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrb-beneficiarioCompartRisco/maintenance/ui/beneficiarioCompartRiscoMaintenance.html'
            });
            
});


