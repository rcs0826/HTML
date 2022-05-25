define(['index',
		'/dts/mmi/html/sprint/arvoreativos/arvore-ativos.directive.js',
		'/dts/mmi/js/api/fch/fchmip/programacao.js',
		'/dts/mmi/html/sprint/programacao-edit.js',
		'/dts/mmi/html/sprint/programacao-insert-om.js',
		'/dts/mmi/html/sprint/programacao-search.js',
		'/dts/mmi/html/sprint/ordem/alterar-data.js',
		'/dts/mmi/html/sprint/ordem/retirar-programacao.js',
		'/dts/mmi/html/sprint/backlog/programacao-backlog.js',
		'/dts/mmi/html/sprint/sprint-observacao.js',
		'/dts/mmi/html/sprint/sprint-planning-prioridade.js',
		'/dts/mmi/js/utils/filters.js',
		'/dts/mmi/html/sprint/especialidade/sprint-planning-hh.js',
		'/dts/mmi/html/sprint/especialidade/sprint-planning-especialidade.js',
		'/dts/mmi/html/sprint/sprint-planning-liberacao.js',
		'/dts/mmi/html/sprint/materiais/open-deposito.js',
		'/dts/mmi/html/sprint/sprint-info-modal.js'

		], function(index) {

	/**
	 * Controller Detail
	 */
	sprintPlanningCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'totvs.app-main-view.Service',
		'fchmip.programacao.Factory',
		'$modal',
		'helperSprint',
		'helperEspecialidade',
		'mmi.utils.Service',
		'i18nFilter'
	];

	function sprintPlanningCtrl($rootScope,
	                            $scope,
	                            TOTVSEvent,
	                            appViewService,
	                            programacaoFactory,
	                            $modal,
	                            helperSprint,
								helperEspecialidade,
								mmiUtils,
								i18n) {
		
		planningCtrl = this;
		planningCtrl.tituloProgramacao = $rootScope.i18n('l-select-programming');
		planningCtrl.arvoreAtivosScope = {};
		planningCtrl.escondeRemover = true;
		planningCtrl.equipSelecionado = false;
		planningCtrl.scheduler = {
			data: [],
			views: [
				{ 
					type: "day", 
					dateHeaderTemplate: "<span class='k-link k-nav-day'>#=kendo.toString(date, 'ddd dd/M')#</span>"
				},{ 
					type: "week",
					selected: true, 
					dateHeaderTemplate: "<span class='k-link k-nav-day'>#=kendo.toString(date, 'ddd dd/M')#</span>"
				},{
					type: "month"
				}
			],						
			timezone: "Etc/UTC"
		};
	
		var montaDiv = function(numDiasInterac) {
			if (numDiasInterac === 1) {
				planningCtrl.sprintClass = "col-xs-12";
			} else if (numDiasInterac === 2) {
				planningCtrl.sprintClass = "col-xs-6";
			} else if (numDiasInterac === 3) {
				planningCtrl.sprintClass = "col-xs-4";
			} else {
				planningCtrl.sprintClass = "col-xs-3";
			}
			planningCtrl.reloadSprints();
		}

		planningCtrl.reloadSprints = function() {
			var sprintDivs = [].slice.call(document.getElementsByClassName('sprint'));
			if (sprintDivs && sprintDivs.length > 0) {
				sprintDivs.forEach(function(el){
					el.style.display = 'none';
					setTimeout(function() {
						el.style.display = '';
					});
				});
			}
		}

		planningCtrl.montaSprint = function() {
			var numDiasInterac = planningCtrl.model.ttProgramacao['num-dias-interac'];
			montaDiv(numDiasInterac);
			planningCtrl.numDiasInteracAux = planningCtrl.model.ttProgramacao['num-dias-interac'];
			planningCtrl.possuiNivelSelecionado = false;
		}

		planningCtrl.visualizaIteracao = function(numDiasInterac) {
			montaDiv(numDiasInterac);
			planningCtrl.possuiNivelSelecionado = true;
			planningCtrl.numDiasInteracAux = numDiasInterac;
		}

		planningCtrl.init = function() {
			var createTab = appViewService.startView($rootScope.i18n("l-maintenance-schedule"), "mmi.sprint.PlanningCtrl", planningCtrl);
			if (createTab) {
				planningCtrl.expandido = true;
				planningCtrl.model = {};
                helperEspecialidade.data.especialidade = [];
			} else {
				planningCtrl.arvoreAtivosScope.carregaArvoreNivelSelecionado();
                
                planningCtrl.exibirPagina(planningCtrl.hh, planningCtrl.acompanhamento, planningCtrl.cards, planningCtrl.materiais, planningCtrl.resumo);
			}
		}

		planningCtrl.obterAltura = function() {
			return window.innerHeight - 124;
		}

		planningCtrl.obterAlturaMaterias= function() {
			return window.innerHeight - 190 + 'px';
		}

		planningCtrl.selecionaEquipamentoCallback = function() {
			var ordens = [];
			planningCtrl.model.ttOrdem.forEach(function(element){
				var dataInicial = new Date(element['dtManut']);
				var horaManut = element['horaManut'];
				if (horaManut == null) {
					horaManut = '00:00';
				}
				dataInicial.setHours(horaManut.split(':')[0],horaManut.split(':')[1],0);
				var dataFinal = new Date(element['dtTermino']);
				
				var horaTermino = element['horaTermino'];
				if (horaTermino == null) {
					horaTermino = '00:00';
				}
				dataFinal.setHours(horaTermino.split(':')[0],horaTermino.split(':')[1],0);
				var titulo = element['nrOrdProdu'] + '\n' + element['cdEquipto'];
				var durationOrder = ((dataFinal - dataInicial) / 1000 / 60 / 60).toFixed(2);
				ordens.push({
					id: element['nrOrdProdu'],
					start: dataInicial,
					end: dataFinal,
					title: titulo,
					timDuration: durationOrder
				});
			});
			planningCtrl.scheduler.data = ordens;
			planningCtrl.equipSelecionado = true;

			if (planningCtrl.model.ttPeriodoProgramacao) 
				planningCtrl.scheduler.startTime = new Date(planningCtrl.model.ttPeriodoProgramacao['0'].dataInicial);
		}

		planningCtrl.informacaoSprint = function() {
			if (planningCtrl.programacaoSelecionada) {
				var modalInstance = $modal.open({
					templateUrl: '/dts/mmi/html/sprint/sprint-info-modal.html',
					controller: 'mmi.sprint.dashboard.InformacaoSprintCtrl as informacaoSprintCtrl',
					size: 'lg',
					backdrop: 'static',
					keyboard: true,
					resolve: {
						model: function () {
							return planningCtrl.model.ttSprint;
						}
					}
				});
			} else {
				planningCtrl.pesquisaProgramacao();
			}
		}

		planningCtrl.obterAlturaDivSprint = function() {
			return {
				height: (window.innerHeight - 145) + 'px'
			};
		}

		planningCtrl.hhSelecionado = function() {
			if(planningCtrl.hh) return planningCtrl.paginaSelecionada();
		}

		planningCtrl.cardsSelecionado = function() {
			if(planningCtrl.cards) return planningCtrl.paginaSelecionada();
		}

		planningCtrl.resumoSelecionado = function() {
			if(planningCtrl.resumo) return planningCtrl.paginaSelecionada();
		}

		planningCtrl.materiaisSelecionado = function() {
			if(planningCtrl.materiais) return planningCtrl.paginaSelecionada();
		}

		planningCtrl.acompanhamentoSelecionado = function() {
			if(planningCtrl.acompanhamento) return planningCtrl.paginaSelecionada();
		}

		planningCtrl.paginaSelecionada = function() {
			return {
				'background-color': '#e6e6e6'
			}
		}

		planningCtrl.funcaoAtualizacao = function() {
			planningCtrl.possuiSprintEmPlanejamentoValidacao();
		}

		planningCtrl.possuiSprintEmPlanejamentoValidacao = function() {
			planningCtrl.possuiSprintEmPlanejamento = false;
			if (planningCtrl.model.ttSprint) {
				planningCtrl.model.ttSprint.forEach(function(sprint) {
					if (sprint.situacao == 2) {
						planningCtrl.possuiSprintEmPlanejamento = true;
					}
				});
			}
		}

		planningCtrl.inserirOmProgramacao = function(sprint) {
			
			var model = {
				'ttParametros': planningCtrl.model.ttParametros,
				'ttProgramacao': planningCtrl.model.ttProgramacao,
				'ttSprint': sprint
			};

			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/programacao.insert.om.html',
				controller: 'mmi.sprint.InserirOmCtrl as inserirOmCtrl',
				size: 'md',
				backdrop: 'static',
				keyboard: true,
				resolve: { 
					model: function () {
						return model;
					}
				}
			});

			modalInstance.result.then(function() {
				planningCtrl.arvoreAtivosScope.carregaArvore();
			});

		}

		planningCtrl.openProgramacao = function(pType) {
			angular.element('totvs-editable').popover('destroy');
				
			if(pType === "add"){
				var model = {}
				model.isNew = true;
				planningCtrl.escondeRemover = false;
			}else{
				var model = planningCtrl.model;
				model.isNew = false;
			}
			var modalInstance = $modal.open({
				  templateUrl: '/dts/mmi/html/sprint/programacao.edit.html',
				  controller: 'mmi.sprint.ProgramacaoCtrl as programacaoCtrl',
				  size: 'md',
				  backdrop: 'static',
				  keyboard: true,
				  resolve: { 
						model: function () {
							return model;
						}
				  }
			});
				
			modalInstance.result.then(function(){
				planningCtrl.model.ttProgramacao = model.ttProgramacao;
				planningCtrl.tituloProgramacao = planningCtrl.model.ttProgramacao['cod-programac'] + ' - ' + planningCtrl.model.ttProgramacao['des-programac'];
				planningCtrl.model.ttParametros = model.ttParametros;
				planningCtrl.model.ttParametrosAux = model.ttParametrosAux;
				planningCtrl.model.ttSprint = model.ttSprint;
				planningCtrl.model.ttDescricaoParametros = model.ttDescricaoParametros;
				planningCtrl.model.ttOrdem = [];
				planningCtrl.arvore = [];
				planningCtrl.ttEquipamento = [];
				planningCtrl.montaSprint();
				
				planningCtrl.programacaoSelecionada = true;
				planningCtrl.equipSelecionado = false;
				planningCtrl.exibirPagina(false, false, true, false, false);
				planningCtrl.exibirArvoreAtivos();
				planningCtrl.arvoreAtivosScope.carregaArvore();
			});
		}
		
		planningCtrl.exibirPagina = function(hh, acompanhamento, cards, materiais, resumo) {
			planningCtrl.arvoreEspecialidades = false;
			planningCtrl.materiais = materiais;
			planningCtrl.hh = hh;
			planningCtrl.acompanhamento = acompanhamento;
			planningCtrl.cards = cards;
			planningCtrl.resumo = resumo;

			if(materiais){
				planningCtrl.esconderArvoreAtivos();
				planningCtrl.periodoSelecionado =  planningCtrl.model.ttSprint['0'].iteracao;
				var params = planningCtrl.model.ttOrdemPeriodo.filter(filtraTTordemPeriodo)
				if(planningCtrl.carregaSaldoDepositos){
					programacaoFactory.consultaMateriaisOms(params, consultaMateriaisOmsCallback);
					planningCtrl.carregaSaldoDepositos = false;
				}

			}
			if (hh) {
				planningCtrl.esconderArvoreAtivos();
				planningCtrl.arvoreEspecialidades = true;
                planningCtrl.carregaDados = true;
				$rootScope.$emit('especialidadeProgramacaoEvent', [
								  {ttProgramacao: planningCtrl.model.ttProgramacao}
								]);
				helperSprint.data.ttSprint = planningCtrl.model.ttSprint;
			}
			else if (planningCtrl.acompanhamento) {
				planningCtrl.atualizaTamanhoScheduler();
			}
		}

		planningCtrl.obterAlturaConteudo = function() {
			return {
				height: window.innerHeight - 148 + 'px'
			};
		}

		planningCtrl.pesquisaProgramacao = function() {
			var model = planningCtrl.model;

			var modalInstance = $modal.open({
				  templateUrl: '/dts/mmi/html/sprint/programacao.search.html',
				  controller: 'mmi.sprint.ProgramacaoSearchCtrl as programacaoSearchCtrl',
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
				helperEspecialidade.data.especialidade = [];
				planningCtrl.gridMateriais = [];
				planningCtrl.exibirPagina(false, false, true, false, false);
				planningCtrl.tituloProgramacao = planningCtrl.model.ttProgramacao['cod-programac'] + ' - ' + planningCtrl.model.ttProgramacao['des-programac'];
				planningCtrl.escondeRemover = model.possuiPeriodoProgramado;
				planningCtrl.model.ttProgramacao = model.ttProgramacao;
				planningCtrl.model.ttParametros = model.ttParametros;
				planningCtrl.model.ttParametrosAux = model.ttParametrosAux;
				planningCtrl.model.ttDescricaoParametros = model.ttParametrosAux;
				planningCtrl.model.ttSprint = model.ttSprint;
				planningCtrl.arvore = [];
				planningCtrl.montaSprint();
				planningCtrl.programacaoSelecionada = true;
				planningCtrl.carregaSaldoDepositos = true;
				planningCtrl.equipSelecionado = false;
				planningCtrl.exibirArvoreAtivos();
				planningCtrl.arvoreAtivosScope.carregaArvore();
			});
		}

		planningCtrl.omsLiberadasOp = function(sprint) {

			planningCtrl.periodoSelecionado = sprint.iteracao;			

			var model = {
				'ttEquipamento': [{'cdEquipto': planningCtrl.model.ttOrdem[0].cdEquipto, 'codEstabel': planningCtrl.model.arvore[0].codEstabel}],
				'ttParametros': planningCtrl.model.ttParametrosAux,
				'ttProgramacao': planningCtrl.model.ttProgramacao,
				'ttSprint': planningCtrl.model.ttSprint,
				'ttOrdem': planningCtrl.model.ttOrdem.filter(filtraPeriodoSelecionado),
				'dtIniPeriodo': sprint.dataInicial,
				'dtFimPeriodo': sprint.dataFinal,
				'iteracao': planningCtrl.periodoSelecionado,
				'titulo': planningCtrl.valorSelecionado
			}

			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/sprint.planning.liberacao.html',
				controller: 'mmi.sprint.omsLiberadasOpCtrl as omsLiberadasOpCtrl',
				size: 'lg',
				backdrop: 'static',
				keyboard: true,
				resolve: { 
					model: function () {
						return model;
					}
				}
			});

			modalInstance.result.then(function() {
				if(planningCtrl.nivelOrdens){
					planningCtrl.arvoreAtivosScope.buscaOrdensEquipamento(planningCtrl.model.ttOrdem[0].cdEquipto);
				}else{
					planningCtrl.arvoreAtivosScope.buscaOrdensNivel(planningCtrl.model.ttNivel);
				}
			});

		}

		planningCtrl.prioridadeProgramacao = function(sprint) {
			
			planningCtrl.periodoSelecionado = sprint.iteracao;

			var model = {
				'ttOrdem': planningCtrl.model.ttOrdem.filter(filtraPeriodoSelecionado),
				'titulo' : planningCtrl.valorSelecionado
			};

			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/sprint.planning.prioridade.html',
				controller: 'mmi.sprint.PrioridadeOmCtrl as prioridadeOmCtrl',
				size: 'lg',
				backdrop: 'static',
				keyboard: true,
				resolve: { 
					model: function () {
						return model;
					}
				}
			});

			modalInstance.result.then(function() {
				if(planningCtrl.nivelOrdens){
					planningCtrl.arvoreAtivosScope.buscaOrdensEquipamento(planningCtrl.model.ttOrdem[0].cdEquipto);
				}else{
					planningCtrl.arvoreAtivosScope.buscaOrdensNivel(planningCtrl.model.ttNivel);
				}
			});

		}

		var filtraPeriodoSelecionado = function(ordem) {
			return ordem.iteracao === planningCtrl.periodoSelecionado;
		}


		planningCtrl.atualizaTamanhoScheduler = function() {
			setTimeout(function() {
				kendo.resize(document.getElementsByClassName('k-scheduler')[0]);
			},1000);
		}

		planningCtrl.exibirArvoreAtivos = function() {
			if (planningCtrl.hh) return;
			if (planningCtrl.materiais) return;
			planningCtrl.arvoreAtivos = true;
			planningCtrl.arvoreAtivosExpandida = 'my-col-md-8';
			planningCtrl.atualizaTamanhoScheduler();
		}

		planningCtrl.esconderArvoreAtivos = function() {
			planningCtrl.arvoreAtivos = false;
			planningCtrl.arvoreAtivosExpandida = 'my-col-md-11';
			planningCtrl.atualizaTamanhoScheduler();
		}

		planningCtrl.alterarData = function(ordem, sprint) {
			var ttOrdem = angular.copy(ordem);
			var model = {"ttProgramacao": planningCtrl.model.ttProgramacao,
					     "ttSprint": planningCtrl.model.ttSprint,
						 "ttOrdem": ttOrdem,
						 "ttOrdemPeriodo": planningCtrl.model.ttOrdemPeriodo,
						 "sprintSelecionada": sprint};

			var modalInstance = $modal.open({
				  templateUrl: '/dts/mmi/html/sprint/ordem/alterar.data.html',
				  controller: 'mmi.sprint.AlterarDataCtrl as alterarDataCtrl',
				  size: 'md',
				  backdrop: 'static',
				  keyboard: true,
				  resolve: { 
					model: function () {
						return model;
					}
				}
			});

			modalInstance.result.then(function(){
				angular.copy(ttOrdem, ordem);
				planningCtrl.model.ttSprint = model.ttSprint;
				planningCtrl.model.ttOrdemPeriodo = model.ttOrdemPeriodo;
				planningCtrl.ttEquipamento = [];

				if (planningCtrl.nivelOrdens) {
					if (model.ordemRemovida) {
						atualizaQuantidadeArvore(planningCtrl.arvoreAtivosScope.nivelSelecionado, -1);
					}
					
					planningCtrl.arvoreAtivosScope.buscaOrdensEquipamento(planningCtrl.model.ttOrdem[0].cdEquipto);
				} else {
					planningCtrl.arvoreAtivosScope.carregaArvore();					
				}
			});
		}

		var atualizaQuantidadeArvore = function(nivel, qtd) {
			nivel.quantidade = nivel.quantidade + (qtd);
			
			if (!nivel.pai) {
				return;
			}
			else {
				return atualizaQuantidadeArvore(nivel.pai, qtd);
			}
		}

		planningCtrl.planejarPeriodo = function(sprint) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-question',
				text: $rootScope.i18n('msg-confirm-plan'),
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				callback: function(isPositiveResult) {
					if (isPositiveResult) {
						planningCtrl.sprintSelecionada = sprint;
						var parametrosPeriodo = {
							'ttOrdemPeriodo' : planningCtrl.model.ttOrdemPeriodo.filter(filtraOrdensPeriodo),
							'ttSprint'       : sprint
						};
						programacaoFactory.planejarPeriodo(parametrosPeriodo, parametrosPeriodoCallback);
					}
				}
			});
		}

		var parametrosPeriodoCallback = function(result) {
			planningCtrl.sprintSelecionada.numIdPeriodo = result.ttSprint[0].numIdPeriodo;
			planningCtrl.sprintSelecionada.situacao     = result.ttSprint[0].situacao;
			planningCtrl.sprintSelecionada.desSituacao  = result.ttSprint[0].desSituacao;
			planningCtrl.possuiSprintEmPlanejamentoValidacao();

			if(planningCtrl.nivelOrdens){
				planningCtrl.arvoreAtivosScope.buscaOrdensEquipamento(planningCtrl.model.ttOrdem[0].cdEquipto);
			}else{
				planningCtrl.arvoreAtivosScope.buscaOrdensNivel(planningCtrl.model.ttNivel);
			}
		};
		
		planningCtrl.retornarNaoProgramado = function(sprint) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-question',
				text: $rootScope.i18n('msg-confirm-return'),
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				callback: function(isPositiveResult) {
					if (isPositiveResult) {

						planningCtrl.sprintSelecionada = sprint;
						
						programacaoFactory.retornarNaoProgramado(sprint, function(result){
							planningCtrl.sprintSelecionada.situacao     = result.ttSprint[0].situacao;
							planningCtrl.sprintSelecionada.desSituacao  = result.ttSprint[0].desSituacao;
							planningCtrl.sprintSelecionada.numIdPeriodo = result.ttSprint[0].numIdPeriodo;
							planningCtrl.escondeRemover = result.pPossuiPeriodoProgramado;
							planningCtrl.possuiSprintEmPlanejamentoValidacao();
						});
					}
				}
			});
		}

		var filtraOrdensPeriodo = function(ordem) {
			return ordem.periodo === planningCtrl.sprintSelecionada.iteracao;
		}
		
		planningCtrl.buscarBacklog = function(sprint) {
			var cdEquipto;

			if (planningCtrl.model.ttOrdem[0]) {
				cdEquipto = planningCtrl.model.ttOrdem[0].cdEquipto;
			} else {
				if (planningCtrl.model.nivelObject) {
					cdEquipto = planningCtrl.model.nivelObject.codigo;
				}
			}

			model = {"cdEquipto": cdEquipto,
					 "codEstabel": planningCtrl.model.codEstabel,
					 "ttProgramacao": planningCtrl.model.ttProgramacao,
					 "ttSprintSelecionada": sprint,
					 "ttSprint": planningCtrl.model.ttSprint,
					 "ttOrdemPeriodo": planningCtrl.model.ttOrdemPeriodo};

			var modalInstance = $modal.open({
				  templateUrl: '/dts/mmi/html/sprint/backlog/programacao.backlog.html',
				  controller: 'mmi.sprint.ProgramacaoBacklogCtrl as programacaoBacklogCtrl',
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
				planningCtrl.model.ttOrdemPeriodo = model.ttOrdemPeriodo;
				planningCtrl.arvoreAtivosScope.buscaOrdensEquipamento(planningCtrl.model.ttOrdem[0].cdEquipto);
			});
		}

		planningCtrl.removeOrdemPeriodo = function(ordem) {
			return planningCtrl.ordemSelecionada === ordem.nrOrdProdu;			
		}

		planningCtrl.executarPeriodo = function(sprint) {
			planningCtrl.sprintSelecionada = sprint;
			observacaoExecucao(sprint);
		}

		var observacaoExecucao = function(sprint) {
			var model = {
				'ttOrdemPeriodo' : planningCtrl.model.ttOrdemPeriodo.filter(filtraOrdensPeriodo),
     			'ttSprint'       : sprint,
				'ttProgramacao'  : planningCtrl.model.ttProgramacao
			}
			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/sprint.observacao.html',
				controller: 'mmi.sprint.ObservacaoExecucaoCtrl as observacaoExecucaoCtrl',
				size: 'lg',
				backdrop: 'static',
				keyboard: true,
				resolve: {
					model: function () {
						return model;
					}
				}
			});
			modalInstance.result.then(function (){
				programacaoFactory.retornaProgramacao(planningCtrl.model.ttProgramacao, retornaProgramacaoCallback);
			});

		}
		
		var retornaProgramacaoCallback = function(result) {
			if (!result) return;
			
			planningCtrl.arvoreAtivosScope.carregaArvore();
			planningCtrl.model.ttParametrosAux = result.ttParametros;
			planningCtrl.model.ttSprint = result.ttSprint;
			planningCtrl.model.ttPeriodoProgramacao = result.ttPeriodoProgramacao;
            
            angular.forEach(planningCtrl.model.ttSprint, function(sprint) {
                sprint.dataInicial = new Date(sprint.dataInicialStr);
                sprint.dataFinal = new Date(sprint.dataFinalStr);
            });
            
		}
		
		planningCtrl.obterAlturaConteudoArvore = function() {
			return {
				height: window.innerHeight - 122 + 'px',
				'padding-left': '0px', 
				'padding-right': '0px', 
				'border': '1px solid lightgray',
				'border-radius': '4px'
			}
		}

		planningCtrl.obterAlturaConteudoIcone = function() {
			return {
				height: window.innerHeight - 122 + 'px'
			}
		}

		planningCtrl.enviaOrdemBacklog = function(ordem, sprint) {
			var model = {'ttOrdem': ordem,
	     				 'ttSprint': sprint};
			
			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/ordem/retirar.programacao.html',
				controller: 'mmi.sprint.RetirarProgramacaoCtrl as retirarProgramacaoCtrl',
				size: 'md',
				backdrop: 'static',
				keyboard: true,
				resolve: {
					model: function () {
						return model;
					}
				}
			});
			
			modalInstance.result.then(function (){				
				var index = planningCtrl.model.ttOrdem.indexOf(ordem);
				planningCtrl.model.ttOrdem.splice(index, 1);
				atualizaQuantidadeArvore(planningCtrl.arvoreAtivosScope.nivelSelecionado, -1);
				sprint.qtdOrdem = sprint.qtdOrdem - 1;
				removerOrdemPeriodo(ordem.nrOrdProdu);
			});			
		}
		
		var removerOrdemPeriodo = function(nrOrdProdu) {
			for (var i=0; i <= planningCtrl.model.ttOrdemPeriodo.length; i++) {
			    if (planningCtrl.model.ttOrdemPeriodo[i].nrOrdProdu === nrOrdProdu) {
			    	planningCtrl.model.ttOrdemPeriodo.splice(i, 1);
			    	break;
			    }
			}
		}

		planningCtrl.executeProgram = function(ordem) {
			var params = [{"type": "integer", "value": 2}, // 2-Manutenção Veicular
			              {"type": "integer", "value": ordem.nrOrdProdu}];

			cProgram = "";
			cProgram = "fch/fchmip/fchmipopenprogram.p";
			msgAux = "";
			msgAux = $rootScope.i18n('l-maintenance-order') + ' - MV0301';
			planningCtrl.openProgress(cProgram, "fchmipopenprogram.p", params, msgAux);
		}
		
		planningCtrl.openProgress  = function (path, program, param, msgAux) {
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'info',
				title: $rootScope.i18n('msg-opening-program', [msgAux])
			});
			$rootScope.openProgramProgress(path, program, param);
		};

		planningCtrl.openDepositos = function(){

			planningCtrl.periodoSelecionado =  planningCtrl.model.ttSprint['0'].iteracao;
		
            var modalInstance = $modal.open({
                templateUrl: '/dts/mmi/html/sprint/materiais/open.deposito.html',
                controller: 'mmi.sprint.OpenDepositoCtrl as openDepositoCtrl',
                size: 'md',
                backdrop: 'static',
                keyboard: true,
                resolve: { 
                    model: function () {
                        return planningCtrl.model;
                    }
                }
            });

            modalInstance.result.then(function() {
				var params = planningCtrl.model.ttOrdemPeriodo.filter(filtraTTordemPeriodo);
				programacaoFactory.consultaMateriaisOms(params, consultaMateriaisOmsCallback);
            });
        }

		var consultaMateriaisOmsCallback = function(result){
			planningCtrl.gridMateriais = result;
		};

		planningCtrl.atualizaMateriais = function(){
			var params = planningCtrl.model.ttOrdemPeriodo.filter(filtraTTordemPeriodo);
			programacaoFactory.consultaMateriaisOms(params, consultaMateriaisOmsCallback);
		};


		planningCtrl.exportaMateriaisResumidoCsv = function() {

			setTimeout(function() {

				var params = {
					'ttMateriaisProgramac' :{
					'codProgramac'  : planningCtrl.model.ttProgramacao['cod-programac'],
					'descProgramac' : planningCtrl.model.ttProgramacao['des-programac'],
					'dtIniPer'      : planningCtrl.model.ttSprint[0].dataInicial,
					'dtFimPer'		: planningCtrl.model.ttSprint[0].dataFinal,
				},
				'ttMateriais': planningCtrl.gridMateriais
				};

				planningCtrl.filename = i18n('summary-list-materials', [], 'dts/mmi') + '.csv'; 

				//Busca os itens do cenário selecionado
				programacaoFactory.exportaMateriaisResumidoCsv(params, exportaCSVCallback);
				},100);
		}

		planningCtrl.exportaMateriaisTodosPeriodosResumidoCsv = function(){

			var params = {
				'ttProgramacao'  : planningCtrl.model.ttProgramacao,
			    'ttSprint'       : planningCtrl.model.ttSprint,
				'ttOrdemPeriodo' : planningCtrl.model.ttOrdemPeriodo
				
			}

			planningCtrl.filename = i18n('l-periods-summarized', [], 'dts/mmi') + '.csv'; 

			programacaoFactory.exportaMateriaisTodosPeriodosResumidoCsv(params, exportaCSVCallback);
		};	

		var exportaCSVCallback = function(result){
			mmiUtils.geraCsv(result, planningCtrl.filename); 
		}	
		
		planningCtrl.removerProgramacao = function() {
			parametros = [];
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-question',
				text: $rootScope.i18n('msg-confirm-programming-delete'),
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				callback: function(isPositiveResult) {
					if (isPositiveResult) {					
						programacaoFactory.removerProgramacao(planningCtrl.model.ttSprint, removerProgramacaoCallback);
					}
				}
			});
		}

		var removerProgramacaoCallback = function(result){

			if (result && !result.hasError) {
				helperEspecialidade.data.especialidade = [];
				planningCtrl.gridMateriais = [];
				planningCtrl.tituloProgramacao = $rootScope.i18n('l-select-programming');
				planningCtrl.model = {};
				planningCtrl.arvore = []
				planningCtrl.programacaoSelecionada = false;
				planningCtrl.carregaSaldoDepositos = false;
				planningCtrl.equipSelecionado = false;
				planningCtrl.escondeRemover = true;
			}
		}


		var filtraTTordemPeriodo = function(ordem) {
			return ordem.periodo === planningCtrl.periodoSelecionado;
		}
		
		if ($rootScope.currentuserLoaded) { this.init(); }
	    $scope.$on('$destroy', function () {
			controller = undefined;
		});
	
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
				controller.init();
		});

	}

	index.register.controller("mmi.sprint.PlanningCtrl", sprintPlanningCtrl);
	
	index.register.service('helperSprint', function(){
		return {
			data :{}
		};
	});
    index.register.service('helperEspecialidade', function(){
        return {
            data :{}
        };
    });
});
