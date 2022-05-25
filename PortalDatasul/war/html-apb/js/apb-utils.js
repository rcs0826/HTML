/*jslint node: true */
/*jslint plusplus: true*/
'use strict';

// ***************************************
// *** Universal - Utils
// ***************************************

var ApbEvent, ApbRestService, ApbURL, ApbUtil;

// Eventos
ApbEvent = {

};

// Servicos
ApbRestService = '/dts/datasul-rest/resources/api/fch/fchapb';

ApbURL = {

};

ApbUtil = {

	/**
	 * @name ApbUtil.isDefined
	 * @kind function
	 *
	 * @description
	 * Determines if a reference is defined.
	 *
	 * @param {*} value reference to check.
	 * @returns {boolean} true if 'value' is defined and not null.
	 */
	isDefined: function (value) {
		return (typeof value !== 'undefined') && (value !== null) && (value !== 'null');
	},

	/**
	 * @name ApbUtil.isUndefined
	 * @kind function
	 *
	 * @description
	 * Determines if a reference is undefined.
	 *
	 * @param {*} value reference to check.
	 * @returns {boolean} true if 'value' is undefined or null.
	 */
	isUndefined: function (value) {
		return (typeof value === 'undefined') || (value === null) || (value === 'null');
	}

};

/**
 * @name Array.prototype.move
 * @kind function
 *
 * @description
 * Change the position of the element inside an array.
 *
 * @param {integer} $from position of the element.
 * @param {integer} $to position of the element.
 * @returns {Array} the array itself.
 */
Array.prototype.move = function ($from, $to) {

	while ($from < 0) {
		$from += this.length;
	}

	while ($to < 0) {
		$to += this.length;
	}

	if ($to >= this.length) {
		var k = $to - this.length;
		while ((k--) + 1) {
			this.push(undefined);
		}
	}

	this.splice($to, 0, this.splice($from, 1)[0]);
};



