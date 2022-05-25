define(['index',
        '/dts/mmi/js/api/fch/fchmip/dashboard.js',], function(index) {

	/**
	 * Controller Detail
	 */
	fechamentoImpedimentoCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'$modalInstance',
		'fchmip.dashboard.Factory',
		'model'
	];

	function fechamentoImpedimentoCtrl($rootScope,
								  $scope,
								  TOTVSEvent,
								  $modalInstance,
								  dashboardFactory,
								  model) {
		
		var fechamentoImpedimentoCtrl = this;		

		fechamentoImpedimentoCtrl.init = function() {
			fechamentoImpedimentoCtrl.model = model;
			fechamentoImpedimentoCtrl.model.username = model.user.username; 
			fechamentoImpedimentoCtrl.model.user = model.user.login; 
		}

		fechamentoImpedimentoCtrl.confirma = function () {

			fechamentoImpedimentoCtrl.model.oms.forEach(function(element) {
				element.dtFimImped = fechamentoImpedimentoCtrl.model.dataEncerramento; //.getTime();
				element.horaFimImped = fechamentoImpedimentoCtrl.model.horaEncerramento;
				if (element.horaFimImped.substring(1,2) === ":") {
					element.horaFimImped = "0" + element.horaFimImped;
				}
				element.codUsuarAlterSit = fechamentoImpedimentoCtrl.model.user;
				element.desObs = fechamentoImpedimentoCtrl.model.observacoes;
			});

			dashboardFactory.encerraOrdemImpedimento(fechamentoImpedimentoCtrl.model.oms, encerraOrdemImpedimentoCallback);
		}

		var encerraOrdemImpedimentoCallback = function(result) {
			if (!result.hasError) {	
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-closing'),
					detail: $rootScope.i18n('l-success-close-impediment')
				});
				fechamentoImpedimentoCtrl.fechar();
			}
		}

		if ($rootScope.currentuserLoaded) {
			fechamentoImpedimentoCtrl.init();
		}

		fechamentoImpedimentoCtrl.fechar = function(){
			$modalInstance.close('cancel');
		}
		
		fechamentoImpedimentoCtrl.cancel = function(){
			$modalInstance.dismiss('cancel');
		}
		
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});
	}

	index.register.controller("mmi.sprint.ordem.FechamentoImpedimentoCtrl", fechamentoImpedimentoCtrl);
});
