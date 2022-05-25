define(['index',
        '/dts/kbn/js/factories/card-factory.js',
        '/dts/kbn/js/filters.js',
        '/dts/kbn/js/helpers.js',
        '/dts/kbn/js/filters-service.js',
        '/dts/kbn/js/factories/mappingErp-factories.js',
        '/dts/kbn/js/directives.js',
        '/dts/kbn/html/inventoryadjustment/inventoryadjustment.advanced.search.js'
], function (index) {

    controllerInventoryAdjustmentListCtrl.$inject = [
        '$rootScope',
		'$filter',
        '$scope',
        'totvs.app-main-view.Service',
        '$rootScope',
        'kbn.helper.Service',
        'messageHolder',
        'kbn.filters.service',
        'kbn.data.Factory',
        'kbn.cards.Factory',
        'kbn.mappingErp.Factory',
        'ekanban.inventoryadjustment.advanced.search.modal'
    ];

    function controllerInventoryAdjustmentListCtrl(
        $rootScope,
		$filter,
        $scope,
        appViewService,
        $rootScope,
        kbnHelper,
        messageHolder,
        filtersService,
        kbnDataService,
        cardFactory,
        mapErpFactory,
        advancedSearchModal
    ) {
        var _self = this;

        _self.init = function () {
            createTab = appViewService.startView($rootScope.i18n('l-balance-adjust'), 'ekanban.inventoryadjustment.ListCtrl', controllerInventoryAdjustmentListCtrl);

            _self.filtersApplied = filtersService.get('inventoryadjustment');
            _self.listBalance = [];

            var category = 3; //Adjusting

            _self.listJustification = [];
            _self.quickSearchText = '';
            _self.justification = {};
			_self.totalRecords = 0;
            _self.bigCurrentPage = 1;
            _self.pageSize = 25;
            
            _self.estabDirective = kbnDataService.getEstablishmentDirective();
            
            if (_self.hasEstab()){

                _self.doSearch();

                filtersService.addFilter("inventoryadjustment", {
                    property: 'cod_estab_erp',
                    title: $rootScope.i18n('l-site') + ": " + _self.estabDirective.cod_estab_erp,
                    value: _self.estabDirective.cod_estab_erp,
                    fixed: true
                });
            } else {
				filtersService.removeFilter('inventoryadjustment', 'cod_estab_erp');
			}

            var properties = {
                classifiers: "",
                currentPage: 0,
                pageSize: 0,
                properties: ["num_id_categ"],
                restriction: ["EQUALS"],
                values: [3]
            };

            mapErpFactory.justificatives(properties, {}, function (result) {
                _self.listJustification = result;
            });
        };

		_self.colorTag = function(idColor)
		{
			return kbnHelper.colorTag(idColor);
		};

        _self.validNumbers = function(obj,field){
            obj[field] = $filter('numberOnly')(obj[field]);
            return true;
        };

        _self.estabSelected = function(value, oldValue){
            _self.bigCurrentPage = 1;
			_self.estabErp = value;
            filtersService.removeFilter("inventoryadjustment", "quickSearch");
			_self.doSearch();
        };
        			
		_self.changePage = function(){
            _self.doSearch();
        };

        _self.doSearch = function(){
			var searchText = "";
			var filtros = [];
			_self.listBalance = [];

			_self.filtersApplied.forEach(function(e) {
				if(e.property === "quickSearch") {
					searchText = e.value;
				}
			});

			filtros.push({codDescItem: searchText, currentPage: (_self.bigCurrentPage - 1), pageSize: _self.pageSize});
			
			mapErpFactory.getInventoryAdjustment({num_id_estab: _self.estabDirective.num_id_estab}, filtros, function(result){
				_self.listBalance = kbnHelper.createSituationCardsObj(result);
				if(result.length >0){
					_self.totalRecords = result[0].$length;
				} else {
					_self.totalRecords = 0;
				}
			});
        };

        _self.resetValues = function(balance, balanceForm){

            balanceForm.$setPristine();

            balance.qtdBoard = balance.qtdBoardBackup;
            balance.qtdSupermarket = balance.qtdSupermarketBackup;

        };

        _self.quickSearch = function() {	
			_self.bigCurrentPage = 1;
			if (_self.quickSearchText && _self.quickSearchText !== ""){
				filtersService.addFilter('inventoryadjustment',{
					property: 'quickSearch',
					restriction: 'LIKE',
					title: $rootScope.i18n('l-description') + ': ' + _self.quickSearchText,
					value: _self.quickSearchText
				});
				_self.quickSearchText = "";
				_self.doSearch();
			}
		};

        _self.validfields = function($form,getReturn){

            var totalCards = 0;
            var ret = true;

            totalCards += $form.board.$modelValue;
            totalCards += $form.production.$modelValue;
            totalCards += $form.transport.$modelValue;
            totalCards += $form.locked.$modelValue;

            if(totalCards > $form.total.$modelValue){
                $form.board.$invalid = true;
                ret = false;
            }else{
                if($form.board.$valid){
                    $form.board.$invalid = false;
                }
            }

            totalCards += $form.supermarket.$modelValue;

            if(totalCards < $form.total.$modelValue){
                $form.supermarket.$invalid = true;
                ret = false;
            }else{
                if($form.supermarket.$valid){
                    $form.supermarket.$invalid = false;
                }
            }

            if(getReturn){
                return ret;
            }

        };

        _self.saveAdjusting = function(balance, justification, $form) {
            queryParams = {targetItemDet:balance.itemDetail,
                           targetBoardQuantity:balance.qtdBoard,
                           targetSupermarketQuantity:balance.qtdSupermarket,
                           justificative:justification.num_id_justif};

            cardFactory.inventoryAdjustment(queryParams, function (result) {
                justification = "";
                $form.$setPristine();
				if(!result.$hasError){
					messageHolder.showNotify({
                        type: 'info',
                        title: $rootScope.i18n('l-success-balance-adjusting')
                    });
				}

                _self.doSearch();
            });
        };

        _self.removeFilter = function(filter){
            filtersService.removeFilter('inventoryadjustment',filter.property);
            _self.doSearch();
        };
            
        _self.openAdvancedSearch = function(){

            advancedSearchModal.open(_self.filtersApplied).then(function(result) {
				var oldEstab = _self.estabDirective.num_id_estab;
                
                if (_self.hasEstab(result.estab)){

                    kbnDataService.setEstablishmentDirective(result.estab);

                    _self.estabDirective = result.estab;

                    result.filtro.forEach(function(filter){
                        filtersService.addFilter('inventoryadjustment',filter);
                    });
                }
				
				if (oldEstab !== result.estab.num_id_estab){
					filtersService.removeFilter('inventoryadjustment',"quickSearch");
					_self.quickSearchText = "";	
				}

                _self.doSearch();
            });
        };
            
        _self.hasEstab = function(estab) {
            estab = estab || _self.estabDirective;

            return estab && estab.num_id_estab > 0;
        };

        _self.init();

    }

    index.register.controller('ekanban.inventoryadjustment.ListCtrl', controllerInventoryAdjustmentListCtrl);
});
