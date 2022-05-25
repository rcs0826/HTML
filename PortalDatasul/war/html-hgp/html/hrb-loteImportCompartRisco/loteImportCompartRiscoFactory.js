define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

    loteImportCompartRiscoFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function loteImportCompartRiscoFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/thf/hrb/fchsauloteimportcompartrisco/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
		});	


        factory.getLoteImportCompartRiscoByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getLoteImportCompartRiscoByFilter',
                               simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                               limit: limit, loadNumRegisters: loadNumRegisters},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                              callback);
        };

        factory.removeLoteImportCompartRisco = function (tmpLoteImportCompartRisco,callback) {
            factory.TOTVSPost({method: 'removeLoteImportCompartRisco'},
                              {tmpLoteImportCompartRisco: tmpLoteImportCompartRisco},
                               callback);
        };

        factory.prepareDataToMaintenanceWindow = function (cdContratante, nrLoteImp, callback) {
            factory.TOTVSPost({method: 'prepareDataToMaintenanceWindow'},
                              {cdContratante: cdContratante,
                               nrLoteImp: nrLoteImp},
                               callback);
        };

        return factory;
    }

    index.register.factory('hrb.loteImportCompartRisco.Factory', loteImportCompartRiscoFactory);	
});


