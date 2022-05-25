define([
    'index',
    '/dts/kbn/js/filters.js',
    '/dts/kbn/js/filters-service.js',
    '/dts/kbn/js/directives.js',
    '/dts/kbn/js/factories/board-factory.js',
    '/dts/kbn/html/board/board.advanced.search.js'
], function(index) {

    boardListController.$inject = [
        '$scope',
        'kbn.data.Factory',
        'totvs.app-main-view.Service',
        'kbn.filters.service',
        '$rootScope',
        'kbn.helper.Service',
        'messageHolder',
        'kbn.boards.Factory',
        'ekanban.board.advanced.search.modal'
    ];

    function boardListController(
        $scope,
        dataFactory,
        appViewService,
        filtersService,
        $rootScope,
        kbnHelper,
        messageHolder,
        boardsFactory,
        advancedSearchModal
    ) {
        var _self = this;

        _self.init = function() {
            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;

            createTab = appViewService.startView($rootScope.i18n('l-list-board'), 'kbn.board.ListController', boardListController);

            _self.filtersApplied = filtersService.get("board");
            _self.classfierSelected = JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]');
            _self.estabDirective = dataFactory.getEstablishmentDirective();
            _self.updateClassifiersDisclaimer(_self.classfierSelected);

            if (_self.hasEstab()) {

                _self.doSearch();

                filtersService.addFilter("board", {
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });
            }
        };

        _self.changePage = function(){
            _self.doSearch();
        };

        _self.quickSearch = function() {
            if (_self.quickSearchText && _self.quickSearchText !== "") {

                filtersService.addFilter("board", {
                    property: "kbn_cel.cod_chave_erp|kbn_cel.des_cel",
                    restriction: "LIKE",
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText || ""
                });

            } else {
                filtersService.removeFilter('board',"kbn_cel.cod_chave_erp|kbn_cel.des_cel");
            }
            _self.updateClassifiersDisclaimer(JSON.parse(dataFactory.get('kanbanClassifierSelect') || '[]'));

            _self.bigCurrentPage = 1;

            _self.doSearch();
        };

        _self.updateClassifiersDisclaimer = function(classifiers) {
            if(classifiers.length > 0) {
                filtersService.addFilter('board', {
                    property: "classifier",
                    title: $rootScope.i18n('l-classifier') + ': ' + kbnHelper.countClassifiers(classifiers) + ' ' + $rootScope.i18n('l-selecteds'),
                    value: classifiers
                });
            } else {
                filtersService.removeFilter('board', 'classifier');
            }

        };

        _self.doSearch = function() {
            _self.listBoard = [];
            var filters = filtersService.get('board');
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

        _self.itensProduzidos = function(cell){
            if(typeof cell.itensProduzidos == 'undefined')
                cell.itensProduzidos = [];
            if(cell.itensProduzidos.length == 0){
                boardsFactory.itensProduz({celId: cell.num_id_cel}, {}, function(itensProduzidos){
                    itensProduzidos.forEach(function(result) {
                    cell.itensProduzidos.push(result);
                    });
                });
            }
        };

        _self.callAdvancedSearch = function() {
            advancedSearchModal.open({
                classfierSelected:_self.classfierSelected,
                estab: _self.estabDirective
            }).then(function(result) {
                var oldEstab = _self.estabDirective;

                if (_self.hasEstab(result.estab)){

                    dataFactory.setEstablishmentDirective(result.estab);

                    _self.estabDirective = result.estab;

                    result.filtro.forEach(function(filter){
                        filtersService.addFilter('board',filter);
                    });
                }

                if(oldEstab !== result.estab){
                    filtersService.removeFilter('board',"kbn_cel.cod_chave_erp|kbn_cel.des_cel");
                    _self.quickSearchText = "";
                }

                _self.bigCurrentPage = 1;

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

    index.register.controller('kbn.board.ListController', boardListController);
});
