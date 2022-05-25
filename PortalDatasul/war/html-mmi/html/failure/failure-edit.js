define(['index',
        '/dts/mmi/js/dbo/bomn262.js'
		], function(index) {
	
	/**
	 * Controller Edit
	 */
	failureEditCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$stateParams', 
		'$window', 
		'$location',
		'$state',
		'totvs.app-main-view.Service',
		'mmi.bomn262.Service',
		'TOTVSEvent'
	];
	
	function failureEditCtrl($rootScope, 
							 $scope, 
							 $stateParams, 
							 $window, 
							 $location,
							 $state,
							 appViewService,
							 bomn262Service,
							 TOTVSEvent) {
	
		/**
		 * Variável Controller
		 */
		var controller = this;
		
		// *********************************************************************************
	    // *** Atributos
	    // *********************************************************************************
	     
	    this.model = {}; // mantem o conteudo do registro em edição/inclusão
	     
	    // atributo auxiliar para determinar se é uma edição, desabilitando o campo chave
	    this.idDisabled;
	    
	    // título que será mostrado no breadcrumb de edição do html
	    var breadcrumbTitle;
	    
	    // título que será mostrado no header de edição do html
	    var headerTitle;	  
	    
	    // variável para controlar se o usuário selecionou a opção Salvar e Novo
	    var isSaveNew = false;
	     
	    // *********************************************************************************
	    // *** Functions
	    // *********************************************************************************
	     
	    /**
	     * Método de leitura do regstro
	     */	    
	    this.load = function(id) {
	        this.model = {};
	        // chama o servico para retornar o registro
	        bomn262Service.getRecord(id, function(result) {
	            // carrega no model
	            controller.model = result;
	            $("input[id^='des-falha']").focus();
	        });
	    }
	     
	    /**
	     * Método para salvar o registro
	     */	    
	    this.save = function() {
	        // verificar se o formulario tem dados invalidos
	        if (this.isInvalidForm()) {
	            return;
	        }
	         
	        // se for a tela de edição, faz o update
	        if ($state.is('dts/mmi/failure.edit')) {               
	            bomn262Service.updateRecord(this.model['cod-falha'], this.model, function(result) {
	            	if (!result.$hasError) {
		                // se gravou o registro com sucesso
		                controller.onSaveUpdate(true, result);
	            	}
	            });
	        } else { // senão faz o create
	            bomn262Service.saveRecord(this.model, function(result) {
	            	if (!result.$hasError) {
		                // se gravou o registro com sucesso
		                controller.onSaveUpdate(false, result);
	            	}
	            });
	        }
	        
	        controller.isSaveNew = false;
	    }
	    
	    /**
	     * Método para salvar o registro e manter o formulário em edição
	     */	    
	    this.saveNew = function() {
	    	controller.save();
	    	controller.isSaveNew = true;
	    }
	    
	    /**
	     * Método para notificar o usuário da gravação do registro com sucesso
	     */	    
	    this.onSaveUpdate = function(isUpdate, result) {
	     
	    	if (controller.isSaveNew === true) {
	    		this.model = {};
	            this.headerTitle = $rootScope.i18n('l-add');
	            this.breadcrumbTitle = this.headerTitle;
	            $("input[id^='cod-falha']").focus();
	    	} else {
	    		// redireciona a tela para a tela de detalhar
	    		controller.redirectToDetail();
	    	}
	     
	        // notifica o usuario que conseguiu salvar o registro
	        $rootScope.$broadcast(TOTVSEvent.showNotification, {
	            type: 'success',
	            title: (isUpdate ? $rootScope.i18n('msg-item-updated') : $rootScope.i18n('msg-item-created')),
	            detail: (isUpdate ? $rootScope.i18n('msg-success-updated') : $rootScope.i18n('msg-success-created'))
	        });
	    }
	    
	    /**
	     * Método para a ação de cancelar
	     */	    
	    this.cancel = function() {
	        // solicita que o usuario confirme o cancelamento da edição/inclusão
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-cancel-operation'),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) { // se confirmou, navega para a pagina anterior
	                    $window.history.back();
	                }
	            }
	        });
	    }
	    
	    /**
	     * Método para verificar se o formulario é invalido
	     */	    
	    this.isInvalidForm = function() {
	         
	        var messages = [];
	        var isInvalidForm = false;
	         
	        // verifica se o codigo foi informado
	        if (!this.model['cod-falha'] || this.model['cod-falha'].length === 0) {
	            isInvalidForm = true;
	            messages.push('l-failure');
	        }
	         
	        // verifica se a descrição foi informada
	        if (!this.model['des-falha'] || this.model['des-falha'].length === 0) {
	            isInvalidForm = true;
	            messages.push('l-description');
	        }
	         
	        // se for invalido, monta e mostra a mensagem
	        if (isInvalidForm) {
	            var warning = $rootScope.i18n('l-field');
	            if (messages.length > 1) {
	                warning = $rootScope.i18n('l-fields');
	            }
	            angular.forEach(messages, function(item) {
	                warning = warning + ' ' + $rootScope.i18n(item) + ',';
	            });
	            if (messages.length > 1) {
	                warning = warning + ' ' + $rootScope.i18n('l-required-2');
	            } else {
	                warning = warning + ' ' + $rootScope.i18n('l-required');
	            }
	            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'error',
	                title: $rootScope.i18n('l-attention'),
	                detail: warning
	            });
	        }
	         
	        return isInvalidForm;
	    }
	     
	    /**
	     * Redireciona para a tela de detalhar
	     */	    
	    this.redirectToDetail = function() {
	        $location.path('dts/mmi/failure/detail/' + this.model['cod-falha']);
	    }
	     
	    // *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	     
	    this.init = function() {
	         
	        if (appViewService.startView($rootScope.i18n('l-failure'), 'mmi.failure.EditCtrl', controller)) {
	            // se é a abertura da tab, implementar aqui inicialização do controller            
	        }
	         
	        // se houver parametros na URL
	        if ($stateParams && $stateParams.id) {
	        	// realiza a busca de dados inicial
	            this.load($stateParams.id);
	            this.headerTitle = $stateParams.id;	    
	            this.breadcrumbTitle = $rootScope.i18n('l-edit');
	            this.idDisabled = true;	            
	        } else { // se não, incica com o model em branco (inclusão)
	            this.model = {};
	            this.headerTitle = $rootScope.i18n('l-add');
	            this.breadcrumbTitle = this.headerTitle;
	            this.idDisabled = false;
	        }
	    }
	     
	    // se o contexto da aplicação já carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { this.init(); }
	     
	    // *********************************************************************************
	    // *** Events Listners
	    // *********************************************************************************
	     
	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        controller.init();
	    });
	}
	
	index.register.controller('mmi.failure.EditCtrl', failureEditCtrl);
		
});