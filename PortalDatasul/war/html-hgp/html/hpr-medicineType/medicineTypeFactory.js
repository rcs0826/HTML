define(['index',
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	medicineTypeFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function medicineTypeFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpr/fchsauhprglobal/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });
                
        factory.getMedicineTypeByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.TOTVSPost({method: 'getMedicineTypeByFilter',
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
	
	index.register.factory('hpr.medicineType.Factory', medicineTypeFactory);	
});
