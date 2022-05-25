define(['index'], function(index) {

    fchmcs0004Factory.$inject = ['$totvsresource'];    
    function fchmcs0004Factory($totvsresource) {
        
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmcs/fchmcs0004/:method/:id', {}, {
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

        factory.listcostcenter = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"listcostcenter"}, parameters, callback, headers);
        };

        factory.listItemscsv = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"listItemscsv"}, parameters, callback, headers);
        };
        
        return factory;
    }
    
    index.register.factory('fchmcs.fchmcs0004.Factory', fchmcs0004Factory);
});