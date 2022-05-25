define(['index',
		], function(index) {

	alterarValorHHCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'$modalInstance',
		'model'
	];

	function alterarValorHHCtrl($rootScope,
                                $scope,
                                TOTVSEvent,
                                $modalInstance,
                                model) {
		
		var alterarValorHHCtrl = this;
		
		alterarValorHHCtrl.init = function() {
			alterarValorHHCtrl.model = model;
			alterarValorHHCtrl.capacidadeSelecionada = model.codigo + " - " + model.descricao;

			if (alterarValorHHCtrl.model.tipoValor === "Percentual") {
				alterarValorHHCtrl.maxlength = 6;
			} else {
				alterarValorHHCtrl.maxlength = 9;
			}
		}

        if ($rootScope.currentuserLoaded) {
            alterarValorHHCtrl.init(); 
		}

		alterarValorHHCtrl.confirmar = function(){
			if (model.valor === undefined || model.valor < 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'error',
                    detail: $rootScope.i18n('l-invalid-value')
		        });				
				return;
			}
			$modalInstance.close('cancel');
		}
		
		alterarValorHHCtrl.cancelar = function(){
			$modalInstance.dismiss('cancel');
		}

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {         
            $modalInstance.dismiss('cancel');
		});
		
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	    	alterarValorHHCtrl.init();
	    });
	}

	index.register.controller("mmi.sprint.AlterarValorHHCtrl", alterarValorHHCtrl);
});