/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index'], function (index) {
    
    'use strict';

    /*####################################### Filtros ##########################################*/
    
    /* Filtro...: booleanFormat
       Descrição: Formata um valor boolean (true/false)
       Retorno..: Sim ou Nao (Conforme i18n)
    */
    function booleanFormat($rootScope) {
        
		return function (sentence, params) {

            if (sentence) {
                return $rootScope.i18n('l-yes', undefined, 'dts/apb');
            } else {
                return $rootScope.i18n('l-no', undefined, 'dts/apb');
            }
	    };
	}
    booleanFormat.$inject = ['$rootScope'];
	index.register.filter('booleanFormat', booleanFormat);
    
    function linkFormat($rootScope) {
        var urls = /(\b(https?|ftp):\/\/[A-Z0-9+&@#\/%?=~_|!:,.;-]*[-A-Z0-9+&@#\/%=~_|])/gim;
        return function(text) {
            if(text.match(urls)) {
                text = text.replace(urls, '<a target="_blank" href="$1">$1</a>');
            }
            return (text);
        };
    }
    linkFormat.$inject = ['$rootScope'];
    index.register.filter('linkFormat', linkFormat);
    /* Filtro...: dateFormat
       Descrição: Formata um valor data
       Retorno..: Formato Conforme i18n
    */
    function dateFormat($rootScope, $filter) {
        
		return function (sentence, params) {
            
            var filterDate = $filter('date'),
                dateF      = $rootScope.i18n('l-date-format', undefined, 'dts/apb');

            return filterDate(sentence, dateF);
            
	    };
	}
    dateFormat.$inject = ['$rootScope', '$filter'];
	index.register.filter('dateFormat', dateFormat);
    
    /* Filtro...: convertSize
       Descrição: retorna o tamanho do arquivo convertendo para Bytes, KB, MB, ...
       Retorno..: sizeinbytes
    */
    function convertSize($rootScope) {
        
		return function (sentence, params) {
            
            var bytessize     = sentence,
                sizes         = ['Bytes', 'KB', 'MB', 'GB', 'TB'],
                convertedsize,
                i;
            
            if (!bytessize || bytessize === 0) {
                
                convertedsize = '0 Byte';
                return convertedsize;
                
            }
            
            i             = parseInt(Math.floor(Math.log(bytessize) / Math.log(1024)), 10);
            convertedsize = Math.round(bytessize / Math.pow(1024, i), 2) + ' ' + sizes[i];

            return convertedsize;

	    };
	}
    convertSize.$inject = ['$rootScope'];
	index.register.filter('convertSize', convertSize);

    /*####################################### Serviços #########################################*/
    
	function serviceHelper($rootScope, $filter, $timeout, factory) {
        
        var service = {};
        
        /* Função....: formatBoolean
           Descrição.: Retorna um valor formatado de true/false para Sim/Não
           Parâmetros: value
        */
        service.formatBoolean = function (value) {

            if (value === true) {
                return $rootScope.i18n('l-yes', undefined, 'dts/apb');
            } else {
                return $rootScope.i18n('l-no', undefined, 'dts/apb');
            }
        };
        
        /* Função....: formatDate
           Descrição.: Retorna um valor formatado de "date" para 99/99/9999
           Parâmetros: value
        */
        service.formatDate = function (value) {

            var filterDate = $filter('date'),
                dateFormat = $rootScope.i18n('l-date-format', undefined, 'dts/apb');

            return filterDate(value, dateFormat);

        };
        
        /* Função....: formatDecimal
           Descrição.: Retorna um valor formatado de "decimal" para R$ 99...n,99...n
           Parâmetros: value
        */
        service.formatDecimal = function (value, symbol, fractionSize) {

            var filterDecimal = $filter('currency');
            return filterDecimal(value, symbol, fractionSize);

        };
        
        /* Função....: formatNumber
           Descrição.: Retorna um valor formatado de "number" para 99...n,99...n
           Parâmetros: value
        */
        service.formatNumber = function (value, fractionSize) {

            var filterNumber = $filter('number');
            return filterNumber(value, fractionSize);

        };

        /* Função....: parseDisclaimersToModel
           Descrição.: Transforma uma lista de disclaimers no objeto model
           Parâmetros: disclaimers, callback
        */
        service.parseDisclaimersToModel = function (disclaimers, callback) {
            
            var searchModel = {},
                i,
                disclaimer,
                property;

            disclaimers = disclaimers || [];

            for (i = 0; i < disclaimers.length; i++) {

                disclaimer = disclaimers[i];

                if (disclaimer.model !== undefined) {

                    property = disclaimer.property;

                    if (disclaimer.model.property !== undefined) {
                        property = disclaimer.model.property;
                    }

                    searchModel[property] = disclaimer.model.value;

                } else {
                    
                    searchModel[disclaimer.property] = disclaimer.value;
                    
                }
            }

            if (callback) {
                callback(searchModel, disclaimers);
            }
        };

        /* Função....: parseDateRangeToDisclaimer
           Descrição.: Retorna um disclaimer com base em um range de datas
           Parâmetros: range, property, label, fixed
        */
        service.parseDateRangeToDisclaimer = function (range, property, label, dtsModule, fixed) {

            var disclaimer = {
                property: property,
                title: $rootScope.i18n(label, undefined, dtsModule) + ': ',
                fixed: fixed,
                model: { property: property, value: range }
            },
                startDateLabel = this.formatDate(range.start);

            if (range.end) {
                disclaimer.title += startDateLabel          + ' ' +
                                    $rootScope.i18n('l-to', undefined, 'dts/apb') + ' ' +
                                    this.formatDate(range.end);
            } else {
                disclaimer.title += $rootScope.i18n('l-after-prep', undefined, 'dts/apb') + ' ' + startDateLabel;
            }

            disclaimer.value = range.start + ';' + (range.end || '');

            return disclaimer;

        };
        
        /* Função....: parseCharRangeToDisclaimer
           Descrição.: Retorna um disclaimer com base em um range de strings
           Parâmetros: range, property, label, fixed
        */
        service.parseCharRangeToDisclaimer = function (range, property, label, dtsModule, fixed) {

            var disclaimer = {
                property: property,
                title: $rootScope.i18n(label, undefined, dtsModule) + ': ',
                fixed: fixed,
                model: { property: property, value: range }
            };

            if (range.start !== "") {
                disclaimer.title += $rootScope.i18n('l-between', undefined, 'dts/apb') + ' "' +
                                    range.start                  + '" ' +
                                    $rootScope.i18n('l-and', undefined, 'dts/apb')     + ' "' +
                                    range.end                    + '"';
            } else {
                disclaimer.title += $rootScope.i18n('l-between', undefined, 'dts/apb') + ' " " ' +
                                    $rootScope.i18n('l-and', undefined, 'dts/apb')     + ' "'    +
                                    range.end                    + '"';
            }
            
            disclaimer.value = range.start + ';' + (range.end || '');

            return disclaimer;

        };

        /* Função....: parseTypeToDisclaimer
           Descrição.: Converte um tipo de model em disclaimer
           Parâmetros: type, key, model, title, fixed, tooltip
        */
        service.parseTypeToDisclaimer = function (type, key, model, title, dtsModule, fixed, fields) {
            
            var disclaimer = {property: key,
                              value: model,
                              title: $rootScope.i18n(title, undefined, dtsModule) + ': ',
                              fixed: fixed
                             },
                code,
                desc;

            switch (type) {

            case 'char':
                disclaimer.title += model;
                break;

            case 'integer':
                disclaimer.title += model;
                break;

            case 'boolean':
                disclaimer.title += this.formatBoolean(model);
                break;

            case 'date':
                disclaimer.title += this.formatDate(model);
                break;

            case 'date-range':
                if (model.start !== undefined && model.start !== null) {
                    disclaimer = this.parseDateRangeToDisclaimer(model, key, title, dtsModule, fixed);
                } else {
                    disclaimer = undefined;
                }
                break;

            case 'char-range':
                if (model.start === undefined || model.start === null) {
                    model.start = "";
                }
                disclaimer = this.parseCharRangeToDisclaimer(model, key, title, dtsModule, fixed);
                break;

            case 'select':
                    
                if (angular.isObject(model)) {
                    
                    if (model.hasOwnProperty('objSelected') && angular.isArray(model.objSelected)) {
                        
                        disclaimer.title  += model.toString();
                        disclaimer.tooltip = "";
                        
                        angular.forEach(model.objSelected, function (item) {
                            
                            code = item[fields[0]] || "";
                            if (disclaimer.tooltip !== "") { disclaimer.tooltip += ", "; }
                            disclaimer.tooltip += code;
                            
                        });
                        
                    } else {
                        
                        code = model[fields[0]] || "";
                        desc = model[fields[1]] || "";
                        disclaimer.title  += code + ' - ' + desc;
                        disclaimer.tooltip = code + ' - ' + desc;

                    }
                }

                disclaimer.model  = {property: key, value: model};
                break;

            }

            return disclaimer;

        };
        
        /* Função....: equalsDate
           Descrição.: Comparação de datas (-1 less, 0 equals, 1 bigger)
           Parâmetros: date1, date2, onlyDate
        */
        service.equalsDate = function (date1, date2, onlyDate) {

            if (!date1 || !date2) {
                return undefined;
            }

            var dateCompare1 = angular.copy(date1),
                dateCompare2 = angular.copy(date2);

            if (onlyDate === true) {
                dateCompare1.setHours(0, 0, 0, 0);
                dateCompare2.setHours(0, 0, 0, 0);
            }

            if (dateCompare1 < dateCompare2) {
                return -1;
            } else if (dateCompare1 > dateCompare2) {
                return 1;
            } else {
                return 0;
            }
            
        };
        
        /* Função....: validateTimeRange
           Descrição.: validação de time range
                       0 - período inicial está anterior ao momento de abertura do registro
                       1 - período inicial é superior ao período final
                       2 - período final é inferior ao período inicial
           Parâmetros: date1, date2, onlyDate
        */
        service.validateTimeRange = function (dateRange, timeRange, dateTimeBase) {

            var	today = new Date(),
                startDate,
                endDate,
                split;

            if (dateRange) {

                if (dateRange.start) {
                    startDate = (angular.isDate(dateRange.start) ? dateRange.start : new Date(dateRange.start));
                }

                if (dateRange.end) {
                    endDate = (angular.isDate(dateRange.end) ? dateRange.end : new Date(dateRange.end));
                }
            }

            if (timeRange) {

                if (angular.isString(timeRange.start)) {
                    split = timeRange.start.split(':');
                    startDate.setHours(split[0]);
                    startDate.setMinutes(split[1]);
                    startDate.setSeconds(0);
                    startDate.setMilliseconds(0);
                } else {
                    startDate.setHours(0, 0, 0, 0);
                }

                if (angular.isString(timeRange.end)) {
                    split = timeRange.end.split(':');
                    endDate.setHours(split[0]);
                    endDate.setMinutes(split[1]);
                    endDate.setSeconds(0);
                    endDate.setMilliseconds(0);
                } else {
                    endDate.setHours(0, 0, 0, 0);
                }
            }

            if (dateTimeBase) {

                dateTimeBase.setSeconds(0);
                dateTimeBase.setMilliseconds(0);

                if (this.equalsDate(startDate, today, true) === 0) { // equals
                    if (startDate < dateTimeBase) {
                        return 0;
                    }
                }
            }

            if (this.equalsDate(startDate, endDate, true) === 0) {
                if (startDate > endDate) {
                    return 1;
                }
            }

            // Hora de término...
            if (this.equalsDate(endDate, startDate, true) === 0) { // equals
                if (endDate < startDate) {
                    return 2;
                }
            }

            return -1;
            
        };
        
        /* Função....: parseMessage
           Descrição.: Retorna mensagem que contenha parâmetros
           Parâmetros: message, parameters
        */
        service.parseMessage = function (message, parameters) {

            var listOfParameters,
                i;

            if (parameters instanceof Array) {
                listOfParameters = parameters;
            } else {
                listOfParameters = [parameters];
            }

            for (i = 0; i < listOfParameters.length; i++) {
                message = message.replace('{{' + i + '}}', listOfParameters[i]);
            }

            return message;
            
        };
        
        /* Função....: parseProfileDataArrayToList
           Descrição.: converte as preferências do usuário em determinada lista de objetos selecionados no zoom
           Parâmetros: profileDataArray, nameData, fieldId, fieldDesc
        */
        service.parseProfileDataArrayToList = function (profileDataArray, nameData, fieldId, fieldDesc) {

            var allItems = {},
                listItems,
                key;
            
            angular.forEach(profileDataArray, function (data) {
                
                var pos;
                
                if (data.dataCode.indexOf(nameData + "_cod_") !== -1) {
                    
                    pos = parseInt(data.dataCode.replace(nameData + "_cod_", ""), 10);
                    
                    if (!allItems.hasOwnProperty(pos)) {
                        allItems[pos] = {};
                    }
                    
                    allItems[pos][fieldId] = data.dataValue;
                    
                }
                
                if (data.dataCode.indexOf(nameData + "_des_") !== -1) {
                    
                    pos = parseInt(data.dataCode.replace(nameData + "_des_", ""), 10);
                    
                    if (!allItems.hasOwnProperty(pos)) {
                        allItems[pos] = {};
                    }
                    
                    allItems[pos][fieldDesc] = data.dataValue;
                    
                }
            });
            
            function MultipleSelectResult() {}
            MultipleSelectResult.prototype.toString = function () {
                return this.objSelected.length + ' - ' + $rootScope.i18n('l-selecteds', undefined, 'dts/apb');
            };
            
            listItems             = new MultipleSelectResult();
            listItems.objSelected = [];
            
            for (key in allItems) {
                
                if (allItems[key] !== undefined) {
                    listItems.objSelected.push(allItems[key]);
                }
            }

            return listItems;
            
        };
        
        /* Função....: parseProfileDataArrayToItem
           Descrição.: converte a preferência do usuário em objeto selecionado no zoom
           Parâmetros: profileDataArray, nameData, fieldId, fieldDesc
        */
        service.parseProfileDataArrayToItem = function (profileDataArray, nameData, fieldId, fieldDesc) {

            var item = {};
            
            angular.forEach(profileDataArray, function (data) {

                switch (data.dataCode) {

                case (nameData + '_cod'):

                    item[fieldId] = data.dataValue;
                    break;

                case (nameData + '_des'):

                    item[fieldDesc] = data.dataValue;
                    break;
                }
            });
            
            return item;
            
        };
        
        /* Função....: addSelectInProfileDataArray
           Descrição.: inclui no objeto de preferência do usuário o(s) item(s) selecionado(s) no zoom/select
           Parâmetros: profileDataArray, modelSelect
        */
        service.addSelectInProfileDataArray = function (profileDataArray, modelSelect, nameModel, nameData, fieldId, fieldDesc) {
            
            var i,
                item;
        
            if (modelSelect) {

                /* Quando for múltipla seleção */
                if (modelSelect.hasOwnProperty("objSelected")) {

                    profileDataArray.push({dataCode: nameModel,
                                           dataValue: 'array'});

                    for (i = 0; i < modelSelect.objSelected.length; i++) {

                        item = modelSelect.objSelected[i];

                        profileDataArray.push({dataCode:  nameData + '_cod_' + i,
                                               dataValue: item[fieldId]});
                        profileDataArray.push({dataCode:  nameData + '_des_' + i,
                                               dataValue: item[fieldDesc]});

                    }

                } else {

                    /* Quando for apenas uma Unidade de Fechamento de Caixa */
                    profileDataArray.push({dataCode: nameModel,
                                           dataValue: 'unique'});
                    profileDataArray.push({dataCode:  nameData + '_cod',
                                           dataValue: modelSelect[fieldId]});
                    profileDataArray.push({dataCode:  nameData + '_des',
                                           dataValue: modelSelect[fieldDesc]});

                }
            }
            
            return profileDataArray;
            
        };
        
        return service;

	}

	// Serviço Helper
    serviceHelper.$inject = ['$rootScope', '$filter', '$timeout', 'apb.inquirevendordocs.Factory'];
	index.register.service('apb.utils.Service', serviceHelper);

});
