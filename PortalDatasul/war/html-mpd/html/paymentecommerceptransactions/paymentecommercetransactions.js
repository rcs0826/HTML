define([
    'index',
    '/dts/mpd/html/paymentecommercetransactions/paymentecommercetransactions-services.js'
], function(index) {

    index.stateProvider
    .state('dts/mpd/paymentecommercetransactions', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/mpd/paymentecommercetransactions.start', {
        url: '/dts/mpd/paymentecommercetransactions',
        controller: 'mpd.paymentecommercetransactions.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/mpd/html/paymentecommercetransactions/paymentecommercetransactions.list.html'
    })    
    .state('dts/mpd/paymentecommercetransactions.detail', {
        url:'/dts/mpd/paymentecommercetransactions/detail/:nomeAbrev/:nrPedCli',
        controller:'mpd.paymentecommercetransactions.detail.Control',
        controllerAs: 'controller',
        templateUrl:'/dts/mpd/html/paymentecommercetransactions/paymentecommercetransactions.detail.html'
    })
});
