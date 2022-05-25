define(['index'], function(index) {

	fchmip0066Factory.$inject = ['$totvsresource'];	
	function fchmip0066Factory($totvsresource) {
		
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/fchmip0066/:method/:id', {}, {
			
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

		factory.setLaborReport = function (params, callback) {
            return this.TOTVSPost({method:"setLaborReport"}, params, callback);
		};
		
		factory.loadLaborMaintenanceOrderRecord = function (params, callback) {
            return this.TOTVSPostArray({method:"loadLaborMaintenanceOrderRecord"}, params, callback);
		};
		
		factory.setLaborReportBatch = function (param, callback) {
    		return this.TOTVSPost({method:"setLaborReportBatch"}, param, callback);
    	};

		factory.loadLaborTechnician = function (param, callback) {
    		return this.TOTVSPostArray({method:"loadLaborTechnician"}, param, callback);
    	};
		
		return factory;
	}
	
	index.register.factory('fchmip.fchmip0066.Factory', fchmip0066Factory);
});
