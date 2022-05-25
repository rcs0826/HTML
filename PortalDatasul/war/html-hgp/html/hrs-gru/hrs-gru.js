define(['index',
        '/dts/hgp/html/hrs-gru/controller/gruListController.js',
        '/dts/hgp/html/hrs-gru/maintenance/controller/gruMaintenanceController.js'], 
    function (index) {
        index.stateProvider
        
        .state('dts/hgp/hrs-gru', {
            abstract: true,
            template: '<ui-view/>'
        })

        .state('dts/hgp/hrs-gru.start', {
            url: '/dts/hgp/hrs-gru/?showAsTable',
            controller: 'hrs.gruList.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/hgp/html/hrs-gru/ui/gruList.html'
        })

        .state('dts/hgp/hrs-gru.new', {
            url: '/dts/hgp/hrs-gru/new',
            controller: 'hrs.gruMaintenance.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/hgp/html/hrs-gru/maintenance/ui/gruMaintenance.html'
        })

        .state('dts/hgp/hrs-gru.edit', {
            url: '/dts/hgp/hrs-gru/edit/:cddRessusAbiGru',
            controller: 'hrs.gruMaintenance.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/hgp/html/hrs-gru/maintenance/ui/gruMaintenance.html'
        })

        .state('dts/hgp/hrs-gru.detail', {
            url: '/dts/hgp/hrs-gru/detail/:cddRessusAbiGru',
            controller: 'hrs.gruMaintenance.Control',
            controllerAs: 'controller',
            templateUrl: '/dts/hgp/html/hrs-gru/maintenance/ui/gruMaintenance.html'
        });
});