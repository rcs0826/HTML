define(['index'], function(index) {
	
	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	bomn150Factory.$inject = ['$totvsresource'];	
	function bomn150Factory($totvsresource) {
		
		// definimos uma nova factory a partir do totvsresource, passando a URL do serviço de DBO
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn150//:id', {}, {});
		
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
	
	index.register.factory('mmi.bomn150.Factory', bomn150Factory);
	
	// **************************************************************************************
	// *** SERVICE
	// **************************************************************************************
	
	bomn150Service.$inject = ['mmi.bomn150.Factory'];
	function bomn150Service(bomn150Factory) {
		
		// definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, limitAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
            parameters.limit = limitAt;
             
            return bomn150Factory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return bomn150Factory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return bomn150Factory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, model, callback) {
            return bomn150Factory.updateRecord(id, model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return bomn150Factory.deleteRecord(id, callback);
        };
	}
	
	index.register.service('mmi.bomn150.Service', bomn150Service);
			
});