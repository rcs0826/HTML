define(['index',
        '/dts/mmi/js/dbo/bomn169.js',
        '/dts/mmi/html/order/method/method-edit.js'], function(index) {

    /**
     * methodController
     */
	methodListController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$filter',
    	'TOTVSEvent',
        'mmi.bomn169.Service',
        '$modal',
        'helperOrder'
    ];

    function methodListController($rootScope, 
    				              $scope,
    						      $filter,
    						      TOTVSEvent,
                                  bomn169Service,
                                  $modal,
                                  helperOrder) {

    	/**
    	 * Controller
    	 */ 
    	var methodCtrl = this;
    	
    	this.method = {};
    	
    	this.disableAdd = false;
    	
        this.selectedItem;
        
        methodCtrl.showButton = helperOrder.data.showButton === undefined;

        /**
         * Lista de Métodos
         */
        $scope.listOfMethods;
        
    	// *********************************************************************************
        // *** Funções
        // *********************************************************************************
        
        /**
         * Lista Method's
         */
        methodCtrl.loadDataGridMethod = function(){

        	methodCtrl.isDisabled = false;

            if(detailOrderCtrl.reloadMethod){
                $scope.listOfMethods = undefined;
                detailOrderCtrl.reloadMethod = false;
            }
        	
        	if (detailOrderCtrl.listOfTasks.length < 1)
        		methodCtrl.isDisabled = true;

            if ($scope.listOfMethods) return;

            $scope.listOfMethods = [];
            
            /* alimenta para controlar se ira habilitar ou nao o botao de adicionar ou excluir com base no estado-om */
            if (detailOrderCtrl.model['estado-om'] === 4){
            	methodCtrl.hideAdd = true;            	
            }

            var where = "ord-fich-met.nr-ord-produ = " + detailOrderCtrl.model['nr-ord-produ'];
            var parameters = {};
            
            parameters.where = where;

            bomn169Service.findRecords(0, 9999, parameters, function(result) {
                if (result) {
                    angular.forEach(result, function (value) {  
                    	value['des-metodo'] = value['_']['des-metodo'];
                        $scope.listOfMethods.push(value);
                    });
                }
            });            
        }
        
        
        /**
         * Adiciona Metodos
         */
        methodCtrl.addMethod = function() {
    		methodCtrl.method = {};
    		methodCtrl.method["nr-ord-produ"] = detailOrderCtrl.model['nr-ord-produ'];
    		methodCtrl.method.isNew = true;
    		methodCtrl.openMethodEdit();
        }
        
        /**
         * Abre tela para edição do Metodo
         */
        methodCtrl.openMethodEdit = function() {
        	var taskNumber;
        	
            if(methodCtrl.method.isNew){
            	if (methodCtrl.selectedItem) {
            		taskNumber = methodCtrl.selectedItem['cd-tarefa']; 
            	} else {        	
            		taskNumber = detailOrderCtrl.listOfTasks[0]['cd-tarefa'];
            	}
            	
            	methodCtrl.method['cd-tarefa'] = taskNumber;            	
            }
        	
        	var modalInstance = $modal.open({
	            templateUrl: '/dts/mmi/html/order/method/method.edit.html',
	            controller: 'mmi.order.method.MethodEditCtrl as methodEditControl',
	            size: 'md',
                backdrop: 'static',
                keyboard: true,
	            resolve: {
	            	model: function () {
	            		return methodCtrl.method;	            		 
	            	}
	            }
			});
        	
        	modalInstance.result.then(function(){
        		if (methodCtrl.method.refresh == true) {
        			if (methodCtrl.method.isSaveNew) {
        				
						$scope.listOfMethods = undefined;
						methodCtrl.loadDataGridMethod();
        			} else {
        				
        				$scope.listOfMethods.push(methodCtrl.method);
    	        		
    					var orderTask = function(a, b) {
    					    return a['cd-tarefa'] - b['cd-tarefa'];
    					};
    	
    					var orderMethod = function(a, b) {
    					    return a['fi-codigo'] - b['fi-codigo'];
    					};
    					
    					var orderAll = function(a, b) {
    						if (orderTask(a, b) != 0) return orderTask(a, b);
    						return orderMethod(a, b);
    					};
    					
    					$scope.listOfMethods.sort(orderAll);
        			}
        		}
        	}, function(){
                if(methodCtrl.method.isSaveNew){
                    $scope.listOfMethods = undefined;
                    methodCtrl.loadDataGridMethod();
                }
            });
        }

        /**
         * Valida remoção de Metodo
         */
        methodCtrl.remove = function(dataItem) {
        	var index;
        	
        	$rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-confirm-delete-record', [$rootScope.i18n('l-task' ) + " " + dataItem['cd-tarefa'].toString() + ", " + $rootScope.i18n('l-method-sheet') + " " + dataItem['fi-codigo']]),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {
	                	
	                	for(var i = 0; i < $scope.listOfMethods.length; i++) {
	                	    if ($scope.listOfMethods[i]['cd-tarefa'] === dataItem['cd-tarefa'] && $scope.listOfMethods[i]['fi-codigo'] === dataItem['fi-codigo']) {
	                	        index = i;
	                	        methodId = {pNrOrdProdu: dataItem['nr-ord-produ'], pCdTarefa: dataItem['cd-tarefa'], pFiCodigo: dataItem['fi-codigo']};
	                	        break;
	                	    }
	                	}
	                	
	                	methodCtrl.deleteRecord(index, methodId);
	                }
	            }
	        });     	
        }
        
        /**
         * Remove Metodo
         */
        methodCtrl.deleteRecord = function(index, methodId) {
        	bomn169Service.deleteRecord(methodId, function(result) {
            	if (!result.$hasError) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('msg-method-sheet-delete'),
                        detail: $rootScope.i18n('msg-success-method-sheet-delete')
                    });

                    $scope.listOfMethods.splice(index, 1);
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

    index.register.controller('mmi.order.method.MethodListCtrl', methodListController);
    index.register.controller('mmi.order.method.MethodEditCtrl', methodEditController);    
});