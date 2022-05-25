define(['index',
        '/dts/hgp/html/util/dts-utils.js'
       ], function(index) {

    periodFactory.$inject = ['$totvsresource','dts-utils.utils.Service'];
    function periodFactory($totvsresource, dtsUtils) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauperiod/:method/:id', {},{ 
            'postWithArray': { method: 'POST', isArray: true, params: {method:'@method'}} 
        });

        factory.getPeriodByFilter = function (simpleFilterValue, pageOffset, limit, loadNumRegisters, disclaimers, callback) {
            factory.postWithArray({method: 'getPeriodByFilter',
                    simpleFilterValue: simpleFilterValue, pageOffset: pageOffset, 
                    limit: limit, loadNumRegisters: loadNumRegisters},
                    {tmpFilterValue: dtsUtils.mountTmpFilterValue(disclaimers)},callback);
               
        };

        factory.savePeriod = function (period, actionType, callback) {
            
            factory.TOTVSPost({method: 'savePeriod', actionType: actionType},{tmpPerimovi: period}, 
                function(result){
                    if(result && result.tmpPerimovi){
                        result.tmpPerimovi.$hasError = result.$hasError;
                        callback(result.tmpPerimovi);
                        return;
                    }
                    callback(result);
                });
        };

        factory.removePeriod = function (dtAnoref, nrPerref, callback) {
            factory.TOTVSGet({method: 'removePeriod',dtAnoref: dtAnoref, nrPerref: nrPerref},callback);
        };
        return factory;
    }

    index.register.factory('hrc.period.Factory', periodFactory);
});

