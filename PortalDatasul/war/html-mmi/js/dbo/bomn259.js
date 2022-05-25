define(['index'], function(index) {
	
	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	bomn259Factory.$inject = ['$totvsresource'];	
	function bomn259Factory($totvsresource) {
		
		// definimos uma nova factory a partir do totvsresource, passando a URL do serviço de DBO
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn259//:id', {}, {});
		
		// implementamos um metodo findRecords para abstrair a chamada ao resource
		factory.findRecords = function (parameters, callback) {
            return this.TOTVSQuery(parameters, callback, {noErrorMessage:true});
        };
		
		// implementamos tambem o getRecord e todos os outros metodos de CRUD
        factory.getRecord = function (id, callback) {
            return this.TOTVSGet({id: id}, callback, {noErrorMessage:true});
        };
         
        factory.saveRecord = function (model, callback) {
            return this.TOTVSSave({}, model, callback);
        };
         
        factory.updateRecord = function (id, model, callback) {
            return this.TOTVSUpdate({id: id}, model, callback);
        };
         
        factory.deleteRecord = function (id, callback) {
            return this.TOTVSRemove({id: id}, callback);
        };
		
		return factory;
	}
	
	index.register.factory('mmi.bomn259.Factory', bomn259Factory);
	
	// **************************************************************************************
	// *** SERVICE
	// **************************************************************************************
	
	bomn259Service.$inject = ['mmi.bomn259.Factory', '$rootScope'];
	function bomn259Service(bomn259Factory, $rootScope) {
		
		// definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, limitAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
            parameters.limit = limitAt;
             
            return bomn259Factory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return bomn259Factory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return bomn259Factory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, model, callback) {
            return bomn259Factory.updateRecord(id, model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return bomn259Factory.deleteRecord(id, callback);
        };
        
        /**
    	 * Retorna descrição para o tipo de evento informado
    	 */		
    	this.getEventType = function(eventType) {
    		switch (eventType) {
    			case 1:
    				return $rootScope.i18n('l-systematic');
    			case 2:
    				return $rootScope.i18n('l-predictive');
    			case 3:
    				return $rootScope.i18n('l-calibration');
    			case 4:
    				return $rootScope.i18n('l-lubrification');
    			case 5:
    				return $rootScope.i18n('l-productive');
    			case 6:
    				return $rootScope.i18n('l-general-services');	
    			case 7:
    				return $rootScope.i18n('l-palliative');
    			case 8:
    				return $rootScope.i18n('l-remedial');
    			case 9:
    				return $rootScope.i18n('l-inspection');
    			case 10:
    				return $rootScope.i18n('l-investigation');
    			case 11:
    				return $rootScope.i18n('l-stop-reasons');
    			case 12:
    				return $rootScope.i18n('l-costs');
    			case 13:
    				return $rootScope.i18n('l-others');
    		}
    		
    		return "";
    	}
    	
    	/**
    	 * Retorna descrição para o tipo de valor informado
    	 */		
    	this.getValueType = function(valueType) {
    		switch (valueType) {
    			case 1:
    				return $rootScope.i18n('l-generates-expense');
    			case 2:
    				return $rootScope.i18n('l-generates-receipt');
    			case 3:
    				return $rootScope.i18n('l-not-generate-value');
    		}
    		
    		return "";
    	}
	}
	
	index.register.service('mmi.bomn259.Service', bomn259Service);	
			
});