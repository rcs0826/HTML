define(['index',
        '/dts/kbn/html/supermarketstatus/supermarketstatus.list.js',
        '/dts/kbn/js/directives.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/supermarketstatus', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/supermarketstatus.start', {
        url: '/dts/kbn/supermarketstatus',
        controller: 'kbn.supermarketstatus.ListController',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/supermarketstatus/supermarketstatus.list.html'
    });
});
