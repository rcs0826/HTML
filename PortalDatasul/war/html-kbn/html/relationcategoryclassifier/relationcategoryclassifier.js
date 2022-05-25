define(['index',
        '/dts/kbn/html/relationcategoryclassifier/relationcategoryclassifier.list.js',
        '/dts/kbn/html/relationcategoryclassifier/relationcategoryclassifier.view.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/relationcategoryclassifier', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/relationcategoryclassifier.start', {
        url: '/dts/kbn/relationcategoryclassifier',
        controller: 'kbn.relationcategoryclassifier.Controller',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/relationcategoryclassifier/relationcategoryclassifier.list.html'
    });

    stateProvider.state('dts/kbn/relationcategoryclassifier.view', {
        url: '/dts/kbn/relationcategoryclassifier/:id',
        controller: 'kbn.relationcategoryclassifier.ViewController',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/relationcategoryclassifier/relationcategoryclassifier.view.html'
    });
});
