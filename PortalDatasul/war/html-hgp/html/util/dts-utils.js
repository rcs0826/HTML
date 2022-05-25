/*jslint plusplus: true, devel: false, forin: true, indent: 4, maxerr: 50 */
/*global define, angular, $, TOTVSEvent */
define(['index',
    '/dts/hgp/html/js/util/DateTools.js'], function (index) {
    
    'use strict';

    /*####################################### Serviços #########################################*/

    function serviceUtils($rootScope, $filter) {

        var isDateField = function(propertyName){
            if (propertyName.indexOf('dt') == 0
            || propertyName.indexOf('dat') == 0) {
                return true;
            }
            
            return false;
        };

        return {

            /* Funcao para converter o objeto de filtros de zoom (fixedFilters)
             * em um array de filtros
             */
            mountDisclaimers: function(fixedFiltersObject) {
                var fixedFilters = [];

                angular.forEach(fixedFiltersObject, function(value, key){

                    var filterAux = value.toString().split('@@');
                    
                    angular.forEach(filterAux,function(filter){
                        fixedFilters.push({property: key, value: filter});
                    });
                    
                });

                return fixedFilters;
            },

            /* Funcao para converter a lista de filtros para a tmpFilterValue
             * colocando os campos com o nome que estao no progress 
             */
            mountTmpFilterValue: function(disclaimers) {
                var tmpFilterValue = [];

                angular.forEach(disclaimers,function(filter){            

                    var record = {};

                    record.nmPropriedade = filter.property;
                    
                    if(isDateField(record.nmPropriedade) == true){
                        record.valorData = filter.value;
                    }
                     
                    record.valorCampo = filter.value;

                    if(angular.isUndefined(filter.operator) === false) {
                        record.nmOperacao = filter.operator;
                    }
                    
                    if(angular.isUndefined(filter.priority) === false) {
                        record.inPrioridade = filter.priority;
                    }

                    tmpFilterValue.push(record);
                });

                return tmpFilterValue;
            },
            
            /* Funcao para converter a lista de filtros para a tmpOrderFields
             * colocando os campos com o nome que estao no progress 
             */
            mountTmpOrderFields: function(orders) {
                var tmpOrderFields = [];

                angular.forEach(orders,function(order){            
                    tmpOrderFields.push({
                        nmPropriedade : order.property,
                        lgAscendente : order.asc
                    });
                });

                return tmpOrderFields;
            },

            mountQueryProperties: function (zoomParameters) {

                var queryProperties     = { loadNumRegisters : true},
                    listOfProperties    = [],
                    listOfValues        = [],
                    listOfDateValues    = [],
                    listOfOperators     = [],
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
                            
                            if(isDateField(key) == true){
                                listOfDateValues.push(initial.filters[key]);
                            }else{
                                listOfDateValues.push("");
                            }
                        } else {
                            listOfProperties.push(key);
                            listOfValues.push("");
                            listOfDateValues.push("");
                        }
                        listOfOperators.push("");
                        
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

                    disclaimers.forEach(function (disclaimer) {

                        var value;
                        if (disclaimer.value) {
                            switch (disclaimer.type) {
                            case 'string':
                                value = (disclaimer.value) ? (disclaimer.value) : undefined;
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
                                        value = disclaimer.value;
                                        break;
                                    case 3:
                                        value = disclaimer.value;
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
                                if (disclaimer.value) {
                                    value = (disclaimer.value.start || "0") + ";" + (disclaimer.value.end || "0");
                                } else {
                                    value = "";
                                }
                                break;
                            case 'stringrange':
                            case 'daterange':
                                if (disclaimer.value) {
                                    value = (disclaimer.value.start || "") + ";" + (disclaimer.value.end || "");
                                } else {
                                    value = ";";
                                }
                                break;
                            default:
                                value = disclaimer.value;
                                break;
                            }
                        }

                        /* Atribui o value com base no propertyList (para legendas e logico) */
                        if (disclaimer.propertyList) {
                            if (disclaimer.value.value !== undefined) {
                                value = disclaimer.value.value;
                            } else if (disclaimer.value.id !== undefined) {
                                value = disclaimer.value.id;
                            } else {
                                value = undefined;
                            }
                        }

                        if (value !== undefined) {
                            if(isSelectValue == true){
                                listOfProperties.push('simpleFilter');
                                listOfDateValues.push('');
                                queryProperties.loadNumRegisters = false;
                                
                            }else{
                                listOfProperties.push(disclaimer.property);
                                
                                if(isDateField(disclaimer.property) == true){
                                    listOfDateValues.push(value);
                                }else{
                                    listOfDateValues.push('');
                                }
                            }
                            
                            listOfValues.push(value);                                

                            if (disclaimer.operator) {
                                listOfOperators.push(disclaimer.operator);
                            }else{
                                listOfOperators.push('');
                        }
                        }
                    });
                } else {

                    if (selectedFilter) {

                        if (selectedFilter.property && selectedFilter.property.substring(0, 1) !== "_") {
                            listOfProperties.push(selectedFilter.property);
                            listOfValues.push(selectedFilterValue);
                            listOfOperators.push('');
                            listOfDateValues.push('');

                        }
                    }
                }

                if (listOfProperties.length === listOfValues.length &&
                        listOfProperties.length > 0) {

                    queryProperties.property = listOfProperties;
                    queryProperties.value = listOfValues;
                    queryProperties.operator = listOfOperators;
                    queryProperties.dat = listOfDateValues;

                }

                return queryProperties;

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

                },

                zeroPad: function (num, places) {
                    var zero = places - num.toString().length + 1;
                    return Array(+(zero > 0 && zero)).join("0") + num;
                },

                mountExecution: function (executionModel, scheduleModel, server) {
                    var executionList = [];
                    var dateUndefined;
                    var fromDate;
                    var fromTime;

                    /*-Nao informada a data para agendamento-*/
                    if (executionModel.schedule.date == undefined || executionModel.schedule.type == "TODAY") {
                        fromDate = new Date();
                        dateUndefined = true;
                    }
                    else {
                        fromDate = new Date(executionModel.schedule.date);
                    }

                    /*Nao informada a hora para agendamento*/
                    if (executionModel.schedule.time == undefined ||
                        executionModel.schedule.type == "TODAY") {
                        fromTime = this.zeroPad(fromDate.getHours(), 2) + ":" + this.zeroPad(fromDate.getMinutes(), 2) + ":" + this.zeroPad(fromDate.getSeconds(), 2);
                    }
                    else {
                        fromTime = this.zeroPad(executionModel.schedule.time,5) + ":00";
                    }

                    var fromTimeArray = fromTime.split(':');
                    var fromTimeMilli = ((+fromTimeArray[0]) * 60 * 60 + (+fromTimeArray[1]) * 60) * 1000;
                    
                    if(!dateUndefined)
                        fromDate.addMilliseconds(fromTimeMilli);


                    /*-Agendamento Automático*/
                    if (scheduleModel.autoSchedule) {
                        var execution = {
                            executionDate: scheduleModel.autoScheduleDate,
                            executionTime: scheduleModel.autoScheduleTime,
                            executionServer: server
                        };
                        executionList.push(execution);
                        return executionList;
                    }
                    /*-Opção Executar Hoje e Agendar Para-*/

                    var execution = {
                        executionDate: new Date(fromDate).toString('dd/MM/yyyy'),
                        executionTime: fromTime,
                        executionServer: server
                    };

                    executionList.push(execution);


                    if (scheduleModel.repeat) {
                        var DAY_MILLI = 86400000;
                        var WEEK_MILLI = DAY_MILLI * 7;


                        var toTime = scheduleModel.repeatTime;
                        var toTimeArray = toTime.split(':');
                        var toTimeMilli = ((+toTimeArray[0]) * 60 * 60 + (+toTimeArray[1]) * 60) * 1000;
                        var toDate = new Date(scheduleModel.repeatFinishDate + toTimeMilli);

                        /*-Dias-*/
                        if (scheduleModel.repeatType == "D") {
                            for (var scheduleDate = fromDate.addMilliseconds(DAY_MILLI * scheduleModel.repeatCycle); scheduleDate <= toDate; scheduleDate.addMilliseconds(DAY_MILLI * scheduleModel.repeatCycle)) {
                                var execution = {
                                    executionDate: new Date(scheduleDate).toString('dd/MM/yyyy'),
                                    executionTime: toTime + ":00",
                                    executionServer: server
                                };
                                executionList.push(execution);
                            }
                        }

                        /*-Semana-*/
                        if (scheduleModel.repeatType == "W") {
                            for (var scheduleDate = fromDate.addMilliseconds(WEEK_MILLI * scheduleModel.repeatCycle); scheduleDate <= toDate; scheduleDate.addMilliseconds(WEEK_MILLI * (scheduleModel.repeatCycle - 1))) {
                                var weekLimit = new Date(fromDate);
                                weekLimit.addMilliseconds(WEEK_MILLI);
                                for (scheduleDate; scheduleDate <= weekLimit; scheduleDate.addMilliseconds(DAY_MILLI)) {
                                    if (scheduleDate.getDay() == 0 && !scheduleModel.repeatWeekDays.sunday)
                                        continue;
                                    else if (scheduleDate.getDay() == 1 && !scheduleModel.repeatWeekDays.monday)
                                        continue;
                                    else if (scheduleDate.getDay() == 2 && !scheduleModel.repeatWeekDays.tuesday)
                                        continue;
                                    else if (scheduleDate.getDay() == 3 && !scheduleModel.repeatWeekDays.wednesday)
                                        continue;
                                    else if (scheduleDate.getDay() == 4 && !scheduleModel.repeatWeekDays.thursday)
                                        continue;
                                    else if (scheduleDate.getDay() == 5 && !scheduleModel.repeatWeekDays.friday)
                                        continue;
                                    else if (scheduleDate.getDay() == 6 && !scheduleModel.repeatWeekDays.saturday)
                                        continue;

                                    var execution = {
                                        executionDate: new Date(scheduleDate).toString('dd/MM/yyyy'),
                                        executionTime: toTime + ":00",
                                        executionServer: server
                                    };
                                    executionList.push(execution);
                                }
                            }
                        }

                        /*-Mes-*/
                        if (scheduleModel.repeatType == "M") {
                            var scheduleDate = new Date(fromDate);
                            if (scheduleModel.repeatMonthDay.last == 'false')
                                scheduleDate.setDate(scheduleModel.repeatMonthDay.day);
                            else {
                                /*-Ultimo dia do mês-*/
                                scheduleDate.setMonth(scheduleDate.getMonth() + 1);
                                scheduleDate.setDate(0);
                            }
                            for (scheduleDate.setMonth(scheduleDate.getMonth() + scheduleModel.repeatCycle); scheduleDate <= toDate; scheduleDate.setMonth(scheduleDate.getMonth() + scheduleModel.repeatCycle)) {
                                if (scheduleModel.repeatMonthDay.last == 'true' &&
                                    scheduleDate.getDate() == 1)
                                    scheduleDate.setDate(0);

                                if (scheduleModel.repeatMonthDay)
                                    var execution = {
                                        executionDate: new Date(scheduleDate).toString('dd/MM/yyyy'),
                                        executionTime: toTime + ":00" ,
                                        executionServer: server
                                    };
                                executionList.push(execution);
                            }
                        }
                    }
                    return executionList;
            }
        };
    }

    serviceUtils.$inject = ['$rootScope', '$filter'];    
    index.register.service('dts-utils.utils.Service', serviceUtils);

});
