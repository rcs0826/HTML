define(['index',
    '/dts/hgp/html/hrs-situation/controller/situationListController.js',
    '/dts/hgp/html/hrs-situation/maintenance/controller/situationMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrs-situation', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrs-situation.start', {
                url: '/dts/hgp/hrs-situation/?showAsTable',
                controller: 'hrs.situationList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-situation/ui/situationList.html'
            })
            
            .state('dts/hgp/hrs-situation.new', {
                url: '/dts/hgp/hrs-situation/new',
                controller: 'hrs.situationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-situation/maintenance/ui/situationMaintenance.html'
            })

            .state('dts/hgp/hrs-situation.edit', {
                url: '/dts/hgp/hrs-situation/edit/:idSituacao',
                controller: 'hrs.situationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrs-situation/maintenance/ui/situationMaintenance.html'
            })
            
            .state('dts/hgp/hrs-situation.detail', {         
                url: '/dts/hgp/hrs-situation/detail/:idSituacao',
                controller: 'hrs.situationMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrs-situation/maintenance/ui/situationMaintenance.html'
            });
            
});


