define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	hvpGlobalFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function hvpGlobalFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsaucontractingparty/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });
                
        factory.getContractingPartyByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getContractingPartyByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
		};

  

		return factory;
	}
	
	index.register.factory('hvp.contractingparty.Factory', hvpGlobalFactory);	
});
