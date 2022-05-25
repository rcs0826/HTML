define([
    'index',
    '/dts/kbn/js/factories/formula-factory.js',
    '/dts/kbn/js/filters-service.js',
    '/dts/kbn/js/helpers.js',
    '/dts/kbn/html/formula/formula.edit.js'
], function (index) {

    controllerFormulaListCtrl.$inject = [
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'TOTVSEvent',
        'kbn.formula.Factory',
        'kbn.filters.service',
        'kbn.helper.Service',
        'ekanban.formula.edit.modal',
		'messageHolder'
    ];
    function controllerFormulaListCtrl(
        $scope,
        appViewService,
        $rootScope,
        TOTVSEvent,
        formulaFactory,
        filtersService,
        kbnHelper,
        formulaModalEdit,
		messageHolder
    ) {
        var _self = this;

        _self.changePage = function(){
            _self.doSearch();
        };

        _self.init = function() {

            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;
            _self.quickSearchText = '';

            createTab = appViewService.startView($rootScope.i18n('l-formula-kanban'), 'ekanban.formula.ListCtrl', controllerFormulaListCtrl);
            
            _self.filtersApplied = filtersService.get('formula');

            _self.listFormula = [];
            _self.doSearch();

        };

        _self.openModalFormulaEdit = function (formula) {
            _self.openModalFormula("edit", formula, _self.exitModalFormulaEdit);
        };

        _self.exitModalFormulaEdit = function(result) {
            _self.exitModalFormula(result, $rootScope.i18n('l-edit-formula'));
        };            

        _self.remove = function(model) {
            messageHolder.showQuestion($rootScope.i18n('l-remove-formula'), $rootScope.i18n('msg-remove-formula-confirmation'),function (answer) {            
                if (answer === true) {
                    formulaFactory.deleteFormula(model, function(result) {
                        if(!result.$hasError){
                            _self.listFormula = [];
                            
                            if(_self.totalRecords % _self.pageSize == 1 && _self.bigCurrentPage > 1){
                                _self.bigCurrentPage--;
                            }

                            _self.doSearch();

                            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                                type:   'info',
                                title:  $rootScope.i18n('l-remove-formula'),
                                detail: $rootScope.i18n('l-success-transaction')
                            });
                        }

                    });
                }
            });
        };
            
        _self.doSearch = function() {
            var properties = {};
            
			var filters = filtersService.get('formula');
            var properties = kbnHelper.filtersToPropValues(filters);
            properties.pageSize = _self.pageSize;
            properties.currentPage = (_self.bigCurrentPage - 1);
            
            _self.listFormula = [];

            formulaFactory.getFormulas(properties,{},function(result) {
                if(result){
                    _self.listFormula = result;

                    if(result.length > 0){
                        _self.totalRecords = result[0].$length;
                    } else {
                        _self.totalRecords = 0;
                    }
                }
            });
        };
            
        _self.quickSearch = function(){

            if (_self.quickSearchText && _self.quickSearchText !== ""){

                filtersService.addFilter('formula',{
                    property: 'des_formula',
                    restriction: 'LIKE',
                    title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
                    value: _self.quickSearchText
                });

                _self.quickSearchText = "";
                _self.listFormula = [];
                _self.bigCurrentPage = 1;
                
                _self.doSearch();

            }
        };
            
        _self.removeFilter = function(filter) {

            filtersService.removeFilter('formula',filter.property);

            _self.listFormula = [];

            _self.bigCurrentPage = 1;
            _self.doSearch();
		};
            
        _self.openModalFormulaNew = function (formula) {
            _self.openModalFormula("new", formula, _self.exitModalFormulaNew);
        };
            
        _self.openModalFormula = function (action, formula, callback) {
            var params = {
                model: formula,
                action: action
            };

            formulaModalEdit.open(params).then(function(callback){
                _self.doSearch();
            });
        };

        _self.init();
    }

    index.register.controller('ekanban.formula.ListCtrl', controllerFormulaListCtrl);
});
