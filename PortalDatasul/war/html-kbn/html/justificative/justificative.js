define(['index',
        '/dts/kbn/html/justificative/justificative.list.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/justificative', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/justificative.start', {
        url: '/dts/kbn/justificative',
        controller: 'ekanban.justificative.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/justificative/justificative.list.html'
    });

});
