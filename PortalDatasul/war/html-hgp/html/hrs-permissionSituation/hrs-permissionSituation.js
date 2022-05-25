define(['index',
    '/dts/hgp/html/hrs-permissionSituation/controller/permissionSituationListController.js',
    '/dts/hgp/html/hrs-permissionSituation/maintenance/controller/permissionSituationMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrs-permissionSituation', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrs-permissionSituation.start', {
                url: '/dts/hgp/hrs-permissionSituation/?showAsTable',
                controller: 'hrs.permissionSituationList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-permissionSituation/ui/permissionSituationList.html'
            })
            
            .state('dts/hgp/hrs-permissionSituation.new', {
                url: '/dts/hgp/hrs-permissionSituation/new',
                controller: 'hrs.permissionSituationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-permissionSituation/maintenance/ui/permissionSituationMaintenance.html'
            })

            .state('dts/hgp/hrs-permissionSituation.edit', {
                url: '/dts/hgp/hrs-permissionSituation/edit/:codGrp',
                controller: 'hrs.permissionSituationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-permissionSituation/maintenance/ui/permissionSituationMaintenance.html'
            })
            
            .state('dts/hgp/hrs-permissionSituation.detail', {         
                url: '/dts/hgp/hrs-permissionSituation/detail/:codGrp',
                controller: 'hrs.permissionSituationMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrs-permissionSituation/maintenance/ui/permissionSituationMaintenance.html'
            });
            
});
