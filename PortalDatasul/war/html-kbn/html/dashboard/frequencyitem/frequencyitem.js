define(['index',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/html/dashboard/settings/settings.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/enumkbn.js',
        '/dts/kbn/js/helpers.js'
], function(index) {

    frequencyItemCtrl.$inject = [
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

    function frequencyItemCtrl(
        $filter,
        $scope,
        $rootScope,
        modalParams,
        proxyFactory,
        dashboardSettingsService,
        $location,
        filtersService,
        dataFactory,
        enumkbn,
        kbnHelper
    ) {
        var _self = this;
        _self.paretoOrderDesc = true;

        _self.chart = {
            titleWidget : 'l-frequency-item',
            titleBreadcrumb: $filter('i18n')('l-start', [], 'dts/kbn/'),
            categories: [],
            series: [],
            typeChart: 'column',
            reportParameters: [],
            onClick: angular.noop
        };

        _self.chartArray = [];

        _self.navigate = function(index) {
            _self.chartArray = _self.chartArray.splice(0,  index + 1);
            _self.chart = _self.chartArray[index];
        };

        _self.pushChart = function(chart) {
            _self.chart = chart;
            _self.chartArray.push(chart);
            $scope.$apply();
        };

        _self.changeOrder = function() {
            _self.paretoOrderDesc = !_self.paretoOrderDesc;
            var bkpCategories = angular.copy(_self.chart.categories);
            var bkpSeries = angular.copy(_self.chart.series);
            _self.chart.categories = bkpCategories.reverse();
            _self.chart.series = angular.copy(bkpSeries);
            _self.chart.series[0].data = bkpSeries[0].data.reverse();
        };

        _self.getData = function() {
            _self.settings = dashboardSettingsService.settings;
            var propertiesClassifier = kbnHelper.filtersToPropValues(
                dashboardSettingsService.settingsToDisclaimer().filter(function(disc) {return disc.property == 'classifier';}));
            proxyFactory.getFrequencyItem({
                num_id_estab: _self.settings.establishment.num_id_estab,
                dat_ini: _self.settings.dateRange.start,
                dat_fim: _self.settings.dateRange.end,
                tipo_item: _self.settings.itemExpedited,
                classifiers: propertiesClassifier.classifiers
            }, function(result) {
                _self.mainData = result;
                result.sort(function(left, right) {
                    return right.frequencyItem - left.frequencyItem;
                });

                result = result.filter(function(obj) {
                    return obj.frequencyItem > 0;
                });

                var categories = result.map(function(obj) {
                     return $filter('descGeneric')(obj, "{sku} {ref} ({exp.short})");
                });

                var values = result.map(function(obj){
                    return {
                        value: obj.frequencyItem,
                        id : obj.num_id_item,
                        item : $filter('descGeneric')(obj, "{sku} - {desc} {ref} ({exp.short})"),
                        codeErp: obj.cod_chave_erp
                    };
                });

                var chart = {
                    titleWidget : 'l-frequency-item',
                    titleBreadcrumb:  $filter('i18n')('l-start', [], 'dts/kbn/'),
                    categories: categories,
                    series: [{
                        data: values,
                        labels: { visible: true }
                    }],
                    typeChart: 'column',
                    reportParameters: [],
                    onClick: _self.loadDailyProduction
                };

                _self.pushChart(chart);

            });
        };

        _self.generateSettings = function(param) {
            return {
                cod_estab: param.establishment.cod_chave_erp,
                dat_ini: param.dateRange.start,
                dat_fim: param.dateRange.end,
                tipo_item: param.itemExpedited
            };
        };

        _self.loadDailyProduction = function(obj){

            var itemToFind = obj.dataItem.id;
            var itemData = _self.mainData.filter(function(item)
            {
                return item.num_id_item == itemToFind;

            });
            var dailyView = itemData[0].ttFrequencyDailyDataset;
            var categories = dailyView.map(function(obj){
                return $filter('date')(obj.dat_movto, 'dd/MM/yyyy', 'UTC');
            });

            var values = dailyView.map(function(obj){
                return obj.totalCards;
            });

            var chart = {
                titleWidget : 'l-item-frequency-daily',
                titleBreadcrumb : obj.category,
                categories: categories,
                series: [{
                    data: values,
                    labels: { visible: true }
                }],
                typeChart: 'line',
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
                onClick: angular.noop
            };

            _self.pushChart(chart);
        };

        _self.showParams = function()
        {
            modalParams.openTemplate({}, '/dts/kbn/html/dashboard/settings/settings.html');
        };

        _self.sendDataToReport = function() {
            if (_self.settings.establishment) {
                dataFactory.setEstablishmentDirective(_self.settings.establishment);
            }

            filtersService.clearFilters('frequencyitem');

            var addToFilterService = function(params) {
                if (params.property == 'classifier'){
                    dataFactory.set('kanbanClassifierSelect', JSON.stringify(params.value));
                    return;
                }
                if (params.property === 'itemType' && params.value === enumkbn.itemType.both) return;
                filtersService.addFilter('frequencyitem', params);
            };

            dashboardSettingsService.settingsToDisclaimer().forEach(addToFilterService);
            _self.chartArray.forEach(function(chart) {
                chart.reportParameters.forEach(addToFilterService);
            });

            $location.path("/dts/kbn/frequencyitem");
        };

        $rootScope.$on('dashboardSettingsApplied', function(event, data) {
            _self.chartArray = [];
            _self.getData();
        });

        _self.tooltip = $filter('i18n')('l-help-frequency-item', [], 'dts/kbn/');

        if(dashboardSettingsService.hasEstab()) _self.getData();
    }

    index.register.controller('kbn.dashboard.frequencyItem.ctrl', frequencyItemCtrl);
});
