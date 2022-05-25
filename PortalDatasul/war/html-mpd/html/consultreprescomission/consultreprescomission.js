define(['index', '/dts/mpd/html/consultreprescomission/consultreprescomission-controllers.js'],
function(index) {
    index.stateProvider
        .state('dts/mpd/consultreprescomission', {
            abstract: true,
            template: '<ui-view/>'
        })
        .state('dts/mpd/consultreprescomission.start', {
            url:'/dts/mpd/consultreprescomission',
            controller:'mpd.consultreprescomission-list.Control',
            controllerAs: 'controller',
            templateUrl:'/dts/mpd/html/consultreprescomission/consultreprescomission.list.html'
        });
});