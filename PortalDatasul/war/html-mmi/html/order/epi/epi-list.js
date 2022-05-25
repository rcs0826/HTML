define(['index',
        '/dts/mmi/js/dbo/bomn130.js',
        '/dts/mmi/html/order/epi/epi-edit.js'], function(index) {

    /**
     * epiController
     */
    epiListController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$filter',
        '$timeout',
    	'TOTVSEvent',
        'mmi.bomn130.Service',
        '$modal',
        'helperOrder'
    ];

    function epiListController($rootScope, 
    					       $scope,
    						   $filter,
                               $timeout,
    						   TOTVSEvent,
                               bomn130Service,
                               $modal,
                               helperOrder) {

    	/**
    	 * Controller
    	 */ 
    	var epiCtrl = this;
    	
    	this.epi = {};
    	
    	this.disableAdd = false;
    	
        this.selectedItem;
        
        epiCtrl.showButton = helperOrder.data.showButton === undefined;

        /**
         * Lista de EPI's
         */
        $scope.listOfEpis;
        
    	// *********************************************************************************
        // *** Funções
        // *********************************************************************************
        
        /**
         * Lista EPI's
         */
        epiCtrl.loadDataGridEpi = function(){

        	epiCtrl.isDisabled = false;

            if(detailOrderCtrl.reloadEpi){
                $scope.listOfEpis = undefined;
                detailOrderCtrl.reloadEpi = false;
            }
        	
        	if (detailOrderCtrl.listOfTasks.length < 1)
        		epiCtrl.isDisabled = true;

            if ($scope.listOfEpis) return;

            $scope.listOfEpis = [];
            
            if (detailOrderCtrl.model['estado-om'] === 4){
            	epiCtrl.hideAdd = true;            	
            }

            var where = "ord-epi.nr-ord-produ = " + detailOrderCtrl.model['nr-ord-produ'];
            var parameters = {};
            
            parameters.where = where;

            bomn130Service.findRecords(0, 9999, parameters, function(result) {
                if (result) {
                    angular.forEach(result, function (value) {  
                    	value['des-epi'] = value['_']['des-epi'];
                    	value['qtde-epi'] = $filter('number')(value['qtde-epi'],2);
                        $scope.listOfEpis.push(value);
                    });
                }
            });            
        }
        
        
        /**
         * Adiciona epi
         */
        epiCtrl.addEpi = function() {
        	if (detailOrderCtrl.listOfTasks.length > 0) {        	
        		epiCtrl.epi = {};
        		epiCtrl.epi["nr-ord-produ"] = detailOrderCtrl.model['nr-ord-produ'];
                epiCtrl.epi.isNew = true;
        		epiCtrl.openEpiEdit();
        	} else {
        		$rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning',
                    title: ($rootScope.i18n('msg-task-not-found')),
                    detail: ($rootScope.i18n('msg-order-tasks-not-found'))
                });
        	}
        }
        
        /**
         * Abre tela para edição do EPI
         */
        epiCtrl.openEpiEdit = function() {
        	var taskNumber;
        	
            if(epiCtrl.epi.isNew){
            	if (epiCtrl.selectedItem) {
            		taskNumber = epiCtrl.selectedItem['cd-tarefa']; 
            	} else {        	
            		taskNumber = detailOrderCtrl.listOfTasks[0]['cd-tarefa'];
            	}
            	
            	epiCtrl.epi['cd-tarefa'] = taskNumber;            	
            }
        	
        	var modalInstance = $modal.open({
	            templateUrl: '/dts/mmi/html/order/epi/epi.edit.html',
	            controller: 'mmi.order.epi.EpiEditCtrl as epiEditControl',
	            size: 'md',
                backdrop: 'static',
                keyboard: true,
	            resolve: {
	            	model: function () {
	            		return epiCtrl.epi;	            		 
	            	}
	            }
			});
        	
        	modalInstance.result.then(function(){
        		if (epiCtrl.epi.refresh == true) {
        			if (epiCtrl.epi.isSaveNew || epiCtrl.epi.isEdit) {
        				
        				epiCtrl.epi.isEdit = false;
						$scope.listOfEpis = undefined;
						epiCtrl.loadDataGridEpi();
        			} else {
        				epiCtrl.epi['qtde-epi'] = $filter('number')(epiCtrl.epi['qtde-epi'], 2);
        				
        				$scope.listOfEpis.push(epiCtrl.epi);
						
	        			var orderTask = function(a, b) {
						    return a['cd-tarefa'] - b['cd-tarefa'];
						};
		
						var orderEpi = function(a, b) {
						    return a['cd-epi'] > b['cd-epi'];
						};
						
						var orderAll = function(a, b) {
							if (orderTask(a, b) != 0) return orderTask(a, b);
							return orderEpi(a, b);
						};
						
						$scope.listOfEpis.sort(orderAll);
        			}
        			
        		}
        	}, function(){
                if(epiCtrl.epi.isSaveNew){
                    $scope.listOfEpis = undefined;
                    epiCtrl.loadDataGridEpi();
                }

            });
        }

        
        /**
         * Alteração do EPI
         */
        epiCtrl.epiEdit = function(value) {
            epiCtrl.epi = angular.copy(value);
            epiCtrl.epi.isNew = false;
            epiCtrl.openEpiEdit ();
        }
        
        
        /**
         * Valida remoção de EPI
         */
        epiCtrl.remove = function(dataItem) {
        	var index;
        	
        	$rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-confirm-delete-record', [$rootScope.i18n('l-task' ) + " " + dataItem['cd-tarefa'].toString() + ", " + $rootScope.i18n('l-epi') + " " + dataItem['cd-epi']]),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {
	                	
	                	for(var i = 0; i < $scope.listOfEpis.length; i++) {
	                	    if ($scope.listOfEpis[i]['cd-tarefa'] === dataItem['cd-tarefa'] && $scope.listOfEpis[i]['cd-epi'] === dataItem['cd-epi']) {
	                	        index = i;
	                	        epiId = {pNrOrdProdu: dataItem['nr-ord-produ'], pCdTarefa: dataItem['cd-tarefa'], pCdEpi: dataItem['cd-epi']};
	                	        break;
	                	    }
	                	}
	                	
	                	epiCtrl.deleteRecord(index, epiId);
	                }
	            }
	        });     	
        }
        
        /**
         * Remove EPI
         */
        epiCtrl.deleteRecord = function(index, epiId) {
        	bomn130Service.deleteRecord(epiId, function(result) {
            	if (!result.$hasError) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('msg-epi-delete'),
                        detail: $rootScope.i18n('msg-success-epi-delete')
                    });

                    $scope.listOfEpis.splice(index, 1);
                }
            });
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
         
        this.init = function() {         
        }
         
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { this.init(); }    
         
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
         
        // cria um listerner de evento para inicializar o taskEditControl somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
            
    }

    index.register.controller('mmi.order.epi.EpiListCtrl', epiListController);
       
});