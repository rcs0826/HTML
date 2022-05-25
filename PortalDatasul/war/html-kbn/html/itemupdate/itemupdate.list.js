define(['index',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/factories/kbn-factories.js',
        '/dts/kbn/js/factories/itemupdate-factory.js',
        '/dts/kbn/html/itemupdate/itemupdate.advanced.search.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/enumkbn.js',
        '/dts/kbn/html/itemupdate/itemupdate.edit.js'
], function (index) {

    itemupdateListController.$inject = [
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'ekanban.itemupdate.advanced.search.modal',
        'kbn.data.Factory',
        'kbn.itemupdate.Factory',
        'kbn.filters.service',
        'ReportService',
        'kbn.helper.Service',
        'kbn.itemupdate.edit.modal',
        'enumkbn'
    ];

    function itemupdateListController(
        $scope,
        appViewService,
        $rootScope,
        modalAdvSearch,
        dataFactory,
        itemupdateFactory,
        filtersService,
        reportService,
        kbnHelper,
        itemUpdateModalEdit,
        enumkbn
    ) {
        var _self = this;

        _self.changePage = function(){
            _self.doSearch();
        };        

        _self.init = function () {
            createTab = appViewService.startView($rootScope.i18n('l-item-update'), 'kbn.itemupdate.ListController', itemupdateListController);

            _self.itens = [];
            _self.quickSearchText = "";
            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;
            $scope.model = [];
            _self.estabDirective = dataFactory.getEstablishmentDirective();
            _self.filtersApplied = filtersService.get('itemupdate');
            var itemType = filtersService.getFilter('itemupdate', 'itemType');
            
            if (_self.hasEstab()) {
                filtersService.addFilter("itemupdate", {
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });

                _self.doSearch();
            } else {
                filtersService.removeFilter('itemupdate', 'cod_estab_erp');
            }
        };

        _self.hasEstab = function (estab) {
            estab = estab || _self.estabDirective;

            return estab && estab.num_id_estab > 0;
        };
            
        _self.removeFilter = function(filter){
            filtersService.removeFilter('itemupdate', filter.property);

            _self.bigCurrentPage = 1;
            _self.doSearch();
        };
            
        _self.quickSearch = function(){
            if (_self.quickSearchText && _self.itemupdate !== "") {
                filtersService.addFilter('itemupdate', {
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

        _self.doSearch = function(){    
            _self.itens = [];
            var filtros = kbnHelper.filtersToPropValues(filtersService.get('itemupdate'));

            filtros.pageSize = _self.pageSize;
            filtros.currentPage = (_self.bigCurrentPage - 1);            

            itemupdateFactory.listItem(filtros, {}, function(result) {
                _self.itens = result;

                if(result.length > 0){
                    _self.totalRecords = result[0].$length;
                } else {                    
                    _self.totalRecords = 0;
                }
            });
        };

        _self.openAdvancedSearch = function () {

            
            modalAdvSearch.open(_self.filtersApplied).then(function (result) {
                filtersService.removeFilter('itemupdate', 'log_expedic');
                filtersService.removeFilter('itemupdate', 'kbn_item.cod_chave_erp|kbn_item.des_item_erp');

                _self.itens = [];

                var oldEstab = _self.estabDirective.num_id_estab;

                if (_self.hasEstab(result.estab)) {

                    dataFactory.setEstablishmentDirective(result.estab);

                    _self.estabDirective = result.estab;

                    result.filtro.forEach(function (filter) {
                        filtersService.addFilter('itemupdate', filter);
                    });
                }

                if (oldEstab !== result.estab.num_id_estab) {
                    _self.quickSearchText = "";
                }
                
                _self.bigCurrentPage = 1;
                _self.doSearch();
            });
        };

        _self.openModalItemUpdateEdit = function (itemupdate) {
            _self.openModalItemUpdate("edit", itemupdate, _self.exitModalItemUpdateEdit);
        };        

        _self.openModalItemUpdateNew = function (formula) {
            _self.openModalItemUpdate("new", formula, _self.exitModalItemUpdateNew);
        };

        _self.openModalItemUpdate = function (action, itemupdate, callback) {
            var params = {
                model: itemupdate,
                action: action
            };

            itemUpdateModalEdit.open(params).then(function(callback){
                _self.doSearch();
            });
        };        

        _self.init();
    }
    index.register.controller("kbn.itemupdate.ListController", itemupdateListController);
});