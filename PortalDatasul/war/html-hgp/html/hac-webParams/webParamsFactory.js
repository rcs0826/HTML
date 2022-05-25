define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	webParamsFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function webParamsFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hac/fchsauwebparams/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });
                
        factory.getWebParamsByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getWebParamsByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };


        factory.saveWebParams = function (tmpParamWeb,  callback) {
            
            factory.TOTVSPost({method: 'saveWebParams'},{tmpParamweb: tmpParamWeb}, 
                function(result){
                    if(result && result.tmpParamWeb){
                        result.tmpParamWeb.$hasError = result.$hasError;
                        callback(result.tmpParamWeb);
                        return;
                    }
                    callback(result);
                });
        };

		return factory;
	}
	
	index.register.factory('hac.webParams.Factory', webParamsFactory);	
});
