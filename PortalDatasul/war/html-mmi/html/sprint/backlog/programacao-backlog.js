define(['index',
	     '/dts/mmi/html/sprint/ordem/ordem.manutencao.modal.js',
	     '/dts/mmi/js/utils/mmi-utils.js',
	     '/dts/mmi/js/utils/filters.js',
	     '/dts/mmi/html/order/message/order-message.js',
	     '/dts/mab/js/zoom/mmv-ord-manut.js'], function(index) {

	/**
	 * Controller Detail
	 */
	programacaoBacklogCtrl.$inject = [
		'$rootScope',
		'$scope',
		'$filter',
		'TOTVSEvent',
		'$modalInstance',
		'fchmip.programacao.Factory',
		'model',
		'$modal',
		'$timeout',
		'mmi.utils.Service',
		'helperMmvOrdManut'
	];

	function programacaoBacklogCtrl($rootScope,
									$scope,
									$filter,
									TOTVSEvent,
									$modalInstance,
									programacaoFactory,
									model,
									$modal,
									$timeout,
									mmiUtils,
									helperMmvOrdManut) {
		
		var programacaoBacklogCtrl = this;
		
		programacaoBacklogCtrl.dataInicialBusca;
		programacaoBacklogCtrl.textoBuscaEventos = '';
		programacaoBacklogCtrl.listaEventos = [];
		programacaoBacklogCtrl.listaEventosClone = [];

		programacaoBacklogCtrl.init = function() {
			programacaoBacklogCtrl.model = model;
			helperMmvOrdManut.data = model;
			programacaoBacklogCtrl.totalRecords = 0;
			programacaoBacklogCtrl.listaOrdens = [];
			inicializaFiltros();
			programacaoBacklogCtrl.carregaDatas();
			programacaoBacklogCtrl.buscaOrdens();
			programacaoBacklogCtrl.programacao = {};
			setFoco();
		}
		
		var setFoco = function() {
			$timeout(function() {
	    		$('#pesquisaOrdem').focus();
	        },500);			
		}
		
		programacaoBacklogCtrl.carregaDatas = function(){	
			milissegundos_por_dia = 1000 * 60 * 60 * 24;

			programacaoBacklogCtrl.dataInicialBusca = new Date(programacaoBacklogCtrl.model.ttSprint[0].dataInicial - 30 * milissegundos_por_dia);
			if(programacaoBacklogCtrl.model.ttSprintSelecionada.situacao === 2) {
				programacaoBacklogCtrl.dataFinalBusca = new Date(programacaoBacklogCtrl.model.ttSprintSelecionada.dataFinal);
			} else {
				programacaoBacklogCtrl.dataFinalBusca = new Date(programacaoBacklogCtrl.model.ttSprintSelecionada.dataInicial - milissegundos_por_dia);
			}
			programacaoBacklogCtrl.dataLimite = new Date(programacaoBacklogCtrl.model.ttSprintSelecionada.dataFinal);
			programacaoBacklogCtrl.dataEntrada = new Date(programacaoBacklogCtrl.model.ttSprintSelecionada.dataInicial);
			programacaoBacklogCtrl.dataTermino = new Date(programacaoBacklogCtrl.model.ttSprintSelecionada.dataInicial);
			programacaoBacklogCtrl.horaEntrada = '00:00';
			programacaoBacklogCtrl.horaTermino = '23:59';

		}

		programacaoBacklogCtrl.detalhar = function(narrativa, cabecalho) {

				programacaoBacklogCtrl.detalhe = narrativa;
				programacaoBacklogCtrl.cabecalho = cabecalho;
				
			$scope.modalInstance = $modal.open({

				templateUrl: '/dts/mmi/html/sprint/backlog/programacao.backlog.detalhe.html',
				scope: $scope,
				size: 'md'
			});
		};

		programacaoBacklogCtrl.buscaOrdens = function(){
			var params = {};

			params.ttEquipamento = {"cdEquipto": programacaoBacklogCtrl.model.cdEquipto,
									"codEstabel": programacaoBacklogCtrl.model.codEstabel};
			
			params.ttProgramacao = programacaoBacklogCtrl.model.ttProgramacao;
			params.ttSprint = programacaoBacklogCtrl.model.ttSprintSelecionada;	
			
			params.ttParametrosBacklog = {"datInicialBusca": programacaoBacklogCtrl.dataInicialBusca,										 
										  "datFinalBusca": programacaoBacklogCtrl.dataFinalBusca,
										  "tipoData": programacaoBacklogCtrl.tipoData};

			programacaoFactory.buscaOrdensBacklog(params, buscaOrdensCallback);
		}
	
		var buscaOrdensCallback = function(result) {
			programacaoBacklogCtrl.listaOrdens = [];
			
			if (result.length === 0) {
				programacaoBacklogCtrl.search = undefined;
				programacaoBacklogCtrl.pesquisarOrdem = false;
				return;
			} else {
				programacaoBacklogCtrl.pesquisarOrdem = true;
			}

			programacaoBacklogCtrl.totalRecords = result.length;
			programacaoBacklogCtrl.resultList = result;

			angular.forEach(result, function(value){
				value.nrOrdProdu = $filter('orderNumberMask')(value.nrOrdProdu);
				programacaoBacklogCtrl.listaOrdens.push(value);
			});
		}

		programacaoBacklogCtrl.ajustaDataTermino = function () {
			programacaoBacklogCtrl.dataTermino = programacaoBacklogCtrl.dataEntrada;
			programacaoBacklogCtrl.horaTermino = '23:59';
		}

		programacaoBacklogCtrl.setaFiltroAvancado = function(){
			programacaoBacklogCtrl.exibeFiltroAvancado = !programacaoBacklogCtrl.exibeFiltroAvancado;
		}
		
		programacaoBacklogCtrl.filtroAvancadoEvento = function(){
			programacaoBacklogCtrl.exibeFiltroAvancadoEvento = !programacaoBacklogCtrl.exibeFiltroAvancadoEvento;
		}
		programacaoBacklogCtrl.pesquisar = function() {
			if (programacaoBacklogCtrl.search !== undefined && programacaoBacklogCtrl.search !== "") {
				programacaoBacklogCtrl.listaOrdens = programacaoBacklogCtrl.resultList.filter(filtro);
				programacaoBacklogCtrl.totalRecords = programacaoBacklogCtrl.listaOrdens.length;
			} else {
				programacaoBacklogCtrl.buscaOrdens();
			}
		}

		var filtro = function(ordens) {
			return mmiUtils.removePontos(ordens['nrOrdProdu']).indexOf(programacaoBacklogCtrl.search) !== -1; 
		} 

		var filtroEventos = function(evento) {
			var filter = [];

			if ( programacaoBacklogCtrl.lubrificacoes ) filter.push(1);
			if ( programacaoBacklogCtrl.planosManutencoes ) filter.push(2);
			if ( programacaoBacklogCtrl.eventos ) filter.push(3);
			if ( programacaoBacklogCtrl.componentes ) filter.push(4);
			
			return filter.includes(evento['i-origem']) && 
				   (evento['cod-tarefa'].toString().toLowerCase().indexOf(programacaoBacklogCtrl.textoBuscaEventos.toLowerCase()) !== -1 || 
				    evento['cod-descri'].toString().toLowerCase().indexOf(programacaoBacklogCtrl.textoBuscaEventos.toLowerCase()) !== -1);
		} 

		programacaoBacklogCtrl.filtraEventos = function() {
			programacaoBacklogCtrl.listaEventos = programacaoBacklogCtrl.listaEventosClone.filter(filtroEventos);
		}
		
		programacaoBacklogCtrl.pesquisarEventos = function() {
			programacaoBacklogCtrl.listaEventos = programacaoBacklogCtrl.listaEventosClone.filter(filtroEventos);
		}

		programacaoBacklogCtrl.confirmarOrdens = function () {
			programacaoBacklogCtrl.model.ttOrdem = [];
			var params = {};
			var listaOrdens = [];
			
			if (programacaoBacklogCtrl.myGrid) {
				listaOrdens = programacaoBacklogCtrl.myGrid._data.filter(function(elem, index, self) {
			        return index == self.indexOf(elem);
			    });
			}

			angular.forEach(listaOrdens, function(value) {
				if (value.$selected) {
					var ordem = angular.copy(value);
					ordem.nrOrdProdu = mmiUtils.removePontos(ordem.nrOrdProdu);
					programacaoBacklogCtrl.model.ttOrdem.push(ordem);
				}
			});
			
			if (programacaoBacklogCtrl.model.ttOrdem.length === 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'warning',
                    title: $rootScope.i18n('l-off-schedule-services'),
                    detail: $rootScope.i18n('msg-select-order-period')
		        });
				return;
			}
			
			params.ttEquipamento = {"cdEquipto": programacaoBacklogCtrl.model.cdEquipto,
									"codEstabel": programacaoBacklogCtrl.model.codEstabel};

			params.ttParametrosBacklog = {"datEntr": programacaoBacklogCtrl.dataEntrada,
										  "hraEntr": programacaoBacklogCtrl.horaEntrada,
										  "datTerm": programacaoBacklogCtrl.dataTermino,
										  "hraTerm": programacaoBacklogCtrl.horaTermino,
										  "datUnicaOrdens": programacaoBacklogCtrl.dataUnicaOrdens,
										  "datInicialBusca": programacaoBacklogCtrl.dataInicialBusca,										 
					  					  "datFinalBusca": programacaoBacklogCtrl.dataFinalBusca};
			
			params.ttProgramacao  = programacaoBacklogCtrl.model.ttProgramacao;
			params.ttSprint		  = programacaoBacklogCtrl.model.ttSprintSelecionada;
			params.ttOrdemBacklog = programacaoBacklogCtrl.model.ttOrdem;	
			params.ttOrdemPeriodo = programacaoBacklogCtrl.model.ttOrdemPeriodo;	

			programacaoFactory.insereOrdensViaBacklog(params, insereOrdensViaBacklogCallback);		
		}
		
		var insereOrdensViaBacklogCallback = function(result) {
			programacaoBacklogCtrl.model.ttOrdem = result.ttOrdem;
			programacaoBacklogCtrl.model.ttSprint = result.ttSprint;
			programacaoBacklogCtrl.model.ttOrdemPeriodo = result.ttOrdemPeriodo;	
						
			angular.forEach(result.ttOrdemBacklog, function(value){
				value.nrOrdProdu = $filter('orderNumberMask')(value.nrOrdProdu);
			});
			
			if (!result.hasError) {				
				
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
                    title: $rootScope.i18n('l-off-schedule-services'),
                    detail: $rootScope.i18n('msg-orders-included-period')
		        });
			} else {
				var model = {"title": $rootScope.i18n('l-off-schedule-services'),
						     "messages": result.ttMensagemOrdem};
			
				var modalInstance = $modal.open({
		            templateUrl: '/dts/mmi/html/order/message/order.message.html',
		            controller: 'mmi.order.MessageCtrl as messageCtrl',
		            size: 'lg',
		            backdrop: 'static',
	                keyboard: true,
		            resolve: {
		            	model: function () {
		            		return model;
		            	}
		            }
				});
			}

			var removerDaLista = [];
			angular.forEach(programacaoBacklogCtrl.listaOrdens, function(value, key) {

				var ordemSelecionada = mmiUtils.removePontos(value.nrOrdProdu);

				result.ttOrdem.forEach(function(ordemSucesso){
					if (ordemSucesso.nrOrdProdu == ordemSelecionada){
						removerDaLista.push(key);
					}
				});
			});

			removerDaLista.reverse();

			removerDaLista.forEach(function(value) {
				programacaoBacklogCtrl.listaOrdens.splice(value, 1);
			});
		}
		
		programacaoBacklogCtrl.buscaEventos = function(){
			programacaoBacklogCtrl.abaEventosAberto = true;
			if (!programacaoBacklogCtrl.carregaEventos) return;
			
			var params = {};

			params.ttEquipamento = {"cdEquipto": programacaoBacklogCtrl.model.cdEquipto,
									"codEstabel": programacaoBacklogCtrl.model.codEstabel};
			params.ttProgramacao = programacaoBacklogCtrl.model.ttProgramacao;
			params.ttSprint = programacaoBacklogCtrl.model.ttSprint;

			programacaoFactory.buscaEventosBacklog(params, buscaEventosCallback);
			programacaoBacklogCtrl.carregaEventos = false;
		}
		
		var buscaEventosCallback = function(result) {
			programacaoBacklogCtrl.listaEventos = [];

			if (result && result.ttEventosBacklog.length === 0) return;
			
			programacaoBacklogCtrl.origens = ["", 
											  $rootScope.i18n('l-lubrification'), 
											  $rootScope.i18n('l-maintenance-plan'), 
											  $rootScope.i18n('l-event'), 
											  $rootScope.i18n('l-component')];
			
			angular.forEach(result.ttEventosBacklog, function(evento) {
				evento.origem = programacaoBacklogCtrl.origens[evento['i-origem']];
				programacaoBacklogCtrl.listaEventos.push(evento);
			});
			angular.copy(programacaoBacklogCtrl.listaEventos, programacaoBacklogCtrl.listaEventosClone);
			programacaoBacklogCtrl.pesquisarTarefa = programacaoBacklogCtrl.listaEventos.length > 0; 
		}

		programacaoBacklogCtrl.informaOmEvento = function(selecionado){
            var params = {};
			
			params.ttEquipamento = { "cdEquipto": programacaoBacklogCtrl.model.cdEquipto,
									 "codEstabel": programacaoBacklogCtrl.model.codEstabel};
			params.ttSprint 	    = programacaoBacklogCtrl.model.ttSprintSelecionada;
			params.ttEventosBacklog = selecionado;
			params.ttProgramacao    = programacaoBacklogCtrl.model.ttProgramacao;
			
			programacaoFactory.insereEventosOm(params, insereEventosOmCallback);
		};

         var filtraOrdemEvento = function(evento){
			 return evento.$selected === true;
		 }

		var insereEventosOmCallback = function(result) {
			if (result && !result.hasError) {
				programacaoBacklogCtrl.listaEventos = [];
				programacaoBacklogCtrl.listaEventosClone = [];
				angular.forEach(result.ttEventosBacklog, function(evento) {
					evento.origem = programacaoBacklogCtrl.origens[evento['i-origem']];
					programacaoBacklogCtrl.listaEventos.push(evento);
				});
				angular.copy(programacaoBacklogCtrl.listaEventos, programacaoBacklogCtrl.listaEventosClone);
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
                    title: $rootScope.i18n('l-off-schedule-services'),
                    detail: $rootScope.i18n('msg-tasks-included-order')
		        });				
			}
		};
		
		var filtraSelecionados = function(result) {
			var selecionado = programacaoBacklogCtrl.listaEventos.filter(filtraOrdemEvento);
			angular.forEach(selecionado, function(evento){
				evento.nrOrdProdu = programacaoBacklogCtrl.nrOrdProdu;
			});
			return selecionado;
		};

		var inicializaFiltros = function(){
			programacaoBacklogCtrl.lubrificacoes = true;
			programacaoBacklogCtrl.eventos = true;
			programacaoBacklogCtrl.planosManutencoes = true;
			programacaoBacklogCtrl.componentes = true;
			
			programacaoBacklogCtrl.acoesEvento = [{"value": 1, "label": $rootScope.i18n('l-generate-order')},
												  {"value": 2, "label": $rootScope.i18n('l-add-tasks-order')}];
			programacaoBacklogCtrl.acaoSelecionada = 1;
			
			programacaoBacklogCtrl.carregaEventos = true;

			programacaoBacklogCtrl.opcoesData = [{"value": 1, "label": $rootScope.i18n('l-enter-date')},
												 {"value": 2, "label": $rootScope.i18n('l-open-date')}];
			programacaoBacklogCtrl.tipoData	= 1;
		};

		programacaoBacklogCtrl.alteraDataUnicaOrdens = function() {
			programacaoBacklogCtrl.dataUnicaOrdens = !programacaoBacklogCtrl.dataUnicaOrdens;
		}
		
		if ($rootScope.currentuserLoaded) {
            programacaoBacklogCtrl.init();
		}

		programacaoBacklogCtrl.fechar = function(){
			helperMmvOrdManut.data = undefined;
			$modalInstance.close('cancel');
		}
		
		programacaoBacklogCtrl.fecharDetalhe = function(){
			$scope.modalInstance.close('cancel');
		}
		programacaoBacklogCtrl.cancel = function(){
			helperMmvOrdManut.data = undefined;
			$modalInstance.dismiss('cancel');
		}
		
		programacaoBacklogCtrl.gerarOrdemManutencao = function(selecionado) {
			programacaoBacklogCtrl.model.ttEventosBacklog = selecionado;
			programacaoBacklogCtrl.model.ttEquipamento =  {"cdEquipto": programacaoBacklogCtrl.model.cdEquipto,
					 									   "codEstabel": programacaoBacklogCtrl.model.codEstabel};
			
			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/ordem/ordem.manutencao.modal.html',
				controller: 'mmi.sprint.ordem.OrdemManutencaoModalCtrl as ordemManutencaoModalCtrl',
				size: 'md',
				backdrop: 'static',
				keyboard: true,
				resolve: {
					model: function () {
						return programacaoBacklogCtrl.model;
					}
				}
			});
			
			modalInstance.result.then(function(){
				buscaEventosCallback(programacaoBacklogCtrl.model.result);
			});
		}
		
		programacaoBacklogCtrl.confirmarEventos = function() {
			var selecionado = filtraSelecionados();
			
			if (!selecionado || selecionado.length === 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'warning',
                    title: $rootScope.i18n('l-off-schedule-services'),
                    detail: $rootScope.i18n('msg-no-task-selected')
		        });
				return;
			}
			
			if (programacaoBacklogCtrl.acaoSelecionada === 1) {
				programacaoBacklogCtrl.gerarOrdemManutencao(selecionado);
			} else {
				programacaoBacklogCtrl.informaOmEvento(selecionado);
			}
		}
		
		programacaoBacklogCtrl.editHraEntr = function(container, options) {
			var input = $("<input type='text' class='k-input k-textbox' " +
			  "ng-blur='programacaoBacklogCtrl.leaveHraEntr(dataItem)'>");
            input.attr('ng-model', 'hraEntr');
            input.attr('name', 'hraEntr');
            input.attr('data-bind', 'value:hraEntr');
            input.kendoMaskedTextBox({
                mask: "00:00"
            });
            input.appendTo(container);
        };
        
        programacaoBacklogCtrl.editHraTerm = function(container, options) {
			var input = $("<input type='text' class='k-input k-textbox' " +
			  "ng-blur='programacaoBacklogCtrl.leaveHraTerm(dataItem)'>");
            input.attr('ng-model', 'hraTerm');
            input.attr('name', 'hraTerm');
            input.attr('data-bind', 'value:hraTerm');
            input.kendoMaskedTextBox({
                mask: "00:00"
            });
            input.appendTo(container);
        };
        
        programacaoBacklogCtrl.leaveHraEntr = function(dataItem) {
            var strReplace = eval('/'+'_'+'/g');

            if (!dataItem.hraEntr) return;
            
            dataItem.hraEntr = dataItem.hraEntr.replace(strReplace,"");
            dataItem.hraEntr = dataItem.hraEntr.replace(":","");

            var i = dataItem.hraEntr.length;

            while(i < 4){
                dataItem.hraEntr = dataItem.hraEntr + "0";
                i++;
            }

            dataItem.hraEntr = $filter('timeMask')(dataItem.hraEntr);

            if (dataItem.hraEntr === "") {
                dataItem.hraEntr = "00:00";
            }
        };
        
        programacaoBacklogCtrl.leaveHraTerm = function(dataItem) {
            var strReplace = eval('/'+'_'+'/g');
            
            if (!dataItem.hraTerm) return;

            dataItem.hraTerm = dataItem.hraTerm.replace(strReplace,"");
            dataItem.hraTerm = dataItem.hraTerm.replace(":","");

            var i = dataItem.hraTerm.length;

            while(i < 4){
                dataItem.hraTerm = dataItem.hraTerm + "0";
                i++;
            }

            dataItem.hraTerm = $filter('timeMask')(dataItem.hraTerm);

            if (dataItem.hraTerm === "") {
                dataItem.hraTerm = "00:00";
            }
        };
        
        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
				controller.init();
		});
	}

	index.register.controller("mmi.sprint.ProgramacaoBacklogCtrl", programacaoBacklogCtrl);
	
	index.register.service('helperMmvOrdManut', function(){
		return {
			data :{}
		};
	});
	
});
