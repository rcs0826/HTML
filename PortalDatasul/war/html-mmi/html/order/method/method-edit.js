/**
 * methodEditController
 */
methodEditController.$inject = [	                              
	'$rootScope',	         
	'$scope',
	'$modalInstance',
	'model',
	'$filter',
	'TOTVSEvent',
	'mmi.bomn169.Service',
	'$modal',
	'$timeout'
];

function methodEditController($rootScope, 
							 $scope,
							 $modalInstance,
							 model,
							 $filter,
							 TOTVSEvent,
							 bomn169Service,
							 $modal,
							 $timeout) {

	/**
	 * methodEditControl
	 */ 
	var methodEditControl = this;
	
	this.method = model;
	
	this.refresh = false;
	this.isSaveNew = false;
	this.headerTitle;
	
	// *********************************************************************************
    // *** Funções
    // *********************************************************************************

    /**
     * Salva tarefa
     */
    this.save = function(isSaveNew) {

        model.isSaveNew = isSaveNew;
    	
    	if (methodEditControl.method.fichaMetodo) {
    		methodEditControl.method['fi-codigo'] = methodEditControl.method.fichaMetodo['fi-codigo'];
    		methodEditControl.method['des-metodo'] = methodEditControl.method.fichaMetodo['descricao'];
    	}
    	
    	//valida campos obrigatórios
        if (methodEditControl.isInvalidMethodForm()) {
            return;
        }
        
        if (methodEditControl.method.isNew) {
        	methodEditControl.saveRecord(methodEditControl.method, isSaveNew);
        }
    }

    /**
     * Criação de tarefa
     */
    this.saveRecord = function(value, isSaveNew) {
    	
    	//chama BO para criação do registro
    	bomn169Service.saveRecord(methodEditControl.method, function(result) {
        	if (!result.$hasError) { 
        		methodEditControl.refresh = true;
        		methodEditControl.sucessNotify();
        		        		
                if (isSaveNew) {
                	methodEditControl.isSaveNew = true;                	
                	methodEditControl.method.fichaMetodo = undefined;
			        controller.init();		
                	$('#fi-codigo').find('*').filter(':input:visible:first').focus();
                } else {
                	methodEditControl.close();
                }
        	}
        });
    }
    
    /**
     * Notifica criação do registro
     */
    this.sucessNotify = function() {
    	// notifica o usuario que conseguiu salvar o registro
        $rootScope.$broadcast(TOTVSEvent.showNotification, {
            type: 'success',
            title: ($rootScope.i18n('msg-method-sheet-created')),
            detail: ($rootScope.i18n('msg-success-method-sheet-created'))
        });
    }
    
    
    /**
     * Método para verificar se o formulario é invalido
     */
    this.isInvalidMethodForm = function() {
    	var messages = [];
        var isInvalidForm = false;
        
        // verifica se o codigo foi informado
        if (!this.method['cd-tarefa'] || this.method['cd-tarefa'].length === 0) {
            isInvalidForm = true;
            messages.push('l-task');
        }

        // verifica se a Ficha de Método foi informada
        if (methodEditControl.method.fichaMetodo === undefined) {
            isInvalidForm = true;
            messages.push('l-method-sheet');
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
                warning = warning + ' ' + $rootScope.i18n('obrigatórios');
            } else {
                warning = warning + ' ' + $rootScope.i18n('obrigatório');
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
	 * Fechar janela
	 */
    this.close = function () {
    	model.refresh = methodEditControl.refresh;
    	model.isSaveNew = methodEditControl.isSaveNew;
        $modalInstance.close();
    }
	
	// *********************************************************************************
    // *** Control Initialize
    // *********************************************************************************
     
    this.init = function() {

        model.isSaveNew = false;
    	
    	if (methodEditControl.method.isNew) {
    		methodEditControl.headerTitle = $rootScope.i18n('l-add');
        	$timeout(function() {
        		$('#cd-tarefa').find('*').filter(':input:visible:first').focus();
            },500);
    	}
    }
     
    // se o contexto da aplicação já carregou, inicializa a tela.
    if ($rootScope.currentuserLoaded) { this.init(); }
    
    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
	    $modalInstance.dismiss('cancel');
	});
     
    // *********************************************************************************
    // *** Events Listners
    // *********************************************************************************
     
    // cria um listerner de evento para inicializar o methodEditControl somente depois de inicializar o contexto da aplicação.
    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
    	methodEditControl.init();
    });
        
}	

