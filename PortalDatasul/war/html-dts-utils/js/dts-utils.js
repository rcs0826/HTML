/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index'], function (index) {
    
    'use strict';

    /*####################################### Serviços #########################################*/
    function serviceUtils($rootScope, $filter) {         
        return {
            /* Function: parseValueRange 
               Realiza verificicação dos campos iniciais e finais*/
            parseValueRange: function (type, value) {
                var cReturn = "";
                switch (type) {
                    case 'stringrange':
                        /*Caso não tenha sido informado o valor final, filtra a busca usando o valor inicial + "*" (Inicia com [valor])*/
                        if (!value.end || value.end == " ") {
                            cReturn = value.start + "*";
                        } else {
                            cReturn = (value.start || " ") + ";" + value.end;
                        }
                    break;
                    case 'decimalrange':
                    case 'integerrange':
                        var RegExp  = /[\.]/g;
                        value.start = value.start.replace(RegExp, "");
                        value.end   = value.end.replace(RegExp, "");

                        /* Caso não tenha sido informado o valor final, assume o valor inicial */
                        if (!value.end || value.end == "") {
                            cReturn = (value.start || "0") + ";" + (value.start || "0");
                        } else {
                            cReturn = (value.start || "0") + ";" + value.end;
                        }
                    
                    break;
                    case 'daterange':
                        /*Caso não tenha sido informado o valor final, assume o valor inicial*/
                        if (!value.end || value.end == "") {
                           cReturn = value.start + ";" + value.start;
                        } else if (!value.start || value.start == ""){ /*Caso não tenha sido informado o valor final, assume o valor inicial*/
                           cReturn = value.end + ";" + value.end;
                        } else {
                           cReturn = value.start + ";" + value.end;
                        }
                    break;
                }
                return cReturn;
            },
            mountQueryProperties: function (zoomParameters) {
                var queryProperties     = {},
                    listOfProperties    = [],
                    listOfValues        = [],
                    initial             = zoomParameters.parameters.init,
                    disclaimers         = zoomParameters.parameters.disclaimers,
                    columnDefs          = zoomParameters.columnDefs,
                    propertyFields      = zoomParameters.propertyFields,
                    selectedFilter      = zoomParameters.parameters.selectedFilter,
                    selectedFilterValue = zoomParameters.parameters.selectedFilterValue,
                    isSelectValue       = zoomParameters.parameters.isSelectValue,
                    key;

                /* Parametros iniciais passados para o Zoom */
                /* Tratamento para a aplicacao de filtros */
                if (initial !== undefined && initial.hasOwnProperty('filters')) {
                    
                    for (key in initial.filters) {
                        if (initial.filters[key] !== undefined) {
                            listOfProperties.push(key);
                            listOfValues.push(initial.filters[key]);
                        } else {
                            listOfProperties.push(key);
                            listOfValues.push("");
                        }
                    }
                }
               
                /* Montagem da clausula fields utilizando como base as colunas que 
                   serao apresentadas e/ou estarao no(s) filtro(s) */
                if (columnDefs) {

                    queryProperties.fields = this.mountFields(columnDefs);

                    if (disclaimers) {

                        disclaimers.forEach(function (disclaimer) {

                            /* Verifica se algum disclaimer informado nao esta na clausula fields */
                            var isField = columnDefs.some(function (column) {
                                return column.field === disclaimer.property;
                            });

                            /* Insere na clausula fields o campo relacionado ao disclaimer 
                               caso esteja apenas como filtro */
                            if (!isField && disclaimer.property.substring(0, 1) !== "_") {
                                queryProperties.fields += "," + disclaimer.property;
                            }
                        });
                    }
                }
                
                /* Parametros iniciais passados para o Zoom */
                /* Tratamento para adicionar fields que não estejam como colunas do zoom */
                if (initial !== undefined && initial.hasOwnProperty('addFields')) {
                    
                    if (queryProperties.fields === "") {
                        queryProperties.fields = initial.addFields;
                    } else {
                        queryProperties.fields += "," + initial.addFields;
                    }
                }

                /* Montagem dos filtros com base nos disclaimers (Busca simples ou avancada) */
                if (disclaimers) {
                    
                    var _this = this;
                    disclaimers.forEach(function (disclaimer) {

                        var value;
                        if (disclaimer.value) {
                            switch (disclaimer.type) {
                            case 'string':
                                value = (disclaimer.value) ? ("*" + disclaimer.value + "*") : undefined;
                                break;
                            case 'date':
                            case 'integer':
                            case 'decimal':
                                value = disclaimer.value || undefined;
                                break;
                            case 'stringextend':
                                if (disclaimer.extend) {
                                    switch (disclaimer.extend) {
                                    case 1:
                                        value = disclaimer.value;
                                        break;
                                    case 2:
                                        value = "*" + disclaimer.value + "*";
                                        break;
                                    case 3:
                                        value = disclaimer.value + "*";
                                        break;
                                    default:
                                        value = undefined;
                                        break;
                                    }
                                } else {
                                    value = disclaimer.value;
                                }
                                break;                                
                            case 'decimalrange':
                            case 'integerrange':
                            case 'stringrange':
                                if (disclaimer.value) {
                                    value = _this.parseValueRange(disclaimer.type, disclaimer.value);
                                } else {
                                    value = ";";
                                }
                                break;
                            case 'daterange':
                                if (disclaimer.value) {
                                    /* Caso os valores de data inicial e final venham nulos, apaga o array*/
                                    if (!disclaimer.value.start && !disclaimer.value.end){                                        
                                        var index = disclaimers.indexOf(disclaimer);
                                        if (index > -1) {
                                            disclaimers.splice(index, 1);
                                        }
                                    } else {
                                        value = _this.parseValueRange(disclaimer.type, disclaimer.value);
                                    }
                                } else {
                                    value = ";";
                                }
                                break;
                            default:
                                value = "*" + disclaimer.value + "*";
                                break;
                            }
                        }                       

                        /* Atribui o value com base no propertyList (para legendas e logico) */
                        if (disclaimer.propertyList) {
                            if (disclaimer.value && disclaimer.value.value !== undefined) {
                                value = disclaimer.value.value;
                            } else if (disclaimer.value && disclaimer.value.id !== undefined) {
                                value = disclaimer.value.id;
                            } else {
                                value = undefined;
                            }
                        }

                        if (value !== undefined) {
                            listOfProperties.push(disclaimer.property);
                            listOfValues.push(value);
                        }
                    });
                } else {

                    if (selectedFilter) {

                        if (selectedFilter.property && selectedFilter.property.substring(0, 1) !== "_") {

                            listOfProperties.push(selectedFilter.property);
                            listOfValues.push("*" + selectedFilterValue + "*");

                        }
                    }
                }

                if (listOfProperties.length === listOfValues.length &&
                        listOfProperties.length > 0) {

                    queryProperties.property = listOfProperties;
                    queryProperties.value = listOfValues;

                }

                return queryProperties;

            },

            mountQueryWhere: function (params) {
                
                var query = "",
                    key,
                    // replace utilizado para tratar consultas com aspas simples
                    stringValue = params.parameters.selectedFilterValue ? params.parameters.selectedFilterValue.replace(/'/g, "''") : "";

                /* monta clausula where com matches entre id e descrição*/
                params.matches.forEach(function (value) {
                    if (query === "") {
                        query = "( " + value + " matches '" + stringValue + "*' ";
                    } else {
                        query += " OR " + value + " matches '" + stringValue + "*' ";
                    }
                });

                query += " )";
                
                /* Adiciona parametros iniciais na clausula where */
                if (params.parameters.init && params.parameters.init.hasOwnProperty('filters')) {

                    for (key in params.parameters.init.filters) {
                        if (params.parameters.init.filters[key] !== undefined) {
                            query += " AND " + key + " = '" + params.parameters.init.filters[key] + "'";
                        }
                    }
                }
                
                return {
                    where: query,
                    fields: this.mountFields(params.columnDefs)
                };
                
            },
            
            mountFields: function (columnDefs) {
                var fields = "";

                /* Inclui como field todas as colunas que foram informadas */
                columnDefs.forEach(function (value) {

                    /* Ignora campos extra (que nao pertencem a tabela) */
                    if (value.field && value.field.substring(0, 1) !== "_") {

                        if (fields === "") {
                            fields = value.field;
                        } else {
                            fields += "," + value.field;
                        }
                    }
                });

                return fields;

            }
        };
    }

    serviceUtils.$inject = ['$rootScope', '$filter'];
    index.register.service('dts-utils.utils.Service', serviceUtils);

});
