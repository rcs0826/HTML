define(['index'], function(index) {
	
	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	bofr032Factory.$inject = ['$totvsresource'];	
	function bofr032Factory($totvsresource) {
		
		// definimos uma nova factory a partir do totvsresource, passando a URL do serviço de DBO
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/frbo/bofr032//:epCodigo//:codEstabel//:codMatr', {}, {});
		
		// implementamos um metodo findRecords para abstrair a chamada ao resource
		factory.findRecords = function (parameters, callback) {
            return this.TOTVSQuery(parameters, callback, {noErrorMessage:true});
        };
		
		// implementamos tambem o getRecord e todos os outros metodos de CRUD
        factory.getRecord = function (id, callback) {
            return this.TOTVSGet({epCodigo: id.epCodigo, codEstabel: id.codEstabel, codMatr: id.codMatr}, callback, {noErrorMessage:true});
        };
         
        factory.saveRecord = function (model, callback) {
            return this.TOTVSSave({}, model, callback);
        };
         
        factory.updateRecord = function (id, model, callback) {
            return this.TOTVSUpdate({epCodigo: id.epCodigo, codEstabel: id.codEstabel, codMatr: id.codMatr}, model, callback);
        };
         
        factory.deleteRecord = function (id, callback) {
            return this.TOTVSRemove({epCodigo: id.epCodigo, codEstabel: id.codEstabel, codMatr: id.codMatr}, callback);
        };
		
		return factory;
	}
	
	index.register.factory('mab.bofr032.Factory', bofr032Factory);
	
	// **************************************************************************************
	// *** SERVICE
	// **************************************************************************************
	
	bofr032Service.$inject = ['mab.bofr032.Factory'];
	function bofr032Service(bofr032Factory) {
		
		// definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, limitAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
            parameters.limit = limitAt;
             
            return bofr032Factory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return bofr032Factory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return bofr032Factory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, model, callback) {
            return bofr032Factory.updateRecord(id, model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return bofr032Factory.deleteRecord(id, callback);
        };
	}
	
	index.register.service('mab.bofr032.Service', bofr032Service);
			
});