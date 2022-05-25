define(['index'], function(index) {

	/**
	 * Controller Detail
	 */
	programacaoSearchCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'$modalInstance',
		'fchmip.programacao.Factory',
		'model'
	];

	function programacaoSearchCtrl($rootScope,
                            $scope,
                            TOTVSEvent,
							$modalInstance,
							programacaoFactory,
							model) {
		
		var programacaoSearchCtrl = this;
		
		programacaoSearchCtrl.init = function() {
            programacaoSearchCtrl.totalRecords = 0;
            programacaoSearchCtrl.listaProgramacoes = [];
			programacaoSearchCtrl.buscaProgramacoes(false);
			programacaoSearchCtrl.programacao = {};
		}

        programacaoSearchCtrl.buscaProgramacoes = function(isMore){
			var params = [];

            if (isMore){
                var startAt = programacaoSearchCtrl.listaProgramacoes.length;
				
                for(count = startAt; count < startAt + 50; count++){
                    programacaoSearchCtrl.listaProgramacoes.push(programacaoSearchCtrl.resultList[count]);
                    if (programacaoSearchCtrl.listaProgramacoes.length === programacaoSearchCtrl.totalRecords) break;
                }
            } else {
                programacaoFactory.buscaProgramacoes(params, buscaProgramacoesCallback);
			}
		}
	
		var buscaProgramacoesCallback = function(result) {
			if (!result) return;
			
			programacaoSearchCtrl.listaProgramacoes = [];
			programacaoSearchCtrl.totalRecords 	= result.length;
			programacaoSearchCtrl.resultList 	= result;
			
			for (count = 0; count < 50; count++) {
				programacaoSearchCtrl.listaProgramacoes.push(result[count]);
				if (programacaoSearchCtrl.listaProgramacoes.length === programacaoSearchCtrl.totalRecords) break;
			}
		}

		programacaoSearchCtrl.pesquisar = function() {
			if (programacaoSearchCtrl.search !== "") {
				programacaoSearchCtrl.listaProgramacoes = programacaoSearchCtrl.resultList.filter(filtro);
				programacaoSearchCtrl.totalRecords = programacaoSearchCtrl.listaProgramacoes.length;
			} else {
				programacaoSearchCtrl.buscaProgramacoes(false);
			}
		}

		var filtro = function(programac) {
			return programac['cod-programac'].toLowerCase().indexOf(programacaoSearchCtrl.search) !== -1 ||
				   programac['des-programac'].toLowerCase().indexOf(programacaoSearchCtrl.search) !== -1;  
		}

		programacaoSearchCtrl.confirma = function () {
			
			programacaoSearchCtrl.programacaoSelecionada = [];
		
			angular.forEach(programacaoSearchCtrl.listaProgramacoes, function(value) {
				if (value.selecionada) {
					model.ttProgramacao = value;
				}
			});

			programacaoFactory.retornaProgramacao(model.ttProgramacao, retornaProgramacaoCallback);
		}
		
		var retornaProgramacaoCallback = function(result) {
			if (!result) return;
			
			model.ttParametrosAux  = result.ttDescricaoParametros;
			model.ttSprint         = result.ttSprint;
			model.ttPeriodoProgramacao = result.ttPeriodoProgramacao;
			model.possuiPeriodoProgramado = result.pPossuiPeriodoProgramado;
            
            angular.forEach(model.ttSprint, function(sprint) {
                sprint.dataInicial = new Date(sprint.dataInicialStr);
                sprint.dataFinal = new Date(sprint.dataFinalStr);
            });
            
			montaParametros();
			
			programacaoSearchCtrl.fechar();
		}
		
		var montaParametros = function() {
			model.ttParametros = {};
			model.ttParametros.estabelec = montaObjetoSelecionadoVazio();
			model.ttParametros.tag = montaObjetoSelecionadoVazio();
			model.ttParametros.planejador = montaObjetoSelecionadoVazio();
			model.ttParametros.oficina = montaObjetoSelecionadoVazio();
			model.ttParametros.setor = montaObjetoSelecionadoVazio();
			model.ttParametros.tipoManut = montaObjetoSelecionadoVazio();
			model.ttParametros.modelo = montaObjetoSelecionadoVazio();
			model.ttParametros.plano = montaObjetoSelecionadoVazio();
			model.ttParametros.grupo = montaObjetoSelecionadoVazio();
			model.ttParametros.equipamento = montaObjetoSelecionadoVazio();
			
			angular.forEach(model.ttParametrosAux, function(param){
				if (param['idi-cod-param'] === 1) {
					model.ttParametros.estabelec.objSelected.push(montaObjetoSelecionado("cod-estabel", param['des-val-param'], param));
				} else if (param['idi-cod-param'] === 2) {
					model.ttParametros.tag.objSelected.push(montaObjetoSelecionado("cd-tag", param['des-val-param'], param));
				} else if (param['idi-cod-param'] === 3) {
					model.ttParametros.planejador.objSelected.push(montaObjetoSelecionado("cod-plandor", param['des-val-param'], param));
				} else if (param['idi-cod-param'] === 4) {
					model.ttParametros.oficina.objSelected.push(montaObjetoSelecionado("cod-ofici", param['des-val-param'], param));
				} else if (param['idi-cod-param'] === 5) {
					model.ttParametros.setor.objSelected.push(montaObjetoSelecionado("cod-setor-ofici", param['des-val-param'], param));
					model.ttParametros.setor.objSelected[model.ttParametros.setor.objSelected.length - 1]['_'] = {'desOficina': param['desOficina']};
				} else if (param['idi-cod-param'] === 6) {
					model.ttParametros.tipoManut.objSelected.push(montaObjetoSelecionado("cd-tipo", param['des-val-param'], param));
				} else if (param['idi-cod-param'] === 7) {
					model.ttParametros.modelo.objSelected.push(montaObjetoSelecionado("cod-model", param['des-val-param'], param));
				} else if (param['idi-cod-param'] === 8) {
					model.ttParametros.plano.objSelected.push(montaObjetoSelecionado("cod-plano", param['des-val-param'], param));
					model.ttParametros.plano.objSelected[model.ttParametros.plano.objSelected.length - 1]['_'] = {'desModelo': param['des-model']};
				} else if (param['idi-cod-param'] === 9) {
					model.ttParametros.grupo.objSelected.push(montaObjetoSelecionado("cod-grp-eqpto", param['des-val-param'], param));
				} else if (param['idi-cod-param'] === 10) {
					model.ttParametros.equipamento.objSelected.push(montaObjetoSelecionado("cod-eqpto", param['des-val-param'], param));
					model.ttParametros.equipamento.objSelected[model.ttParametros.equipamento.objSelected.length - 1]['_'] = {'desModelo': param['des-model']};
				} 
			});
			
			model.ttParametros.estabelec.size = model.ttParametros.estabelec.objSelected.length;
			model.ttParametros.tag.size = model.ttParametros.tag.objSelected.length;
			model.ttParametros.planejador.size = model.ttParametros.planejador.objSelected.length;
			model.ttParametros.oficina.size = model.ttParametros.oficina.objSelected.length;
			model.ttParametros.setor.size = model.ttParametros.setor.objSelected.length;
			model.ttParametros.tipoManut.size = model.ttParametros.tipoManut.objSelected.length;
			model.ttParametros.modelo.size = model.ttParametros.modelo.objSelected.length;
			model.ttParametros.plano.size = model.ttParametros.plano.objSelected.length;
			model.ttParametros.grupo.size = model.ttParametros.grupo.objSelected.length;
			model.ttParametros.equipamento.size = model.ttParametros.equipamento.objSelected.length;
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

		programacaoSearchCtrl.selecionaProgramacao = function(value) {
			angular.forEach(programacaoSearchCtrl.listaProgramacoes, function(programac) {
				if (programac['cod-programac'] === value['cod-programac']) {
					programac.selecionada = true;
				} else {
					programac.selecionada = false;
				}
			});
		}

		if ($rootScope.currentuserLoaded) {
				programacaoSearchCtrl.init();
		}

		programacaoSearchCtrl.fechar = function(){
			$modalInstance.close('cancel');
		}
		
		programacaoSearchCtrl.cancel = function(){
			$modalInstance.dismiss('cancel');
		}
		
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        controller.init();
	    });
	}

	index.register.controller("mmi.sprint.ProgramacaoSearchCtrl", programacaoSearchCtrl);
});
