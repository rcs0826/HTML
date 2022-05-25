define([
    'index',
    '/dts/kbn/js/filters.js',
    '/dts/kbn/js/filters-service.js',
    '/dts/kbn/js/factories/card-factory.js',
    '/dts/kbn/html/processexceptions/processexceptions.advanced.search.js',
    '/dts/kbn/html/processexceptions/processexceptions.detail.js'
], function (index) {

    processExceptionsController.$inject = [
        '$rootScope',
        'totvs.app-main-view.Service',
        'kbn.helper.Service',
        'kbn.filters.service',
        'kbn.cards.Factory',
        'kbn.data.Factory',
        'ReportService',
        'ekanban.processexceptions.advanced.search.modal',
        '$filter',
        'ekanban.processexceptions.detailModal'
    ];

    function processExceptionsController(
        $rootScope,
        appViewService,
        kbnHelper,
        filtersService,
        cardFactory,
        dataFactory,
        reportService,
        advancedSearchModal,
        $filter,
        detailModal
    ) {
        var _self = this;

        _self.init = function () {
            createTab = appViewService.startView($rootScope.i18n('l-process-exceptions'), 'kbn.processExceptions.Controller', processExceptionsController);

            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;
            _self.param = {};
            _self.setParamDefault();

            _self.filtersApplied = filtersService.get("processExceptions");
            _self.classfierSelected = JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]');
            _self.estabDirective = dataFactory.getEstablishmentDirective();
            _self.setDateDefault(filtersService.getFilter('processExceptions', 'startDate'));
            _self.updateClassifiersDisclaimer(_self.classfierSelected);
            _self.updateItemType();

            if (_self.hasEstab()) {
                filtersService.addFilter("processExceptions", {
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true,
                    isParam: false
                });
                
                _self.filtersApplied.forEach(function(filter){
                    if(filter.property == "codeERP") {
                        _self.quickSearchText = filter.value;
                        _self.prepareQuickSearch();
                        filtersService.removeFilter('processExceptions', 'codeERP');
                    }
                });

                _self.doSearch();
            } else {
                filtersService.removeFilter('processExceptions', 'cod_estab_erp');
            }
        };
            
        _self.updateItemType = function(){
            _self.filtersApplied.forEach(function(filtro){
                if (filtro.property == 'itemType') {
                    filtro.property = 'kbn_item.log_expedic';
                    filtro.hide = false;
                    filtro.isParam = true;
                    if(filtro.value == 1) filtro.value = true;
                    if(filtro.value == 0) filtro.value = false;
                }
            });
        };

        _self.setParamDefault = function () {
            _self.paramBloqFila = filtersService.getFilter('processExceptions', 'bloqFila');
            _self.paramBloqProducao = filtersService.getFilter('processExceptions', 'bloqProducao');
            _self.paramBloqTransporte = filtersService.getFilter('processExceptions', 'bloqTransporte');
            _self.paramAjusteSaldo = filtersService.getFilter('processExceptions', 'ajusteSaldo');
            _self.paramEmissaoExtra = filtersService.getFilter('processExceptions', 'emissaoExtra');
            
            if (_self.paramBloqFila && _self.paramBloqFila.value) {
                _self.param.bloqFila = true;
            } else {
                _self.param.bloqFila = false;
                filtersService.removeFilter('processExceptions', 'bloqFila');
            }
            if (_self.paramBloqProducao && _self.paramBloqProducao.value) {
                _self.param.bloqProducao = true;
            } else {
                _self.param.bloqProducao = false;
                filtersService.removeFilter('processExceptions', 'bloqProducao');
            }
            if (_self.paramBloqTransporte && _self.paramBloqTransporte.value) {
                _self.param.bloqTransporte = true;
            } else {
                _self.param.bloqTransporte = false;
                filtersService.removeFilter('processExceptions', 'bloqTransporte');
            }
            if (_self.paramAjusteSaldo && _self.paramAjusteSaldo.value) {
                _self.param.ajusteSaldo = true;
            } else {
                _self.param.ajusteSaldo = false;
                filtersService.removeFilter('processExceptions', 'ajusteSaldo');
            }
            if (_self.paramEmissaoExtra && _self.paramEmissaoExtra.value) {
                _self.param.emissaoExtra = true;
            } else {
                _self.param.emissaoExtra = false;
                filtersService.removeFilter('processExceptions', 'emissaoExtra');
            }

            _self.validaParam();
        }

        _self.validaParam = function () {
            if (!_self.param.emissaoExtra && !_self.param.ajusteSaldo && !_self.param.bloqTransporte && !_self.param.bloqProducao && !_self.param.bloqFila) {
                _self.param.emissaoExtra = true;
                _self.param.ajusteSaldo = true;
                _self.param.bloqTransporte = true;
                _self.param.bloqProducao = true;
                _self.param.bloqFila = true;
            }
        }

        _self.setDateDefault = function (existeDateRange) {
            if (!existeDateRange) {
                dataFim = new Date();
                dataIni = new Date();
                dataIni.setDate(dataFim.getDate() - 30);
                _self.dataIni = dataIni.getTime();
                _self.dataFim = dataFim.getTime();
                _self.addFilterDefaultDate();
            }
        };

        _self.changePage = function () {
            _self.doSearch();
        };

        _self.addFilterDefaultDate = function () {
            filtersService.addFilter("processExceptions", {
                property: 'startDate',
                title: $rootScope.i18n('l-initial-date') + ': ' + $filter('date')(_self.dataIni, 'shortDate'),
                value: _self.dataIni,
                fixed: true,
                isParam: false
            });

            filtersService.addFilter("processExceptions", {
                property: 'endDate',
                title: $rootScope.i18n('l-final-date') + ': ' + $filter('date')(_self.dataFim, 'shortDate'),
                value: _self.dataFim,
                fixed: true,
                isParam: false
            });
        };

        _self.updateClassifiersDisclaimer = function (classifiers) {
            if (classifiers.length > 0) {
                filtersService.addFilter('processExceptions', {
                    property: "classifier",
                    title: $rootScope.i18n('l-classifier') + ': ' + kbnHelper.countClassifiers(classifiers) + ' ' + $rootScope.i18n('l-selecteds'),
                    value: classifiers,
                    isParam: true
                });
            } else {
                filtersService.removeFilter('processExceptions', 'classifier');
            }

        };

        _self.updateParamDisclaimer = function (arrayparam) {
            if (arrayparam) {
                if (arrayparam.bloqFila) {
                    filtersService.addFilter("processExceptions", {
                        property: 'bloqFila',
                        title: $rootScope.i18n('l-lock-queue'),
                        value: _self.param.bloqFila,
                        fixed: false,
                        isParam: false
                    });
                } else {
                    filtersService.removeFilter('processExceptions', 'bloqFila');
                    _self.param.bloqFila = false;
                }
                if (arrayparam.bloqProducao) {
                    filtersService.addFilter("processExceptions", {
                        property: 'bloqProducao',
                        title: $rootScope.i18n('l-blocking-in-production'),
                        value: _self.param.bloqProducao,
                        fixed: false,
                        isParam: false
                    });
                } else {
                    filtersService.removeFilter('processExceptions', 'bloqProducao');
                    _self.param.bloqProducao = false;
                }
                if (arrayparam.bloqTransporte) {
                    filtersService.addFilter("processExceptions", {
                        property: 'bloqTransporte',
                        title: $rootScope.i18n('l-lock-on-transport'),
                        value: _self.param.bloqTransporte,
                        fixed: false,
                        isParam: false
                    });
                } else {
                    filtersService.removeFilter('processExceptions', 'bloqTransporte');
                    _self.param.bloqTransporte = false;
                }
                if (arrayparam.ajusteSaldo) {
                    filtersService.addFilter("processExceptions", {
                        property: 'ajusteSaldo',
                        title: $rootScope.i18n('l-inventory-balance-adjust'),
                        value: _self.param.ajusteSaldo,
                        fixed: false,
                        isParam: false
                    });
                } else {
                    filtersService.removeFilter('processExceptions', 'ajusteSaldo');
                    _self.param.ajusteSaldo = false;
                }
                if (arrayparam.emissaoExtra) {
                    filtersService.addFilter("processExceptions", {
                        property: 'emissaoExtra',
                        title: $rootScope.i18n('l-extra-card-emission'),
                        value: _self.param.emissaoExtra,
                        fixed: false,
                        isParam: false
                    });
                } else {
                    filtersService.removeFilter('processExceptions', 'emissaoExtra');
                    _self.param.emissaoExtra = false;
                }
            } else {
                filtersService.removeFilter('processExceptions', 'param');
            }
        }
        
        _self.prepareQuickSearch = function(){
            if (_self.quickSearchText && _self.quickSearchText !== "") {
                filtersService.addFilter("processExceptions", {
                    property: "kbn_item.cod_chave_erp|kbn_item.des_item_erp",
                    restriction: "LIKE",
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText || "",
                    isParam: true
                });

            } else {
                filtersService.removeFilter('processExceptions', "kbn_item.cod_chave_erp|kbn_item.des_item_erp");
            }
            _self.bigCurrentPage = 1;     
            _self.quickSearchText = '';
        };

        _self.quickSearch = function () {
            _self.prepareQuickSearch();
            _self.doSearch();
        };

        _self.selectFiltersParam = function () {
            var filters = [];
            var allFilters = filtersService.get('processExceptions');
            allFilters.forEach(function (filter) {
                if (filter.isParam) {
                    filters = filters.concat(filter);
                }
            })

            return filters;
        };

        _self.doSearch = function () {
            _self.listItens = [];
            _self.filtersApplied = filtersService.get('processExceptions');
            var properties = kbnHelper.filtersToPropValues(_self.selectFiltersParam());
            properties.pageSize = _self.pageSize;
            properties.currentPage = (_self.bigCurrentPage - 1);
            properties.estabID = _self.estabDirective.num_id_estab;
            properties.datIni = filtersService.getFilter('processExceptions', 'startDate').value;
            properties.datFim = filtersService.getFilter('processExceptions', 'endDate').value;

            cardFactory.getProcessExceptions(properties, _self.param, function (result) {
                if (result) {
                    _self.listItens = result;

                    if (result.length > 0) {
                        _self.totalRecords = result[0].$length;
                    } else {
                        _self.totalRecords = 0;
                    }
                }
            });
        };

        _self.showItemDetails = function(item){
            detailModal.open({
                item: item,
                param: Object.assign({}, _self.param),
                datIni: filtersService.getFilter('processExceptions', 'startDate').value,
                datFim: filtersService.getFilter('processExceptions', 'endDate').value
            });
        }

        _self.removeFilter = function (filter) {
            if (filter.property === "classifier") {
                dataFactory.set('kanbanClassifierSelect', '');
                _self.updateClassifiersDisclaimer(JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]'));
                _self.classfierSelected = [];
            }

            if (_self.param[filter.property]) {
                _self.param[filter.property] = false;
                _self.validaParam();
            }
            filtersService.removeFilter('processExceptions', filter.property);
            _self.quickSearchText = "";
            _self.bigCurrentPage = 1;
            _self.doSearch();
        };

        _self.selectQuickFilter = function (filters) {
            filters.disclaimers.forEach(function (filter) {
                filtersService.addFilter('processExceptions', filter);
            });

            _self.bigCurrentPage = 1;
            _self.doSearch();
        };

        _self.preSavedFilters = [{
            title: $rootScope.i18n('l-flow-expedition'),
            disclaimers: [{
                property: 'kbn_item.log_expedic',
                restriction: 'EQUALS',
                value: true,
                hide: false,
                title: $rootScope.i18n('l-flow-expedition'),
                isParam: true
            }]
        }, {
            title: $rootScope.i18n('l-flow-process'),
            disclaimers: [{
                property: 'kbn_item.log_expedic',
                restriction: 'EQUALS',
                value: false,
                hide: false,
                title: $rootScope.i18n('l-flow-process'),
                isParam: true
            }]
        }];

        _self.callAdvancedSearch = function () {
            var oldEstab = _self.estabDirective.num_id_estab;

            advancedSearchModal.open({
                param: Object.assign({}, _self.param),
                classfierSelected: _self.classfierSelected,
                estab: _self.estabDirective,
                dateRange: {
                    start: filtersService.getFilter('processExceptions', 'startDate').value,
                    end: filtersService.getFilter('processExceptions', 'endDate').value
                }
            }).then(function (result) {

                if (_self.hasEstab(result.estab)) {
                    dataFactory.setEstablishmentDirective(result.estab);
                    _self.estabDirective = result.estab;
                    result.filtro.forEach(function (filter) {
                        filtersService.addFilter('processExceptions', filter);
                    });
                }

                if (oldEstab !== result.estab.num_id_estab) {
                    filtersService.removeFilter('processExceptions', "kbn_item.cod_chave_erp|kbn_item.des_item_erp");
                    filtersService.removeFilter('processExceptions', "kbn_item.log_expedic");
                    _self.quickSearchText = "";
                }

                _self.updateParamDisclaimer(result.param);
                _self.param = result.param;
                _self.dataIni = result.dateRange.start;
                _self.dataFim = result.dateRange.end;
                _self.addFilterDefaultDate();
                _self.classfierSelected = result.classifiers;
                dataFactory.set('kanbanClassifierSelect', JSON.stringify(_self.classfierSelected));
                _self.bigCurrentPage = 1;
                _self.updateClassifiersDisclaimer(result.classifiers);
                _self.doSearch();
            });
        };

        _self.hasEstab = function (estab) {
            estab = estab || _self.estabDirective;

            return estab && estab.num_id_estab > 0;
        };

        _self.exportaConsulta = function (type) {
            var properties = kbnHelper.filtersToPropValues(_self.selectFiltersParam());

            var parameters = {
                dialect: "pt",
                format: type,
                QP_classifiers: properties.classifiers,
                QP_estabID: _self.estabDirective.num_id_estab,
                QP_datIni: filtersService.getFilter('processExceptions', 'startDate').value,
                QP_datFim: filtersService.getFilter('processExceptions', 'endDate').value,
                QP_currentPage: 0,
                QP_pageSize: 0,
                QP_properties: properties.properties,
                QP_restriction: properties.restriction,
                QP_values: properties.values,
                program: "/fch/fchkb/fchkbprocessexceptionsreport",
                resultFileName: "processexceptions"
            };

            reportService.run('kbn/processexceptions', parameters, _self.param);
        };

        _self.exportaConsultaDetalhado = function (type) {
            var properties = kbnHelper.filtersToPropValues(_self.selectFiltersParam());

            var parameters = {
                dialect: "pt",
                format: type,
                QP_classifiers: properties.classifiers,
                QP_estabID: _self.estabDirective.num_id_estab,
                QP_datIni: filtersService.getFilter('processExceptions', 'startDate').value,
                QP_datFim: filtersService.getFilter('processExceptions', 'endDate').value,
                QP_currentPage: 0,
                QP_pageSize: 0,
                QP_properties: properties.properties,
                QP_restriction: properties.restriction,
                QP_values: properties.values,
                program: "/fch/fchkb/fchkbprocessexceptionsdetailreport",
                resultFileName: "processexceptionsdetail"
            };

            reportService.run('kbn/processexceptionsdetail', parameters, _self.param);
        };

        _self.init();
    }

    index.register.controller('kbn.processExceptions.Controller', processExceptionsController);
});
