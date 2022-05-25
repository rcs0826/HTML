define(['index'], function(index) {

    fchmcs0002Factory.$inject = ['$totvsresource'];    
    function fchmcs0002Factory($totvsresource) {
        
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmcs/fchmcs0002/:method/:id', {}, {
            postArray: { 
                method: 'POST',
                isArray: true
            }, 
            getArray: { 
                method: 'GET',
                isArray: true
            }
        });

        factory.period = function (parameters, callback, headers) {
            return this.TOTVSGet({method:"period",
                                  'estab': parameters.site}, callback, headers);
        };
        
        factory.productiveSite = function (callback, headers) {
            return this.TOTVSGet({method:"productiveSite"}, callback, headers);
        };

        
        factory.costRealStandard = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"costRealStandard"}, parameters, callback, headers);
        };
        
        factory.currencies = function (callback, headers) {
            return this.getArray({method:"currencies"}, callback, headers);
        };

        factory.especieGgf = function (callback, headers) {
            return this.getArray({method:"especieGgf"}, callback, headers); 
        }; 
        
        factory.tipoConEstItem = function (parameters, callback, headers) {
            return this.TOTVSGet({method:"tipoConEstItem",
                                  'itCodigo': parameters.itCodigo}, callback, headers);
        };

        factory.statusFuncaoFechGerencial = function (callback, headers) {
            return this.TOTVSGet({method:"statusFuncaoFechGerencial"}, callback, headers);
        };

        return factory;
    }
    
    index.register.factory('fchmcs.fchmcs0002.Factory', fchmcs0002Factory);
});