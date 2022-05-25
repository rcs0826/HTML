define([
    'index',
    '/dts/kbn/js/factories/mappingErp-factories.js'
], function(index) {
    flowBatchEditController.$inject = [
        '$scope',
        '$stateParams',
        '$rootScope',
        '$state',
        'totvs.app-main-view.Service',
        'messageHolder',
        'kbn.mappingErp.Factory',
        'kbn.helper.Service',
        'kbn.timeCast.Service'
    ];
    function flowBatchEditController(
        $scope,
        $stateParams,
        $rootScope,
        $state,
        appViewService,
        messageHolder,
        mappingErpFactory,
        kbnHelper,
        timeCastService
    ) {

        var _self = this;

        _self.stateParams = $stateParams;
        _self.carregueiItem = false;

        var init = function() {

            createTab = appViewService.startView($rootScope.i18n('l-mapping-list'), 'ekanban.mapping.FlowBatchEdit', flowBatchEditController);

            _self.cellGridOptions = {
                dataSource: [],
                sortable: true,
                autoResizeColumn: true,
                columns: _self.cellGridColumns,
                resizable: true
            };
            _self.itemGridOptions = {
                dataSource: [],
                sortable: true,
                autoResizeColumn: true,
                columns: _self.itemGridColumns,
                resizable: true
            };

            _self.loadCell();
        };

        _self.booleansValues = [{
            value: "true",
            label: $rootScope.i18n('l-yes', [], 'dts/kbn')
        },{
            value: "false",
            label: $rootScope.i18n('l-no', [], 'dts/kbn')
        }];

        _self.ShowBatchEditCell = false;
        _self.ShowBatchEditItem = false;

        _self.cellGridColumns = [
            {
                field: '@ttKbnCelMestreDs@0@cod_chave_erp',
                title: $rootScope.i18n('l-code', [], 'dts/kbn'),
                editable: false,
                width: 90
            }, {
                field: "@ttKbnCelMestreDs@0@des_cel",
                title: $rootScope.i18n('l-description', [], 'dts/kbn'),
                editable: false,
                width: 200
            }, {
                field: '@qtd_cartoes',
                title: $rootScope.i18n('l-max-cards', [], 'dts/kbn'),
                editable: true,
                typeValidation: "integer",
                width: 50
            }, {
                field: '@log_multiplos_itens',
                title: $rootScope.i18n('l-distinct-itens', [], 'dts/kbn'),
                editable: false,
                template: '<input type="checkbox" ng-model=\'dataItem["@log_multiplos_itens"]\'></input>',
                typeValidation: "boolean",
                width: 80
            }, {
                field: '@qtd_horiz',
                title: $rootScope.i18n('l-programming-interval', [], 'dts/kbn'),
                editable: true,
                typeValidation: "time",
                model: '00:00:00,000',
                width: 90
            }, {
                field: '@qtd_faixa_fixa',
                title: $rootScope.i18n('l-fixed-range', [], 'dts/kbn'),
                editable: true,
                typeValidation: "time",
                model: '00:00:00,000',
                width: 50
            }
        ];

        _self.itemGridColumns = [
            {
                field: '@ds_kbn_item@0@cod_chave_erp',
                title: $rootScope.i18n('l-code', [], 'dts/kbn'),
                editable: false,
                width: 200
            }, {
                field: '@ds_kbn_item@0@cod_refer',
                title: $rootScope.i18n('l-reference', [], 'dts/kbn'),
                editable: false,
                width: 200
            }, {
                field: '@ds_kbn_item@0@des_item_erp',
                title: $rootScope.i18n('l-description', [], 'dts/kbn'),
                editable: false,
                width: 300
            }, {
                field: '@ds_kbn_item@0@log_expedic',
                title: $rootScope.i18n('l-type', [], 'dts/kbn'),
                editable: false,
                template: "<span'>#= data[\"@ds_kbn_item@0@log_expedic\"] ? \"{{'l-expedition' | i18n}}\" : \"{{'l-process' | i18n}}\" #</span>",
                width: 100
            }, {
                field: '@cod_depos_erp',
                title: $rootScope.i18n('l-warehouse', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'text',
                width: 200
            }, {
                field: '@cod_localiz',
                title: $rootScope.i18n('l-location', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'text',
                width: 200
            }, {
                field: '@log_disparo',
                title: $rootScope.i18n('l-extra-card', [], 'dts/kbn'),
                editable: false,
                template: '<input type="checkbox" ng-model=\'dataItem["@log_disparo"]\'></input>',
                typeValidation: 'boolean',
                width: 200
            }, {
                field: "@qti_tam_kanban",
                title: $rootScope.i18n('l-kanban-size', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'integer',
                width: 200
            }, {
                field: '@qti_estoq_segur',
                title: $rootScope.i18n('l-safety-storage', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'integer',
                width: 200
            }, {
                field: '@qti_lote_minimo',
                title: $rootScope.i18n('l-minimum-lot', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'integer',
                width: 200
            }, {
                field: '@qtd_demand',
                title: $rootScope.i18n('l-demand', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'number',
                width: 200
            }, {
                field: '@val_tempo_ressup',
                title: $rootScope.i18n('l-resupply-time', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'number',
                width: 200
            }, {
                field: '@qti_verde_kanban',
                title: $rootScope.i18n('l-green-range', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'integer',
                width: 200
            }, {
                field: '@qti_amarela_kanban',
                title: $rootScope.i18n('l-yellow-range', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'integer',
                width: 200
            }, {
                field: '@qti_vermelha_kanban',
                title: $rootScope.i18n('l-red-range', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'integer',
                width: 200
            }, {
                field: '@log_calc_autom',
                title: $rootScope.i18n('l-automatic-range-calc', [], 'dts/kbn'),
                editable: false,
                template: '<input type="checkbox" ng-model=\'dataItem["@log_calc_autom"]\'></input>',
                typeValidation: 'boolean',
                width: 230
            }, {
                field: '@log_prog_manual',
                title: $rootScope.i18n('l-allow-manual-schedule', [], 'dts/kbn'),
                editable: false,
                template: '<input type="checkbox" ng-model=\'dataItem["@log_prog_manual"]\'></input>',
                typeValidation: 'boolean',
                width: 200
            }, {
                field: '@log_aloca_autom',
                title: $rootScope.i18n('l-auto-allocation', [], 'dts/kbn'),
                editable: false,
                template: '<input type="checkbox" ng-model=\'dataItem["@log_aloca_autom"]\'></input>',
                typeValidation: 'boolean',
                width: 200
            }, {
                field: '@idi_formul_verde',
                title: $rootScope.i18n('l-green-formula', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'integer',
                width: 200
            }, {
                field: '@idi_formul_amarela',
                title: $rootScope.i18n('l-yellow-formula', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'integer',
                width: 200
            }, {
                field: '@idi_formul_vermelha',
                title: $rootScope.i18n('l-red-formula', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'integer',
                width: 200
            }, {
                field: '@ds_kbn_matriz_setup@0@vli_tempo_setup',
                title: $rootScope.i18n('l-setup-time', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'time',
                model: '00:00:00,000',
                width: 200
            }, {
                field: '@ds_kbn_proces_fluxo@0@vli_tempo_ciclo',
                title: $rootScope.i18n('l-cycle-time', [], 'dts/kbn'),
                editable: true,
                typeValidation: 'time',
                model: '00:00:00,000',
                width: 200
            }
        ];

        _self.beforeSave = function(event, column, value, currentIndex, original){

            if(!_self.validValueByType(column.typeValidation, value)) {
                messageHolder.showNotify({
                    type: 'error',
                    title: _self.formatErrorMessage(column)
                });

                event.preventDefault();
            }
        };

        _self.formatErrorMessage = function(column) {
            return $rootScope.i18n('l-column', [], 'dts/kbn') + " " + column.title.toUpperCase() + " " + _self.getTitleErrorByType(column.typeValidation);
        };

        _self.getTitleErrorByType = function(typeValidation) {
            if (typeValidation === 'integer' || typeValidation === 'number') {
                return $rootScope.i18n('l-should-completed-with-integers-numbers', [], 'dts/kbn');
            } else if (typeValidation === 'time') {
                return $rootScope.i18n('l-should-completed-time-format', [], 'dts/kbn');
            }
        };

        _self.carregaItens = function(){

            grids = $('.k-widget');
            gridscontent = $('.k-grid-content');

            grids.__proto__ = Array.prototype;

            grids.forEach(function(eachGrid){
                eachGrid.style.cssText = "height: " + (window.innerHeight - 440) + "px;";
            });


            gridscontent.__proto__ = Array.prototype;

            gridscontent.forEach(function(eachContent){
                eachContent.style.cssText = "height: " + (window.innerHeight - 471.333) + "px;";
            });

            if(!_self.carregueiItem){
                _self.carregueiItem = true;
                _self.loadItem();
            }

        };

        _self.validValueByType = function(typeValidation, newValue){
            var test = _self.maskTest(typeValidation);
            return (test ? test.test(newValue) : true);
        };

        _self.maskTest = function(typeValidation)
        {
            if (typeValidation == 'integer')
            {
                return /(^\d{1,})$/g;
            } else if (typeValidation == 'number')
            {
                return /^\d+(\.\d+)?$/g;
            } else if (typeValidation == 'time')
            {
                return /^(\d{1,}):[0-5][0-9]:[0-5][0-9],(\d{3,3})$/g;
            }
        };

        _self.loadCell = function(){

            mappingErpFactory.getCellsFlowBatchEdit({
                mappingId: _self.stateParams.mappingId,
                num_id_item_det: _self.stateParams.flowId
            }, function(result) {

                _self.cellGrid._data = _self.flatArray(result);

                _self.cellGrid._data = _self.cellGrid._data.sort(function (lhs, rhs) {
                    lstring = lhs['@ttKbnCelMestreDs@0@cod_chave_erp'].toUpperCase();
                    rstring = rhs['@ttKbnCelMestreDs@0@cod_chave_erp'].toUpperCase();

                    if (lstring > rstring) return 1;
                    if (lstring < rstring) return -1;
                    return 0;
                });

                timeColumns = _self.cellGridColumns.filter(function(each){
                    return each.typeValidation == "time";
                });

                _self.cellGrid._data.forEach(function(eachCell){

                    timeColumns.forEach(function(eachField){
                        eachCell[eachField.field] = timeCastService.milisecondsToHour(eachCell[eachField.field]);
                    });

                });
            });
        };

        _self.loadItem = function(){
            mappingErpFactory.getItemsFlowBatchEdit({
                mappingId: _self.stateParams.mappingId,
                num_id_item_det: _self.stateParams.flowId
            }, function(result) {

                result = kbnHelper.sortList(result);

                _self.itemGrid._data = _self.flatArray(result);

                timeColumns = _self.itemGridColumns.filter(function(each){
                    return each.typeValidation == "time";
                });

                _self.itemGrid._data.forEach(function(eachItem){

                    timeColumns.forEach(function(eachField){
                        eachItem[eachField.field] = timeCastService.milisecondsToHour(eachItem[eachField.field]);
                    });

                });

            });
        };

        _self.loadData = function(){
            _self.loadCell();
            _self.loadItem();
        };

        _self.flatArray = function(arrayToFlat) {
            var flattenedArray = [];

            arrayToFlat.forEach(function(objToFlat) {
                var flatObj = _self.flatObject(objToFlat);
                flattenedArray.push(flatObj);
            });

            return flattenedArray;
        };

        _self.flatObject = function(objToFlat) {
            var flat = _self.objToFlatArray(objToFlat);
            return _self.flatArrayToFlatObj(flat);
        };

        _self.objToFlatArray = function(obj, prefix) {
            if (prefix === undefined) prefix = "@";
            var flat = [];

            for (var e in obj) {
                if (_self.flatSkipProperty(e)) continue;

                if (typeof obj[e] === "object") {
                    flat = flat.concat(_self.objToFlatArray(obj[e], prefix + e + "@"));
                } else {
                    var flatObj = {};
                    flatObj[prefix + e] = obj[e];
                    flat.push(flatObj);
                }
            }

            return flat;
        };

        _self.flatSkipProperty = function(property) {
            return property.indexOf("$") !== -1;
        };

        _self.flatArrayToFlatObj = function(flat) {
            return flat.reduce(_self.reduceToFlatObj, {});
        };

        _self.reduceToFlatObj = function(prev, e) {
            for (var p in e) {
                prev[p] = e[p];
            }

            return prev;
        };

        _self.deflatArray = function(array) {
            var tmp = [];

            array.forEach(function(e) {
                var obj = _self.deflatObject(e);
                tmp.push(obj);
            });

            return tmp;
        };

        _self.deflatObject = function(obj) {
            var deflat = {};

            for (var serializedProperty in obj) {
                var serializedValue = obj[serializedValue];
                if (_self.deflatSkipProperty(serializedProperty)) continue;

                var propertyStack = serializedProperty.split("@");
                propertyStack = propertyStack.splice(1, propertyStack.length - 1);

                var lastDeflat = deflat;

                for(var i = 0; i < propertyStack.length - 2; ++i) {
                    var property = propertyStack[i];
                    var nextProperty = propertyStack[i + 1];

                    if (lastDeflat[property] === undefined) {
                        var childType = isNaN(nextProperty) ? {} : [{}];
                        lastDeflat[property] = childType;
                    }

                    lastDeflat = lastDeflat[property];
                    if (!isNaN(nextProperty))
                        lastDeflat = lastDeflat[nextProperty];
                }

                var lastProperty = propertyStack[propertyStack.length - 1];
                lastDeflat[lastProperty] = obj[serializedProperty];
            }

            return deflat;
        };

        _self.changeShowBatchEditCell = function(){
            _self.ShowBatchEditCell = !_self.ShowBatchEditCell;
        };

        _self.changeShowBatchEditItem = function(){
            _self.ShowBatchEditItem = !_self.ShowBatchEditItem;
        };

        _self.deflatSkipProperty = function(property) {
            return property.indexOf("@") !== 0;
        };

        _self.batchSave = function() {

            timeColumns = _self.cellGridColumns.filter(function(each){
                return each.typeValidation == "time";
            });

            var cellToSave = angular.copy(_self.cellGrid._data);

            cellToSave.forEach(function(eachCell){

                timeColumns.forEach(function(eachField){
                    eachCell[eachField.field] = timeCastService.hourToMiliseconds(eachCell[eachField.field]);
                });

            });

            var cells =  {
                "ttKbnCelDs":_self.deflatArray(cellToSave)
            };

            if(_self.carregueiItem){

                timeColumns = _self.itemGridColumns.filter(function(each){
                    return each.typeValidation == "time";
                });

                var itemToSave = angular.copy(_self.itemGrid._data);

                itemToSave.forEach(function(eachItem){

                    timeColumns.forEach(function(eachField){
                        eachItem[eachField.field] = timeCastService.hourToMiliseconds(eachItem[eachField.field]);
                        });

                });

                var items =  {
                    "ds_kbn_item_det":_self.deflatArray(itemToSave)
                };

            }

            mappingErpFactory.setCellsFlowBatchEdit(cells, function(result){

                if(!result.$hasError){
                    messageHolder.showNotify({
                        type: 'info',
                        title: $rootScope.i18n('l-cell-data-saved')
                    });

                    _self.loadCell();

                    if(_self.carregueiItem){

                        mappingErpFactory.setItemsFlowBatchEdit(items, function(result){
                            if(!result.$hasError)
                            {
                                _self.loadItem();
                                messageHolder.showNotify({
                                    type: 'info',
                                    title: $rootScope.i18n('l-item-data-saved')
                                });
                            }
                       });
                    }
                }
            });
        };

        _self.batchEdit = function(column, gridSelectedData) {
            if(!_self.validValueByType(column.typeValidation, column.model)){
                messageHolder.showNotify({
                    type: 'error',
                    title: _self.formatErrorMessage(column)
                });
                return;
            }

            gridSelectedData.forEach(function(e) {
                if(column.typeValidation === "boolean" ) {
                    e[column.field] = column.model.value === "true";
                }else{
                    e[column.field] = column.model;
                }
            });
        };

        var dirty = true;
        $scope.$on('$stateChangeStart', function(event, toState, toParams) {

            if (appViewService.lastAction == 'remove')
            {
                return;
            }
            if (dirty) {
            	event.preventDefault();
                messageHolder.showQuestion(
                    $rootScope.i18n('l-discard-changes',[],'dts/kbn'),
                    $rootScope.i18n('msg-discard-changes-grid-flow-batch',[],'dts/kbn'),
                    function(answer){
                        if (answer === true) {
                            dirty = false;
                            $state.go(toState.name, toParams);
                        }
                    }
                );
            }
        });

        init();
    }

    index.register.controller("ekanban.mapping.FlowBatchEdit", flowBatchEditController);
});
