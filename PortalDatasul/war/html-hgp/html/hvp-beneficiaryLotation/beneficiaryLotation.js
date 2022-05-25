define(['index',
    '/healthcare/hvp/html/beneficiaryLotation/controller/beneficiaryLotationListController.js',
    '/healthcare/hvp/html/beneficiaryLotation/maintenance/controller/beneficiaryLotationMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('healthcare/hvp/beneficiaryLotation', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hvp/beneficiaryLotation.start', {
                url: '/healthcare/hvp/beneficiaryLotation/?showAsTable',
                controller: 'hvp.beneficiaryLotationList.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/beneficiaryLotation/ui/beneficiaryLotationList.html'
            })
            
            .state('healthcare/hvp/beneficiaryLotation.new', {
                url: '/healthcare/hvp/beneficiaryLotation/new',
                controller: 'hvp.beneficiaryLotationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/beneficiaryLotation/maintenance/ui/beneficiaryLotationMaintenance.html'
            })

            .state('healthcare/hvp/beneficiaryLotation.edit', {
                url: '/healthcare/hvp/beneficiaryLotation/edit/:cdnLotac',
                controller: 'hvp.beneficiaryLotationMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hvp/html/beneficiaryLotation/maintenance/ui/beneficiaryLotationMaintenance.html'
            })
            
            .state('healthcare/hvp/beneficiaryLotation.detail', {         
                url: '/healthcare/hvp/beneficiaryLotation/detail/:cdnLotac',
                controller: 'hvp.beneficiaryLotationMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/healthcare/hvp/html/beneficiaryLotation/maintenance/ui/beneficiaryLotationDetail.html'
            });
            
});


