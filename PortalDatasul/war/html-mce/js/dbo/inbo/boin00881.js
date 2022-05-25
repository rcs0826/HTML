define(['index'], function(index) {
    
	boin00881_Factory.$inject = ['$totvsresource'];
	function boin00881_Factory($totvsresource) {

		var factory = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin00881/:method/:codEstab//:itCodigo/:codDepos/:datInicBloq');
        
        factory.getRecord = function (params, callback) {
            return this.TOTVSGet(params, callback);
        };
         
        factory.saveRecord = function (model, callback) {
            return this.TOTVSSave({}, model, callback);
        };
         
        factory.updateRecord = function (id, model, callback) {
            return this.TOTVSUpdate(id, model, callback);
        };
         
        factory.deleteRecord = function (id, callback) {
            return this.TOTVSRemove(id, callback);
        };
        
		factory.findRecords = function (parameters, callback) {
            // parameters.start  – define o registro inicial da busca dos dados
            // parameters.limit  – define a quantidade de registros a ser retornado a partir de start
            // parameters.where  – define uma clausula que será usada no WHERE da query
            // parameters.fields – define uma lista de campos que deverá ser retornado pela api
            // parameters.order  – define a ordem que os registros são lidos da tabela
            
            // parameters.properties - Parametros para serem usados em par:
            //      parameters.properties.property – nome de um campo para ser usado como pesquisa
            //      parameters.properties.value – valor para ser usado como pesquisa ao campo correspondente
            
            var Parameters = {};
            if (parameters) {
                var properties = [];
                var values     = [];                
                
                if (parameters.properties){
                    if (parameters.properties instanceof Array) {
                        for (var i = 0; i < parameters.properties.length; i++) {
                            var disclaimer = parameters.properties[i];
                            properties.push(disclaimer.property);
                            values.push(disclaimer.value);
                        }
                    } else if (parameters.properties.property) {
                        properties.push(parameter.property);
                        values.push(parameter.value);
                    };
                };
                Parameters.start  = parameters.start  ? parameters.start  : undefined ;
                Parameters.limit  = parameters.limit  ? parameters.limit  : undefined ;
                Parameters.where  = parameters.where  ? parameters.where  : undefined ;
                Parameters.fields = parameters.fields ? parameters.fields : undefined ;
                Parameters.order  = parameters.order  ? parameters.order  : undefined ;
                Parameters.property = properties ? properties : undefined;
                Parameters.value = values ? values : undefined;
                
            }           
            return this.TOTVSQuery(Parameters, callback, {noErrorMessage: true});
        };
        
        return factory;
	}
	
	index.register.factory('mce.boin00881.factory', boin00881_Factory);	

});