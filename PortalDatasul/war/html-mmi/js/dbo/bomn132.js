define(['index'], function(index) { 
    
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    bomn132Factory.$inject = ['$totvsresource'];    
    function bomn132Factory($totvsresource) {
        
        // definimos uma nova factory a partir do totvsresource, passando a URL do serviço de DBO
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn132//:pNrOrdProdu//:pCdTarefa//:pCdTpFerr', {}, {});
        
        // implementamos um metodo findRecords para abstrair a chamada ao resource
        factory.findRecords = function (parameters, callback) {
            return this.TOTVSQuery(parameters, callback, {noErrorMessage:true});
        };
        
        // implementamos tambem o getRecord e todos os outros metodos de CRUD
        factory.getRecord = function (id, callback) {
            return this.TOTVSGet({pNrOrdProdu: id.pNrOrdProdu, pCdTarefa: id.pCdTarefa}, callback, {noErrorMessage:true});
        };
         
        factory.saveRecord = function (model, callback) {
            return this.TOTVSSave({}, model, callback);
        };
         
        factory.updateRecord = function (id, model, callback) {
            return this.TOTVSUpdate({pNrOrdProdu: id.pNrOrdProdu, pCdTarefa: id.pCdTarefa, pCdTpFerr: id.pCdTpFerr}, model, callback);
        };
         
        factory.deleteRecord = function (id, callback) {
            return this.TOTVSRemove({pNrOrdProdu: id.pNrOrdProdu, pCdTarefa: id.pCdTarefa, pCdTpFerr: id.pCdTpFerr}, callback);
        };
        
        return factory;
    }
    
    index.register.factory('mmi.bomn132.Factory', bomn132Factory);
    
    // **************************************************************************************
    // *** SERVICE
    // **************************************************************************************
    
    bomn132Service.$inject = ['mmi.bomn132.Factory'];
    function bomn132Service(bomn132Factory) {
        
        // definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, limitAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
            parameters.limit = limitAt;
             
            return bomn132Factory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return bomn132Factory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return bomn132Factory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, model, callback) {
            return bomn132Factory.updateRecord(id, model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return bomn132Factory.deleteRecord(id, callback);
        };
    }
    
    index.register.service('mmi.bomn132.Service', bomn132Service);
            
});