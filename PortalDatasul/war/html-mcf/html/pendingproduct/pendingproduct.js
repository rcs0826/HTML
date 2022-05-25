define(['index',
        '/dts/mcf/html/pendingproduct/pendingproduct-detail.js',
		'/dts/mcf/html/pendingproduct/pendingproduct-list.js',
        '/dts/mcf/html/pendingproduct/pendingproduct-informConfiguration.js',
        '/dts/mcf/html/smartconfiguration/smartconfiguration-configuration.js'], function(index) {
	
	// Inicializa os states da aplicacao.
    index.stateProvider
     
        .state('dts/mcf/pendingproduct', {
            abstract: true,
            template: '<ui-view/>'
        })
     
        // definicao do state de visualizacao do registro
        .state('dts/mcf/pendingproduct.detail', {
            url:'/dts/mcf/pendingproduct/detail?nomeAbrev&nrPedido&nrSequencia',
            controller:'mcf.pendingproduct.DetailCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcf/html/pendingproduct/pendingproduct.detail.html'
        })
        
        .state('dts/mcf/pendingproduct.start', {
            url:'/dts/mcf/pendingproduct/',
            controller:'mcf.pendingproduct.ListCtrl',
            controllerAs: 'controller',
            templateUrl:'/dts/mcf/html/pendingproduct/pendingproduct.list.html'
        })
});