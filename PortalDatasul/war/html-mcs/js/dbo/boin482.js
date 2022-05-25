define(['index'], function(index) {
	
	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	boin482Factory.$inject = ['$totvsresource'];	
	function boin482Factory($totvsresource) {
		
		// definimos uma nova factory a partir do totvsresource, passando a URL do serviço de DBO
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin482//:id', {}, {});
		
		// implementamos um metodo findRecords para abstrair a chamada ao resource
		factory.findRecords = function (parameters, callback) {
            return this.TOTVSQuery(parameters, callback, {noErrorMessage:true});
        };
		
		// implementamos tambem o getRecord e todos os outros metodos de CRUD
        factory.getRecord = function (id, callback) {
            return this.TOTVSGet({id: id}, callback);
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
	
	index.register.factory('mcs.boin482.Factory', boin482Factory);
	
	// **************************************************************************************
	// *** SERVICE
	// **************************************************************************************
	
	boin482Service.$inject = ['mcs.boin482.Factory'];
	function boin482Service(boin482Factory) {
		
		// definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt,limitAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
			
			parameters.start = startAt;
			parameters.limit = limitAt;
			
            return boin482Factory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return boin482Factory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return boin482Factory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, model, callback) {
            return boin482Factory.updateRecord(id, model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return boin482Factory.deleteRecord(id, callback);
        };
	}
	
	index.register.service('mcs.boin482.Service', boin482Service);
			
});