define(['index'], function(index) { 
	
	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	bomn174Factory.$inject = ['$totvsresource'];	
	function bomn174Factory($totvsresource) {
		
		// definimos uma nova factory a partir do totvsresource, passando a URL do serviço de DBO
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn174//:pNrOrdProdu//:pCdTarefa//:pCdTurno', {}, {}, {});
		
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
         
        factory.deleteRecord = function (id, callback) {
        	return this.TOTVSRemove({pNrOrdProdu: id.pNrOrdProdu, pCdTarefa: id.pCdTarefa, pCdTurno: id.pCdTurno}, callback);
        };
		
		return factory;
	}
	
	index.register.factory('mmi.bomn174.Factory', bomn174Factory);
	
	// **************************************************************************************
	// *** SERVICE
	// **************************************************************************************
	
	bomn174Service.$inject = ['mmi.bomn174.Factory'];
	function bomn174Service(bomn174Factory) {
		
		// definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, limitAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
            parameters.limit = limitAt;
             
            return bomn174Factory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return bomn174Factory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return bomn174Factory.saveRecord(model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return bomn174Factory.deleteRecord(id, callback);
        };
	}
	
	index.register.service('mmi.bomn174.Service', bomn174Service);
			
});