define(['index',
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	modalityFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function modalityFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpr/fchsaumodalid/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });
                
        factory.getAllModality = function (simpleFilterValue, pageOffset, limit, disclaimers, callback) {
            factory.postWithArray({method: 'getAllModality', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, limit: limit},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
		};

		return factory;
	}
	
	index.register.factory('hpr.modality.Factory', modalityFactory);	
});
