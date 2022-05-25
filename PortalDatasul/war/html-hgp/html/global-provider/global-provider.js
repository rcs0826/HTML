define(['index', 
    //    '/dts/hgp/html/global-provider/providerFactory.js',
        '/dts/hgp/html/global-provider/detail/providerDetailController.js',        
        '/dts/hgp/html/global-provider/controller/providerListController.js',
        '/dts/hgp/html/global-provider/maintenance/controller/providerMaintenanceController.js'], function(index) {

    index.stateProvider
	
        .state('dts/hgp/global-provider', {
            abstract: true,
            template: '<ui-view/>'
        })
		
        .state('dts/hgp/global-provider.detail', {
            url:'/dts/hgp/global-provider/detail/:cdUnidCdPrestador',
            controller:'global.providerDetail.Control',
            controllerAs:'controller',
            templateUrl:'/dts/hgp/html/global-provider/detail/provider.detail.html'
        })
/*
        .state('dts/hgp/global-provider.maintenance', {
            url:'/dts/hgp/html/global-provider/new',
            controller:'global.providerMaintenance.Control',
            controllerAs:'controller',
            templateUrl:'/dts/hgp/html/global-provider/maintenance/ui/providerMaintenance.html'
        })
*/
        .state('dts/hgp/global-provider.start', {
            url: '/dts/hgp/global-provider/?showAsTable',
            controller: 'global.providerList.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/hgp/html/global-provider/ui/providerList.html'
        })
        
        .state('dts/hgp/global-provider.new', {
            url: '/dts/hgp/global-provider/new',
            controller: 'global.providerMaintenance.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/hgp/html/global-provider/maintenance/ui/providerMaintenance.html'
        })

        .state('dts/hgp/global-provider.edit', {
            url: '/dts/hgp/global-provider/edit/:cdUnidade/:cdPrestador',
            controller: 'global.providerMaintenance.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/hgp/html/global-provider/maintenance/ui/providerMaintenance.html'
        });
        
        /*.state('dts/hgp/global-provider.detail', {
            url: '/dts/hgp/html/global-provider/detail/:cdUnidade/:cdPrestador',
            controller: 'global.providerMaintenance.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/hgp/html/global-provider/ui/provider.detail.html'
        //    templateUrl: '/dts/hgp/html/global-provider/maintenance/ui/providerDetail.html'
        });*/

});