define(['index',
    '/dts/hgp/html/hrc-period/periodFactory.js',
    '/dts/hgp/html/hrc-period/controller/periodListController.js',
    '/dts/hgp/html/hrc-period/maintenance/controller/periodMaintenanceController.js'
    ], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrc-period', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-period.start', {
                url: '/dts/hgp/hrc-period/?showAsTable',
                controller: 'hrc.periodList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-period/ui/periodList.html'
            })

            .state('dts/hgp/hrc-period.new', {
                url: '/dts/hgp/hrc-period/new',
                controller: 'hrc.periodMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-period/maintenance/ui/periodMaintenance.html'
            })

            .state('dts/hgp/hrc-period.detail', {
                url: '/dts/hgp/hrc-period/detail/:dtAnoref/:nrPerref',
                controller: 'hrc.periodMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-period/maintenance/ui/periodDetail.html'
            })
           
            .state('dts/hgp/hrc-period.edit', {
                url: '/dts/hgp/hrc-period/edit/:dtAnoref/:nrPerref',
                controller: 'hrc.periodMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-period/maintenance/ui/periodMaintenance.html'
            })

            
});
