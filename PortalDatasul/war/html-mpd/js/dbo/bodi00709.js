define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    portalModelValFactory.$inject = ['$totvsresource'];
    function portalModelValFactory($totvsresource) {
         
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi00709/:method/:idModel/:id',{},{});
         
        // implementamos um metodo findRecords para abstrair a chamada ao resource
        factory.findRecords = function (parameters, callback) {            
            return this.TOTVSQuery(parameters, callback,{noErrorMessage: true});
        };
         
        // implementamos tambem o getRecord e todos os outros metodos de CRUD
        factory.getRecord = function (idModel, id, callback) {
            return this.TOTVSGet({idModel : idModel, id : id}, callback);
        };
         
        factory.saveRecord = function (model, callback) {
            return this.TOTVSSave({}, model, callback);
        };
         
        factory.updateRecord = function (idModel, id, model, callback) {
            return this.TOTVSUpdate({idModel : idModel, id: id}, model, callback);
        };
         
        factory.deleteRecord = function (idModel, id, callback) {
            return this.TOTVSRemove({idModel : idModel, id: id}, callback);
        };

        return factory;
    }    
             
    // **************************************************************************************
    // *** SERVICE
    // **************************************************************************************
     
    portalModelValService.$inject = ['mpd.portalmodelval.Factory'];
    function portalModelValService(portalModelValFactory) {
         
        // definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
                
            return portalModelValFactory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (idModel, id, callback) {
            return portalModelValFactory.getRecord(idModel, id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return portalModelValFactory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (idModel, id, model, callback) {
            return portalModelValFactory.updateRecord(idModel, id, model, callback);
        };
         
        this.deleteRecord = function (idModel, id, callback) {
            return portalModelValFactory.deleteRecord(idModel, id, callback);
        };
    }
        
    index.register.service('mpd.portalmodelval.Service', portalModelValService);
    index.register.factory('mpd.portalmodelval.Factory', portalModelValFactory);
});