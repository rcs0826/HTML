define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	paramrcFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function paramrcFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauparamrc/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });
                
        factory.getParamrc = function (callback) {
            factory.TOTVSQuery({method: 'getParamrc'}, callback);
        };


        factory.saveParamrc = function (tmpParamrc,  callback) {
            
            factory.TOTVSPost({method: 'saveParamrc'},{tmpParamrc: tmpParamrc}, 
                function(result){
                    if(result && result.tmpParamrc){
                        result.tmpParamrc.$hasError = result.$hasError;
                        callback(result.tmpParamrc);
                        return;
                    }
                    callback(result);
                });
        };

		return factory;
	}
	
	index.register.factory('hrc.paramrc.Factory', paramrcFactory);	
});
