define(['index'], function(index) {

	cfapi004Factory.$inject = ['$totvsresource'];	
	function cfapi004Factory($totvsresource) {

/*************************************/

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/cfp/cfapi004/:method/:id', {}, {
			postArray: { 
				method: 'POST',
				isArray: true
			},
			postObject: {
				method: 'POST',
				isArray: false
			}
		});

		factory.TOTVSPostArray = function (parameters, model, callback, headers) {
			this.parseHeaders(headers);
			var call = this.postArray(parameters, model);
			return this.processPromise(call, callback);
		};
		factory.TOTVSPostObject = function (parameters, model, callback, headers) {
			this.parseHeaders(headers);
			var call = this.postObject(parameters, model);
			return this.processPromise(call, callback);
		};

    	factory.getModeloCFG = function (param, callback) {
    		return this.TOTVSPostObject({method:"piGetModeloCFG"}, param, callback);
    	};

    	factory.inicializaConfig = function (param, callback) {
    		return this.TOTVSPostObject({method:"piInicializaConfig"}, param, callback);
    	};

    	factory.iniciaEdicaoTreeView = function (param, callback) {
    		return this.TOTVSPostObject({method:"piIniciaEdicaoTreeView"}, param, callback);
    	};

    	factory.confirmaEdicaoDec = function (param, callback) {
    		return this.TOTVSPostObject({method:"piConfirmaEdicaoDec"}, param, callback);
    	};

    	factory.confirmaEdicaoChr = function (param, callback) {
    		return this.TOTVSPostObject({method:"piConfirmaEdicaoChr"}, param, callback);
    	};

    	factory.navegaConfig = function (param, callback) {
    		return this.TOTVSPostObject({method:"piNavegaConfig"}, param, callback);
    	};

    	factory.gravaConfiguracao = function (param, callback) {
    		return this.TOTVSPostObject({method:"piGravaConfiguracao"}, param, callback);
		};
		
    	factory.listaRecords = function (param, callback) {
    		return this.TOTVSPostObject({method:"piListaRecords"}, param, callback);
    	};

    	factory.listaPendenciaRecords = function (param, callback) {
    		return this.TOTVSPostObject({method:"piListaPendenciaRecords"}, param, callback);
    	};

    	factory.openStructure = function (param, callback) {
    		return this.TOTVSPostArray({method:"piOpenStructure"}, param, callback);
    	};

    	factory.openRouting = function (param, callback) {
    		return this.TOTVSPostArray({method:"piOpenRouting"}, param, callback);
    	};

    	factory.toSuspendReative = function (param, callback) {
    		return this.TOTVSPostArray({method:"piToSuspendReative"}, param, callback);
    	};

    	factory.deleteConfiguration = function (param, callback) {
    		return this.TOTVSPostArray({method:"piDeleteConfiguration"}, param, callback);
		};
		
    	factory.deletePending = function (param, callback) {
    		return this.TOTVSPostArray({method:"piDeletePending"}, param, callback);
    	};

    	factory.validateStructure = function (param, callback) {
    		return this.TOTVSPostObject({method:"piValidateStructure"}, param, callback);
    	};

    	factory.approveStructure = function (param, callback) {
    		return this.TOTVSPostArray({method:"piApproveStructure"}, param, callback);
		};
		
    	factory.validateRouting = function (param, callback) {
    		return this.TOTVSPostObject({method:"piValidateRouting"}, param, callback);
    	};
    	factory.approveRouting = function (param, callback) {
    		return this.TOTVSPostArray({method:"piApproveRouting"}, param, callback);
    	};
    	factory.exportToOrderValid = function (param, callback) {
    		return this.TOTVSPostObject({method:"piExportToOrderValid"}, param, callback);
		};
    	factory.exportToOrder = function (param, callback) {
    		return this.TOTVSPostArray({method:"piExportToOrder"}, param, callback);
    	};
    	factory.recuperaConfiguracao = function (param, callback) {
    		return this.TOTVSPostObject({method:"piRecuperaConfiguracao"}, param, callback);
		};
    	factory.exibeEstruturaDetalhe = function (param, callback) {
    		return this.TOTVSPostArray({method:"piExibeEstruturaDetalhe"}, param, callback);
		};
    	factory.exibeVariaveisCustos = function (param, callback) {
    		return this.TOTVSPostObject({method:"piExibeVariaveisCustos"}, param, callback);
		};
    	factory.exportaParaPedidos = function (param, callback) {
    		return this.TOTVSPostArray({method:"piExportaParaPedidos"}, param, callback);
		};
    	factory.pendingProductDetail = function (param, callback) {
    		return this.TOTVSPostArray({method:"piPendingProductDetail"}, param, callback);
		};
    	factory.confirmConfiguration = function (param, callback) {
    		return this.TOTVSPostArray({method:"piConfirmConfiguration"}, param, callback);
		};
    	factory.createCotRelat = function (param, callback) {
    		return this.TOTVSPostArray({method:"piCreateCotRelat"}, param, callback);
		};
    	factory.validConfiguration = function (param, callback) {
    		return this.TOTVSPostArray({method:"piValidConfiguration"}, param, callback);
		};
		
		return factory;
	}

	index.register.factory('cfapi004.Factory', cfapi004Factory);
});