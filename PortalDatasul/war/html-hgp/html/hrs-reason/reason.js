define(['index',
    '/healthcare/hrs/html/reason/controller/reasonListController.js',
    '/healthcare/hrs/html/reason/maintenance/controller/reasonMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrs/reason', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrs/reason.start', {
                url: '/healthcare/hrs/reason/?showAsTable',
                params: {disclaimers: undefined},
                controller: 'hrs.reasonList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/reason/ui/reasonList.html'
            })
            
            .state('healthcare/hrs/reason.new', {
                url: '/healthcare/hrs/reason/new',
                controller: 'hrs.reasonMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/reason/maintenance/ui/reasonMaintenance.html'
            })

            .state('healthcare/hrs/reason.edit', {
                url: '/healthcare/hrs/reason/edit/:idMotivo/:idNatureza',
                controller: 'hrs.reasonMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/reason/maintenance/ui/reasonMaintenance.html'
            })
            
            .state('healthcare/hrs/reason.detail', {         
                url: '/healthcare/hrs/reason/detail/:idMotivo/:idNatureza',
                controller: 'hrs.reasonMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrs/html/reason/maintenance/ui/reasonMaintenance.html'
            })
            
});


