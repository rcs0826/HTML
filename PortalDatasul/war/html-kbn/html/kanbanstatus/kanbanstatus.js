define(['index',
        '/dts/kbn/html/kanbanstatus/kanbanstatus.list.js',
        '/dts/kbn/js/directives.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/kanbanstatus', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/kanbanstatus.start', {
        url: '/dts/kbn/kanbanstatus',
        controller: 'kbn.kanbanstatus.ListController',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/kanbanstatus/kanbanstatus.list.html'
    });
});
