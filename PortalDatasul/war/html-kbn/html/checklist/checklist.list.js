define([
    'index',
    '/dts/kbn/html/checklist/checklist.edit.js',
    '/dts/kbn/js/filters-service.js',
    '/dts/kbn/js/factories/mappingErp-factories.js'
], function (index) {

    controllerChecklistListCtrl.$inject = [
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'messageHolder',
        'kbn.helper.Service',
        'ekanban.checklist.edit.modal',
        'kbn.filters.service',
        'TOTVSEvent',
        'kbn.mappingErp.Factory'
    ];

    function controllerChecklistListCtrl(
        $scope,
        appViewService,
        $rootScope,
        messageHolder,
        kbnHelper,
        checklistModalEdit,
        filtersService,
        TOTVSEvent,
        factorymappingErp
    ) {

        var _self = this;

        _self.remove = function (model) {
            messageHolder.showQuestion($rootScope.i18n('l-remove-checklist'), $rootScope.i18n('msg-remove-checklist-confirmation'), function (answer) {

                if (answer === true) {
                    factorymappingErp.checklistDeleteRecord(model, function(result) {

                        _self.listChecklist = [];
                        
                        if(_self.totalRecords % _self.pageSize == 1 && _self.bigCurrentPage > 1){
                            _self.bigCurrentPage--;
                        }
                        
                        _self.doSearch();

                        $rootScope.$broadcast(TOTVSEvent.showNotification, {
                            type:   'info',
                            title:  $rootScope.i18n('l-remove-checklist'),
                            detail: $rootScope.i18n('l-success-transaction')
                        });

                    });
                }

            });
        };

        _self.changePage = function(){
            _self.doSearch();
        };

        _self.quickSearch = function(){

            if (_self.quickSearchText && _self.quickSearchText !== ""){

                filtersService.addFilter('checklist',{
                    property: 'des_item_checklist',
                    restriction: 'LIKE',
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText
                });

                _self.quickSearchText = "";

                _self.listChecklist = [];

                _self.bigCurrentPage = 1;
                _self.doSearch();

            }

        };

        _self.removeFilter = function(filter){

            filtersService.removeFilter('checklist',filter.property);

            _self.listChecklist = [];

            _self.bigCurrentPage = 1;
            _self.doSearch();

		};

        _self.exitModalChecklistEdit = function (result) {
            _self.exitModalChecklist(result, $rootScope.i18n('l-edit-checklist'));
        };

        _self.exitModalChecklist = function (result, message) {
            if(kbnHelper.hasMessages(result)){
                kbnHelper.showMessages(result);
            } else {
                _self.listChecklist = [];

                _self.bigCurrentPage = 1;
                _self.doSearch();
                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type:   'info',
                    title:  message,
                    detail: $rootScope.i18n('l-success-transaction')
                });
            }
        };

        _self.exitModalChecklistNew = function (result) {
            _self.exitModalChecklist(result, $rootScope.i18n('l-new-checklist'));
        };

        _self.openModalChecklistNew = function(checklist) {
            _self.openModalChecklist("new", checklist, _self.exitModalChecklistNew);
        };

        _self.openModalChecklist = function(action, checklist, callback) {
            var params = {
                model: checklist,
                action: action
            };

            checklistModalEdit.open(params).then(callback);
        };

        _self.openModalChecklistEdit = function(checklist) {
            _self.openModalChecklist("edit", checklist, _self.exitModalChecklistEdit);
        };

        _self.doSearch = function() {
            _self.listChecklist = [];
            var filters = filtersService.get('checklist');
            var properties = kbnHelper.filtersToPropValues(filters);
            properties.pageSize = _self.pageSize;
            properties.currentPage = (_self.bigCurrentPage - 1);

            factorymappingErp.listChecklist(properties, {}, function(result){
                if(result){
                    _self.listChecklist = result;

                    if(result.length >0){
                        _self.totalRecords = result[0].$length;
                    }
                }
                                
            });
        };

        _self.init = function(){

            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;

            createTab = appViewService.startView($rootScope.i18n('l-checklist'), 'ekanban.checklist.ListCtrl', controllerChecklistListCtrl);

            _self.filtersApplied = filtersService.get('checklist');

            _self.listChecklist = [];
            _self.doSearch();

        };

        _self.init();
    }

    index.register.controller('ekanban.checklist.ListCtrl', controllerChecklistListCtrl);
});
