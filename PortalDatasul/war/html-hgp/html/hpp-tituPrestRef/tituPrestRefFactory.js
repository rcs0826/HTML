define(['index',
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	tituPrestRefFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function tituPrestRefFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpp/fchsauhppglobal/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });
                
        factory.getTituPrestRefByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.TOTVSPost({method: 'getTituPrestRefByFilter',
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
	
	index.register.factory('hpp.tituPrestRef.Factory', tituPrestRefFactory);	
});
