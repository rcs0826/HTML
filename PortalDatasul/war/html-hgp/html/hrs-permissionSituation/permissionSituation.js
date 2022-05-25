define(['index',
    '/healthcare/hrs/html/permissionSituation/controller/permissionSituationListController.js',
    '/healthcare/hrs/html/permissionSituation/maintenance/controller/permissionSituationMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrs/permissionSituation', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrs/permissionSituation.start', {
                url: '/healthcare/hrs/permissionSituation/?showAsTable',
                controller: 'hrs.permissionSituationList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/permissionSituation/ui/permissionSituationList.html'
            })
            
            .state('healthcare/hrs/permissionSituation.new', {
                url: '/healthcare/hrs/permissionSituation/new',
                controller: 'hrs.permissionSituationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/permissionSituation/maintenance/ui/permissionSituationMaintenance.html'
            })

            .state('healthcare/hrs/permissionSituation.edit', {
                url: '/healthcare/hrs/permissionSituation/edit/:codGrp',
                controller: 'hrs.permissionSituationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrs/html/permissionSituation/maintenance/ui/permissionSituationMaintenance.html'
            })
            
            .state('healthcare/hrs/permissionSituation.detail', {         
                url: '/healthcare/hrs/permissionSituation/detail/:codGrp',
                controller: 'hrs.permissionSituationMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrs/html/permissionSituation/maintenance/ui/permissionSituationMaintenance.html'
            });
            
});
