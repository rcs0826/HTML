define(['index',
    '/dts/hgp/html/hrc-noticeBillingImport/controller/noticeBillingImportListController.js',
    '/dts/hgp/html/hrc-noticeBillingImport/maintenance/controller/noticeBillingImportMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hrc-noticeBillingImport', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hrc-noticeBillingImport.start', {
                url: '/dts/hgp/hrc-noticeBillingImport/?showAsTable',
                controller: 'hrc.noticeBillingImportList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-noticeBillingImport/ui/noticeBillingImportList.html'
            })
            
            .state('dts/hgp/hrc-noticeBillingImport.edit', {
                url: '/dts/hgp/hrc-noticeBillingImport/edit/:cddSeq',
                controller: 'hrc.noticeBillingImportMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hrc-noticeBillingImport/maintenance/ui/noticeBillingImportMaintenance.html'
            })

            .state('dts/hgp/hrc-noticeBillingImport.detail', {         
                url: '/dts/hgp/hrc-noticeBillingImport/detail/:cddSeq',
                controller: 'hrc.noticeBillingImportMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hrc-noticeBillingImport/maintenance/ui/noticeBillingImportMaintenance.html'
            });
            
});


