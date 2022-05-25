define(['index',    
    '/healthcare/hvp/html/healthDeclarationPending/controller/healthDeclarationPendingListController.js',
    '/healthcare/hvp/html/healthDeclarationPending/maintenance/controller/healthDeclarationPendingMaintenanceController.js'

	],function (index) {

    index.stateProvider 

            .state('healthcare/hvp/healthDeclarationPending', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hvp/healthDeclarationPending.start', {
                url: '/healthcare/hvp/healthDeclarationPending/',
                controller: 'hvp.healthDeclartionpendingController',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/healthDeclarationPending/ui/healthDeclarationPendingList.html'
            })
			
            .state('healthcare/hvp/healthDeclarationPending.detail', {
                url: '/healthcare/hvp/healthDeclarationPending/detail/:id',
                controller: 'hvp.healthDeclarationPendingMaintenanceController',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/healthDeclarationPending/maintenance/ui/healthDeclarationPendingMaintenance.html'
            });
});

            