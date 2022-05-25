define(['index'], function(index) {

	programacaoFactory.$inject = ['$totvsresource'];
	function programacaoFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/programacao/:method/:id', {}, {
			postArray: {
				method: 'POST',
				isArray: true
			},
			postGet: {
				method: 'GET',
				isArray: false,
				params:{
					url:'buscaMoedas'
				}
			}
		});

	    factory.TOTVSPostArray = function (parameters, model, callback, headers) {
	        this.parseHeaders(headers);
	        var call = this.postArray(parameters, model);
	        return this.processPromise(call, callback);
		};

	    factory.TOTVSPostGet = function(parameters, model, callback, headers) {
           	 this.parseHeaders(headers);
            	 var call = this.postGet(parameters, model);
           	 return this.processPromise(call, callback);
        };

	    factory.adicionar = function (params, callback) {
	    	return this.TOTVSPost({method:"adicionar"}, params, callback);
		};
		
		factory.alterar = function (params, callback) {
	    	return this.TOTVSPost({method:"alterar"}, params, callback);
	    };
	    
	    factory.carregaArvore = function (params, callback) {
	    	return this.TOTVSPost({method:"carregaArvore"}, params, callback);
	    };
	    
	    factory.buscaProgramacoes = function (params, callback) {
	    	return this.TOTVSPostArray({method:"buscaProgramacoes"}, params, callback);
		};
		
		factory.retornaProgramacao = function (params, callback) {
	    	return this.TOTVSPost({method:"retornaProgramacao"}, params, callback);
		};
	    
	    factory.buscaOrdensEquipamento = function (params, callback) {
	    	return this.TOTVSPost({method:"buscaOrdensEquipamento"}, params, callback);
	    };
	    
	    factory.alteraDataOrdem = function (params, callback) {
	    	return this.TOTVSPost({method:"alteraDataOrdem"}, params, callback);
		};
		
		factory.planejarPeriodo = function (params, callback) {
	    	return this.TOTVSPost({method:"planejarPeriodo"}, params, callback);
		};
		
		factory.buscaOrdensBacklog = function (params, callback) {
	    	return this.TOTVSPostArray({method:"buscaOrdensBacklog"}, params, callback);
		};
		
		factory.executarPeriodo = function (params, callback) {
	    	return this.TOTVSPost({method:"executarPeriodo"}, params, callback);
	    };
		factory.insereOrdensViaBacklog = function (params, callback) {
	    	return this.TOTVSPost({method:"insereOrdensViaBacklog"}, params, callback);
		};

		factory.buscaEventosBacklog = function (params, callback) {
	    	return this.TOTVSPost({method:"buscaEventosBacklog"}, params, callback);
	    };

	    factory.retornarNaoProgramado = function (params, callback) {
	    	return this.TOTVSPost({method:"retornarNaoProgramado"}, params, callback);
		};
		
		factory.insereEventosOm = function (params, callback) {
	    	return this.TOTVSPost({method:"insereEventosOm"}, params, callback);
	    };
		
		factory.criaOmEventos = function (params, callback) {
	    	return this.TOTVSPost({method:"criaOmEventos"}, params, callback);
	    };
	    
	    factory.enviaOrdemBacklog = function (params, callback) {
	    	return this.TOTVSPost({method:"enviaOrdemBacklog"}, params, callback);
		};
		
		factory.retornaDatasOm = function(params, callback) {
			return this.TOTVSPostArray({method: 'retornaDatasOm'}, params, callback);
		};

		factory.incluiOrdemNaProgramacao = function(params, callback) {
			return this.TOTVSPost({method: 'incluiOrdemNaProgramacao'}, params, callback);
		};
		
		factory.validaInclusaoOrdem = function(params, callback) {
			return this.TOTVSPost({method: 'validaInclusaoOrdem'}, params, callback);
		};
		
		factory.incluiOrdemDashboard = function(params, callback) {
			return this.TOTVSPost({method: 'incluiOrdemDashboard'}, params, callback);
		};
		
		factory.buscaEspecialidades = function(params, callback) {
			return this.TOTVSPostArray({method: 'buscaEspecialidades'}, params, callback);
		};
		
		factory.buscaHorasEspecialidade = function(params, callback) {
			return this.TOTVSPostArray({method: 'buscaHorasEspecialidade'}, params, callback);
		};

		factory.atualizaPrioridade = function(params, callback) {
			return this.TOTVSPost({method: 'atualizaPrioridade'}, params, callback);
		};

		factory.capacidadeTurnoEspecialidade = function(params, callback) {
			return this.TOTVSPostArray({method: 'capacidadeTurnoEspecialidade'}, params, callback);
		};
		
		factory.informaValorHora = function(params, callback) {
			return this.TOTVSPost({method: 'informaValorHora'}, params, callback);
		};
		
		factory.consultaMateriaisOms = function(params, callback) {
			return this.TOTVSPostArray({method: 'consultaMateriaisOms'}, params, callback);
		};

		factory.liberarOrdemManut = function(params, callback) {
			return this.TOTVSPost({method: 'liberarOrdemManut'}, params, callback);
		};

		factory.retiraLiberacaoOm = function(params, callback) {
			return this.TOTVSPost({method: 'retiraLiberacaoOm'}, params, callback);
		};

		factory.exportaMateriaisResumidoCsv = function(params, callback) {
			return this.TOTVSPost({method: 'exportaMateriaisResumidoCsv'}, params, callback);
		};

		factory.cargaOMEspecialidade = function(params, callback) {
			return this.TOTVSPostArray({method: 'CargaOMEspecialidade'}, params, callback);
		};

		factory.buscaEspecialidPeriodo = function(param, callback) {
			return this.TOTVSPostArray({method: 'buscaEspecialidPeriodo'},param, callback);
		};

		factory.exportaMateriaisTodosPeriodosResumidoCsv = function(params, callback) {
			return this.TOTVSPost({method: 'exportaMateriaisTodosPeriodosResumidoCsv'}, params, callback);
		};

		factory.exportaHistImpedimentos = function (params, callback, headers) {
            return this.TOTVSPost({method: 'exportaHistImpedimentos'}, params, callback, headers);
		};
        
        factory.exportaHistProgramacao = function (params, callback, headers) {
            return this.TOTVSPost({method: 'exportaHistProgramacao'}, params, callback, headers);
		};

		factory.piRecebeParametrosRPW = function (params, callback) {
            return this.TOTVSPost({method: 'piRecebeParametrosRPW'}, params, callback);
		};

		factory.buscaPeriodosReprogramacao = function(params, callback) {
			return this.TOTVSPostArray({method: 'buscaPeriodosReprogramacao'}, params, callback);
		};
		
		factory.editarTipoHora = function (params, callback) {
	    	return this.TOTVSPostArray({method:"editarTipoHora"}, params, callback);
	    };

		factory.editarDepositos = function (params, callback) {
	    	return this.TOTVSPost({method:"editarDepositos"}, params, callback);
		};
		
		factory.buscaParametrosDepositos = function (params, callback) {
	    	return this.TOTVSPost({method:"buscaParametrosDepositos"}, params, callback);
		};

		factory.buscaParametrosTipoHora = function (params, callback) {
	    	return this.TOTVSPost({method:"buscaParametrosTipoHora"}, params, callback);
		};

		factory.removerProgramacao = function (params, callback) {
	    	return this.TOTVSPost({method:"removerProgramacao"}, params, callback);
		};

		factory.buscaMoedas = function (callback) {
			return this.TOTVSGet({method:"buscaMoedas"}, callback);
		};

		factory.parametrosRpwOrcamento = function (params, callback) {
           	 	return this.TOTVSPost({method: 'parametrosRpwOrcamento'}, params, callback);
		};

		factory.buscaOrdensNivel = function (params, callback) {
	    	return this.TOTVSPost({method:"buscaOrdensNivel"}, params, callback);
	    };
	
		return factory;
	}

	index.register.factory('fchmip.programacao.Factory', programacaoFactory);
});