define(['index'], function(index) {

    fchmcs0003Factory.$inject = ['$totvsresource'];    
    function fchmcs0003Factory($totvsresource) {
        
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmcs/fchmcs0003/:method/:id', {}, {
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

        factory.listitems = function (parameters, callback, headers) {
            return this.TOTVSPostArray({method:"listitems"}, parameters, callback, headers);
        };

        factory.listItemscsv = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"listItemscsv"}, parameters, callback, headers);
        };

        return factory;
    }
    
    index.register.factory('fchmcs.fchmcs0003.Factory', fchmcs0003Factory);
});