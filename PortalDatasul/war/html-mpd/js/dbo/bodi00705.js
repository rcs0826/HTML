define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    relatIssuerEstabFactory.$inject = ['$totvsresource'];
    function relatIssuerEstabFactory($totvsresource) {
         
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi00705/:method/:codEstabel/:codEmitente',{},{});
         
        // implementamos um metodo findRecords para abstrair a chamada ao resource
        factory.findRecords = function (parameters, callback) {
            return this.TOTVSQuery(parameters, callback,{noErrorMessage: true});
        };
         
        // implementamos tambem o getRecord e todos os outros metodos de CRUD
        factory.getRecord = function (codEstabel, codEmitente, callback) {
            codEstabel = stringValidate(codEstabel);
            return this.TOTVSGet({codEstabel: codEstabel, codEmitente: codEmitente}, callback);
        };
         
        factory.saveRecord = function (model, callback) {
            return this.TOTVSSave({}, model, callback);
        };
         
        factory.updateRecord = function (codEstabel, codEmitente, model, callback) {
            codEstabel = stringValidate(codEstabel);
            return this.TOTVSUpdate({codEstabel: codEstabel, codEmitente: codEmitente}, model, callback);
        };
         
        factory.deleteRecord = function (codEstabel, codEmitente, callback) {
            codEstabel = stringValidate(codEstabel);
            return this.TOTVSRemove({codEstabel: codEstabel, codEmitente: codEmitente}, callback);
        };
         
        return factory;
    }
 
    // **************************************************************************************
    // *** Validação de dados (verifica se string começa com ponto e se está em branco)
    // **************************************************************************************     
    function stringValidate(value) {         
         if(value.substring(0,1) == '.') value = '/' + value;
         if((value == "") || (value == undefined)) value = " ";
         return value;
    }
         
    // **************************************************************************************
    // *** SERVICE
    // **************************************************************************************
     
    relatIssuerEstabService.$inject = ['mpd.relatissuerestab.Factory'];
    function relatIssuerEstabService(relatIssuerEstabFactory) {
         
        // definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
                
            return relatIssuerEstabFactory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (codEstabel, codEmitente, callback) {
            return relatIssuerEstabFactory.getRecord(codEstabel, codEmitente, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return relatIssuerEstabFactory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (codEstabel, codEmitente, model, callback) {
            return relatIssuerEstabFactory.updateRecord(codEstabel, codEmitente, model, callback);
        };
         
        this.deleteRecord = function (codEstabel, codEmitente, callback) {
            return relatIssuerEstabFactory.deleteRecord(codEstabel, codEmitente, callback);
        };
    }
        
    index.register.service('mpd.relatissuerestab.Service', relatIssuerEstabService);    
    index.register.factory('mpd.relatissuerestab.Factory', relatIssuerEstabFactory);     
});
