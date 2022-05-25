define(['index',
        '/dts/kbn/html/board/board.list.js',
        '/dts/kbn/html/board/board.view.js',
        '/dts/kbn/js/directives.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/board', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/board.start', {
        url: '/dts/kbn/board',
        controller: 'kbn.board.ListController',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/board/board.list.html'
    });

    stateProvider.state('dts/kbn/board.view', {
        url: '/dts/kbn/board/:id',
        controller: 'kbn.board.ViewController',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/board/board.view.html'
    });
});
