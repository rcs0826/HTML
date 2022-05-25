define(['index'], function(index) {
	
	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	bomn267Factory.$inject = ['$totvsresource'];	
	function bomn267Factory($totvsresource) {
		
		// definimos uma nova factory a partir do totvsresource, passando a URL do serviço de DBO
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn267//:id', {}, {});
		
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
	
	index.register.factory('mmi.bomn267.Factory', bomn267Factory);
	
	// **************************************************************************************
	// *** SERVICE
	// **************************************************************************************
	
	bomn267Service.$inject = ['mmi.bomn267.Factory', '$rootScope'];
	function bomn267Service(bomn267Factory, $rootScope) {
		
		// definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, limitAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
            parameters.limit = limitAt;
             
            return bomn267Factory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return bomn267Factory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return bomn267Factory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, model, callback) {
            return bomn267Factory.updateRecord(id, model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return bomn267Factory.deleteRecord(id, callback);
        };
         
	}
	
	index.register.service('mmi.bomn267.Service', bomn267Service);	
			
});