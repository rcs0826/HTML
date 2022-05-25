define(['index',
    '/dts/hgp/html/hfp-contaProvisReceita/controller/contaProvisReceitaListController.js',
    '/dts/hgp/html/hfp-contaProvisReceita/maintenance/controller/contaProvisReceitaMaintenanceController.js'
], function (index) {

    index.stateProvider 

            .state('dts/hgp/hfp-contaProvisReceita', {
                abstract: true,
                template: '<ui-view/>'
            })

            .state('dts/hgp/hfp-contaProvisReceita.start', {
                url: '/dts/hgp/hfp-contaProvisReceita/?showAsTable',
                controller: 'hfp.contaProvisReceitaList.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hfp-contaProvisReceita/ui/contaProvisReceitaList.html'
            })
            
            .state('dts/hgp/hfp-contaProvisReceita.new', {
                url: '/dts/hgp/hfp-contaProvisReceita/new',
                controller: 'hfp.contaProvisReceitaMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hfp-contaProvisReceita/maintenance/ui/contaProvisReceitaMaintenance.html'
            })

            .state('dts/hgp/hfp-contaProvisReceita.edit', {
                url: '/dts/hgp/hfp-contaProvisReceita/edit/:inEntidade/:inTipoConta/:cdModalidade/:cdPlano/:cdTipoPlano/:cdModulo/:cdFormaPagto/:cdGrupoPrestador/:cdEvento/:inMovto/:inTipoAto/:cdGrupoTipo/:cdProcInsu/:aaValidade/:mmValidade',
                controller: 'hfp.contaProvisReceitaMaintenance.Control',
                controllerAs: 'controller',
                templateUrl: '/dts/hgp/html/hfp-contaProvisReceita/maintenance/ui/contaProvisReceitaMaintenance.html'
            })
            
            .state('dts/hgp/hfp-contaProvisReceita.detail', {         
                url: '/dts/hgp/hfp-contaProvisReceita/detail/:inEntidade/:inTipoConta/:cdModalidade/:cdPlano/:cdTipoPlano/:cdModulo/:cdFormaPagto/:cdGrupoPrestador/:cdEvento/:inMovto/:inTipoAto/:cdGrupoTipo/:cdProcInsu/:aaValidade/:mmValidade',
                controller: 'hfp.contaProvisReceitaMaintenance.Control',
                controllerAs: 'controller',                
                templateUrl: '/dts/hgp/html/hfp-contaProvisReceita/maintenance/ui/contaProvisReceitaMaintenance.html'
            });
            
});


