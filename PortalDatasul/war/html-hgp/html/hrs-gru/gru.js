define(['index',
        '/healthcare/hrs/html/gru/controller/gruListController.js',
        '/healthcare/hrs/html/gru/maintenance/controller/gruMaintenanceController.js'], 
    function (index) {
        index.stateProvider
        
        .state('healthcare/hrs/gru', {
            abstract: true,
            template: '<ui-view/>'
        })

        .state('healthcare/hrs/gru.start', {
            url: '/healthcare/hrs/gru/?showAsTable',
            controller: 'hrs.gruList.Control',
            controllerAs: 'controller',
            templateUrl: '/healthcare/hrs/html/gru/ui/gruList.html'
        })

        .state('healthcare/hrs/gru.new', {
            url: '/healthcare/hrs/gru/new',
            controller: 'hrs.gruMaintenance.Control',
            controllerAs: 'controller',
            templateUrl: '/healthcare/hrs/html/gru/maintenance/ui/gruMaintenance.html'
        })

        .state('healthcare/hrs/gru.edit', {
            url: '/healthcare/hrs/gru/edit/:cddRessusAbiGru',
            controller: 'hrs.gruMaintenance.Control',
            controllerAs: 'controller',
            templateUrl: '/healthcare/hrs/html/gru/maintenance/ui/gruMaintenance.html'
        })

        .state('healthcare/hrs/gru.detail', {
            url: '/healthcare/hrs/gru/detail/:cddRessusAbiGru',
            controller: 'hrs.gruMaintenance.Control',
            controllerAs: 'controller',
            templateUrl: '/healthcare/hrs/html/gru/maintenance/ui/gruMaintenance.html'
        });
});