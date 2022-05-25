define(['index'], function(index) {

	fchmipequipmentFactory.$inject = ['$totvsresource'];
	function fchmipequipmentFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/fchmipequipment/:method/:id', {}, {
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

        factory.getEquipmentData = function (params, callback) {
            return this.TOTVSGet({method:"getEquipmentData", cdEquipto: params}, callback);
        }
        
        factory.getHistoryData = function (params, callback) {
            return this.TOTVSPostArray({method:"getHistoryData"}, params, callback);
        }
        
        factory.getComponentData = function (params, callback) {
            return this.TOTVSPostGet({method:"getComponentData", cdEquipto: params}, callback);
        }
        
        factory.getMaintenanceData = function (params, callback) {
            return this.TOTVSPostArray({method:"getMaintenanceData"}, params, callback);
        }
        
        factory.getUtilityData = function (params, callback) {
            return this.TOTVSPostArray({method:"getUtilityData"}, params, callback);
        }
        
        factory.getOrderData = function (params, callback) {
            return this.TOTVSPostArray({method:"getOrderData"}, params, callback);
        }
        
        factory.getInspectionData = function (params, callback) {
            return this.TOTVSPostArray({method:"getInspectionData"}, params, callback);
        }
        
        factory.getRequestData = function (params, callback) {
            return this.TOTVSPostArray({method:"getRequestData"}, params, callback);
        }
        
        factory.getPlannedOrderData = function (params, callback) {
            return this.TOTVSPostArray({method:"getPlannedOrderData"}, params, callback);
        }
        
        factory.getParamPreditiva = function (callback) {
            return this.TOTVSGet({method:"getParamPreditiva"}, callback);
        }

		return factory;
	}

	index.register.factory('fchmip.fchmipequipment.Factory', fchmipequipmentFactory);
});