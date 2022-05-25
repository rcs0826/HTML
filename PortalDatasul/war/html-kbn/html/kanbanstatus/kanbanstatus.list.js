define(['index',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/factories/kbn-factories.js',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/html/kanbanstatus/kanbanstatus.advanced.search.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/enumkbn.js'
], function (index) {

    kanbanStatusListController.$inject = [
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'ekanban.kanbanstatus.advanced.search.modal',
        'kbn.data.Factory',
        'kbn.mappingErp.Factory',
        'kbn.filters.service',
        'ReportService',
        'kbn.helper.Service',
        'enumkbn'
    ];

    function kanbanStatusListController(
        $scope,
        appViewService,
        $rootScope,
        modalAdvSearch,
        dataFactory,
        factoryMappingErp,
        filtersService,
        reportService,
        kbnHelper,
        enumkbn
    ) {
        var _self = this;

        _self.init = function () {
            createTab = appViewService.startView($rootScope.i18n('l-kanbanstatus'), 'kbn.kanbanstatus.ListController', kanbanStatusListController);
            
            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;
            
            _self.filtersApplied = filtersService.get('kanbanStatus');
            _self.updateClassifiersDisclaimer(JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]'));

            var itemType = filtersService.getFilter('kanbanStatus', 'itemType');

            _self.kanbans = [];
            $scope.model = [];
            _self.estabDirective = dataFactory.getEstablishmentDirective();

            if (_self.hasEstab()) {
                filtersService.addFilter("kanbanStatus", {
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });

                _self.doSearch();
            } else {
                filtersService.removeFilter('kanbanStatus', 'cod_estab_erp');
            }
        };

        _self.establishmentChanged = function (value, oldValue) {
            _self.establishment = value;
            if (oldValue !== undefined) {
                _self.removeFilters();
            }
            _self.doSearch();
        };

        _self.removeFilters = function () {
            var filters = filtersService.get('kanbanStatus');
            var cont = filters.length;
            while (cont--) {
                if (filters[cont].property != 'classifier') {
                    filtersService.removeFilter('kanbanStatus', filters[cont].property);
                }
            }
        };

        _self.colorTag = function (idColor) {
            return kbnHelper.colorTag(idColor);
        };

        _self.selectQuickFilter = function (filters) {
            filters.disclaimers.forEach(function (filter) {
                filtersService.addFilter('kanbanStatus', filter);
                
                _self.bigCurrentPage = 1;
                
                _self.doSearch();
            });
        };

        _self.quickSearch = function () {
            if (_self.quickSearchText && _self.quickSearchText !== "") {
                filtersService.addFilter('kanbanStatus', {
                    property: 'codDescItem',
                    restriction: 'LIKE',
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText
                });

                _self.bigCurrentPage = 1;
                _self.quickSearchText = "";

                _self.doSearch();
            }
        };

        _self.openAdvancedSearch = function () {

            _self.setDisclaimerItemTypeBoth();

            modalAdvSearch.open(_self.filtersApplied).then(function (result) {
                _self.kanbans = [];
                var oldEstab = _self.estabDirective.num_id_estab;

                if (_self.hasEstab(result.estab)) {

                    dataFactory.setEstablishmentDirective(result.estab);

                    _self.estabDirective = result.estab;

                    result.filtro.forEach(function (filter) {
                        filtersService.addFilter('kanbanStatus', filter);
                    });
                }

                if (oldEstab !== result.estab.num_id_estab) {
                    filtersService.removeFilter('kanbanStatus', "codDescItem");
                    filtersService.removeFilter('kanbanStatus', 'colorRange');
                    _self.quickSearchText = "";
                }
                
                _self.bigCurrentPage = 1;
                
                dataFactory.set('kanbanClassifierSelect',JSON.stringify(result.classifiers));
                _self.updateClassifiersDisclaimer(result.classifiers);
                _self.doSearch();
            });
        };

        _self.hasEstab = function (estab) {
            estab = estab || _self.estabDirective;

            return estab && estab.num_id_estab > 0;
        };

        _self.setDisclaimerItemTypeBoth = function () {
            itemProcessOrFinal = false;

            _self.filtersApplied.forEach(function (result) {
                if (result.property == "itemType" && result.value != enumkbn.itemType.both) {
                    itemProcessOrFinal = true;
                }
            });

            if (!itemProcessOrFinal) {
                filtersService.addFilter('kanbanStatus', {
                    property: 'itemType',
                    restriction: 'EQUALS',
                    title: $rootScope.i18n('l-type') + ': ',
                    value: enumkbn.itemType.both,
                    hide: true
                });
            }
        };

        _self.doSearch = function(){
            var filtros = [];
            var filtersObj = _self.filtersApplied.reduce(function(result, item) {
              result[item.property] = item.value;
              return result;
            }, {});

            _self.kanbans = [];
            if (filtersObj.itemType === undefined) {
                filtersObj.itemType = enumkbn.itemType.both;
            }

            if (filtersObj.colorRange === undefined) filtersObj.colorRange = 0;

            filtros.push(filtersObj);

            var filterClassifier = filtersService.get('kanbanStatus');
            var propertiesClassifier = kbnHelper.filtersToPropValues(filterClassifier);

            factoryMappingErp.getKanbanStatus({num_id_estab: _self.estabDirective.num_id_estab,
                                               classifiers: propertiesClassifier.classifiers,
                                               currentPage: _self.bigCurrentPage - 1,
                                               pageSize: _self.pageSize}, filtros, function(result) {
                
                _self.kanbans = kbnHelper.createSituationCardsObj(result);
                
                if(result.length > 0){
                    _self.totalRecords = result[0].$length;
                } else {
                    _self.totalRecords = 0;
                }
                
            });
        };

        _self.removeFilter = function (filter) {
            filtersService.removeFilter('kanbanStatus', filter.property);
            if (filter.property == 'classifier') {
                dataFactory.set('kanbanClassifierSelect', '');
            }
            _self.doSearch();
        };

        _self.preSavedFilters = [
            {
                title: $rootScope.i18n('l-red-range'),
                disclaimers: [{
                        property: 'colorRange',
                        restriction: 'EQUALS',
                        value: 3,
                        title: $rootScope.i18n('l-red-range')
                    }
                ]
            },
            {
                title: $rootScope.i18n('l-yellow-range'),
                disclaimers: [{
                        property: 'colorRange',
                        restriction: 'EQUALS',
                        value: 2,
                        title: $rootScope.i18n('l-yellow-range')
                    }
                ]
            },
            {
                title: $rootScope.i18n('l-green-range'),
                disclaimers: [{
                        property: 'colorRange',
                        restriction: 'EQUALS',
                        value: 1,
                        title: $rootScope.i18n('l-green-range')
                    }
                ]
            }
        ];

        _self.exportaConsulta = function (type) {
            
            var filtersObj = _self.filtersApplied.reduce(function(result, item) {
              result[item.property] = item.value;
              return result;
            }, {});

            if (filtersObj.itemType === undefined) {
                filtersObj.itemType = enumkbn.itemType.both;
            }
            
            var filterClassifier = filtersService.get('kanbanStatus');
            var propertiesClassifier = kbnHelper.filtersToPropValues(filterClassifier);
            
            var parameters = {
                dialect: "pt",
                format: type,
                QP_num_id_estab: _self.estabDirective.num_id_estab,
                QP_classifiers: propertiesClassifier.classifiers,
                program: "/fch/fchkb/fchkbkanbanstatusreport",
                resultFileName: "kanbanstatus"
            };

            reportService.run('kbn/kanbanstatus', parameters, filtersObj);
        };

        _self.updateClassifiersDisclaimer = function (classifiers) {
            if (classifiers.length > 0) {
                filtersService.addFilter('kanbanStatus', {
                    property: "classifier",
                    title: $rootScope.i18n('l-classifier') + ': ' + kbnHelper.countClassifiers(classifiers) + ' ' + $rootScope.i18n('l-selecteds'),
                    value: classifiers
                });
            } else {
                filtersService.removeFilter('kanbanStatus', 'classifier');
            }
        };
            
        _self.changePage = function(){
            _self.doSearch();
        };

        _self.init();
    }
    index.register.controller("kbn.kanbanstatus.ListController", kanbanStatusListController);
});
