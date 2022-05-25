define(['index',
        '/dts/kbn/html/itemupdate/itemupdate.list.js',
        '/dts/kbn/js/directives.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/itemupdate', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/itemupdate.start', {
        url: '/dts/kbn/itemupdate',
        controller: 'kbn.itemupdate.ListController',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/itemupdate/itemupdate.list.html'
    });
});
