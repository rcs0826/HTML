define(['index'], function(index) { 
	
	// *************************************************************************************
	// *** FACTORIES
	// *************************************************************************************
	boin390Factory.$inject = ['$totvsresource'];	
	function boin390Factory($totvsresource) {
		
		// definimos uma nova factory a partir do totvsresource, passando a URL do serviço de DBO
		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin390o/:pNrOrdProdu/:pItemPai/:pCodRoteiro/:pOpCodigo/:pItCodigo/:pCodRefer', {}, {});

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
            return this.TOTVSUpdate({pNrOrdProdu: id.pNrOrdProdu, pItemPai: id.pItemPai, pCodRoteiro: id.pCodRoteiro, pOpCodigo: id.pOpCodigo, pItCodigo: id.pItCodigo, pCodRefer: id.pCodRefer}, model, callback);
        };
         
        factory.deleteRecord = function (id, callback) {
            return this.TOTVSRemove({pNrOrdProdu: id.pNrOrdProdu, pItemPai: id.pItemPai, pCodRoteiro: id.pCodRoteiro, pOpCodigo: id.pOpCodigo, pItCodigo: id.pItCodigo, pCodRefer: id.pCodRefer}, callback);
        };
		
		return factory;
	}
	
	index.register.factory('mmi.boin390.Factory', boin390Factory);
	
	// **************************************************************************************
	// *** SERVICE
	// **************************************************************************************
	
	boin390Service.$inject = ['mmi.boin390.Factory'];
	function boin390Service(boin390Factory) {
		
		// definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, limitAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
            parameters.limit = limitAt;
             
            return boin390Factory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return boin390Factory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return boin390Factory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, model, callback) {
            return boin390Factory.updateRecord(id, model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return boin390Factory.deleteRecord(id, callback);
        };
	}
	
	index.register.service('mmi.boin390.Service', boin390Service);
			
});