define(['index',
		'/dts/mmi/js/utils/filters.js',
		'/dts/mmi/html/sprint/especialidade/alterar-valor.js',
		'/dts/mmi/html/sprint/especialidade/tipo-hora.js',
		], function(index) {

	hhCtrl.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'fchmip.programacao.Factory',
		'$filter',
		'helperSprint',
		'$modal'
	];

	function hhCtrl($rootScope,
                    $scope,
                    TOTVSEvent,
                    programacaoFactory,
				    $filter,
				    helperSprint,
				    $modal) {
		
		hhCtrl = this;
		
		hhCtrl.init = function() {
			hhCtrl.cursor = "not-allowed";
			hhCtrl.titulo = $rootScope.i18n('l-no-specialty-selected');
			iniciaArray();
			buscaParametrosTipoHora();
			
		}
		
		hhCtrl.obterAltura = function() {
			return {
				height: (window.innerHeight - 124) + 'px'
			};
		}

		var buscaParametrosTipoHora = function(){
			    programacaoFactory.buscaParametrosTipoHora(planningCtrl.model.ttProgramacao, buscaParametrosTipoHoraCallback);
		}
		var buscaParametrosTipoHoraCallback = function(result){
			iniciaArray();
			planningCtrl.model.ttDescricaoParametros = result.ttDescricaoParametros;
			adicionaColunasPeriodo();
			adicionaHorasCapacidade();
			adicionaHorasCarga();
			adicionaHorasSaldo();
			selecionaEspecialidade(hhCtrl.especialidade);
		};



		var iniciaArray = function(){
			hhCtrl.datasPeriodo = [];
			hhCtrl.horasCapacidade = [];
			hhCtrl.totalCapacidade = [];
			hhCtrl.horasCarga = [];
			hhCtrl.totalCarga = [];
			planningCtrl.model.ttDescricaoParametros = [];
		}

        var adicionaHorasSaldo = function(){
            
            hhCtrl.saldo = [];
            hhCtrl.saldoAcumulado = [];
            
            angular.forEach(hhCtrl.colunasPeriodo, function(periodo){                
                hhCtrl.saldo.push({saldo: 0,
                                   data: periodo.data});
                hhCtrl.saldoAcumulado.push({saldo: 0,
                                            data: periodo.data});
            });
        }

		var adicionaColunasPeriodo = function() {
			hhCtrl.colunasPeriodo = [];
			
			var dataInicial;
			var dataFinal;
			
			var ttSprint = helperSprint.data.ttSprint;
			
			angular.forEach(ttSprint, function(sprint){
				if (sprint.situacao === 2) {
					if (sprint.iteracao === 1) {
						dataInicial = sprint.dataInicial;
						dataFinal = sprint.dataFinal;
					}
					if (dataFinal < sprint.dataFinal) {
						dataFinal = sprint.dataFinal;
					}					
				}
			});
			
			dataInicial = new Date(dataInicial);
			dataFinal = new Date(dataFinal);
			
			for (var d = dataInicial; d <= dataFinal; ) {
				hhCtrl.colunasPeriodo.push({data: $filter('date')(d, 'dd/MM/yy'),
					                        dataOrigem: new Date(d)});
                
                d.setDate(d.getDate() + 1);
                d.setHours(0);
                d.setMinutes(0);
                d.setSeconds(0);
			}
		}

		var adicionaHorasCapacidade = function() {
			var numId = 1;
			
			var tipoHrCapacidade = planningCtrl.model.ttDescricaoParametros.filter(function(param){
				return param['idi-cod-param'] === 11;
			});
						
			for (var i = 0; i < tipoHrCapacidade.length; i++) {
				var param = tipoHrCapacidade[i];
				numId++;
				hhCtrl.horasCapacidade.push({numId    : "x" + numId.toString() + "y",
					                         codigo   : param['des-val-param'],
					                         descricao: param['des-tip-hora'],
					                         tipoValor: param['des-tip-val'],
					                         valor    : 0,
											 canEdit  : true,
											 param 	  : 1});
			}
			
			hhCtrl.horasCapacidade.sort(orderTipoHora);
			
			hhCtrl.horasCapacidade.unshift({numId    : "x1y",
				                            codigo   : $rootScope.i18n('l-hours-shift'),
							                descricao: $rootScope.i18n('l-hours-shift'),
											tipoValor: $rootScope.i18n('l-hours'),
											valor    : "0",
											canEdit  : false});
			
			angular.forEach(hhCtrl.colunasPeriodo, function(periodo){
				
				var total = {totalPrevisto: 0,
							 dataPeriodo: periodo.data};

				angular.forEach(hhCtrl.horasCapacidade, function(capacidade){				
					hhCtrl.datasPeriodo.push({numId: capacidade.numId, 
						                      codigo: capacidade.codigo,
											  dataPeriodo: periodo.data,
											  dataOrigem: periodo.dataOrigem,
											  valorPrevisto: 0,
											  tipoValor: capacidade.tipoValor,
											  param: capacidade.param});
					total.totalPrevisto = 0;
					
				});
				hhCtrl.totalCapacidade.push(total);
				total = undefined;
			});
		}
		
		var orderTipoHora = function(a, b) {
			return a['codigo'].toUpperCase() > b['codigo'].toUpperCase();
		}
		
		var adicionaHorasCarga = function() {
			var numId = 1;
			
			var tipoHrCarga = planningCtrl.model.ttDescricaoParametros.filter(function(param){
				return param['idi-cod-param'] === 12;
			});
						
			for (var i = 0; i < tipoHrCarga.length; i++) {
				var param = tipoHrCarga[i];
				numId++;
				hhCtrl.horasCarga.push({numId    : "a" + numId.toString() + "b",
					                    codigo   : param['des-val-param'],
					                    descricao: param['des-tip-hora'],
					                    tipoValor: param['des-tip-val'],
					                    valor    : 0,
										canEdit  : true,
										param    : 2});
			}
			
			hhCtrl.horasCarga.sort(orderTipoHora);

			hhCtrl.horasCarga.unshift({numId    : "a1b",
				                       codigo   : $rootScope.i18n('l-hours-mo'),
							           descricao: $rootScope.i18n('l-hours-mo'),
									   tipoValor: $rootScope.i18n('l-hours'),
									   valor    : "0",
									   canEdit  : false});
			
			angular.forEach(hhCtrl.colunasPeriodo, function(periodo){
				var total = {totalPrevisto: 0,
							 dataPeriodo: periodo.data};

				angular.forEach(hhCtrl.horasCarga, function(carga){
					hhCtrl.datasPeriodo.push({numId: carga.numId, 
						                      codigo: carga.codigo,
											  dataPeriodo: periodo.data,
											  dataOrigem: periodo.dataOrigem,
											  valorPrevisto: 0,
											  tipoValor: carga.tipoValor,
											  param: carga.param});
					total.totalPrevisto = 0;
					
				});
				hhCtrl.totalCarga.push(total);
				total = undefined;
			});			
		}
		
		var selecionaEspecialidade = function(especialidade) {
			angular.element('totvs-editable').popover('destroy');

			if(especialidade && especialidade.codigo){
            	hhCtrl.cursor = "pointer";
                hhCtrl.especialidade = especialidade;
                hhCtrl.titulo = hhCtrl.especialidade.codigo + " - " + hhCtrl.especialidade.descricao;
                
                var params = {};
                params.ttEspecialidade = especialidade;
                params.ttSprint = helperSprint.data.ttSprint;
                
                programacaoFactory.buscaHorasEspecialidade(params, buscaHorasEspecialidadeCallback);
                
            } else {
                hhCtrl.titulo = $rootScope.i18n('l-no-specialty-selected');
            }
		}
		
		var buscaHorasEspecialidadeCallback = function(result) {
			var dataHora;
			var tipoHoraTurno = $rootScope.i18n('l-hours-shift');
			var tipoHoraCarga = $rootScope.i18n('l-hours-mo');
            
            adicionaHorasSaldo();
			
			angular.forEach(hhCtrl.datasPeriodo, function(data){
				data.valorPrevisto = 0;				
				data.valorHoraTurno = 0;
				data.valorHoraCarga = 0;
			});

			angular.forEach(hhCtrl.totalCapacidade, function(total){
				total.totalPrevisto = 0;
			});			

			angular.forEach(hhCtrl.totalCarga, function(total){
				total.totalPrevisto = 0;
			});	
			
			angular.forEach(result, function(hora){
				dataHora = hora.dataPeriodo;
				angular.forEach(hhCtrl.datasPeriodo, function(data){
					if (hora.codigoTipoHora === data.codigo &&
						dataHora === data.dataPeriodo) {
						data.valorPrevisto = hora['val-previs'];
					}
					if (hora.codigoTipoHora === tipoHoraTurno &&
					    dataHora === data.dataPeriodo) {
						data.valorHoraTurno = hora['val-previs'];
					} else if (hora.codigoTipoHora === tipoHoraCarga &&
							   dataHora === data.dataPeriodo) {
						data.valorHoraCarga = hora['val-previs'];
					}
				});

				if (hora.tipoHora === 1) {
					angular.forEach(hhCtrl.totalCapacidade, function(total){
						if (total.dataPeriodo === dataHora) {
							total.totalPrevisto = total.totalPrevisto + hora['val-previs'];
                            
                            angular.forEach(hhCtrl.saldo, function(data){
                                if(data.data === total.dataPeriodo){
                                    data.saldo = data.saldo + hora['val-previs'];
                                }
                            });                                                
						}
					});
				} else if (hora.tipoHora === 2) {
					angular.forEach(hhCtrl.totalCarga, function(total){
						if (total.dataPeriodo === dataHora) {
							total.totalPrevisto = total.totalPrevisto + hora['val-previs'];
                            
                            angular.forEach(hhCtrl.saldo, function(data){
                                if(data.data === total.dataPeriodo){
                                    data.saldo = data.saldo - hora['val-previs'];
                                }
                            });
						}
					});
				}
			});
            
            var cont = 0;
            
            angular.forEach(hhCtrl.saldoAcumulado, function(saldo){
                
                if(cont == 0){
                    saldo.saldo = hhCtrl.saldo[cont].saldo;
                } else {
                    saldo.saldo = hhCtrl.saldoAcumulado[cont - 1].saldo + hhCtrl.saldo[cont].saldo;
                }
                
                cont++;
            });
		}
		
		hhCtrl.aplicarValorHora = function(value) {
			var index = hhCtrl.datasPeriodo.indexOf(value);

			setTimeout(function() {
				var valorPrevisto = hhCtrl.datasPeriodo[index].valorPrevisto;

				var ttHorasEspecialidade = [];
				ttHorasEspecialidade.push({"tp-especial": hhCtrl.especialidade.codigo,
				 						   "codigoTipoHora": value.codigo,
										   "dat-periodo": value.dataOrigem,
										   "val-previs": valorPrevisto});

				if (valorPrevisto === "" || valorPrevisto === undefined || valorPrevisto < 0 || valorPrevisto > 99999.99) {
					selecionaEspecialidade(hhCtrl.especialidade);
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-invalid-value'),
						detail: $rootScope.i18n('msg-invalid-value', ["0", "99.999"])
					});
					return;
				}

				informaValorHora(ttHorasEspecialidade);
			}, 0);			
		}

		var informaValorHora = function(value) {
			var params = {};
			params.ttSprint = helperSprint.data.ttSprint;
			params.ttHorasEspecialidade = value;
			
			programacaoFactory.informaValorHora(params, informaValorHoraCallback);
		}
		
		var informaValorHoraCallback = function(result) {
			if (result && !result.hasError) {
				selecionaEspecialidade(hhCtrl.especialidade);

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
		            type: 'success',
                    title: $rootScope.i18n('l-backlog'),
                    detail: $rootScope.i18n('msg-value-saved-success')
		        });				
			}
		}
		
		hhCtrl.abrirConfTipoHora = function() {
			
			var model = planningCtrl.model;

			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/especialidade/tipo.hora.html',
				controller: 'mmi.sprint.TipoHoraHHCtrl as tipoHoraHHCtrl',
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
				buscaParametrosTipoHora();
				
			});

		}


		hhCtrl.alteraValor = function(value) {
			if (!hhCtrl.especialidade) return;
			angular.element('totvs-editable').popover('destroy');
			
			var model = angular.copy(value); 
			
			var modalInstance = $modal.open({
				templateUrl: '/dts/mmi/html/sprint/especialidade/alterar.valor.html',
				controller: 'mmi.sprint.AlterarValorHHCtrl as alterarValorHHCtrl',
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
				var ttHorasEspecialidade = [];
				var valorPrevisto = 0;

				angular.forEach(hhCtrl.datasPeriodo, function(data){
					if (data.numId === model.numId) {
						if (model.tipoValor === "Percentual") {							
							valorPrevisto = (data.valorHoraTurno * model.valor)	/ 100;														
						} else {
							valorPrevisto = model.valor;
						}
						
						data.valorPrevisto = valorPrevisto;

						ttHorasEspecialidade.push({"tp-especial": hhCtrl.especialidade.codigo,
													"codigoTipoHora": model.codigo,
													"dat-periodo": data.dataOrigem,
													"val-previs": valorPrevisto});						
					}
				});

				informaValorHora(ttHorasEspecialidade);
			});
		}
		
		if ($rootScope.currentuserLoaded) { this.init(); }
		
	    $scope.$on('$destroy', function () {
		});
	
		$rootScope.$on('hhProgramacaoEspecialidadeEvent', function(event, args) {
			if (hhCtrl.especialidade == args) return;
			selecionaEspecialidade(args);
		});

		$scope.$on('hhRecarregarProgramacaoEspecialidade', function(event, args) {
			selecionaEspecialidade(args);
		});
	    
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			hhCtrl.init();
		});
		
	}

	index.register.controller("mmi.sprint.HHCtrl", hhCtrl);
});
