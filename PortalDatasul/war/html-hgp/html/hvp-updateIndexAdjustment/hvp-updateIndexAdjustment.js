define(['index',
    '/dts/hgp/html/js/global/healthcare-services.js',
    '/dts/hgp/html/hvp-updateIndexAdjustment/updateIndexAdjustmentFactory.js',
    '/dts/hgp/html/hvp-updateIndexAdjustment/controller/updateIndexAdjustmentController.js'],
    function (index) {

        index.stateProvider
            .state('dts/hgp/hvp-updateIndexAdjustment', {
            abstract: true,
            template: '<ui-view/>'
        })
            .state('dts/hgp/hvp-updateIndexAdjustment.start', {
            url: '/dts/hgp/hvp-updateIndexAdjustment/',
            controller: 'healthcare.hvp.updateindexadjustment.Control as controller',
            controllerAs: 'controller',
            templateUrl: '/dts/hgp/html/hvp-updateIndexAdjustment/ui/updateIndexAdjustment.html'
        })
    });