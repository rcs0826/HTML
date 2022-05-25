define(['index',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/factories/kbn-factories.js',
        '/dts/kbn/js/factories/ctupdate-factory.js',
        '/dts/kbn/html/ctupdate/ctupdate.advanced.search.js',
        '/dts/kbn/html/ctupdate/ctupdate.edit.modal.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/enumkbn.js',
], function (index) {

    ctupdateListController.$inject = [
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'ekanban.ctupdate.advanced.search.modal',
        'ekanban.ctupdate.edit.modal',
        'kbn.data.Factory',
        'kbn.ctupdate.Factory',
        'kbn.filters.service',
        'kbn.helper.Service'
    ];

    function ctupdateListController(
        $scope,
        appViewService,
        $rootScope,
        modalAdvSearch,
        modalEditCt,
        dataFactory,
        ctupdateFactory,
        filtersService,
        kbnHelper
    ) {
        var _self = this;

        _self.changePage = function(){
            _self.doSearch();
        };        

        _self.init = function () {
            createTab = appViewService.startView($rootScope.i18n('l-ct-update'), 'kbn.ctupdate.ListController', ctupdateListController);

            _self.workCenters = [];
            _self.quickSearchText = "";
            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 50;
            $scope.model = [];
            _self.estabDirective = dataFactory.getEstablishmentDirective();
            _self.filtersApplied = filtersService.get('ctupdate');
            
            if (_self.hasEstab()) {
                filtersService.addFilter("ctupdate", {
                    property: 'num_id_estab',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.num_id_estab,
                    fixed: true
                });

                _self.doSearch();
            } else {
                filtersService.removeFilter('ctupdate', 'num_id_estab');
            }
        };

        _self.hasEstab = function (estab) {
            estab = estab || _self.estabDirective;
            return estab && estab.num_id_estab > 0;
        };
            
        _self.removeFilter = function(filter){
            filtersService.removeFilter('ctupdate', filter.property);

            _self.bigCurrentPage = 1;
            _self.doSearch();
        };
            
        _self.quickSearch = function(){
            if (_self.quickSearchText && _self.ctupdate !== "") {
                filtersService.addFilter('ctupdate', {
                    property: 'kbn_ct_mestre.cod_chave_erp|kbn_ct_mestre.des_ct_erp',
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
            _self.workCenters = [];
            var filtros = kbnHelper.filtersToPropValues(filtersService.get('ctupdate'));

            filtros.pageSize = _self.pageSize;
            filtros.currentPage = (_self.bigCurrentPage - 1);

            ctupdateFactory.listCt(filtros, {}, function(result) {
                _self.workCenters = result;

                if(result.length > 0){
                    _self.totalRecords = result[0].$length;
                } else {                    
                    _self.totalRecords = 0;
                }
            });
        };

        _self.openAdvancedSearch = function () {            
            modalAdvSearch.open(_self.filtersApplied).then(function (result) {
                filtersService.removeFilter('ctupdate', 'kbn_ct_mestre.cod_chave_erp|kbn_ct_mestre.des_ct_erp');

                _self.workCenters = [];

                var oldEstab = _self.estabDirective.num_id_estab;

                if (_self.hasEstab(result.estab)) {

                    dataFactory.setEstablishmentDirective(result.estab);

                    _self.estabDirective = result.estab;

                    result.filtro.forEach(function (filter) {
                        filtersService.addFilter('ctupdate', filter);
                    });
                }

                if (oldEstab !== result.estab.num_id_estab) {
                    _self.quickSearchText = "";
                }
                
                _self.bigCurrentPage = 1;
                _self.doSearch();
            });
        };

        _self.openModalEdit = function(workCenter){
            modalEditCt.open(workCenter).then(function(){
                _self.doSearch();
            })
        };

        _self.init();
    }
    index.register.controller("kbn.ctupdate.ListController", ctupdateListController);
});