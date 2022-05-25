define([
    'index',
    '/dts/mpd/html/internalsalesorders/internalsalesorders-services.js'
], function(index) {

    index.stateProvider
    .state('dts/mpd/internalsalesorders', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/mpd/internalsalesorders.start', {
        url: '/dts/mpd/internalsalesorders/',
        controller: 'mpd.internalsalesorders.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/mpd/html/internalsalesorders/internalsalesorders.list.html'
    })
    .state('dts/mpd/internalsalesorders.openby', {
        url: '/dts/mpd/internalsalesorders/:openby',
        controller: 'mpd.internalsalesorders.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/mpd/html/internalsalesorders/internalsalesorders.list.html'
    })
    .state('dts/mpd/internalsalesorders.openbycustomer', {
        url: '/dts/mpd/internalsalesorders/:openby/:customershorname',
        controller: 'mpd.internalsalesorders.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/mpd/html/internalsalesorders/internalsalesorders.list.html'
    });
});
