define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	adjustmentPercentageFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function adjustmentPercentageFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsauperchistorimpug/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getPercHistorImpugByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            
            factory.postWithArray({method: 'getPercHistorImpugByFilter',
                    simpleFilterValue: simpleFilterValue,
                    pageOffset: pageOffset, 
                    limit: limit, 
                    loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };

        factory.savePercHistorImpug = function (novoRegistro,tmpPercHistorImpug, callback) {   

          
            factory.TOTVSPost({method: 'savePercHistorImpug',novoRegistro: novoRegistro},
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

        factory.removePercHistorImpug = function (tmpPercHistorImpug,callback) {   
            

            factory.TOTVSPost({method: 'removePercHistorImpug'},
                              {tmpPercHistorImpug: tmpPercHistorImpug},
                               callback);
        }

        factory.prepareDataToMaintenanceWindow = function (numAno, numMes, callback) { 
            
              
            factory.TOTVSPost({method: 'prepareDataToMaintenanceWindow'},
                              {numAno: numAno, 
                                numMes: numMes},
                              callback);
        }
                
        return factory;
    }

    index.register.factory('hrs.adjustmentPercentage.Factory', adjustmentPercentageFactory); 
});


