define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	adjustmentPercentageFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function adjustmentPercentageFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsauadjustmentpercentage/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getAdjustmentPercentageByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getAdjustmentPercentageByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.saveAdjustmentPercentage = function (tmpPercHistorImpug,callback) {   

            factory.TOTVSPost({method: 'saveAdjustmentPercentage'},
                                  {tmpPercHistorImpug: tmpPercHistorImpug},
            function(result){ 
                if(result && result.tmpPercHistorImpug){
                    result.tmpPercHistorImpug.$hasError = result.$hasError;
                    callback(result.tmpPercHistorImpug);
                    return;
                }
                
                callback(result);
            });
        }

        factory.removeAdjustmentPercentage = function (tmpPercHistorImpug,callback) {   

            factory.TOTVSPost({method: 'removeAdjustmentPercentage'},
                              {tmpPercHistorImpug: tmpPercHistorImpug},
                               callback);
        }

        factory.prepareDataToMaintenanceWindow = function (callback) {   

        }
                
        return factory;
    }

    index.register.factory('hrs.adjustmentPercentage.Factory', adjustmentPercentageFactory);	
});


