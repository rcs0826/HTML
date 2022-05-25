define(['index',
	'/dts/mmi/js/api/fch/fchmip/dashboard.js',
    '/dts/mmi/html/sprint/dashboard/busca-programacao-acomp.js'], function(index) {
	
	listaordemCtrl.$inject = [
			'$rootScope',
			'$scope',
			'TOTVSEvent',
			'totvs.app-main-view.Service',
			'fchmip.dashboard.Factory',
			'$modal',
			'$filter',
			'helperDashBoard',
			'mmi.utils.Service',
			'i18nFilter'
	];

	function listaordemCtrl($rootScope, 
								 $scope, 
								 TOTVSEvent,
								 appViewService,
								 dashboardFactory,
								 $modal,
								 $filter,
								 helperDashBoard,
								 mmiUtils,
								 i18n) {

		listaordemCtrl = this;

		listaordemCtrl.init = function() {
			listaordemCtrl.ttPeriodo = null;
			listaordemCtrl.ttProgramacao = null;
			listaordemCtrl.ttSprint = null;
			listaordemCtrl.totalRecords = 0;
			listaordemCtrl.listaOrdens = [];
			listaordemCtrl.tituloProgramacao;
			listaordemCtrl.periodoSelecionado = helperDashBoard.data.periodoSelecionado;
			listaordemCtrl.ordemSelecionada = [];
			listaordemCtrl.novaLista =[];
			
			listaordemCtrl.accord = {};
			listaordemCtrl.accord.period = true;
			
			iniciaTela();
		};

		listaordemCtrl.search = function(nrOrdem){
			listaordemCtrl.listaOrdens = null;
			if(listaordemCtrl.nrOrdem !== undefined && listaordemCtrl.nrOrdem !== ""){
				listaordemCtrl.listaOrdens = listaordemCtrl.resultList.filter(filtro);
				listaordemCtrl.totalRecords = listaordemCtrl.listaOrdens.length;
			} else{
				listaordemCtrl.listaOrdens = listaordemCtrl.resultList;
			}
		};

		var filtro = function(order) {
			return order.nrOrdProdu === parseInt(listaordemCtrl.nrOrdem); 
		}

        var montaParams =function(){
			if(listaordemCtrl.createTab){
				listaordemCtrl.model.ttFiltro = {};
				listaordemCtrl.model.periodo = {};
				inicializaStatus();
				criaParams();
				return listaordemCtrl.params;
			}else{
				criaParams();
				return listaordemCtrl.params;
			}
        	
		};
		
		criaParams = function(){
			if(!listaordemCtrl.model.periodo){
				listaordemCtrl.model.periodo = {};
			}
            if(!listaordemCtrl.model.ttFiltro){
				listaordemCtrl.model.ttFiltro = {};
			}			
			
			listaordemCtrl.params = {
				'ttSprint' : {
					'numIdPeriodo'	: helperDashBoard.data.ttPeriodo.numIdPeriod,
					'numIdProgramac'	: helperDashBoard.data.ttProgramacao['num-id-programac'],
				  },
				  'ttFiltro': listaordemCtrl.model.ttFiltro
			};
			return listaordemCtrl.params;
		}

		listaordemCtrl.buscaListaOm = function(isMore){

			if (isMore){
				var startAt = listaordemCtrl.listaOrdens.length;
                if(listaordemCtrl.resultList !== undefined){
					for (count = startAt; count < startAt + 50; count++) {
						listaordemCtrl.listaOrdens.push(listaordemCtrl.resultList[count]);
						if (listaordemCtrl.listaOrdens.length === listaordemCtrl.totalRecords) break;
					}
				}
			} else{
				params = montaParams();
				dashboardFactory.listarOmsProgramacao(params, listarOmsProgramacaoCallback);
				} 
		};

		listaordemCtrl.pesquisaProgramacao = function() {
		
			var model = {
				"origem" : "listaOmProgramacao",
				"ttOrdemLista": []
			   }
			var modalInstance = $modal.open({
				  templateUrl: '/dts/mmi/html/sprint/dashboard/busca.programacao.acomp.html',
				  controller: 'mmi.sprint.dashboard.BuscaProgramacaoCtrl as buscaProgramacaoCtrl',
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
				listaordemCtrl.tituloProgramacao = model.ttProgramacao['cod-programac'] 
												+ " - "   + model.ttProgramacao['des-programac'] 
												+ " - "   + $filter('date')(model.ttPeriodo.dataInicial,'dd/MM/yyyy') 
												+ " " + $rootScope.i18n('l-to') + " " + $filter('date')(model.ttPeriodo.dataFinal,'dd/MM/yyyy')
												+ " - "   + model.ttPeriodo.descStatusPeriodo 

				helperDashBoard.data.ttProgramacao =  model.ttProgramacao;
				helperDashBoard.data.ttPeriodo     = model.ttPeriodo;
				listaordemCtrl.periodoSelecionado = helperDashBoard.data.ttProgramacao.selecionada;

				if(helperDashBoard.numIdProgramac !== helperDashBoard.data.ttProgramacao['num-id-programac']){
					listaordemCtrl.model = {};
					listaordemCtrl.model.ttFiltro = {};
					listaordemCtrl.model.periodo = {};
					inicializaStatus();
					helperDashBoard.numIdProgramac = helperDashBoard.data.ttProgramacao['num-id-programac'];
				}

				criaParams();
				listaordemCtrl.params.ttSprint.numIdPeriodo = model.ttPeriodo.numIdPeriod;
				listaordemCtrl.params.ttSprint.numIdProgramac = model.ttProgramacao['num-id-programac'];

				dashboardFactory.listarOmsProgramacao(listaordemCtrl.params, listarOmsProgramacaoCallback);	

			});
		}

		var inicializaStatus = function(){
			listaordemCtrl.model.ttFiltro = {};
			listaordemCtrl.model.ttFiltro.planejamento = true;
			listaordemCtrl.model.ttFiltro.naoIniciada = true;
			listaordemCtrl.model.ttFiltro.emExecucao = true;
			listaordemCtrl.model.ttFiltro.finalizada = true;
			listaordemCtrl.model.ttFiltro.reprogramada = true;
			listaordemCtrl.model.ttFiltro.impedimento = true;
			listaordemCtrl.model.ttFiltro.preventiva = true;
			listaordemCtrl.model.ttFiltro.corretiva = true;
			listaordemCtrl.model.ttFiltro.preditiva = true;
			listaordemCtrl.model.ttFiltro.outros = true;
			return inicializaStatus;
		}	

		var iniciaTela = function(){

			listaordemCtrl.createTab = appViewService.startView($rootScope.i18n('l-list-order-period'), 'mmi.sprint.ordem.ListaOrdemCtrl', listaordemCtrl);

			if (listaordemCtrl.createTab){
				listaordemCtrl.model = {};
				listaordemCtrl.model.ttFiltro = {};
				listaordemCtrl.model.periodo = {};

				if(helperDashBoard.data.ttProgramacao && helperDashBoard.data.origem === 'dashboard'){
					listaordemCtrl.tituloProgramacao = helperDashBoard.data.ttProgramacao['cod-programac'] 
												+ " - "   + helperDashBoard.data.ttProgramacao['des-programac'] 
												+ " - "   + $filter('date')(helperDashBoard.data.ttPeriodo.dataInicial,'dd/MM/yyyy') 
												+ " " + $rootScope.i18n('l-to') + " " + $filter('date')(helperDashBoard.data.ttPeriodo.dataFinal,'dd/MM/yyyy')
												+ " - "   + helperDashBoard.data.ttPeriodo.descStatusPeriodo 


				} else {
					helperDashBoard.data.ttProgramacao = {};
					helperDashBoard.data.ttPeriodo = {};
					helperDashBoard.data.ttSprint = {};
					listaordemCtrl.tituloProgramacao = $rootScope.i18n('l-search-programming');
				}
				 
			} else {
				if(helperDashBoard.numIdProgramac !== helperDashBoard.data.ttProgramacao['num-id-programac'] && helperDashBoard.data.ttProgramacao){
					listaordemCtrl.model = {};
					listaordemCtrl.model.periodo = {};
					inicializaStatus();
					helperDashBoard.numIdProgramac = helperDashBoard.data.ttProgramacao['num-id-programac'];
				}

				
				if (helperDashBoard.data.ttProgramacao && helperDashBoard.data.ttProgramacao['cod-programac']) {
					listaordemCtrl.tituloProgramacao = helperDashBoard.data.ttProgramacao['cod-programac'] 
													+ " - "   + helperDashBoard.data.ttProgramacao['des-programac'] 
													+ " - "   + $filter('date')(helperDashBoard.data.ttPeriodo.dataInicial,'dd/MM/yyyy') 
													+ " " + $rootScope.i18n('l-to') + " " + $filter('date')(helperDashBoard.data.ttPeriodo.dataFinal,'dd/MM/yyyy')
													+ " - "   + helperDashBoard.data.ttPeriodo.descStatusPeriodo
				} else {
					listaordemCtrl.tituloProgramacao = $rootScope.i18n('l-search-programming');
				}

			};

			params = montaParams();
			dashboardFactory.listarOmsProgramacao(params, listarOmsProgramacaoCallback);
		}
		
		listaordemCtrl.emitirFichas = function(){
			listaordemCtrl.novaLista = [];
		
			var omsSelecionada = listaordemCtrl.listaOrdens.filter(function(value){
				return value.$selected;
			});
			
		   omsSelecionada.forEach(function(value) {
			   listaordemCtrl.novaLista.push(value.nrOrdProdu);
		   });
		   
		   if (listaordemCtrl.novaLista.length === 0) {
			   $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'warning',
	                title: $rootScope.i18n('l-attention'),
	                detail: $rootScope.i18n('l-no-selected-record-txt')
			   });
		   } else {		   
			   abreProgress(listaordemCtrl.novaLista);
		   }
		}
	  
		var abreProgress = function(nrOrdem){
	 
			var params = [{"type": "char", "value": listaordemCtrl.novaLista}];
				cProgram = "";
				cProgram = "mvp/mv0501b.p";
				msgAux = "";
				msgAux = $rootScope.i18n('l-print-issue') + ' - MV0501';
				listaordemCtrl.openProgress(cProgram, "mv0501b.p", params, msgAux);
			
		};

		listaordemCtrl.openProgress  = function (path, program, param, msgAux) {
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'info',
				title: $rootScope.i18n('msg-opening-program', [msgAux])
			});
			$rootScope.openProgramProgress(path, program, param);
			listaordemCtrl.novaLista = [];

		}
		
		listaordemCtrl.openAdvancedSearch = function() {
			if(!listaordemCtrl.advancedSearch){
				listaordemCtrl.advancedSearch = {accord: {}};
				listaordemCtrl.advancedSearch.accord.period = true;
				listaordemCtrl.advancedSearch.accord.filtro = false;
				listaordemCtrl.advancedSearch.accord.statusOmProg = false;
				listaordemCtrl.advancedSearch.accord.statisticsOmProg = false;
			}
			
			listaordemCtrl.model.advancedSearch = listaordemCtrl.advancedSearch;			
			
			var modalInstance = $modal.open({
              templateUrl: '/dts/mmi/html/sprint/listaordem/lista.ordem.advanced.search.html',
              controller: 'mmi.sprint.listaordem.SearchCtrl as listaOmSearchCtrl',
              size: 'lg',
              resolve: {
                model: function () {
                  return listaordemCtrl.model;
                }
              }
			});
			
            modalInstance.result.then(function() {
					var paramsAvancado = {
						'ttSprint' : {
							'numIdPeriodo': helperDashBoard.data.ttPeriodo.numIdPeriod,
							'numIdProgramac': helperDashBoard.data.ttProgramacao['num-id-programac'],
						}, 
						'ttFiltro':listaordemCtrl.model.ttFiltro};
				dashboardFactory.listarOmsProgramacao(paramsAvancado, listarOmsProgramacaoCallback);
            });
        }
		var listarOmsProgramacaoCallback = function(result) {
			// Carrega os dados da tela
			listaordemCtrl.carregaOrdens(result);
		}
		// ### PUBLICAS
		listaordemCtrl.carregaOrdens = function(result) {
			if(result.length > 0){
				listaordemCtrl.listaOrdens = [];
				listaordemCtrl.totalRecords = result.length;
				listaordemCtrl.resultList = result;
			
				for (count = 0; count < 50; count++) {
					listaordemCtrl.listaOrdens.push(result[count]);
					if (listaordemCtrl.listaOrdens.length === listaordemCtrl.totalRecords) break;
					
				}
			} else {
				listaordemCtrl.listaOrdens = []
			 }
		}
		
		listaordemCtrl.exportaVisaoReprogramacao = function() {

			setTimeout(function() {

				var parameters = listaordemCtrl.resultList;
				listaordemCtrl.filename = i18n('l-export-reprogramming', [], 'dts/mmi')  + '.csv';				

				dashboardFactory.exportaVisaoReprogramacao(parameters, exportaCSVCallback);
				
			},100);
		}

		listaordemCtrl.exportaVisaoOmCsv = function() {

			setTimeout(function() {

				var parameters = listaordemCtrl.resultList;
				listaordemCtrl.filename = i18n('l-order-view-file', [], 'dts/mmi')  + '.csv';				

				dashboardFactory.exportaVisaoOmCsv(parameters, exportaCSVCallback);
				
			},100);
		}

		listaordemCtrl.exportaMateriaisPeriodoCsv = function() {

			setTimeout(function() {

				var parameters = listaordemCtrl.resultList;

				listaordemCtrl.filename = i18n('l-detailed-material-list-file', [], 'dts/mmi')  + '.csv';				

				dashboardFactory.exportaMateriaisPeriodoCsv(parameters, exportaCSVCallback);
				
			},100);
		}

		listaordemCtrl.exportaVisaoEspecialidades = function() {

			var parameters = {
				'ttSprint' : {
					'numIdPeriodo': listaordemCtrl.params.ttSprint.numIdPeriodo,
					'numIdProgramac': listaordemCtrl.params.ttSprint.numIdProgramac
				}, 
				'ttOrdemLista':listaordemCtrl.resultList,
				'ttFiltro': listaordemCtrl.model.ttFiltro 
			};

			listaordemCtrl.filename = i18n('l-detailed-order-speciality-file', [], 'dts/mmi')  + '.csv';				

			dashboardFactory.exportaVisaoEspecialidades(parameters, exportaCSVCallback);
				
		}

		var exportaCSVCallback = function(result){
			mmiUtils.geraCsv(result, listaordemCtrl.filename); 
		}		
		
		if ($rootScope.currentuserLoaded) { 
			this.init();
		}
	
		$scope.$on('$destroy', function () {
			listaordemCtrl = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});

  }
