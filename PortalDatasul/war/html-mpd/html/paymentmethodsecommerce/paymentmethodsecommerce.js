define([
    'index',
    '/dts/mpd/html/paymentmethodsecommerce/paymentmethodsecommerce-services.js'
], function(index) {

    index.stateProvider
    .state('dts/mpd/paymentmethodsecommerce', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/mpd/paymentmethodsecommerce.start', {
        url: '/dts/mpd/paymentmethodsecommerce',
        controller: 'mpd.paymentmethods.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/mpd/html/paymentmethodsecommerce/paymentmethodsecommerce.list.html'
    });
});
