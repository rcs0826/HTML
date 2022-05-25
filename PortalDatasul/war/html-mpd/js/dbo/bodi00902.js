define(['index'], function(index) {
    // *************************************************************************************
    // *** FACTORIES
    // *************************************************************************************
    pedPagtoFactory.$inject = ['$totvsresource'];
    function pedPagtoFactory($totvsresource) {
         
        var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi00902/:method/:nomeAbrev/:nrPedCli',{},{});
         
        // implementamos um metodo findRecords para abstrair a chamada ao resource
        factory.findRecords = function (parameters, callback) {
            return this.TOTVSQuery(parameters, callback,{noErrorMessage: true});
        };
         
        // implementamos tambem o getRecord e todos os outros metodos de CRUD
        factory.getRecord = function (idnomeabrev, idnrpedcli, callback) {
            idnomeabrev = stringValidate(idnomeabrev);
            idnrpedcli = stringValidate(idnrpedcli);
            return this.TOTVSGet({nomeAbrev: idnomeabrev, nrPedCli: idnrpedcli}, callback);
        };
         
        factory.saveRecord = function (model, callback) {
            return this.TOTVSSave({}, model, callback);
        };
         
        factory.updateRecord = function (idnomeabrev, idnrpedcli, model, callback) {
            idnomeabrev = stringValidate(idnomeabrev);
            idnrpedcli = stringValidate(idnrpedcli);    
            return this.TOTVSUpdate({nomeAbrev: idnomeabrev, nrPedCli: idnrpedcli}, model, callback);
        };
         
        factory.deleteRecord = function (idnomeabrev, idnrpedcli, callback) {
            idnomeabrev = stringValidate(idnomeabrev);
            idnrpedcli = stringValidate(idnrpedcli);
            return this.TOTVSRemove({nomeAbrev: idnomeabrev, nrPedCli: idnrpedcli}, callback);
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
     
    pedPagtoService.$inject = ['mpd.pedpagto.Factory'];
    function pedPagtoService(pedPagtoFactory) {
         
        // definimos um service que usa a factory, nesses metodos abstraimos a chamada e tratamos outros detalhes da chamada.
        this.findRecords = function (startAt, parameters, callback) {
            if (!parameters) {
                parameters = {};
            }
            parameters.start = startAt;
                
            return pedPagtoFactory.findRecords(parameters, callback);
        };
         
        this.getRecord = function (idnomeabrev, idnrpedcli, callback) {
            return pedPagtoFactory.getRecord(idnomeabrev, idnrpedcli, callback);
        };
         
        this.saveRecord = function (model, callback) {
            return pedPagtoFactory.saveRecord(model, callback);
        };
         
        this.updateRecord = function (idnomeabrev, idnrpedcli, model, callback) {
            return pedPagtoFactory.updateRecord(idnomeabrev, idnrpedcli, model, callback);
        };
         
        this.deleteRecord = function (idnomeabrev, idnrpedcli, callback) {
            return pedPagtoFactory.deleteRecord(idnomeabrev, idnrpedcli, callback);
        };
    }
        
    index.register.service('mpd.pedpagto.Service', pedPagtoService);    
    index.register.factory('mpd.pedpagto.Factory', pedPagtoFactory);     
});
