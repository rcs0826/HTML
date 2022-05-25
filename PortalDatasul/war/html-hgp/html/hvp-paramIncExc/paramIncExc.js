define(['index',
    '/healthcare/hvp/html/paramIncExc/controller/paramIncExcListController.js',
    '/healthcare/hvp/html/paramIncExc/maintenance/controller/paramIncExcMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hvp/paramIncExc', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hvp/paramIncExc.start', {
                url: '/healthcare/hvp/paramIncExc/?showAsTable',
                controller: 'hvp.paramIncExcList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/paramIncExc/ui/paramIncExcList.html'
            })
            
            .state('healthcare/hvp/paramIncExc.new', {
                url: '/healthcare/hvp/paramIncExc/new',
                controller: 'hvp.paramIncExcMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/paramIncExc/maintenance/ui/paramIncExcMaintenance.html'
            })

            .state('healthcare/hvp/paramIncExc.edit', {
                url: '/healthcare/hvp/paramIncExc/edit/:cddRegra',
                controller: 'hvp.paramIncExcMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/paramIncExc/maintenance/ui/paramIncExcMaintenance.html'
            })
            


            .state('healthcare/hvp/paramIncExc.detail', {         
                url: '/healthcare/hvp/paramIncExc/detail/:cddRegra',
                controller: 'hvp.paramIncExcMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hvp/html/paramIncExc/maintenance/ui/paramIncExcMaintenance.html'
            });
            
});


