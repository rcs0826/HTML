define(['index' 
       ], function(index) {

	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	hrcGlobalFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function hrcGlobalFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauhrcglobal/:method', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getTransactionsByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.postWithArray({method: 'getTransactionsByFilter', 
                                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                callback);
        };
                
        factory.getTransactionByKey = function (transactionCode, disclaimers, callback) {
            factory.getTransactionsByFilter(transactionCode, 0, 1, false,
                disclaimers, function(result){
                    callback(result[0]);
                });
        };

        factory.getNoteClassVsTransactionByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getNoteClassVsTransactionByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };

        factory.getAccessWayByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getAccessWayByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        };  

        factory.getLeaveReasonByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getLeaveReasonByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                                callback);
        }; 

        factory.getPercentageByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getPercentageByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
								callback);
        };

        factory.getMovementPeriodByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.TOTVSPost({method: 'getMovementPeriodByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },
                function(result){
                    if(!result || !result.tmpPerimovi)
                        return result;

                    angular.forEach(result.tmpPerimovi,function(period){
                        angular.forEach(result.tmpSitPer,function(sit){
                            if (period.cdSitPer == sit.cdSitPer) {
                                period.sitPer = sit;
                            }
                        });
                    });

                    callback(result.tmpPerimovi);

                });
        };

        factory.getTransactionModuleProc = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.TOTVSPost({method: 'getTransactionModuleProc', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers) },                                
                function(result){
                    if(!result || !result.tmpTrmodamb)
                        return result;

                    angular.forEach(result.tmpTrmodamb,function(trmo){
                        angular.forEach(result.tmpAmbproce,function(proce){
                            if (trmo.cdEspAmb       == proce.cdEspAmb
                             && trmo.cdGrupoProcAmb == proce.cdGrupoProcAmb
                             && trmo.cdProcedimento == proce.cdProcedimento
                             && trmo.dvProcedimento == proce.dvProcedimento) {
                                trmo.procetrmo = proce;
                            }
                        });
                    });

                    callback(result.tmpTrmodamb);

                });
        };
        
        factory.getNotapresByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.postWithArray({method: 'getNotapresByFilter', 
                                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                function(result){
                                    callback(result);
                                });
        };
        
        factory.getTranusuaByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.postWithArray({method: 'getTranusuaByFilter', 
                                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                callback);
        };
        
        factory.getActivePeriods = function(callback){
            factory.TOTVSQuery({method: 'getActivePeriods'}, callback);
        };
        
        factory.getAttendancePlaceByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getAttendancePlaceByFilter',
                                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                callback);
        };
                
        factory.getAttendancePlaceByKey = function (attendancePlaceCode, callback) {
            factory.getAttendancePlaceByFilter('', 0, 1, false,
                [{property:'cdLocalAtendimento',value: attendancePlaceCode }], function(result){
                    callback(result[0]);
                });
        };
        
        factory.getRestrictionByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getRestrictionByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                callback);
        };
	
        factory.getTratipinByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.postWithArray({method: 'getTratipinByFilter', 
                                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                callback);
        };

        factory.getPortanesByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {            
            factory.TOTVSPost({method: 'getPortanesByFilter', 
                                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                callback);
        };

        factory.getPortanesByKey = function (portAnesCode, callback) {
            factory.getPortanesByFilter(portAnesCode, 0, 1, false, [],
                function(result){
                    callback(result.tmpPortanes[0]);
                });
        };

        factory.getInputTypeByFilter = function (simpleFilterValue, pageOffset, limit, fields, loadNumRegisters, disclaimers, callback) {            
            factory.postWithArray({method: 'getInputTypeByFilter', 
                                simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                                limit: limit, fields:fields, loadNumRegisters: loadNumRegisters},
                                {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                                callback);
        };
            
        return factory;
	}
	
	index.register.factory('hrc.global.Factory', hrcGlobalFactory);	
});
