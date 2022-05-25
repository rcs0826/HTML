define(['index'], function (index) {

    fchmatcd1409.$inject = ['$totvsresource'];

    function fchmatcd1409($totvsresource) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatcd1409/:method/:id', {}, {
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

        factory.simplifiedRequisitionProcessing = function (params, object, callback) {
            params.method = "simplifiedRequisitionProcessing";
            return this.TOTVSPost(params, object, callback);
        };


        factory.getItemBalance = function (params, object, callback) {
            params.method = "getItemBalance";
            return this.TOTVSPostArray(params, object, callback);
        };


        factory.balanceRequestProcessing = function (params, object, callback) {
            params.method = "balanceRequestProcessing";
            return this.TOTVSPost(params, object, callback);
        };

        factory.validateLot = function (params, object, callback) {
            params.method = "validateLot";
            return this.TOTVSPost(params, object, callback);
        };

        factory.closeInventoryRequisition = function (params, object, callback) {
            params.method = "closeInventoryRequisition";
            return this.TOTVSPost(params, object, callback);
        };        
        
        factory.selectedRequisitionProcessing = function (params, object, callback) {
            params.method = "selectedRequisitionProcessing";
            return this.TOTVSPost(params, object, callback);
        };
                
        return factory;
    }

    index.register.factory('mce.fchmatcd1409.factory', fchmatcd1409);

});