// ************************** Busca avançada ****************************************** //
  listaOmSearchCtrl.$inject = [
	  '$modalInstance', 
	  '$scope', 
	  'model', 
	  '$rootScope',
	  'TOTVSEvent'];

  function listaOmSearchCtrl ($modalInstance, 
							  $scope, 
							  model, 
							  $rootScope, 
							  TOTVSEvent) {
	  // recebe os dados de pesquisa atuais e coloca no controller
		var listaOmSearchCtrl = this;
			listaOmSearchCtrl.model = model;
				
		listaOmSearchCtrl.init = function() {
			listaOmSearchCtrl.model.valorAnterior = {};
			angular.copy(model.ttFiltro, listaOmSearchCtrl.model.valorAnterior);
		}

		listaOmSearchCtrl.search = function () {

			model.ttFiltro.startDate = !listaOmSearchCtrl.model.periodo  ? undefined : listaOmSearchCtrl.model.periodo.startDate;
			model.ttFiltro.endDate   = !listaOmSearchCtrl.model.periodo  ? undefined : listaOmSearchCtrl.model.periodo.endDate;			
			model = listaOmSearchCtrl.model;
			$modalInstance.close();
	    };

	  listaOmSearchCtrl.sugereFinal = function(campo){
		
		switch (campo) {
			case 1: 
				if(listaOmSearchCtrl.model.ttFiltro.estabelInicial !== "" && !listaOmSearchCtrl.model.ttFiltro.estabelFinal){
					listaOmSearchCtrl.model.ttFiltro.estabelFinal = listaOmSearchCtrl.model.ttFiltro.estabelInicial;
				};
				break;	
			case 2:
				if(listaOmSearchCtrl.model.ttFiltro.oficinaInicial !== "" && !listaOmSearchCtrl.model.ttFiltro.oficinaFinal){
					listaOmSearchCtrl.model.ttFiltro.oficinaFinal = listaOmSearchCtrl.model.ttFiltro.oficinaInicial;
				break;	
				};
			case 3: 
				if(listaOmSearchCtrl.model.ttFiltro.planejadorInicial !== "" && !listaOmSearchCtrl.model.ttFiltro.planejadorFinal){
					listaOmSearchCtrl.model.ttFiltro.planejadorFinal = listaOmSearchCtrl.model.ttFiltro.planejadorInicial;
				};
				break;	
			case 4: 
				if(listaOmSearchCtrl.model.ttFiltro.equipamentoInicial !== "" && !listaOmSearchCtrl.model.ttFiltro.equipamentoFinal){
					listaOmSearchCtrl.model.ttFiltro.equipamentoFinal = listaOmSearchCtrl.model.ttFiltro.equipamentoInicial;
				};
				break;
			case 5:
				if(listaOmSearchCtrl.model.ttFiltro.tagInicial !== "" && !listaOmSearchCtrl.model.ttFiltro.tagFinal){
					listaOmSearchCtrl.model.ttFiltro.tagFinal = listaOmSearchCtrl.model.ttFiltro.tagInicial;
				};
				break;
			case 6:
				if(listaOmSearchCtrl.model.ttFiltro.planoInicial !== "" && !listaOmSearchCtrl.model.ttFiltro.planoFinal){
					listaOmSearchCtrl.model.ttFiltro.planoFinal = listaOmSearchCtrl.model.ttFiltro.planoInicial;
				};
				break;
		}

	  }

	  listaOmSearchCtrl.close = function () {
		  listaOmSearchCtrl.model.ttFiltro = listaOmSearchCtrl.model.valorAnterior;
		  $modalInstance.dismiss();
	  };
	  
	  $scope.$on('$destroy', function () {
		listaOmSearchCtrl = undefined;
	});

	  $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
		controller.init();
	});

	if ($rootScope.currentuserLoaded) { 
		this.init();
	}

  }

  index.register.controller('mmi.sprint.listaordem.ListaOrdemCtrl', listaordemCtrl);
  index.register.controller('mmi.sprint.listaordem.SearchCtrl', listaOmSearchCtrl);
	index.register.service('helperDashBoard', function(){
		return {
			data :{}
		};
	});
  
});
