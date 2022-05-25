define(['index',
    '/dts/hgp/html/hrs-reason/controller/reasonListController.js',
    '/dts/hgp/html/hrs-reason/maintenance/controller/reasonMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrs-reason', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrs-reason.start', {
                url: '/dts/hgp/hrs-reason/?showAsTable',
                params: {disclaimers: undefined},
                controller: 'hrs.reasonList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-reason/ui/reasonList.html'
            })
            
            .state('dts/hgp/hrs-reason.new', {
                url: '/dts/hgp/hrs-reason/new',
                controller: 'hrs.reasonMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-reason/maintenance/ui/reasonMaintenance.html'
            })

            .state('dts/hgp/hrs-reason.edit', {
                url: '/dts/hgp/hrs-reason/edit/:idMotivo/:idNatureza',
                controller: 'hrs.reasonMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-reason/maintenance/ui/reasonMaintenance.html'
            })
            
            .state('dts/hgp/hrs-reason.detail', {         
                url: '/dts/hgp/hrs-reason/detail/:idMotivo/:idNatureza',
                controller: 'hrs.reasonMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrs-reason/maintenance/ui/reasonMaintenance.html'
            })
            
});


