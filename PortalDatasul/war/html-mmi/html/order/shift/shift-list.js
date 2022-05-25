define(['index',
        '/dts/mmi/js/dbo/bomn174.js',
        '/dts/mmi/html/order/shift/shift-edit.js'], function(index) {

    /**
     * shiftController
     */
    shiftListController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$filter',
        '$timeout',
    	'TOTVSEvent',
        'mmi.bomn174.Service',
        '$modal',
        'helperOrder'
    ];

    function shiftListController($rootScope, 
    							$scope,
    							$filter,
                                $timeout,
    							TOTVSEvent,
                                bomn174Service,
                                $modal,
                                helperOrder) {

    	/**
    	 * Controller
    	 */ 
    	var shiftCtrl = this;
    	
    	this.shift = {};
    	
    	this.hideActions = false;
    	
    	this.selectedItem;
    	
        this.taskLength;
        
        shiftCtrl.showButton = helperOrder.data.showButton === undefined;

        /**
         * Lista de Turnos
         */
        $scope.listOfShifts;
        
    	// *********************************************************************************
        // *** Funções
        // *********************************************************************************
        
        /**
         * Lista turnos
         */
        shiftCtrl.loadDataGridShift = function(){
        	
            if(detailOrderCtrl.reloadShift){
                $scope.listOfShifts = undefined;
                detailOrderCtrl.reloadShift = false;
            }
            
        	shiftCtrl.isDisabled = false;
        	
        	if (detailOrderCtrl.listOfTasks.length < 1) {
        		$scope.listOfShifts = undefined;
        		shiftCtrl.isDisabled = true;
        	} else {
        		if (shiftCtrl.taskLength !== detailOrderCtrl.listOfTasks.length) {
            		$scope.listOfShifts = undefined;
            	}
        	}

            if ($scope.listOfShifts) return;

            $scope.listOfShifts = [];

			shiftCtrl.hideActions = detailOrderCtrl.model['estado-om'] === 4;
			
            var where = "ord-turno.nr-ord-produ = " + detailOrderCtrl.model['nr-ord-produ'];
            var parameters = {};
            
            parameters.where = where;

            bomn174Service.findRecords(0, 9999, parameters, function(result) {
                if (result) {
                    angular.forEach(result, function (value) {  
                        value['des-turno'] = value['_']['des-turno'];
                        $scope.listOfShifts.push(value);                        
                    });
                }
            });
            
            shiftCtrl.taskLength = detailOrderCtrl.listOfTasks.length;
        }
        
        /**
         * Adiciona turno
         */
        shiftCtrl.addShift = function() {
        	if (detailOrderCtrl.listOfTasks.length > 0) {        	
	        	shiftCtrl.shift = {};
	        	shiftCtrl.shift["nr-ord-produ"] = detailOrderCtrl.model['nr-ord-produ'];
	        	shiftCtrl.openShiftEdit();
        	} else {
        		$rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'warning',
                    title: ($rootScope.i18n('msg-task-not-found')),
                    detail: ($rootScope.i18n('msg-order-tasks-not-found'))
                });
        	}
        }
        
        /**
         * Abre tela para edição do turno
         */
        shiftCtrl.openShiftEdit = function() {
        	var taskNumber;
        	
        	if (shiftCtrl.selectedItem) {
        		taskNumber = shiftCtrl.selectedItem['cd-tarefa']; 
        	} else {        	
        		taskNumber = detailOrderCtrl.listOfTasks[0]['cd-tarefa'];
        	}
        	
        	shiftCtrl.shift['cd-tarefa'] = taskNumber;
        	
        	var modalInstance = $modal.open({
	            templateUrl: '/dts/mmi/html/order/shift/shift.edit.html',
	            controller: 'mmi.order.shift.ShiftEditCtrl as shiftEditControl',
	            size: 'md',
                backdrop: 'static',
                keyboard: true,
	            resolve: {
	            	model: function () {
	            		return shiftCtrl.shift;	            		 
	            	}
	            }
			});
        	
        	modalInstance.result.then(function(){
        		if (shiftCtrl.shift.refresh == true) {
        			if (shiftCtrl.shift.isSaveNew) {
        				$scope.listOfShifts = undefined;
        				shiftCtrl.loadDataGridShift();
        			} else {
        				$scope.listOfShifts.push(shiftCtrl.shift);
        				
        				var orderTask = function(a, b) {
        				    return a['cd-tarefa'] - b['cd-tarefa'];
        				};

        				var orderShift = function(a, b) {
        				    return a['cd-turno'] - b['cd-turno'];
        				};
        				
        				var orderAll = function(a, b) {
        					if (orderTask(a, b) != 0) return orderTask(a, b);
        					return orderShift(a, b);
        				};
        				
        				$scope.listOfShifts.sort(orderAll);
        			}        			
        		}
        	}, function(){
                if(shiftCtrl.shift.isSaveNew){
                    $scope.listOfShifts = undefined;
                    shiftCtrl.loadDataGridShift();
                }
            });
        }
        
        /**
         * Valida remoção do turno
         */
        shiftCtrl.remove = function(dataItem) {
        	var index;
        	
        	$rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-confirm-delete-record', [$rootScope.i18n('l-task' ) + " " + dataItem['cd-tarefa'].toString() + ", " + $rootScope.i18n('l-shift') + " " + dataItem['cd-turno']]),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {
	                	
	                	for(var i = 0; i < $scope.listOfShifts.length; i++) {
	                	    if ($scope.listOfShifts[i]['cd-tarefa'] === dataItem['cd-tarefa'] && $scope.listOfShifts[i]['cd-turno'] === dataItem['cd-turno']) {
	                	        index = i;
	                	        shiftId = {pNrOrdProdu: dataItem['nr-ord-produ'], pCdTarefa: dataItem['cd-tarefa'], pCdTurno: dataItem['cd-turno']};
	                	        break;
	                	    }
	                	}
	                	
	                	shiftCtrl.deleteRecord(index, shiftId);
	                }
	            }
	        });     	
        }
        
        /**
         * Remove turno
         */
        shiftCtrl.deleteRecord = function(index, shiftId) {
        	bomn174Service.deleteRecord(shiftId, function(result) {
            	if (!result.$hasError) {
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('msg-shift-delete'),
                        detail: $rootScope.i18n('msg-success-shift-delete')
                    });

                    $scope.listOfShifts.splice(index, 1);
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
         
        // cria um listerner de evento para inicializar o shiftListController somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
            
    }

    index.register.controller('mmi.order.shift.ShiftListCtrl', shiftListController);
    index.register.controller('mmi.order.shift.ShiftEditCtrl', shiftEditController);
});