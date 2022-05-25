define(['index'], function(index) {
	
	pendingproductDetailCtrl.$inject = [
		'$rootScope', 
		'$scope',
		'$stateParams', 
		'$state',
		'totvs.app-main-view.Service',
		'cfapi004.Factory',
		'TOTVSEvent'
	];
	
	function pendingproductDetailCtrl($rootScope, 
									  $scope, 
									  $stateParams, 
									  $state,
									  appViewService,
									  cfapi004,
									  TOTVSEvent) {

		controller = this;
		
		this.model = {}; // mantem o conteudo do registro em detalhamento
	    
	    this.load = function(cNomeAbrev, iNrPedido, iNrSequencia) {
	        this.model = {};
			
			var param = {
				pTipo: 9, //Parametro passado para resolver BUG Progress INPUT-OUTPUT
				pNomeAbrev:cNomeAbrev,
				pNrPedido:iNrPedido,
				pNrSequencia:iNrSequencia
			};
			cfapi004.pendingProductDetail(param, function(result) {
				//controller.loadData();
				controller.model = result[0];
				//console.log("leon:", result);
			})
	    }

	    this.init = function() {
	     
	        if (appViewService.startView($rootScope.i18n('l-pendingproduct'), 'mcf.pendingproduct.DetailCtrl', controller)) {             
	            // se é a abertura da tab, implementar aqui inicialização do controller
	        }
	        // se houver parametros na URL
	        if ($stateParams && $stateParams.nomeAbrev && $stateParams.nrPedido && $stateParams.nrSequencia) {
	            // realiza a busca de dados inicial
	            this.load($stateParams.nomeAbrev, $stateParams.nrPedido, $stateParams.nrSequencia);
	        }
	    }
	     
	    // se o contexto da aplicação já carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { this.init(); }
	     
	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        controller.init();
	    });
								
	}
	
	index.register.controller('mcf.pendingproduct.DetailCtrl', pendingproductDetailCtrl);
	
});
