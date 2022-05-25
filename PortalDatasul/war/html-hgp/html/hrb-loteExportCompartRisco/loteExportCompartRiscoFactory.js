define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

    loteExportCompartRiscoFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function loteExportCompartRiscoFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrb/fchsauloteexportcompartrisco/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
		});	


        factory.getLoteExportCompartRiscoByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getLoteExportCompartRiscoByFilter',
                               simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                               limit: limit, loadNumRegisters: loadNumRegisters},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                              callback);
        };

        factory.removeLoteExportCompartRisco = function (tmpLoteExportCompartRisco,callback) {
            factory.TOTVSPost({method: 'removeLoteExportCompartRisco'},
                              {tmpLoteExportCompartRisco: tmpLoteExportCompartRisco},
                               callback);
        };

        factory.cancelaLoteExportCompartRisco = function (cdUnidadeDestino, nrLoteExp,callback) {
            factory.TOTVSPost({method: 'cancelaLoteExportCompartRisco'},
                              {cdUnidadeDestino: cdUnidadeDestino,
                               nrLoteExp: nrLoteExp},
                               callback);
        };

        factory.prepareDataToMaintenanceWindow = function (cdUnidadeDestino, nrLoteExp, callback) {
            factory.TOTVSPost({method: 'prepareDataToMaintenanceWindow'},
                              {cdUnidadeDestino: cdUnidadeDestino,
                               nrLoteExp: nrLoteExp},
                               callback);
        };

        return factory;
    }

    index.register.factory('hrb.loteExportCompartRisco.Factory', loteExportCompartRiscoFactory);	
});


