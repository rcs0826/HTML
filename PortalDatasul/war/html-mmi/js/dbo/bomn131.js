define(['index'], function(index) { 
	
	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	bomn131Factory.$inject = ['$totvsresource'];	
	function bomn131Factory($totvsresource) {
		
		// definimos uma nova factory a partir do totvsresource, passando a URL do serviço de DBO
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn131//:pNrOrdProdu//:pCdTarefa//:pTpEspecial', {}, {});
		
		// implementamos um metodo findRecords para abstrair a chamada ao resource
		factory.findRecords = function (parameters, callback) {
            return this.TOTVSQuery(parameters, callback, {noErrorMessage:true});
        };
		
		// implementamos tambem o getRecord e todos os outros metodos de CRUD
        factory.getRecord = function (id, callback) {
            return this.TOTVSGet({pNrOrdProdu: id.pNrOrdProdu, pCdTarefa: id.pCdTarefa, pTpEspecial: id.pTpEspecial}, callback, {noErrorMessage:true});
        };
         
        factory.saveRecord = function (model, callback) {
            return this.TOTVSSave({}, model, callback);
        };
         
        factory.updateRecord = function (id, model, callback) {
            return this.TOTVSUpdate({pNrOrdProdu: id.pNrOrdProdu, pCdTarefa: id.pCdTarefa, pTpEspecial: id.pTpEspecial}, model, callback);
        };
         
        factory.deleteRecord = function (id, callback) {
            return this.TOTVSRemove({pNrOrdProdu: id.pNrOrdProdu, pCdTarefa: id.pCdTarefa, pTpEspecial: id.pTpEspecial}, callback);
        };
		
		return factory;
	}
	
	index.register.factory('mmi.bomn131.Factory', bomn131Factory);
	
	// **************************************************************************************
	// *** SERVICE
	// **************************************************************************************
	
	bomn131Service.$inject = ['mmi.bomn131.Factory'];
	function bomn131Service(bomn131Factory) {
		
		// definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, limitAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
            parameters.limit = limitAt;
             
            return bomn131Factory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return bomn131Factory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return bomn131Factory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, model, callback) {
            return bomn131Factory.updateRecord(id, model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return bomn131Factory.deleteRecord(id, callback);
        };
	}
	
	index.register.service('mmi.bomn131.Service', bomn131Service);
			
});