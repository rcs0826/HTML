define([
    'index',
    '/dts/mpd/html/internalcustomers/internalcustomers-services.js'
], function(index) {

    index.stateProvider
    .state('dts/mpd/internalcustomers', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/mpd/internalcustomers.start', {
        url: '/dts/mpd/internalcustomers/:portletopen',
        controller: 'mpd.internalcustomers.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/mpd/html/internalcustomers/internalcustomers.list.html'
    });
});
