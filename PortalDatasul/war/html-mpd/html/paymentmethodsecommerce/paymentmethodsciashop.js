define([
    'index',
    '/dts/mpd/html/paymentmethodsciashop/paymentmethodsciashop-services.js'
], function(index) {

    index.stateProvider
    .state('dts/mpd/paymentmethodsciashop', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/mpd/paymentmethodsciashop.start', {
        url: '/dts/mpd/paymentmethodsciashop',
        controller: 'mpd.paymentmethods.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/mpd/html/paymentmethodsciashop/paymentmethodsciashop.list.html'
    });
});
