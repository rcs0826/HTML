define(['index',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/html/dashboard/settings/settings.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/filters.js'
], function(index) {

    kanbanStatusCtrl.$inject = [
        '$scope',
        '$rootScope',
        '$filter',
        'kbn.helper.Service',
        'kbn.mappingErp.Factory',
        'kbn.dashboard.settings.modalService',
        'kbn.dashboard.settings.service',
        '$location',
        'kbn.filters.service',
        'kbn.data.Factory',
        'kbn.legend'
    ];

    function kanbanStatusCtrl(
        $scope,
        $rootScope,
        $filter,
        kbnHelper,
        mappingErpFactories,
        settingsModal,
        dashboardSettingsService,
        $location,
        filtersService,
        dataFactory,
        legend
    ) {
        var _self = this;
        _self.paretoOrderDesc = true;

        _self.init = function() {
            _self.settings = dashboardSettingsService.settings;
            _self.loadKanbanStatus(_self.settings);
        };

        _self.loadKanbanStatus = function(data) {
            _self.chartArray = [];
            _self.objectChartKanbanStatus([{ data: []}]);
            var propertiesClassifier = kbnHelper.filtersToPropValues(
                dashboardSettingsService.settingsToDisclaimer().filter(function(disc) {return disc.property == 'classifier';}));

            mappingErpFactories.dashBoardKanbanStatus({
                num_id_estab: data.establishment.num_id_estab,
                tipo_item: data.itemExpedited,
                classifiers: propertiesClassifier.classifiers
            },{},function(result){
                _self.mainData = result;
                _self.buildReturnKanbanStatus(result);
            });
        };

        _self.objectChartKanbanStatus = function(seriesData) {
            _self.chart = {
                titleWidget : 'l-kanbanstatus',
                titleBreadcrumb: $filter('i18n')('l-start', [], '/dts/kbn'),
                categories: legend.colorRange.getAllAsArray(),
                series: seriesData,
                typeChart: 'pie',
                reportParameters: [],
                onClick: _self.loadColorDetail
            };
        };

        _self.loadColorDetail = function(colorData) {
            var detailColor = _self.mainData
            .filter(function(obj) {
                return obj.colorRange == colorData.dataItem.colorId;
            });

            itemsAtColor = detailColor[0].ttKanbanStatusColorItemsDataset;
            var result = itemsAtColor.sort(function(left, right) {
                var rightPercentage = _self.sidePercentage(right);
                var leftPercentage = _self.sidePercentage(left);
                return rightPercentage - leftPercentage;
            });
            _self.buildReturnParetoItem(result, colorData);
        };

        _self.buildReturnParetoItem = function(result, colorData) {
            var mappedDataParetoItem = result.map(_self.returnMapDataParetoItem(colorData));

            var chartBuilt = _self.buildReturnChart(mappedDataParetoItem, colorData);
            _self.chartArray.push(chartBuilt);
            _self.chart = chartBuilt;
            $scope.$apply();
        };

        _self.buildReturnChart = function(mappedDataParetoItem, colorData) {
            return {
                titleWidget : 'l-complete-chart-percentage',
                titleBreadcrumb: colorData.dataItem.category,
                categories: mappedDataParetoItem.map(function(obj) {
                    return obj.category;
                }),
                series: [{data: mappedDataParetoItem, labels: {visible:true} }],
                typeChart: 'column',
                reportParameters: [{
                    property: 'colorRange',
                    restriction: 'EQUALS',
                    value: colorData.dataItem.colorId,
                    title: legend.colorRange.getDescById(colorData.dataItem.colorId)
                }],
                onClick: angular.noop
            };
        };

        _self.buildReturnKanbanStatus = function(result) {
            var mappedDataKanbanStatus = result.map(function(e) {
                return _self.returnMapDataKanbanStatus(e);
            });

            _self.objectChartKanbanStatus([{ data: mappedDataKanbanStatus, labels: {visible: true}}]);
            _self.chartArray.push(_self.chart);
        };

        _self.returnMapDataKanbanStatus = function(e) {
            return {
                value : e.quantityItems,
                category : legend.colorRange.getDescById(e.colorRange),
                colorId : e.colorRange,
                color : legend.colorRange.getColorById(e.colorRange)
            };
        };

        _self.openSettings = function() {
            settingsModal.openTemplate({}, '/dts/kbn/html/dashboard/settings/settings.nodate.html');
        };

        $rootScope.$on('dashboardSettingsApplied', function(event, data) {
            _self.chartArray = [];
            _self.chart = _self.objectChartKanbanStatus([{ data: []}]);
            _self.loadKanbanStatus(data);
        });

        _self.sidePercentage = function(side) {
            return kbnHelper.quantifyPriorityByRange({
                totalKanbans: side.qti_cartao,
                totalGreenZone: side.qti_verde_kanban,
                totalYellowZone: side.qti_amarela_kanban,
                totalRedZone: side.qti_vermelha_kanban
            });
        };

        _self.returnMapDataParetoItem = function(colorData) {
            return function(e) {
                _self.definePercentColumn(e, colorData);
                return {
                    value: _self.percentRanges,
                    category : $filter('descGeneric')(e, "{sku} {ref} ({exp.short})"),
                    color : legend.colorRange.getColorById(colorData.dataItem.colorId)
                };
            };
        };

        _self.definePercentColumn = function(e, colorData) {
            var stack = {
                totalKanbans: e.qti_cartao,
                totalGreenZone: e.qti_verde_kanban,
                totalYellowZone: e.qti_amarela_kanban,
                totalRedZone: e.qti_vermelha_kanban
            };
            _self.percentRanges = kbnHelper.calcColorRatio(stack, colorData.dataItem.colorId);
            _self.percentRanges = (_self.percentRanges * 100).toFixed(2);
        };

        _self.changeOrderPareto = function() {
            _self.paretoOrderDesc = !_self.paretoOrderDesc;
            var categories = angular.copy(_self.chart.categories);
            var series = angular.copy(_self.chart.series);
            _self.chart.categories = [];
            _self.chart.categories = categories.reverse();
            _self.chart.series = [];
            _self.chart.series = angular.copy(series);
            _self.chart.series[0].data = series[0].data.reverse();
            $scope.$apply();
            $scope.$digest();
        };

        _self.navigate = function(index) {
            _self.chartArray = _self.chartArray.splice(0,  index + 1);
            _self.chart = _self.chartArray[index];
        };

        _self.sendDataToReport = function() {
            if (_self.settings.establishment) {
                dataFactory.setEstablishmentDirective(_self.settings.establishment);
            }

            filtersService.clearFilters('kanbanStatus');

            _self.chartArray.forEach(function(chart) {
                chart.reportParameters.forEach(function(params) {
                    filtersService.addFilter('kanbanStatus', params);
                });
            });

            dashboardSettingsService.settingsToDisclaimer()
            .filter(function(disc) {
                return disc.property != 'startDate' && disc.property != 'endDate';
            })
            .forEach(function(single) {
                if (single.property == 'classifier'){
                    dataFactory.set('kanbanClassifierSelect',JSON.stringify(single.value));
                    return;
                }
                filtersService.addFilter('kanbanStatus', single);
            });

            $location.path("/dts/kbn/kanbanstatus");
        };

        _self.tooltip = $filter('i18n')('l-help-kanban-status', [], 'dts/kbn/');

        _self.init();
    }

    index.register.controller('kbn.dashboard.kanbanstatus.ctrl', kanbanStatusCtrl);
});

