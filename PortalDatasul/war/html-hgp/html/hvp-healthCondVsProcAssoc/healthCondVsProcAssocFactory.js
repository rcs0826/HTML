define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	healthCondVsProcAssocFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function healthCondVsProcAssocFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsauhealthcondvsprocassoc/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getHealthCondVsProcAssocByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getHealthCondVsProcAssocByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };
                
        factory.saveHealthCondVsProcAssoc = function (tmpCondSauProced,  callback) {            
            factory.TOTVSPost({method: 'saveHealthCondVsProcAssoc'},{tmpCondSauProced: tmpCondSauProced}, 
                function(result){
                    if(result && result.tmpCondSauProced){
                        result.tmpCondSauProced.$hasError = result.$hasError;
                        callback(result.tmpCondSauProced);
                        return;
                    }
                    callback(result);
                });
        }; 

        factory.removeHealthCondVsProcAssoc = function (tmpCondSauProced,  callback) {            
            factory.TOTVSPost({method: 'removeHealthCondVsProcAssoc'},{tmpCondSauProced: tmpCondSauProced}, 
                function(result){
                    if(result && result.tmpCondSauProced){
                        result.tmpCondSauProced.$hasError = result.$hasError;
                        callback(result.tmpCondSauProced);
                        return;
                    }
                    callback(result);
                });
        };         

        return factory;
    }
    index.register.factory('hvp.healthCondVsProcAssoc.Factory', healthCondVsProcAssocFactory);	
});