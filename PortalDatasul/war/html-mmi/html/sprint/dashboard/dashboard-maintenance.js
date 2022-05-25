define(['index',
				'/dts/mmi/html/sprint/dashboard/busca-programacao-acomp.js',
				'/dts/mmi/html/sprint/dashboard/dashboard-maintenance-grafico-classe.js',
				'/dts/mmi/html/sprint/dashboard/dashboard.maintenance.especialidades.js',
			
				'/dts/mmi/html/sprint/ordem/fechamento.impedimento.js',
				'/dts/mmi/html/sprint/dashboard/dashboard-encerramento.js',
				'/dts/mmi/html/sprint/dashboard/dashboard.period.info.js',
				'/dts/mmi/html/sprint/ordem/criar-impedimento.js',
				'/dts/mmi/html/sprint/ordem/retirar-programacao.js',
				'/dts/mmi/js/utils/filters.js',
				'/dts/mmi/js/api/fch/fchmip/dashboard.js',
				'/dts/mmi/js/factories/ordem-factories.js'
		], function(index) {
	
	dashboardMaintenanceCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'totvs.app-main-view.Service',
		'fchmip.programacao.Factory',
		'fchmip.dashboard.Factory',
		'$modal',
		'mmi.data.OrderFactory',
		'$filter',
		'helperDashBoard'
	];

	function dashboardMaintenanceCtrl($rootScope, 
								      $scope, 
									  TOTVSEvent,
									  appViewService, 
									  programacaoFactory, 
									  dashboardFactory,
									  $modal,
									  orderFactory,
									  $filter,
									  helperDashBoard) {
		dashboardCtrl = this;
		dashboardCtrl.acompanhamento = false;
		dashboardCtrl.graficos = false;
		dashboardCtrl.arvoreAtivos = true;
		dashboardCtrl.programacaoSelecionada = false;
		dashboardCtrl.tituloProgramacao = $rootScope.i18n('l-search-programming');
		dashboardCtrl.collapse = false;
		dashboardCtrl.expandido = true;
		dashboardCtrl.manutencao = [];
		dashboardCtrl.arvoreAtivosExpandida = 'my-col-md-8';
		dashboardCtrl.arvoreAtivosScope = {};
		dashboardCtrl.equipamentoTemplate = '<span data-toggle="tooltip" title="{{dataItem.descEqpto}}">{{dataItem.codEqpto}}</span>';
		dashboardCtrl.tarefaTemplate = '<span data-toggle="tooltip" title="{{dataItem.descTarefa}}">{{dataItem.codTarefa}}</span>';
		dashboardCtrl.numeroOrdemTemplate = '<span data-toggle="tooltip" title="{{dataItem.nrOrdProdu | number:0}}">{{dataItem.nrOrdProdu | number:0}}</span>';
		dashboardCtrl.motivoTemplate = '<span>{{dataItem.codMotivo + " - " + dataItem.descMotivo}}</span>';
		dashboardCtrl.listaOmsCache = [];
		dashboardCtrl.listaOmsSelecionados = [];
		dashboardCtrl.intervaloExecucoes;
		dashboardCtrl.situacaoOptions = [
			{ value: 1, label: $rootScope.i18n('l-opened'), disabled: false },
			{ value: 2, label: $rootScope.i18n('l-closed-mmi'), disabled: false },
			{ value: 0, label: $rootScope.i18n('l-all-gen'), disabled: false },
		];
		dashboardCtrl.situacaoModel = 1;
		dashboardCtrl.pnlDadosOm = [];
		dashboardCtrl.pnlDadosOmTemp = [];
		dashboardCtrl.classeGrafico = [];
		dashboardCtrl.controlPrev = false;
		dashboardCtrl.controlCorretiva = false;
		dashboardCtrl.controlPreditiva = false;
		dashboardCtrl.controlOutros = false;
	
		dashboardCtrl.scheduler = {
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
			timezone: "Etc/UTC",
			resources: [
				{
					field: 'situacao',
					title: $rootScope.i18n('l-maintenance-type'),
					dataColorField: 'color',
					dataSource: [
						{ value: 1, color: '#008A00'},  //verde
						{ value: 2, color: '#E91300' }, //vermelho
						{ value: 3, color: '#1a77ce' }, //azul
						{ value: 4, color: 'black' }    //preto
					]
				}
			]
		};

		var montaSprint = function() {
			var numDiasInterac = dashboardCtrl.arvoreModel.ttProgramacao['num-dias-interac'];

			if (numDiasInterac === 1) {
				dashboardCtrl.sprintClass = 'col-xs-12';
			} else if (numDiasInterac === 2) {
				dashboardCtrl.sprintClass = 'col-xs-6';
			} else if (numDiasInterac === 3) {
				dashboardCtrl.sprintClass = 'col-xs-4';
			} else {
				dashboardCtrl.sprintClass = 'col-xs-3';
			}
			dashboardCtrl.possuiNivelSelecionado = false;
		}

		var carregaArvoreCallback = function(result) {
			if (!result) return;
			dashboardCtrl.ttOrdemPeriodo = result.ttOrdemPeriodo;
			angular.forEach(result.ttNivel1, function(nivel){
				dashboardCtrl.arvore.push(nivel);
				angular.forEach(nivel.ttNivel2, function(nivel2){
					nivel2.pai = nivel;
					angular.forEach(nivel2.ttNivel3, function(nivel3){
						nivel3.pai = nivel2;
						angular.forEach(nivel3.ttNivel4, function(nivel4){
							nivel4.pai = nivel3;
						});
					});
				});
			});
		}

		dashboardCtrl.init = function() {
			var createTab = appViewService.startView($rootScope.i18n('l-maintenance-follow-up'), 'mmi.sprint.dashboard.DashboardMaintenanceCtrl', dashboardCtrl);
			if (createTab) {
				dashboardCtrl.expandido = true;
				dashboardCtrl.arvoreModel = {};
			} else {
				dashboardCtrl.arvoreAtivosScope.carregaArvoreNivelSelecionado();
				dashboardCtrl.atualizarTamanhoComponentesKendo('.k-chart');
			}

			dashboardCtrl.setFnExport = function (obj) {
			dashboardCtrl.exportToPdf = obj.pdf;
			dashboardCtrl.exportToPng = obj.png;	
			}

			dashboardCtrl.exibirPagina(dashboardCtrl.graficos, dashboardCtrl.acompanhamento, dashboardCtrl.cards, dashboardCtrl.hh, dashboardCtrl.impedimentos, dashboardCtrl.especialidades);
		}
	
		dashboardCtrl.ativaExecucaoAutomatica = function() {
			dashboardCtrl.intervaloExecucoes = setInterval(function() {
				dashboardCtrl.atualizaOrdens();
			}, 1800000);
		}

		dashboardCtrl.desativaExecucaoAutomatica = function() {
			clearInterval(dashboardCtrl.intervaloExecucoes);
			dashboardCtrl.intervaloExecucoes = null;
		}

		dashboardCtrl.filtraDadosImpedimento = function() {
			dashboardCtrl.listaOms = dashboardCtrl.listaOmsCache.filter(function(value) {
				if(dashboardCtrl.situacaoModel == 0) {
					return true;
				}
				return value.idiStatus == dashboardCtrl.situacaoModel;
			});

			dashboardCtrl.listaOms.forEach(function(value){
				delete value.$selected;
			})
		}

		dashboardCtrl.habilitaBtFecharImpedimento = function() {
			if (dashboardCtrl.arvoreModel.ttSprint["0"].situacao == 5)
				return true;

			var desabilitaBotao = true;

			if(!dashboardCtrl.listaOms)
				return true;
				
			for(var count=0; count < dashboardCtrl.listaOms.length; count++){
				var object = dashboardCtrl.listaOms[count];
				if(object.$selected && object.idiStatus == 2)
					return true;
				else if (object.$selected && object.idiStatus == 1) {
					desabilitaBotao = false;	
				}				
			}
			return desabilitaBotao;
		}
    
		dashboardCtrl.listarOmProgramacao = function() {
			helperDashBoard.data.ttPeriodo = dashboardCtrl.arvoreModel.ttPeriodo;
			helperDashBoard.data.ttProgramacao = dashboardCtrl.arvoreModel.ttProgramacao;
			helperDashBoard.data.ttSprint = dashboardCtrl.arvoreModel.ttSprint;
			helperDashBoard.data.periodoSelecionado = true;
			helperDashBoard.data.origem  = 'dashboard';
			window.location = "#/dts/mmi/sprint/orderlist";
		}

		dashboardCtrl.selecionaEquipamentoCallback = function() {
			var ordens = [];
			dashboardCtrl.arvoreModel.ttOrdem.forEach(function(element){
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
					maintenanceId: element['tipo'],
					timDuration: durationOrder,
					situacao: element['situacao']
				});
			});
			dashboardCtrl.scheduler.data = ordens;
			if (dashboardCtrl.arvoreModel.ttPeriodo) 
				dashboardCtrl.scheduler.startTime = new Date(dashboardCtrl.arvoreModel.ttPeriodo.dataInicial);

		}

		dashboardCtrl.informacaoSprint = function() {
			if (dashboardCtrl.programacaoSelecionada) {
				
				var ttPeriod = {
					'numIdPeriod': dashboardCtrl.arvoreModel.ttSprint[0].numIdPeriodo
				};

				dashboardFactory.buscaInformacaoPeriodo(ttPeriod, function(result) {
					$modal.open({
						templateUrl: '/dts/mmi/html/sprint/dashboard/dashboard.period.info.modal.html',
						controller: 'mmi.sprint.dashboard.InformacaoPeriodoCtrl as informacaoPeriodoCtrl',
						size: 'lg',
						backdrop: 'static',
						keyboard: true,
						resolve: {
							model: function () {
								return result[0];
							}
						}
					});
				});
				
			} else {
				dashboardCtrl.pesquisaProgramacao();
			}
		}	
		
		var retornaImpedimentoPeriodoCallback = function(result) {
			dashboardCtrl.listaOmsCache = result;
			dashboardCtrl.filtraDadosImpedimento();
		}
		
		dashboardCtrl.atualizaOrdens = function(){
			dashboardFactory.atualizaOrdens(dashboardCtrl.arvoreModel.ttSprint, atualizaOrdensCallback)
		}
		
		var atualizaOrdensCallback = function(result){
			if (!result.pUltimaAtualizacao != undefined ){
				dashboardCtrl.ultimaAtualizacao = result.pUltimaAtualizacao;
				angular.forEach(result.ttOrdem, function(ordem){
					for (var i=0; i<dashboardCtrl.arvoreModel.ttOrdem.length; i++) {
						if (ordem.numIdOrd === dashboardCtrl.arvoreModel.ttOrdem[i].numIdOrd) {
							dashboardCtrl.arvoreModel.ttOrdem[i].idiStatus = ordem.idiStatus;
							dashboardCtrl.arvoreModel.ttOrdem[i].estado = ordem.estado;
							dashboardCtrl.arvoreModel.ttOrdem[i].desEstado = ordem.desEstado;
							break;
						}
					}
				});
			}	
		}

		var retornaEstatisticaGraficoCallback = function(result) {

			var previsto = { name: $rootScope.i18n('l-forecasted'), data: [], labels: {visible: true}};
			var previstoRealizado = { name: $rootScope.i18n('l-forecasted-fulfilled'), data: [], labels: {visible: true}};
			var programado = { name: $rootScope.i18n('l-scheduled'), data: [], labels: {visible: true}};
			var programadoRealizado = { name: $rootScope.i18n('l-scheduled-fulfilled'), data: [], labels: {visible: true}};
			
			dashboardCtrl.pnlDadosOm = [];
			dashboardCtrl.classeGrafico = [];

			dashboardCtrl.controlPrev = false;
			dashboardCtrl.controlCorretiva = false;
			dashboardCtrl.controlPreditiva = false;
			dashboardCtrl.controlOutros = false;

			result.ttEstatisticaGrafico.forEach(function(dadosOm) {
				dashboardCtrl.pnlDadosOm.push(
					{ 'estatistica': dadosOm.desTipo, 
						'previsto': dadosOm['nr-previsto'],
						'previsto-realizado': dadosOm['nr-previsto-realizado'],
						'perc-previsto-realizado': dadosOm['perc-previsto-realizado'],
						'programado': dadosOm['nr-programado'],
						'programado-realizado': dadosOm['nr-programado-realizado'],
						'perc-programado-realizado': dadosOm['perc-programado-realizado'],
						'classe': false,
						'tipo': dadosOm.tipo
					}
				);
			});

			result.ttClasseGrafico.forEach(function(dadosOm) {
				dashboardCtrl.classeGrafico.push(
					{ 'estatistica': dadosOm.desClasse, 
					'previsto': dadosOm['nr-previsto'],
					'previsto-realizado': dadosOm['nr-previsto-realizado'],
					'perc-previsto-realizado': dadosOm['perc-previsto-realizado'],
					'programado': dadosOm['nr-programado'],
					'programado-realizado': dadosOm['nr-programado-realizado'],
					'perc-programado-realizado': dadosOm['perc-programado-realizado'],
					'tipo': dadosOm.tipo,
					'classe': true
					}
				);
			});

			dashboardCtrl.pnlDadosOm.forEach(function(dadosOmGrafico) {
				previsto.data.push([dadosOmGrafico.previsto, 0]);
                previstoRealizado.data.push([dadosOmGrafico['previsto-realizado'], 0]);
				programado.data.push([dadosOmGrafico.programado, 0]);
				programadoRealizado.data.push([dadosOmGrafico['programado-realizado'], 0]);
				dashboardCtrl.manutencaoCategories[0].categories.push(dadosOmGrafico.estatistica);
			});

			dashboardCtrl.manutencao = [];
			dashboardCtrl.manutencao.push(previsto);
            dashboardCtrl.manutencao.push(previstoRealizado);
			dashboardCtrl.manutencao.push(programado);
			dashboardCtrl.manutencao.push(programadoRealizado);
			dashboardCtrl.manutencaoValueAxis = {
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

		};

		dashboardCtrl.classType = function(tipo) {
			if(tipo === 1) {
				dashboardCtrl.controlPrev = !dashboardCtrl.controlPrev;
				dashboardCtrl.controlCorretiva = false;
				dashboardCtrl.controlPreditiva = false;
				dashboardCtrl.controlOutros = false;
			}

			if(tipo === 2) {
				dashboardCtrl.controlPrev = false;
				dashboardCtrl.controlCorretiva = !dashboardCtrl.controlCorretiva;
				dashboardCtrl.controlPreditiva = false;
				dashboardCtrl.controlOutros = false;
			}

			if(tipo === 3) {
				dashboardCtrl.controlPrev = false;
				dashboardCtrl.controlCorretiva = false;
				dashboardCtrl.controlPreditiva = !dashboardCtrl.controlPreditiva;
				dashboardCtrl.controlOutros = false;
			}
			if(tipo === 4) {
				dashboardCtrl.controlPrev = false;
				dashboardCtrl.controlCorretiva = false;
				dashboardCtrl.controlPreditiva = false;
				dashboardCtrl.controlOutros = !dashboardCtrl.controlOutros;
			}

			dashboardCtrl.listClass();
		}

		dashboardCtrl.exibirGraficoPorClasse = function(dataItem) {
			var dadosGrafico = [];
			dashboardCtrl.classeGrafico.forEach(function(item) {
				if(item.tipo === dataItem.tipo)
					dadosGrafico.push(item);
			});
			dadosGrafico.push(dataItem);
			var model = dadosGrafico;

			$modal.open({
				  templateUrl: '/dts/mmi/html/sprint/dashboard/dashboard.maintenance.graficos.classe.html',
					size: 'lg',
					controller: 'mmi.sprint.dashboard.DsbGraficoClasse as dsbGraficoClasse',
				  backdrop: 'static',
				  keyboard: true,
				  resolve: { 
						model: function () {
							return model;
						}
				  }
			});
		}

		dashboardCtrl.listClass = function(){
			dashboardCtrl.pnlDadosOmTemp = dashboardCtrl.pnlDadosOm;
			dashboardCtrl.pnlDadosOm = [];
			dashboardCtrl.pnlDadosOmTemp.forEach(function(ordem) {
				//Preventiva
				if (ordem.estatistica === "Preventiva" && dashboardCtrl.controlPrev) {
					dashboardCtrl.pnlDadosOm.push(ordem);
					dashboardCtrl.classeGrafico.forEach(function(item) {
						if(item.tipo === 1) dashboardCtrl.pnlDadosOm.push(item);
					});

					return;
				}
				
				//Corretiva
				if (ordem.estatistica === "Corretiva" && dashboardCtrl.controlCorretiva) {
					dashboardCtrl.pnlDadosOm.push(ordem);
					dashboardCtrl.classeGrafico.forEach(function(item) {
						if(item.tipo === 2) dashboardCtrl.pnlDadosOm.push(item);
					});

					return;
				}

				//Preditiva
				if (ordem.estatistica === "Preditiva" && dashboardCtrl.controlPreditiva) {
					dashboardCtrl.pnlDadosOm.push(ordem);
					dashboardCtrl.classeGrafico.forEach(function(item) {
						if(item.tipo === 3) dashboardCtrl.pnlDadosOm.push(item);
					});

					return;
				}

				//Outros
				if (ordem.estatistica === "Outros" && dashboardCtrl.controlOutros) {
					dashboardCtrl.pnlDadosOm.push(ordem);
					dashboardCtrl.classeGrafico.forEach(function(item) {
						if(item.tipo === 4) dashboardCtrl.pnlDadosOm.push(item);
					});

					return;
				}

				if (!ordem.classe) dashboardCtrl.pnlDadosOm.push(ordem);
			});
		};
	
		dashboardCtrl.carregaPainelOms = function() {
			dashboardFactory.retornaEstatisticaGrafico(dashboardCtrl.arvoreModel.ttSprint, retornaEstatisticaGraficoCallback);

			dashboardCtrl.manutencaoCategories = [{
				categories:[],
				labels: {
					visible: true,
					rotation: 'auto'
				}
			}];

		}

		dashboardCtrl.pesquisaProgramacao = function() {
			
			var model = dashboardCtrl.arvoreModel;

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
				dashboardCtrl.selecionaNivelOrdem();
				dashboardCtrl.tituloProgramacao = dashboardCtrl.arvoreModel.ttProgramacao['cod-programac'] + 
										  ' - ' + dashboardCtrl.arvoreModel.ttProgramacao['des-programac'] +
									 	  " - "   + $filter('date')(model.ttSprint.dataInicial,'dd/MM/yyyy') + 
									 	  " " + $rootScope.i18n('l-to') + " " + $filter('date')(model.ttSprint.dataFinal,'dd/MM/yyyy')
				dashboardCtrl.arvoreModel.ttProgramacao = model.ttProgramacao;
				dashboardCtrl.arvoreModel.ttSprint = model.ttSprint;
				dashboardCtrl.arvoreModel.ttPeriodoProgramacao = model.ttPeriodoProgramacao;
				dashboardCtrl.arvore = [];
				montaSprint();
				
				dashboardCtrl.programacaoSelecionada = true;
				dashboardCtrl.exibirArvoreAtivos();
				dashboardCtrl.arvoreAtivosScope.carregaArvore();
				if(model.ttSprint.situacao != 5){
					dashboardCtrl.atualizaOrdens();
				}
				dashboardCtrl.exibirPagina(false, false, true, false, false);
			});
		}

		dashboardCtrl.selecionaNivelOrdem = function() {
			if (!dashboardCtrl.cards && !dashboardCtrl.acompanhamento) {
				dashboardCtrl.exibirPagina(false, false, true, false, false);
			}
		}

		dashboardCtrl.selecionaNivelResumo = function() {
			dashboardCtrl.selecionaNivelOrdem();
			dashboardCtrl.arvoreModel.ttOrdem.length = 0;
		}

		dashboardCtrl.atualizarTamanhoComponentesKendo = function(className) {
			setTimeout(function() {
				document.querySelectorAll(className).forEach(function(element){
						kendo.resize(element);
				});
			}, 100);
		}

		dashboardCtrl.validaTamanhoFonte = function(classe) {
			if (!classe) {
				return {
					'font-weight': 600
				};
			}
		}

		dashboardCtrl.exibirArvoreAtivos = function() {
			if (dashboardCtrl.impedimentos || dashboardCtrl.graficos ||dashboardCtrl.especialidades) {
				return;
			}
			dashboardCtrl.arvoreAtivos = true;
			dashboardCtrl.especialidades = false;
			dashboardCtrl.arvoreAtivosExpandida = 'my-col-md-8';
			if(dashboardCtrl.hh) {
				dashboardCtrl.exibirPagina(false, false, true, false, false);
			}
			dashboardCtrl.atualizarTamanhoComponentesKendo('.k-chart');
			dashboardCtrl.atualizarTamanhoComponentesKendo('.k-scheduler');
		}

		dashboardCtrl.esconderArvoreAtivos = function() {
			dashboardCtrl.arvoreAtivos = false;
			dashboardCtrl.arvoreAtivosExpandida = 'my-col-md-11';
			dashboardCtrl.atualizarTamanhoComponentesKendo('.k-chart');
			dashboardCtrl.atualizarTamanhoComponentesKendo('.k-scheduler');
		}

		dashboardCtrl.graficosSelecionado = function() {
			if(dashboardCtrl.graficos) return dashboardCtrl.cssPaginaSelecionada();
		}

		dashboardCtrl.hhSelecionado = function() {
			if(dashboardCtrl.hh) return dashboardCtrl.cssPaginaSelecionada();
		}

		dashboardCtrl.cardsSelecionado = function() {
			if(dashboardCtrl.cards) return dashboardCtrl.cssPaginaSelecionada();
		}

		dashboardCtrl.impedimentosSelecionado = function() {
			if(dashboardCtrl.impedimentos) return dashboardCtrl.cssPaginaSelecionada();
		}

		dashboardCtrl.acompanhamentoSelecionado = function() {
			if(dashboardCtrl.acompanhamento) return dashboardCtrl.cssPaginaSelecionada();
		}

		dashboardCtrl.especialidadesSelecionado = function() {
			if(dashboardCtrl.especialidades) return dashboardCtrl.cssPaginaSelecionada();
		}

		dashboardCtrl.cssPaginaSelecionada = function() {
			return {
				'background-color': '#e6e6e6'
			}
		}

		dashboardCtrl.atualizaTamanhoScheduler = function() {
			setTimeout(function() {
				kendo.resize(document.getElementsByClassName('k-scheduler')[0]);
			},1000);
		}

		dashboardCtrl.selecionaEspecialidade = function($event, especialidade) {
			var els = document.getElementsByClassName('div-nivel1');
			Array.prototype.forEach.call(els, function(el) {
				$(el).removeClass('nivel-selecionado');
			});
			$(event.target).addClass('nivel-selecionado');

//********************************************************************** 
//Aqui pode ser adicionado a chamada do progress que irá buscar os dados
// do homem hora.
//**********************************************************************
		}

		dashboardCtrl.exibeArvoreEspecialidades = function(hh, cards, acompanhamento) {
      
			if (dashboardCtrl.hh && !dashboardCtrl.arvoreAtivos) {
			  if (dashboardCtrl.especialidades) {
					dashboardCtrl.especialidades = false;
					dashboardCtrl.arvoreAtivosExpandida = 'my-col-md-11';
			  } else {
					dashboardCtrl.especialidades = true;
					dashboardCtrl.arvoreAtivosExpandida = 'my-col-md-8';
			  }
			  dashboardCtrl.atualizarTamanhoGraficos();
			  return;
			} else {
			  // Funcionalidade de abrir e fechar a aba do Homem Hora
			  if (hh) {
					dashboardCtrl.especialidades = true;
					dashboardCtrl.arvoreAtivos = false;
					dashboardCtrl.arvoreAtivosExpandida = 'my-col-md-8';
					dashboardCtrl.atualizarTamanhoGraficos();
			  } else {
					dashboardCtrl.especialidades = false;
					dashboardCtrl.arvoreAtivos = true;
			  }
			}
		}

		dashboardCtrl.exibirPagina = function(graficos, acompanhamento, cards, hh, impedimentos, especialidades) {
			
			// Bloqueia os icones quando não tiver nenhuma equipamento selecionado.
			if (acompanhamento && dashboardCtrl.arvoreModel.ttOrdem.length == 0) {
				return;
			}

			//Trata a exibição da arvore de especialidades
			if (!cards && !acompanhamento) {
				dashboardCtrl.exibeArvoreEspecialidades(hh,cards, acompanhamento);
			} else {
				if (dashboardCtrl.arvoreAtivos) {
					dashboardCtrl.arvoreAtivosExpandida = 'my-col-md-8';
				} else {
					dashboardCtrl.arvoreAtivosExpandida = 'my-col-md-11';
				}
			}

			dashboardCtrl.graficos = graficos;
			dashboardCtrl.acompanhamento = acompanhamento;
			dashboardCtrl.cards = cards;
			dashboardCtrl.hh = hh;
			dashboardCtrl.especialidades = especialidades;
			dashboardCtrl.arvoreEspecialidades = false;
			dashboardCtrl.impedimentos = impedimentos;
			if (dashboardCtrl.acompanhamento) {
				dashboardCtrl.atualizaTamanhoScheduler();
			}

			if (dashboardCtrl.impedimentos) {
				// Carrega as ordens em impedimentos
				dashboardFactory.retornaImpedimentoPeriodo(dashboardCtrl.arvoreModel.ttSprint, retornaImpedimentoPeriodoCallback);
				dashboardCtrl.esconderArvoreAtivos();
			} else if (dashboardCtrl.graficos) {
				dashboardCtrl.esconderArvoreAtivos();
				dashboardCtrl.carregaPainelOms();
				dashboardCtrl.atualizarTamanhoComponentesKendo();
			} else if (dashboardCtrl.especialidades) {
				dashboardCtrl.esconderArvoreAtivos();
				dashboardCtrl.arvoreEspecialidades = true;
				dashboardCtrl.atualizarTamanhoComponentesKendo();
				dashboardCtrl.carregaDados = true;
				$rootScope.$broadcast('especialidadeAcompanhamentoEvent', [
					{ttSprint: dashboardCtrl.arvoreModel.ttSprint,
					 ttProgramacao: dashboardCtrl.arvoreModel.ttProgramacao}
				  ]);
			}
		}

		dashboardCtrl.iniciarFechamentoPeriodo = function() {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-question',
				text: $rootScope.i18n('msg-confirm-closing-schedule'),
				cancelLabel: 'l-no',
				confirmLabel: 'l-yes',
				callback: function(isPositiveResult) {
					if (isPositiveResult) {
						var ttSprint = dashboardCtrl.arvoreModel.ttSprint;
						dashboardFactory.iniciarFechamentoPeriodo(ttSprint, iniciarFechamentoPeriodoCallback);
					}
				}
			});
		}

		var iniciarFechamentoPeriodoCallback = function(result) {			
			dashboardCtrl.arvoreModel.ttSprint["0"].situacao  = result[0].situacao;
			dashboardCtrl.arvoreModel.ttSprint["0"].desSituacao = result[0].desSituacao;
			dashboardCtrl.arvoreModel.ttPeriodo.statusPeriodo = result[0].situacao;
			dashboardCtrl.atualizaOrdens();
		};
		dashboardCtrl.encerraPeriodo = function() {
			var model = {
				 'ttSprint': dashboardCtrl.arvoreModel.ttSprint
			}
			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/dashboard/dashboard.encerramento.html',
				controller: 'mmi.sprint.dashboard.ObservacaoEncerramentoCtrl as observacaoEncerramentoCtrl',
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
				dashboardCtrl.arvoreModel.ttSprint  = model.ttSprint;

				dashboardCtrl.arvoreAtivosScope.carregaArvore();				
			});

		}
		
		dashboardCtrl.incluiOrdemDashboard = function() {
			var model = {
				'ttProgramacao': dashboardCtrl.arvoreModel.ttProgramacao,
				'ttSprint': dashboardCtrl.arvoreModel.ttSprint,
				'isDashboard': true
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
				dashboardCtrl.arvoreAtivosScope.carregaArvore();
			});
		}
		
		dashboardCtrl.criarImpedimento = function(ordem) {
			var ttOrdem = angular.copy(ordem);
			var model = {"nrOrdProdu": ttOrdem.nrOrdProdu,
						 "numIdOrd": ttOrdem.numIdOrd};

			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/ordem/criar.impedimento.html',
				controller: 'mmi.sprint.CriarImpedimentoCtrl as criarImpedimentoCtrl',
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
				dashboardCtrl.arvoreAtivosScope.buscaOrdensEquipamento(ttOrdem.cdEquipto);
			});
		}

        dashboardCtrl.executeProgram = function(ordem) {
			var params = [{"type": "integer", "value": 2}, // 2-Manutenção Veicular
			              {"type": "integer", "value": ordem.nrOrdProdu}];

			cProgram = "";
			cProgram = "fch/fchmip/fchmipopenprogram.p";
			msgAux = "";
			msgAux = $rootScope.i18n('l-maintenance-order') + ' - MV0301';
			dashboardCtrl.openProgress(cProgram, "fchmipopenprogram.p", params, msgAux);
		}
		
		dashboardCtrl.openProgress  = function (path, program, param, msgAux) {
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'info',
				title: $rootScope.i18n('msg-opening-program', [msgAux])
			});
			$rootScope.openProgramProgress(path, program, param);
		};

		dashboardCtrl.carregaArvore = function() {
			dashboardCtrl.arvore = [];
			dashboardCtrl.ttResumo = [];
			dashboardCtrl.ttEquipamento = [];
			dashboardCtrl.arvoreModel.ttOrdem = [];
			dashboardCtrl.ttOrdemPeriodo = [];
			dashboardCtrl.collapse = false;
			dashboardCtrl.nivelSelecionado = undefined;
			dashboardCtrl.possuiNivelSelecionado = false;
			programacaoFactory.carregaArvore(dashboardCtrl.arvoreModel, carregaArvoreCallback);
		}

		dashboardCtrl.alterarData = function(ordem, sprint) {
			var ttOrdem = angular.copy(ordem);
			var model = {"ttProgramacao": dashboardCtrl.arvoreModel.ttProgramacao,
					     "ttSprint": dashboardCtrl.arvoreModel.ttSprint,
						 "ttOrdem": ttOrdem,
						 "ttOrdemPeriodo": dashboardCtrl.arvoreModel.ttOrdemPeriodo,
						 "sprintSelecionada": sprint,
						 "origem": "dashboard"};

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
				dashboardCtrl.arvoreModel.ttSprint = model.ttSprint;
				dashboardCtrl.arvoreModel.ttOrdemPeriodo = model.ttOrdemPeriodo;

				if (model.ordemRemovida) {
					atualizaQuantidadeArvore(dashboardCtrl.arvoreAtivosScope.nivelSelecionado, -1);
				}

				dashboardCtrl.arvoreAtivosScope.buscaOrdensEquipamento(ordem.cdEquipto);				
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

		function obterAlturaArvoreEspecialidades() {
			return {
				height: (window.innerHeight - 224) + 'px',
				'overflow-y': 'scroll'
			};
		}

		dashboardCtrl.obterAlturaAcompanhamento = function() {
			return window.innerHeight - 124;
		}

		dashboardCtrl.obterAlturaGridImpedimentos = function() {
			return window.innerHeight - 180;
		}

		dashboardCtrl.obterAlturaDivSprint = function() {
			return {
				height: (window.innerHeight - 145) + 'px'
			};
		}

		dashboardCtrl.obterAlturaConteudo = function() {
			return {
				height: window.innerHeight - 122 + 'px'
			};
		}

		dashboardCtrl.obterAlturaConteudoArvore = function() {
			return {
				height: window.innerHeight - 122 + 'px',
				'padding-left': '0px', 
				'padding-right': '0px', 
				'border': '1px solid lightgray',
				'border-radius': '4px'
			}
		}

		dashboardCtrl.fecharImpedimento = function() {
			var model = {
				'user': $rootScope.currentuser,
				'oms': dashboardCtrl.listaOmsSelecionados
			};

			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/ordem/fechamento.impedimento.html',
				controller: 'mmi.sprint.ordem.FechamentoImpedimentoCtrl as fechamentoImpedimentoCtrl',
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
				dashboardFactory.retornaImpedimentoPeriodo(dashboardCtrl.arvoreModel.ttSprint, retornaImpedimentoPeriodoCallback);
				dashboardCtrl.atualizaOrdens();
			});
		}
		
		dashboardCtrl.retirarOrdemProgramacao = function(ordem, sprint) {
			var model = {'ttOrdem': ordem,
					     'isDashboard': true};
		
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
				var index = dashboardCtrl.arvoreModel.ttOrdem.indexOf(ordem);
				dashboardCtrl.arvoreModel.ttOrdem.splice(index, 1);
				atualizaQuantidadeArvore(dashboardCtrl.arvoreAtivosScope.nivelSelecionado, -1);
				sprint.qtdOrdem = sprint.qtdOrdem - 1;
			});
		}

		dashboardCtrl.abrirObservacaoImpedimento = function(value) {
			dashboardCtrl.desObsImpedimento = value.desObs;

			$scope.modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/dashboard/dashboard.maintenance.obs-impedimentos.html',
				scope: $scope,
				size: 'md'
			});
		};
			
		dashboardCtrl.fecharObservacaoImpedimento = function(){
			$scope.modalInstance.close('cancel');
		}


		if ($rootScope.currentuserLoaded) { 
			this.init();
		}
	
		$scope.$on('$destroy', function () {
			controller = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});

  }

  index.register.controller('mmi.sprint.dashboard.DashboardMaintenanceCtrl', dashboardMaintenanceCtrl);
	index.register.service('helperDashBoard', function(){
		return {
			data :{}
		};
	});
  
});
