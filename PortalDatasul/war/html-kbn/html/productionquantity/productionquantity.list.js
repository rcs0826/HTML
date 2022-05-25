define(['index',
        '/dts/kbn/html/productionquantity/productionquantity.detail.js',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/directives.js',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/html/productionquantity/productionquantity.advanced.search.js'
], function (index) {

    controllerInventoryAdjustmentListCtrl.$inject = [
        '$filter',
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'kbn.helper.Service',
        'messageHolder',
        'kbn.filters.service',
        'kbn.data.Factory',
        'ReportService',
        'ekanban.productionquantity.DetailModal',
        'kbn.data.Factory',
        'kbn.mappingErp.Factory',
        'ekanban.productionquantity.advanced.search.modal'
    ];
    function controllerInventoryAdjustmentListCtrl(
        $filter,
        $scope,
        appViewService,
        $rootScope,
        kbnHelper,
        messageHolder,
        filtersService,
        kbnDataService,
        reportService,
        detailModal,
        dataFactory,
        factoryErp,
        advancedSearchModal
    ) {
        var _self = this;

        _self.init = function () {
            createTab = appViewService.startView($rootScope.i18n('l-quantity-produced'), 'ekanban.productionquantity.ListCtrl', controllerInventoryAdjustmentListCtrl);
            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;
            _self.items = [];
            _self.filtersToDeleteWhenSiteChanged = ['nameItem', 'expedition'];
            _self.createDefaultDateFilters(filtersService.getFilter('productionquantity', 'startDate'));
            _self.filtersApplied = filtersService.get('productionquantity');
            _self.classifierSelected = JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]');
            _self.updateClassifiersDisclaimer(_self.classifierSelected);
            _self.quickSearchText = "";

            _self.preSavedFilters = [{
                title: $rootScope.i18n('l-flow-expedition'),
                disclaimers: [{
                    property: 'itemType',
                    restriction: 'EQUALS',
                    value: 1,
                    hide: false,
                    title: $rootScope.i18n('l-flow-expedition')
                }]
            }, {
                title: $rootScope.i18n('l-flow-process'),
                disclaimers: [{
                    property: 'itemType',
                    restriction: 'EQUALS',
                    value: 0,
                    hide: false,
                    title: $rootScope.i18n('l-flow-process')
                }]
            }];
            var concatDisclaimers = _self.preSavedFilters.reduce(function (finalResult, val) {
                return finalResult.concat(val.disclaimers);
            }, []);
            filtersService.inheritSoftFilterProperties(_self.filtersApplied, concatDisclaimers);

            _self.estabDirective = dataFactory.getEstablishmentDirective();

            if (_self.hasEstab()) {
                _self.filtersApplied.forEach(function(filter){
                    if(filter.property == "num_id_item")
                        filtersService.removeFilter('productionquantity', 'num_id_item');
                    if(filter.property == "quickSearch")
                        _self.quickSearchText = filter.value;
                });

                _self.doSearch();

                filtersService.addFilter("productionquantity", {
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });
            } else {
                filtersService.removeFilter('productionquantity', 'cod_estab_erp');
            }
        };

        _self.createDefaultDateFilters = function (existsStartDate) {
            if (!existsStartDate) {
                var yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);
                _self.fromDate = yesterday.getTime();
                _self.toDate = new Date().getTime();
                _self.setFrequencySettings();
                _self.setDateFilterService();
            }
        };

        _self.setDateFilterService = function () {
            filtersService.addFilter('productionquantity', {
                property: 'startDate',
                restriction: 'EQUALS',
                title: $rootScope.i18n('l-initial-date') + ': ' + $filter('date')(_self.fromDate, 'shortDate'),
                value: _self.fromDate,
                fixed: true
            });
            filtersService.addFilter('productionquantity', {
                property: 'endDate',
                restriction: 'EQUALS',
                title: $rootScope.i18n('l-final-date') + ': ' + $filter('date')(_self.toDate, 'shortDate'),
                value: _self.toDate,
                fixed: true
            });
        };

        _self.removeAllowedFilters = function () {
            var filters = filtersService.get('productionquantity');
            var cont = filters.length;
            while (cont--) {
                if (_self.filtersToDeleteWhenSiteChanged.indexOf(filters[cont].property) > 0) {
                    filtersService.removeFilter('productionquantity', filters[cont].property);
                }
            }
        };

        _self.showItemDetails = function (itemMaster) {
            detailModal.open({
                data: itemMaster
            });
        };

        _self.exportaConsulta = function (format) {
            var itemType = filtersService.getFilter('productionquantity', 'itemType').value;
            if (itemType == undefined) itemType = 2;
            var classifierSelected = kbnHelper.parseToClassifiers(_self.classifierSelected);
            var filters = filtersService.get('productionquantity');
            var properties = kbnHelper.filtersToPropValues(filters);

            var parameters = {
                dialect: "pt",
                format: format,
                QP_estab: _self.estabDirective.num_id_estab,
                QP_datIni: _self.fromDateUsed,
                QP_datFim: _self.toDateUsed,
                QP_pageSize: 0,
                QP_currentPage: 0,
                QP_tipo_item: itemType,
                QP_textSearch: _self.quickSearchText,
                QP_classifiers: properties.classifiers,
                program: "/fch/fchkb/fchkbproductionquantityreport",
                resultFileName: "productionquantity"
            };

            reportService.run('kbn/productionquantity',parameters, {});
        };

        _self.selectFiltersParam = function () {
            var filters = [];
            var allFilters = filtersService.get('frequencyitem');
            allFilters.forEach(function (filter) {
                if (filter.property == 'classifier') {
                    filters = filters.concat(filter);
                }
            })

            return filters;
        };

        _self.doSearch = function () {
            _self.items = [];
            _self.fromDate = filtersService.getFilter('productionquantity', 'startDate').value;
            _self.toDate = filtersService.getFilter('productionquantity', 'endDate').value;
            var itemType = filtersService.getFilter('productionquantity', 'itemType').value;
            if (itemType == undefined) itemType = 2;
            var filters = filtersService.get('productionquantity');
            var properties = kbnHelper.filtersToPropValues(filters);

            factoryErp.getProducedQuantityData({
                estab: _self.estabDirective.num_id_estab,
                datIni: _self.fromDate,
                datFim: _self.toDate,
                pageSize: _self.pageSize,
                currentPage: (_self.bigCurrentPage - 1),
                textSearch: _self.quickSearchText,
                tipo_item: itemType,
                classifiers: properties.classifiers
            }, {}, function (result) {
                if (result.length > 0) {
                    _self.totalRecords = result[0].$length;
                    _self.items = result;
                } else {
                    _self.totalRecords = 0;
                }

            });

            _self.fromDateUsed = _self.fromDate;
            _self.toDateUsed = _self.toDate;
        };

        _self.addDisclaimers = function (disclaimers) {
            disclaimers.forEach(function (disclaimer) {
                filtersService.addFilter('productionquantity', disclaimer);
            });
        };

        _self.isSoftFilter = function (disclaimer) {
            return disclaimer.softFilter === true;
        };

        _self.filterSoftFilters = function (record) {
            _self.filtersApplied = filtersService.get('productionquantity');
            var softFilters = _self.filtersApplied.filter(_self.isSoftFilter);

            return softFilters.reduce(_self.reduceFnShouldShowRecord(record), true);
        };

        _self.reduceFnShouldShowRecord = function (record) {
            return function (result, filter) {
                return result && filter.softFilterBehavior(record);
            };
        };

        _self.containsString = function (base, substring) {
            return base.indexOf(substring) !== -1;
        };

        _self.quickSearch = function () {
            if (_self.quickSearchText && _self.quickSearchText !== "") {
                filtersService.addFilter('productionquantity', {
                    property: 'quickSearch',
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText
                });
            } else {
                filtersService.removeFilter('productionquantity', "quickSearch");
                _self.quickSearchText = '';
            }
            _self.doSearch();
        };

        _self.removeFilter = function (filter) {
            filtersService.removeFilter('productionquantity', filter.property);
            if (filter.property == 'quickSearch') _self.quickSearchText = '';
            if (filter.property == 'classifier') {
                dataFactory.set('kanbanClassifierSelect', '');
                _self.updateClassifiersDisclaimer(JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]'));
                _self.classifierSelected = [];
            }
            _self.doSearch();
        };

        _self.isClassifierAtItem = function (record, classifierList) {
            var itemClassifiersList = (record.ttItemClasdorBuffer || [])
                .map(function (obj) {
                    return obj.num_id_clasdor;
                });

            return kbnHelper.isItemInCategory(itemClassifiersList, classifierList);
        };

        _self.updateClassifiersDisclaimer = function (classifiers) {
            if (classifiers.length > 0) {
                filtersService.addFilter('productionquantity', {
                    property: "classifier",
                    title: $rootScope.i18n('l-classifier') + ': ' + kbnHelper.countClassifiers(classifiers) + ' ' + $rootScope.i18n('l-selecteds'),
                    value: classifiers
                });
            } else {
                filtersService.removeFilter('productionquantity', 'classifier');
            }
        };

        _self.selectQuickFilter = function (filter) {
            _self.addDisclaimers(filter.disclaimers);
            _self.doSearch();
        };

        _self.setFrequencySettings = function () {
            if (typeof _self.fromDate == "object")
                _self.fromDate = _self.fromDate.getTime();
            if (typeof _self.toDate == "object")
                _self.toDate = _self.toDate.getTime();

            dataFactory.setFrequencySettings({
                dateRange: {
                    start: _self.fromDate,
                    end: _self.toDate,
                    isToday: _self.isToday(new Date(_self.toDate))
                }
            });
        };

        _self.isToday = function (date) {
            var today = new Date();
            if (today.getDate() != date.getDate()) return false;
            if (today.getMonth() != date.getMonth()) return false;
            if (today.getYear() != date.getYear()) return false;
            return true;
        };

        _self.callAdvancedSearch = function () {
            var oldEstab = _self.estabDirective.num_id_estab;

            advancedSearchModal.open({
                classifierSelected: _self.classifierSelected,
                date: {
                    start: _self.fromDate,
                    end: _self.toDate
                }
            }).then(function (result) {

                if (_self.hasEstab(result.estab)) {

                    _self.fromDate = result.data.start;
                    _self.toDate = result.data.end;

                    _self.setDateFilterService();
                    _self.setFrequencySettings();

                    dataFactory.setEstablishmentDirective(result.estab);

                    _self.estabDirective = result.estab;

                    filtersService.addFilter("productionquantity", {
                        property: 'cod_estab_erp',
                        title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                        value: _self.estabDirective.cod_estab_erp,
                        fixed: true
                    });

                    if (oldEstab !== result.estab.num_id_estab) {
                        filtersService.removeFilter('productionquantity', "quickSearch");
                        filtersService.removeFilter('productionquantity', 'itemType');
                        _self.quickSearchText = "";
                    }

                    _self.classifierSelected = result.classifiers;
                    dataFactory.set('kanbanClassifierSelect', JSON.stringify(_self.classifierSelected));
                    _self.updateClassifiersDisclaimer(result.classifiers);

                    _self.doSearch();
                }
            });
        };

        _self.hasEstab = function (estab) {
            estab = estab || _self.estabDirective;

            return estab && estab.num_id_estab > 0;
        };

        _self.changePage = function () {
            _self.doSearch();
        }

        _self.init();
    }

    index.register.controller('ekanban.productionquantity.ListCtrl', controllerInventoryAdjustmentListCtrl);
});
