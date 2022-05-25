define(['index'], function(index) {

	dashboardFactory.$inject = ['$totvsresource'];
	function dashboardFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/dashboard/:method/:id', {}, {
			postArray: {
				method: 'POST',
				isArray: true
			}
		});

	    factory.TOTVSPostArray = function (parameters, model, callback, headers) {
	        this.parseHeaders(headers);
	        var call = this.postArray(parameters, model);
	        return this.processPromise(call, callback);
	    };
	   
	    factory.buscaProgramacoes = function (params, callback) {
	    	return this.TOTVSPostArray({method:"buscaProgramacoes"}, params, callback);
		};
		
		factory.buscaPeriodos = function (params, callback) {
	    	return this.TOTVSPostArray({method:"buscaPeriodos"}, params, callback);
		};
		
		factory.atualizaOrdens = function (params, callback) {
	    	return this.TOTVSPost({method:"atualizaOrdens"}, params, callback);
	    };
		factory.enviaOrdemImpedimento = function (params, callback) {
	    	return this.TOTVSPost({method:"enviaOrdemImpedimento"}, params, callback);
		};

		factory.iniciarFechamentoPeriodo = function (params, callback) {
	    	return this.TOTVSPostArray({method:"iniciarFechamentoPeriodo"}, params, callback);
		};

		factory.retornaImpedimentoPeriodo = function(params, callback) {
			return this.TOTVSPostArray({method: 'retornaImpedimentoPeriodo'}, params, callback);
		}

		factory.listarOmsProgramacao = function(params, callback) {
			return this.TOTVSPostArray({method:"listarOmsProgramacao"}, params, callback);
		}
		
		factory.encerraOrdemImpedimento = function(params, callback) {
			return this.TOTVSPost({method:"encerraOrdemImpedimento"}, params, callback);
		}

		factory.retornaEstatisticaGrafico = function(params, callback) {
			return this.TOTVSPost({method:"retornaEstatisticaGrafico"}, params, callback);
		}
		
		factory.alteraDataOrdem = function(params, callback) {
			return this.TOTVSPost({method:"alteraDataOrdem"}, params, callback);
		}
		
		factory.reprogramarOrdem = function(params, callback) {
			return this.TOTVSPost({method:"reprogramarOrdem"}, params, callback);
		}

		factory.encerrarPeriodo = function(params, callback) {
			return this.TOTVSPost({method: 'encerrarPeriodo'}, params, callback);
		}
		
		factory.retirarOrdemProgramacao = function(params, callback) {
			return this.TOTVSPost({method: 'retirarOrdemProgramacao'}, params, callback);
		}

		factory.exportaVisaoOmCsv = function (params, callback, headers) {
			return this.TOTVSPost({method: 'exportaVisaoOmCsv'}, params, callback, headers);
		};
		
		factory.exportaVisaoReprogramacao = function (params, callback, headers) {
			return this.TOTVSPost({method: 'exportaVisaoReprogramacao'}, params, callback, headers);
		};

		factory.exportaMateriaisPeriodoCsv = function (params, callback, headers) {
			return this.TOTVSPost({method: 'exportaMateriaisPeriodoCsv'}, params, callback, headers);
		};

		factory.buscaInformacaoPeriodo = function (params, callback, headers) {
			return this.TOTVSPostArray({method: 'buscaInformacaoPeriodo'}, params, callback, headers);
		}

		factory.apresentaHorasEspecialid = function (params, callback) {
			return this.TOTVSPost({method: 'apresentaHorasEspecialid'}, params, callback);
		}

		factory.exportaHorasTotaisEspecialidadesCsv = function (params, callback) {
			return this.TOTVSPost({method: 'exportaHorasTotaisEspecialidadesCsv'}, params, callback);
		}	

		factory.exportaVisaoEspecialidades = function (params, callback) {
			return this.TOTVSPost({method: 'exportaVisaoEspecialidades'}, params, callback);
		}				
		
		return factory;
	}
	index.register.factory('fchmip.dashboard.Factory', dashboardFactory);
});
