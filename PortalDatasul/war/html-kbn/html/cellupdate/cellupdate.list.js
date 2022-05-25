define(['index',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/factories/kbn-factories.js',
        '/dts/kbn/js/factories/cellupdate-factory.js',
        '/dts/kbn/html/cellupdate/cellupdate.advanced.search.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/enumkbn.js',
        '/dts/kbn/html/cellupdate/cellupdate.edit.js'
], function (index) {

    cellupdateListController.$inject = [
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'ekanban.cellupdate.advanced.search.modal',
        'kbn.data.Factory',
        'kbn.cellupdate.Factory',
        'kbn.filters.service',
        'ReportService',
        'kbn.helper.Service',
        'enumkbn',
        'kbn.cellupdate.edit.modal'        
    ];

    function cellupdateListController(
        $scope,
        appViewService,
        $rootScope,
        modalAdvSearch,
        dataFactory,
        cellupdateFactory,
        filtersService,
        reportService,
        kbnHelper,
        enumkbn,
        cellUpdateModalEdit
    ) {
        var _self = this;

        _self.changePage = function(){
            _self.doSearch();
        };        

        _self.init = function () {
            createTab = appViewService.startView($rootScope.i18n('l-cell-update'), 'kbn.cellupdate.ListController', cellupdateListController);

            _self.cells = [];
            _self.quickSearchText = "";
            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 50;
            $scope.model = [];
            _self.estabDirective = dataFactory.getEstablishmentDirective();
            _self.filtersApplied = filtersService.get('cellupdate');
            
            if (_self.hasEstab()) {
                filtersService.addFilter("cellupdate", {
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });

                _self.doSearch();
            } else {
                filtersService.removeFilter('cellupdate', 'cod_estab_erp');
            }
        };

        _self.hasEstab = function (estab) {
            estab = estab || _self.estabDirective;

            return estab && estab.num_id_estab > 0;
        };
            
        _self.removeFilter = function(filter){
            filtersService.removeFilter('cellupdate', filter.property);

            _self.bigCurrentPage = 1;
            _self.doSearch();
        };
            
        _self.quickSearch = function(){
            if (_self.quickSearchText && _self.cellupdate !== "") {
                filtersService.addFilter('cellupdate', {
                    property: 'kbn_cel_mestre.cod_chave_erp|kbn_cel_mestre.des_cel',
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

        _self.doSearch = function(){    
            _self.cells = [];
            var filtros = kbnHelper.filtersToPropValues(filtersService.get('cellupdate'));

            filtros.pageSize = _self.pageSize;
            filtros.currentPage = (_self.bigCurrentPage - 1);            

            cellupdateFactory.listCell(filtros, {}, function(result) {
                _self.cells = result;

                if(result.length > 0){
                    _self.totalRecords = result[0].$length;
                } else {                    
                    _self.totalRecords = 0;
                }
            });
        };

        _self.openAdvancedSearch = function () {            
            modalAdvSearch.open(_self.filtersApplied).then(function (result) {
                filtersService.removeFilter('cellupdate', 'kbn_cel_mestre.cod_chave_erp|kbn_cel_mestre.des_cel');

                _self.cells = [];

                var oldEstab = _self.estabDirective.num_id_estab;

                if (_self.hasEstab(result.estab)) {

                    dataFactory.setEstablishmentDirective(result.estab);

                    _self.estabDirective = result.estab;

                    result.filtro.forEach(function (filter) {
                        filtersService.addFilter('cellupdate', filter);
                    });
                }

                if (oldEstab !== result.estab.num_id_estab) {
                    _self.quickSearchText = "";
                }
                
                _self.bigCurrentPage = 1;
                _self.doSearch();
            });
        };

        _self.openModalCellUpdateEdit = function (cellupdate) {
            _self.openModalCellUpdate("edit", cellupdate, _self.exitModalCellUpdateEdit);
        };

        _self.openModalCellUpdate = function (action, cellupdate, callback) {
            var params = {
                model: cellupdate,
                action: action
            };

            cellUpdateModalEdit.open(params).then(function(callback){
                _self.doSearch();
            });
        };


        _self.init();
    }
    index.register.controller("kbn.cellupdate.ListController", cellupdateListController);
});