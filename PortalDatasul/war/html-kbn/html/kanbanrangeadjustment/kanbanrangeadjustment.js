define(['index',
        '/dts/kbn/html/kanbanrangeadjustment/kanbanrangeadjustment.import.js',
        '/dts/kbn/html/kanbanrangeadjustment/kanbanrangeadjustment.simulation.js',
        '/dts/kbn/js/directives.js'
], function(index) {

    var stateProvider = index.stateProvider;
    stateProvider.state('dts/kbn/kanbanrangeadjustment', {
        abstract: true,
        template: '<br><ui-view/>'
    });

    stateProvider.state('dts/kbn/kanbanrangeadjustment.start', {
        url: '/dts/kbn/kanbanrangeadjustment',
        controller: 'ekanban.kanbanrangeadjustment.ImportCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/kanbanrangeadjustment/kanbanrangeadjustment.import.html'
    });

    stateProvider.state('dts/kbn/kanbanrangeadjustment.view', {
        url: '/dts/kbn/kanbanrangeadjustment/simulation',
        controller: 'ekanban.kanbanrangeadjustment.SimulationCtrl',
        controllerAs: 'controller',
        templateUrl: '/dts/kbn/html/kanbanrangeadjustment/kanbanrangeadjustment.simulation.html'
    });

});
