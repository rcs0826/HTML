define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

    loteImportRetCompartRiscoFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function loteImportRetCompartRiscoFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrb/fchsauloteimportretcompartrisco/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
		});	


        factory.getLoteImportRetCompartRiscoByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getLoteImportRetCompartRiscoByFilter',
                               simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                               limit: limit, loadNumRegisters: loadNumRegisters},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                              callback);
        };

        factory.removeLoteImportRetCompartRisco = function (tmpLoteImportRetCompartRisco,callback) {
            factory.TOTVSPost({method: 'removeLoteImportRetCompartRisco'},
                              {tmpLoteImportRetCompartRisco: tmpLoteImportRetCompartRisco},
                               callback);
        };

        factory.prepareDataToMaintenanceWindow = function (cdUnidadeDestino, nrLoteExp, nrSequenciaLote, callback) {
            factory.TOTVSPost({method: 'prepareDataToMaintenanceWindow'},
                              {cdUnidadeDestino: cdUnidadeDestino,
                                nrLoteExp: nrLoteExp,
                                nrSequenciaLote: nrSequenciaLote},
                               callback);
        };

        return factory;
    }

    index.register.factory('hrb.loteImportRetCompartRisco.Factory', loteImportRetCompartRiscoFactory);	
});


