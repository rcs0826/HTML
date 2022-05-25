define(['index',
		'/dts/mab/html/employee/training/training-edit.js'], function(index) {

    /**
     * trainingController
     */
	trainingListController.$inject = [	                              
    	'$rootScope',	         
    	'$scope',
    	'TOTVSEvent',
		'$modal',
		'fchmab.fchmabemployee.Factory',
		'$stateParams',
		'$filter'
    ];

    function trainingListController($rootScope, 
	    							 $scope,
	    							 TOTVSEvent,
									 $modal,
									 fchmabemployeeFactory,
									 $stateParams,
									 $filter) {

		var trainingListCtrl = this;
		trainingListCtrl.listOfTrainings = [];
    	
    	// *********************************************************************************
        // *** Funções
        // *********************************************************************************
        
    	trainingListCtrl.init = function() {
    		trainingListCtrl.id = {"epCodigo": $stateParams.epCodigo,
								   "codEstabel": $stateParams.codEstabel,
								   "codMatr": $stateParams.codMatr};
		}


		trainingListCtrl.buscaTreinamentosFuncionario = function(){

			if (trainingListCtrl.listOfTrainings.length > 0){
				return;
			}

    		fchmabemployeeFactory.buscaTreinamentosFuncionario(trainingListCtrl.id, buscaTreinamentosFuncionarioCallback);
		}
		
		var buscaTreinamentosFuncionarioCallback = function(result){
			trainingListCtrl.listOfTrainings = [];

			angular.forEach(result, function(value){
				value['dt-validade'] = $filter('date')(value['dt-validade'], 'dd/MM/yyyy');
				 
				if(value['dt-validade'] === null){
				   value['dt-validade'] = $rootScope.i18n('l-not-have');
			    }
				trainingListCtrl.listOfTrainings.push(value);
			});
		}
    	
    	trainingListCtrl.openEdit = function() {
    		var model;
    		
    		var modalInstance = $modal.open({
	            templateUrl: '/dts/mab/html/employee/training/training.edit.html',
	            controller: 'mab.employee.training.TrainingEditCtrl as trainingEditCtrl',
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
				fchmabemployeeFactory.buscaTreinamentosFuncionario(trainingListCtrl.id, buscaTreinamentosFuncionarioCallback);
    		});
    	}
         
        if ($rootScope.currentuserLoaded) { this.init(); }
        
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            trainingListCtrl.init();
        });
            
    }

    index.register.controller('mab.employee.training.TrainingListCtrl', trainingListController);
    index.register.controller('mab.employee.training.TrainingEditCtrl', trainingEditController);
});