define([
    'index',
    '/dts/dts-utils/html/configdatacharge/configdatacharge-services.js'
], function(index) {

    index.stateProvider
    .state('dts/dts-utils/configdatacharge', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/dts-utils/configdatacharge.start', {
        url: '/dts/dts-utils/configdatacharge',
        controller: 'dts-utils.configdatacharge.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/dts-utils/html/configdatacharge/configdatacharge.list.html'
    });
});
