define(['index'], function(index) {

	/**
	 * Controller Detail
	 */
	dsbGraficoClasse.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'$modalInstance',
		'model'
	];

	function dsbGraficoClasse($rootScope,
							  	 $scope,
								 TOTVSEvent,
								 $modalInstance,
								 model) {

		var dsbGraficoClasse = this;
		
		dsbGraficoClasse.estatistica = "";

		dsbGraficoClasse.init = function() {
			dsbGraficoClasse.setFnExport = function (obj) {
				dsbGraficoClasse.exportToPng = obj.png;
			}

			var previsto = { name: $rootScope.i18n('l-forecasted'), data: [], labels: {visible: true}};
			var previstoRealizado = { name: $rootScope.i18n('l-forecasted-fulfilled'), data: [], labels: {visible: true}};
			var programado = { name: $rootScope.i18n('l-scheduled'), data: [], labels: {visible: true}};
			var programadoRealizado = { name: $rootScope.i18n('l-scheduled-fulfilled'), data: [], labels: {visible: true}};

			dsbGraficoClasse.manutencaoCategories = [{
				categories:[],
				labels: {
					visible: true,
					rotation: 'auto'
				}
			}];

			model.forEach(function(dadosOmGrafico, index) {
				previsto.data.push([dadosOmGrafico.previsto, 0]);
				previstoRealizado.data.push([dadosOmGrafico['previsto-realizado'], 0]);
				programado.data.push([dadosOmGrafico.programado, 0]);
				programadoRealizado.data.push([dadosOmGrafico['programado-realizado'], 0]);
				if(index == (model.length - 1)) {
					dsbGraficoClasse.manutencaoCategories[0].categories.push('Total');
					dsbGraficoClasse.estatistica = dadosOmGrafico.estatistica;
				} else {
					dsbGraficoClasse.manutencaoCategories[0].categories.push(dadosOmGrafico.estatistica);
				}
			});

			dsbGraficoClasse.manutencao = [];
			dsbGraficoClasse.manutencao.push(previsto);
			dsbGraficoClasse.manutencao.push(previstoRealizado);
			dsbGraficoClasse.manutencao.push(programado);
			dsbGraficoClasse.manutencao.push(programadoRealizado);
			dsbGraficoClasse.manutencaoValueAxis = {
				line: {
        	visible: true
        },
        minorGridLines: {
        	visible: true,
          step: 1
        },
        majorGridLines: {
          visible: true
        }
    	};

			dsbGraficoClasse.atualizarTamanhoComponentesKendo('.k-chart');

		}

		dsbGraficoClasse.atualizarTamanhoComponentesKendo = function(className) {
			setTimeout(function() {
				document.querySelectorAll(className).forEach(function(element){
						kendo.resize(element);
				});
			}, 100);
		}

		if ($rootScope.currentuserLoaded) {
			dsbGraficoClasse.init();
		}

		dsbGraficoClasse.fechar = function(){
			$modalInstance.close('cancel');
		}
		
		dsbGraficoClasse.cancel = function(){
			$modalInstance.dismiss('cancel');
		}
		
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});
	}

	index.register.controller("mmi.sprint.dashboard.DsbGraficoClasse", dsbGraficoClasse);
});
