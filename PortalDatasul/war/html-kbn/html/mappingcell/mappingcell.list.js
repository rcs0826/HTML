define([
    'index',
    '/dts/kbn/js/factories/cellupdate-factory.js',
    '/dts/kbn/js/factories/mappingErp-factories.js',
    '/dts/kbn/js/factories/item-zoom.js',
    '/dts/kbn/js/filters-service.js',
    '/dts/kbn/js/helpers.js',
    '/dts/kbn/html/flow/flow.cell.edit.js',
    '/dts/kbn/html/mappingcell/mappingcell.item.edit.js',
    '/dts/kbn/js/zoom/item-map.js',
    '/dts/kbn/html/flow/flow.cell.item.edit.js',
    '/dts/kbn/html/flow/flow.celllist.edit.js'
], function(index) {

    mappingCellController.$inject = [
        '$rootScope',
        '$scope',
        '$stateParams',
        'TOTVSEvent',
        'totvs.app-main-view.Service',
        'kbn.cellupdate.Factory',
        'kbn.mappingErp.Factory',
        'kbn.filters.service',
        'kbn.helper.Service',
        'kbn.cell.item.edit.modal',
        'kbn.celllist.edit.modal',
        'kbn.item.edit.modal'
    ];

    function mappingCellController(
        $rootScope,
        $scope,
        $stateParams,
        TOTVSEvent,
        appViewService,
        cellErpFactory,
        mappingErpFactory,
        filtersService,
        kbnHelper,
        modalCellItemEdit,
        modalCellListEdit,
        itemModal
    ) {
        var _self = this;

        _self.init = function(){
            createTab = appViewService.startView($rootScope.i18n('l-mapping-list'), 'ekanban.mapping.CellList', mappingCellController);
            $scope.id = $stateParams.id;
            _self.filtersApplied = filtersService.get("mappingCell");
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;
            _self.totalRecords = 0;

            mappingErpFactory.mapping({
                properties: ["num_id_mapeamento"],
                values: [$scope.id]
            }, function(result){
                _self.mapping = result[0];
            });

            _self.doSearch();
        };

        _self.doSearch = function(){
            _self.cellList = [];
            var filters = filtersService.get('mappingCell');
            var properties = kbnHelper.filtersToPropValues(filters);
            properties.pageSize = _self.pageSize;
            properties.currentPage = (_self.bigCurrentPage - 1);
            properties.numIdMapeamento = $scope.id;
            cellErpFactory.celulasMapeamento(properties, {}, function(result){
                if(result.length > 0)
                    _self.totalRecords = result[0].$length;
                    _self.cellList = result;
            });
        };

        _self.quickSearch = function() {
            if (_self.quickSearchText && _self.quickSearchText !== "") {

                filtersService.addFilter("mappingCell", {
                    property: "kbn_cel.cod_chave_erp|kbn_cel.des_cel",
                    restriction: "LIKE",
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText || ""
                });

            } else {
                filtersService.removeFilter('mappingCell',"kbn_cel.cod_chave_erp|kbn_cel.des_cel");
            }

            _self.bigCurrentPage = 1;

            _self.doSearch();
        };

        _self.removeFilter = function(filter) {
            kbnHelper.removeFilterApplied(_self.filtersApplied, filter);
            _self.quickSearchText = "";
            _self.doSearch();
        };

        _self.openModalCellItem = function(idCell) {
            var params = {
                cellMember: idCell,
                mapping: _self.mapping
            };

            modalCellItemEdit.open(params).then(function(){
                _self.doSearch();
            });
        };

        _self.openModalCellListEdit = function(idCell) {
            var params = {
                cellMember: idCell,
                mapping: _self.mapping,
                log_ativo: true
            };

            modalCellListEdit.open(params).then(function(){
                _self.doSearch();
            });
        };

        _self.retornoZoom = function(itemsToInclud, cell) {
            var items = [];
            if(itemsToInclud.size) items = itemsToInclud.objSelected
            else items = [itemsToInclud];

            itemModal.open({
                mapping: _self.mapping,
                cell: cell,
                itemsToInclud: items
            }).then(function(){
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'info',
                    title:  $rootScope.i18n('l-insert-items'),
                    detail: $rootScope.i18n('l-success-transaction'),
                });
            });
        };

        _self.changePage = function(){
            _self.doSearch();
        };

        _self.init();
    };

    index.register.controller('ekanban.mapping.CellList', mappingCellController);
});