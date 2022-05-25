define(['index',
        '/dts/mmi/js/dbo/bomn267.js'
		], function(index) {
	
	/**
	 * Controller Edit
	 */
	trainingEditCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$stateParams', 
		'$window', 
		'$location',
		'$state',
		'totvs.app-main-view.Service',
		'mmi.bomn267.Service',
		'TOTVSEvent',
		'$timeout'
	];
	
	function trainingEditCtrl($rootScope, 
						   $scope, 
						   $stateParams, 
						   $window, 
						   $location,
						   $state,
						   appViewService,
						   bomn267Service,
						   TOTVSEvent,
						   $timeout) {
	
		/**
		 * Variável Controller
		 */
		var controller = this;
		
		// *********************************************************************************
	    // *** Atributos
	    // *********************************************************************************
	     
	    controller.model = {}; // mantem o conteudo do registro em edição/inclusão
	     
	    // atributo auxiliar para determinar se é uma edição, desabilitando o campo chave
	    controller.idDisabled;
	    
	    // título que será mostrado no breadcrumb de edição do html
	    var breadcrumbTitle;
	    
	    // título que será mostrado no header de edição do html
	    var headerTitle;
	    
	    // variável para controlar se o usuário selecionou a opção Salvar e Novo
		controller.isSaveNew = false;	 
		
	    // *********************************************************************************
	    // *** Functions
	    // *********************************************************************************
	     
	    /**
	     * Método de leitura do regstro
	     */	    
        controller.load = function(id) {
	        controller.model = {};
	        // chama o servico para retornar o registro
	        bomn267Service.getRecord(id, function(result) {
	            // carrega no model
	            controller.model = result;
				$("input[id^='des-curso']").focus();
				controller.headerTitle = controller.model['cdn-curso'] + " - " + controller.model['des-curso'];
			});
	    }
         
	    /**
	     * Método para salvar o registro
	     */	    
	    controller.save = function() {
	        // verificar se o formulario tem dados invalidos
	        if (controller.isInvalidForm()) {
	            return;
	        }
	         
	        // se for a tela de edição, faz o update
	        if ($state.is('dts/mmi/training.edit')) {               
	            bomn267Service.updateRecord(controller.model['cdn-curso'], controller.model, function(result) {	            	
	                // se gravou o registro com sucesso
	                controller.onSaveUpdate(true, result);	            	
	            });
	        } else { // senão faz o create
	            bomn267Service.saveRecord(controller.model, function(result) {	            	
	                // se gravou o registro com sucesso
	                controller.onSaveUpdate(false, result);	            	
	            });
	        }
	        
	        controller.isSaveNew = false;
	    }
	    
	    /**
	     * Método para salvar o registro e manter o formulário em edição
	     */	    
	    controller.saveNew = function() {
	    	controller.save();
	    	controller.isSaveNew = true;
	    }
	    
	    /**
	     * Método para notificar o usuário da gravação do registro com sucesso
	     */	    
	    controller.onSaveUpdate = function(isUpdate, result) {	    	
	    	if (!result.$hasError) {	    		

	    		if (controller.isSaveNew === true) {
			        controller.init();
			        $("input[id^='cdn-curso']").focus();
		    	} else {
		    		// redireciona a tela para a tela de detalhar
		    		controller.redirectToDetail();
		    	}
		     
		        // notifica o usuario que conseguiu salvar o registro
		        $rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
		            title: (isUpdate ? $rootScope.i18n('msg-record-updated') : $rootScope.i18n('msg-record-created')),
		            detail: (isUpdate ? $rootScope.i18n('msg-record-success-updated') : $rootScope.i18n('msg-record-success-created'))
		        });
	    	}
	    }
	    
	    /**
	     * Método para a ação de cancelar
	     */	    
	    controller.cancel = function() {
	        // solicita que o usuario confirme o cancelamento da edição/inclusão
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-cancel-operation'),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
					if (isPositiveResult) { // se confirmou, navega para a pagina anterior
						$location.path('/dts/mmi/training');
	                }
	            }
	        });
	    }
		
		
	    /**
	     * Método para verificar se o formulario é invalido
	     */	    
	    controller.isInvalidForm = function() {
	         
	        var messages = [];
	        var isInvalidForm = false;
	         
	        // verifica se o codigo foi informado
	        if (!controller.model['cdn-curso'] || controller.model['cdn-curso'].length === 0) {
	            isInvalidForm = true;
	            messages.push('l-trainings');
	        }
	         
	        // verifica se a descrição foi informada
	        if (!controller.model['des-curso'] || controller.model['des-curso'].length === 0) {
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
	                warning = warning + ' ' + $rootScope.i18n('l-requireds-2');
	            } else {
	                warning = warning + ' ' + $rootScope.i18n('l-required-2');
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
	    controller.redirectToDetail = function() {
	        $location.path('/dts/mmi/training/detail/' + controller.model['cdn-curso']);
		}
	    
	    controller.setFocus = function() {
	    	$timeout(function() {
	    		$('#cdn-curso').find('*').filter(':input:visible:first').focus();
	        },500);
	    }
	     
	    // *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	     
	    controller.init = function() {
			
	        if (appViewService.startView($rootScope.i18n('l-trainings'), 'mmi.training.EditCtrl', controller)) {
	            // se é a abertura da tab, implementar aqui inicialização do controller            
	        }
	         
	        // se houver parametros na URL
	        if ($stateParams && $stateParams.id) {
	            // realiza a busca de dados inicial
	            controller.load($stateParams.id);	            
	            controller.breadcrumbTitle = $rootScope.i18n('l-edit');
	            controller.idDisabled = true;
	        } else { // se não, incica com o model em branco (inclusão)
	            controller.model = {};
	            controller.headerTitle = $rootScope.i18n('l-add');
	            controller.breadcrumbTitle = controller.headerTitle;
				controller.idDisabled = false;
				controller.model['log-ativo'] = true;
				controller.setFocus();
	        }
	    }
	     
	    // se o contexto da aplicação já carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { controller.init(); }
	     
	    // *********************************************************************************
	    // *** Events Listners
	    // *********************************************************************************
	     
	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        controller.init();
	    });
	}
	
	index.register.controller('mmi.training.EditCtrl', trainingEditCtrl);
		
});