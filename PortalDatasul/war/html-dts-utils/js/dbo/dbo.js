/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */ 
/*global define, angular, $, TOTVSEvent */
define(['index'], function (index) {
    
    'use strict';

	function DBOFactory($totvsresource) {

        var factory = {};
        
        factory.getRecord = function (object, callback) {
            return this.TOTVSGet(object, callback);
        };

        factory.saveRecord = function (model, callback) {
            return this.TOTVSSave({}, model, callback);
        };

        factory.updateRecord = function (object, model, callback) {
            return this.TOTVSUpdate(object, model, callback);
        };
         
        factory.deleteRecord = function (object, callback) {
            return this.TOTVSRemove(object, callback);
        };

		factory.findRecords = function (parameters, callback) {

            // parameters.start               – define o registro inicial da busca dos dados
            // parameters.limit               – define a quantidade de registros a ser retornado a partir de start
            // parameters.where               – define uma clausula que será usada no WHERE da query
            // parameters.fields              – define uma lista de campos que deverá ser retornado pela api
            // parameters.order               – define a ordem que os registros são lidos da tabela
            // parameters.properties          - parametros para serem usados em par:
            // parameters.properties.property – nome de um campo para ser usado como pesquisa
            // parameters.properties.value    – valor para ser usado como pesquisa ao campo correspondente
            
            var queryParameters = {},
                properties      = [],
                values          = [],
                i,
                disclaimer;
            
            if (parameters) {
                
                if (parameters.properties) {
                    if (parameters.properties instanceof Array) {
                        for (i = 0; i < parameters.properties.length; i++) {
                            disclaimer = parameters.properties[i];
                            properties.push(disclaimer.property);
                            values.push(disclaimer.value);
                        }
                    } else if (parameters.properties.property) {
                        properties.push(parameters.properties.property);
                        values.push(parameters.properties.value);
                    }
                }
                
                queryParameters.start    = parameters.start  || undefined;
                queryParameters.limit    = parameters.limit  || undefined;
                queryParameters.where    = parameters.where  || undefined;
                queryParameters.fields   = parameters.fields || undefined;
                queryParameters.order    = parameters.order  || undefined;
                queryParameters.property = properties        || undefined;
                queryParameters.value    = values            || undefined;

            }
            
            return this.TOTVSQuery(queryParameters, callback);
            
        };
        
        return factory;
	}
	
    DBOFactory.$inject = ['$totvsresource'];
	index.register.factory('dts-utils.dbo.Factory', DBOFactory);

});