define(['index'], function(index) {
	
	/**
	 * Controller Edit
	 */
	activitiesEditCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$stateParams', 
		'$window', 
		'$location',
		'$state',
		'totvs.app-main-view.Service',
		'mab.bofr001.Service',
		'mab.fchmabactivities.Factory',
		'TOTVSEvent'
	];
	
	function activitiesEditCtrl($rootScope, 
							 $scope, 
							 $stateParams, 
							 $window, 
							 $location,
							 $state,
							 appViewService,
							 bofr001Service,
							 fchmabactivitiesFactory,
							 TOTVSEvent) {
	
		/**
		 * Variável Controller
		 */
		var controller = this;		
		
		// *********************************************************************************
	    // *** Atributos
	    // *********************************************************************************
	     
	    this.model = {}; // mantem o conteudo do registro em edição/inclusão
	    this.atividadeAgricola = false;
	     
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
	        bofr001Service.getRecord(id, function(result) {
	            // carrega no model
	            controller.model = result;
	            $("input[id^='des-ativid']").focus();
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
	        if ($state.is('dts/mab/activities.edit')) {               
	            bofr001Service.updateRecord(this.model['cod-ativid'], this.model, function(result) {
	                // se gravou o registro com sucesso
	                controller.onSaveUpdate(true, result);
	            });
	        } else { // senão faz o create
	            bofr001Service.saveRecord(this.model, function(result) {
	                // se gravou o registro com sucesso
	                controller.onSaveUpdate(false, result);
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
	            $("input[id^='cod-ativid']").focus();
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
	         
	        var atividades = [];
	        var isInvalidForm = false;
	         
	        // verifica se o codigo foi informado
	        if (!this.model['cod-ativid'] || this.model['cod-ativid'].length === 0) {
	            isInvalidForm = true;
	            atividades.push('l-id');
	        }
	         
	        // verifica se a descrição foi informada
	        if (!this.model['des-ativid'] || this.model['des-ativid'].length === 0) {
	            isInvalidForm = true;
	            atividades.push('l-description');
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
	                warning = warning + ' ' + $rootScope.i18n('l-requireds');
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
	        $location.path('dts/mab/activities/detail/' + this.model['cod-ativid']);
	    }
	     
	    // *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	     
	    this.init = function() {
	         
	        if (appViewService.startView($rootScope.i18n('l-activities'), 'mab.activities.EditCtrl', controller)) {
	            // se é a abertura da tab, implementar aqui inicialização do controller            
	        }

	        // verifica parametro agroindustria (cd0101)
	        fchmabactivitiesFactory.verificaAgro(function(result) {
	        	controller.atividadeAgricola = result;
	        });

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
	
	index.register.controller('mab.activities.EditCtrl', activitiesEditCtrl);
		
});