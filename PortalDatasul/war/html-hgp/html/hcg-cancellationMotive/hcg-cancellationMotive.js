define(['index',
    '/dts/hgp/html/hcg-cancellationMotive/controller/cancellationMotiveListController.js',
    '/dts/hgp/html/hcg-cancellationMotive/maintenance/controller/cancellationMotiveMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hcg-cancellationMotive', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hcg-cancellationMotive.start', {
                url: '/dts/hgp/hcg-cancellationMotive/?showAsTable',
                controller: 'hcg.cancellationMotiveList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-cancellationMotive/ui/cancellationMotiveList.html'
            })
            
            .state('dts/hgp/hcg-cancellationMotive.new', {
                url: '/dts/hgp/hcg-cancellationMotive/new',
                controller: 'hcg.cancellationMotiveMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-cancellationMotive/maintenance/ui/cancellationMotiveMaintenance.html'
            })

            .state('dts/hgp/hcg-cancellationMotive.edit', {
                url: '/dts/hgp/hcg-cancellationMotive/edit/:inEntidade/:cdMotivo',
                controller: 'hcg.cancellationMotiveMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-cancellationMotive/maintenance/ui/cancellationMotiveMaintenance.html'
            })
            
            .state('dts/hgp/hcg-cancellationMotive.detail', {         
                url: '/dts/hgp/hcg-cancellationMotive/detail/:inEntidade/:cdMotivo',
                controller: 'hcg.cancellationMotiveMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hcg-cancellationMotive/maintenance/ui/cancellationMotiveMaintenance.html'
            });
            
});


