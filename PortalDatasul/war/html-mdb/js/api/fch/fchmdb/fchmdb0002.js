define(['index'], function(index) {

    fchmdb0002Factory.$inject = ['$totvsresource'];    
    function fchmdb0002Factory($totvsresource) {
        
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmdb/fchmdb0002/:method/:id', {}, {
            postArray: { 
                method: 'POST',
                isArray: true
            },
            getArray: { 
                method: 'GET',
                isArray: true
            }
        });
        
        factory.TOTVSPostArray = function (parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.postArray(parameters, model);
            return this.processPromise(call, callback);
        };
        
        factory.TOTVSGetArray = function (parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.getArray(parameters, model);
            return this.processPromise(call, callback);
        };

        factory.gantt = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"gantt"}, parameters, callback, headers);
        };

        factory.updateOp = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"updateOp"}, parameters, callback, headers);
        };

        factory.undoOperation = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"undoOperation"}, parameters, callback, headers);
        };

        factory.listAlerts = function (parameters, callback, headers) {
            return this.TOTVSPostArray({method:"listAlerts"}, parameters, callback, headers);
        };

        factory.operationsHighlight = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"operationsHighlight"}, parameters, callback, headers);
        };

        factory.operationslDealLocate = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"operationslDealLocate"}, parameters, callback, headers);
        };        
        
        factory.operationsDelayedHighlight = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"operationsDelayedHighlight"}, parameters, callback, headers);
        };        
        
        factory.operationsBacklog = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"operationsBacklog"}, parameters, callback, headers);
        }

        factory.operationsValidate = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"operationsValidate"}, parameters, callback, headers);
        }
	
        factory.searchOperation = function (parameters, callback, headers) {
            return this.TOTVSPost({method:"searchOperation"}, parameters, callback, headers);
        };	
		
        return factory;
    }
    
    index.register.factory('fchmdb.fchmdb0002.Factory', fchmdb0002Factory);
});