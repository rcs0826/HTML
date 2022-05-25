define(['index',
        '/dts/mmi/js/api/fch/fchmip/dashboard.js',], function(index) {

	/**
	 * Controller Detail
	 */
	buscaProgramacaoCtrl.$inject = [
		'$rootScope',
		'$scope',
		'$stateParams',
		'$state',
		'TOTVSEvent',
		'totvs.app-main-view.Service',
		'$modalInstance',
		'fchmip.programacao.Factory',
		'fchmip.dashboard.Factory',
		'model'
	];

	function buscaProgramacaoCtrl($rootScope,
							  	 $scope,
								 $stateParams,
								 $state,
								 TOTVSEvent,
								 appViewService,
								 $modalInstance,
								 programacaoFactory,
								 dashboardFactory,
								 model) {

		var buscaProgramacaoCtrl = this;
		var programaOrigem = model.origem;
		
		buscaProgramacaoCtrl.init = function() {
			buscaProgramacaoCtrl.totalRecords = 0;
			buscaProgramacaoCtrl.listaProgramacoes = [];
			buscaProgramacaoCtrl.buscaProgramacoes(false);
			buscaProgramacaoCtrl.programacao = {};
			model.ttPeriodo = null;

		}

		var buscaProgramacoesCallback = function(result) {
			if (!result) 
				return;
			
			buscaProgramacaoCtrl.listaProgramacoes = [];
			buscaProgramacaoCtrl.totalRecords 	= result.length;
			buscaProgramacaoCtrl.resultList 	= result;
			
			for (count = 0; count < 50; count++) {
				buscaProgramacaoCtrl.listaProgramacoes.push(result[count]);
				
				if (buscaProgramacaoCtrl.listaProgramacoes.length === buscaProgramacaoCtrl.totalRecords) 
					break;
			}
		}

		var filtro = function(programac) {
			return programac['cod-programac'].toLowerCase().indexOf(buscaProgramacaoCtrl.search) !== -1 ||
				   programac['des-programac'].toLowerCase().indexOf(buscaProgramacaoCtrl.search) !== -1;  
		}

		buscaProgramacaoCtrl.pesquisar = function() {
			buscaProgramacaoCtrl.listaPeriodo = [];
			buscaProgramacaoCtrl.exibirPeriodo = false;
			buscaProgramacaoCtrl.areaProgramacao = 'col-md-12';
			
			if (buscaProgramacaoCtrl.search !== "") {
				buscaProgramacaoCtrl.listaProgramacoes = buscaProgramacaoCtrl.resultList.filter(filtro);
				buscaProgramacaoCtrl.totalRecords = buscaProgramacaoCtrl.listaProgramacoes.length;
			} else {
				buscaProgramacaoCtrl.buscaProgramacoes(false);
			}
		}
		
		buscaProgramacaoCtrl.confirma = function () {
			var params = buscaProgramacaoCtrl.programacao;
			buscaProgramacaoCtrl.programacaoSelecionada = [];

			angular.forEach(buscaProgramacaoCtrl.listaProgramacoes, function(value) {
				if (value.selecionada) {
					model.ttProgramacao = value;
					model.ttProgramacao["num-dias-interac"] = 1;
				}
			});

			angular.forEach(buscaProgramacaoCtrl.listaPeriodo, function(value) {
				if (value.selecionada) {
					model.ttPeriodo = value;
				}
			});

			if(!model.ttPeriodo) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'warning',
                    title: $rootScope.i18n('l-select-period')
		        });
				return;
			}
			
			model.ttSprint = {'iteracao'    : 1,
							  'numIdPeriodo': model.ttPeriodo.numIdPeriod,
							  'periodo'     : model.ttPeriodo.desPeriod,
							  'dataInicial' : model.ttPeriodo.dataInicial,
							  'dataFinal'   : model.ttPeriodo.dataFinal,
							  'situacao'    : model.ttPeriodo.statusPeriodo,
							  'observacao'  : model.ttPeriodo.desObs};
												
		
				buscaProgramacaoCtrl.fechar();
		}

		buscaProgramacaoCtrl.selecionaProgramacao = function(value) {
			angular.forEach(buscaProgramacaoCtrl.listaProgramacoes, function(programac) {
				if (programac['cod-programac'] === value['cod-programac']) {
					programac.selecionada = true;
					buscaProgramacaoCtrl.buscaPeriodos(programac['num-id-programac'], programaOrigem);
					buscaProgramacaoCtrl.areaProgramacao = 'col-md-8';
					buscaProgramacaoCtrl.areaPeriodo = 'col-md-4';
					buscaProgramacaoCtrl.exibirPeriodo = true;
				} else {
					programac.selecionada = false;
				}
			});
		}

		buscaProgramacaoCtrl.selecionaPeriodo = function(value) {
			angular.forEach(buscaProgramacaoCtrl.listaPeriodo, function(periodo) {
				if (periodo.numIdPeriod === value.numIdPeriod) {
					periodo.selecionada = true;
				} else {
					periodo.selecionada = false;
				}
			});
		}

		buscaProgramacaoCtrl.buscaPeriodos = function(codigoProgramacao, programaOrigem) {
			dashboardFactory.buscaPeriodos({"num-id-programac": codigoProgramacao, "programaOrigem":programaOrigem}, function(result){		                
                angular.forEach(result, function(sprint) {
                    sprint.dataInicial = new Date(sprint.dataInicialStr);
                    sprint.dataFinal = new Date(sprint.dataFinalStr);
                });
                
                buscaProgramacaoCtrl.listaPeriodo = result;
                
			});			
		}

		buscaProgramacaoCtrl.buscaProgramacoes = function(isMore){
			
			if(programaOrigem === "listaOmProgramacao"){
				var params = programaOrigem;
				
				}else{
					var params = [];
				}
			
			if (isMore){
				var startAt = buscaProgramacaoCtrl.listaProgramacoes.length;
				
				for(count = startAt; count < startAt + 50; count++){
						buscaProgramacaoCtrl.listaProgramacoes.push(buscaProgramacaoCtrl.resultList[count]);
						if (buscaProgramacaoCtrl.listaProgramacoes.length === buscaProgramacaoCtrl.totalRecords) break;
				}
			} else {
				 
				dashboardFactory.buscaProgramacoes(params, buscaProgramacoesCallback);
			}
		}

		if ($rootScope.currentuserLoaded) {
			buscaProgramacaoCtrl.init();
		}

		buscaProgramacaoCtrl.fechar = function(){
			$modalInstance.close('cancel');
		}
		
		buscaProgramacaoCtrl.cancel = function(){
			$modalInstance.dismiss('cancel');
		}
		
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});
	}

	index.register.controller("mmi.sprint.dashboard.BuscaProgramacaoCtrl", buscaProgramacaoCtrl);
});
