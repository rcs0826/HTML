define(['index',
    '/healthcare/hrs/html/justification/controller/justificationListController.js',
    '/healthcare/hrs/html/justification/maintenance/controller/justificationMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrs/justification', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrs/justification.start', {
                url: '/healthcare/hrs/justification/?showAsTable',
                params: {disclaimers: undefined},
                controller: 'hrs.justificationList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/justification/ui/justificationList.html'
            })
            
            .state('healthcare/hrs/justification.new', {
                url: '/healthcare/hrs/justification/new',
                controller: 'hrs.justificationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/justification/maintenance/ui/justificationMaintenance.html'
            })

            .state('healthcare/hrs/justification.edit', {
                url: '/healthcare/hrs/justification/edit/:idJustificativa',
                controller: 'hrs.justificationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/justification/maintenance/ui/justificationMaintenance.html'
            })
            
            .state('healthcare/hrs/justification.detail', {         
                url: '/healthcare/hrs/justification/detail/:idJustificativa',
                controller: 'hrs.justificationMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrs/html/justification/maintenance/ui/justificationMaintenance.html'
            })
            
});


