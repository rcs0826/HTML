define(['index',		
		'/dts/mmi/js/zoom/tipo-hora.js'
		], function(index) {

	tipoHoraHHCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'$modalInstance',
		'model',
		'fchmip.programacao.Factory',
	];

	function tipoHoraHHCtrl($rootScope,
                                $scope,
                                TOTVSEvent,
                                $modalInstance,
								model,
								programacaoFactory) {

		var tipoHoraHHCtrl = this;
		tipoHoraHHCtrl.model = null;

		tipoHoraHHCtrl.init = function() {
			tipoHoraHHCtrl.model = model;
			buscaParametrosTipoHora();
			
		}

		tipoHoraHHCtrl.confirmar = function(){
			tipoHoraHHCtrl.parametros =[];
			var params = {};
			parametros();
			params.ttProgramacao = tipoHoraHHCtrl.model.ttProgramacao;
			params.ttParametros = tipoHoraHHCtrl.parametros;
			programacaoFactory.editarTipoHora(params, editarTipoHoraCallback);
		}

		var editarTipoHoraCallback = function(){
			$modalInstance.close();
		}

		var buscaParametrosTipoHora = function(){
			model.ttParametros.tipoHrCapacidade = montaObjetoSelecionadoVazio();
			model.ttParametros.tipoHrCarga = montaObjetoSelecionadoVazio();
			tipoHoraHHCtrl.model.ttDescricaoParametros.forEach(function(param){
                if (param['idi-cod-param'] === 11) {
                    model.ttParametros.tipoHrCapacidade.objSelected.push(montaObjetoSelecionado("cod-tip-hora", param['des-val-param'], param));
				}
				if (param['idi-cod-param'] === 12) {
                    model.ttParametros.tipoHrCarga.objSelected.push(montaObjetoSelecionado("cod-tip-hora", param['des-val-param'], param));
				}
			});
			tipoHoraHHCtrl.model.ttParametros.tipoHrCapacidade = model.ttParametros.tipoHrCapacidade;
			tipoHoraHHCtrl.model.ttParametros.tipoHrCarga = model.ttParametros.tipoHrCarga;
		};

		tipoHoraHHCtrl.cancelar = function(){
			$modalInstance.dismiss('cancel');
		}

		var montaObjetoSelecionadoVazio = function() {
			return {"objSelected": []};
		}

		var montaObjetoSelecionado = function(nomeAtributo, valor, ttObject) {
			var data = {};
			if(ttObject) {
				for(var k in ttObject) {
					data[k]=ttObject[k];
				}	
			}

			data[nomeAtributo] = valor;
			data['$selected'] = true;
			return data;
		}

		var parametros = function() {
			buscaParametro(tipoHoraHHCtrl.model.ttParametros.tipoHrCapacidade, 11, "cod-tip-hora");
			buscaParametro(tipoHoraHHCtrl.model.ttParametros.tipoHrCarga, 12, "cod-tip-hora");
		}
		
		var buscaParametro = function(obj, param, atr) {
			if (obj) {
				if (obj.objSelected) {
					angular.forEach(obj.objSelected, function(parametro){
						tipoHoraHHCtrl.parametros.push({"idi-cod-param": param, "des-val-param": parametro[atr]});
					});
				} else {
					tipoHoraHHCtrl.parametros.push({"idi-cod-param": param, "des-val-param": obj});
				}
			}
		}

		if ($rootScope.currentuserLoaded) {
			tipoHoraHHCtrl.init(); 
		}

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {         
			$modalInstance.dismiss('cancel');
		});
		
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			tipoHoraHHCtrl.init();
		});
	}

	index.register.controller("mmi.sprint.TipoHoraHHCtrl", tipoHoraHHCtrl);
});
