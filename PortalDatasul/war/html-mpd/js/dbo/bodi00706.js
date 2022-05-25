define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    portalConfigurFactory.$inject = ['$totvsresource'];
    function portalConfigurFactory($totvsresource) {
        
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi00706/:method/:id');
         
        // implementamos um metodo findRecords para abstrair a chamada ao resource
        factory.findRecords = function (parameters, callback) {
            return this.TOTVSQuery(parameters, callback,{noErrorMessage: true});
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
             
    // **************************************************************************************
    // *** SERVICE
    // **************************************************************************************
     
    portalConfigurService.$inject = ['mpd.portalconfigpdp.Factory'];
    function portalConfigurService(portalConfigurFactory) {
         
        // definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
                
            return portalConfigurFactory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, callback) {
            return portalConfigurFactory.getRecord(id, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return portalConfigurFactory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, model, callback) {
            return portalConfigurFactory.updateRecord(id, model, callback);
        };
         
        this.deleteRecord = function (id, callback) {
            return portalConfigurFactory.deleteRecord(id, callback);
        };
        
        this.getLoadMoreInf = function (id, callback){
            return portalConfigurFactory.getLoadMoreInf(id,callback);
        }
    }

    index.register.service('mpd.portalconfigpdp.Service', portalConfigurService);
    index.register.factory('mpd.portalconfigpdp.Factory', portalConfigurFactory);
});