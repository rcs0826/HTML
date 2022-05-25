define(['index',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/factories/kbn-factories.js',
        '/dts/kbn/js/factories/board-factory.js',
        '/dts/kbn/html/supermarketstatus/supermarketstatus.advanced.search.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/enumkbn.js'
], function (index) {

    supermarketstatusListController.$inject = [
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'ekanban.supermarketstatus.advanced.search.modal',
        'kbn.data.Factory',
        'kbn.boards.Factory',
        'kbn.filters.service',
        'ReportService',
        'kbn.helper.Service',
        'enumkbn'
    ];

    function supermarketstatusListController(
        $scope,
        appViewService,
        $rootScope,
        modalAdvSearch,
        dataFactory,
        boardsFactory,
        filtersService,
        reportService,
        kbnHelper,
        enumkbn
    ) {
        var _self = this;

        _self.init = function () {
            createTab = appViewService.startView($rootScope.i18n('l-supermarketstatus'), 'kbn.supermarketstatus.ListController', supermarketstatusListController);
            
            _self.itens = [];
            _self.quickSearchText = "";
            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;
            $scope.model = [];
            _self.estabDirective = dataFactory.getEstablishmentDirective();
            _self.classfierSelected = JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]');
            _self.filtersApplied = filtersService.get('supermarketstatus');
            _self.updateClassifiersDisclaimer(_self.classfierSelected);
            
            if (_self.hasEstab()) {
                filtersService.addFilter("supermarketstatus", {
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });

                _self.doSearch();
            } else {
                filtersService.removeFilter('supermarketstatus', 'cod_estab_erp');
            }
        };
            
        _self.updateClassifiersDisclaimer = function (classifiers) {
            if (classifiers.length > 0) {
                filtersService.addFilter('supermarketstatus', {
                    property: "classifier",
                    title: $rootScope.i18n('l-classifier') + ': ' + kbnHelper.countClassifiers(classifiers) + ' ' + $rootScope.i18n('l-selecteds'),
                    value: classifiers,
                    isParam: true
                });
            } else {
                filtersService.removeFilter('supermarketstatus', 'classifier');
            }
        };

        _self.hasEstab = function (estab) {
            estab = estab || _self.estabDirective;

            return estab && estab.num_id_estab > 0;
        };
            
        _self.removeFilter = function(filter){
            filtersService.removeFilter('supermarketstatus', filter.property);
            if (filter.property === "classifier") {
                dataFactory.set('kanbanClassifierSelect', '');
                _self.updateClassifiersDisclaimer(JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]'));
                _self.classfierSelected = [];
            }
            _self.bigCurrentPage = 1;
            _self.doSearch();
        };
            
        _self.selectFiltersParam = function(){
			var filters = [];
			var allFilters = filtersService.get('supermarketstatus');
			allFilters.forEach(function(filter){
				if (filter.isParam){
                    if (filter.property == "kbn_item.log_expedic" && filter.value == 1){
                        filter.value = true;
                    } else if (filter.property == "kbn_item.log_expedic" && filter.value == 0){
                        filter.value = false;
                    } else if (filter.property == "kbn_item.log_expedic" && filter.value == 2){
                        filtersService.removeFilter('supermarketstatus', filter.property);
                        return;
                    }
					filters = filters.concat(filter);
				}
			})
							   
			return filters;
		};
            
        _self.quickSearch = function(){
            if (_self.quickSearchText && _self.quickSearchText !== "") {
                filtersService.addFilter('supermarketstatus', {
                    property: 'kbn_item.cod_chave_erp|kbn_item.des_item_erp',
                    restriction: 'LIKE',
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText,
                    isParam: true
                });

                _self.bigCurrentPage = 1;
                _self.quickSearchText = "";

                _self.doSearch();
            }
        };
            
        _self.changePage = function(){
            _self.doSearch();
        };

        _self.doSearch = function(){    
            _self.itens = [];
            var filtros = kbnHelper.filtersToPropValues(_self.selectFiltersParam());
            filtros.num_id_estab = _self.estabDirective.num_id_estab;
            filtros.currentPage = (_self.bigCurrentPage - 1);
            filtros.pageSize = _self.pageSize;

            boardsFactory.supermarketstatus(filtros, {}, function(result) {
                
                _self.itens = result;
                
                if(result.length > 0){
                    _self.totalRecords = result[0].$length;
                } else {
                    _self.totalRecords = 0;
                }
                
            });
        };
            
        _self.setDisclaimerItemTypeBoth = function () {
            itemProcessOrFinal = false;

            _self.filtersApplied.forEach(function (result) {
                if (result.property == "kbn_item.log_expedic" && result.value != enumkbn.itemType.both) {
                    itemProcessOrFinal = true;
                }
            });

            if (!itemProcessOrFinal) {
                filtersService.addFilter('supermarketstatus', {
                    property: 'kbn_item.log_expedic',
                    restriction: 'EQUALS',
                    title: $rootScope.i18n('l-type') + ': ',
                    value: enumkbn.itemType.both,
                    hide: true
                });
            }
        };
            
        _self.openAdvancedSearch = function () {
            
            _self.setDisclaimerItemTypeBoth();

            modalAdvSearch.open(_self.filtersApplied).then(function (result) {
                _self.itens = [];
                
                var oldEstab = _self.estabDirective.num_id_estab;

                if (_self.hasEstab(result.estab)) {

                    dataFactory.setEstablishmentDirective(result.estab);

                    _self.estabDirective = result.estab;

                    result.filtro.forEach(function (filter) {
                        filtersService.addFilter('supermarketstatus', filter);
                    });
                }

                if (oldEstab !== result.estab.num_id_estab) {
                    _self.quickSearchText = "";
                }
                
                _self.bigCurrentPage = 1;
                _self.classfierSelected = result.classifiers;
                dataFactory.set('kanbanClassifierSelect', JSON.stringify(_self.classfierSelected));
                _self.updateClassifiersDisclaimer(result.classifiers);
                _self.doSearch();
            });
        };
            
        _self.exportaConsulta = function(type) {

            var filters = _self.filtersApplied;
            var properties = kbnHelper.filtersToPropValues(filters);
            properties = kbnHelper.removeEstab(properties);

            properties.pageSize = 0;
            properties.currentPage = 0;

            var parameters = {
                dialect: "pt",
                format: type,
                QP_num_id_estab: _self.estabDirective.num_id_estab,
                QP_classifiers: properties.classifiers,
                QP_properties: properties.properties,
                QP_restriction: properties.restriction,
                QP_values: properties.values,
                program: "/fch/fchkb/fchkbsuperstatusreport",
                resultFileName: "supermarketstatus"
            };

            reportService.run('kbn/supermarketstatus',parameters, {});

        };
            
        _self.init();
    }
    index.register.controller("kbn.supermarketstatus.ListController", supermarketstatusListController);
});
