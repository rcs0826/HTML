/**
 * shiftEditController
 */
shiftEditController.$inject = [	                              
	'$rootScope',	         
	'$scope',
	'$modalInstance',
	'model',
	'$filter',
	'TOTVSEvent',
	'mmi.bomn174.Service',
	'$modal',
	'$timeout'
];

function shiftEditController($rootScope, 
							 $scope,
							 $modalInstance,
							 model,
							 $filter,
							 TOTVSEvent,
							 bomn174Service,
							 $modal,
							 $timeout) {

	/**
	 * shiftEditControl
	 */ 
	var shiftEditControl = this;
	
	this.shift = model;
	
	this.refresh = false;
	this.isSaveNew = false;
	
	// *********************************************************************************
    // *** Funções
    // *********************************************************************************

    /**
     * Salva tarefa
     */
    this.save = function(value, isSaveNew) {

        model.isSaveNew = isSaveNew;

    	if (shiftEditControl.shift.turno) {
    		shiftEditControl.shift['cd-turno'] = shiftEditControl.shift.turno['cd-turno'];
    		shiftEditControl.shift['des-turno'] = shiftEditControl.shift.turno['descricao'];
    	}
    	
    	//valida campos obrigatórios
        if (shiftEditControl.isInvalidShiftForm()) {
            return;
        }
        
        shiftEditControl.saveRecord(value, isSaveNew);
    }

    /**
     * Criação de tarefa
     */
    this.saveRecord = function(value, isSaveNew) {
    	//chama BO para criação do registro
    	bomn174Service.saveRecord(shiftEditControl.shift, function(result) {
        	if (!result.$hasError) { 
        		shiftEditControl.refresh = true;
        		shiftEditControl.successNotify();
        		        		
                if (isSaveNew) {
                	shiftEditControl.isSaveNew = true;
                	shiftEditControl.shift.turno = undefined;
                	$('#cd-turno').find('*').filter(':input:visible:first').focus();
                } else {
                	shiftEditControl.close();
                }
        	}
        });
    }
    
    /**
     * Método para verificar se o formulario é invalido
     */
    this.isInvalidShiftForm = function() {
    	var messages = [];
        var isInvalidForm = false;
        
        // verifica se o codigo foi informado
        if (!this.shift['cd-tarefa'] || this.shift['cd-tarefa'].length === 0) {
            isInvalidForm = true;
            messages.push('l-task');
        }
        
        // verifica se o EPI foi informada
        if ((this.shift.turno == undefined) ||
            (this.shift.turno !== undefined && this.shift.turno['cd-turno'].length === 0)) {
            isInvalidForm = true;
            messages.push('l-shift');
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
     * Notifica criação e alteração do registro
     */
    this.successNotify = function() {
    	// notifica o usuario que conseguiu salvar o registro
        $rootScope.$broadcast(TOTVSEvent.showNotification, {
            type: 'success',
            title: ($rootScope.i18n('msg-shift-created')),
            detail: ($rootScope.i18n('msg-success-shift-created'))
        });
    }
    
    /**
	 * Fechar janela
	 */
    this.close = function () {
    	model.refresh = shiftEditControl.refresh;
    	model.isSaveNew = shiftEditControl.isSaveNew;
        $modalInstance.close();
    }
	
	// *********************************************************************************
    // *** Control Initialize
    // *********************************************************************************
     
    this.init = function() {

        model.isSaveNew = false;

    	$timeout(function() {
    		$('#cd-tarefa').find('*').filter(':input:visible:first').focus();
        },500);
    }
     
    // se o contexto da aplicação já carregou, inicializa a tela.
    if ($rootScope.currentuserLoaded) { this.init(); }
    
    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
	    $modalInstance.dismiss('cancel');
	});
     
    // *********************************************************************************
    // *** Events Listners
    // *********************************************************************************
     
    // cria um listerner de evento para inicializar o shiftEditControl somente depois de inicializar o contexto da aplicação.
    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        shiftEditControl.init();
    });
        
}