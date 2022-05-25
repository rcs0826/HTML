define([
    'index',
    '/dts/dts-utils/html/entitiesdatacharge/entitiesdatacharge-services.js'
], function(index) {

    index.stateProvider
    .state('dts/dts-utils/entitiesdatacharge', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/dts-utils/entitiesdatacharge.start', {
        url: '/dts/dts-utils/entitiesdatacharge/:integrationId/:defaultIntegrationId/:integrationType/:applicationId',
        controller: 'dts-utils.entitiesdatacharge.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/dts-utils/html/entitiesdatacharge/entitiesdatacharge.list.html'
    });
});
