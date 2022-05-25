define(['index',
        '/dts/kbn/html/processexceptions/processexceptions.list.js',
        '/dts/kbn/js/directives.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/processexceptions', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/processexceptions.start', {
        url: '/dts/kbn/processexceptions',
        controller: 'kbn.processExceptions.Controller',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/processexceptions/processexceptions.list.html'
    });
});
