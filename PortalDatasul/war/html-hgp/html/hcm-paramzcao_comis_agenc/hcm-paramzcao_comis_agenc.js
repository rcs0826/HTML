define(['index',
    '/dts/hgp/html/hcm-paramzcao_comis_agenc/controller/paramzcao_comis_agencListController.js',
    '/dts/hgp/html/hcm-paramzcao_comis_agenc/maintenance/controller/paramzcao_comis_agencMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hcm-paramzcao_comis_agenc', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hcm-paramzcao_comis_agenc.start', {
                url: '/dts/hgp/hcm-paramzcao_comis_agenc/?showAsTable',
                controller: 'hcm.paramzcao_comis_agencList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcm-paramzcao_comis_agenc/ui/paramzcao_comis_agencList.html'
            })
            
            .state('dts/hgp/hcm-paramzcao_comis_agenc.new', {
                url: '/dts/hgp/hcm-paramzcao_comis_agenc/new',
                controller: 'hcm.paramzcao_comis_agencMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcm-paramzcao_comis_agenc/maintenance/ui/paramzcao_comis_agencMaintenance.html'
            })

            .state('dts/hgp/hcm-paramzcao_comis_agenc.edit', {
                url: '/dts/hgp/hcm-paramzcao_comis_agenc/edit/:idRegra',
                controller: 'hcm.paramzcao_comis_agencMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcm-paramzcao_comis_agenc/maintenance/ui/paramzcao_comis_agencMaintenance.html'
            })
            
            .state('dts/hgp/hcm-paramzcao_comis_agenc.detail', {         
                url: '/dts/hgp/hcm-paramzcao_comis_agenc/detail/:idRegra',
                controller: 'hcm.paramzcao_comis_agencMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hcm-paramzcao_comis_agenc/maintenance/ui/paramzcao_comis_agencMaintenance.html'
            });
            
});
