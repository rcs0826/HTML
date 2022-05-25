define(['index',
    '/dts/hgp/html/hrs-ressusAbiImportation/controller/ressusAbiImportationListController.js',
    '/dts/hgp/html/hrs-ressusAbiImportation/maintenance/controller/ressusAbiImportationMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrs-ressusAbiImportation', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrs-ressusAbiImportation.start', {
                url: '/dts/hgp/hrs-ressusAbiImportation/?showAsTable',
                controller: 'hrs.ressusAbiImportationList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-ressusAbiImportation/ui/ressusAbiImportationList.html'
            })
            
            .state('dts/hgp/hrs-ressusAbiImportation.new', {
                url: '/dts/hgp/hrs-ressusAbiImportation/new',
                controller: 'hrs.ressusAbiImportationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-ressusAbiImportation/maintenance/ui/ressusAbiImportationMaintenance.html'
            })

            .state('dts/hgp/hrs-ressusAbiImportation.edit', {
                url: '/dts/hgp/hrs-ressusAbiImportation/edit/:cddRessusAbiDados',
                controller: 'hrs.ressusAbiImportationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-ressusAbiImportation/maintenance/ui/ressusAbiImportationMaintenance.html'
            })
            
            .state('dts/hgp/hrs-ressusAbiImportation.detail', {         
                url: '/dts/hgp/hrs-ressusAbiImportation/detail/:cddRessusAbiDados',
                controller: 'hrs.ressusAbiImportationMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrs-ressusAbiImportation/maintenance/ui/ressusAbiImportationMaintenance.html'
            });
            
});


