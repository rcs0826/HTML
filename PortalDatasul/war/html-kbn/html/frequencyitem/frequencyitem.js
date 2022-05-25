define(['index',
        '/dts/kbn/html/frequencyitem/frequencyitem.list.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/frequencyitem', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/frequencyitem.start', {
        url: '/dts/kbn/frequencyitem',
        controller: 'ekanban.frequencyitem.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/frequencyitem/frequencyitem.list.html'
    });
});
