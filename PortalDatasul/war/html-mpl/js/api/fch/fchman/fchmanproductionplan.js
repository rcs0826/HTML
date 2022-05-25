define(['index'], function(index) {

	fchmanproductionplanFactory.$inject = ['$totvsresource'];	
	function fchmanproductionplanFactory($totvsresource) {
		
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchman/fchmanproductionplan/:method/:id', {}, {
			
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
	        
		factory.getProductionPlanList = function (parameters, callback) {

            return this.TOTVSPostArray({method:"getProductionPlanList"}, parameters, callback);
		};

		factory.getProductionPlanDetail = function (id, callback) {

            return this.TOTVSPostArray({method:"getProductionPlanDetail"}, id, callback);
		};

		factory.persistProductionPlan = function (id, parameters, callback) {

            return this.TOTVSPost({method:"persistProductionPlan", id:id}, parameters, callback);
		};
		
		factory.getPeriodByDate = function (param, callback) {

            return this.TOTVSPostArray({method:"getPeriodByDate", id:param.cdTipo}, param.dtInicio, callback);
		};
		
		factory.removeProductionPlan = function (ttProductionPlanSummary, callback) {

            return this.TOTVSPost({method:"removeProductionPlan"}, ttProductionPlanSummary, callback);
		};
		
		factory.getProductionPlanPortletSummary = function (planCode, callback) {

            return this.TOTVSPostArray({method:"getProductionPlanPortletSummary"}, planCode, callback);
		};
		
		factory.getPeriod = function (id, param, callback) {

            return this.TOTVSPostArray({method:"getPeriod", id:id}, param, callback);
		};
        
        factory.getProductionPlanSites = function (parameters, callback) {

            return this.TOTVSPostArray({method:"getProductionPlanSites"}, parameters, callback);
        };
        
        factory.setProductionPlanSites = function (parameters, callback) {

            return this.TOTVSPost({method:"setProductionPlanSites"}, parameters, callback);
        };
        
        factory.productionPlanCompleteCopy = function (parameters, callback) {

            return this.TOTVSPost({method:"productionPlanCompleteCopy"}, parameters, callback);
        };
        
        factory.productionPlanCopyQuantities = function (parameters, callback) {

            return this.TOTVSPost({method:"productionPlanCopyQuantities"}, parameters, callback);
        };
        
        factory.validateCopyQuantities = function (parameters, callback) {

            return this.TOTVSPostArray({method:"validateCopyQuantities"}, parameters, callback);
        };
		
		return factory;
	}
	
	index.register.factory('fchman.fchmanproductionplan.Factory', fchmanproductionplanFactory);
});