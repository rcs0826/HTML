define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    crossSellingFactory.$inject = ['$totvsresource'];
    function crossSellingFactory($totvsresource) {
         
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi574/:method/:codProduto/:codCrossSelling',{},{});
         
        // implementamos um metodo findRecords para abstrair a chamada ao resource
        factory.findRecords = function (parameters, callback) {
            return this.TOTVSQuery(parameters, callback,{noErrorMessage: true});
        };
         
        // implementamos tambem o getRecord e todos os outros metodos de CRUD
        factory.getRecord = function (id, idcrossselling, callback) {
            id = stringValidate(id);
            idcrossselling = stringValidate(idcrossselling);
            return this.TOTVSGet({codProduto: id, codCrossSelling: idcrossselling}, callback);
        };
         
        factory.saveRecord = function (model, callback) {
            return this.TOTVSSave({}, model, callback);
        };
         
        factory.updateRecord = function (id, idcrossselling, model, callback) {
            id = stringValidate(id);
            idcrossselling = stringValidate(idcrossselling);    
            return this.TOTVSUpdate({codProduto: id, codCrossSelling: idcrossselling}, model, callback);
        };
         
        factory.deleteRecord = function (id, idcrossselling, callback) {
            id = stringValidate(id);
            idcrossselling = stringValidate(idcrossselling);
            return this.TOTVSRemove({codProduto: id, codCrossSelling: idcrossselling}, callback);
        };
         
        return factory;
    }

 
    // **************************************************************************************
    // *** Validação de dados (verifica se string começa com ponto e se esta em branco)
    // **************************************************************************************     
    function stringValidate(value) {         
         if(value.substring(0,1) == '.') value = '/' + value;
         if((value == "") || (value == undefined)) value = " ";
         return value;
    }
         
    // **************************************************************************************
    // *** SERVICE
    // **************************************************************************************
     
    crossSellingService.$inject = ['mpd.productcrossselling.Factory'];
    function crossSellingService(crossSellingFactory) {
         
        // definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
                
            return crossSellingFactory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (id, idcrossselling, callback) {
            return crossSellingFactory.getRecord(id, idcrossselling, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return crossSellingFactory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (id, idcrossselling, model, callback) {
            return crossSellingFactory.updateRecord(id, idcrossselling, model, callback);
        };
         
        this.deleteRecord = function (id, idcrossselling, callback) {
            return crossSellingFactory.deleteRecord(id, idcrossselling, callback);
        };
    }
        
    index.register.service('mpd.productcrossselling.Service', crossSellingService);    
    index.register.factory('mpd.productcrossselling.Factory', crossSellingFactory);     
});
