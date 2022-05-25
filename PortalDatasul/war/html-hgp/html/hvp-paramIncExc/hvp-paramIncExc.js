define(['index',
    '/dts/hgp/html/hvp-paramIncExc/controller/paramIncExcListController.js',
    '/dts/hgp/html/hvp-paramIncExc/maintenance/controller/paramIncExcMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hvp-paramIncExc', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hvp-paramIncExc.start', {
                url: '/dts/hgp/hvp-paramIncExc/?showAsTable',
                controller: 'hvp.paramIncExcList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-paramIncExc/ui/paramIncExcList.html'
            })
            
            .state('dts/hgp/hvp-paramIncExc.new', {
                url: '/dts/hgp/hvp-paramIncExc/new',
                controller: 'hvp.paramIncExcMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-paramIncExc/maintenance/ui/paramIncExcMaintenance.html'
            })

            .state('dts/hgp/hvp-paramIncExc.edit', {
                url: '/dts/hgp/hvp-paramIncExc/edit/:cddRegra',
                controller: 'hvp.paramIncExcMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-paramIncExc/maintenance/ui/paramIncExcMaintenance.html'
            })
            


            .state('dts/hgp/hvp-paramIncExc.detail', {         
                url: '/dts/hgp/hvp-paramIncExc/detail/:cddRegra',
                controller: 'hvp.paramIncExcMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hvp-paramIncExc/maintenance/ui/paramIncExcMaintenance.html'
            });
            
});


