define(['index',
		'/dts/mmi/js/zoom/pend-padrao.js',], function(index) {

	alterarDataCtrl.$inject = [	                              
		'$rootScope',	         
		'$scope',
		'$modalInstance',
		'TOTVSEvent',
		'model',
		'$filter',
		'fchmip.programacao.Factory',
		'fchmip.dashboard.Factory',
		'$timeout'
	];
	
	function alterarDataCtrl($rootScope, 
							 $scope,
							 $modalInstance,
							 TOTVSEvent,
							 model,
							 $filter,
							 programacaoFactory,
							 dashboardFactory,
							 $timeout) {
	
		var alterarDataCtrl = this;
		alterarDataCtrl.model = model;
		alterarDataCtrl.isDashboard = false;
		alterarDataCtrl.mostraPeriodos = false;
		
		// *********************************************************************************
	    // *** Funções
	    // *********************************************************************************
	
		alterarDataCtrl.init = function() {
			setFocus();
			alterarDataCtrl.model.codMotivoTela = undefined;
			alterarDataCtrl.model.ttOrdem['des-obs'] = undefined;	
			
			if (alterarDataCtrl.model.origem === "dashboard"){
				alterarDataCtrl.isDashboard = true;

				if (alterarDataCtrl.model.ttOrdem.idiStatus > 2) {
					buscaPeriodosReprogramacao();
				}
			} else {
				if (alterarDataCtrl.model.ttOrdem.estadoOM > 1) {
					buscaPeriodosReprogramacao();
				}
			}		
			
			habilitaMotivo();
		}	
		
		var setFocus = function() {
	    	$timeout(function() {
	    		$('#dataEntrada').find('*').filter(':input:visible:first').focus();
	        },500);
		}

		var buscaPeriodosReprogramacao = function() {
			var params = model.ttProgramacao;
			
			alterarDataCtrl.mostraPeriodos = true;
			params.programaOrigem = alterarDataCtrl.model.origem;			
			
			programacaoFactory.buscaPeriodosReprogramacao(params, buscaPeriodosReprogramacaoResult);
		}

		var buscaPeriodosReprogramacaoResult = function(result) {
			alterarDataCtrl.periodos = [];

			angular.forEach(result, function(periodo) {
				alterarDataCtrl.periodos.push({value: periodo.numIdPeriod, label: periodo.desPeriod});
			});

			alterarDataCtrl.periodoSelecionado = model.ttOrdem.numIdPeriod;
		}
		
		var habilitaMotivo = function() {
			if (alterarDataCtrl.isDashboard) {
				alterarDataCtrl.mostraMotivo = true;
			} else {
				if (model.sprintSelecionada.situacao === 1) {
					alterarDataCtrl.mostraMotivo = false;
				} else {
					alterarDataCtrl.mostraMotivo = true;
				}
			}						
			alterarDataCtrl.habilitaMotivo = false;
		}
		
		alterarDataCtrl.alteraDataOrdem = function () {
			validaHora();
			if (alterarDataCtrl.model.codMotivoTela === undefined){
				alterarDataCtrl.model.ttOrdem['cod-motivo'] = "";
			}else{
				alterarDataCtrl.model.ttOrdem['cod-motivo'] = alterarDataCtrl.model.codMotivoTela['cd-pend-padr'];
			}
			alterarDataCtrl.model.ttOrdem['des-obs'] === undefined ? "" :alterarDataCtrl.model.ttOrdem['des-obs'];

			if (alterarDataCtrl.isDashboard === true){
				alterarDataCtrl.params = {};
				alterarDataCtrl.params.ttProgramacao = model.ttProgramacao;
				alterarDataCtrl.params.ttSprint = model.ttSprint;
				alterarDataCtrl.params.ttOrdem = model.ttOrdem;
				alterarDataCtrl.params.ttPeriodo = {numIdPeriod: alterarDataCtrl.periodoSelecionado};
				dashboardFactory.alteraDataOrdem(alterarDataCtrl.params, alteraDataOrdemCallback);
			} else {
				model.ttPeriodo = {numIdPeriod: alterarDataCtrl.periodoSelecionado};
				programacaoFactory.alteraDataOrdem(model, alteraDataOrdemCallback);
			}
	    }
		
		var alteraDataOrdemCallback = function(result) {
			if (!result) return;
			
			if (alterarDataCtrl.isDashboard) {
				if (!result.hasError) {
					if (result.logForaPeriodo) {
						reprogramarOrdem(result.desSituacaoPeriodo);
					} else {
						alterarDataCtrl.fechar();					
					}
				}
			} else {
				if (result && result.ttOrdemRetorno.length > 0) {
					model.ttOrdem.iteracao = result.ttOrdemRetorno[0].iteracao;
					model.ttSprint = result.ttSprintRetorno;
					model.ttOrdemPeriodo = result.ttOrdemPeriodo;
					if (model.ttOrdem.iteracao === 0) model.ordemRemovida = true;
					alterarDataCtrl.fechar();
				}
			}
		}
		
		var reprogramarOrdem = function(situacaoPeriodo) {
			var ordem = $filter("orderNumberMask")(model.ttOrdem.nrOrdProdu);
			
			if (model.ttOrdem.idiStatus > 2) {
				dashboardFactory.reprogramarOrdem(alterarDataCtrl.params, reprogramarOrdemCallback);
				return;
			}

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-question',
				text: $rootScope.i18n('msg-confirm-reschedule', [situacaoPeriodo, ordem]),
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				callback: function(isPositiveResult) {
					if (isPositiveResult) {
						dashboardFactory.reprogramarOrdem(alterarDataCtrl.params, reprogramarOrdemCallback);
					}
				}
			});
		}
		
		var reprogramarOrdemCallback = function(result) {
			if (result && !result.hasError) {
				model.ordemRemovida = true;
				alterarDataCtrl.fechar();
			}
		}
		
		var validaHora = function() {
			if (alterarDataCtrl.model.ttOrdem.horaManut.substring(1,2) === ":") {
				alterarDataCtrl.model.ttOrdem.horaManut = "0" + alterarDataCtrl.model.ttOrdem.horaManut;
			}
			if (alterarDataCtrl.model.ttOrdem.horaTermino.substring(1,2) === ":") {
				alterarDataCtrl.model.ttOrdem.horaTermino = "0" + alterarDataCtrl.model.ttOrdem.horaTermino;
			}
		}
		
		alterarDataCtrl.ajustaDataTermino = function () {
			alterarDataCtrl.model.ttOrdem.dtTermino = alterarDataCtrl.model.ttOrdem.dtManut;
			validaDataPeriodo();
		}
		
		var validaDataPeriodo = function() {
			if (alterarDataCtrl.mostraPeriodos) {
				alterarDataCtrl.validaPeriodoSelecionado();
			} else {
				var dtManut = alterarDataCtrl.model.ttOrdem.dtManut;
				if (dtManut < alterarDataCtrl.model.sprintSelecionada.dataInicial || dtManut > alterarDataCtrl.model.sprintSelecionada.dataFinal) {
					alterarDataCtrl.habilitaMotivo = true;
				} else {
					desabilitaMotivo();
				}
			}
		} 

		alterarDataCtrl.validaPeriodoSelecionado = function() {
			$timeout(function() {
				if (alterarDataCtrl.periodoSelecionado !== model.ttOrdem.numIdPeriod) {
					alterarDataCtrl.habilitaMotivo = true;
				} else {
					desabilitaMotivo();
				}
			}, 0);
		}

		var desabilitaMotivo = function() {
			alterarDataCtrl.habilitaMotivo = false;
			alterarDataCtrl.model.codMotivoTela = undefined;
			alterarDataCtrl.model.ttOrdem['des-obs'] = "";
		}
	
		alterarDataCtrl.fechar = function () {
			$modalInstance.close();
	    }
		
		alterarDataCtrl.cancelar = function () {
			$modalInstance.dismiss('cancel');
		}
		
		if ($rootScope.currentuserLoaded) { alterarDataCtrl.init(); }
	    
	    $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {		 
		    $modalInstance.dismiss('cancel');
		});
	     
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	    	alterarDataCtrl.init();
	    });
	}
	
	index.register.controller("mmi.sprint.AlterarDataCtrl", alterarDataCtrl);
});