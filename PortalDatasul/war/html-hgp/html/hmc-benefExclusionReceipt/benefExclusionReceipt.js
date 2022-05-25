define(['index',
    '/healthcare/hmc/html/benefExclusionReceipt/controller/benefExclusionReceiptController.js'], function (index) {

    index.stateProvider 

            .state('healthcare/hmc/benefExclusionReceipt', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('healthcare/hmc/benefExclusionReceipt.start', {
                url: '/healthcare/hmc/benefExclusionReceipt/?showAsTable',
                controller: 'hmc.benefExclusionReceiptController',
                controllerAs: 'controller',
                templateUrl: '/healthcare/hmc/html/benefExclusionReceipt/ui/benefExclusionReceipt.html'
            })                               
});