define(['index'], function (index) {

    fchmatcd1410.$inject = ['$totvsresource'];

    function fchmatcd1410($totvsresource) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatcd1410/:method/:id', {}, {
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

        factory.initializeInterface = function (callback) {
            return this.TOTVSGetArray({
                method: 'initializeInterface'
            }, callback);
        };

        factory.getListItensRequest = function (params, object, callback) {
            params.method = "getListItensRequest";
            return this.TOTVSPost(params, object, callback);
        };

        factory.simplifiedRequisitionReturn = function (params, object, callback) {
            params.method = "simplifiedRequisitionReturn";
            return this.TOTVSPost(params, object, callback);
        };
        
        factory.materialRequisitionReturn = function (params, object, callback) {
            params.method = "materialRequisitionReturn";
            return this.TOTVSPost(params, object, callback);
        };        

        factory.validateLot = function (params, object, callback) {
            params.method = "validateLot";
            return this.TOTVSPost(params, object, callback);
        };

        factory.getSummaryInventoryBalance = function (params, object, callback) {
            params.method = "getSummaryInventoryBalance";
             return this.TOTVSPostArray(params, object, callback);
        };   
        
        factory.selectedRequisitionReturn = function (params, object, callback) {
            params.method = "selectedRequisitionReturn";
            return this.TOTVSPost(params, object, callback);
        };

        return factory;
    }

    index.register.factory('mce.fchmatcd1410.factory', fchmatcd1410);

});
