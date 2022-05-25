define(['index',
    '/healthcare/hrb/html/beneficiarioCompartRisco/controller/beneficiarioCompartRiscoListController.js',
    '/healthcare/hrb/html/beneficiarioCompartRisco/maintenance/controller/beneficiarioCompartRiscoMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrb/beneficiarioCompartRisco', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrb/beneficiarioCompartRisco.start', {
                url: '/healthcare/hrb/beneficiarioCompartRisco/?showAsTable',
                controller: 'hrb.beneficiarioCompartRiscoList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrb/html/beneficiarioCompartRisco/ui/beneficiarioCompartRiscoList.html'
            })
            
            .state('healthcare/hrb/beneficiarioCompartRisco.new', {
                url: '/healthcare/hrb/beneficiarioCompartRisco/new',
                controller: 'hrb.beneficiarioCompartRiscoMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrb/html/beneficiarioCompartRisco/maintenance/ui/beneficiarioCompartRiscoMaintenance.html'
            })

            .state('healthcare/hrb/beneficiarioCompartRisco.edit', {
                url: '/healthcare/hrb/beneficiarioCompartRisco/edit/:cdUnidade/:cdModalidade/:cdContrato/:cdBeneficiario/:dtInicio',
                controller: 'hrb.beneficiarioCompartRiscoMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrb/html/beneficiarioCompartRisco/maintenance/ui/beneficiarioCompartRiscoMaintenance.html'
            })
            
            .state('healthcare/hrb/beneficiarioCompartRisco.detail', {         
                url: '/healthcare/hrb/beneficiarioCompartRisco/detail/:cdUnidade/:cdModalidade/:cdContrato/:cdBeneficiario/:dtInicio',
                controller: 'hrb.beneficiarioCompartRiscoMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrb/html/beneficiarioCompartRisco/maintenance/ui/beneficiarioCompartRiscoMaintenance.html'
            });
            
});


