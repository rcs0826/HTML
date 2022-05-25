define(['index',
        '/dts/kbn/html/ctupdate/ctupdate.list.js',
        '/dts/kbn/js/directives.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/ctupdate', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/ctupdate.start', {
        url: '/dts/kbn/ctupdate',
        controller: 'kbn.ctupdate.ListController',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/ctupdate/ctupdate.list.html'
    });
});
