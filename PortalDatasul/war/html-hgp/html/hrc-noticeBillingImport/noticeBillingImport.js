define(['index',
    '/healthcare/hrc/html/noticeBillingImport/controller/noticeBillingImportListController.js',
    '/healthcare/hrc/html/noticeBillingImport/maintenance/controller/noticeBillingImportMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hrc/noticeBillingImport', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hrc/noticeBillingImport.start', {
                url: '/healthcare/hrc/noticeBillingImport/?showAsTable',
                controller: 'hrc.noticeBillingImportList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrc/html/noticeBillingImport/ui/noticeBillingImportList.html'
            })
            
            .state('healthcare/hrc/noticeBillingImport.edit', {
                url: '/healthcare/hrc/noticeBillingImport/edit/:cddSeq',
                controller: 'hrc.noticeBillingImportMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hrc/html/noticeBillingImport/maintenance/ui/noticeBillingImportMaintenance.html'
            })

            .state('healthcare/hrc/noticeBillingImport.detail', {         
                url: '/healthcare/hrc/noticeBillingImport/detail/:cddSeq',
                controller: 'hrc.noticeBillingImportMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hrc/html/noticeBillingImport/maintenance/ui/noticeBillingImportMaintenance.html'
            });
            
});


