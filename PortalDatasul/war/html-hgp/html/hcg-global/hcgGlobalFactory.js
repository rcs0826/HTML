define(['index'
       ], function(index) {

    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    hcgGlobalFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function hcgGlobalFactory($totvsresource, dtsUtils) {
        
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauhcgglobal/:method?:param', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getStateByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.postWithArray({method: 'getStateByFilter', 
                                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters:  loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                function(result){
                                    callback(result);
                                });
        };
        
        factory.getCountryByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.postWithArray({method: 'getCountryByFilter', 
                                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters:  loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                function(result){
                                    callback(result);
                                });
        };

        factory.getCityByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getCityByFilter',
                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                limit: limit, loadNumRegisters:  loadNumRegisters},
                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                function(result){
                        callback(result);
                });
        };
        
        factory.getCityByKey = function (cityCode, disclaimers,callback) {
            this.getCityByFilter(cityCode, 0, 1, false,
                disclaimers, function(result){
                    callback(result[0]);
                });
        };

        factory.getUnitByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getUnitByFilter',
                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                limit: limit, loadNumRegisters: loadNumRegisters},
                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                function(result){
                    callback(result[0]);
                });
        };
                
        factory.getUnitByKey = function (unitCode, disclaimers, callback) {
            this.getUnitByFilter(unitCode, 0, 1, false,
                disclaimers, function(result){
                    callback(result);
                });
        };

        factory.getCidByKey = function (cdCid, disclaimers, callback) {
            factory.getCidByFilter(cdCid, 0, 1, false,
                disclaimers, function(result){
                    callback(result[0]);
                });
        };

        factory.getCidByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getCidByFilter', 
                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                limit: limit, loadNumRegisters: loadNumRegisters},
                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                function(result){
                    callback(result);
                });
        }; 

        factory.getProviderGroupByKey = function (providerGroupCode, disclaimers, callback) {
            factory.getProviderGroupByFilter(providerGroupCode, 0, 1, false,
                disclaimers, function(result){
                    callback(result[0]);
                });
        };

        factory.getProviderGroupByFilter = function (simpleFilterValue,  pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getProviderGroupByFilter', 
                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                limit: limit, loadNumRegisters: loadNumRegisters},
                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                function(result){
                    callback(result);
                });
        }; 

		factory.getPreviespByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.TOTVSPost({method: 'getPreviespByFilter', 
                                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                function(result){
                                    angular.forEach(result.tmpPreviesp, function(previesp){
                                        previesp.cbos = [];
                                        angular.forEach(result.tmpCboEsp, function(cboesp){
                                            if(previesp.cdEspecialid == cboesp.cdEspecialid){
                                                previesp.cbos.push(cboesp);
                                            }
                                        });
                                    });

                                    callback(result.tmpPreviesp);
                                });
        };       
             
             
        return factory;
    }
    
    index.register.factory('hcg.global.Factory', hcgGlobalFactory); 
});