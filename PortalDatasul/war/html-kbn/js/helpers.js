define(['index'], function(index) {
    helperService.$inject = ['messageHolder', '$rootScope', '$filter', 'TOTVSEvent'];
    function helperService(messageService, $rootScope, $filter, TOTVSEvent) {

        var property = function(single)
        {
            return single.property;
        }
        var value = function(single)
        {
            return single.value;
        }

        return {
            getColorCard: function(list){
                var obj = [];
                list.forEach(function(obj){
                    if(obj.qtdQuadro - obj.itemDetail.valueGreen - obj.itemDetail.valueYellow > 0){
                        obj.cardColor = 3; //vermelho
                    } else if (obj.qtdQuadro - obj.itemDetail.valueGreen > 0){
                        obj.cardColor = 2; //amarelo
                    } else {
                        obj.cardColor = 1; //verde
                    }
                });
                return list;
            },
            removeEstab: function(filters){
                var nPos = -1;
                
                if (filters.properties){
                    nPos = filters.properties.indexOf('cod_estab_erp');
                    
                    if (nPos >= 0){
                
                        filters.properties.splice(nPos,1);
                        filters.restriction.splice(nPos,1);
                        filters.values.splice(nPos,1);
                    }
                };
                return filters;
            },
            filtersToPropValues: function(filters){

                if(filters.length == 0)
                    return {};

                searchFilters = filters.filter(function(filter) {
                    return filter.property !== "classifier" && filter.property !== "itemInativo";
                });

                var propArray = searchFilters.map(property);
                var valueArray = searchFilters.map(value);
                var restriction = searchFilters.map(function(single){
                    return single.restriction;
                });

                classifiersStringified = this.parseClassifiersToString(filters);

                var propValues = {properties: propArray, restriction: restriction, values: valueArray, classifiers: classifiersStringified};
                return propValues;

            },
            parseClassifiersToString: function(filters) {
                var classifiers = filters.filter(function(filter) {
                    return filter.property === "classifier";
                });

                if (classifiers.length === 0) return "";

                var classifiersStringified = classifiers[0].value.map(
                    function(element) { return element.join(",");}
                ).join("|");

                return classifiersStringified;
            },
            parseToClassifiers : function(obj)
            {
                var parsedClassifiers = obj;
                parsedClassifiers = parsedClassifiers.reduce(function(previous, current) {
                    return previous.concat(current);
                }, []);
                return parsedClassifiers;
            }, 
            countClassifiers : function(obj)
            {
                var parsedClassifiers = obj;
                count = parsedClassifiers.reduce(function(previous, current) {
                    return previous + current.length;
                }, 0);
                return count;
            },
            isItemInCategory: function(classifiersByItem, selectedClassifiers) {

                achou = true;

                for(i=0; i < selectedClassifiers.length; i++){
                    achou = false;
                    for(j=0; j < classifiersByItem.length; j++){

                        if($.inArray(classifiersByItem[j],selectedClassifiers[i]) > -1){
                            achou = true;
                            break;
                        }
                    }
                    if(!achou) break;
                }
                return achou;

            },
            colorTag : function(idColor){
                var color = {
                    1: "verde",
                    2: "amarelo",
                    3: "vermelho",
                    4: "azul"
                };
                return color[idColor];
            },
            mapStatus : function(idColor){
                var color = {
                    1: "vermelho",
                    2: "vermelho",
                    3: "verde",
                    4: "azul"
                };
                return color[idColor];
            },
            colorCard : function(idColor){
                var color = {
                    1: "bg-verde",
                    2: "bg-amarelo",
                    3: "bg-vermelho",
                    4: "bg-azul"                    
                };
                return color[idColor];
            },
            getTagByColor: function(cards, greenValue, yellowValue)
            {
                if (cards <= greenValue) return this.colorTag(1);
                if (cards <= greenValue + yellowValue) return this.colorTag(2);
                return this.colorTag(3);
            },
            createSituationCardsObj : function(arrayFromErp)
            {
                var arrayResult = [];;
                arrayFromErp.forEach(function(obj){

                    var qtdPilha = obj['qti_tam_pilha'];

                    if(!qtdPilha){
                        qtdPilha = obj['qti_verde_kanban'] + obj['qti_amarela_kanban'] + obj['qti_vermelha_kanban'];
                    }


                    arrayResult.push({
                        cell: {
                            name: obj['des_cel'],
                            codeErp: obj['cod_cel_mestre'],
                        },
                        codeErp: obj['cod_chave_erp'],
                        description: obj['des_item_erp'],
                        reference: obj['cod_refer'],
                        expedition: obj['log_expedic'],
                        colorKanban: obj['idi_cor_faixa'],
                        qtdBoard: obj['qtd_cartoes_quadro'],
                        qtdBoardBackup: obj['qtd_cartoes_quadro'],
                        qtdExtra: obj['qtd_cartoes_extra'],
                        qtdProduc: obj['qtd_cartoes_produc'],
                        qtdTransport: obj['qtd_cartoes_transp'],
                        qtdBlock: obj['qtd_cartoes_bloq'],
                        qtdSupermarket: obj['qtd_cartoes_super'],
                        qtdSupermarketBackup: obj['qtd_cartoes_super'],
                        qtdPilha: qtdPilha,
                        num_id_mapeamento: obj['num_id_mapeamento'],
                        des_mapeamento: obj['des_mapeamento'],
                        cod_estab_erp: obj['cod_estab_erp'],
                        itemDetail : obj['num_id_item_det'],
                        categoria: true,
                        sizeKanban: obj['qti_tam_kanban'],
                        unMed: obj['cod_un_med_erp']
                    });

                    if(obj['ttItemClasdorKanbanSituation'] === undefined){
                        arrayResult[arrayResult.length - 1].ttItemClasdor = [];
                    }else{
                        arrayResult[arrayResult.length - 1].ttItemClasdor = obj['ttItemClasdorKanbanSituation'];
                    }
                });
                return arrayResult;
            },
            getObjectWithLevels: function(obj, propertyWithLevels)
            {
                var arrayOfProperties = propertyWithLevels.split('.');
                var finalObject = obj;
                if(arrayOfProperties.length > 1)
                {
                    for (var i = 0; i < arrayOfProperties.length - 1; ++i) {
                        var prop = arrayOfProperties[i];
                        if(finalObject === undefined)
                        {
                            finalObject = obj[prop];
                        }
                        else
                        {
                            finalObject = finalObject[prop];
                        }
                    }
                }
                return finalObject;
            },
            getLastLevelField: function(propertiesWithLevels)
            {
                var arrayOfProperties = propertiesWithLevels.split('.');
                var finalProp = "";
                if(arrayOfProperties.length > 1)
                {
                    var lastIndex = arrayOfProperties.length - 1;
                    finalProp = arrayOfProperties[lastIndex];
                }
                else
                {
                    finalProp = arrayOfProperties.toString();
                }

                return finalProp;
            },
            quickSearchGenericFunction : function(list, string) {
                for (var i = 0; i < list.length; ++i) {
                    var l = list[i];
                    if (l.toLowerCase().indexOf(string.toLowerCase()) != -1)
                    {
                        return true;
                    }
                }
                return false;
            },
            getPropertiesFromQuickFilter: function(disclaimers)
            {
                var props = [];
                angular.forEach(disclaimers, function (itemFilter) {
                    props.push(itemFilter.property);
                });
                return props;
            },
            getValuesFromQuickFilter: function(disclaimers)
            {
                var values = [];
                angular.forEach(disclaimers, function (itemFilter) {
                    values.push(itemFilter.value);
                });
                return values;
            },
            sanitizeFilters: function(filters)
            {
                var defaultProperties = ['property', 'restriction', 'value'];
                var arrayOfFilters = [];
                if(angular.isArray(filters))
                {
                    arrayOfFilters = angular.copy(filters);
                }
                else
                {
                    arrayOfFilters.push(filters);
                }
                angular.forEach(arrayOfFilters, function(singleItem)
                                {
                                    for (var key in singleItem) {
                                      if (singleItem.hasOwnProperty(key)) {
                                        if(defaultProperties.indexOf(key) == -1)
                                            delete singleItem[key];
                                      }
                                    }
                                });
                return arrayOfFilters;
            },
            removeFilterApplied: function(listOfFilter, filterToRemove)
            {
                var index = listOfFilter.indexOf(filterToRemove);
                if(index != -1)
                {
                    listOfFilter.splice(index, 1);
                }
            },
            // Formata a data de acordo com o padrao da localizacao
            formatMillisecondsDateToString: function (dateToFormat, customFormat) {
                if (dateToFormat) {
                    return $filter('kbnDateFormat')(dateToFormat, customFormat);
//                    return sessionContext.formatDate(dateToFormat, customFormat);
                }
            },
            validateForm: function (form) {
                form.$setValidity();

                var canSave = true;
                if (form.$error &&
                    form.$error.required &&
                    form.$error.required.length > 0) {
                    angular.forEach(form.$error.required, function (item) {
                        if (!item.$name) {
                            item = undefined;
                        } else {
                            item.$dirty = true;
                            canSave = false;
                        }
                    });
                }
                return canSave;
            },
            hasMessages: function(obj)
            {
                var retorno = false;
                if(obj)
                {
                    if(obj.messages && angular.isArray(obj.messages))
                    {
                        retorno = (obj.messages.length > 0);
                    }
                }
                return retorno;
            },
            showMessages: function(messages)
            {
                var joinedMsg = '';
                angular.forEach(messages, function(singleItem)
                                {
                                    if(singleItem.type == 'error')
                                    {
                                        joinedMsg += singleItem.detail + '\r\n';
                                    }
                                });
                messageService.showMsg('Titulo', 'Ocorreram erros', 'error', joinedMsg);
            },
            // Função auxiliar para retornar o índice de um campo na lista
            findIndexByKeyValue: function (obj, key, value) {
                if (obj != null) {
                    for (var i = 0; i < obj.length; i++) {
                        if (obj[i][key] == value) {
                            return i;
                        }
                    }
                }
                return -1;
            },
            searchCallback : function(result, ctrlHandle)
            {
                ctrlHandle.listResult = result;
                ctrlHandle.listLength = a.length;
                ctrlHandle.totalRecords = 0

                if(result.length > 0){
                    ctrlHandle.totalRecords = result[0].$length;
                }
            },
            convertFieldsFromERP : function(sourceObj, syncFieldsRelation)
            {
                var destObj = {};
                angular.forEach(syncFieldsRelation, function (relation) {
                    destObj[relation.targetField] = sourceObj[relation.erpField];
                });
                return destObj;
            },
            getERPFieldFromTargetField: function(targetFieldName, syncObj)
            {
                var erpField = '';
                angular.forEach(syncObj, function (relation) {
                    if(relation.targetField == targetFieldName)
                    {
                        erpField = relation.erpField;
                    }
                });
                return erpField;
            },
            processMessages: function(result, title)
            {
                var listOfMessages = result.messages;
                if(listOfMessages && listOfMessages.length > 0)
                {
                    this.showMessages(listOfMessages);
                }
                else
                {
                    messageService.showNotify({type: 'info',
                                               title: $rootScope.i18n(title),
                                               detail: $rootScope.i18n('l-success-transaction')
                                              });
                }
            },

            validateMissingFields: function (tagId) {

                var obj = {};

                obj.listOfFields = [];

                tagId.find('field').each(function (index) {

                    buscaFields($(this),obj.listOfFields);

                });

                tagId.find('input').each(function (index) {

                    buscaFields($(this),obj.listOfFields);

                });

                obj.isValid = function(){
                    return !(obj.listOfFields.length > 0);
                }

                obj.showDefaultMessage = function(){

                    var messageToShow = {};
                    var messageToReturn = "";

                    angular.forEach(obj.listOfFields, function(singleField){
                        messageToReturn += $rootScope.i18n("l-field") + " " +
                                            singleField.label + ": " +
                                            $rootScope.i18n(singleField.cause);
                        if(singleField.cause != "l-required-mce")
                        {
                            messageToReturn += " (" + singleField.value + ")";
                        }

                        messageToReturn += " \r\n ";
                    });

                    messageToShow.title = $rootScope.i18n('l-fields-validations');
                    messageToShow.help = messageToReturn;
                    messageToShow.size = 'md';

                    $rootScope.$broadcast(TOTVSEvent.showMessage, messageToShow);
                }

                return obj;
            },
            sortList: function (list) {
                list.sort(function(a, b) {

                    if ( a.cod_chave_erp.toUpperCase() < b.cod_chave_erp.toUpperCase() )
                        return -1;
                    if ( a.cod_chave_erp.toUpperCase() > b.cod_chave_erp.toUpperCase() )
                        return 1;

                    if ( a.cod_refer.toUpperCase() < b.cod_refer.toUpperCase() )
                        return -1;
                    if ( a.cod_refer.toUpperCase() > b.cod_refer.toUpperCase() )
                        return 1;

                    if ( a.log_expedic < b.log_expedic )
                        return -1;
                    if ( a.log_expedic > b.log_expedic )
                        return 1;

                    return 0;
                });

                return list;
            },
            calcGreenQuantity: function(stack) {
                return Math.min(stack.totalKanbans, stack.totalGreenZone);
            },
            calcGreenRatio: function(stack) {
                return this.calcGreenQuantity(stack) / stack.totalGreenZone;
            },
            calcYellowQuantity: function(stack) {
                var total = stack.totalKanbans - this.calcGreenQuantity(stack);
                return Math.min(total, stack.totalYellowZone);
            },
            calcYellowRatio: function(stack) {
                return Math.max(this.calcYellowQuantity(stack), 0) / stack.totalYellowZone;
            },
            calcRedQuantity: function(stack) {
                var total = stack.totalKanbans -
                    this.calcGreenQuantity(stack) -
                    this.calcYellowQuantity(stack);
                return Math.min(total, stack.totalRedZone);
            },
            calcRedRatio: function(stack) {
                return Math.max(this.calcRedQuantity(stack), 0) / stack.totalRedZone;
            },
            calcColorRatio: function(stack, colorId) {
                if (colorId === 3) return this.calcRedRatio(stack);
                if (colorId === 2) return this.calcYellowRatio(stack);
                return this.calcGreenRatio(stack);
            },
            quantifyPriorityByRange: function(stack) {
                var greenRatio = this.calcGreenRatio(stack) / 3;
                var yellowRatio = this.calcYellowRatio(stack) / 3;
                var redRatio = this.calcRedRatio(stack) / 3;
                return greenRatio + yellowRatio + redRatio;
            },
            integrationErps : function(){
                var erps = [
                    {value: 1, label: $rootScope.i18n('l-datasul')},
                    {value: 2, label: $rootScope.i18n('l-protheus')},
                    //{value: 3, label: $rootScope.i18n('l-logix')},
                    {value: 4, label: $rootScope.i18n('l-no-totvs')}
                ];
                return erps;
            }
        };
    }
    function isString(valueType){
        return (valueType == 'string' || valueType == 'text');
    }
    function elementHasNoValue(elementValue){
        return (elementValue === undefined || elementValue === null || elementValue === "");
    }

    function buscaFields(objJQuery, listOfFields){
        if ((objJQuery.attr('required') || objJQuery.attr('min') || objJQuery.attr('greater-than'))  && objJQuery.is(':visible')) {

            var elementValue = angular.element(objJQuery).data('$ngModelController').$$rawModelValue;
            var valueType = objJQuery.attr('type');
            var minValue = objJQuery.attr('min');
            var greaterThanValue = objJQuery.attr('greater-than');
            var ngModelValue = objJQuery.attr('ng-model');
            var cause = "";
            var validatedValue;

            if (valueType != 'decimal' && valueType != 'number'){
                valueType = 'string';
            }

            emptyString = isString(valueType) && elementHasNoValue(elementValue);
            emptyNumeric = (valueType == 'decimal' || valueType == 'number') && (elementValue === undefined || elementValue === "" || elementValue === null);

            if( objJQuery.attr('required') && (emptyString || emptyNumeric) ){
                cause = "l-required-mce";
            } else {

                if(!(emptyNumeric || emptyString)){

                    if(!elementHasNoValue(minValue)
                       &&
                       (valueType == 'string' && (parseFloat(elementValue) != NaN && parseFloat(elementValue) < parseFloat(minValue)))
                       ||
                       ((valueType == 'decimal' || valueType == 'number') && elementValue < minValue ))
                    {
                        cause = "l-min-value-validation";
                        validatedValue = minValue;
                    }

                    if(!elementHasNoValue(greaterThanValue)
                       &&
                       (valueType == 'string'
                        &&
                        (parseFloat(elementValue) != NaN && parseFloat(elementValue) <= parseFloat(greaterThanValue)))
                       ||
                       ((valueType == 'decimal' || valueType == 'number') && elementValue <= greaterThanValue))
                    {
                        cause = "l-greater-than-mininum-value";
                        validatedValue = greaterThanValue;
                    }

                }
            }

            if(cause && listOfFields.map(function(e) { return e.ngModel; }).indexOf(ngModelValue) == -1 ){

                listOfFields.push({
                    label: objJQuery.attr('label'),
                    ngModel: ngModelValue,
                    cause: cause,
                    value: validatedValue
                });
            }
        }
    }

    factoryResourceLoader.$inject = ['$resource'];
    function factoryResourceLoader($resource) {
        var defaultResources = {
            update: {
                method: 'PUT',
                isArray: false
            },
            batchSave: {
                method: 'POST',
                isArray: true,
                params: {
                    url: 'batchSave'
                }
            },
            searchByParam: {
                method: 'POST',
                isArray: true,
                params: {
                    url: 'searchByParam'
                }
            }
        };

        this.loadDefaultResources = function (restURL) {

            var factory = $resource(restURL + '/:url/:id', {}, defaultResources);

            return factory;
        };
        this.loadSpecificResources = function (restURL, specificResources) {
            jQuery.extend(specificResources, defaultResources);

            var factory = $resource(restURL + '/:url/:id', {}, specificResources);

            return factory;
        };
    }

    index.register.service('kbn.helper.Service', helperService);
    index.register.service('kbn.helper.FactoryLoader', factoryResourceLoader);

});
