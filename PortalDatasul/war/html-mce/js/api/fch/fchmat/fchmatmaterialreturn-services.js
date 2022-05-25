define(['index'], function(index) {
    
	fchmatMaterialReturnFactory.$inject = ['$totvsresource'];
	function fchmatMaterialReturnFactory($totvsresource) {

        var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatmaterialreturnhtml/:method/:id', {}, {
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

        factory.setDefaultsRequisitionReturn = function (params, object, callback) {
            params.method = 'setDefaultsRequisitionReturn';
            return this.TOTVSPost(params, object, callback);
        }

        factory.createRequisitionReturn = function (params, object, callback) {
            params.method = 'createRequisitionReturn';
            return this.TOTVSPost(params, object, callback);
        }

        factory.initializeInterface = function (callback) {
            return this.TOTVSGet({
                method: 'initializeInterface'
            }, callback);
        }

        factory.validateLot = function (params, object, callback) {
            params.method = 'validateLot';
            return this.TOTVSPost(params, object, callback);
        }
        
        factory.returnDataFromDashboard = function (params, object, callback) {    
            params.method = 'returnDataFromDashboard';
            return this.TOTVSPost(params, object, callback);  
        }


        return factory;
    }

    index.register.factory('mce.fchmatMaterialReturnFactory.factory', fchmatMaterialReturnFactory);

});