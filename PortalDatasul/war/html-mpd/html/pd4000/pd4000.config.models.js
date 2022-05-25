/* global TOTVSEvent, angular*/
define(['index'], function(index) {

	configModelsController.$inject = ['$scope', '$rootScope','$timeout','$filter','$stateParams', 'totvs.app-main-view.Service', 'mpd.fchdis0052.Factory', 'TOTVSEvent', '$modal'];

	function configModelsController($scope, $rootScope, $timeout, $filter, $stateParams, appViewService, fchdis0052, TOTVSEvent, $modal) {

		var configModelsController = this;

		var i18n = $filter('i18n');

		configModelsController.sim = i18n('Sim');

		configModelsController.configModels = [];
		configModelsController.fieldGridSelectedItems = [];
		configModelsController.ttOrderConfigurationModelFields = [];

		configModelsController.loadData = function() {
			fchdis0052.getConfigurationsModels ({
				idiSeq: $stateParams.idiSeq,
				search: configModelsController.quickSearchText
			},function (data) {
				configModelsController.registro = data.registro;
				configModelsController.configModels = data.dsOrderConfigurationModel;
				configModelsController.ttOrderConfigurationModelFields = data.ttOrderConfigurationModelFields;
			})

		}

		configModelsController.add = function() {

			fchdis0052.newConfigurationModel (function (data) {

				var i = configModelsController.configModels.push({
					"idi-model": data.idiModel,
					add: true,
					ttOrderConfigurationModelVal: []

				});

				$timeout (function () {
					obj = configModelsController.configModelsGrid.dataSource.at(i - 1);
					configModelsController.configModelsGrid.select("tr[data-uid='" + obj.uid + "']");
					configModelsController.configModelsGrid.editCell("tr[data-uid='" + obj.uid + "'] td:eq(2)");
				});

			});
		}

		configModelsController.reloadData = function() {

			if (!configModelsController.fieldGridDirtyItems.length) return;

			configModelsController.loadData();
		}

		configModelsController.save = function() {

			if (!configModelsController.fieldGridDirtyItems.length) return;

			var dsOrderConfigurationModel = [];

			var data = configModelsController.configModelsGrid.dataSource.data();

			for (var i = 0; i < data.length; i++) {

				if (data[i].dirty || data[i].add) {

					if ((data[i]['nom-model'] == undefined || configModelsController.isWhiteSpace(data[i]['nom-model']))
						 || (data[i]['nom-descr'] == undefined || configModelsController.isWhiteSpace(data[i]['nom-descr']))){

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							title: $rootScope.i18n('l-attention'),
							detail: $rootScope.i18n('l-required-add-model')
						});
						return;
					}

					dsOrderConfigurationModel.push(data[i].toJSON());

				}
			}

			fchdis0052.saveConfigurationsModels ({
				idiSeq: $stateParams.idiSeq
			}, {
				ttOrderConfigurationModel: dsOrderConfigurationModel
			}, function (data) {
				configModelsController.loadData();
			});
		}

		configModelsController.isWhiteSpace = function(string){
			if(string){
				string = string.split(" ").join("");
				if (string.length > 0) return false;
				else return true;
			}else{
				return true;
			}
		}

		configModelsController.deleteData = function () {
			var selectedIds = [];
			var sel = configModelsController.fieldGridSelectedItems;

			if (sel) {
				for (var i = 0; i < sel.length; i++) {
					selectedIds.push(sel[i]['idi-model']);
				}
				if (selectedIds.length > 0) {
					fchdis0052.deleteConfigurationsModel ({
						idiSeq: $stateParams.idiSeq,
						idiModel: selectedIds
					}, function (data) {
						configModelsController.loadData();
						configModelsController.fieldGridSelectedItems = [];
					});
				}
			}
		}

		configModelsController.search = function() {
			configModelsController.loadData();
		}

		$scope.$on('$stateChangeStart', function( event ) {

			var data = configModelsController.configModelsGrid.dataSource.data();
			var anyDirty = false;

			for (var i = 0; i < data.length; i++) {
				if (data[i].dirty) anyDirty = true;
			}

			if (anyDirty){
				var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/pd4000/pd4000.confirm.config.models.html',
				controller: 'salesorder.pd4000.config.models.confirm.Controller as controller',
				size: 'md',
				resolve: {
					model: function () {
						event.preventDefault();
					}
				}
				});
			}


		});

		appViewService.startView(i18n('Configuração PD4000'));
		configModelsController.loadData();

	}


	configModelValController.$inject = ['$scope', '$injector','$timeout', '$filter', '$rootScope', 'TOTVSEvent'];
	function configModelValController($scope, $injector, $timeout, $filter, $rootScope, TOTVSEvent) {

		var configModelValController = this;

		var configModelsController = $scope.configModelsController;

		var i18n = $filter('i18n');
		var number = $filter('number');

		configModelValController.ttOrderConfigurationModelVal = [];

		configModelValController.init = function (model) {
			if (model) {
				var dataItem = model.toJSON();
				if (dataItem.ttOrderConfigurationModelVal == undefined) dataItem.ttOrderConfigurationModelVal = [];
				configModelValController.ttOrderConfigurationModelVal = angular.copy(dataItem.ttOrderConfigurationModelVal);
				configModelValController.originalOrderConfigurationModelVal = dataItem.ttOrderConfigurationModelVal;
				configModelValController.model = model;
			}
		}

		configModelValController.canSave = function () {
			return true;
		}

		configModelValController.add = function () {
			var i = configModelValController.ttOrderConfigurationModelVal.push({
				'idi-model': configModelValController.model['idi-model'],
				'num-seq-campo' : 0,
				'cod-campo': '',
				'cod-valor': '',
				'num-seq-item': 0
			})
			$timeout (function () {				
				obj = configModelValController.modelValGrid.dataSource.at(i - 1);
				configModelValController.modelValGrid.select("tr[data-uid='" + obj.uid + "']");
				configModelValController.modelValGrid.editCell("tr[data-uid='" + obj.uid + "'] td:eq(1)");
			});

		}

		configModelValController.remove = function () {
			for (var index = 0; index < configModelValController.ttOrderConfigurationModelVal.length; index++) {
				var element = configModelValController.ttOrderConfigurationModelVal[index];

				if (element['cod-campo'] == configModelValController.gridSelectedItem['cod-campo']) {
					configModelValController.ttOrderConfigurationModelVal.splice(index,1);
					break;
				}
			}
		}

		configModelValController.reload = function () {
			configModelValController.ttOrderConfigurationModelVal = angular.copy(configModelValController.originalOrderConfigurationModelVal);
		}

		configModelValController.save = function () {

			var canSaveFields = true;

			angular.forEach(configModelValController.ttOrderConfigurationModelVal, function(value, key) {
				if(value['cod-campo'] == ""){
					canSaveFields = false;
				}
			});

			if(canSaveFields){
				configModelValController.model.set('ttOrderConfigurationModelVal', configModelValController.ttOrderConfigurationModelVal);

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'warning',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-save-model-to-save-fields')
				});

			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-model-field')
				});
			}
		}

		configModelValController.codCampoEditor = function  (container, options) {
			var seq = options.model['num-seq-item'] || 0;
			var input = angular.element('<input></input>');
			input.attr("data-bind", 'value: ["cod-campo"]')
			input.appendTo(container);
			var opts = [];
			var fields = configModelsController.ttOrderConfigurationModelFields;
			var iSelectedField = false;

			for (var i = 0; i < fields.length; i++) {
				if (   (seq == 0 && fields[i]['tabela'] == 'ped-venda')
					|| (seq != 0 && fields[i]['tabela'] == 'ped-item')){
						
						for (var j = 0; j < configModelValController.ttOrderConfigurationModelVal.length; j++) {													
							if (configModelValController.ttOrderConfigurationModelVal[j]['cod-campo'] == fields[i]['cod-campo']
							    && (configModelValController.ttOrderConfigurationModelVal[j]['num-seq-item'] == seq)){
								iSelectedField = true;
							}
						}

						if (iSelectedField == false){
							opts.push({id: fields[i]['cod-campo'], name: fields[i]['campo']});
						}

						iSelectedField = false;

						//opts.push({id: fields[i]['cod-campo'], name: fields[i]['campo']});

					}
			}
			input.kendoComboBox({
				dataValueField: "id",
				dataTextField: "name",
				filter: 'contains',
				dataSource: opts
			});
		}

		configModelValController.codCampoTemplate = function (dataItem) {
			var val = dataItem['cod-campo'];
			var seq = dataItem['num-seq-item'] || 0;
			var fields = configModelsController.ttOrderConfigurationModelFields;
			for (var i = 0; i < fields.length; i++) {
				if (   (val == fields[i]['cod-campo'])
					&& (   (seq == 0 && fields[i]['tabela'] == 'ped-venda')
						|| (seq != 0 && fields[i]['tabela'] == 'ped-item')))
					return fields[i]['campo'];
			}
			return val;
		};

		configModelValController.codValorTemplate = function (dataItem) {
			var seq = dataItem['num-seq-item'] || 0;
			var val = dataItem['cod-valor'];
			var campo = dataItem['cod-campo'];
			var fields = configModelsController.ttOrderConfigurationModelFields;
			for (var i = 0; i < fields.length; i++) {
				if (   (campo == fields[i]['cod-campo'])
					&& (   (seq == 0 && fields[i]['tabela'] == 'ped-venda')
						|| (seq != 0 && fields[i]['tabela'] == 'ped-item'))) {
					var tipo = fields[i].tipo.split(':');

					if (tipo[0] == "zoom") {
					}
					if (tipo[0] == "options") {
						for (var i = 1; i < tipo.length; i++) {
							var op = tipo[i].split(',');
							if (op[0] == val)
								return op[1];
						}
					}
					/*if (tipo[0] == "integer") {
					}*/
					if (tipo[0] == "boolean") {
						if (val)
							return i18n('Sim');
						return i18n('Não');
					}
					if (tipo[0] == "decimal") {
						return number(val,tipo[1]);
					}

				}
			}
			return val;
		};

		configModelValController.addSelectEditor = function (input, tipo, options) {
			var columnSelectService = tipo[3];
			var columnSelectId = tipo[1];
			var columnSelectDescription = tipo[2];
			var columnSelectInit = undefined;
			if (tipo.length > 4)
				columnSelectInit = tipo[4];

			var service = $injector.get(columnSelectService);

			var combobox;

			var fields = {};
			fields['["' + columnSelectId + '"]'] = {};
			if (columnSelectDescription)
				fields['["' + columnSelectDescription + '"]'] = {};

			var datasourcetransport = {
				read: function (e) {
					if (e.data.filter || options.model["cod-valor"] == "") {

						var value = "";

						if (e.data.filter && e.data.filter.filters && e.data.filter.filters.length > 0)
							value = e.data.filter.filters[0].value;

						var filter = { property : columnSelectDescription || columnSelectId };

						var promise = service.applyFilter({
							init: columnSelectInit ? {gotomethod: columnSelectInit} : undefined,
							disclaimers: [{ property : filter.property, value : value }],
							selectedFilter: filter,
							selectedFilterValue: value,
							more: false,
							isAdvanced: false,
							isSelectValue: true
						});

						if (promise) {
							if (promise.then) {
								promise.then(function (data) {
									e.success(data);
									//combobox.select(0);
								});
							} else {
								e.error();
							}
						} else {
							e.error();
						}
					} else {
						var promise = service.getObjectFromValue(
							options.model["cod-valor"],
							columnSelectInit ? {gotomethod: columnSelectInit} : undefined);
						if (promise) {
							if (promise.then) {
								promise.then(function (data) {
									e.success([data.toJSON()]);
								});
							} else {
								e.error();
							}
						} else {
							e.error();
						}
					}
				}
			};

			var opts = {
				autoBind: false,
				dataValueField: '["' + columnSelectId + '"]',
				dataTextField: '["' + columnSelectId + '"]',
				filter: 'custom',
				change: function (e) {
					if  (combobox.dataSource.get(combobox.value())) {
						options.model.set('["cod-valor"]',combobox.value());
						combobox.text(combobox.value());
					}
				},
				dataSource: {
					serverFiltering: true,
					schema: {
						model: {
							id: '["' + columnSelectId + '"]',
							fields: fields
						}
					},
					transport: datasourcetransport
				}
			};
			if (columnSelectDescription) {
				opts.dataTextField = '["' + columnSelectDescription + '"]';
				opts.template = "<span>#: data['"+ columnSelectId + "'] # - #: data['" + columnSelectDescription + "'] #</span>";
			}
			input.kendoComboBox(opts);
			combobox = input.data("kendoComboBox");
			combobox.value(options.model['cod-valor']);
		}

		configModelValController.addOptionsEditor = function (input, tipo, options) {
			var opts = [];
			for (var i = 1; i < tipo.length; i++) {
				var op = tipo[i].split(',');
				opts.push({id: op[0], name: op[1]});
			}
			input.kendoDropDownList({
				dataValueField: "id",
				dataTextField: "name",
				dataSource: opts
			});
		}


		configModelValController.codValorEditor = function  (container, options) {
			var val = options.model['cod-campo'];
			var seq = options.model['num-seq-item'] || 0;
			var input = angular.element('<input></input>');
			input.attr("data-bind", 'value: ["cod-valor"]');
			var fields = configModelsController.ttOrderConfigurationModelFields;
			var field = {tipo:"string"};
			for (var i = 0; i < fields.length; i++) {
				if (   (val == fields[i]['cod-campo'])
					&& (   (seq == 0 && fields[i]['tabela'] == 'ped-venda')
						|| (seq != 0 && fields[i]['tabela'] == 'ped-item')))
					field = fields[i];
			}
			input.appendTo(container);
			var tipo = field.tipo.split(':');
			if (tipo[0] == "string") {
				input.addClass("k-input");
				input.addClass("k-textbox");
			}
			if (tipo[0] == "zoom") {
				configModelValController.addSelectEditor(input, tipo, options);
			}
			if (tipo[0] == "options") {
				configModelValController.addOptionsEditor(input, tipo, options);
			}
			if (tipo[0] == "integer") {
				input.attr("type","number");
				input.kendoNumericTextBox({format: 'n', spinners: false});
			}
			if (tipo[0] == "boolean") {
				input.attr("type","checkbox");
				input.attr("data-bind", 'checked: ["cod-valor"]');
			}
			if (tipo[0] == "decimal") {
				input.attr("type","number");
				input.kendoNumericTextBox({format: 'n', spinners: false, decimals: tipo[1]});
			}


		}

		configModelValController.setShowAlert = function(){
			configModelValController.showAlert = !configModelValController.showAlert
		};

	}

	configModelsConfirmController.$inject = ['$modalInstance', 'model'];
	function configModelsConfirmController ($modalInstance, model) {

		this.search = function () {
			$modalInstance.close();
		}

		this.close = function () {
			$modalInstance.dismiss();
		}
	}

	index.register.controller('salesorder.pd4000.config.models.confirm.Controller', configModelsConfirmController);
	index.register.controller('salesorder.pd4000.config.models.Controller', configModelsController);
	index.register.controller('salesorder.pd4000.config.models.val.Controller', configModelValController);
});
