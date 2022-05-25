define([
    'index',
    '/dts/kbn/html/justificative/justificative.edit.js',
    '/dts/kbn/js/helpers.js',
    '/dts/kbn/js/filters-service.js',
    '/dts/kbn/js/factories/mappingErp-factories.js',
    '/dts/kbn/js/enumkbn.js'
], function (index) {

    controllerJustificativeListCtrl.$inject = [
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'kbn.helper.Service',
        'ekanban.justificative.edit.modal',
        'messageHolder',
        'kbn.filters.service',
        'TOTVSEvent',
        'kbn.mappingErp.Factory',
        'enumkbn'
    ];
    function controllerJustificativeListCtrl(
        $scope,
        appViewService,
        $rootScope,
        kbnHelper,
        justificativeModalEdit,
        messageHolder,
        filtersService,
        TOTVSEvent,
        mappingErpFactory,
        enumKbn
    ) {
        var _self = this;

        _self.remove = function(model) {
            messageHolder.showQuestion($rootScope.i18n('l-remove-justificative'), $rootScope.i18n('msg-remove-justificative-confirmation'),function (answer) {
                if (answer === true) {
                    mappingErpFactory.deleteJustificatives(model, function(result) {

                        if(!result.$hasError){
                            _self.listJustificative = [];
                            
                            if(_self.totalRecords % _self.pageSize == 1 && _self.bigCurrentPage > 1){
                                _self.bigCurrentPage--;
                            }

                            _self.doSearch();

                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type:   'info',
                                title:  $rootScope.i18n('l-remove-justificative'),
                                detail: $rootScope.i18n('l-success-transaction')
                            });
                        }

                    });
                }
            });
        };

        _self.quickSearch = function(){

            if (_self.quickSearchText && _self.quickSearchText !== ""){

                filtersService.addFilter('justificative',{
                    property: 'des_justif',
                    restriction: 'LIKE',
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText
                });

                _self.quickSearchText = "";

                _self.listJustificative = [];

                _self.bigCurrentPage = 1;
                _self.doSearch();

            }
        };

        _self.removeFilter = function(filter) {

            filtersService.removeFilter('justificative',filter.property);

            _self.listJustificative = [];

            _self.bigCurrentPage = 1;
            _self.doSearch();
		};

        _self.justCategoryDesc = {
            4: 'l-extra-card-emission',
            3: 'l-balance-adjust',
            2: 'l-card-reorder',
            1: 'l-card-lock'
        };

        _self.preSavedFilters = [{
            title: $rootScope.i18n('l-card-lock'),
            disclaimers: [
                {
                    property: 'num_id_categ',
                    restriction: 'EQUALS',
                    value: enumKbn.justificativeCategory.cardLock,
                    title: $rootScope.i18n('l-card-lock')
                }
            ]
        },{
            title: $rootScope.i18n('l-balance-adjust'),
            disclaimers: [
                {
                    property: 'num_id_categ',
                    restriction: 'EQUALS',
                    value: enumKbn.justificativeCategory.balanceAdjustment,
                    title: $rootScope.i18n('l-balance-adjust')
                }
            ]
        },{
            title: $rootScope.i18n('l-extra-card-emission'),
            disclaimers: [
                {
                    property: 'num_id_categ',
                    restriction: 'EQUALS',
                    value: enumKbn.justificativeCategory.extraCardEmission,
                    title: $rootScope.i18n('l-extra-card-emission')
                }
            ]
        }];

        _self.selectQuickFilter = function(filters) {

            _self.listJustificative = [];

            filters.disclaimers.forEach(function(filter){
                filtersService.addFilter('justificative',filter);
            });

            _self.bigCurrentPage = 1;
            _self.doSearch();

        };

        _self.getCategoryDesc = function (CategoryInt) {
            for (var indice in this.justCategoryDesc) {
                if (indice == CategoryInt) {
                    return $rootScope.i18n(this.justCategoryDesc[indice]);
                }
            }
        };

        _self.openModalJustificativeNew = function (justificative) {
            _self.openModalJustificative("new", justificative, _self.exitModalJustificativeNew);
        };

        _self.openModalJustificative = function (action, justificative, callback) {
            var params = {
                model: justificative,
                action: action
            };

            justificativeModalEdit.open(params).then(callback);
        };

        _self.exitModalJustificativeNew = function(result) {
            _self.exitModalJustificative(result, $rootScope.i18n('l-new-justificative'));
        };

        _self.exitModalJustificative = function(result, message) {
            if (kbnHelper.hasMessages(result)) {
                kbnHelper.showMessages(result);
            } else {
                _self.listJustificative = [];

                _self.bigCurrentPage = 1;
                _self.doSearch();
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'info',
                    title:  message,
                    detail: $rootScope.i18n('l-success-transaction')
                });
            }
        };

        _self.openModalJustificativeEdit = function (justificative) {
            _self.openModalJustificative("edit", justificative, _self.exitModalJustificativeEdit);
        };

        _self.exitModalJustificativeEdit = function(result) {
            _self.exitModalJustificative(result, $rootScope.i18n('l-edit-justificative'));
        };

        _self.doSearch = function() {
			_self.listJustificative = [];
            var filters = filtersService.get('justificative');
            var properties = kbnHelper.filtersToPropValues(filters);
            properties.pageSize = _self.pageSize;
            properties.currentPage = (_self.bigCurrentPage - 1);

            mappingErpFactory.justificatives(properties,{},function(result) {
                if(result){
                    _self.listJustificative = result;

                    if(result.length > 0)
                        _self.totalRecords = result[0].$length;
                }
            });
        };

        _self.changePage = function(){
            _self.doSearch();
        };

        _self.init = function() {

            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;

            createTab = appViewService.startView($rootScope.i18n('l-justificative'), 'ekanban.justificative.ListCtrl', controllerJustificativeListCtrl);

            _self.filtersApplied = filtersService.get('justificative');

            _self.listJustificative = [];
            _self.doSearch();

        };

        _self.init();
}

    index.register.controller('ekanban.justificative.ListCtrl', controllerJustificativeListCtrl);
});
