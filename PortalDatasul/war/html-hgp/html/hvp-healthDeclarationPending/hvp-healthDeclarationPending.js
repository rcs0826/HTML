define(['index',    
    '/dts/hgp/html/hvp-healthDeclarationPending/controller/healthDeclarationPendingListController.js',
    '/dts/hgp/html/hvp-healthDeclarationPending/maintenance/controller/healthDeclarationPendingMaintenanceController.js'

	],function (index) {

    index.stateProvider 

            .state('dts/hgp/hvp-healthDeclarationPending', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hvp-healthDeclarationPending.start', {
                url: '/dts/hgp/hvp-healthDeclarationPending/',
                controller: 'hvp.healthDeclartionpendingController',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-healthDeclarationPending/ui/healthDeclarationPendingList.html'
            })
			
            .state('dts/hgp/hvp-healthDeclarationPending.detail', {
                url: '/dts/hgp/hvp-healthDeclarationPending/detail/:id',
                controller: 'hvp.healthDeclarationPendingMaintenanceController',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-healthDeclarationPending/maintenance/ui/healthDeclarationPendingMaintenance.html'
            });
});

            