define(['index',
    '/dts/hgp/html/hrs-nature/controller/natureListController.js',
    '/dts/hgp/html/hrs-nature/maintenance/controller/natureMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrs-nature', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrs-nature.start', {
                url: '/dts/hgp/hrs-nature/?showAsTable',
                controller: 'hrs.natureList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-nature/ui/natureList.html'
            })
            
            .state('dts/hgp/hrs-nature.new', {
                url: '/dts/hgp/hrs-nature/new',
                controller: 'hrs.natureMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-nature/maintenance/ui/natureMaintenance.html'
            })

            .state('dts/hgp/hrs-nature.edit', {
                url: '/dts/hgp/hrs-nature/edit/:idNatureza',
                controller: 'hrs.natureMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-nature/maintenance/ui/natureMaintenance.html'
            })

            .state('dts/hgp/hrs-nature.detail', {         
                url: '/dts/hgp/hrs-nature/detail/:idNatureza',
                controller: 'hrs.natureMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrs-nature/maintenance/ui/natureMaintenance.html'
            });
            
});


