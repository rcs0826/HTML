define(['index',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/js/factories/kbn-factories.js',
        '/dts/kbn/html/itemtimebyrange/itemtimebyrange.advanced.search.js',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/helpers.js',
    	'/dts/kbn/js/directives.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/enumkbn.js'
], function (index) {

    itemTimeByRangeListCtrl.$inject = [
        'totvs.app-main-view.Service',
        '$rootScope',
        'kbn.mappingErp.Factory',
        'kbn.filters.service',
        'kbn.data.Factory',
        '$filter',
        'kbn.helper.Service',
        'ekanban.itemtimebyrange.advanced.search.modal',
        'ReportService',
        '$scope',
        'enumkbn'
    ];

    function itemTimeByRangeListCtrl(
        appViewService,
        $rootScope,
        proxyFactory,
        filtersService,
        dataFactory,
        $filter,
        kbnHelper,
        advancedSearchModal,
        reportService,
        $scope,
        enumkbn
    ) {
        var _self = this;

        _self.quickSearchText = '';
        _self.quickFilters = [
            {
                title: $rootScope.i18n('l-flow-expedition'),
                disclaimers: [{
                    property: 'itemType',
                    restriction: 'EQUALS',
                    value: enumkbn.itemType.final,
                    title: $rootScope.i18n('l-flow-expedition'),
                    isParam: false
                    }
                ]
            }, {
                title: $rootScope.i18n('l-flow-process'),
                disclaimers: [{
                    property: 'itemType',
                    restriction: 'EQUALS',
                    value: enumkbn.itemType.process,
                    title: $rootScope.i18n('l-flow-process'),
                    isParam: false
                    }
                ]
            }
        ];

        _self.init = function() {
            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;
            
            createTab = appViewService.startView($rootScope.i18n('l-item-time-by-range'), 'ekanban.itemtimebyrange.ListCtrl', itemTimeByRangeListCtrl);

            _self.filtersApplied = filtersService.get('itemtimebyrange');
            _self.classifierSelected = JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]');
            _self.updateClassifiersDisclaimer(_self.classifierSelected);
            _self.listRecords = [];

            settings = dataFactory.getItemTimeByRangeSettings();

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
            
            _self.estabDirective = dataFactory.getEstablishmentDirective();


            if (_self.hasEstab()){
                _self.filtersApplied.forEach(function(filter){
                    if(filter.property == "codeERP") {
                        _self.quickSearchText = filter.value;
                        _self.prepareQuickSearch();
                        filtersService.removeFilter('itemtimebyrange', 'codeERP');
                    }
                });


                _self.doSearch();

                filtersService.addFilter("itemtimebyrange", {
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });
            } else {
                filtersService.removeFilter('itemtimebyrange', 'cod_estab_erp');
            }
        };

        _self.isClassifierAtItem = function(record, classifierList){
            var itemClassifiersList = (record.ttItemClasdorTimeByRange || []).map(function(obj) {
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
            fromDate.setDate(toDate.getDate() - 30);

            _self.dataFim = toDate.getTime();
            _self.dataIni = fromDate.getTime();

            _self.setItemTimeByRangeSettings();
            _self.addFilterDefaultDate();
        };

        _self.addFilterDefaultDate = function() {
            filtersService.addFilter("itemtimebyrange", {
                  property: 'startDate',
                  restriction: 'EQUALS',
                  title: $rootScope.i18n('l-initial-date') + ': ' + $filter('date')(_self.dataIni, 'shortDate'),
                  value: _self.dataIni,
                  fixed: true
            });

            filtersService.addFilter("itemtimebyrange", {
                  property: 'endDate',
                  restriction: 'EQUALS',
                  title: $rootScope.i18n('l-final-date') + ': ' + $filter('date')(_self.dataFim, 'shortDate'),
                  value: _self.dataFim,
                  fixed: true
            });
        };
        _self.getStartDateFromFilter = function() {
            return filtersService.getFilter('itemtimebyrange', 'startDate').value;
        };
        _self.getEndDateFromFilter = function() {
            return filtersService.getFilter('itemtimebyrange', 'endDate').value;
        };

        _self.callAdvancedSearch = function() {
            var oldEstab = _self.estabDirective.num_id_estab;
            
            advancedSearchModal.open({classifierSelected: JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]'),
                                      date:{start:_self.getStartDateFromFilter(),
                                            end:_self.getEndDateFromFilter()}})
                               .then(function(result) {
                
                if (_self.hasEstab(result.estab)){
                    
                    dataFactory.setEstablishmentDirective(result.estab);
                    
                    _self.estabDirective = result.estab;
                    
                    _self.dataIni = result.data.start;
                    _self.dataFim = result.data.end;

                    _self.addFilterDefaultDate();
                    _self.setItemTimeByRangeSettings();
                    
                    filtersService.addFilter("itemtimebyrange", {
                        property: 'cod_estab_erp',
                        title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                        value: _self.estabDirective.cod_estab_erp,
                        fixed: true
                    });
                    
                    if (oldEstab !== result.estab.num_id_estab){
                        filtersService.removeFilter('itemtimebyrange',"ttItemTimeRangeByItem.cod_chave_erp|ttItemTimeRangeByItem.des_item_erp");
                        filtersService.removeFilter('itemtimebyrange','itemType');
                        _self.quickSearchText = "";	
                    }
                    
                    _self.classifierSelected = result.classifiers;
                    dataFactory.set('kanbanClassifierSelect',JSON.stringify(_self.classifierSelected));
                    _self.updateClassifiersDisclaimer(_self.classifierSelected);
                    
                    _self.bigCurrentPage = 1;
                    
                    _self.doSearch();
                }
            });
        };
            
        _self.hasEstab = function(estab) {
            estab = estab || _self.estabDirective;

            return estab && estab.num_id_estab > 0;
        };

        _self.prepareQuickSearch = function(){
            if (_self.quickSearchText && _self.quickSearchText !== "") {

                filtersService.addFilter("itemtimebyrange", {
                    property: "ttItemTimeRangeByItem.cod_chave_erp|ttItemTimeRangeByItem.des_item_erp",
                    restriction: "LIKE",
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText || "",
                    isParam: true
                });

            } else {
                filtersService.removeFilter('itemtimebyrange',"ttItemTimeRangeByItem.cod_chave_erp|ttItemTimeRangeByItem.des_item_erp");
            }
            _self.updateClassifiersDisclaimer(JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]'));

            _self.bigCurrentPage = 1;
            _self.quickSearchText = '';
        }

        _self.quickSearch = function() {
            _self.prepareQuickSearch();
            _self.doSearch();
        };
            
        _self.changePage = function(){
            _self.doSearch();
        };
            
        _self.updateClassifiersDisclaimer = function(classifiers){
            if(classifiers.length > 0) {
                filtersService.addFilter('itemtimebyrange', {
                    property: "classifier",
                    title: $rootScope.i18n('l-classifier') + ': ' + kbnHelper.countClassifiers(classifiers) + '' + $rootScope.i18n('l-selecteds'),
                    value: classifiers,
                    isParam: true
                });
            } else {
                filtersService.removeFilter('itemtimebyrange', 'classifier');
            }
        }

        _self.quickFilterSelected = function(filter) {
            _self.addDisclaimers(filter.disclaimers);
            
            _self.bigCurrentPage = 1;
            _self.doSearch();
        };

        _self.addDisclaimers = function(disclaimers) {
            disclaimers.forEach(function(disclaimer){
                filtersService.addFilter('itemtimebyrange',disclaimer);
            });
        };

        _self.removeFilter = function(filter) {
            filtersService.removeFilter('itemtimebyrange',filter.property);
            if(filter.property == 'classifier') {
                dataFactory.set('kanbanClassifierSelect','');
            }
            
            _self.bigCurrentPage = 1;
            
            if(!filter.softFilter) {
                _self.doSearch();
            }
        };

        _self.setItemTimeByRangeSettings = function(){

            if(typeof _self.dataIni == "object")
                _self.dataIni = _self.dataIni.getTime();
            if(typeof _self.dataFim == "object")
                _self.dataFim = _self.dataFim.getTime();

            dataFactory.setItemTimeByRangeSettings({
                dateRange:{
                    start: _self.dataIni,
                    end: _self.dataFim,
                    isToday: _self.isToday(new Date(_self.dataFim))
                }
            });
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
           filtersService.addFilter("itemtimebyrange", disclaimer);
        };
            
        _self.selectFiltersParam = function(){
			var filters = [];
			var allFilters = filtersService.get('itemtimebyrange');
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
            
            if (filtersService.getFilter('itemtimebyrange','itemType')){
                properties.tipo_item = filtersService.getFilter('itemtimebyrange','itemType').value;
            } else {
                properties.tipo_item = 2;
            }
            
            proxyFactory.getItemTimeByRangeColorData(properties, {}, function(result) {
                
                _self.listRecords = kbnHelper.sortList(result);                
                var classifiers = JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]');
                
                if(result.length > 0){
                    _self.totalRecords = result[0].$length;
                } else {
                    _self.totalRecords = 0;
                }
            });
        };

        _self.exportaConsulta = function(format){

            var fromDate = new Date(_self.getStartDateFromFilter());
            fromDate.setHours(0);
            fromDate.setMinutes(0);
            fromDate.setSeconds(0);
            fromDate.setMilliseconds(0);

            var toDate = new Date(_self.getEndDateFromFilter());
            toDate.setHours(0);
            toDate.setMinutes(0);
            toDate.setSeconds(0);
            toDate.setMilliseconds(0);
            
            var properties = kbnHelper.filtersToPropValues(_self.selectFiltersParam());            
            
            if (filtersService.getFilter('itemtimebyrange','itemType')){
                properties.tipo_item = filtersService.getFilter('itemtimebyrange','itemType').value;
            } else {
                properties.tipo_item = 2;
            }
            
            
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
                program: "/fch/fchkb/fchkbitemtimebyrangereport",
                resultFileName: "itemtimebyrange"
            };

            reportService.run('kbn/itemtimebyrange',parameters, {});

        };

        _self.init();
	}
    index.register.controller('ekanban.itemtimebyrange.ListCtrl', itemTimeByRangeListCtrl);
});
