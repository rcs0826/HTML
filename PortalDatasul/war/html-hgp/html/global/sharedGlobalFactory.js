define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	sharedGlobalFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function sharedGlobalFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/shared/fchsausharedglobal/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });
                
        factory.getEmsGlobalCalendarByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.postWithArray({method: 'getEmsGlobalCalendarByFilter', 
                                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                callback);
        };

        factory.getFoundationAutoSchedule = function (programName, callback) {            
            factory.postWithArray({method: 'getFoundationAutoSchedule', 
                                programName: programName},
                                callback);
        };

        factory.getRpwServers = function (callback) {            
            factory.postWithArray({method: 'getRpwServers'},
                        callback);
                        
        };

		return factory;
	}
	
	index.register.factory('shared.global.Factory', sharedGlobalFactory);	
});
