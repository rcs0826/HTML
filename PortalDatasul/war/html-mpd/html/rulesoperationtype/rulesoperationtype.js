define([
    'index',
    '/dts/mpd/html/rulesoperationtype/rulesoperationtype-services.js'
], function(index) {

    index.stateProvider
    .state('dts/mpd/rulesoperationtype', {
        abstract: true,
        template: '<ui-view/>'
    })
    .state('dts/mpd/rulesoperationtype.start', {
        url: '/dts/mpd/rulesoperationtype',
        controller: 'mpd.rulesoperationtype.list.control',
        controllerAs: 'controller',
        templateUrl: '/dts/mpd/html/rulesoperationtype/rulesoperationtype.list.html'
    });
});
