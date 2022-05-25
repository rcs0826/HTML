define(['index',
		'/dts/mmi/js/zoom/pend-padrao.js'], function(index) {

	retirarProgramacaoCtrl.$inject = [	                              
		'$rootScope',	         
		'$scope',
		'$modalInstance',
		'TOTVSEvent',
		'model',
		'$filter',
		'$timeout',
		'fchmip.programacao.Factory',
		'fchmip.dashboard.Factory'
	];
	
	function retirarProgramacaoCtrl($rootScope, 
									$scope,
									$modalInstance,
									TOTVSEvent,
									model,
									$filter,
									$timeout,
									programacaoFactory,
									dashboardFactory) {
	
		var retirarProgramacaoCtrl = this;
		
		// *********************************************************************************
	    // *** Funções
	    // *********************************************************************************
	
		retirarProgramacaoCtrl.init = function() {
			setFocus();
			retirarProgramacaoCtrl.model = model;
			retirarProgramacaoCtrl.model.ttOrdem['cod-motivo'] = undefined;
		}	
		
		var setFocus = function() {
	    	$timeout(function() {
	    		$('#cd-pend-padr').find('*').filter(':input:visible:first').focus();
	        },500);
		}
		
		retirarProgramacaoCtrl.confirmar = function () {
			if (model.isDashboard) {
				dashboardFactory.retirarOrdemProgramacao(retirarProgramacaoCtrl.model.ttOrdem, function(result){
					if (result && !result.hasError) {
	        			$modalInstance.close();
	        		}
				});
			} else {
				programacaoFactory.enviaOrdemBacklog(retirarProgramacaoCtrl.model, function(result){
	        		if (result && !result.hasError) {
	        			$modalInstance.close();
	        		}
				});
			}
	    }
		
		retirarProgramacaoCtrl.cancelar = function () {
			$modalInstance.dismiss('cancel');
		}
		
		if ($rootScope.currentuserLoaded) { retirarProgramacaoCtrl.init(); }
	    
	    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
		    $modalInstance.dismiss('cancel');
		});
	     
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	    	retirarProgramacaoCtrl.init();
	    });
	}
	
	index.register.controller("mmi.sprint.RetirarProgramacaoCtrl", retirarProgramacaoCtrl);
});