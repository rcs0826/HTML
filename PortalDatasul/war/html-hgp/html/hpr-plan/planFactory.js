define(['index',
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	planFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function planFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpr/fchsauhprglobal/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });
                
        factory.getPlanByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.TOTVSPost({method: 'getPlanByFilter',
                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset,
                limit: limit, loadNumRegisters: loadNumRegisters}, 
                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},            
            function(result){
                if(!result) {
                    callback(result);
                    return;
                }
            });
        };

		return factory;
	}
	
	index.register.factory('hpr.plan.Factory', planFactory);	
});
