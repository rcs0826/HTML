define(['index',
        '/dts/kbn/html/cellupdate/cellupdate.list.js',
        '/dts/kbn/js/directives.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/cellupdate', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/cellupdate.start', {
        url: '/dts/kbn/cellupdate',
        controller: 'kbn.cellupdate.ListController',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/cellupdate/cellupdate.list.html'
    });
});
