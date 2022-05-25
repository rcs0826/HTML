define([
	'index',
	'ng-load!ui-file-upload',
	'/dts/kbn/js/factories/kbn-factories.js',
	'/dts/kbn/js/factories/mappingErp-factories.js',
	'/dts/kbn/js/filters-service.js',
	'/dts/kbn/js/filters.js',
	'/dts/kbn/js/helpers.js'
], function(index) {

	controllerKanbanRangeAdjustmentSimulation.$inject = [
		'kbn.data.Factory',
		'ReportService',
		'kbn.filters.service',
		'$rootScope',
		'totvs.app-main-view.Service',
		'kbn.mappingErp.Factory',
		'kbn.helper.Service',
		'messageHolder'
	];
	function controllerKanbanRangeAdjustmentSimulation(
		dataFactory,
		reportService,
		filtersService,
		$rootScope,
		appViewService,
		mappingErp,
		kbnHelper,
		messageHolder
	) {

		var _self = this;

		_self.init = function() {
			createTab = appViewService.startView($rootScope.i18n('l-simulation-kanban-stack'), 'ekanban.kanbanrangeadjustment.SimulationCtrl', controllerKanbanRangeAdjustmentSimulation);

			_self.establishment = dataFactory.getEstablishment();
			_self.quickSearchText = "";
			_self.qtditems = 0;

			var array = dataFactory.get('kanbanRangeSimulation');

			filtersService.set({simulationkanbanstack:[]});
			_self.filtersApplied = filtersService.get('simulationkanbanstack');

			_self.items = JSON.parse(array);

			_self.items.forEach(function(item){

				item.itempai = {
					cod_chave_erp: item.cod_erp_item_pai,
					des_item_erp: item.desc_item_pai,
					cod_refer: item.refer_item_pai,
					log_expedic: item.log_expedic_item_pai,
					cod_un_med_erp: item.cod_un_med_erp_pai
				};

				item.show = true;
			});

			_self.qtditems = _self.items.length;

			_self.items = kbnHelper.sortList(_self.items);

		};

		_self.removeFilter = function(filter){
			filtersService.removeFilter('simulationkanbanstack',filter.property);
			_self.quickSearch();
		};

		_self.exportaConsulta = function(){

			reportService.print('kbn/simulationkanbanstack',{
				format: "xlsx",
				publish: false,
				download: true,
				dialect: "pt"
			}, _self.items);

		};

		_self.quickSearch = function(){

			if(_self.quickSearchText){

				filtersService.addFilter('simulationkanbanstack',{
					property: 'nameFlow',
					restriction: 'LIKE',
					hide: false,
					title: $rootScope.i18n('l-code-description') + ': ' + _self.quickSearchText,
					value: _self.quickSearchText
				});

			}

			var value = "";

			_self.filtersApplied.forEach(function(e) {
				if(e.property === "nameFlow") {
					value = e.value.toUpperCase();
				}
			});

			_self.qtditems = 0;

			_self.items.forEach(function(item){

				if(item.itempai.cod_chave_erp.toUpperCase().indexOf(value) != -1 ||
				   item.itempai.des_item_erp.toUpperCase().indexOf(value) != -1  ||
				   item.itempai.cod_refer.toUpperCase().indexOf(value) != -1 ){

					item.show = true;
					_self.qtditems += 1;

				}else
					item.show = false;
			});

			_self.quickSearchText = "";

		};

		_self.updateKanbanRange = function(items) {
			var itemsCopy = [];
			angular.copy(items, itemsCopy);

			itemsCopy = itemsCopy.map(function(e) {
				delete e.itempai;
				return e;
			});

			mappingErp.updateKanbanRange(itemsCopy,function(result){

				if(!result.$hasError){
					messageHolder.showNotify({
						type: 'info',
						title: $rootScope.i18n('l-success-transaction')
					});
				}

			});
		};

		_self.init();
	}

	index.register.controller('ekanban.kanbanrangeadjustment.SimulationCtrl', controllerKanbanRangeAdjustmentSimulation);
});
