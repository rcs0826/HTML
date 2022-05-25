define(['index'], function(index) {

	fchmiptagFactory.$inject = ['$totvsresource'];
	function fchmiptagFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/fchmiptag/:method/:id', {}, {
			postArray: {
				method: 'POST',
				isArray: true
			},            
            postGet: {
				method: 'GET',
				isArray: true
			}
		});

        factory.TOTVSPostArray = function (parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.postArray(parameters, model);
            return this.processPromise(call, callback);
        };
        
        factory.TOTVSPostGet = function(parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.postGet(parameters, model);
            return this.processPromise(call, callback);
        };

        factory.getTagData = function (params, callback) {
            return this.TOTVSPostGet({method:"getTagData", cd_tag: params}, callback);
        };

        factory.getHistTag = function (params, callback) {
            return this.TOTVSPostArray({method:"getHistTag"}, params, callback);
        };
        
        factory.getEquipmentTag = function (params, callback) {
            return this.TOTVSPostArray({method:"getEquipmentTag"}, params, callback);
        };
        
        factory.getOrderTag = function (params, callback) {
            return this.TOTVSPostArray({method:"getOrderTag"}, params, callback);
        };
        
        factory.getServiceRequestTag = function (params, callback) {
            return this.TOTVSPostArray({method:"getServiceRequestTag"}, params, callback);
        };
        
        factory.getOperationalConditionTag = function (params, callback) {
            return this.TOTVSPostArray({method:"getOperationalConditionTag"}, params, callback);
        };

		return factory;
	}

	index.register.factory('fchmip.fchmiptag.Factory', fchmiptagFactory);
});