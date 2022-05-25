define(['index'], function(index) {
	
	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	boin318Factory.$inject = ['$totvsresource'];	
	function boin318Factory($totvsresource) {
		
		// definimos uma nova factory a partir do totvsresource, passando a URL do serviço de DBO
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin318/:id', {}, {});
		
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
	
	index.register.factory('mpl.boin318.Factory', boin318Factory);
	
	// **************************************************************************************
	// *** SERVICE
	// **************************************************************************************
	
	boin318Service.$inject = ['mpl.boin318.Factory'];
	function boin318Service(boin318Factory) {
		
		// definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, limitAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
            parameters.limit = limitAt;
             
            return boin318Factory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return boin318Factory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return boin318Factory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, model, callback) {
            return boin318Factory.updateRecord(id, model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return boin318Factory.deleteRecord(id, callback);
        };
	}
	
	index.register.service('mpl.boin318.Service', boin318Service);
			
});