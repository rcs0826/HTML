define([
    'index',
    '/dts/dts-utils/html/applicationdatacharge/applicationdatacharge-services.js'
], function(index) {

    index.stateProvider
    .state('dts/dts-utils/applicationdatacharge', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/dts-utils/applicationdatacharge.start', {
        url: '/dts/dts-utils/applicationdatacharge/:integrationId/:defaultIntegrationId/:integrationType',
        controller: 'dts-utils.applicationdatacharge.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/dts-utils/html/applicationdatacharge/applicationdatacharge.list.html'
    });
});
