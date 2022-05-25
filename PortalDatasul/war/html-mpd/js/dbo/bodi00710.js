define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    portalMsgFactory.$inject = ['$totvsresource'];
    function portalMsgFactory($totvsresource) {
         
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi00710/:method/:idPortalConfigur/:id',{},{});
         
        // implementamos um metodo findRecords para abstrair a chamada ao resource
        factory.findRecords = function (parameters, callback) {            
            return this.TOTVSQuery(parameters, callback,{noErrorMessage: true});
        };
         
        // implementamos tambem o getRecord e todos os outros metodos de CRUD
        factory.getRecord = function (idPortalConfigur, id, callback) {
            return this.TOTVSGet({idPortalConfigur : idPortalConfigur, id : id}, callback);
        };
         
        factory.saveRecord = function (model, callback) {
            return this.TOTVSSave({}, model, callback);
        };
         
        factory.updateRecord = function (idPortalConfigur, id, model, callback) {
            return this.TOTVSUpdate({idPortalConfigur : idPortalConfigur, id: id}, model, callback);
        };
         
        factory.deleteRecord = function (idPortalConfigur, id, callback) {
            return this.TOTVSRemove({idPortalConfigur : idPortalConfigur, id: id}, callback);
        };

        return factory;
    }
         
    // **************************************************************************************
    // *** SERVICE
    // **************************************************************************************
     
    portalMsgService.$inject = ['mpd.portalmsg.Factory'];
    function portalMsgService(portalMsgFactory) {
         
        // definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
                
            return portalMsgFactory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (idPortalConfigur, id, callback) {
            return portalMsgFactory.getRecord(idPortalConfigur, id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return portalMsgFactory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (idPortalConfigur, id, model, callback) {
            return portalMsgFactory.updateRecord(idPortalConfigur, id, model, callback);
        };
         
        this.deleteRecord = function (idPortalConfigur, id, callback) {
            return portalMsgFactory.deleteRecord(idPortalConfigur, id, callback);
        };
    }
        
    index.register.service('mpd.portalmsg.Service', portalMsgService);
    
    index.register.factory('mpd.portalmsg.Factory', portalMsgFactory); 
    
});