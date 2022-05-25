define([
    'index',
    '/dts/kbn/html/flow/flow.advancedsearch.js',
    '/dts/kbn/html/flow/flow.new.js',
    '/dts/kbn/html/flow/flow.itenstobedeleted.js',
    '/dts/kbn/html/flow/flow.itenstobedeactivate.js',
    '/dts/kbn/js/directives.js',
    '/dts/kbn/js/factories/mappingErp-factories.js',
    '/dts/kbn/html/flow/flow.batch.add.js'
    ], function(index) {

    mappingViewController.$inject = [
        '$scope',
        'totvs.app-main-view.Service',
        '$stateParams',
        'kbn.helper.Service',
        '$rootScope',
        'ekanban.flow.new.modal',
        'ekanban.flow.advancedsearch.modal',
        'messageHolder',
        'kbn.filters.service',
        'kbn.mappingErp.Factory',
        'TOTVSEvent',
        'ekanban.flow.itenstobedeleted.modal',
        'ekanban.flow.itenstobedeactivate.modal',
        'kbn.mappingErp.Factory',
        'ekanban.flow.batchadd.modal'
    ];

    function mappingViewController(
        $scope,
        appViewService,
        $stateParams,
        kbnHelper,
        $rootScope,
        flowNewModal,
        FlowModalAdvancedSearch,
        messageHolder,
        filtersService,
        factoryMappingErp,
        TOTVSEvent,
        itensToBeDeletedModal,
        itensToBeDeactivateModal,
        mappingErpFactory,
        FlowModalBatchAdd
    ) {

        var _self = this;

        _self.init = function(){
            createTab = appViewService.startView($rootScope.i18n('l-mapping-list'), 'ekanban.mapping.FlowList', mappingViewController);

            $scope.id = $stateParams.id;
            _self.listFlows = [];
            _self.mapping = [];
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;
            _self.totalRecords = 0;
            _self.mostraInativo = false;

            filtersService.addFilter('flow',{
                property: 'kbn_item.log_expedic',
                restriction: 'EQUALS',
                value: true,
                hide: false,
                title: $rootScope.i18n('l-flow-expedition')
            });

            _self.filtersApplied = filtersService.get("flow");

            var filter = {};
            _self.filtersApplied.forEach(function(filtro){
                if(filtro.property === "itemInativo") filter = filtro;
            });
            if (filter.property) _self.mostraInativo = true;

            mappingErpFactory.mapping({
                properties: ["num_id_mapeamento"],
                values: [$scope.id]
            }, function(result){
                _self.mapping = result;
            });

            _self.doSearch();
        };

        _self.remove = function(obj){
            factoryMappingErp.ItensImpactados({num_id_item_det:obj.num_id_item_det}, function(itenstobedeleted){
                itenstobedeleted = kbnHelper.sortList(itenstobedeleted);
                itensToBeDeletedModal.open(itenstobedeleted).then(function(answer){
                    if (answer == true) {
                        var itensToDelete = itenstobedeleted.filter(function(item) {
                            return !item.log_comprad;
                        });
                        _self.doRemove(obj, itensToDelete);
                    }
                });
            });
        };
            
        _self.deactivateFlow = function(obj){
            
            mappingErpFactory.deactivateFlowList({num_id_item_det:obj.num_id_item_det}, function(itenstobedeactivate){
                
                itenstobedeactivate = kbnHelper.sortList(itenstobedeactivate);
                itensToBeDeactivateModal.open(itenstobedeactivate).then(function(answer){
                    
                    if (answer == true) {
            
                        mappingErpFactory.deactivateFlow({num_id_item_det:obj.num_id_item_det},itenstobedeactivate, function(result){
                            
                            if(!result.$hasError){

                                _self.doSearch();

                                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                    type:   'info',
                                    title:  $rootScope.i18n('l-deactivate'),
                                    detail: $rootScope.i18n('l-success-transaction')
                                });
                            }; 
                        });
                    }
                });
            });
        };

        _self.doRemove = function (obj, itensToDelete) {
            factoryMappingErp.deleteFlowAtMapping({num_id_item_det:obj.num_id_item_det}, function(result){
                if(kbnHelper.hasMessages(result)){
                    kbnHelper.processMessages(result);
                }else if(!result.$hasError){
                    _self.listFlows = [];
                    //updateLastPage(_self.totalRecords - itensToDelete.length, _self.pageSize);
                    _self.bigCurrentPage = 1;
                    _self.doSearch();

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'info',
                        title:  $rootScope.i18n('l-remove-flow'),
                        detail: $rootScope.i18n('l-success-transaction')
                    });
                }
            });
        };

        var updateLastPage = function(totalRecords, pageSize) {
            var lastPage = Math.ceil(totalRecords / pageSize);

            if(_self.bigCurrentPage > lastPage) {
                _self.bigCurrentPage = lastPage;
            }
        };

        _self.openAdvancedSearch = function(){
            FlowModalAdvancedSearch.open({mostraInativo: _self.mostraInativo, mapping: _self.mapping[0]}).then(function (result) {
                _self.listFlows = [];

                if(result.refer.trim()){

                    filtersService.addFilter('flow',{
                        property:'kbn_item_det.cod_refer',
                        restriction: 'LIKE',
                        hide: false,
                        title: $rootScope.i18n('l-reference') + ': ' + result.refer,
                        value: result.refer
                    });

                }

                _self.mostraInativo = result.mostraInativo;

                if (result.mostraInativo) {
                    _self.filtroMostraInativo();
                } else {
                    var filter = {};
                    _self.filtersApplied.forEach(function(filtro){
                        if(filtro.property === "itemInativo") filter = filtro;
                    });
                    if (filter.property) _self.removeFilter(filter);
                }
                _self.bigCurrentPage = 1;
                _self.doSearch();
            });
        };

        _self.removeFilter = function(filter){
            _self.listFlows = [];

            filtersService.removeFilter('flow',filter.property);
            if (filter.property == "itemInativo") _self.mostraInativo = false;
            _self.quickSearchText = "";
            _self.bigCurrentPage = 1;
            _self.doSearch();
        };

        _self.newFlow = function(){
            var params = {dat_corte: _self.mapping[0].dat_corte,
                          num_id_estab: _self.mapping[0].num_id_estab,
                          num_id_mapeamento: _self.mapping[0].num_id_mapeamento};
            flowNewModal.open(params).then(function (result) {
                if(kbnHelper.hasMessages(result)){
                    kbnHelper.showMessages(result);
                } else {
                    _self.listFlows = [];
                    _self.bigCurrentPage = 1;
                    _self.doSearch();
                }
            });
        };

        _self.newBatchFlow = function(){
            FlowModalBatchAdd.open({
                num_id_mapeamento: _self.mapping[0].num_id_mapeamento,
                dat_corte: _self.mapping[0].dat_corte
            }).then(function(){
                _self.listFlows = [];
                _self.bigCurrentPage = 1;
                _self.doSearch();
            });
        };

        _self.filtroMostraInativo = function() {
            if (_self.mostraInativo) {
                filtersService.addFilter("flow", {
                    property: 'itemInativo',
                    restriction: '',
                    title: $rootScope.i18n('l-view-inactive-items'),
                    value: true
                });
            }
        };

        _self.doSearch = function(){
            _self.listFlows = [];
            var filters = filtersService.get('flow');
            var properties = kbnHelper.filtersToPropValues(filters);
            properties.pageSize = _self.pageSize;
            properties.currentPage = (_self.bigCurrentPage - 1);
            properties.num_id_mapeamento = $scope.id;
            if (!_self.mostraInativo)
                properties.ativo = true;

            mappingErpFactory.getFlowsAtMapping(properties,{}, function(result){
                if(result.length > 0)
                    _self.totalRecords = result[0].$length;
                    _self.listFlows = result;
            });
        };

        _self.quickSearch = function(){
            if (_self.quickSearchText && _self.quickSearchText !== "") {
                filtersService.addFilter("flow", {
                    property: "kbn_item.cod_chave_erp|kbn_item.des_item_erp",
                    restriction: "LIKE",
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText || ""
                });

            } else {
                filtersService.removeFilter('flow',"kbn_item.cod_chave_erp|kbn_item.des_item_erp");
            }
            _self.bigCurrentPage = 1;
            _self.doSearch();
        };

        _self.selectQuickFilter = function(filters) {
            _self.listFlows = [];
            filters.disclaimers.forEach(function(filter){
                filtersService.addFilter('flow',filter);
            });

            _self.bigCurrentPage = 1;
            _self.doSearch();
        };

        _self.printQrCode = function(tagid) {
            _self.print(tagid, 'qrcode');
        };

        _self.printBarCode = function(tagid) {
            _self.print(tagid, 'simple');
        };

        _self.print = function(tagid, typeBarcode) {
            window.open("/birt/frameset?__report=item_tag.rptdesign&num_item=" + tagid + "&type_barcode=" + typeBarcode + "&__format=pdf");
        };

        _self.preSavedFilters = [{
            title: $rootScope.i18n('l-flow-expedition'),
            disclaimers: [{
                property: 'kbn_item.log_expedic',
                restriction: 'EQUALS',
                value: true,
                hide: false,
                title: $rootScope.i18n('l-flow-expedition')
            }]
        },{
            title: $rootScope.i18n('l-flow-process'),
            disclaimers: [{
                property: 'kbn_item.log_expedic',
                restriction: 'EQUALS',
                value: false,
                hide: false,
                title: $rootScope.i18n('l-flow-process')
            }]
        }];

        _self.changePage = function(){
            _self.doSearch();
        };

        _self.init();

    }

    index.register.controller('ekanban.mapping.FlowList', mappingViewController);
});
