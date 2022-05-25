define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	cancellationMotiveFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function cancellationMotiveFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsaumotcange/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
		});	


        factory.getCancellationMotiveByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getCancellationMotiveByFilter',
                               simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                               limit: limit, loadNumRegisters: loadNumRegisters},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                              callback);
        };

        factory.saveCancellationMotive = function (novoRegistro, tmpMotcange,callback) {   
            factory.TOTVSPost({method: 'saveCancellationMotive'},
                              {novoRegistro: novoRegistro,
                                tmpMotcange: tmpMotcange},
            function(result){ 
                if(result && result.tmpRegraInclExc){
                    result.tmpRegraInclExc.$hasError = result.$hasError;
                    callback(result.tmpRegraInclExc);
                    return;
                }
                
                callback(result);
            });
        };

        factory.removeCancellationMotive = function (tmpMotcange,callback) {   

            factory.TOTVSPost({method: 'removeCancellationMotive'},
                              {tmpMotcange: tmpMotcange},
                               callback);
        };

        factory.prepareDataToMaintenanceWindow = function (inEntidade, cdMotivo, callback) {   
            factory.postWithArray({method: 'prepareDataToMaintenanceWindow'},
                                  {inEntidade: inEntidade,
                                   cdMotivo: cdMotivo},
                                   callback);
        };

        factory.getModulos = function (callback) {   
            factory.postWithArray({method: 'getModulos'},
                              {},
                              callback);
        };                    
            


        return factory;
    }

    index.register.factory('hcg.cancellationMotive.Factory', cancellationMotiveFactory);	
});


