define([
    'index',
    '/dts/mft/html/anticipatedbilling/anticipatedbilling-services.js'
], function(index) {

    index.stateProvider
    .state('dts/mft/anticipatedbilling', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/mft/anticipatedbilling.start', {
        url: '/dts/mft/anticipatedbilling',
        controller: 'mft.anticipatedbilling.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/mft/html/anticipatedbilling/anticipatedbilling.list.html'
    });
});
