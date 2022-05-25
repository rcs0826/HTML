define(['index',
        '/dts/kbn/html/cellprogramming/cellprogramming.list.js',
        '/dts/kbn/html/cellprogramming/cellprogramming.view.js',
        '/dts/kbn/js/directives.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/cellprogramming', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/cellprogramming.start', {
        url: '/dts/kbn/cellprogramming',
        controller: 'kbn.cellProgramming.Controller',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/cellprogramming/cellprogramming.list.html'
    });
    
    stateProvider.state('dts/kbn/cellprogramming.view', {
        url: '/dts/kbn/cellprogramming/:id',
        controller: 'kbn.cellProgramming.ViewController',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/cellprogramming/cellprogramming.view.html'
    });

});
