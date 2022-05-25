define(['index',
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	tituPrestFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function tituPrestFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpp/fchsauhppglobal/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });
                
        factory.getTituPrestByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.TOTVSPost({method: 'getTituPrestByFilter',
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
	
	index.register.factory('hpp.tituPrest.Factory', tituPrestFactory);	
});
