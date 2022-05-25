define(['index'], function(index) {

	fchmpoagendaFactory.$inject = ['$totvsresource', '$window'];	
	function fchmpoagendaFactory($totvsresource, $window) {
		
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmpo/fchmpoagenda/:method/:id', {}, {
			
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
	        
		factory.getListAgendaSearch = function (startAt, limitAt, param, callback) {
			if (!param){
				param = {};
			}
			param.startAt = startAt;
			param.limitAt = limitAt;
            return this.TOTVSPost({method:"getListAgendaSearch"}, param, callback);
		};
		
		factory.getListAgendaAdvancedSearch = function (param, callback) {
            return this.TOTVSPost({method:"getListAgendaAdvancedSearch"}, param, callback);
		};
		
		factory.getDetailAgenda = function (param, callback) {
            return this.TOTVSPostArray({method:"getDetailAgenda"}, param, callback);
		};
		
		factory.getListTecnico = function (callback) {
            return this.TOTVSPostArray({method:"getListTecnico"}, 'getListTecnico', callback);
		};
		
		factory.getDetailAgendaAndShift = function (param, callback) {
            return this.TOTVSPost({method:"getDetailAgendaAndShift"}, param, callback);
		};
		
		factory.getUserGroup = function (param, callback) {
            return this.TOTVSPost({method:"getUserGroup"}, param, callback);
		};
		
		factory.sendEmail = function (param, callback) {
            return this.TOTVSPost({method:"sendMail"}, param, callback);
		};

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
    	};

		return factory;
	}
	
	index.register.factory('fchmpo.fchmpoagenda.Factory', fchmpoagendaFactory);


	serviceZoomTecnico.$inject = ['$totvsresource', '$rootScope', '$filter', 'i18nFilter', 'dts-utils.zoom', 'dts-utils.utils.Service', 'fchmcd.fchmcd0001.Factory'];
	function serviceZoomTecnico($totvsresource, $rootScope, $filter, i18nFilter, zoomService, dtsUtils, fchmcd0001Factory){

		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fchmpoagenda/:method/:id', {}, {

	        postArray: { 
	          method: 'POST',
	          isArray: true
	        }

  		});

	    service.zoomName       = i18nFilter('l-technician', [], 'dts/mpo');
        service.configuration  = true;
        service.advancedSearch = false;
        service.matches        = ['cdTecnico', 'nomeCompl'];      
        service.useSearchMethod = true;

      	var records = 0;
		var controlePagina = true;

		service.TOTVSPostArray = function (parameters, model, callback, headers) {
      		service.resource.parseHeaders(headers);
          	var call = service.resource.postArray(parameters, model);
          	return service.resource.processPromise(call, callback);
      	}; 
	    
        service.propertyFields = [
            {label: $rootScope.i18n('l-technician'), property: 'cdTecnico', type: 'string', maxlength: '3', default: true},
            {label: $rootScope.i18n('l-name'), property: 'nomeCompl', type: 'string', maxlength: '40'},
            {label: $rootScope.i18n('l-email'), property: 'email', type: 'string', maxlength: '40'},
            {label: $rootScope.i18n('l-group'), property: 'grupo', type: 'string', maxlength: '40'},
            {label: $rootScope.i18n('l-cost-center'), property: 'ccCodigo', type: 'string', maxlength: '40'},
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-technician'), field: 'cdTecnico', width: 80, minWidth: 40},
            {headerName: $rootScope.i18n('l-name'), field: 'nomeCompl', width: 460, minWidth: 80},
            {headerName: $rootScope.i18n('l-email'), field: 'email', width: 460, minWidth: 80},     
            {headerName: $rootScope.i18n('l-group'), field: 'grupo', width: 460, minWidth: 80},    
            {headerName: $rootScope.i18n('l-cost-center'), field: 'ccCodigo', width: 460, minWidth: 80}     
        ];
        
        /* 
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
         */
        service.comparator = function(item1, item2) {
            return (item1.id === item2.id);
        };
        
        service.getObjectFromValue =  function (value) {	
        	if (!isNaN(value)){
	            return this.resource.TOTVSGet({method:'getTecnico',
	                id: value
	            }, undefined, {
	                noErrorMessage: true
	            }, true);
        	}        	
        };

 		var headers = { noErrorMessage: true, noCount : true };

        service.resource.TOTVSQuery = function(parameters, callback, headers, cache){

        	var estabel = fchmcd0001Factory.get('estabel-mcd').tta_cod_estab;
		  	return service.TOTVSPostArray({method:"getListTecnico"}, {pId: estabel, pParam: parameters.id}, callback);

	  	};


		return service;

	}
	
	index.register.service('fchmpo.zoom.tecnico', serviceZoomTecnico);
});