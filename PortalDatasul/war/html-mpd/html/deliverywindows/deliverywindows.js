define([
    'index',
    '/dts/mpd/html/deliverywindows/deliverywindows-services.js'
], function(index) {

    index.stateProvider
    .state('dts/mpd/deliverywindows', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/mpd/deliverywindows.start', {
        url: '/dts/mpd/deliverywindows',
        controller: 'mpd.deliverywindows.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/mpd/html/deliverywindows/deliverywindows.list.html'
    });
});
