define(['index',
        '/dts/kbn/html/formula/formula.list.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/formula', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/formula.start', {
        url: '/dts/kbn/formula',
        controller: 'ekanban.formula.ListCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/formula/formula.list.html'
    });

});
