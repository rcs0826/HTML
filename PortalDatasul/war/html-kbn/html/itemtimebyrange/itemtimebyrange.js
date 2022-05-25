define(['index',
        '/dts/kbn/html/itemtimebyrange/itemtimebyrange.list.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/itemtimebyrange', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/itemtimebyrange.start', {
        url: '/dts/kbn/itemtimebyrange',
        controller: 'ekanban.itemtimebyrange.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/itemtimebyrange/itemtimebyrange.list.html'
    });
});
