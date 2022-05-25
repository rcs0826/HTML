define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	globalParametersFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function globalParametersFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsauglobalparameters/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getGlobalParametersByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getGlobalParametersByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.saveGlobalParameters = function (tmpAbiParametros,callback) {   

            factory.TOTVSPost({method: 'saveGlobalParameters'},
                                  {tmpAbiParametros: tmpAbiParametros},
            function(result){ 
                if(result && result.tmpAbiParametros){
                    result.tmpAbiParametros.$hasError = result.$hasError;
                    callback(result.tmpAbiParametros);
                    return;
                }
                
                callback(result);
            });
        };

        factory.removeGlobalParameters = function (tmpAbiParametros,callback) {   

            factory.TOTVSPost({method: 'removeGlobalParameters'},
                              {tmpAbiParametros: tmpAbiParametros},
                               callback);
        };
        
        factory.prepareDataToMaintenanceWindow = function (callback) {   
            factory.postWithArray({method: 'prepareDataToMaintenanceWindow'},
                              {},
                              callback);
        };
                
        return factory;
    }

    index.register.factory('hrs.globalParameters.Factory', globalParametersFactory);	
});


