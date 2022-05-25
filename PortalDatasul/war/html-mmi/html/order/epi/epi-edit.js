define(['index' ], function(index) {
/**
 * epiEditController
 */
epiEditController.$inject = [	                              
	'$rootScope',	         
	'$scope',
	'$modalInstance',
	'model',
	'$filter',
	'TOTVSEvent',
	'mmi.bomn130.Service',
	'$modal',
	'$timeout'
];

function epiEditController($rootScope, 
							 $scope,
							 $modalInstance,
							 model,
							 $filter,
							 TOTVSEvent,
							 bomn130Service,
							 $modal,
							 $timeout) {

	/**
	 * epiEditControl
	 */ 
	var epiEditControl = this;
	
	this.epi = model;
	
	this.refresh = false;
	this.isSaveNew = false;
	this.isEdit = false;
	this.headerTitle;
	
	// *********************************************************************************
    // *** Funções
    // *********************************************************************************

    /**
     * Salva tarefa
     */
    this.save = function(isSaveNew) {

        model.isSaveNew = isSaveNew;
    	
    	if (epiEditControl.epi.equiptoProtecao) {
    		epiEditControl.epi['cd-epi'] = epiEditControl.epi.equiptoProtecao['cd-epi'];
    		epiEditControl.epi['des-epi'] = epiEditControl.epi.equiptoProtecao['descricao'];
    	}
    	
    	//valida campos obrigatórios
        if (epiEditControl.isInvalidEpiForm()) {
            return;
        }
        
        if (epiEditControl.epi.isNew) {
            epiEditControl.saveRecord(epiEditControl.epi, isSaveNew);
        } else {
        	epiEditControl.updateRecord(epiEditControl.epi);
        }
    }

    /**
     * Criação de tarefa
     */
    this.saveRecord = function(value, isSaveNew) {
    	
        var quantOrig = String(value['qtde-epi']);
        
        value['qtde-epi']   = quantOrig.replace(",",".");
        
    	//chama BO para criação do registro
    	bomn130Service.saveRecord(epiEditControl.epi, function(result) {
        	if (!result.$hasError) { 
        		epiEditControl.refresh = true;
        		epiEditControl.sucessNotify();
        		        		
                if (isSaveNew) {
                	epiEditControl.isSaveNew = true;                	
                	epiEditControl.epi.equiptoProtecao = undefined;
                	epiEditControl.epi['qtde-epi'] ="1,00";
			        controller.init();		
                	$('#cd-epi').find('*').filter(':input:visible:first').focus();
                } else {
                	epiEditControl.close();
                }
        	}
        });
    }
    
    /**
     * Alteração de EPI
     */
    this.updateRecord = function(value) {
    	epiId = {pNrOrdProdu: value['nr-ord-produ'], pCdTarefa: value['cd-tarefa'], pCdEpi: value['cd-epi']};
		
        var quantOrig = String(value['qtde-epi']);
        
        value['qtde-epi']   = quantOrig.replace(",",".");

        var params = {
           'qtde-epi': String(value['qtde-epi'])
        };
        
    	bomn130Service.updateRecord(epiId, params, function(result) {
        	if (!result.$hasError) {
            	epiEditControl.isEdit = true;
        		epiEditControl.refresh = true;
        		epiEditControl.sucessNotify(true);
        		epiEditControl.close(false);
        	}
        });
    }
    
    /**
     * Notifica criação e alteração do registro
     */
    this.sucessNotify = function(isUpdate) {
    	// notifica o usuario que conseguiu salvar o registro
        $rootScope.$broadcast(TOTVSEvent.showNotification, {
            type: 'success',
            title: (isUpdate ? $rootScope.i18n('msg-epi-updated') : $rootScope.i18n('msg-epi-created')),
            detail: (isUpdate ? $rootScope.i18n('msg-success-epi-updated') : $rootScope.i18n('msg-success-epi-created'))
        });
    }
    
    
    /**
     * Método para verificar se o formulario é invalido
     */
    this.isInvalidEpiForm = function() {
    	var messages = [];
        var isInvalidForm = false;

        // verifica se o codigo foi informado
        if (!this.epi['cd-tarefa'] || this.epi['cd-tarefa'].length === 0) {
            isInvalidForm = true;
            messages.push('l-task');
        }
        
        // verifica se o EPI foi informada
        if ((this.epi.equiptoProtecao == undefined) ||
            (this.epi.equiptoProtecao !== undefined && this.epi.equiptoProtecao['cd-epi'].length === 0)) {
            isInvalidForm = true;
            messages.push('l-epi');
        }

        // verifica se a Quantidade foi informada
        if (!this.epi['qtde-epi'] || this.epi['qtde-epi'].length === 0) {
            isInvalidForm = true;
            messages.push('l-quantity');
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
    	model.refresh = epiEditControl.refresh;
    	model.isSaveNew = epiEditControl.isSaveNew;
    	model.isEdit = epiEditControl.isEdit;
        $modalInstance.close();
    }
	
	// *********************************************************************************
    // *** Control Initialize
    // *********************************************************************************
     
    this.init = function() {

        model.isSaveNew = false;
    	
        var quantOrig = String(epiEditControl.epi['qtde-epi']);
        epiEditControl.epi['qtde-epi'] = quantOrig.replace(".","");
        
    	if (epiEditControl.epi.isNew) {
        	epiEditControl.headerTitle = $rootScope.i18n('l-add');
        	epiEditControl.epi['qtde-epi'] = "1,00";
        	$timeout(function() {
        		$('#cd-tarefa').find('*').filter(':input:visible:first').focus();
            },500);
    	} else {
    		epiEditControl.headerTitle = $rootScope.i18n('l-edit');
 		    epiEditControl.epi.equiptoProtecao = {'cd-epi': epiEditControl.epi['cd-epi']}
        	$timeout(function() {
         		$('#qtde-epi').find('*').filter(':input:visible:first').focus();
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
     
    // cria um listerner de evento para inicializar o epiEditControl somente depois de inicializar o contexto da aplicação.
    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        epiEditControl.init();
    });
        
}	
	 index.register.controller('mmi.order.epi.EpiEditCtrl', epiEditController);
 });

