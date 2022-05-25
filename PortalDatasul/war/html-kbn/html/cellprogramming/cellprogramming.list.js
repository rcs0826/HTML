define([
    'index',
    '/dts/kbn/js/filters.js',
    '/dts/kbn/js/filters-service.js',
    '/dts/kbn/js/factories/board-factory.js',
    '/dts/kbn/html/cellprogramming/cellprogramming.advanced.search.js'
], function(index) {

    cellProgrammingController.$inject = [
        '$rootScope',
        'totvs.app-main-view.Service',
        'kbn.helper.Service',
        'kbn.filters.service',
        'kbn.boards.Factory',
        'kbn.data.Factory',
        'ReportService',
        'ekanban.cellprogramming.advanced.search.modal'
    ];

    function cellProgrammingController(
        $rootScope,
        appViewService,
        kbnHelper,
        filtersService,
        boardsFactory,
        dataFactory,
        reportService,
        advancedSearchModal
    ) {
        var _self = this;

        _self.init = function() {
            createTab = appViewService.startView($rootScope.i18n('l-cell-programming'), 'kbn.cellProgramming.Controller', cellProgrammingController);

            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;

            _self.filtersApplied = filtersService.get("cellProgramming");
            _self.classfierSelected = JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]');
            _self.estabDirective = dataFactory.getEstablishmentDirective();
            _self.updateClassifiersDisclaimer(_self.classfierSelected);

            if (_self.hasEstab()){

                _self.doSearch();

                filtersService.addFilter("cellProgramming", {
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });
            }
        };

        _self.quickSearch = function() {
            if (_self.quickSearchText && _self.quickSearchText !== "") {

                filtersService.addFilter("cellProgramming", {
                    property: "kbn_cel.cod_chave_erp|kbn_cel.des_cel",
                    restriction: "LIKE",
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText || ""
                });

            } else {
                filtersService.removeFilter('cellProgramming',"kbn_cel.cod_chave_erp|kbn_cel.des_cel");
            }

            _self.updateClassifiersDisclaimer(JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]'));

            _self.bigCurrentPage = 1;

            _self.doSearch();
        };

        _self.updateClassifiersDisclaimer = function(classifiers) {
            if(classifiers.length > 0) {
                filtersService.addFilter('cellProgramming', {
                    property: "classifier",
                    title: $rootScope.i18n('l-classifier') + ': ' + kbnHelper.countClassifiers(classifiers) + ' ' + $rootScope.i18n('l-selecteds'),
                    value: classifiers
                });
            } else {
                filtersService.removeFilter('cellProgramming', 'classifier');
            }
        };

        _self.doSearch = function() {
            _self.listBoard = [];
            var filters = _self.filtersApplied;
            var properties = kbnHelper.filtersToPropValues(filters);
            properties = kbnHelper.removeEstab(properties);
            properties.pageSize = _self.pageSize;
            properties.currentPage = (_self.bigCurrentPage - 1);
            properties.estabelec = _self.estabDirective.num_id_estab;

            boardsFactory.boards(properties, {}, function(result){
                if(result){
                    _self.listBoard = result;

                    if(result.length > 0){
                        _self.totalRecords = result[0].$length;
                    } else {
                        _self.totalRecords = 0;
                    }
                }
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
                num_id_estab: _self.estabDirective.num_id_estab,
                QP_classifiers: properties.classifiers,
                QP_properties: properties.properties,
                QP_restriction: properties.restriction,
                QP_values: properties.values,
                program: "/fch/fchkb/fchkbprogcelreport",
                resultFileName: "cellprogramming"
            };

            reportService.run('kbn/cellprogramming',parameters, {});

        };

        _self.removeFilter = function(filter) {
            if (filter.property === "classifier") {
                dataFactory.set('kanbanClassifierSelect','');
                _self.updateClassifiersDisclaimer(JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]'));
                _self.classfierSelected = [];
            }

            kbnHelper.removeFilterApplied(_self.filtersApplied, filter);
            _self.quickSearchText = "";
            _self.doSearch();
        };

        _self.filtraItems = function(selectedClassifiers) {
            _self.updateClassifiersDisclaimer(selectedClassifiers);
            _self.doSearch();
        };

        _self.changePage = function(){
            _self.doSearch();
        };

        _self.callAdvancedSearch = function(){
            advancedSearchModal.open({classfierSelected:_self.classfierSelected, estab: _self.estabDirective}).then(function(result) {

                if (_self.hasEstab(result.estab)){

                    dataFactory.setEstablishmentDirective(result.estab);

                    _self.estabDirective = result.estab;

                    result.filtro.forEach(function(filter){
                        filtersService.addFilter('cellProgramming',filter);
                    });
                }

                _self.classfierSelected = result.classifiers;
                dataFactory.set('kanbanClassifierSelect',JSON.stringify(_self.classfierSelected));
                _self.updateClassifiersDisclaimer(result.classifiers);
                _self.doSearch();
            });
        };

        _self.hasEstab = function(estab) {
            estab = estab || _self.estabDirective;

            return estab && estab.num_id_estab > 0;
        };

        _self.init();
    }

    index.register.controller('kbn.cellProgramming.Controller', cellProgrammingController);
});
