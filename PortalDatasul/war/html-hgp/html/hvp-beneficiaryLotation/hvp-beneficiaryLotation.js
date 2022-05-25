define(['index',
    '/dts/hgp/html/hvp-beneficiaryLotation/controller/beneficiaryLotationListController.js',
    '/dts/hgp/html/hvp-beneficiaryLotation/maintenance/controller/beneficiaryLotationMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hvp-beneficiaryLotation', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hvp-beneficiaryLotation.start', {
                url: '/dts/hgp/hvp-beneficiaryLotation/?showAsTable',
                controller: 'hvp.beneficiaryLotationList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-beneficiaryLotation/ui/beneficiaryLotationList.html'
            })
            
            .state('dts/hgp/hvp-beneficiaryLotation.new', {
                url: '/dts/hgp/hvp-beneficiaryLotation/new',
                controller: 'hvp.beneficiaryLotationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-beneficiaryLotation/maintenance/ui/beneficiaryLotationMaintenance.html'
            })

            .state('dts/hgp/hvp-beneficiaryLotation.edit', {
                url: '/dts/hgp/hvp-beneficiaryLotation/edit/:cdnLotac',
                controller: 'hvp.beneficiaryLotationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hvp-beneficiaryLotation/maintenance/ui/beneficiaryLotationMaintenance.html'
            })
            
            .state('dts/hgp/hvp-beneficiaryLotation.detail', {         
                url: '/dts/hgp/hvp-beneficiaryLotation/detail/:cdnLotac',
                controller: 'hvp.beneficiaryLotationMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hvp-beneficiaryLotation/maintenance/ui/beneficiaryLotationDetail.html'
            });
            
});


