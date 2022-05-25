define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	poolerFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function poolerFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsaupooler/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getPoolerByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getPoolerByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.savePooler = function (tmpAgrupRegraFaturam,  callback) {            
            factory.TOTVSPost({method: 'savePooler'},{tmpAgrupRegraFaturam: tmpAgrupRegraFaturam}, 
                function(result){
                    if(result && result.tmpAgrupRegraFaturam){
                        result.tmpAgrupRegraFaturam.$hasError = result.$hasError;
                        callback(result.tmpAgrupRegraFaturam);
                        return;
                    }
                    callback(result);
                });
        }; 
                

        factory.removePooler = function (tmpAgrupRegraFaturam,  callback) {            
            factory.TOTVSPost({method: 'removePooler'},{tmpAgrupRegraFaturam: tmpAgrupRegraFaturam}, 
                function(result){
                    if(result && result.tmpAgrupRegraFaturam){
                        result.tmpAgrupRegraFaturam.$hasError = result.$hasError;
                        callback(result.tmpAgrupRegraFaturam);
                        return;
                    }
                    callback(result);
                });
        }; 
                
        return factory;
    }

    index.register.factory('hrc.pooler.Factory', poolerFactory);	
});