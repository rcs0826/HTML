define(['index',
    '/dts/hgp/html/hrs-justification/controller/justificationListController.js',
    '/dts/hgp/html/hrs-justification/maintenance/controller/justificationMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrs-justification', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrs-justification.start', {
                url: '/dts/hgp/hrs-justification/?showAsTable',
                params: {disclaimers: undefined},
                controller: 'hrs.justificationList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-justification/ui/justificationList.html'
            })
            
            .state('dts/hgp/hrs-justification.new', {
                url: '/dts/hgp/hrs-justification/new',
                controller: 'hrs.justificationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-justification/maintenance/ui/justificationMaintenance.html'
            })

            .state('dts/hgp/hrs-justification.edit', {
                url: '/dts/hgp/hrs-justification/edit/:idJustificativa',
                controller: 'hrs.justificationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-justification/maintenance/ui/justificationMaintenance.html'
            })
            
            .state('dts/hgp/hrs-justification.detail', {         
                url: '/dts/hgp/hrs-justification/detail/:idJustificativa',
                controller: 'hrs.justificationMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrs-justification/maintenance/ui/justificationMaintenance.html'
            })
            
});


