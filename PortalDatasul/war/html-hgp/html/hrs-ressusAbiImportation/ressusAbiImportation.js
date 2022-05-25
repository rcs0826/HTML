define(['index',
    '/healthcare/hrs/html/ressusAbiImportation/controller/ressusAbiImportationListController.js',
    '/healthcare/hrs/html/ressusAbiImportation/maintenance/controller/ressusAbiImportationMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrs/ressusAbiImportation', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrs/ressusAbiImportation.start', {
                url: '/healthcare/hrs/ressusAbiImportation/?showAsTable',
                controller: 'hrs.ressusAbiImportationList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/ressusAbiImportation/ui/ressusAbiImportationList.html'
            })
            
            .state('healthcare/hrs/ressusAbiImportation.new', {
                url: '/healthcare/hrs/ressusAbiImportation/new',
                controller: 'hrs.ressusAbiImportationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/ressusAbiImportation/maintenance/ui/ressusAbiImportationMaintenance.html'
            })

            .state('healthcare/hrs/ressusAbiImportation.edit', {
                url: '/healthcare/hrs/ressusAbiImportation/edit/:cddRessusAbiDados',
                controller: 'hrs.ressusAbiImportationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/ressusAbiImportation/maintenance/ui/ressusAbiImportationMaintenance.html'
            })
            
            .state('healthcare/hrs/ressusAbiImportation.detail', {         
                url: '/healthcare/hrs/ressusAbiImportation/detail/:cddRessusAbiDados',
                controller: 'hrs.ressusAbiImportationMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrs/html/ressusAbiImportation/maintenance/ui/ressusAbiImportationMaintenance.html'
            });
            
});


