define([
    'index',
    '/dts/kbn/js/directives.js',
    '/dts/kbn/js/filters.js',
    '/dts/kbn/js/factories/card-factory.js',
    '/dts/kbn/js/filters-service.js',
    '/dts/kbn/js/helpers.js',
    '/dts/kbn/js/directives.js',
    '/dts/kbn/html/consumption/consumption.advanced.search.js'
], function(index) {

    cardConsumptionController.$inject = [
        '$filter',
        '$scope',
        '$rootScope',
        'totvs.app-main-view.Service',
        'kbn.data.Factory',
        'kbn.helper.Service',
        'kbn.filters.service',
        'messageHolder',
        'kbn.cards.Factory',
        'ekanban.consumption.advanced.search.modal',
        'kbn.data.Factory'
    ];
    function cardConsumptionController(
        $filter,
        $scope,
        $rootScope,
        appViewService,
        kbnDataService,
        kbnHelper,
        filtersService,
        messageHolder,
        cardFactory,
        advancedSearchModal,
        dataFactory
    ) {
        var _self = this;

        _self.init = function() {
            appViewService.startView($rootScope.i18n('l-card-consumption'), 'kbn.consumption.taskCtrl',  cardConsumptionController);
            _self.listTag = [];
            _self.filtersApplied = filtersService.get('consumption');
            _self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;

            updateEstablishment(dataFactory.getEstablishmentDirective());

            if (_self.hasEstab())
                _self.doSearch();
        };

        var updateEstablishment = function(establishment) {
            _self.estabDirective = establishment;

            if (_self.hasEstab() ) {
                filtersService.addFilter('consumption', {
                    property: 'estabID',
                    title: $rootScope.i18n('l-site') + ': ' + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });
            }
        };

        _self.colorTag = function(idColor){
            return kbnHelper.colorTag(idColor);
        };

        _self.consumptionCallback = function(result){

            _self.listTag = [];
            kbnHelper.getColorCard(result);
            _self.listTag = result;
            _self.allTags = result;
            _self.filtersApplied = filtersService.get('consumption');

            if(_self.filtersApplied.length > 0){
                _self.quickSearchFunction(_self.allTags, _self.filtersApplied[0].value);
            }

        };

        _self.quickSearch = function() {
            _self.quickSearchFunction(_self.allTags, _self.quickSearchText);
            _self.quickSearchText = '';
        };

        _self.quickSearchFunction = function(arrayOfObjs, arguments) {
            _self.listTag = [];
            if (arguments && arguments !== '') {
                filtersService.addFilter('consumption', {
                    property: 'kbn_item_det.cod_chave_erp|kbn_item_det.des_item_erp',
                    restriction: 'LIKE',
                    title: $rootScope.i18n('l-description') + ': ' + arguments,
                    value: arguments || ''
                });

            } else {
                _self.filtersApplied.pop();
                _self.listTag = arrayOfObjs;
            }

            _self.bigCurrentPage = 1;
            _self.totalRecords = 0;

            _self.doSearch();
        };

        _self.removeFilter = function(filter) {
            filtersService.removeFilter('consumption', filter.property);
            _self.listTag = _self.allTags;
            _self.doSearch();
        };

        _self.changePage = function(){
            _self.doSearch();
        };

        _self.doSearch = function(){
			_self.listTag = [];
            var filters = filtersService.get('consumption').filter(function(e) {
                return e.property !== 'estabID';
            });
            var properties = kbnHelper.filtersToPropValues(filters);

            properties.pageSize = _self.pageSize;
            properties.currentPage = (_self.bigCurrentPage - 1);
            properties.estabID = _self.estabDirective.num_id_estab;

            cardFactory.getItemCard(properties, function(obj){
                if (obj){
                    _self.listTag = obj;

                    if(obj.length > 0){
                        _self.totalRecords = obj[0].$length;
                    }
                }
            });
        };

        _self.calculateCardsAtItemUnit = function(tag) {
            tag.qtd_calc = tag.qtd_consumo * tag.qti_tam_kanban;
        };

        _self.validNumbers = function(obj,field){
            obj[field] = $filter('numberOnly')(obj[field]);
            return true;
        };

        _self.consumeSelectedItem = function(tag){

            cardFactory.ConsumeCards({numIdItemDet: tag.num_id_item_det, qtdDesejada: tag.qtd_consumo}, {}, function(result){

                _self.doSearch();

            });
        };

        _self.callAdvancedSearch = function(){
            var oldEstab = _self.estabDirective;

            advancedSearchModal.open({
                estab: _self.estabDirective
            }).then(function(result) {

                if (_self.hasEstab(result.estab)){
                    dataFactory.setEstablishmentDirective(result.estab);

                    updateEstablishment(result.estab);
                }

                if(oldEstab.num_id_estab !== result.estab.num_id_estab){
                    filtersService.removeFilter('consumption', 'kbn_item_det.cod_chave_erp|kbn_item_det.des_item_erp');
                    filtersService.removeFilter('consumption', 'kbn_item.log_expedic');
                    _self.quickSearchText = '';
                }

                _self.quickSearchText = '';
                _self.bigCurrentPage = 1;
                _self.totalRecords = 0;

                _self.doSearch();
            });
        };

        _self.hasEstab = function(estab) {
            estab = estab || _self.estabDirective;

            return estab && estab.num_id_estab > 0;
        };
            
        _self.preSavedFilters = [{
            title: $rootScope.i18n('l-flow-expedition'),
            disclaimers: [{
                property: 'kbn_item.log_expedic',
                restriction: 'EQUALS',
                value: true,
                hide: false,
                title: $rootScope.i18n('l-flow-expedition'),
				isParam: true
            }]
        },{
            title: $rootScope.i18n('l-flow-process'),
            disclaimers: [{
                property: 'kbn_item.log_expedic',
                restriction: 'EQUALS',
                value: false,
                hide: false,
                title: $rootScope.i18n('l-flow-process'),
				isParam: true
            }]
        }];
            
        _self.selectQuickFilter = function(filters) {
            filters.disclaimers.forEach(function(filter){
                filtersService.addFilter('consumption',filter);
            });

            _self.bigCurrentPage = 1;
            _self.doSearch();
        };

        _self.init();
    }

    index.register.controller('kbn.consumption.taskCtrl', cardConsumptionController);
});
