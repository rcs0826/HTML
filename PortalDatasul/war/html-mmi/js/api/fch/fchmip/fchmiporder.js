define(['index'], function(index)  {

	fchmiporderFactory.$inject = ['$totvsresource'];
	function fchmiporderFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/fchmiporder/:method/:id', {}, {
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

	    factory.getListOrder = function (params, callback) {
	    	return this.TOTVSPost({method:"getListOrder"}, params, callback);
	    }

        factory.createOrder = function (param, callback) {
    		return this.TOTVSPostArray({method:"createOrder"}, param, callback);
    	};

    	factory.updateOrder = function (param, callback) {
    		return this.TOTVSPostArray({method:"updateOrder"}, param, callback);
    	};

    	factory.copyOrder = function (param, callback) {
    		return this.TOTVSPostArray({method:"copyOrder"}, param, callback);
    	};
    	
    	factory.suspendOrder = function (param, callback) {
    		return this.TOTVSPostArray({method:"suspendOrder"}, param, callback);
		};
		
		factory.suspendeTarefa = function (param, callback) {
    		return this.TOTVSPost({method:"suspendeTarefa"}, param, callback);
		};
		
		factory.suspendeSucessoras = function (param, callback) {
    		return this.TOTVSPost({method:"suspendeSucessoras"}, param, callback);
    	};

    	factory.reactivateOrder = function (param, callback) {
    		return this.TOTVSPostArray({method:"reactivateOrder"}, param, callback);
		};
		
		factory.reativaTarefa = function (param, callback) {
    		return this.TOTVSPost({method:"reativaTarefa"}, param, callback);
		};
		
		factory.reativaSucessoras = function (param, callback) {
    		return this.TOTVSPost({method:"reativaSucessoras"}, param, callback);
    	};
    	
        factory.getTecnicoDados = function (params, callback) {
    		return this.TOTVSPost({method:"getTecnicoDados"},params , callback);
    	};

        factory.getDadosApontamento = function (params, callback) {
    		return this.TOTVSPost({method:"getDadosApontamento"},params, callback);
    	};
    	
    	factory.deleteOrder = function (param, callback) {
    		return this.TOTVSPost({method:"deleteOrder"}, param, callback);
    	};
    	
    	factory.releaseOrder = function (param, callback) {
    		return this.TOTVSPost({method:"releaseOrder"}, param, callback);
    	};
    	
    	factory.liberaOrdensSelecionadas = function (param, callback) {
    		return this.TOTVSPost({method:"liberaOrdensSelecionadas"}, param, callback);
    	};
    	
    	factory.blockOrder = function (param, callback) {
    		return this.TOTVSPost({method:"blockOrder"}, param, callback);
    	};
    	
    	factory.bloqueiaOrdensSelecionadas = function (param, callback) {
    		return this.TOTVSPost({method:"bloqueiaOrdensSelecionadas"}, param, callback);
    	};

        factory.calculaPrioridade = function (param, callback) {
            return this.TOTVSPost({method:"calculaPrioridade"}, param, callback);
        };

        factory.buscaLocalizacao = function (param, callback) {
            return this.TOTVSPost({method:"buscaLocalizacao"}, param, callback);
        };
        
        factory.createTaskPredictive = function (param, callback) {
    		return this.TOTVSPost({method:"createTaskPredictive"}, param, callback);
    	};
    	
    	factory.updateTaskPredictive = function (param, callback) {
    		return this.TOTVSPost({method:"updateTaskPredictive"}, param, callback);
		};
		
        factory.calculaDatas = function (param, callback) {
            return this.TOTVSPost({method:"calculaDatas"}, param, callback);
        };

        factory.retornaDataInicioOrdem = function (param, callback) {
            return this.TOTVSPost({method:"retornaDataInicioOrdem"}, param, callback);
		};
		
		factory.validaSaldo = function (param, callback) {
    		return this.TOTVSPostArray({method:"validaSaldo"}, param, callback);
		};

    	factory.getOrderHistory = function (params, callback) {
	    	return this.TOTVSPostArray({method:"getOrderHistory"}, params, callback);
		};
		
    	factory.getBusinesUnitOM = function (params, callback) {
	    	return this.TOTVSPost({method:"getBusinesUnitOM"}, params, callback);
		};

		factory.getTarefaHistorico = function (params, callback) {
	    	return this.TOTVSPostArray({method:"getTarefaHistorico"}, params, callback);
	    };
		
		factory.createMatrix = function (params, callback) {
    		return this.TOTVSPost({method:"createMatrix"}, params, callback);
		};

    	factory.generatePert = function (params, callback) {
	    	return this.TOTVSPostArray({method:"generatePert"}, params, callback);
		};

		factory.consistPert = function (params, callback) {
	    	return this.TOTVSPost({method:"consistPert"}, params, callback);
		};
		
		factory.verificaUtilizacaoCCusto = function (params, callback) {
	    	return this.TOTVSPost({method:"verificaUtilizacaoCCusto"}, params, callback);
		};
		
		factory.verificaContasOrdemInvest = function (params, callback) {
	    	return this.TOTVSPost({method:"verificaContasOrdemInvest"}, params, callback);
		};
		
		factory.verificaUtilizacaoLeaveCusto = function (params, callback) {
	    	return this.TOTVSPost({method:"verificaUtilizacaoLeaveCusto"}, params, callback);
		};	

		factory.validaEstabelecimento = function (params, callback) {
	    	return this.TOTVSPost({method:"validaEstabelecimento"}, params, callback);
		};
		
		factory.closeOrder = function (params, callback) {
	    	return this.TOTVSPostArray({method:"closeOrder"}, params, callback);
		};
		
		factory.validaDataMedio = function (params, callback) {
	    	return this.TOTVSPost({method:"validaDataMedio"}, params, callback);
		};

		factory.buscaContadorAcumulado = function (params, callback) {
	    	return this.TOTVSPost({method:"buscaContadorAcumulado"}, params, callback);
		};

		factory.validaFaixaInspecao = function (params, callback) {
	    	return this.TOTVSPost({method:"validaFaixaInspecao"}, params, callback);
		};

		factory.usuarioPossuiPermissaoAceite = function (params, callback) {
	    	return this.TOTVSPost({method:"usuarioPossuiPermissaoAceite"}, params, callback);
		};

		factory.realizarAceiteTarefa = function (param, callback) {
    		return this.TOTVSPost({method:"realizarAceiteTarefa"}, param, callback);
		};

		factory.buscarAnexos = function (params, callback) {
	    	return this.TOTVSPostArray({method:"buscarAnexos"}, params, callback);
		}
		
		factory.salvarAnexos = function (params, callback) {
	    	return this.TOTVSPostArray({method:"salvarAnexos"}, params, callback);
		}

		factory.removerAnexo = function (params, callback) {
	    	return this.TOTVSPost({method:"removerAnexo"}, params, callback);
	    }
		
		return factory;
	}

	index.register.factory('fchmip.fchmiporder.Factory', fchmiporderFactory);
});
