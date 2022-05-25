define(['index',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/html/dashboard/settings/settings.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/enumkbn.js',
        '/dts/kbn/js/helpers.js'
], function(index) {

    itemTimeByRangeCtrl.$inject = [
        '$filter',
        '$scope',
        '$rootScope',
        'kbn.dashboard.settings.modalService',
        'kbn.mappingErp.Factory',
        'kbn.dashboard.settings.service',
        '$location',
        'kbn.filters.service',
        'kbn.data.Factory',
        'enumkbn',
        'kbn.helper.Service'
    ];

    function itemTimeByRangeCtrl(
        $filter,
        $scope,
        $rootScope,
        modalParams,
        erpFactory,
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
            _self.paretoOrderRed = true;
            _self.settings = dashboardSettingsService.settings;
            if(dashboardSettingsService.hasEstab()) _self.getItemTimeRange();
        };

        _self.chart = {
            titleWidget : 'l-production-performance-card',
            titleBreadcrumb: $filter('i18n')('l-start', [], 'dts/kbn/'),
            categories: [],
            series: [],
            reportParameters: [],
            onClick: angular.noop,
            canChangeOrder: true
        };

        _self.chartArray = [];

        _self.changeOrder = function() {
            _self.paretoOrderRed = !_self.paretoOrderRed;
            _self.chartArray = [];
            _self.orderPareto(_self.list);
        };

        _self.orderPareto = function(obj){
            var ordenaVermelho = function(left,right){
                return right.qtd_horas_vermelha - left.qtd_horas_vermelha;
            };
            var ordenaAmarelo = function(left,right){
                return right.qtd_horas_amarela - left.qtd_horas_amarela;
            };
            var ordenaVerde = function(left,right){
                return right.qtd_horas_verde - left.qtd_horas_verde;
            };
            if(_self.paretoOrderRed){
                obj
                    .sort(ordenaVerde)
                    .sort(ordenaAmarelo)
                    .sort(ordenaVermelho);
            } else {
                obj
                    .sort(ordenaVermelho)
                    .sort(ordenaAmarelo)
                    .sort(ordenaVerde);
            }
            _self.loadDashItemTime(obj);
        };

        _self.getItemTimeRange = function() {
            erpFactory.dashboardItemTimeRange(_self.generateSettings(),
                function(result) {
                if(result){
                    _self.list = result;
                    _self.orderPareto(_self.list);
                }
            });
        };

        _self.generateSettings = function() {
            var propertiesClassifier = kbnHelper.filtersToPropValues(
                dashboardSettingsService.settingsToDisclaimer().filter(function(disc) {return disc.property == 'classifier';}));
            
            return {
                num_id_estab: _self.settings.establishment.num_id_estab,
                dat_ini: _self.settings.dateRange.start,
                dat_fim: _self.settings.dateRange.end,
                tipo_item: _self.settings.itemExpedited,
                classifiers: propertiesClassifier.classifiers
            };
        };

        _self.loadDashItemTime = function(result){
            _self.mainData = result;
            var categories = result.map(function(obj){
                return $filter('descGeneric')(obj, "{sku} {ref} ({exp.short})");
            });

            var roundTime = function(field) {
                return function(obj){
                    return {
                        value: parseFloat(obj[field].toFixed(2)),
                        id : obj.num_id_item,
                        item : $filter('descGeneric')(obj, "{sku} - {desc} {ref} ({exp.short})"),
                        codeErp: obj.cod_chave_erp
                    };
                };
            };

            var greenRange = result.map(roundTime('qtd_horas_verde'));
            var yellowRange = result.map(roundTime('qtd_horas_amarela'));
            var redRange = result.map(roundTime('qtd_horas_vermelha'));

            var chart = {
                titleWidget : 'l-item-time-by-range',
                titleBreadcrumb: $filter('i18n')('l-start', [], 'dts/kbn/'),
                categories: categories,
                series: [{
                    name: $rootScope.i18n('l-green-range',[],'dts/kbn'),
                    color: "#41a85f",
                    stack: "item",
                    data: greenRange,
                    tooltip: {
                        visible: true,
                        template: "#= value #"
                    },
					labels: { visible: false }
                }, {
                    name: $rootScope.i18n('l-yellow-range',[],'dts/kbn'),
                    color: "#fac51c",
                    stack: "item",
                    data: yellowRange,
                    tooltip: {
                        visible: true,
                        template: "#= value #"
                    },
					labels: { visible: false }
                }, {
                    name: $rootScope.i18n('l-red-range',[],'dts/kbn'),
                    color: "#b8312f",
                    stack: "item",
                    data: redRange,
                    tooltip: {
                        visible: true,
                        template: "#= value #"
                    },
					labels: { visible: false }
                }],
                reportParameters: [],
                onClick: _self.loadDailyTime,
                canChangeOrder: true
            };
            _self.pushChart(chart);
        };

        _self.loadDailyTime = function(obj){
            var itemToFind = obj.dataItem.id;
            var itemData = _self.mainData.filter(function(item)
            {
                return item.num_id_item == itemToFind;

            });
            var dailyView = itemData[0].ttItemTimeRangeDailyViewDataset;
            var categories = dailyView.map(function(obj){
                return $filter('date')(obj.dt_faixa, 'dd/MM/yyyy', 'UTC');
            });

            var values = dailyView.map(function(obj){
                return obj.totalCards;
            });

            var roundTime = function(field) {
                return function(obj){
                    return {
                        value: parseFloat(obj[field].toFixed(2)),
                        id : obj.num_id_item,
                        item : $filter('descGeneric')(obj, "{sku} - {desc} {ref} ({exp.short})")
                    };
                };
            };

            var greenRange = dailyView.map(roundTime('qtd_horas_verde'));
            var yellowRange = dailyView.map(roundTime('qtd_horas_amarela'));
            var redRange = dailyView.map(roundTime('qtd_horas_vermelha'));

            var chart = {
                titleWidget : 'l-item-time-daily',
                titleBreadcrumb: obj.category,
                categories: categories,
                series: [
                    {
                        name: $rootScope.i18n('l-red-range',[],'dts/kbn'),
                        color: '#b8312f',
                        stack: 'date',
                        data: redRange,
                        tooltip: {
                            visible: true,
                            template: "#= value #"
                        },
						labels: { visible: false }
                    },
                    {
                        name: $rootScope.i18n('l-yellow-range',[],'dts/kbn'),
                        color: '#fac51c',
                        stack: 'date',
                        data: yellowRange,
                        tooltip: {
                            visible: true,
                            template: "#= value #"
                        },
						labels: { visible: false }
                    },
                    {
                        name: $rootScope.i18n('l-green-range',[],'dts/kbn'),
                        color: '#41a85f',
                        stack: 'date',
                        data: greenRange,
                        tooltip: {
                            visible: true,
                            template: "#= value #"
                        },
						labels: { visible: false }
                    }
                ],
                reportParameters: [{
                    property: 'codeERP',
                    title: $rootScope.i18n('l-description', [], 'dts/kbn') + ': ' + obj.dataItem.codeErp,
                    value: obj.dataItem.codeErp,
                    softFilter: true,
                    softFilterBehavior: function(record) {
                        var searchString = obj.dataItem.codeErp.toLowerCase();
                        var codItem = record.cod_chave_erp.toLowerCase();
                        var desItem = record.des_item_erp.toLowerCase();

                        var containsString = function(base, substring) {
                            return base.indexOf(substring) !== -1;
                        };

                        return containsString(codItem, searchString) || containsString(desItem, searchString);
                    }
                }],
                onClick: angular.noop,
                canChangeOrder: false
            };
            _self.pushChart(chart);
        };

        _self.pushChart = function(chart) {
            _self.chart = chart;
            _self.chartArray.push(chart);
            $scope.$apply();
            $scope.$digest();
        };

        _self.showParams = function(){
            modalParams.openTemplate({}, '/dts/kbn/html/dashboard/settings/settings.html');
        };

        _self.sendDataToReport = function() {
            if (_self.settings.establishment) {
                dataFactory.setEstablishmentDirective(_self.settings.establishment);
            }

            filtersService.clearFilters('itemtimebyrange');

            var addToFilterService = function(params) {
                if (params.property == 'classifier'){
                    dataFactory.set('kanbanClassifierSelect', JSON.stringify(params.value));
                    return;
                }
                
                if (params.property === 'itemType' && params.value === enumkbn.itemType.both) return;
                filtersService.addFilter('itemtimebyrange', params);
            };

            dashboardSettingsService.settingsToDisclaimer().forEach(addToFilterService);

            _self.chartArray.forEach(function(chart) {
                chart.reportParameters.forEach(addToFilterService);
            });

            $location.path("/dts/kbn/itemtimebyrange");
        };

        $rootScope.$on('dashboardSettingsApplied', function(event, data) {
            _self.chartArray = [];
            _self.getItemTimeRange();
        });

        _self.navigate = function(index) {
            _self.chartArray = _self.chartArray.splice(0,  index + 1);
            _self.chart = _self.chartArray[index];
        };

        _self.tooltip = $filter('i18n')('l-help-time-range', [], 'dts/kbn/');

        _self.init();
    }

    index.register.controller('kbn.dashboard.itemTimebyRange.ctrl', itemTimeByRangeCtrl);
});
