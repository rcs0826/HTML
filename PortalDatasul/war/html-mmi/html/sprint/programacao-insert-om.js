define(['index',
	    '/dts/mab/js/zoom/mmv-ord-manut.js'], function(index) {

	/**
	 * Controller Detail
	 */
	inserirOmCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'$modalInstance',
		'fchmip.programacao.Factory',
		'model',
		'mce.utils.Service',
		'$filter'
	];

	function inserirOmCtrl($rootScope,
                         $scope,
                         TOTVSEvent,
						 $modalInstance,
						 programacaoFactory,
						 model,
						 mceUtils,
						 $filter) {
		
		var inserirOmCtrl = this;
		
		inserirOmCtrl.init = function() {
			inserirOmCtrl.model = model;
			inserirOmCtrl.codigoOrdemManutencao = null;
			inserirOmCtrl.dataInicial = '';
			inserirOmCtrl.horaInicial = '';
			inserirOmCtrl.dataFinal = '';
			inserirOmCtrl.horaFinal = '';
			inserirOmCtrl.codMotivo = undefined;
			inserirOmCtrl.narrativa = '';
		}

		var preencherHorarioCallback = function(result) {
			if(result && result.length > 0) {
				inserirOmCtrl.dataInicial = result[0]['datEntr'];
				inserirOmCtrl.horaInicial = result[0]['hraEntr'];
				inserirOmCtrl.dataFinal = result[0]['datTerm'];
				inserirOmCtrl.horaFinal = result[0]['hraTerm'];
				inserirOmCtrl.estado = result[0].estado;
			}
		}
		
		inserirOmCtrl.salvar = function(){
			inserirOmCtrl.params = {};
			
			inserirOmCtrl.params.ttParametros = inserirOmCtrl.model.ttParametros;
			inserirOmCtrl.params.ttProgramacao = inserirOmCtrl.model.ttProgramacao;
			inserirOmCtrl.params.ttSprint = inserirOmCtrl.model.ttSprint;

			if (model.isDashboard) {
				inserirOmCtrl.params.ttOrdem = {
					"nrOrdProdu"  : inserirOmCtrl.codigoOrdemManutencao,  
				    "dtManut"     : inserirOmCtrl.dataInicial,   
				    "horaManut"   : inserirOmCtrl.horaInicial,   
				    "dtTermino"   : inserirOmCtrl.dataFinal,   
				    "horaTermino" : inserirOmCtrl.horaFinal,
				    "cod-motivo"  : inserirOmCtrl.codMotivo,
				    "des-obs" 	  : inserirOmCtrl.narrativa
				};
				programacaoFactory.validaInclusaoOrdem(inserirOmCtrl.params, validaInclusaoOrdemCallback);
			} else {
				inserirOmCtrl.params.ttOrdemBacklog = {
					'nrOrdProdu' :inserirOmCtrl.codigoOrdemManutencao,
					'datEntr' : inserirOmCtrl.dataInicial,
					'datTerm' : inserirOmCtrl.dataFinal,
					'hraEntr' : inserirOmCtrl.horaInicial,
					'hraTerm' : inserirOmCtrl.horaFinal,
					'estado'  : inserirOmCtrl.estado
				};
				programacaoFactory.incluiOrdemNaProgramacao(inserirOmCtrl.params, incluiOrdemNaProgramacaoCallback);
			}
		}
		
		var incluiOrdemNaProgramacaoCallback = function(result) {
			var hasError = result['hasError'];
			if (!hasError) {
				$modalInstance.close('cancel');
			}
		}
		
		var validaInclusaoOrdemCallback = function(result) {
			if (result.lConfirmaInclusao) {
				var ordem = $filter("orderNumberMask")(inserirOmCtrl.codigoOrdemManutencao);
				var dataInicial = mceUtils.formatDate(result.ttPeriodo[0].dataInicial);
				var dataFinal = mceUtils.formatDate(result.ttPeriodo[0].dataFinal);
				var situacao = result.ttPeriodo[0].descStatusPeriodo;
				
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-question',
					text: $rootScope.i18n('msg-confirm-reschedule-order', [ordem, situacao, dataInicial + " - " + dataFinal]),
					cancelLabel: 'l-no',
					confirmLabel: 'l-yes',
					callback: function(isPositiveResult) {
						if (isPositiveResult) {
							programacaoFactory.incluiOrdemDashboard(inserirOmCtrl.params, incluiOrdemDashboardCallback);
						}
					}
				});
				
			} else if (!result.hasError) {
				$modalInstance.close('cancel');
			}
		}
		
		var incluiOrdemDashboardCallback = function(result) {
			if (!result.hasError) {
				$modalInstance.close('cancel');
			}
		}
		
		inserirOmCtrl.preencherHorario = function(selected) {
			if (!selected) {
				return;
			}
			var params = {
				'nrOrdProdu' : selected['nr-ord-produ']
			};
			if (!params.nrOrdProdu) return;
			programacaoFactory.retornaDatasOm(params, preencherHorarioCallback);
		}
		
		inserirOmCtrl.ajustaDataTermino = function () {
			inserirOmCtrl.dataFinal = inserirOmCtrl.dataInicial;
		}

		inserirOmCtrl.cancelar = function(){
			$modalInstance.dismiss('cancel');
		}

		if ($rootScope.currentuserLoaded) {
			inserirOmCtrl.init(); 
		}

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			$modalInstance.dismiss('cancel');
		});
		
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});
	}

	index.register.controller('mmi.sprint.InserirOmCtrl', inserirOmCtrl);
});
