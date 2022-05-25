define(['index',
    '/dts/hgp/html/hcg-associativaUnidadeAreaAcao/controller/associativaUnidadeAreaAcaoListController.js',
    '/dts/hgp/html/hcg-associativaUnidadeAreaAcao/maintenance/controller/associativaUnidadeAreaAcaoMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hcg-associativaUnidadeAreaAcao', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hcg-associativaUnidadeAreaAcao.start', {
                url: '/dts/hgp/hcg-associativaUnidadeAreaAcao/?showAsTable',
                controller: 'hcg.associativaUnidadeAreaAcaoList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-associativaUnidadeAreaAcao/ui/associativaUnidadeAreaAcaoList.html'
            })
            
            .state('dts/hgp/hcg-associativaUnidadeAreaAcao.new', {
                url: '/dts/hgp/hcg-associativaUnidadeAreaAcao/new',
                controller: 'hcg.associativaUnidadeAreaAcaoMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hcg-associativaUnidadeAreaAcao/maintenance/ui/associativaUnidadeAreaAcaoMaintenance.html'
            })
            
            .state('dts/hgp/hcg-associativaUnidadeAreaAcao.detail', {         
                url: '/dts/hgp/hcg-associativaUnidadeAreaAcao/detail/:cdnUnid/:cdnCidade',
                controller: 'hcg.associativaUnidadeAreaAcaoMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hcg-associativaUnidadeAreaAcao/maintenance/ui/associativaUnidadeAreaAcaoMaintenance.html'
            });
            
});


