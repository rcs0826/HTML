define(['index',
        '/dts/mab/html/employee/shiftEmployee/shift-edit.js' ], function(index) {

    /**
     * shiftController
     */
    shiftListController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$filter',
        '$timeout',
    	'TOTVSEvent',
        '$modal',
        '$stateParams',
        'fchmab.fchmabemployee.Factory'
    ];

    function shiftListController($rootScope, 
    							$scope,
    							$filter,
                                $timeout,
    							TOTVSEvent,
                                $modal,
                                $stateParams,
                                fchmabemployeeFactory) {

    	/**
    	 * Controller
    	 */ 
    	var shiftListCtrl = this;
    	
    	shiftListCtrl.shift = {};
        $scope.listOfShifts = [];
        
        shiftListCtrl.init = function() {
            shiftListCtrl.id = {"epCodigo": $stateParams.epCodigo,
                                "codEstabel": $stateParams.codEstabel,
                                "codMatr": $stateParams.codMatr};
        
        }

        shiftListCtrl.buscaTurnoFuncionario = function(){

            if($scope.listOfShifts.length >0){
                return
            }

            fchmabemployeeFactory.buscaTurnosFuncionario(shiftListCtrl.id, function(result) {
                if (result) {
                    angular.forEach(result, function (value) {  
                        value.dateMilliseconds = value['dtEfetivacao'];
                        value['dtEfetivacao'] = $filter('date')(value['dtEfetivacao'], 'dd/MM/yyyy');
                        $scope.listOfShifts.push(value);                        
                    });
                }
            });
        }

        shiftListCtrl.deleteRecord = function(dataItem){
            var index;
        	
        	$rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-confirm-delete-record', [$rootScope.i18n('l-shift') + " " + dataItem['codTurno']]),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) {
                        
                        var params = { 
                            "epCodigo"     : $stateParams.epCodigo,
                            "codEstabel"   : $stateParams.codEstabel,
                            "codMatr"      : $stateParams.codMatr,
                            "codTurno"     : dataItem.codTurno,  
                            "dtEfetivacao" : dataItem.dateMilliseconds
                        };
            
                        fchmabemployeeFactory.deletaTurnoFuncionario(params, function(result) {
                            if (result) {
                                for(var i = 0; i < $scope.listOfShifts.length; i++) {
                                    if ($scope.listOfShifts[i]['dtEfetivacao'] === dataItem['dtEfetivacao'] && $scope.listOfShifts[i]['codTurno'] === dataItem['codTurno']) {
                                        index = i;
                                        break;
                                    }
                                }
                                $scope.listOfShifts.splice(index, 1);

                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type: 'success',
                                    title: $rootScope.i18n('msg-record-deleted'),
                                    detail: $rootScope.i18n('msg-record-success-deleted')
                                });
                            }
                        });
	                }
	            }
	        }); 

        }

        
        /**
         * Abre tela para edição do turno
         */
        shiftListCtrl.openShiftEdit = function() {

            shiftListCtrl.shift = angular.copy(shiftListCtrl.id);
               	
        	var modalInstance = $modal.open({
	            templateUrl: '/dts/mab/html/employee/shiftEmployee/shift.edit.html',
	            controller: 'mab.employee.shiftEmployee.ShiftEditCtrl as shiftEditControl',
	            size: 'md',
                backdrop: 'static',
                keyboard: true,
	            resolve: {
	            	model: function () {
	            		return shiftListCtrl.shift;	            		 
	            	}
	            }
			});
        	
        	modalInstance.result.then(function(cancel){


                if (!cancel || shiftListCtrl.shift.list.length > 0){

                    angular.forEach(shiftListCtrl.shift.list, function(turno){
                        turno.dateMilliseconds = turno['dtEfetivacao'];
                        turno['dtEfetivacao']  = $filter('date')(turno['dtEfetivacao'], 'dd/MM/yyyy');
                        $scope.listOfShifts.push(turno);
                    });
                    
                    var date = function(a, b) {
                        return a['dateMilliseconds'] - b['dateMilliseconds'];
                    };
    
                    var turno = function(a, b) {
                        return a['codTurno'] - b['codTurno'];
                    };
                    
                    var orderAll = function(a, b) {
                        if (date(a, b) != 0) return date(a, b);
                        return turno(a, b);
                    };
                    
                    $scope.listOfShifts.sort(orderAll);
                }
        
            });

            
        }
        
        // se o contexto da aplicação já carregou, inicializa a tela.
        if ($rootScope.currentuserLoaded) { shiftListCtrl.init(); }    
         
        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************
         
        // cria um listerner de evento para inicializar o shiftListController somente depois de inicializar o contexto da aplicação.
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
            
    }
    index.register.controller('mab.employee.shiftEmployee.ShiftListCtrl', shiftListController);
    
});


