define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	fchmcd0001Factory.$inject = ['$totvsresource','$window'];	
	function fchmcd0001Factory($totvsresource, $window, zoomService) {
		
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmcd/fchmcd0001/:method/:id', {}, {			
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
		
		factory.getListEstabelec = function (callback) {
    		return this.TOTVSPostArray({method:"getListEstabelec"}, "getListEstabelec", callback);
    	};

    	factory.getPrincipalEstabelec = function(param, callback){
    		return this.TOTVSPost({method:"getPrincipalEstabelec"}, param, callback);
    	}

		factory.set = function(key, value){
			if (!value)
				value = {};

			$window.localStorage.setItem(key, angular.toJson(value));
    	};

    	factory.get = function(key){
    		var get = $window.localStorage.getItem(key);
    		if (!get)
    			get = {};

    		return angular.fromJson(get);
    	};

		factory.setSession = function(key, value){
			if (!value)
				value = {};
			$window.sessionStorage.setItem(key, angular.toJson(value));
    	};

    	factory.getSession = function(key){
    		return angular.fromJson($window.sessionStorage.getItem(key));
    	}
		
		return factory;
	}
	
	index.register.factory('fchmcd.fchmcd0001.Factory', fchmcd0001Factory);

	serviceZoomEstabelec.$inject = ['$totvsresource', '$rootScope', '$filter', 'i18nFilter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceZoomEstabelec($totvsresource, $rootScope, $filter, i18nFilter, zoomService, dtsUtils){

		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmcd/fchmcd0001/:method/:id', {}, {

	        postArray: { 
	          method: 'POST',
	          isArray: true
	        }

  		});

	    service.zoomName       = i18nFilter('l-site', [], 'dts/mmi');
        service.configuration  = true;
        service.advancedSearch = false;
        service.matches        = ['tta_cod_estab', 'nome'];      
        service.useSearchMethod = true;

      	var records = 0;
		var controlePagina = true;

		service.TOTVSPostArray = function (parameters, model, callback, headers) {
      		service.resource.parseHeaders(headers);
          	var call = service.resource.postArray(parameters, model);
          	return service.resource.processPromise(call, callback);
      	}; 
	    
        service.propertyFields = [
            {label: $rootScope.i18n('l-site'), property: 'tta_cod_estab', type: 'integer', maxlength: '3', default: true},
            {label: $rootScope.i18n('l-description'), property: 'nome', type: 'string', maxlength: '40'}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-site'), field: 'tta_cod_estab', width: 80, minWidth: 40},
            {headerName: $rootScope.i18n('l-description'), field: 'nome', width: 460, minWidth: 80}            
        ];
        
        /* 
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
         */
        service.comparator = function(item1, item2) {
            return (item1.id === item2.id);
        };
        
        service.getObjectFromValue =  function (value) {	
        	if (!isNaN(value)){        	
	            return this.resource.TOTVSGet({method:'getEstabelec',
	                id: value
	            }, undefined, {
	                noErrorMessage: true
	            }, true);
        	}        	
        };

 		var headers = { noErrorMessage: true, noCount : true };

        service.resource.TOTVSQuery = function(parameters, callback, headers, cache){

		  	return service.TOTVSPostArray({method:"getListEstabelec"}, parameters.id, callback);

	  	};

		return service;

	}
	
	index.register.service('fchmcd.zoom.estabelec', serviceZoomEstabelec);
	
});
