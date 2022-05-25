define(['index',
    '/dts/hgp/html/hmc-benefExclusionReceipt/controller/benefExclusionReceiptController.js'], function (index) {

    index.stateProvider 

            .state('dts/hgp/hmc-benefExclusionReceipt', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hmc-benefExclusionReceipt.start', {
                url: '/dts/hgp/hmc-benefExclusionReceipt/?showAsTable',
                controller: 'hmc.benefExclusionReceiptController',
                controllerAs: 'controller',

                templateUrl: '/dts/hgp/html/hmc-benefExclusionReceipt/ui/benefExclusionReceipt.html'
            })                               
});