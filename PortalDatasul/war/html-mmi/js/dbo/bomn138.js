define(['index'], function(index) { 
	
	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
    bomn138Factory.$inject = ['$totvsresource'];	

	function bomn138Factory($totvsresource) {
		
		// definimos uma nova factory a partir do totvsresource, passando a URL do serviço de DBO
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn138//:pNrOrdProdu//:pCdTarefa//:pNrOrdPredec//:pTarefaPred', {}, {}, {},{},{});
		
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
        	return this.TOTVSUpdate({pNrOrdProdu: id.pNrOrdProdu, pCdTarefa: id.pCdTarefa, pNrOrdPredec: id.pNrOrdPredec, pTarefaPred: id.pTarefaPred}, model, callback);
            
        };
         
        factory.deleteRecord = function (id, callback) {
        	return this.TOTVSRemove({pNrOrdProdu: id.pNrOrdProdu, pCdTarefa: id.pCdTarefa, pNrOrdPredec: id.pNrOrdPredec, pTarefaPred: id.pTarefaPred}, callback);
        };
		
		return factory;
	}
	
	index.register.factory('mmi.bomn138.Factory', bomn138Factory);
	
	// **************************************************************************************
	// *** SERVICE
	// **************************************************************************************
	
	bomn138Service.$inject = ['mmi.bomn138.Factory'];
	function bomn138Service(bomn138Factory) {
		
		// definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, limitAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
            parameters.limit = limitAt;
             
            return bomn138Factory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return bomn138Factory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return bomn138Factory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, model, callback) {
            return bomn138Factory.updateRecord(id, model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return bomn138Factory.deleteRecord(id, callback);
        };
	}
	
	index.register.service('mmi.bomn138.Service', bomn138Service);
			
});