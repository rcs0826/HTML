define(['index'], function (index) {

    serviceUtils.$inject = ['$rootScope', '$filter', '$injector','TOTVSEvent'];

    function serviceUtils($rootScope, $filter, $injector, TOTVSEvent) {
        return {
            listOfEnabledFields: [],
            parseDisclaimersToModel: function (disclaimers, callback) {

                var searchModel = {};

                disclaimers = disclaimers ? disclaimers : [];

                for (var i = 0; i < disclaimers.length; i++) {

                    var disclaimer = disclaimers[i];

                    if (disclaimer.model !== undefined) {

                        var property = disclaimer.property;

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
            },
            parseDateRangeToDisclaimer: function (range, property, label) {

                var disclaimer = {
                    property: property,
                    title: $rootScope.i18n(label) + ': ',
                    model: {
                        property: property,
                        value: range
                    }
                };

                var dateFormatter = $filter('date');
                var dateFormat = 'dd/MM/yyyy';

                var startDateLabel = dateFormatter(range.start, dateFormat);
                
                if (!range.end || dateFormatter(range.end, dateFormat) == dateFormatter(range.start, dateFormat)) {
                    disclaimer.title += startDateLabel;
                } else {
                    disclaimer.title = $rootScope.i18n(label) + ": " + startDateLabel + " " + $rootScope.i18n('l-to') + " " + dateFormatter(range.end, dateFormat);
                    disclaimer.value = range.start + ';' + (range.end || '');
                }
                
                return disclaimer;
            },
            parseCharRangeToDisclaimer: function (range, property, label) {

                var disclaimer = {
                    property: property,
                    title: $rootScope.i18n(label) + ': ',
                    model: {
                        property: property,
                        value: range
                    }
                };
                
                if(range.start == undefined){
                    range.start = "";
                }

                if(range.end == undefined){
                    range.end = "";
                }
                
                if (!range.end || range.end == range.start) {
                    disclaimer.title += range.start
                    disclaimer.value = range.start;
                } else {
                    disclaimer.title = $rootScope.i18n(label) + ": " + range.start + " " + $rootScope.i18n('l-to') + " " + range.end;
                    disclaimer.value = range.start + ';' + range.end;
                }

                return disclaimer;
            },
            parseIntRangeToDisclaimer: function (range, property, label) {

                var disclaimer = {
                    property: property,
                    title: $rootScope.i18n(label) + ': ',
                    model: {
                        property: property,
                        value: range
                    }
                };

                
                if(range.start == undefined){
                    range.start = 0;
                }

                if(range.end == undefined){
                    range.end = 0;
                }
                                
                if (!range.end || range.end == range.start) {
                    disclaimer.title += range.start
                    disclaimer.value = range.start;
                } else {
                    disclaimer.title = $rootScope.i18n(label) + ": " + range.start + " " + $rootScope.i18n('l-to') + " " + range.end;
                    disclaimer.value = range.start + ';' + range.end;
                }

                return disclaimer;
            },            
            parseTypeToDisclaimer: function (type, key, model, title, fixed, tooltip) {

                var disclaimer = undefined;
                // TODO
                // - tooltip - Verificiar a implementação para cada tipo
                // - multipla-seleção - implementar           

                switch (type) {
                case 'char':
                    title = $rootScope.i18n(title) + ': ' + model;
                    break;

                case 'integer':
                    title = $rootScope.i18n(title) + ': ' + model;
                    break;

                case 'boolean':
                    title = $rootScope.i18n(title) + ': ' + this.formatBoolean(model);
                    break;
                case 'booleanNoValue':
                    title = $rootScope.i18n(title);
                    break;                        

                case 'date':
                    title = $rootScope.i18n(title) + ': ' + this.formatDate(model);
                    break;

                    case 'select':
                        title = $rootScope.i18n(title) + ': ' + model.description;
                        disclaimer = {property: key,
                              value: model.value,
                              title: title,
                              fixed: fixed
                             };    
                        return disclaimer;
                        break;
                        
                    case 'date-range':
                        if (model.start !== undefined && model.start !== null) {
                            disclaimer = this.parseDateRangeToDisclaimer(model, key, title);
                            disclaimer.fixed = fixed;
                            return disclaimer;
                        } else
                            return undefined;
                        break;
                        
                    case 'char-range': 
                            disclaimer = this.parseCharRangeToDisclaimer(model, key, title);
                            disclaimer.fixed = fixed;
                            return disclaimer;                       
                        break;                        
                        
                     
                case 'integer-range': 
                    if (model.start !== undefined && model.start !== null) {    
                        disclaimer = this.parseIntRangeToDisclaimer(model, key, title);
                        disclaimer.fixed = fixed;
                        return disclaimer; 
                    } else 
                        return undefined;
                    
                    break;                        
                        
                }         
                disclaimer = {property: key,
                              value: model,
                              title: title,
                              fixed: fixed
                             };                
                
                return disclaimer;
            },
            // -1 less, 0 equals, 1 bigger
            equalsDate: function (date1, date2, onlyDate) {

                if (!date1 || !date2) {
                    console.error('Você deve informar as 2 datas para realizar a comparação...');
                    return undefined;
                }

                var dateCompare1 = angular.copy(date1);
                var dateCompare2 = angular.copy(date2);

                if (onlyDate === true) {
                    dateCompare1.setHours(0, 0, 0, 0);
                    dateCompare2.setHours(0, 0, 0, 0);
                }

                if (dateCompare1 < dateCompare2) {
                    return -1;
                } else if (dateCompare1 > dateCompare2) {
                    return 1;
                } else return 0;
            },
            // 0 - período inicial está anterior ao momento de abertura do registro.
            // 1 - período inicial é superior ao período final.
            // 2 - período final é inferior ao período inicial.
            validateTimeRange: function (dateRange, timeRange, dateTimeBase) {

                var today = new Date();
                var startDate = undefined;
                var endDate = undefined;

                if (dateRange) {

                    if (dateRange.start) {
                        startDate = (angular.isDate(dateRange.start) ?
                            dateRange.start : new Date(dateRange.start));
                    }

                    if (dateRange.end) {
                        endDate = (angular.isDate(dateRange.end) ?
                            dateRange.end : new Date(dateRange.end));
                    }
                }

                if (timeRange) {

                    if (angular.isString(timeRange.start)) {
                        var split = timeRange.start.split(':');
                        startDate.setHours(split[0]);
                        startDate.setMinutes(split[1]);
                        startDate.setSeconds(0);
                        startDate.setMilliseconds(0);
                    } else {
                        startDate.setHours(0, 0, 0, 0);
                    }

                    if (angular.isString(timeRange.end)) {
                        var split = timeRange.end.split(':');
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
            },
            parseMessage: function (message, parameters) {

                var listOfParameters = undefined;

                if (parameters instanceof Array) {
                    listOfParameters = parameters;
                } else {
                    listOfParameters = [parameters];
                }

                for (var i = 0; i < listOfParameters.length; i++) {
                    message = message.replace('{{' + i + '}}', listOfParameters[i]);
                }

                return message;
            },
            formatBoolean: function (valueBoolean) {
                if (valueBoolean === true) {
                    return $rootScope.i18n('l-yes', undefined, 'dts/mce');
                } else {
                    return $rootScope.i18n('l-no', undefined, 'dts/mce');
                }
            },
            formatDate: function (valueDate) {

                var dateFormatter = $filter('date');
                var dateFormat = 'dd/MM/yyyy';

               if (!valueDate) return "";
                return dateFormatter(valueDate, dateFormat);

            },
            formatTime: function (valueTime) {

                var dateFormatter = $filter('date');
                var dateFormat = 'HH:mm:ss';

                return dateFormatter(valueTime, dateFormat);

            },
            formatDecimal: function (number, fractionSize) {
                var filter = $filter('number');
                var strNumber;
                
                if(number){
                    strNumber = String(number);
                    
                    if(strNumber.search(",") > -1){
                        strNumber = strNumber.replace(",",".");
                    }
                    
                    if(fractionSize == undefined){
                        return filter(strNumber);
                    }else{
                        return filter(strNumber, fractionSize);
                    }
                } else {
                    return filter('0', fractionSize);
                }
            },
            findIndexByAttr: function (array, attr, value) {
                for (var i = 0; i < array.length; i += 1) {
                    if (array[i][attr] === value) {
                        return i;
                    }
                }
            },
            verifyFieldToTypeahead: function (fieldName, value, fieldListTypes) {

                if (typeof value == 'object') {
                    value = value['id'];
                }

                for (var i = 0; i < fieldListTypes.length; i += 1) {
                    if (fieldListTypes[i].property == fieldName) {
                        if (fieldListTypes[i].type == undefined || fieldListTypes[i].type == 'text') {
                            return '*' + value + '*';
                        } else {
                            return value;
                        }
                    }
                }
            },

            isFieldEnabled: function ( fieldName) {
                
               
                
                var enableList = this.listOfEnabledFields;
                if (enableList != undefined && enableList.length > 0) {
                    var index = this.findIndexByAttr(enableList, 'campo', fieldName);
                    if (index != undefined) {
                        return enableList[index].habilitado;
                    } else {
                        return true;
                    }
                } else {
                    return true;
                }
            },
            objectHasProperties: function (obj, propertyList) {
                for (var index = 0; index < propertyList.length; index++) {
                    var propertyName = propertyList[index];
                    if (!obj.hasOwnProperty(propertyName)) {
                        return false;
                    }
                }
                return true;
            },
            fillArrayWithValues: function (originalArray, values) {
                valuesArray = new Array(originalArray.length);
                for (var index = 0; index < originalArray.length; index++) {
                    var propertyName = originalArray[index];
                    if (values[propertyName] == undefined) {
                        valuesArray[index] = '';
                    } else {
                        valuesArray[index] = values[propertyName];
                    }
                }
                return valuesArray;
            },

            searchTypeahead: function (searchString, serviceName, filterField, instance, zoomPropertyName) {
                var queryproperties = {};
                var service = undefined;

                if (serviceName != undefined && serviceName != '') {
                    try {
                        service = $injector.get(serviceName);
                    } catch (error) {

                        $rootScope.$broadcast(TOTVSEvent.showMessage, {
                            text: ($rootScope.i18n('l-msg-service-not-found')) + serviceName,
                            title: $rootScope.i18n('l-service-not-found'),
                            help: error.message
                        });
                    }

                    if (searchString != "") {
                        queryproperties.property = filterField;
                        queryproperties.value = "*" + searchString + "*";
                    } else {
                        return [];
                    }

                    if (queryproperties != undefined) {
                        service.resource.TOTVSQuery(queryproperties,
                            function (result) {
                                if (result != undefined && result instanceof Array) {
                                    instance[zoomPropertyName] = result;
                                } else {
                                    instance[zoomPropertyName] = [];
                                }
                            }
                        );
                    }

                }
            },            
            validateMissingFields: function (tagId, searchForSection, fieldsAllowBlank) {

                var listOfFields = [];
                var fatherSection = '';
                tagId.find('field').each(function (index) {
                    if ($(this).attr('required')) {
                        if (searchForSection) {
                            var fatherHandle = $(this).closest('fieldset').children('legend');
                            if (fatherHandle !== undefined) {
                                fatherSection = fatherHandle.text();
                            }
                        }

                        var persistField = true;
                        var elementValue = angular.element($(this)).data('$ngModelController').$modelValue;
						var modelString = $(this).attr('data-ng-model');
						var valueType = $(this).attr('type');						
						var modelField = modelString.substring(modelString.indexOf('[') + 2,
													 		   modelString.indexOf(']') - 1);
						if (valueType !== 'decimal' && valueType != 'number')
						{
							valueType = 'string';
						}
						if(valueType == 'string' &&
                            (elementValue === undefined || elementValue === null || elementValue === "")
							||	
							((valueType == 'decimal' || valueType == 'number') && (elementValue == 0 || !elementValue)))
						{
							if(fieldsAllowBlank !== undefined)
							{
								persistField = true;
								if(fieldsAllowBlank.indexOf(modelField) > 0)
								{
									persistField = false;									
								}
							}
							if(persistField) {
								listOfFields.push({
									section: fatherSection,
									label: $(this).attr('label')
								});
							}
                        }
                    }
                });
                return listOfFields;
            },
            
            disableDisclaimers:function(discl){
            
                var disclaimer = [];

                angular.copy(discl, disclaimer);

                for(key in disclaimer){
                    disclaimer[key].fixed = disclaimer[key].fixed = true;
                }

                return disclaimer;
            }            

        };
    };

    // Util Service
    index.register.service('mce.utils.Service', serviceUtils);

});
