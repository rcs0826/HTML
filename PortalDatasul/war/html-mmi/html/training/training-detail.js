define(['index',
        '/dts/mmi/js/dbo/bomn267.js'
		], function(index) {
	
	/**
	 * Controller Detail
	 */
	trainingDetailCtrl.$inject = [
		'$rootScope', 
		'$scope',
		'$stateParams', 
		'$state',
		'totvs.app-main-view.Service',
		'mmi.bomn267.Service',
		'TOTVSEvent'
	];
	
	function trainingDetailCtrl($rootScope, 
							 $scope, 
							 $stateParams, 
							 $state,
							 appViewService,
							 bomn267Service,
							 TOTVSEvent) {

		/**
		* Variável Controller
		*/
		controller = this;
		
		/**
		 * Variáveis
		 */
		controller.model = {}; // mantem o conteudo do registro em detalhamento
				
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************
		
	    /**
	     * Método para a ação de remover
	     */		
	    controller.onRemove = function() {
	        // envia um evento para perguntar ao usuário
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', // titlo da mensagem
	            text: $rootScope.i18n('l-confirm-delete-record', controller.model ['cdn-curso']), // texto da mensagem
	            cancelLabel: 'l-no', // label do botão cancelar
	            confirmLabel: 'l-yes', // label do botão confirmar
	            callback: function(isPositiveResult) { // função de retorno
	                if (isPositiveResult) { // se foi clicado o botão confirmar
	                     
	                    // chama o metodo de remover registro do service
	                    bomn267Service.deleteRecord(controller.model ['cdn-curso'], function(result) {
	                    	if (!result.$hasError) {
	                            // notifica o usuario que o registro foi removido
	                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                                type: 'success', // tipo de notificação
	                                title: $rootScope.i18n('msg-record-deleted'), // titulo da notificação
	                                detail: $rootScope.i18n('msg-record-success-deleted') // detalhe da notificação
	                            });
	                            // muda o state da tela para o state inicial, que é a lista
	                            $state.go('dts/mmi/training.start');
	                        }
	                    });
	                }
	            }
	        });
	    }
		
		/**
		 * Método de leitura do registro
		 */		
	    controller.load = function(id) {
	        controller.model = {}; // zera o model
	        // chama o servico para retornar o registro
	        bomn267Service.getRecord(id, function(record) {
	            if (record) { // se houve retorno, carrega no model
					if (record['log-ativo'] === true){
						record['log-ativo'] = $rootScope.i18n('l-yes');
					} else {
						record['log-ativo'] = $rootScope.i18n('l-no');
					}             
					controller.model = record;
				}   
				
	        });
	    }
	 
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	     
	    controller.init = function() {
	     
	        if (appViewService.startView($rootScope.i18n('l-trainings'), 'mmi.training.DetailCtrl', controller)) {             
	            // se é a abertura da tab, implementar aqui inicialização do controller
	        }
	        // se houver parametros na URL
	        if ($stateParams && $stateParams.id) {
	            // realiza a busca de dados inicial
	            controller.load($stateParams.id);
	        }
	    }
	     
	    // se o contexto da aplicação já carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { controller.init(); }
	     
	    // *********************************************************************************
	    // *** Events Listeners
	    // *********************************************************************************
	     
	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        controller.init();
	    });
								
	}
	
	index.register.controller('mmi.training.DetailCtrl', trainingDetailCtrl);
	
});
