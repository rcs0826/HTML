define(['index',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/factories/card-factory.js',
        '/dts/kbn/html/dashboard/settings/settings.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/enumkbn.js',
        '/dts/kbn/js/helpers.js'
], function(index) {

    processExceptionCtrl.$inject = [
        '$filter',
        '$scope',
        '$rootScope',
        'kbn.dashboard.settings.modalService',
        'kbn.cards.Factory',
        'kbn.dashboard.settings.service',
        '$location',
        'kbn.filters.service',
        'kbn.data.Factory',
        'enumkbn',
        'kbn.helper.Service'
    ];

    function processExceptionCtrl(
        $filter,
        $scope,
        $rootScope,
        modalParams,
        cardFactory,
        dashboardSettingsService,
        $location,
        filtersService,
        dataFactory,
        enumkbn,
        kbnHelper
    ) {
        var _self = this;

        _self.init = function(){
            _self.list = [];
            _self.settings = dashboardSettingsService.settings;
            if(dashboardSettingsService.hasEstab()) _self.getProcessException();
        };

        _self.chart = {
            titleWidget : 'l-process-exceptions',
            titleBreadcrumb: $filter('i18n')('l-start', [], 'dts/kbn/'),
            categories: [],
            series: [],
            reportParameters: [],
            typeChart: 'column',
            onClick: angular.noop,
            canChangeOrder: true
        };

        _self.chartArray = [];

        _self.getProcessException = function() {
            cardFactory.dashboardProcessExceptions(_self.generateSettings(),
                                                   {bloqFila:_self.settings.bloqFila,
                                                    bloqProducao:_self.settings.bloqProducao,
                                                    bloqTransporte:_self.settings.bloqTransporte,
                                                    ajusteSaldo:_self.settings.ajusteSaldo,
                                                    emissaoExtra:_self.settings.emissaoExtra},
                function(result) {
                if(result){
                    _self.list = result;
                    _self.loadDash();
                }
            });
        };

        _self.generateSettings = function() {
            var properties = '';
            var restriction = '';
            var values = '';

            var propertiesClassifier = kbnHelper.filtersToPropValues(
                dashboardSettingsService.settingsToDisclaimer().filter(function(disc) {return disc.property == 'classifier';}));

            if (_self.settings.itemExpedited == 1){
                properties = 'kbn_item.log_expedic';
                restriction = 'EQUALS';
                values = true;
            } else if(_self.settings.itemExpedited == 0){
                properties = 'kbn_item.log_expedic';
                restriction = 'EQUALS';
                values = false;
            }

            return {
                estabID: _self.settings.establishment.num_id_estab,
                datIni: _self.settings.dateRange.start,
                datFim: _self.settings.dateRange.end,
                classifiers: propertiesClassifier.classifiers,
                currentPage: 0,
                pageSize: 0,
                properties: properties,
                restriction: restriction,
                values: values
            };
        };

        _self.loadDash = function(result){
            _self.mainData = _self.list;
            var categories = _self.list.map(function(obj){
                return $filter('descGeneric')(obj.ttItemExceptionDashDs, "{sku} {ref} ({exp.short})");
            });

            var roundTime = function(field) {
                return function(obj){
                    return {
                        value: parseFloat(obj[field].toFixed(2)),
                        id : obj.ttItemExceptionDashDs.num_id_item,
                        item : $filter('descGeneric')(obj.ttItemExceptionDashDs, "{sku} - {desc} {ref} ({exp.short})"),
                        codeErp: obj.ttItemExceptionDashDs.cod_chave_erp
                    };
                };
            };

            var ajusteSaldo = _self.list.map(roundTime('ajusteSaldo'));
            var bloqFila = _self.list.map(roundTime('bloqFila'));
            var bloqProducao = _self.list.map(roundTime('bloqProducao'));
            var bloqTransporte = _self.list.map(roundTime('bloqTransporte'));
            var cartaoExtraEmitido = _self.list.map(roundTime('cartaoExtraEmitido'));

            var chart = {
                titleWidget : 'l-process-exceptions',
                titleBreadcrumb: $filter('i18n')('l-start', [], 'dts/kbn/'),
                categories: categories,
                series: [{
                    name: $rootScope.i18n('l-lock-queue',[],'dts/kbn'),
                    color: "#545455",
                    stack: "item",
                    data: bloqFila,
                    tooltip: {
                        visible: true,
                        template: "#= value #"
                    },
                    labels: { visible: false }
                }, {
                    name: $rootScope.i18n('l-blocking-in-production',[],'dts/kbn'),
                    color: "#E82F4D",
                    stack: "item",
                    data: bloqProducao,
                    tooltip: {
                        visible: true,
                        template: "#= value #"
                    },
                    labels: { visible: false }
                }, {
                    name: $rootScope.i18n('l-lock-on-transport',[],'dts/kbn'),
                    color: "#FFA300",
                    stack: "item",
                    data: bloqTransporte,
                    tooltip: {
                        visible: true,
                        template: "#= value #"
                    },
                    labels: { visible: false }
                }, {
                    name: $rootScope.i18n('l-inventory-balance-adjust',[],'dts/kbn'),
                    color: "#7BA525",
                    stack: "item",
                    data: ajusteSaldo,
                    tooltip: {
                        visible: true,
                        template: "#= value #"
                    },
                    labels: { visible: false }
                }, {
                    name: $rootScope.i18n('l-extra-card-emission',[],'dts/kbn'),
                    color: "#4996D6",
                    stack: "item",
                    data: cartaoExtraEmitido,
                    tooltip: {
                        visible: true,
                        template: "#= value #"
                    },
                    labels: { visible: false }
                }],
                reportParameters: [],
                typeChart: 'column',
                onClick: _self.onClick,
                canChangeOrder: true
            };
            _self.pushChart(chart);
        };
            
        _self.onClick = function(itemClick){
            cardFactory.dashboardProcessExceptionsDetail({
                datIni: _self.settings.dateRange.start,
                datFim: _self.settings.dateRange.end,
                num_id_item: itemClick.dataItem.id                
            }, {bloqFila:_self.settings.bloqFila,
                bloqProducao:_self.settings.bloqProducao,
                bloqTransporte:_self.settings.bloqTransporte,
                ajusteSaldo:_self.settings.ajusteSaldo,
                emissaoExtra:_self.settings.emissaoExtra},function(result){
                
                var categories = result.map(function(obj){
                   return $filter('date')(obj.dtm_movto, 'dd/MM/yyyy', 'UTC');
                });


                var valueBloqFila = {};
                var valueBloqProduction = {};
                var valueBloqTransporte = {};
                var valueInventoryAdjust = {};
                var valueExtraCard = {};
                
                if (_self.settings.bloqFila) {
                    valueBloqFila = result.map(function(obj){
                        return obj.bloqFila;
                    });
                };
                
                if (_self.settings.bloqProducao) {
                    valueBloqProduction = result.map(function(obj){
                        return obj.bloqProducao;
                    });
                };
                
                if (_self.settings.bloqTransporte) {
                    valueBloqTransporte = result.map(function(obj){
                        return obj.bloqTransporte;
                    });
                };
                
                if (_self.settings.ajusteSaldo) {
                    valueInventoryAdjust = result.map(function(obj){
                        return obj.ajusteSaldo;
                    });
                };
                
                if (_self.settings.emissaoExtra) {
                    valueExtraCard = result.map(function(obj){
                        return obj.emissaoExtra;
                    });
                };
                
                var chart = {
                    titleWidget : 'l-daily-item-exception',
                    titleBreadcrumb : itemClick.category,
                    categories: categories,
                    series: [{   
                        name: $rootScope.i18n('l-lock-queue',[],'dts/kbn'),
                        color: "#545455",
                        data: valueBloqFila,
                        labels: { visible: true }
                    }, {
                        name: $rootScope.i18n('l-blocking-in-production',[],'dts/kbn'),
                        color: "#E82F4D",
                        data: valueBloqProduction,
                        labels: { visible: true }
                    }, {
                        name: $rootScope.i18n('l-lock-on-transport',[],'dts/kbn'),
                        color: "#FFA300",
                        data: valueBloqTransporte,
                        labels: { visible: true }
                    }, {
                        name: $rootScope.i18n('l-inventory-balance-adjust',[],'dts/kbn'),
                        color: "#7BA525",
                        data: valueInventoryAdjust,
                        labels: { visible: true }
                    }, {
                        name: $rootScope.i18n('l-extra-card-emission',[],'dts/kbn'),
                        color: "#4996D6",
                        data: valueExtraCard,
                        labels: { visible: true }
                    }],
                    typeChart: 'line',
                    reportParameters: [{
                        property: 'codeERP',
                        title: $rootScope.i18n('l-description', [], 'dts/kbn') + ': ' + itemClick.dataItem.codeErp,
                        value: itemClick.dataItem.codeErp,
                        softFilter: true,
                        softFilterBehavior: function(record) {
                            var searchString = itemClick.dataItem.codeErp.toLowerCase();
                            var codItem = record.cod_chave_erp.toLowerCase();
                            var desItem = record.des_item_erp.toLowerCase();

                            var containsString = function(base, substring) {
                                return base.indexOf(substring) !== -1;
                            };

                            return containsString(codItem, searchString) || containsString(desItem, searchString);
                        }
                    }],
                    onClick: angular.noop
                };

                _self.pushChart(chart);
            });
        };

        _self.pushChart = function(chart) {
            _self.chart = chart;
            _self.chartArray.push(chart);
            $scope.$apply();
            $scope.$digest();
        };

        _self.showParams = function(){
            modalParams.openTemplate({}, '/dts/kbn/html/dashboard/settings/settingsProcessException.html');
        };

        _self.sendDataToReport = function() {
            filtersService.clearFilters('processExceptions');
            
            _self.setDisclaimers();
            
            if (_self.settings.establishment) {
                dataFactory.setEstablishmentDirective(_self.settings.establishment);
            }            
            
            var addToFilterService = function(params) {
                if (params.property == 'classifier'){
                    dataFactory.set('kanbanClassifierSelect', JSON.stringify(params.value));
                    return;
                }
                if (params.property === 'itemType' && params.value === enumkbn.itemType.both) return;
                filtersService.addFilter('processExceptions', params);
            };

            dashboardSettingsService.settingsToDisclaimer().forEach(addToFilterService);
            
            _self.chartArray.forEach(function(chart) {
                chart.reportParameters.forEach(addToFilterService);
            });
            
            $location.path("/dts/kbn/processexceptions");
        };
            
        _self.setDisclaimers = function(){
            filtersService.addFilter("processExceptions", {
                    property: 'bloqFila',
                    title: $rootScope.i18n('l-lock-queue',[],'dts/kbn'),
                    value: _self.settings.bloqFila,
                    fixed: false,
                    isParam: false
                });
            filtersService.addFilter("processExceptions", {
                    property: 'bloqProducao',
                    title: $rootScope.i18n('l-blocking-in-production',[],'dts/kbn'),
                    value: _self.settings.bloqProducao,
                    fixed: false,
                    isParam: false
                });
            filtersService.addFilter("processExceptions", {
                    property: 'bloqTransporte',
                    title: $rootScope.i18n('l-lock-on-transport',[],'dts/kbn'),
                    value: _self.settings.bloqTransporte,
                    fixed: false,
                    isParam: false
                });
            filtersService.addFilter("processExceptions", {
                    property: 'ajusteSaldo',
                    title: $rootScope.i18n('l-inventory-balance-adjust',[],'dts/kbn'),
                    value: _self.settings.ajusteSaldo,
                    fixed: false,
                    isParam: false
                });
            filtersService.addFilter("processExceptions", {
                    property: 'emissaoExtra',
                    title: $rootScope.i18n('l-extra-card-emission',[],'dts/kbn'),
                    value: _self.settings.emissaoExtra,
                    fixed: false,
                    isParam: false
                });         
        };

        $rootScope.$on('dashboardSettingsApplied', function(event, data) {
            _self.chartArray = [];
            _self.getProcessException();
        });

        _self.navigate = function(index) {
            _self.chartArray = _self.chartArray.splice(0,  index + 1);
            _self.chart = _self.chartArray[index];
        };

        _self.tooltip = $filter('i18n')('l-help-process-exception', [], 'dts/kbn/');

        _self.init();
    }

    index.register.controller('kbn.dashboard.processexception.ctrl', processExceptionCtrl);
});
