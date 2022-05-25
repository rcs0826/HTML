define(['index'], function(index) {
    
	fchmatitembalancewidget.$inject = ['$totvsresource'];
	function fchmatitembalancewidget($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmat/fchmatitembalancewidget/:method/:id', {}, {
			postArray: { 
				method: 'POST',
				isArray: true
			},
			getArray: { 
				method: 'GET',
				isArray: true
			}
        });
        
        
        factory.getItemBalance = function (params, object, callback) {    
            params.method = 'getItemBalance';            
            return this.postArray(params, object, callback);  
	    }     
                
        return factory;
	}
	
	index.register.factory('mce.fchmatitembalancewidget.factory', fchmatitembalancewidget);	

});