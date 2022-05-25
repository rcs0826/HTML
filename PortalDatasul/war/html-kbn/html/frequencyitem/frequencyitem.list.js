define([
    'index',
    '/dts/kbn/js/factories/mappingErp-factories.js',
    '/dts/kbn/js/factories/kbn-factories.js',
    '/dts/kbn/html/frequencyitem/frequencyitem.detail.js',
    '/dts/kbn/html/frequencyitem/frequencyitem.advanced.search.js',
    '/dts/kbn/js/filters.js',
    '/dts/kbn/js/helpers.js',
    '/dts/kbn/js/directives.js',
    '/dts/kbn/js/filters-service.js',
    '/dts/kbn/js/enumkbn.js'
], function (index) {

    frequencyItemListCtrl.$inject = [
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'kbn.mappingErp.Factory',
        'messageHolder',
        'kbn.filters.service',
        'kbn.data.Factory',
        'ekanban.frequencyitem.DetailModal',
        '$filter',
        'kbn.helper.Service',
        'ReportService',
        'ekanban.frequencyitem.advanced.search.modal',
        'enumkbn'
    ];

    function frequencyItemListCtrl(
        $scope,
        appViewService,
        $rootScope,
        proxyFactory,
        messageHolder,
        filtersService,
        dataFactory,
        detailModal,
        $filter,
        kbnHelper,
        reportService,
        advancedSearchModal,
        enumkbn
    ) {
        var _self = this;

        _self.quickSearchText = '';

        _self.init = function() {
            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;
            
            createTab = appViewService.startView($rootScope.i18n('l-frequency-item'), 'ekanban.frequencyitem.ListCtrl', frequencyItemListCtrl);

            _self.filtersApplied = filtersService.get('frequencyitem');
            _self.classfierSelected = JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]');
            _self.updateClassifiersDisclaimer(_self.classfierSelected);
            _self.listRecords = [];

            _self.quickFilters = [
                {
                    title: $rootScope.i18n('l-flow-expedition'),
                    disclaimers: [{
                        property: 'itemType',
                        restriction: 'EQUALS',
                        value: 1,
                        title: $rootScope.i18n('l-flow-expedition'),
                        isParam: false
                        }
                    ]
                }, {
                    title: $rootScope.i18n('l-flow-process'),
                    disclaimers: [{
                        property: 'itemType',
                        restriction: 'EQUALS',
                        value: 0,
                        title: $rootScope.i18n('l-flow-process'),
                        isParam: false
                        }
                    ]
                }
            ];

            settings = dataFactory.getFrequencySettings();

            if (settings.dateRange.isToday) {
                _self.updateDate(settings.dateRange);
            }

            _self.dataIni = settings.dateRange.start;
            _self.dataFim = settings.dateRange.end;

            _self.addWithoutReplacing({
                  property: 'startDate',
                  restriction: 'EQUALS',
                  title: $rootScope.i18n('l-initial-date') + ': ' + $filter('date')(_self.dataIni, 'shortDate'),
                  value: _self.dataIni,
                  fixed: true
            });

            _self.addWithoutReplacing({
                  property: 'endDate',
                  restriction: 'EQUALS',
                  title: $rootScope.i18n('l-final-date') + ': ' + $filter('date')(_self.dataFim, 'shortDate'),
                  value: _self.dataFim,
                  fixed: true
            });

            var concatDisclaimers = _self.quickFilters.reduce(function(finalResult, val) {
                return finalResult.concat(val.disclaimers);
            }, []);
            filtersService.inheritSoftFilterProperties(_self.filtersApplied,  concatDisclaimers);

            _self.updateDataIniDataFim(_self.filtersApplied);
            
            _self.estabDirective = dataFactory.getEstablishmentDirective();
            
            if (_self.hasEstab()){
                _self.filtersApplied.forEach(function(filter){
                    if(filter.property == "codeERP") {
                        _self.quickSearchText = filter.value;
                        _self.prepareQuickSearch();
                        filtersService.removeFilter('frequencyitem', 'codeERP');
                    }
                });

                _self.doSearch();

                filtersService.addFilter("frequencyitem", {
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true,
                    isParam: false
                });
            } else {
                filtersService.removeFilter('frequencyitem', 'cod_estab_erp');
            }
        };

        _self.updateClassifiersDisclaimer = function(classifiers){
            if(classifiers.length > 0) {
                filtersService.addFilter('frequencyitem', {
                    property: "classifier",
                    title: $rootScope.i18n('l-classifier') + ': ' + kbnHelper.countClassifiers(classifiers) + '' + $rootScope.i18n('l-selecteds'),
                    value: classifiers,
                    isParam: true
                });
            } else {
                filtersService.removeFilter('frequencyitem', 'classifier');
            }
        }

        _self.updateDataIniDataFim = function(disclaimers) {
            disclaimers.forEach(function(disclaimer) {
                if (disclaimer.property === 'endDate') {
                    _self.dataFim = disclaimer.value;
                }
                if (disclaimer.property === 'startDate') {
                    _self.dataIni = disclaimer.value;
                }
            });
        };

        _self.isClassifierAtItem = function(record, classifierList)
        {
            var itemClassifiersList = (record.ttItemClasdorFrequencyItem || []).
                                        map(function(obj) {
                                            return obj.num_id_clasdor;
                                        });

            return kbnHelper.isItemInCategory(itemClassifiersList, classifierList);
        };

        _self.updateDate = function updateDate(date) {
            var end = new Date();
            var start = new Date(end - (date.end - date.start));

            date.end = end;
            date.start = start;
        };

        _self.setDefaultDate = function() {
            toDate = new Date();
            fromDate = new Date();
            fromDate.setDate(toDate.getDate() - 90);

            _self.dataFim = toDate.getTime();
            _self.dataIni = fromDate.getTime();

            _self.setFrequencySettings();

            filtersService.addFilter("frequencyitem", {
                property: 'startDate',
                restriction: 'EQUALS',
                title: $rootScope.i18n('l-initial-date') + ': ' + $filter('date')(_self.dataIni, 'shortDate'),
                value: _self.dataIni,
                fixed: true,
                isParam: false
            });

            filtersService.addFilter("frequencyitem", {
                property: 'endDate',
                restriction: 'EQUALS',
                title: $rootScope.i18n('l-final-date') + ': ' + $filter('date')(_self.dataFim, 'shortDate'),
                value: _self.dataFim,
                fixed: true,
                isParam: false
            });
        };
        _self.prepareQuickSearch = function(){
            if (_self.quickSearchText && _self.quickSearchText !== "") {

                filtersService.addFilter("frequencyitem", {
                    property: "ttFrequencyItem.cod_chave_erp|ttFrequencyItem.des_item_erp",
                    restriction: "LIKE",
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText || "",
                    isParam: true
                });

            } else {
                filtersService.removeFilter('frequencyitem',"ttFrequencyItem.cod_chave_erp|ttFrequencyItem.des_item_erp");
            }
            _self.updateClassifiersDisclaimer(JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]'));

            _self.bigCurrentPage = 1;
            _self.quickSearchText = '';
        }
        _self.quickSearch = function() {
            _self.prepareQuickSearch();
            _self.doSearch();
            
        };

        _self.quickFilterSelected = function(filter) {
            _self.addDisclaimers(filter.disclaimers);
            
            _self.bigCurrentPage = 1;
            _self.doSearch();
        };

        _self.addDisclaimers = function(disclaimers) {
            disclaimers.forEach(function(disclaimer){
                filtersService.addFilter('frequencyitem',disclaimer);
            });
        };

        _self.removeFilter = function(filter) {
            filtersService.removeFilter('frequencyitem',filter.property);
            if(filter.property == 'classifier') {
                dataFactory.set('kanbanClassifierSelect','');
                _self.updateClassifiersDisclaimer(JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]'));
                _self.classfierSelected = [];
            }
            if(!filter.softFilter) {
                _self.doSearch();
            }
        };

        _self.setFrequencySettings = function(){

            if(typeof _self.dataIni == "object")
                _self.dataIni = _self.dataIni.getTime();
            if(typeof _self.dataFim == "object")
                _self.dataFim = _self.dataFim.getTime();

            dataFactory.setFrequencySettings({
                dateRange:{
                    start: _self.dataIni,
                    end: _self.dataFim,
                    isToday: _self.isToday(new Date(_self.dataFim))
                }
            });
        };

        _self.callAdvancedSearch = function() {
            var oldEstab = _self.estabDirective.num_id_estab;

            advancedSearchModal.open({
                classifierSelected: JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]'),
                date: {
                    start:_self.dataIni,
                    end:_self.dataFim
                }}).then(function(result) {
                
                if (_self.hasEstab(result.estab)){

                    _self.dataIni = result.data.start;
                    _self.dataFim = result.data.end;
                    
                    dataFactory.setEstablishmentDirective(result.estab);

                    _self.estabDirective = result.estab;
                    
                    filtersService.addFilter("frequencyitem", {
                        property: 'cod_estab_erp',
                        title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                        value: _self.estabDirective.cod_estab_erp,
                        fixed: true
                    });
                    
                    if (oldEstab !== result.estab.num_id_estab){
                        filtersService.removeFilter('frequencyitem', 'itemType');
                        filtersService.removeFilter('frequencyitem', "ttFrequencyItem.cod_chave_erp|ttFrequencyItem.des_item_erp");
                        _self.quickSearchText = "";
                    }

                    filtersService.addFilter("frequencyitem", {
                          property: 'startDate',
                          restriction: 'EQUALS',
                          title: $rootScope.i18n('l-initial-date') + ': ' + $filter('date')(_self.dataIni, 'shortDate'),
                          value: _self.dataIni,
                          fixed: true
                    });

                    filtersService.addFilter("frequencyitem", {
                          property: 'endDate',
                          restriction: 'EQUALS',
                          title: $rootScope.i18n('l-final-date') + ': ' + $filter('date')(_self.dataFim, 'shortDate'),
                          value: _self.dataFim,
                          fixed: true
                    });
                    
                    _self.bigCurrentPage = 1;

                    _self.setFrequencySettings();
                    _self.classifierSelected = result.classifiers;
                    dataFactory.set('kanbanClassifierSelect',JSON.stringify(_self.classifierSelected));
                    _self.updateClassifiersDisclaimer(_self.classifierSelected);
                    _self.doSearch();
                    
                };
            });
        };
            
        _self.hasEstab = function(estab) {
            estab = estab || _self.estabDirective;

            return estab && estab.num_id_estab > 0;
        };

        _self.isToday = function(date) {
            var today = new Date();
            if (today.getDate() != date.getDate()) return false;
            if (today.getMonth() != date.getMonth()) return false;
            if (today.getYear() != date.getYear()) return false;
            return true;
        };

        _self.addWithoutReplacing = function(disclaimer) {
            for(var i = 0; i < _self.filtersApplied.length; ++i) {
                if(_self.filtersApplied[i].property === disclaimer.property) {
                    return;
                }
            }
            filtersService.addFilter("frequencyitem", disclaimer);
        };
            
        _self.selectFiltersParam = function(){
			var filters = [];
			var allFilters = filtersService.get('frequencyitem');
			allFilters.forEach(function(filter){
				if (filter.isParam){
					filters = filters.concat(filter);
				}
			})
							   
			return filters;
		};

        _self.doSearch = function() {
            _self.listRecords = [];
            
            var properties = kbnHelper.filtersToPropValues(_self.selectFiltersParam());            
            properties.pageSize = _self.pageSize;
            properties.currentPage = (_self.bigCurrentPage - 1);
            properties.num_id_estab = _self.estabDirective.num_id_estab;
            properties.dat_ini = _self.dataIni;
            properties.dat_fim = _self.dataFim;
            
            if (filtersService.getFilter('frequencyitem','itemType')){
                properties.tipo_item = filtersService.getFilter('frequencyitem','itemType').value;
            } else {
                properties.tipo_item = 2;
            }

            proxyFactory.getFrequencyConsumptionData( properties, {}, function(result) {

                _self.listRecords = result;
                
                if(result.length > 0){
                    _self.totalRecords = result[0].$length;
                } else {
                    _self.totalRecords = 0;
                }
            });
        };

        _self.exportaConsulta = function(format){
            
            var properties = kbnHelper.filtersToPropValues(_self.selectFiltersParam());            
            
            if (filtersService.getFilter('frequencyitem','itemType')){
                properties.tipo_item = filtersService.getFilter('frequencyitem','itemType').value;
            } else {
                properties.tipo_item = 2;
            }
            
            var fromDate = new Date(_self.dataIni);
            fromDate.setHours(0);
            fromDate.setMinutes(0);
            fromDate.setSeconds(0);
            fromDate.setMilliseconds(0);

            var toDate = new Date(_self.dataFim);
            toDate.setHours(0);
            toDate.setMinutes(0);
            toDate.setSeconds(0);
            toDate.setMilliseconds(0);
            
            var parameters = {
                dialect: "pt",
                format: format,
                QP_num_id_estab: _self.estabDirective.num_id_estab,
                QP_classifiers: properties.classifiers,
                QP_properties: properties.properties,
                QP_restriction: properties.restriction,
                QP_values: properties.values,
                QP_dat_ini: fromDate,
                QP_dat_fim: toDate,
                QP_tipo_item: properties.tipo_item,
                program: "/fch/fchkb/fchkbfrequencyitemreport",
                resultFileName: "frequencyitem"
            };

            reportService.run('kbn/frequencyitem',parameters, {});

        };

        _self.showItemDetails = function(item) {
            detailModal.open({data: item.ttFrequencyHourlyDataset, item: item});
        };
            
        _self.changePage = function(){
            _self.doSearch();
        };

        _self.init();
}

    index.register.controller('ekanban.frequencyitem.ListCtrl', frequencyItemListCtrl);
});
