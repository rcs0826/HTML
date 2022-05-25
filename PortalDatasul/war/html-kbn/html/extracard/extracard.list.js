define([
    "index",
    '/dts/kbn/js/factories/mappingErp-factories.js',
    "/dts/kbn/js/helpers.js",
    "/dts/kbn/js/filters.js",
    "/dts/kbn/js/factories/kbn-factories.js",
    "/dts/kbn/js/filters-service.js",
    "/dts/kbn/js/directives.js",
    '/dts/kbn/html/extracard/extracard.advanced.search.js'
], function(index) {

    extraCardListController.$inject = [
        "$scope",
        "$rootScope",
        "totvs.app-main-view.Service",
        "kbn.helper.Service",
        "kbn.data.Factory",
        "kbn.filters.service",
        'kbn.mappingErp.Factory',
        'ekanban.extracard.advanced.search.modal'
    ];
    function extraCardListController(
        $scope,
        $rootScope,
        appViewService,
        kbnHelper,
        dataFactory,
        filtersService,
        mappingErpFactory,
        advancedSearchModal
    ) {
        var _self = this;

        _self.init = function() {

            appViewService.startView($rootScope.i18n("l-issue-extra-card"), "kbn.extracard.ListCtrl", extraCardListController);

            _self.itemDetailList = [];
            _self.allRecords = [];
            _self.filtersApplied = filtersService.get("extracards");
            _self.estabDirective = dataFactory.getEstablishmentDirective();
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;


            if(_self.hasEstab()){
                _self.mappingPublish();
                filtersService.addFilter("extracards", {
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });
            }

        };

        _self.mappingPublish = function(){
            var filters = [{
                property: 'cod_estab_erp',
                restriction: 'EQUALS',
                value: _self.estabDirective.cod_estab_erp
            }, {
                property: 'idi_status',
                restriction: 'EQUALS',
                value: 3
            }];

            var properties = kbnHelper.filtersToPropValues(filters);

            mappingErpFactory.mapping(properties, {}, function(result){
                if(result.length > 0){
                    _self.num_id_mapeamento = result[0].num_id_mapeamento;
                    _self.doSearch();
                } else {
                    _self.totalRecords = 0;
                    _self.itemDetailList = [];
                    _self.bigCurrentPage = 1;
                }
                
            });
        };

        _self.doSearch = function() {
            _self.itemDetailList = [];
            
            var properties = kbnHelper.filtersToPropValues(filtersService.get('extracards'));
            properties.pageSize = _self.pageSize;
            properties.currentPage = (_self.bigCurrentPage - 1);
            properties.num_id_mapeamento = _self.num_id_mapeamento;

            mappingErpFactory.getExtraCards(properties,{}, function(result){
                _self.itemDetailList = result;
                
                if(result[0].$length > 0){
                    _self.totalRecords = result[0].$length;
                } else {
                    _self.totalRecords = 0;
                }
            });
        };
            
        _self.changePage = function(){
            _self.doSearch();
        };

        _self.removeFilter = function(filter) {
            filtersService.removeFilter("extracards", filter.property);
            _self.itemDetailList = _self.allRecords;
            _self.doSearch();
        };

        _self.colorTag = function(idColor) {
            return kbnHelper.colorTag(idColor);
        };

        _self.quickSearch = function() {
            _self.bigCurrentPage = 1;
            _self.quickSearchFunction(_self.allRecords, _self.quickSearchText);
            _self.quickSearchText = "";
        };

        _self.quickSearchFunction = function(arrayOfObjs, arguments) {
            if (_self.quickSearchText && _self.quickSearchText !== "") {

                filtersService.addFilter("extracards", {
                    property: "kbn_item_det.cod_chave_erp|kbn_item_det.des_item_erp",
                    restriction: "LIKE",
                    title: $rootScope.i18n('l-code-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText || ""
                });

            } else {
                filtersService.removeFilter('extracards',"kbn_item_det.cod_chave_erp|kbn_item_det.des_item_erp");
            }

            _self.doSearch();
        };

        _self.callAdvancedSearch = function(){
            var oldEstab = _self.estabDirective;

            advancedSearchModal.open({
                estab: _self.estabDirective
            }).then(function(result) {
                if (_self.hasEstab(result.estab)){

                    dataFactory.setEstablishmentDirective(result.estab);

                    _self.estabDirective = result.estab;

                    result.filtro.forEach(function(filter){
                        filtersService.addFilter('extracards',filter);
                    });
                }

                if(oldEstab.num_id_estab !== result.estab){
                    filtersService.removeFilter('extracards',"kbn_item_det.cod_chave_erp|kbn_item_det.des_item_erp");
                    _self.quickSearchText = "";
                }

                _self.bigCurrentPage = 1;
                _self.mappingPublish();
            });
        };

        _self.hasEstab = function(estab) {
            estab = estab || _self.estabDirective;

            return estab && estab.num_id_estab > 0;
        };

        _self.init();
    }

    index.register.controller("kbn.extracard.ListCtrl", extraCardListController);
});
