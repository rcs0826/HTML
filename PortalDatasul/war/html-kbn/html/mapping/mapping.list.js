define(['index',
        '/dts/kbn/html/mapping/mapping.advanced.search.js',
        '/dts/kbn/html/mapping/mapping.edit.js',
        '/dts/kbn/html/mapping/mapping.list.publish.js',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/filters-service.js'
], function (index) {

    controllerMappingListCtrl.$inject = [
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'kbn.helper.Service',
        'ekanban.mapping.edit.modal',
        'messageHolder',
        'ekanban.mapping.advanced.search.modal',
        'ekanban.mapping.publish.service',
        'kbn.filters.service',
        'kbn.mappingErp.Factory',
        'TOTVSEvent',
        '$state'
    ];

    function controllerMappingListCtrl(
        $scope,
        appViewService,
        $rootScope,
        kbnHelper,
        mappingModalEdit,
        messageHolder,
        mappingModalAdvSearch,
        mappingModalPublish,
        filtersService,
        mappingErpFactory,
        TOTVSEvent,
        $state
    ) {
        var _self = this;

        _self.init = function() {
            createTab = appViewService.startView($rootScope.i18n('l-mapping-list'), 'ekanban.mapping.ListCtrl', controllerMappingListCtrl);

            filtersService.set({flow:[]});

            _self.open = true;

            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;

            _self.filtersApplied = filtersService.get('mapping');
            _self.listMap = [];

            _self.doSearch();
        };

        _self.mapStatusDesc = {
            3: 'l-published',
            2: 'l-released-gen',
            1: 'l-not-published',
            4: 'l-unpublished'
        };

        _self.removeFilter = function(filter) {
            _self.listMap = [];
            filtersService.removeFilter('mapping',filter.property);

            _self.bigCurrentPage = 1;
            _self.doSearch();
        };

        _self.handleMappingModal= function(modalToOpen, params) {

            modalToOpen.open(params).then(function (result) {
                if(result.$hasError && result.mappingId == undefined) {
                    kbnHelper.showMessages(result);
                } else {
                    if(params.action == 'new' || params.action == 'clone')
                    {
                        $state.go('dts/kbn/mapping.view', {
                            id: result.mappingId
                        });
                    }

                    _self.listMap = [];

                    _self.bigCurrentPage = 1;
                    _self.doSearch();

                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'info',
                        title:  $rootScope.i18n('l-' + params.action + '-mapping'),
                        detail: $rootScope.i18n('l-success-transaction'),
                    });
                }
            });
        };

        _self.openModalRelatedActions = function (action, mapping) {
            var params = {
                model: mapping,
                action: action,
                disableLimitDate: false
            };

            var modalToOpen;

            modalToOpen = mappingModalEdit;

            if(action == 'edit') {
                mappingErpFactory.getFlowsAtMapping({currentPage: 0, num_id_mapeamento: mapping.num_id_mapeamento,
                    pageSize: 1, ativo: true }, {} ,function(result) {
                    params.disableLimitDate = (result.length > 0);
                    _self.handleMappingModal(modalToOpen, params);
                });
            } else {
                _self.handleMappingModal(modalToOpen, params);
            }
        };

        _self.openPublishModal = function(mapping) {

            var openPublishModalConfirm = function(answer) {

                if(answer){
                    mappingErpFactory.listChecklist({},{}, function(checklist) {

                        if (checklist.length > 0) {

                            mappingModalPublish.open(checklist).then( function(result){
                                _self.publishMapping(mapping);
                            });

                        } else {
                            _self.publishMapping(mapping);
                        }
                    });
                }

            };

            mappingErpFactory.mapping({
                properties: ["idi_status", "num_id_estab"],
                values: [3, mapping.num_id_estab]
            }, function(result){

                if(result.length > 0)
                    messageHolder.showQuestion($rootScope.i18n("l-publish-mapping"),$rootScope.i18n("l-already-has-published-mapping") + " " + $rootScope.i18n("msg-continue"),openPublishModalConfirm);
                else
                    openPublishModalConfirm(true);
            });

        };

        _self.publishMapping = function(mapping) {

            mappingErpFactory.MappingPublish({num_id_mapeamento: mapping.num_id_mapeamento}, {}, function(result){

                if(!result.$hasError){

                    _self.listMap = [];
                    _self.doSearch();
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type:   'info',
                        title:  $rootScope.i18n('l-publish-mapping'),
                        detail: $rootScope.i18n('l-success-transaction'),
                    });
                }
            });

        };

        _self.validPendencies = function(map){
            mappingErpFactory.CheckPendencies({num_id_mapeamento: map.num_id_mapeamento}, function(result){
                if(!result.$hasError){
                    $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'success',
                    title:  $rootScope.i18n('msg-checklist-valid'),
                    detail: $rootScope.i18n('l-success-transaction'),
                });
                }
            });
        };

        _self.changePage = function(){
            _self.doSearch();
        };

        _self.doSearch = function(callback) {
			_self.listMap = [];
            var filters = filtersService.get('mapping');
            var properties = kbnHelper.filtersToPropValues(filters);
            properties.pageSize = _self.pageSize;
            properties.currentPage = (_self.bigCurrentPage - 1);

            mappingErpFactory.listMappings(properties, {}, function(result){
                if(callback) {
                    callback(result);
                }else{
                    _self.listMap = result;
                }

                if(result.length > 0)
                    _self.totalRecords = result[0].$length;
            });
        };

        _self.remove = function(model) {

            messageHolder.showQuestion(
                $rootScope.i18n('l-remove-mapping'),
                $rootScope.i18n('msg-remove-mapping-confirmation'),
                function (answer) {
                    if (answer === true) {
                        mappingErpFactory.deleteMapping({mappingId: model.num_id_mapeamento}, function(result) {
                            _self.listMap = [];
                            _self.doSearch();

                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type:   'info',
                                title:  $rootScope.i18n('l-remove-mapping'),
                                detail: $rootScope.i18n('l-success-transaction'),
                            });
                        });
                    }
                }
            );

        };

        _self.selectQuickFilter = function(filters) {

            _self.listMap = [];

            filters.disclaimers.forEach(function(filter){
                filtersService.addFilter('mapping',filter);
            });

            _self.bigCurrentPage = 1;
            _self.doSearch();
        };

        _self.openAdvancedSearch = function() {
            mappingModalAdvSearch.open({
                disclaimers: filtersService.get('mapping'),
            }).then(function(result) {
                _self.listMap = [];
                result.forEach(function(filter){
                    filtersService.addFilter('mapping',filter);
                });

                _self.bigCurrentPage = 1;
                _self.doSearch();
            });
        };

        _self.quickSearch = function() {
            if (_self.quickSearchText && _self.quickSearchText !== "") {
                _self.listMap = [];

                filtersService.addFilter('mapping',{
                    property: 'des_mapeamento',
                    restriction: 'LIKE',
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText
                });

                _self.quickSearchText = "";

                _self.bigCurrentPage = 1;
                _self.doSearch();
            }
        };


        _self.colorTagStatus = function(statusMap){
            return kbnHelper.mapStatus(statusMap);
        };

        _self.preSavedFilters = [{
            title: $rootScope.i18n('l-not-published'),
            disclaimers: [
                {
                    property: 'idi_status',
                    restriction: 'EQUALS',
                    value: 1,
                    title: $rootScope.i18n('l-filter-not-published-status')
                }
            ]
        }, {
            title: $rootScope.i18n('l-published'),
            disclaimers: [
                {
                    property: 'idi_status',
                    restriction: 'EQUALS',
                    value: 3,
                    title: $rootScope.i18n('l-filter-published-status')
                }
            ]
        }, {
            title: $rootScope.i18n('l-unpublished'),
            disclaimers: [
                {
                    property: 'idi_status',
                    restriction: 'EQUALS',
                    value: 4,
                    title: $rootScope.i18n('l-filter-unpublished-status')
                }
            ]
        }];

        _self.init();
    }

    index.register.controller('ekanban.mapping.ListCtrl', controllerMappingListCtrl);
});
