define(['index',
        '/dts/mab/html/employee/specialty/specialty-edit.js'], function(index) {

    /**
     * shiftController
     */
	specialtyListController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'$stateParams',
    	'TOTVSEvent',
    	'$modal',
    	'fchmab.fchmabemployee.Factory'
    ];

    function specialtyListController($rootScope, 
	    							 $scope,
	    							 $stateParams,
	    							 TOTVSEvent,
	    							 $modal,
	    							 fchmabemployeeFactory) {

    	var specialtyListCtrl = this;
    	
    	// *********************************************************************************
        // *** Funções
        // *********************************************************************************
        
    	specialtyListCtrl.init = function() {
    		specialtyListCtrl.id = {"epCodigo": $stateParams.epCodigo,
				      			    "codEstabel": $stateParams.codEstabel,
				    			    "codMatr": $stateParams.codMatr};
    		
    		specialtyListCtrl.buscaEspecialidadesFuncionario();
        }
    	
    	specialtyListCtrl.buscaEspecialidadesFuncionario = function() {
    		fchmabemployeeFactory.buscaEspecialidadesFuncionario(specialtyListCtrl.id, buscaEspecialidadesFuncionarioCallback);
    	}
    	
    	var buscaEspecialidadesFuncionarioCallback = function(result) {
    		specialtyListCtrl.especialidades = result;
    	}
    	
    	specialtyListCtrl.openEdit = function() {
    		var model = {"id": specialtyListCtrl.id,
    				     "especialidades": []};
    		
    		var modalInstance = $modal.open({
	            templateUrl: '/dts/mab/html/employee/specialty/specialty.edit.html',
	            controller: 'mab.employee.specialty.SpecialtyEditCtrl as specialtyEditCtrl',
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
    			specialtyListCtrl.especialidades = model.especialidades;		
    			
    			var ordenaPrincipal = function(a, b) {
				    return b.principal - a.principal;
				};

				var ordenarEspecialidade = function(a, b) {
				    return a['tp-especial'] > b['tp-especial'];
				};
				
				var ordenaTudo = function(a, b) {
					if (ordenaPrincipal(a, b) != 0) return ordenaPrincipal(a, b);
					return ordenarEspecialidade(a, b);
				};
				
				specialtyListCtrl.especialidades.sort(ordenaTudo);
    			
    		});
    	}
         
        if ($rootScope.currentuserLoaded) { this.init(); }
        
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            controller.init();
        });
            
    }

    index.register.controller('mab.employee.specialty.SpecialtyListCtrl', specialtyListController);
    index.register.controller('mab.employee.specialty.SpecialtyEditCtrl', specialtyEditController);
});