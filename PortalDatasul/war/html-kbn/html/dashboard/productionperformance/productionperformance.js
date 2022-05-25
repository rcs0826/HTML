define(['index',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/html/dashboard/settings/settings.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/enumkbn.js',
        '/dts/kbn/js/helpers.js'    
], function(index) {
    productionPerformanceCtrl.$inject = [
        '$scope',
        '$filter',
        '$rootScope',
        'kbn.dashboard.settings.modalService',
        'kbn.dashboard.settings.service',
        'kbn.mappingErp.Factory',
        '$location',
        'kbn.filters.service',
        'kbn.data.Factory',
        'enumkbn',
        'kbn.helper.Service'
    ];
    function productionPerformanceCtrl(
        $scope,
        $filter,
        $rootScope,
        modalParams,
        dashboardSettingsService,
        factoryErp,
        $location,
        filtersService,
        dataFactory,
        enumkbn,
        kbnHelper
    ) {
        var _self = this;
        _self.settings = dashboardSettingsService.settings;
        _self.chart = {
            titleWidget : 'l-production-performance-card',
            titleBreadcrumb: $filter('i18n')('l-start', [], 'dts/kbn/'),
            categories: [],
            series: [],
            reportParameters : [],
            typeChart: 'column',
            onClick: angular.noop
        };

        _self.chartArray = [];

        _self.init = function(){
            if(dashboardSettingsService.hasEstab()) _self.loadInfo(_self.settings);
        };

        _self.loadInfo = function(param){
            factoryErp.dashBoardProdPerformance(_self.generateSettings(param), _self.parseProductionPerformanceData);
        };

        _self.generateSettings = function(param) {
            var propertiesClassifier = kbnHelper.filtersToPropValues(
                dashboardSettingsService.settingsToDisclaimer().filter(function(disc) {return disc.property == 'classifier';}));
            return {
                num_id_estab: param.establishment.num_id_estab,
                dat_ini: param.dateRange.start,
                dat_fim: param.dateRange.end,
                tipo_item: param.itemExpedited,
                classifiers: propertiesClassifier.classifiers
            };
        };

        _self.parseProductionPerformanceData = function(result) {
            _self.listData = result;
            result.sort(function(left, right) {
                return right.cardsProduced - left.cardsProduced;
            });

            var categories = result.map(function(obj){
                return $filter('descGeneric')(obj, "{sku} {ref} ({exp.short})");
            });

            var data = result.map(function(obj){
                return {
                    value: obj.cardsProduced,
                    id : obj.num_id_item,
                    codErp: obj.cod_chave_erp,
                    item : $filter('descGeneric')(obj, "{sku} - {desc} {ref} ({exp.short})")
                };
            });

            var chart = {
                titleWidget : 'l-production-performance-card',
                titleBreadcrumb:  $filter('i18n')('l-start', [], 'dts/kbn/'),
                categories: categories,
                series: [{
                    data: data,
                    labels: { visible: true }
                }],
                reportParameters : [],
                typeChart: 'column',
                onClick: _self.loadDailyProduction
            };

            _self.pushChart(chart);
        };

        _self.pushChart = function(chart) {
            _self.chart = chart;
            _self.chartArray.push(chart);
            $scope.$apply();
            $scope.$digest();
        };

        _self.showParams = function() {
            modalParams.open();
        };

        _self.loadDailyProduction = function(obj){
            var itemToFind = obj.dataItem.id;
            var itemData = _self.listData.filter(function(item){
                return item.num_id_item == itemToFind;
            });
            var dailyView = itemData[0].ttDailyProdPerformanceDataset;
            var categories = dailyView.map(function(obj){
                return $filter('date')(obj.dt_cards, 'dd/MM/yyyy', 'UTC');
            });

            var data = dailyView.map(function(obj){
                return obj.cardsProduced;
            });

            var chart = {
                titleWidget : 'l-item-production-daily',
                titleBreadcrumb : obj.category,
                categories: categories,
                series: [{
                    data: data,
                    labels: { visible: true }
                }],
                reportParameters: [{
                    property: 'num_id_item',
                    value: itemToFind,
                    title: $rootScope.i18n('l-item', [], 'dts/kbn') + ': '+ obj.dataItem.codErp,
                    softFilter: true,
                    softFilterBehavior: function(record) {
                        return record.num_id_item == itemToFind;
                    }
                }],
                typeChart: 'line',
                onClick: angular.noop
            };
            _self.cod_chave_erp = obj.dataItem.codErp;
            _self.pushChart(chart);
        };

        $scope.$on('dashboardSettingsApplied', function(result) {
            _self.chartArray = [];
            _self.loadInfo(_self.settings);
        });

        _self.navigate = function(index) {
            _self.chartArray = _self.chartArray.splice(0,  index + 1);
            _self.chart = _self.chartArray[index];
        };

        _self.sendDataToReport = function() {
            if (_self.settings.establishment) {
                dataFactory.setEstablishmentDirective(_self.settings.establishment);
            }

            filtersService.clearFilters('productionquantity');

            _self.chartArray.forEach(function(chart) {
                chart.reportParameters.forEach(function(params) {
                    filtersService.addFilter('productionquantity', params);
                });
            });

            dashboardSettingsService.settingsToDisclaimer()
            .forEach(function(params) {
                if (params.property == 'classifier'){
                    dataFactory.set('kanbanClassifierSelect', JSON.stringify(params.value));
                    return;
                }
                if (params.property === 'itemType' && params.value === enumkbn.itemType.both) return;
                filtersService.addFilter('productionquantity', params);
            });

            if(_self.cod_chave_erp !== undefined){
                var itemParam = {
                    property: 'quickSearch',
                    value: _self.cod_chave_erp,
                    title: $rootScope.i18n('l-description', [], 'dts/kbn') + ': ' + _self.cod_chave_erp
                };

                filtersService.addFilter('productionquantity', itemParam);
            }

            $location.path("/dts/kbn/productionquantity");
        };

        _self.tooltip = $filter('i18n')('l-help-production-performance', [], 'dts/kbn/');
        _self.init();
    }
    index.register.controller('kbn.dashboard.productionPerformanceCtrl.ctrl', productionPerformanceCtrl);
});
