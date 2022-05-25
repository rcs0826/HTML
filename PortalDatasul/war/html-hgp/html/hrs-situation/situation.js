define(['index',
    '/healthcare/hrs/html/situation/controller/situationListController.js',
    '/healthcare/hrs/html/situation/maintenance/controller/situationMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrs/situation', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrs/situation.start', {
                url: '/healthcare/hrs/situation/?showAsTable',
                controller: 'hrs.situationList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/situation/ui/situationList.html'
            })
            
            .state('healthcare/hrs/situation.new', {
                url: '/healthcare/hrs/situation/new',
                controller: 'hrs.situationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/situation/maintenance/ui/situationMaintenance.html'
            })

            .state('healthcare/hrs/situation.edit', {
                url: '/healthcare/hrs/situation/edit/:idSituacao',
                controller: 'hrs.situationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/situation/maintenance/ui/situationMaintenance.html'
            })
            
            .state('healthcare/hrs/situation.detail', {         
                url: '/healthcare/hrs/situation/detail/:idSituacao',
                controller: 'hrs.situationMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrs/html/situation/maintenance/ui/situationMaintenance.html'
            });
            
});


