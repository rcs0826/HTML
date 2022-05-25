define(['index',
        '/dts/hgp/html/hrc-pooler/controller/poolerListController.js',
        '/dts/hgp/html/hrc-pooler/maintenance/controller/poolerMaintenanceController.js'], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrc-pooler', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-pooler.start', {
                url: '/dts/hgp/hrc-pooler/?showAsTable',
                controller: 'hrc.poolerList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-pooler/ui/poolerList.html'
            })
            
            .state('dts/hgp/hrc-pooler.new', {
                url: '/dts/hgp/hrc-pooler/new',
                controller: 'hrc.poolerMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-pooler/maintenance/ui/poolerMaintenance.html'
            })

            .state('dts/hgp/hrc-pooler.edit', {
                url: '/dts/hgp/hrc-pooler/edit/:cdnAgrupRegraFaturam',
                controller: 'hrc.poolerMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-pooler/maintenance/ui/poolerMaintenance.html'
            })
            
            .state('dts/hgp/hrc-pooler.detail', {
                url: '/dts/hgp/hrc-pooler/detail/:cdnAgrupRegraFaturam',
                controller: 'hrc.poolerMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-pooler/maintenance/ui/poolerDetail.html'
            });
            
});
