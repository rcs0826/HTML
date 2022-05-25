define(['index'], function(index) {
    
	fchmatInventoryBalanceInquiryFactory.$inject = ['$totvsresource'];
	function fchmatInventoryBalanceInquiryFactory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatinventorybalanceinquiryhtml/:method/:id', {}, {
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
        
        factory.setDefaultsInventory = function (params, object, callback) {    
            params.method = 'setDefaultsInventory';            
            return this.TOTVSPost(params, object, callback);  
		}   
        
        factory.getMergeInventoryItemBalance = function (params, object, callback) {    
            params.method = 'getMergeInventoryItemBalance';            
            return this.TOTVSPost(params, object, callback);  
		}    
		
		factory.setGeraExcel = function (params, object, callback) {    
            params.method = 'setGeraExcel';            
            return this.TOTVSPost(params, object, callback);  
		}
		
		factory.setGeraExcelCE0814 = function (params, object, callback) {    
            params.method = 'setGeraExcelCE0814';            
            return this.TOTVSPost(params, object, callback);  
		}		
        
        factory.getItemMovement = function (params, object, callback) {    
            params.method = 'getItemMovement';            
            return this.TOTVSPost(params, object, callback);  
		}  
        
        factory.setDefaultsParameter = function (params, object, callback) {    
            params.method = 'setDefaultsParameter';            
            return this.TOTVSPost(params, object, callback);  
	}       
        
        factory.getMovementDetail = function (params, object, callback) {   
             params.method = 'getMovementDetail';  
             return this.TOTVSPostArray(params, object, callback); 
	}
        
        factory.initializeInterface = function(callback){        
             return this.TOTVSGet({method: 'initializeInterface'}, callback);          
        }

        factory.getSite = function (params, object, callback) {    
            params.method = 'getSite';            
            return this.TOTVSPost(params, object, callback);  
	  }    
        
        /*factory.getAdvancedSearchItemBalance = function (params, object, callback) {    
            params.method = 'getAdvancedSearchItemBalance';            
            return this.TOTVSPost(params, object, callback);  
		}  */
       
        /*factory.createRequisition = function (params, object, callback) {   
             params.method = 'createRequisition';  
             return this.TOTVSPost(params, object, callback); 
		}    
                
        factory.initializeInterface = function(callback){        
             return this.TOTVSGet({method: 'initializeInterface'}, callback);          
        } */     
        
        
		/*factory.getListOfBanks = function(callback) {
			return this.TOTVSQuery({method: 'getListOfBanks'}, callback);
		}
		
		factory.getListOfCompanies = function(callback) {
			return this.TOTVSQuery({method: 'getListOfCompanies'}, callback);
		}
        
		factory.getCashClosingUnit = function (callback) {
            return this.TOTVSQuery({method: 'getCashClosingUnit'}, callback);
		}
		
		factory.getCashMgmtParam = function (callback) {
            return this.TOTVSQuery({method: 'getCashMgmtParam'}, callback);
		}
		
		factory.getCheckingAccounts = function (callback) {
            return this.TOTVSQuery({method: 'getCheckingAccounts'}, callback);
		}
		
		factory.getReconciliationRuleKey = function (callback) {
            return this.TOTVSQuery({method: 'getReconciliationRuleKey'}, callback);
		}
        
		factory.getBankStatementTransactions = function (object, callback) {
            return this.TOTVSPostArray({method: 'getBankStatementTransactions'}, object, callback);
		}
        
		factory.getCheckingAccountTransactions = function (object, callback) {
            return this.TOTVSPostArray({method: 'getCheckingAccountTransactions'}, object, callback);
		}
        
		factory.getLisOfChkAccountsByCCU = function (object, callback) {
            return this.TOTVSPostArray({method: 'getLisOfChkAccountsByCCU'}, object, callback);
		}
        
		factory.getListOfChkAccCCUByChkAcct = function (object, callback) {
            return this.TOTVSPostArray({method: 'getListOfChkAccCCUByChkAcct'}, object, callback);
		}*/
        
        return factory;
	}
	
	index.register.factory('mce.fchmatInventoryBalanceInquiryFactory.factory', fchmatInventoryBalanceInquiryFactory);	

});