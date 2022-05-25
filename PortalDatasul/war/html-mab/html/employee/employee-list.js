define(['index'], function(index) {
	
	/**
	 * Controller List
	 */
	employeeListCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'totvs.app-main-view.Service',
		'mab.bofr032.Service',
		'helperEmployee',
		'$modal',
		'TOTVSEvent'
	];
	
	function employeeListCtrl($rootScope,
							  $scope,
							  appViewService,
							  bofr032Service,
							  helperEmployee,
							  $modal,
							  TOTVSEvent) {
	
		var controller = this;
		controller.model = {};
		
		// *************************************************************************************
		// *** Functions
		// *************************************************************************************
		
		controller.init = function() {
			controller.listResult = [];

			appViewService.startView($rootScope.i18n('l-workshop-employees'), 'mab.employee.ListCtrl', controller);
			var previousView = appViewService.previousView;
			
			if (previousView.controller === "mab.employee.DetailCtrl" && !controller.isNew && !helperEmployee.data.delete){
				return;
			} else {
				controller.loadData();
			 } 
				
		}

		controller.editar = function(employee) {
			controller.model = employee;
			controller.model.isNew = false;
			controller.isNew = false;
		    controller.openEdit ();
	   }

	   controller.adicionar = function() {
			controller.model.isNew = true;
			controller.isNew = true;
			controller.openEdit ();
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
				if (!controller.isNew) angular.copy(model, controller.model);

	        } , function () {
				 if(controller.isNew){
					controller.loadData();
				}
			});
		}
		controller.delete = function(employee) {

	        // envia um evento para perguntar ao usuário
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question', // titulo da mensagem
	            text: $rootScope.i18n('l-confirm-delete-operation'), // texto da mensagem
	            cancelLabel: 'l-no', // label do botão cancelar
	            confirmLabel: 'l-yes', // label do botão confirmar	            
	            callback: function(isPositiveResult) { // função de retorno
	                if (isPositiveResult) { // se foi clicado o botão confirmar
						var id = {"epCodigo"  :employee['ep-codigo'],
							      "codEstabel":employee['cod-estabel'],
								  "codMatr"   :employee['cod-matr']};
	                	// chama o metodo de remover registro do service
	                    bofr032Service.deleteRecord(id, function(result) {
	                    	if (!result.$hasError) {
	                    		// remove o item da lista
	                            var index = controller.listResult.indexOf(employee);
	                            
	                            if (index != -1) {
	                                controller.listResult.splice(index, 1);
	                                controller.totalRecords--;
	                                 
	                                // notifica o usuario que o registro foi removido
	                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                                	type: 'success', // tipo de notificação
		                                title: $rootScope.i18n('msg-record-deleted'), // titulo da notificação
		                                detail: $rootScope.i18n('msg-record-success-deleted') // detalhe da notificação
	                                });
	                            }
	                        }
	                    });
	                }
	            }
	        });
	    }
		controller.loadData = function(isMore) {
			var parameters = {};
			var startAt;
			var where = "";
			
			if (!isMore) {
	            controller.listResult = [];
		        controller.totalRecords = 0;
	        }
			
			startAt = controller.listResult.length;
			
			if (controller.quickSearchText) {
				where = "cod-matr matches '*" + controller.quickSearchText + "*'";
				where = where + " OR ";
	            where = where + "nom-func matches '*" + controller.quickSearchText + "*'";
				parameters.where = where;
			}
			
			bofr032Service.findRecords(startAt, undefined, parameters, loadDataCallback);	        
		}
		
		var loadDataCallback = function(result) {
			if (result) {
                angular.forEach(result, function (value) {
                    if (value && value.$length) {
                    	controller.totalRecords = value.$length;
                    }
                    controller.listResult.push(value);
                });            
            }
		}
		
		controller.setHelperEmployee = function(value) {
			controller.isNew = false;
			helperEmployee.data = value;
	    }
		
		if ($rootScope.currentuserLoaded) { this.init(); }
	}
	
	index.register.controller('mab.employee.ListCtrl', employeeListCtrl);
	
	index.register.service('helperEmployee', function(){
		return {
			data :{}
		};
	});
	
});