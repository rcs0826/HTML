define([
    'index',
    '/dts/mpd/html/paymentciashoptransactions/paymentciashoptransactions-services.js'
], function(index) {

    index.stateProvider
    .state('dts/mpd/paymentciashoptransactions', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/mpd/paymentciashoptransactions.start', {
        url: '/dts/mpd/paymentciashoptransactions',
        controller: 'mpd.paymentciashoptransactions.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/mpd/html/paymentciashoptransactions/paymentciashoptransactions.list.html'
    })    
    .state('dts/mpd/paymentciashoptransactions.detail', {
        url:'/dts/mpd/paymentciashoptransactions/detail/:nomeAbrev/:nrPedCli',
        controller:'mpd.paymentciashoptransactions.detail.Control',
        controllerAs: 'controller',
        templateUrl:'/dts/mpd/html/paymentciashoptransactions/paymentciashoptransactions.detail.html'
    })
});
