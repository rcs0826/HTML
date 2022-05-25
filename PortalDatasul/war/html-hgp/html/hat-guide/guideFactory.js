define(['index'
       ], function(index) {

    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    guideFactory.$inject = ['$totvsresource', 'dts-utils.utils.Service'];
    function guideFactory($totvsresource, dtsUtils) {
		
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hat/fchsauguide/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}}
        });

        factory.getGuideByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getGuideByFilter', simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                              limit: limit, loadNumRegisters: loadNumRegisters},
                              {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},
                            function(result){
                                if(!result || !result.tmpGuiautor){
                                    callback(result);
                                }
                                  
                                if(result.tmpGuiaAutorizComp){
                                    angular.forEach(result.tmpGuiautor,function(guia){
                                        angular.forEach(result.tmpGuiaAutorizComp, function(comp){
                                            if(guia.aaGuiaAtendimento == comp.numAnoGuiaAtendim
                                            && guia.nrGuiaAtendimento == comp.numGuiaAtendim){
                                                guia.guiaAutorizComp = comp;
                                            }
                                        });
                                    });
                                }
                                
                                callback(result.tmpGuiautor);
                            });
        };
                
        factory.getGuideByKey = function (guideYearNumber, disclaimers, callback) {
            factory.getGuideByFilter(guideYearNumber, 0, 1, false, disclaimers, callback);
        };
                
        return factory;
    }

    index.register.factory('hat.guide.Factory', guideFactory);	
});
