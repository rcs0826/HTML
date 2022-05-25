define(['index',
        '/dts/mab/html/employee/specialty/specialty-list.js',
		'/dts/mab/js/api/fch/fchmab/fchmabemployee.js',
		'/dts/mab/html/employee/training/training-list.js',
		'/dts/mab/html/employee/employee-edit.js',
	    '/dts/mab/html/employee/shiftEmployee/shift-list.js'], function(index) {
	
	/**
	 * Controller Detail
	 */

	employeeDetailCtrl.$inject = [
		'$rootScope', 
		'$scope',
		'$stateParams', 
		'$state',
		'totvs.app-main-view.Service',
		'mab.bofr032.Service',
		'TOTVSEvent',
		'helperEmployee',
		'$modal'
	];
	
	function employeeDetailCtrl($rootScope,
							    $scope, 
							    $stateParams, 
							    $state,
							    appViewService,
							    bofr032Service,
							    TOTVSEvent,
								helperEmployee,
								$modal) {

		controller = this;
		
		controller.showChildren = true;
		
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************
		
		controller.init = function() {
			if (appViewService.startView($rootScope.i18n('l-workshop-employees'), 'mab.employee.DetailCtrl', controller)) {             
			}
			
			controller.model = {};

	        if ($stateParams) {
	        	controller.id = {"epCodigo": $stateParams.epCodigo,
	        			         "codEstabel": $stateParams.codEstabel,
	        			  		 "codMatr": $stateParams.codMatr};
	        	
	        	if (helperEmployee.data && helperEmployee.data.codMatr) {
	        		controller.model = helperEmployee.data
	        	} else {
					controller.load();
	        	}	            
	        }
		}
		
		controller.load = function() {
			bofr032Service.getRecord(controller.id, function(record) {
	            if (record) {
					controller.model = record;
					angular.copy(controller.model, helperEmployee.data);		
	            }
	        });
		}
		
		controller.openEdit = function() {

			var model = controller.model;
			
	        var modalInstance = $modal.open({
		          templateUrl: '/dts/mab/html/employee/employee.edit.html',
		          controller: 'mab.employee.EditCtrl as employeeEditCtrl',
		          size: 'lg',
				  backdrop: 'static',
				  keyboard: true,
		          resolve: { 
		            model: function () {
						return model;
		            }
		          }
			});
			modalInstance.result.then(function(){
				controller.load();			      		        		        	
	        });
			
		}
		controller.delete = function(controller) {

	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', 
	            text: $rootScope.i18n('l-confirm-delete-operation'), 
	            cancelLabel: 'l-no', 
	            confirmLabel: 'l-yes',             
	            callback: function(isPositiveResult) { 
	                if (isPositiveResult) { 
						var id = {"epCodigo": $stateParams.epCodigo,
	        			  		  "codEstabel": $stateParams.codEstabel,
	        			  	      "codMatr": $stateParams.codMatr};
	                	bofr032Service.deleteRecord(id, function(result) {
	                    	if (!result.$hasError) {
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'success', 
									title: $rootScope.i18n('msg-record-deleted'),
									detail: $rootScope.i18n('msg-record-success-deleted') 
								});
								$state.go('dts/mab/employee.start');
								helperEmployee.data.delete = true;
	                        }
	                    });
	                }
	            }
	        });
	    }

	    if ($rootScope.currentuserLoaded) { this.init(); }
	     
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        controller.init();
	    });
	    
	    $scope.$on('$destroy', function () {
			controller = undefined;
		});								
	}
	
	index.register.controller('mab.employee.DetailCtrl', employeeDetailCtrl);
	
});
