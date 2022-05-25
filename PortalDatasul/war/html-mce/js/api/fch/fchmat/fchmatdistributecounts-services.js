define(['index'], function(index) {
    
	fchmatdistributecounts.$inject = ['$totvsresource'];
	function fchmatdistributecounts($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatdistributecountsapi/:method/:id', {}, {
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
        
        factory.initializeInterface = function(callback){        
             return this.TOTVSGet({method: 'initializeInterface'}, callback);          
        } 
        
        factory.getDefaultsParam = function(callback){        
            return this.TOTVSPostArray({method: 'getDefaultsParam'}, {}, callback);
                    
        }        
        
        factory.getInventarioByFilter = function (params, object, callback) { 
            params.method = "getInventarioByFilter";
            return this.TOTVSPost(params, object, callback);
        }  
        
        factory.atualizaConferente = function (params, object, callback) { 
            params.method = "atualizaConferente";
            return this.TOTVSPost(params, object, callback);
        }   
        
        factory.findInventarioDetalhe = function (params, object, callback) { 
            params.method = "findInventarioDetalhe";
            return this.postArray(params, object, callback);
        }   
        
        factory.atualizaConferenteByFilter = function (params, object, callback) { 
            params.method = "atualizaConferenteByFilter";
            return this.TOTVSPost(params, object, callback);
        }
        
        factory.getDtSaldoByAgrup = function (params, callback) { 
            params.method = "getDtSaldoByAgrup";
            return this.TOTVSGet(params, callback);
        }
        
        factory.bloquearDesbloquearItemDeposito = function (params, object, callback) { 
            params.method = "bloquearDesbloquearItemDeposito";
            return this.TOTVSPost(params, object, callback);
        }  
        
        return factory;
	}
	
	index.register.factory('mce.fchmatdistributecounts.factory', fchmatdistributecounts);	

});