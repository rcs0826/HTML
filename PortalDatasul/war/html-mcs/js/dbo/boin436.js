define(['index'], function(index) {
	
	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	boin436Factory.$inject = ['$totvsresource'];	
	function boin436Factory($totvsresource) {
		
		// definimos uma nova factory a partir do totvsresource, passando a URL do serviço de DBO
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin436/:id', {}, {});
		
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
	
	index.register.factory('mpl.boin436.Factory', boin436Factory);
	
	// **************************************************************************************
	// *** SERVICE
	// **************************************************************************************
	
	boin436Service.$inject = ['mpl.boin436.Factory'];
	function boin436Service(boin436Factory) {
		
		// definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, limitAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
            parameters.limit = limitAt;
             
            return boin436Factory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return boin436Factory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return boin436Factory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, model, callback) {
            return boin436Factory.updateRecord(id, model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return boin436Factory.deleteRecord(id, callback);
        };
	}
	
	index.register.service('mpl.boin436.Service', boin436Service);
			
});