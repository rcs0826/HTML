define(['index', 
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

	situationFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
	function situationFactory($totvsresource, dtsUtils) {
	    var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsausituation/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getSituationByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getSituationByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                callback);
        };              

        factory.saveSituation = function (tmpSituation, callback) {   
            factory.TOTVSPost({method: 'saveSituation'},
                                  {tmpSituation: tmpSituation},
            function(result){ 
                if(result && result.tmpSituation){
                    result.tmpSituation.$hasError = result.$hasError;
                    callback(result.tmpSituation);
                    return;
                }
                
                callback(result);
            });
        }

        factory.removeSituation = function (tmpSituation,callback) {   

            factory.TOTVSPost({method: 'removeSituation'},
                              {tmpSituation: tmpSituation},
                               callback);
        }

        factory.prepareDataToMaintenanceWindow = function (idSituacao,callback) { 
            factory.postWithArray({method: 'prepareDataToMaintenanceWindow'},
                              {idSituacao: idSituacao},
                              callback);
        }
                
        return factory;
    }

    index.register.factory('hrs.situation.Factory', situationFactory);	
});


