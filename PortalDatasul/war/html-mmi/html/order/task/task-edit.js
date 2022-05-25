/**
 * taskEditController
 */
taskEditController.$inject = [	                              
	'$rootScope',	         
	'$scope',
	'$modalInstance',
	'model',
	'$filter',
	'TOTVSEvent',
	'mmi.bomn136.Service',
	'$timeout',
	'fchmip.fchmiporder.Factory'
];

function taskEditController($rootScope, 
							$scope,
							$modalInstance,
							model,
							$filter,
							TOTVSEvent,
							bomn136Service,
							$timeout,
							fchmiporderFactory) {

	/**
	 * taskEditControl
	 */ 
	var taskEditControl = this;
	
	this.task = model;
	
	this.lastTask = model['cd-tarefa'] - 10;

	this.saveUrl = '/dts/datasul-rest/resources/api/fch/fchmip/fchmiporder/uploadFile';
    
	// *********************************************************************************
    // *** Funções
    // *********************************************************************************

    /**
     * Salva tarefa
     */
    this.save = function(again) {
    	taskEditControl.task.isSaveNew = again;
    	
        //valida campos obrigatórios
        if (taskEditControl.isInvalidTaskForm()) {
            return;
        }
        
        if (taskEditControl.task.isNew) {
            taskEditControl.saveRecord();
        } else {
            taskEditControl.updateRecord();
        }
    }

    /**
     * Criação de tarefa
     */
    this.saveRecord = function() {
    	var taskLink = "task" + taskEditControl.task['cd-tarefa'];

    	//inicializa atributos padrões
    	taskEditControl.task["nr-ord-produ"] = taskEditControl.task['nr-ord-produ'];
    	taskEditControl.task.estado = 1;
    	taskEditControl.task.tempo = parseFloat(taskEditControl.task.tempo);
        if(taskEditControl.task['tar-obrigatoria'] === undefined){
        	taskEditControl.task['tar-obrigatoria'] = false;
		}
		    	
        if (taskEditControl.task['tp-manut'] === 2) {
        	fchmiporderFactory.createTaskPredictive(taskEditControl.task, function(result) {
        		if (!result.hasError) { 
                    
	                if (taskEditControl.task.isSaveNew){
	                	
	                	if (taskEditControl.lastTask > parseInt(taskEditControl.task['cd-tarefa'])){
	                		taskEditControl.task['cd-tarefa'] = parseInt(taskEditControl.lastTask) + 10;
	                	} else {
	                		taskEditControl.lastTask = taskEditControl.task['cd-tarefa'];
	                		taskEditControl.task['cd-tarefa'] = parseInt(taskEditControl.task['cd-tarefa']) + 10;
	                	}

                        taskEditControl.sucessNotify(true);
	                	taskEditControl.task = {
	                			'nr-ord-produ'  : taskEditControl.task['nr-ord-produ'],
	                			'cd-tarefa'     : taskEditControl.task['cd-tarefa'],
	                			'tp-manut'      : taskEditControl.task['tp-manut'],
		                		'isNew'         : taskEditControl.task.isNew,
		                		'idi-acao-apoio': 1,
								'tempo'         : 0,
								'nr-ord-apoio'  : "",
		                		'estado-taref'  : 1
		                	};
	                	taskEditControl.setFocus();
	                        
	                } else { 
		                   model.refresh = true;
		                   taskEditControl.sucessNotify(true);
		            	   taskEditControl.close(); 
	                  }  
	        	}
        	});
        	
        } else {        
	    	bomn136Service.saveRecord(taskEditControl.task, function(result) {
		        if (!result.$hasError) { 
		        	
					if (taskEditControl.task.isSaveNew){
	                	
	                	if (taskEditControl.lastTask > parseInt(taskEditControl.task['cd-tarefa'])){
	                		taskEditControl.task['cd-tarefa'] = parseInt(taskEditControl.lastTask) + 10;
	                	} else {
	                		taskEditControl.lastTask = taskEditControl.task['cd-tarefa'];
	                		taskEditControl.task['cd-tarefa'] = parseInt(taskEditControl.task['cd-tarefa']) + 10;
	                	}
					
	               	    taskEditControl.sucessNotify(true);
	                	taskEditControl.task = {
		               			'nr-ord-produ': taskEditControl.task['nr-ord-produ'],
		               			'cd-tarefa'   : taskEditControl.task['cd-tarefa'],
		               			'tp-manut'    : taskEditControl.task['tp-manut'],
			               		'isNew'       : taskEditControl.task.isNew,
			               		'tempo'       : 0,
			               		'local-taref' : "1",
			               		'tipo-oper'   : "1",
								'nr-pontos'   : "0",
								'vl-padrao'   : 0,
								'var-menor'   : 0,
								'var-maior'   : 0,
								'tp-variavel' : 1
						};	
						                	
	                	taskEditControl.setFocus();
	                	
	            	} else {
		                model.refresh = true;
		                taskEditControl.sucessNotify(true);
		                taskEditControl.close(); 
	             	}  
		        }
	        });
        }
    }

    /**
     * Alteração de tarefa
     */
    this.updateRecord = function() {
    	var taskParam = {};
    	
    	angular.copy(taskEditControl.task, taskParam);
    	
    	if (taskEditControl.task['tp-manut'] === 2 && taskEditControl.task['nr-ord-apoio'] == "") {
    		if (!taskEditControl.task['cod-tecnica']) {
    			taskParam['cod-tecnica'] = "";    			
    		}    		
        	fchmiporderFactory.updateTaskPredictive(taskParam, function(result) {
        		if (!result.hasError) {
	                model.refresh = true;
	                taskEditControl.sucessNotify(true);
	                taskEditControl.close();        		
	        	}
        	});
        } else {
        	var taskId = {pNrOrdProdu: taskEditControl.task['nr-ord-produ'], pCdTarefa: taskEditControl.task['cd-tarefa']};
	    	bomn136Service.updateRecord(taskId, taskEditControl.task, function(result) {
	        	if (!result.$hasError) {
	        		model.refresh = true;
	                taskEditControl.sucessNotify(true);
	                taskEditControl.close();
	        	}
	        });
        }
    }
    
    /**
     * Método para verificar se o formulario é invalido
     */
    this.isInvalidTaskForm = function() {
    	var messages = [];
        var isInvalidForm = false;
        
        // verifica se o codigo foi informado
        if (!taskEditControl.task['cd-tarefa'] || taskEditControl.task['cd-tarefa'].length === 0) {
            isInvalidForm = true;
            messages.push('l-task');
        }
		//Verifica se o aceite esta marcado se sim, obrigatorio informar valor no campo "Nome abreviado"" 
		if(taskEditControl.task['aceite'] && (!taskEditControl.task['nome-abrev']
		  || taskEditControl.task['nome-abrev'].length === 0)){
			isInvalidForm = true;
            messages.push('l-short-name');
		}

        // verifica se a descrição foi informada
        if (!taskEditControl.task['descricao'] || taskEditControl.task['descricao'].length === 0) {
            isInvalidForm = true;
            messages.push('l-description');
        }
        
       // verifica se o tempo nao esta "".
        if (taskEditControl.task['tempo'].length === 0) {
            isInvalidForm = true;
            messages.push('l-time-2');
        }
		
        if (taskEditControl.task['tp-manut'] === 3) {
			if (taskEditControl.task['vl-padrao'].length === 0) {
	            isInvalidForm = true;
	            messages.push('l-default');
	        }
			
			if (taskEditControl.task['var-menor'].length === 0) {
	            isInvalidForm = true;
	            messages.push('l-variation-lower');
			}
	
			if (taskEditControl.task['var-maior'].length === 0) {
	            isInvalidForm = true;
	            messages.push('l-variation-greater');
	        }
        }

		if (taskEditControl.task['tp-manut'] === 2) {
        	if (taskEditControl.task['idi-acao-apoio'] > 1) {
        		if (!taskEditControl.task['cd-manut-apoio'] || taskEditControl.task['cd-manut-apoio'].length === 0) {
                    isInvalidForm = true;
                    messages.push('l-maintenance');
                }
        	}        	
        }
        
        if (taskEditControl.task['tp-manut'] === 4) {
    		if (!taskEditControl.task['nr-pontos']) {
    			taskEditControl.task['nr-pontos'] = 0;
    		}
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
    this.sucessNotify = function(isUpdate) {
    	// notifica o usuario que conseguiu salvar o registro
        $rootScope.$broadcast(TOTVSEvent.showNotification, {
            type: 'success',
            title: (isUpdate ? $rootScope.i18n('msg-task-update') : $rootScope.i18n('msg-task-created')),
            detail: (isUpdate ? $rootScope.i18n('msg-success-task-update') : $rootScope.i18n('msg-success-task-created'))
        });
    }
    
    this.changeTechinique = function() {
    	if (!taskEditControl.task['cod-tecnica']) {
    		taskEditControl.task['idi-acao-apoio'] = 1;
    		taskEditControl.task['cd-manut-apoio'] = undefined;
    	}
    }
    
    this.changeAction = function() {
		
    	if (taskEditControl.task['idi-acao-apoio'] == 1) {
    		taskEditControl.task['cd-manut-apoio'] = undefined;
    		taskEditControl.task['cod-tecnica'] = undefined;
    	}
    }
    
    this.setFocus = function() {
    	$timeout(function() {
    		$('#descricao').find('*').filter(':input:visible:first').focus();
        },500);
	}
	

	/******************
	 **        	Upload
	 ******************/
	this.leaveDocAnexo = function(){

		if (taskEditControl.task['cod-docto-anexo'] == null || taskEditControl.task['cod-docto-anexo'] == undefined){
			taskEditControl.codDoctoAnexo = undefined;
		}
	}

	this.onSelect = function(){
		taskEditControl.task['cod-docto-anexo'] = taskEditControl.task.files[0].name.replace(/&amp;/g, '&');
	}
	
	this.onSuccess = function(value){

		angular.forEach(value.files, function(result){
			taskEditControl.codDoctoAnexo = result.name;
		});
	}

	this.onError = function(value){
		taskEditControl.task['cod-docto-anexo'] = undefined;

		$rootScope.$broadcast(TOTVSEvent.showNotification, {
			type: 'error',
			title: $rootScope.i18n('msg-anexo'),
			detail: $rootScope.i18n('msg-file-send-error')
		});
	}
	/**********************
 	 *** 		FIM UPLOAD 
	 **********************/

    
    taskEditControl.close = function () {
    	
        $modalInstance.close();
    }
    
    /**
     * Fechar janela - cancelamento
     */
    taskEditControl.cancel = function () {
    	        	
        if (taskEditControl.task.isSaveNew){
        	
        	model.refresh = true;
        	$modalInstance.close();
        }
         else
            $modalInstance.dismiss();// dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
    }
	
	// *********************************************************************************
    // *** Control Initialize
    // *********************************************************************************
     
    this.init = function() {
    	
    	taskEditControl.optionsTask = [{value: 1, label: $rootScope.i18n('l-during-maintenance')},
                                       {value: 2, label: $rootScope.i18n('l-before-maintenance')},
                                       {value: 3, label: $rootScope.i18n('l-after-maintenance')}];
    	
    	taskEditControl.optionsOperation = [{value: 1, label: $rootScope.i18n('l-asset-stopped')},
										   {value: 2, label: $rootScope.i18n('l-asset-working')}];
		
		taskEditControl.optionsVariable = [{value: 1, label: $rootScope.i18n('l-percentage')},
    	                                   {value: 2, label: $rootScope.i18n('l-absolute')}];								   

    	
    	taskEditControl.optionsSupp = [{value: 1, label: $rootScope.i18n('l-not-gen-trans'), disabled: "!taskEditControl.task['cod-tecnica']"},
                                       {value: 2, label: $rootScope.i18n('l-gen-work-request'), disabled: "!taskEditControl.task['cod-tecnica']"},
                                       {value: 3, label: $rootScope.i18n('l-gen-work-order'), disabled: "!taskEditControl.task['cod-tecnica']"}];
    	
        if (taskEditControl.task.isNew) {
    		taskEditControl.headerTitle = $rootScope.i18n('l-new-task');
    		taskEditControl.task['local-taref'] = 1;
    		taskEditControl.task['tipo-oper'] = 1;
    		taskEditControl.task['nr-pontos'] = "0";
    		taskEditControl.task['idi-acao-apoio'] = 1;
    		taskEditControl.task['nr-ord-apoio'] = "";
			taskEditControl.task['estado-taref'] = 1;
			taskEditControl.task['tp-variavel'] = 1;
			taskEditControl.task['vl-padrao'] = 0;
			taskEditControl.task['var-menor'] = 0;
			taskEditControl.task['var-maior'] = 0;
			taskEditControl.task['tp-variavel'] = 1;
			    		
    	} else {
    		taskEditControl.headerTitle = taskEditControl.task['cd-tarefa'] + " - " + taskEditControl.task.descricao;
    		
    		if (taskEditControl.task['tp-manut'] === 2) {
    			if (taskEditControl.task['_']['cod-tecnica'] != "") {
    				taskEditControl.task['cod-tecnica'] = taskEditControl.task['_']['cod-tecnica'];
    			}
    			
    			taskEditControl.task['idi-acao-apoio'] = taskEditControl.task['_']['idi-acao-apoio'];
    			
    			if (taskEditControl.task['_']['cd-manut-apoio'] != "") {
    				taskEditControl.task['cd-manut-apoio'] = taskEditControl.task['_']['cd-manut-apoio'];
    			}
    			
    			taskEditControl.task['nr-ord-apoio'] = taskEditControl.task['_']['nr-ord-apoio'];
    			
    			if (!taskEditControl.task['idi-acao-apoio'] || taskEditControl.task['idi-acao-apoio'] == 0) {
    				taskEditControl.task['idi-acao-apoio'] = 1;
    				taskEditControl.task['nr-ord-apoio'] = "";
    			}    			
    		}
		}
        
        taskEditControl.setFocus();
    }    
        
    // se o contexto da aplicação já carregou, inicializa a tela.
    if ($rootScope.currentuserLoaded) { this.init(); }
    
    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
	    $modalInstance.dismiss('cancel');
	});
     
    // *********************************************************************************
    // *** Events Listners
    // *********************************************************************************
     
    // cria um listerner de evento para inicializar o taskEditControl somente depois de inicializar o contexto da aplicação.
    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
        taskEditControl.init();
    });
        
}