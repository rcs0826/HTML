define(['index',
		'/dts/mmi/js/dbo/bomn136.js',
		'/dts/mmi/html/order/task/task-edit.js',
		'/dts/mmi/html/order/task/task-suspend.js',
		'/dts/mmi/html/order/task/task-accept.js'], function(index) {

    /**
     * materialsController
     */
    taskListController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'TOTVSEvent',
        'mmi.bomn136.Service',
        '$modal',
        '$anchorScroll',
        '$location',
        '$stateParams',
		'helperOrder',
		'fchmip.fchmiporder.Factory'
    ];

    function taskListController($rootScope, 
     							$scope,
    							TOTVSEvent,
                                bomn136Service,
                                $modal,
                                $anchorScroll,
                                $location,
                                $stateParams,
								helperOrder,
								fchmiporder) {

    	/**
    	 * taskListControl
    	 */ 
    	var taskCtrl = this;

		/**
		 * Controle da tarefa em edição
		 */
		this.task = {};

        this.selectedItem;

		this.disableAdd = helperOrder.data['estado-om'] !== 4;
		
		this.showButton = helperOrder.data.showButton === undefined;

		/**
		 * Tarefa mão de Obra
		 */
		this.taskReport = {};

        /**
         * Lista de Tarefas
         */
        taskCtrl.listOfTasks = [];
        
        taskCtrl.isTaksUpdate = false;
              

    	// *********************************************************************************
        // *** Funções
        // *********************************************************************************

		$rootScope.$on('loadOrder', function(){
			taskCtrl.listOfTasks = [];
			taskCtrl.loadTasks($stateParams.id);
			taskCtrl.disableAdd = helperOrder.data['estado-om'] !== 4;
		});

        $rootScope.$on('getListOrder', function(){
        	taskCtrl.disableAdd = helperOrder.data['estado-om'] !== 4;
        });

	    /**
		 * Método de leitura das tarefas
		 */
		taskCtrl.loadTasks = function(value) {

			if (taskCtrl.listOfTasks.length > 0  && taskCtrl.isTaksUpdate == false) return;
			
			var where = "ord-taref.nr-ord-produ = " + value;
			var parameters = {};
	        parameters.where = where;
 
	        bomn136Service.findRecords(0, 9999, parameters, function(result) {
	            if (result) {
	            	angular.forEach(result, function (value) {						
						value.estadoOrdem     = null;
						value.descEstadoOrdem = "";
						value.situacaoOrdem   = null;
						value.descSituacao    = "";
						if (value.narrativa == null) value.narrativa = "";
	                    taskCtrl.listOfTasks.push(value);
	                });
	                taskCtrl.listOfTasks = result;
	                detailOrderCtrl.listOfTasks = taskCtrl.listOfTasks;
	                taskCtrl.isTaksUpdate = false;
	            }
	        });
	    }

		/**
	     * Remove tarefa
	     */
	    taskCtrl.removeTask = function(value) {

	    	if (!taskCtrl.disableAdd) return;
	    	
	    	var taskId;
	    	
	    	taskId = {pNrOrdProdu: detailOrderCtrl.model['nr-ord-produ'], pCdTarefa: value['cd-tarefa']};

	    	$rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-confirm-delete-record', [value['cd-tarefa']]),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {

	                    bomn136Service.deleteRecord(taskId, function(result) {
	                    	if (!result.$hasError) {

							    detailOrderCtrl.reloadSpecialty = true;
							    detailOrderCtrl.reloadMaterials = true;
							    detailOrderCtrl.reloadEpi 	    = true;
							    detailOrderCtrl.reloadTools 	= true;
							    detailOrderCtrl.reloadShift 	= true;
							    detailOrderCtrl.reloadMethod    = true;
								detailOrderCtrl.reloadPert      = true;

	                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                                type: 'success',
	                                title: $rootScope.i18n('msg-task-delete'),
	                                detail: $rootScope.i18n('msg-success-task-delete')
	                            });

	                            var index = taskCtrl.listOfTasks.indexOf(value);
	    	        			taskCtrl.listOfTasks.splice(index, 1);
	    	        			detailOrderCtrl.listOfTasks = taskCtrl.listOfTasks;
	                        }
	                    });
	                }
	            }
	        });
	    }

	    /**
		 * Abre tela de detalhe da tarefa
		 */
		taskCtrl.openTaskDetail = function(value) {	
			if (detailOrderCtrl.tpManut) {
				value["tp-manut"] = detailOrderCtrl.tpManut;
			}

			if (helperOrder){
				helperOrder.data['current-task'] = value['cd-tarefa'];
			}


			var modalInstance = $modal.open({
	            templateUrl: '/dts/mmi/html/order/task/task.detail.html',
	            controller: 'mmi.order.TaskDetailCtrl as taskDetailController',
				size: 'lg',
				backdrop: 'static',
                keyboard: true,
	            resolve: {
	            	model: function () {
	            		return value;
	            	}
	            }
	        });	        			
		}

		/**
		 * Abre tela de edição da tarefa
		 */
		taskCtrl.openTaskEdit = function() {

			taskCtrl.task['tp-manut'] = detailOrderCtrl.model['tp-manut'];
			
			var modalInstance = $modal.open({
	            templateUrl: '/dts/mmi/html/order/task/task.edit.html',
	            controller: 'mmi.order.TaskEditCtrl as taskEditControl',
	            size: 'lg',
				backdrop: 'static',
				keyboard: true,
	            resolve: {
	            	model: function () {
	            		return taskCtrl.task;
	            	}
	            }
			});
			
	        modalInstance.result.then(function(){
	        	var taskLink = "task" + taskCtrl.task['cd-tarefa'];
	        	if (taskCtrl.task.refresh) {
					taskId = {pNrOrdProdu: taskCtrl.task['nr-ord-produ'], pCdTarefa: taskCtrl.task['cd-tarefa']};
					taskCtrl.isTaksUpdate = true;
					taskCtrl.loadTasks($stateParams.id);
				}

		    }, function(){
		    	 if (taskCtrl.task.isSaveNew){
		         	taskCtrl.listOfTasks = [];
					taskCtrl.loadTasks($stateParams.id);
	             }
	        });	       			

		}

	    /**
	     * Rola scroll para a tarefa criada
	     */
	    taskCtrl.goToTask = function(value) {
	    	$location.hash(value);
	        $anchorScroll();
	    }

	    /**
	     * Alteração de tarefa
	     */
	    taskCtrl.taskEdit = function(value) {
	    	if (!taskCtrl.disableAdd) return;
	    	taskCtrl.task = angular.copy(value);
	    	taskCtrl.task.isNew = false;
	    	taskCtrl.openTaskEdit();
	    }

	    /**
	     * Busca número da última tarefa
	     */
	    taskCtrl.getLastTaskNumber = function() {
	    	var lastTask = 0;
	    	var length = taskCtrl.listOfTasks.length;

	    	if (length > 0) {
	    		length = length - 1;
	    		lastTask = parseInt(taskCtrl.listOfTasks[length]['cd-tarefa']);
	    	}

	    	taskCtrl.task['nr-ord-produ'] = detailOrderCtrl.model['nr-ord-produ']; 
	    	taskCtrl.task['cd-tarefa']    = String(lastTask + 10);	    	
	    }

	    /**
	     * Habilita edição de tarefas
	     */
	    taskCtrl.taskEditForm = function(value) {
	    	detailOrderCtrl.isTaskEdit = (value === true);
	    	if (value === true) {
	    		taskCtrl.goToTask("taskEditForm");
	    	}
	    }

	    /**
	     * Inclusão de tarefa
	     */
	    taskCtrl.taskAdd = function() {
	    	taskCtrl.task = {};	    	
	    	taskCtrl.task.tempo = "0";
	    	taskCtrl.task.isNew = true;
	    	taskCtrl.getLastTaskNumber();	    	
	    	taskCtrl.openTaskEdit();
		}
		
		taskCtrl.updateTaskStatus = function(task){

			var model = {"task": task,
					     "atualizaSucessoras": false,
						 "estadoOM": 0};

			var modalInstance = $modal.open({
	            templateUrl: '/dts/mmi/html/order/task/task.suspend.html',
	            controller: 'mmi.order.suspendCtrl as suspendController',
				size: 'md',
				backdrop: 'static',
				keyboard: true,
	            resolve: {
	            	model: function () {
	            		return model;
	            	}
	            }
			});
			
			modalInstance.result.then(function(){
				var taskId = {pNrOrdProdu: task['nr-ord-produ'], pCdTarefa: task['cd-tarefa']};

				if (model.atualizaSucessoras) {
					taskCtrl.listOfTasks = [];
					taskCtrl.loadTasks(taskId.pNrOrdProdu);	
				} else {					
					bomn136Service.getRecord(taskId, function(result) {
						angular.copy(result, task);
					});
				}

				detailOrderCtrl.model['estado-om'] = model.estadoOM;
				detailOrderCtrl.model.situacao = model.estadoOM;
				detailOrderCtrl.loadOrderHistory(model);
				
			}, function(){
				var taskId = {pNrOrdProdu: task['nr-ord-produ'], pCdTarefa: task['cd-tarefa']};
				bomn136Service.getRecord(taskId, function(result) {
					angular.copy(result, task);
				});
				
				if (model.estadoOM !== 0) {
					detailOrderCtrl.model['estado-om'] = model.estadoOM;
					detailOrderCtrl.model.situacao = model.estadoOM;
					detailOrderCtrl.loadOrderHistory(model);
				}
		    });
		}

	    /**
		 * Abre tela de apontamento mão de obra
		 */
		taskCtrl.openLaborReport = function(value) {			
			if (detailOrderCtrl.isTaskEdit || value['estado-taref'] == 4) return;
						
			taskCtrl.taskReport = value;
			taskCtrl.task = value;
			
			var modalInstance = $modal.open({
	            templateUrl: '/dts/mmi/html/order/laborreport/laborreport.edit.html',
	            controller: 'mmi.order.LaborReportCtrl as laborController',
	            size: 'lg',
				backdrop: 'static',
                keyboard: true,
	            resolve: {
	            	model: function () {
	            		return taskCtrl.taskReport;
	            	}
	            }
	        });
					
	        modalInstance.result.then(function(){
	        	
	        	if(taskCtrl.taskReport.estadoTarefa)
	        		taskCtrl.task['estado-taref'] = taskCtrl.taskReport.estadoTarefa;
	        		        	
	        	if(taskCtrl.taskReport.estadoOrdem)
	        		detailOrderCtrl.model.estado         = taskCtrl.taskReport.estadoOrdem;

	        	if(taskCtrl.taskReport.descEstadoOrdem)
	        		detailOrderCtrl.model['des-estado']  = taskCtrl.taskReport.descEstadoOrdem;

	        	if(taskCtrl.taskReport.situacaoOrdem)
	        		detailOrderCtrl.model['estado-om']   = taskCtrl.taskReport.situacaoOrdem;

	        	if(taskCtrl.taskReport.descSituacao)
	        		detailOrderCtrl.model['des-situacao'] = taskCtrl.taskReport.descSituacao;

	        });
		}

		taskCtrl.aceiteTarefa = function(task) {
			var params = {
				'pNrOrdProdu': task["nr-ord-produ"],
				'pCdTarefa': task["cd-tarefa"]
			};
			
			fchmiporder.usuarioPossuiPermissaoAceite(params, function(result) {
				if (result && result.possuiPermissao) {
					this.aceiteTarefaCallback(task);
				}
			});			
		}

		aceiteTarefaCallback = function(task) {
			
			var model = {"task": task};

			$modal.open({
	            templateUrl: '/dts/mmi/html/order/task/task.accept.html',
	            controller: 'mmi.order.acceptCtrl as acceptController',
				size: 'md',
				backdrop: 'static',
				keyboard: true,
	            resolve: {
	            	model: function () {
	            		return model;
	            	}
	            }
			});
			
		}

    	// *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
         
        taskCtrl.init = function() {
        	taskCtrl.loadTasks($stateParams.id);
        }
         
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { taskCtrl.init(); }    
         
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
         
        // cria um listerner de evento para inicializar o taskEditControl somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
            
    }

    index.register.controller('mmi.order.task.taskListCtrl', taskListController);

});