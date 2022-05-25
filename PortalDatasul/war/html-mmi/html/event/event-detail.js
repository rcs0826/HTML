define(['index',
        '/dts/mmi/js/dbo/bomn259.js'
		], function(index) {
	
	/**
	 * Controller Detail
	 */
	eventDetailCtrl.$inject = [
		'$rootScope', 
		'$scope',
		'$stateParams', 
		'$state',
		'totvs.app-main-view.Service',
		'mmi.bomn259.Service',
		'TOTVSEvent'
	];
	
	function eventDetailCtrl($rootScope, 
							 $scope, 
							 $stateParams, 
							 $state,
							 appViewService,
							 bomn259Service,
							 TOTVSEvent) {

		/**
		* Variável Controller
		*/
		controller = this;
		
		/**
		 * Variáveis
		 */
		this.model = {}; // mantem o conteudo do registro em detalhamento
				
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************
		
	    /**
	     * Método para a ação de remover
	     */		
	    this.onRemove = function() {
	        // envia um evento para perguntar ao usuário
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', // titlo da mensagem
	            text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
	            cancelLabel: 'l-no', // label do botão cancelar
	            confirmLabel: 'l-yes', // label do botão confirmar
	            callback: function(isPositiveResult) { // função de retorno
	                if (isPositiveResult) { // se foi clicado o botão confirmar
	                     
	                    // chama o metodo de remover registro do service
	                    bomn259Service.deleteRecord(controller.model ['cod-evento'], function(result) {
	                    	if (!result.$hasError) {
	                            // notifica o usuario que o registro foi removido
	                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                                type: 'success', // tipo de notificação
	                                title: $rootScope.i18n('msg-item-deleted'), // titulo da notificação
	                                detail: $rootScope.i18n('msg-success-deleted') // detalhe da notificação
	                            });
	                            // muda o state da tela para o state inicial, que é a lista
	                            $state.go('dts/mmi/event.start');
	                        }
	                    });
	                }
	            }
	        });
	    }
		
		/**
		 * Método de leitura do registro
		 */		
	    this.load = function(id) {
	        this.model = {}; // zera o model
	        // chama o servico para retornar o registro
	        bomn259Service.getRecord(id, function(record) {
	            if (record) { // se houve retorno, carrega no model
	                controller.model = record;
	            }              
	        });
	    }
	    
	    /**
		 * Retorna descrição para o tipo de evento informado
		 */		
		this.getEventType = function(eventType) {
			return bomn259Service.getEventType(eventType);
		}
		
		/**
		 * Retorna descrição para o tipo de valor informado
		 */		
		this.getValueType = function(valueType) {
			return bomn259Service.getValueType(valueType);
		}
	    
		// *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	     
	    this.init = function() {
	     
	        if (appViewService.startView($rootScope.i18n('l-event'), 'mmi.event.DetailCtrl', controller)) {             
	            // se é a abertura da tab, implementar aqui inicialização do controller
	        }
	        // se houver parametros na URL
	        if ($stateParams && $stateParams.id) {
	            // realiza a busca de dados inicial
	            this.load($stateParams.id);
	        }
	    }
	     
	    // se o contexto da aplicação já carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { this.init(); }
	     
	    // *********************************************************************************
	    // *** Events Listeners
	    // *********************************************************************************
	     
	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        controller.init();
	    });
								
	}
	
	index.register.controller('mmi.event.DetailCtrl', eventDetailCtrl);
	
});
