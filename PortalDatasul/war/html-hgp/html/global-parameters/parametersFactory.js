define(['index'
], function (index) {

    parametersFactory.$inject = ['$totvsresource'];
    function parametersFactory($totvsresource) {

        //var factory = $totvsresource.REST('/healthmanagementwebservices/rest/global/parameters/:method', {}, {});
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/global/fchsauparameters/:method?:param', {}, {});

        factory.getParamrc = function (callback) {
            factory.TOTVSQuery({method: 'getParamrc'}, function(result){
                if(result.length == 1){
                    callback(result[0]);
                }else{
                    callback(result);
                }

            });
        };

        factory.getParamecp = function (callback) {
            factory.TOTVSQuery({method: 'getParamecp'}, function(result){
                if(result.length == 1){
                    callback(result[0]);
                }else{
                    callback(result);
                }

            });
        };

        factory.getDadosIntegracaoTAF = function (callback) {
            factory.TOTVSQuery({method: 'getDadosIntegracaoTAF'},
                                callback);
        };

        return factory;
    }

    index.register.factory('global.parameters.Factory', parametersFactory);
});
