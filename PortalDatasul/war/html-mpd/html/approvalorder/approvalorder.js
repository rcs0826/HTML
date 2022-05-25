define(['index', // index sempre deve ser injetado para permitir o registro dos controllers.
        '/dts/mpd/js/portal-factories.js',
		'/dts/mpd/js/api/fchdis0047.js',
        '/dts/mpd/js/api/fchdis0049.js',
        '/dts/mpd/js/userpreference.js',
		'/dts/mpd/js/zoom/estabelec.js'                         
       ], function(index) {
            
    index.stateProvider    
    .state('dts/mpd/approvalorder', {                
        abstract: true,
        template: '<ui-view/>' // <ui-view/> é onde os states filhos são renderizados
     })
         
     // definição do state inicial, o state é carregado a partir de sua URL
     .state('dts/mpd/approvalorder.start', {    
         url:'/dts/mpd/approvalorder',
         controller:'mpd.approval-order-list.Control',
         controllerAs: 'controller',
         templateUrl:'/dts/mpd/html/approvalorder/approval-order.list.html'
     })

approvalOrderListController.$inject = ['$rootScope', '$location', 'totvs.app-main-view.Service', 'salesorder.portalordersmanager.Factory', 'mpd.orderappsummaryapd.Factory', 'userPreference', 'portal.generic.Controller', 'portal.getUserData.factory', '$filter', '$modal', 'TOTVSEvent'];

function approvalOrderListController($rootScope, $location, appViewService, deleteApprovalOrderResource, orderApprovalResource, userPreference, genericController, userdata, $filter, $modal, TOTVSEvent) {
         
        var controller = this;
		controller.orderAlreadryload   = [];
		var valueIdStates = {};				 
         
        controller.date = $filter('date');
		controller.i18n = $filter('i18n');		
						
		genericController.decorate(controller, orderApprovalResource);		
		controller.advancedSearch = {model: {}};		
						
		controller.loadMore = function() {									
            this.findRecords(controller.listResult.length, controller.filterBy);
        };
        		                      
        controller.search = function() {     									   	
            controller.clearDefaultData(true);
		    controller.clearFilter();
            controller.addFilters();
            controller.loadData();			
        }
		
		controller.removeSelectedFilter = function(filter) {

			controller.removeFilter(filter);
			if (filter.property == "simpleFilter") {
				controller.quickSearchText = '';
			}
			delete controller.advancedSearch.model[filter.property];
            controller.loadData();
        }
		
		this.fconsiderTimeVendas = function () {
			
            if(orderAppSumController.lconsiderTimeVendas){                
                //orderAppSumController.hierarquia = 1;
            }else{                
                //orderAppSumController.hierarquia = 0
            }
        }
								
		controller.setQuickFilter = function(value) {					                                				   									                        
		    controller.clearFilter();
													
			if (value === 1) {
                controller.addFilter("statusOrder1", value, 'l-status', controller.i18n('l-cod-sit-ped-1'), controller);
            }			
			if (value === 2) {
                controller.addFilter("statusOrder2", value, 'l-status', controller.i18n('l-cod-sit-ped-2'), controller);
            }			
			if (value === 3) {
                controller.addFilter("statusOrder3", value, 'l-status', controller.i18n('l-cod-sit-ped-3'), controller);
            }			
			if (value === 4) {
                controller.addFilter("statusOrder4", value, 'l-status', controller.i18n('l-cod-sit-ped-4'), controller);
            }			
			if (value === 5) {
                controller.addFilter("statusOrder5", value, 'l-status', controller.i18n('l-cod-sit-ped-5'), controller);
            }			
			if (value === 6) {
                controller.addFilter("statusOrder6", value, 'l-status', controller.i18n('l-cod-sit-ped-6'), controller);
            }			
			if (value === 7) {
                controller.addFilter("statusOrder7", value, 'l-status', controller.i18n('l-cod-sit-ped-7'), controller);
            }		
																																				    
		    controller.addFilters();		    
		    controller.loadData();
		} 		       
		
		              
		controller.addFilters = function(){			
			if (controller.advancedSearch.lconsiderTimeVendas) {				
		        controller.addFilter("consideraTimeVendas", controller.advancedSearch.lconsiderTimeVendas, '', controller.i18n('l-consider-time-vendas'));
		    }									
			if (controller.advancedSearch.codEstabel) {
		        controller.addFilter("codEstabel", controller.advancedSearch.codEstabel, '', controller.i18n('l-estabel') + ':' + controller.advancedSearch.codEstabel);
		    }																								
		    if (controller.advancedSearch.codGrCliIni) {
		        controller.addFilter("codGrCliIni", controller.advancedSearch.codGrCliIni, '', controller.i18n('l-initial-gr-cli') + ':' + controller.advancedSearch.codGrCliIni);
		    }
			if (controller.advancedSearch.codGrCliFim) {
		        controller.addFilter("codGrCliFim", controller.advancedSearch.codGrCliFim, '', controller.i18n('l-final-gr-cli') + ':' + controller.advancedSearch.codGrCliFim);
		    }
			if (controller.advancedSearch.nomeAbrevIni) {
		        controller.addFilter("nomeAbrevIni", controller.advancedSearch.nomeAbrevIni, '', controller.i18n('l-initial-short-name') + ':' + controller.advancedSearch.nomeAbrevIni);
		    }
			if (controller.advancedSearch.nomeAbrevFim) {
		        controller.addFilter("nomeAbrevFim", controller.advancedSearch.nomeAbrevFim, '', controller.i18n('l-final-short-name') + ':' + controller.advancedSearch.nomeAbrevFim);
		    }
			if (controller.advancedSearch.nrPedCliIni) {
		        controller.addFilter("nrPedCliIni", controller.advancedSearch.nrPedCliIni, '', controller.i18n('l-initial-nr-pedido') + ':' + controller.advancedSearch.nrPedCliIni);
		    }
			if (controller.advancedSearch.nrPedCliFim) {
		        controller.addFilter("nrPedCliFim", controller.advancedSearch.nrPedCliFim, '', controller.i18n('l-final-nr-pedido') + ':' + controller.advancedSearch.nrPedCliFim);
		    }															
			if (controller.advancedSearch.repPriIni) {
		        controller.addFilter("repPriIni", controller.advancedSearch.repPriIni, '', controller.i18n('l-initial-rep-pri') + ':' + controller.advancedSearch.repPriIni);
		    }
			if (controller.advancedSearch.repPriFim) {
		        controller.addFilter("repPriFim", controller.advancedSearch.repPriFim, '', controller.i18n('l-final-rep-pri') + ':' + controller.advancedSearch.repPriFim);
		    }
			if (controller.advancedSearch.dtEmisIni) {
		        controller.addFilter("dtEmisIni", controller.advancedSearch.dtEmisIni, '', controller.i18n('l-initial-rep-pri') + ':' + controller.advancedSearch.dtEmisIni);
		    }
			if (controller.advancedSearch.dtEmisFim) {
		        controller.addFilter("dtEmisFim", controller.advancedSearch.dtEmisFim, '', controller.i18n('l-final-rep-pri') + ':' + controller.advancedSearch.dtEmisFim);
		    }												
			if (controller.quickSearchText) {																						
				controller.addFilter("simpleFilter", controller.quickSearchText, '', controller.i18n('l-simple-filter') + ':' + controller.quickSearchText);
			}		    		
		}        						
				
        controller.loadData = function () {																																																			
			controller.findRecords(null, controller.filterBy);									
        }
											
		this.openModalSavaAndSendTask = function(orderApp) {																			
            var modalInstance = $modal.open({
                templateUrl: '/dts/mpd/html/approvalorder/approval-order.saveandsendtask.html',
                controller: 'mpd.orderapproval.saveandsendtask.Controller as controller',
                size: 'lg',
                resolve: {
                    model: function () {
                        return orderApp;
                    }
                }
            });
            
            modalInstance.result.then(function () {
                controller.loadData();
            });                        
		}			
																									
		this.getOrderItens = function(order) {																				
            if (!order.orderItens) {								
                orderApprovalResource.searchApprovalOrderItem({nrPedido: order['nr_pedido']}, function(result) {												
					order.orderItens = result;													                    								
                });				
            }			
        };	
			
		// Tela de filtro avançado							
		controller.openAdvancedSearch = function() {
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/approvalorder/approval-order.search.html',
			  controller: 'mpd.orderapproval.adv-search.Controller as controller',
			  size: 'lg',
			  resolve: {
				model: function () {
				  return controller.advancedSearch;
				}
			  }
			});

		}					
																							
		if (appViewService.startView(controller.i18n('Pedidos'), 'mpd.approval-order-list.Control', controller)) {
		    controller.loadData()
		}
		
		this.removeOrder = function(orderManager) {
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                    title: 'l-remove-order-title',
                    text: $rootScope.i18n('l-remove-order-text') + " " + orderManager['nr_pedcli'] + " " +  $rootScope.i18n('l-of-customer') + " " + orderManager['nome_abrev'] + "?",
                    cancelLabel: 'l-no',
                    confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                        deleteApprovalOrderResource.deleteOrder({nrPedCli: orderManager['nr_pedcli'], nomeAbrev: orderManager['nome_abrev']},function(result) {
                            if(result.$hasError == true){
                                return;
                            }
                            else{
                                ctrl.loadData();
                            }
                        });
                    }
                }
            });
        };
										        		                                               
    }
     
    orderApprovalAdvSearchController.$inject = ['$modalInstance', 'model'];
	function orderApprovalAdvSearchController ($modalInstance, model) {
		
		this.advancedSearch = model;				
		this.search = function () {
			$modalInstance.close();
		}
		
		this.close = function () {
			$modalInstance.dismiss();
		}
	}	
	
	approvalOrderSaveAndSendTask.$inject = ['mpd.orderappsummaryapd.Factory', '$modalInstance', 'model', '$filter'];
    function approvalOrderSaveAndSendTask (orderapp, $modalInstance, model, $filter) {

        var i18n = $filter('i18n');
        var ctrl = this;
        ctrl.selectedOptionTask    =  0;
		ctrl.selectedOptionIdUnico = -1;										
        ctrl.orderManager = model;
		ctrl.selectedUserToTransfer = " ";	
		ctrl.desconto = model.descontoUsuario;	
        		 				 				    
        this.taskOptions = function(orderOptions){												
			var params = {processInstanceId: orderOptions.processInstanceId,
			              movementSequence: orderOptions.movementSequence,
						  sourceThreadSequence: orderOptions.sourceThreadSequence}
						  				
            orderapp.getTaskOptions(params, function(result) {
																												
                ctrl.taskOptionsList = result;																												
                if(ctrl.taskOptionsList[0]){					
					ctrl.selectedOptionTask    = ctrl.taskOptionsList[0].id;
					ctrl.selectedOptionIdUnico = ctrl.taskOptionsList[0].idUnico;					
				}
				     				
				if(ctrl.taskOptionsList[0]){
																								
                    switch(ctrl.taskOptionsList[0].idUnico){																									 							 							 							 							 
                        case 2: // Atividade de transferencia no workflows						     						                             							
							ctrl.observacao = $filter('i18n')('l-obs-transferencia');
							ctrl.loadUser(ctrl.orderManager, ctrl.taskOptionsList[0].id);                          																				
                            break;							
                        case 3: // Atividade de aprovação no workflows  						                              
							ctrl.observacao = $filter('i18n')('l-obs-aprovacao');
                            break;
                        case 4: // Atividade de reprovação no workflows						                                
							ctrl.observacao = $filter('i18n')('l-obs-reprovacao');  
                            break;
						case 5: // Atividade de renegociacao no workflows                            														
  							ctrl.observacao = $filter('i18n')('l-obs-renegociacao') + model.descontoUsuario + ',00%';																  							
                            break;
								
                    }                    
                }
	
            });                        
        }; 
        								
        this.loadUser = function(orderManager, id){
																							   											
            orderapp.loadUser({processInstanceId: orderManager.processInstanceId, 
						       sourceThreadSequence: orderManager.sourceThreadSequence,
						       numberIdTableStates: id}, function(result) {								   								   								   
                ctrl.usersToTransfer = result;
                if(ctrl.usersToTransfer[0]){
					ctrl.selectedUserToTransfer = ctrl.usersToTransfer[0].username;
					ctrl.observacao = $filter('i18n')('l-obs-transferencia') + ctrl.selectedUserToTransfer;					
				}    
            });
						                        
        };
                
        this.saveAndSendTask = function(){
																							
            switch(ctrl.selectedOptionIdUnico) {							 							 							 							 							 
                case 2: //Atividade de transferencia workflow                    
					ctrl.actionType = "TRANSFERIR";  
                    break; 
                case 3:	 //Atividade de aprovacao no workflows						 
                    ctrl.actionType = "APROVACAO";
                    break;
                case 4: //Atividade de reprovacao no workflows
                    ctrl.actionType = "REPROVACAO";
                    break;
                case 5: //Atividade de renegociacao no workflows
                    ctrl.actionType = "RENEGOCIAR";  
                    break;
            }            
                                    																	
			var paramns = {nrPedCli: model['nr_pedcli'],
		  				  nomeAbrev: model['nome_abrev'],
						  observacao: ctrl.observacao,
						  usuario: ctrl.selectedUserToTransfer,
						  opcao: ctrl.actionType,
						  idStates: ctrl.selectedOptionTask}						  						  
									  						  						  						  						
            orderapp.saveAndSendTask(paramns, function(result){
                if(result.$hasError == true){
                    return;
                }else{
                    $modalInstance.close();
                }
            });
			                      
        };
           
		        
        this.changeOptionTask = function(lista){
																
			var filtrado = lista.filter(function(obj){
				 return obj.idUnico == ctrl.selectedOptionIdUnico;
			});
																											
			switch (filtrado[0].idUnico) {				
				case 2:				
					ctrl.selectedOptionTask = filtrado[0].id;
				    ctrl.observacao = $filter('i18n')('l-obs-transferencia');
					ctrl.loadUser(ctrl.orderManager, ctrl.selectedOptionTask);	
					break;
				case 3:
					ctrl.selectedOptionTask = filtrado[0].id;
					ctrl.observacao = $filter('i18n')('l-obs-aprovacao');							
					break;
				case 4:
					ctrl.selectedOptionTask = filtrado[0].id;
					ctrl.observacao = $filter('i18n')('l-obs-reprovacao');							
					break;
				case 5:
					ctrl.selectedOptionTask = filtrado[0].id;
					ctrl.observacao = $filter('i18n')('l-obs-negociacao') + model.descontoUsuario + ',00%';							
					break;																											
				}
																	    																									
        }
		
        				
        this.close = function () {
            $modalInstance.dismiss();
        }
                    
        ctrl.taskOptions(ctrl.orderManager);            
    }        

				
    // registrar os controllers no angular		
    index.register.controller('mpd.approval-order-list.Control', approvalOrderListController);		
	index.register.controller('mpd.orderapproval.adv-search.Controller', orderApprovalAdvSearchController);
	index.register.controller('mpd.orderapproval.saveandsendtask.Controller', approvalOrderSaveAndSendTask);
				                                   
});