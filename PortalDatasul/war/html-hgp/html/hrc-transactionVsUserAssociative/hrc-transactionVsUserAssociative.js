define(['index',
    '/dts/hgp/html/hrc-transactionVsUserAssociative/controller/transactionVsUserAssociativeListController.js',
    '/dts/hgp/html/hrc-transactionVsUserAssociative/maintenance/controller/transactionVsUserAssociativeMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrc-transactionVsUserAssociative', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-transactionVsUserAssociative.start', {
                url: '/dts/hgp/hrc-transactionVsUserAssociative/?showAsTable',
                controller: 'hrc.transactionVsUserAssociativeList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-transactionVsUserAssociative/ui/transactionVsUserAssociativeList.html'
            })
            
            .state('dts/hgp/hrc-transactionVsUserAssociative.new', {
                url: '/dts/hgp/hrc-transactionVsUserAssociative/new',
                controller: 'hrc.transactionVsUserAssociativeMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-transactionVsUserAssociative/maintenance/ui/transactionVsUserAssociativeMaintenance.html'
            })

            .state('dts/hgp/hrc-transactionVsUserAssociative.edit', {
                url: '/dts/hgp/hrc-transactionVsUserAssociative/edit/:cdTransacao/:cdUseridTransacao',
                controller: 'hrc.transactionVsUserAssociativeMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-transactionVsUserAssociative/maintenance/ui/transactionVsUserAssociativeMaintenance.html'
            })
            
            .state('dts/hgp/hrc-transactionVsUserAssociative.detail', {
                url: '/dts/hgp/hrc-transactionVsUserAssociative/detail/:cdTransacao/:cdUseridTransacao',
                controller: 'hrc.transactionVsUserAssociativeMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-transactionVsUserAssociative/maintenance/ui/transactionVsUserAssociativeDetail.html'
            });
            
});

