define(['index'], function(index) {

    fchmpl0001Factory.$inject = ['$totvsresource'];
    
    function fchmpl0001Factory($totvsresource) {
        
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmpl/fchmpl0001/:method/:id', {}, {
            
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

        factory.changedSalesOrders = function (parameters, callback, headers) {
            return this.TOTVSPostArray({method:"changedSalesOrders"}, parameters, callback, headers);
        };

        factory.listItemsCsv = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"listItemsCsv"}, parameters, callback, headers);
        };
        
        return factory;
    }
    
    index.register.factory('fchmpl.fchmpl0001.Factory', fchmpl0001Factory);
});