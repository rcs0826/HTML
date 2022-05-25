define(['index',
    '/healthcare/hrs/html/nature/controller/natureListController.js',
    '/healthcare/hrs/html/nature/maintenance/controller/natureMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrs/nature', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrs/nature.start', {
                url: '/healthcare/hrs/nature/?showAsTable',
                controller: 'hrs.natureList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/nature/ui/natureList.html'
            })
            
            .state('healthcare/hrs/nature.new', {
                url: '/healthcare/hrs/nature/new',
                controller: 'hrs.natureMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/nature/maintenance/ui/natureMaintenance.html'
            })

            .state('healthcare/hrs/nature.edit', {
                url: '/healthcare/hrs/nature/edit/:idNatureza',
                controller: 'hrs.natureMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/nature/maintenance/ui/natureMaintenance.html'
            })

            .state('healthcare/hrs/nature.detail', {         
                url: '/healthcare/hrs/nature/detail/:idNatureza',
                controller: 'hrs.natureMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrs/html/nature/maintenance/ui/natureMaintenance.html'
            });
            
});


