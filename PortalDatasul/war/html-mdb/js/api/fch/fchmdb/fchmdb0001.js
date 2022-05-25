define(['index'], function(index) {

    fchmdb0001Factory.$inject = ['$totvsresource'];    
    function fchmdb0001Factory($totvsresource) {
        
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmdb/fchmdb0001/:method/:id', {}, {
            postArray: { 
                method: 'POST',
                isArray: true
            }
        });
        
        factory.TOTVSPostArray = function (parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.postArray(parameters, model);
            return this.processPromise(call, callback);
        };

        factory.scenarioList = function (callback, headers) {
            return this.TOTVSPostArray({method:"scenarioList"}, null, callback, headers); 
        }; 

        factory.calculatedItemsList = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"calculatedItemsList"}, parameters, callback, headers);
        };
        
        factory.calculatedItemsDetail = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"calculatedItemsDetail"}, parameters, callback, headers);
        };

        factory.calculatedItemsCsv = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"calculatedItemsCsv"}, parameters, callback, headers);
        };
  
        return factory;
    }
    
    index.register.factory('fchmdb.fchmdb0001.Factory', fchmdb0001Factory);
});