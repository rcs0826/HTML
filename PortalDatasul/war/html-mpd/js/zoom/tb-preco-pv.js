define(['index',
	'/dts/dts-utils/js/zoom/zoom.js'], function (index) {

		/*#####################################################################################################
		 # Database: mgdis
		 # Table...: tab-preco
		 # Service.: serviceTabPreco Portal de Vendas
		 # Register: mpd.tb-preco-pv.zoom
		 #####################################################################################################*/

		serviceTabPrecoPv.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service', '$q'];
		function serviceTabPrecoPv($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, $q) {

			var scopeService = this;
			var queryproperties = {};
			var service = {};
			angular.extend(service, zoomService);


			service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi189pv/:gotomethod/:id', { fields: "nr-tabpre,descricao,dt-inival,dt-fimval,mo-codigo,situacao" }, {});
			service.zoomName = $rootScope.i18n('l-tab-preco', undefined, 'dts/mpd');
			service.configuration = false;
			service.useSearchMethod = true;
			service.matches = ['nr-tabpre', 'descricao'];
			service.useCache = false;

			service.propertyFields = [
				{ label: 'l-tab-preco', property: 'nr-tabpre', type: 'stringrange', default: true },
				{ label: 'l-description', property: 'descricao', type: 'string' },
				{ label: 'l-mo-codigo', property: 'mo-codigo', type: 'integerrange' },

				{
					label: 'l-table-inactive', property: 'situation', propertyList: [
						{ id: 1, name: $rootScope.i18n('l-yes'), value: true },
						{ id: 0, name: $rootScope.i18n('l-no'), value: false }
					]
				},

				{
					label: 'l-table-out', property: 'dateTable', propertyList: [
						{ id: 1, name: $rootScope.i18n('l-yes'), value: true },
						{ id: 0, name: $rootScope.i18n('l-no'), value: false }
					]
				}

			];

			service.columnDefs = [
				{ headerName: $rootScope.i18n('l-tab-preco', undefined, 'dts/mpd'), field: 'nr-tabpre' },
				{ headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'descricao' },
				{
					headerName: $rootScope.i18n('l-dt-inival-tab-preco', undefined, 'dts/mpd'), field: 'dt-inival', valueGetter: function (param) {
						return $filter('date')(param.data['dt-inival'], 'shortDate');
					}
				},
				{
					headerName: $rootScope.i18n('l-dt-fimval-tab-preco', undefined, 'dts/mpd'), field: 'dt-fimval', valueGetter: function (param) {
						return $filter('date')(param.data['dt-fimval'], 'shortDate');
					}
				},
				{
					headerName: $rootScope.i18n('l-situacao-tab-preco', undefined, 'dts/mpd'), field: 'situacao', valueGetter: function (param) {
						if (param.data.situacao === 1) {
							return $rootScope.i18n('l-ativo', undefined, 'dts/mpd');
						} else if (param.data.situacao === 2) {
							return $rootScope.i18n('l-inativo', undefined, 'dts/mpd');
						} else if (param.data.situacao === 3) {
							return $rootScope.i18n('l-simulacao', undefined, 'dts/mpd');
						}
						return param.data.situacao;
					}
				},
				{ headerName: $rootScope.i18n('l-mo-codigo', undefined, 'dts/mpd'), field: 'mo-codigo' }
			];

			service.getObjectFromValue = function (value) {
				var itemSelected,
				queryproperties = {where: ["tb-preco.nr-tabpre = " + "'" + value + "'"]},
				getItem = function (item){
					if (item['nr-tabpre'] == value) return item;
				};

				if (value) {

					if (service.zoomResultList && service.zoomResultList.length > 0) {
						itemSelected = service.zoomResultList.filter(getItem);
					}
	
					if (itemSelected && itemSelected.length > 0) {
						return $q(function (resolve, reject) {
							resolve(itemSelected[0]);
						});
					} else {
						return $q(function (resolve, reject) {
							service.resource.TOTVSQuery(queryproperties, function (result) {
								resolve(result[0]);
							}, { noErrorMessage: true }, true);
						});
					}
	
				}
			}

			service.comparator = function (item1, item2) {
				return (item1['nr-tabpre'] === item2['nr-tabpre']);
			};

			/* Implementação para que seja feito o filtro por Tipo de Relacionamento */
			service.beforeQuery = function (parameters) {

				var strQuery;
				var iSit;

				strQuery = "";

				angular.forEach(parameters.disclaimers, function (disclaimer, key) {

					strQuery = "";

					if (disclaimer.value) {
						if (disclaimer.property != "situation" && disclaimer.property != "dateTable")
							queryproperties.property.push(disclaimer.property);

						if (disclaimer.property == "nr-tabpre" || disclaimer.property == "mo-codigo") {
							if(!disclaimer.value.start && disclaimer.value.end)
								return; 
								
							if (disclaimer.value.start == undefined || disclaimer.value.start == "") {
								disclaimer.value.start = 0;
							}

							if (disclaimer.value.end == undefined || disclaimer.value.end == "") {
								disclaimer.value.end = disclaimer.value.start;
							}
							queryproperties.value.push(disclaimer.value.start + ";" + disclaimer.value.end);
						}

						if (disclaimer.property == "descricao")
							queryproperties.value.push("*" + disclaimer.value + "*");


						if (disclaimer.property == "situation") {
							if (disclaimer.value.value == true) {
								iSit = 2;
							} else {
								iSit = 1;
							}

							if (strQuery != "") {
								strQuery = strQuery + " AND tb-preco.situacao <= " + iSit;
							} else {
								strQuery = "tb-preco.dt-inival <= TODAY AND tb-preco.dt-fimval >= TODAY AND tb-preco.situacao <= " + iSit;
							}

						};

						if (disclaimer.property == "dateTable") {

							if (iSit != 2) {
								iSit = 1;
							}

							if (disclaimer.value.value == true) {

								if (strQuery != "") {
									strQuery = strQuery + " AND tb-preco.dt-inival <= 31/12/9999 AND tb-preco.dt-fimval >= 01/01/0001 ";
								} else {
									strQuery = "tb-preco.dt-inival <= 31/12/9999 AND tb-preco.dt-fimval >= 01/01/0001 AND tb-preco.situacao <= " + iSit;
								}



							} else {

								if (strQuery != "") {
									strQuery = strQuery + " AND tb-preco.dt-inival <= TODAY AND tb-preco.dt-fimval >= TODAY";
								} else {
									strQuery = "tb-preco.dt-inival <= TODAY AND tb-preco.dt-fimval >= TODAY AND tb-preco.situacao <= " + iSit;
								}

							}

						};
					}

				});

				if (strQuery == "") {
					strQuery = "tb-preco.situacao <= 1 AND tb-preco.dt-inival <= TODAY AND tb-preco.dt-fimval >= TODAY";
				}
				queryproperties.where.push(strQuery);
			}

			service.applyFilter = function (parameters) {
				var that = this;
				var strQuery = "";
				queryproperties = { where: [], value: [], property: [] };
				queryproperties.limit = that.limitZoom;

				if (parameters.isSelectValue) {
					queryproperties.limit = that.limitSelect;
					queryproperties.where = [];
					
					strQuery += "tb-preco.situacao <= 1 AND tb-preco.dt-inival <= TODAY AND tb-preco.dt-fimval >= TODAY" +
						" and (tb-preco.nr-tabpre MATCHES ('" + parameters.selectedFilterValue + "*') OR  " +
						"tb-preco.descricao MATCHES ('*" + parameters.selectedFilterValue + "*'))";
					
					queryproperties.where.push(strQuery);
				} else {
					if (this.beforeQuery)
						this.beforeQuery(parameters);
				}

				if (parameters.more)
					queryproperties.start = this.zoomResultList.length;
				else
					that.zoomResultList = [];

				return this.resource.TOTVSQuery(queryproperties, function (result) {
					if ((!parameters.init || parameters.init.setDefaultValue) && (!parameters.selectedFilterValue)) return;

					if (result) {
						that.zoomResultList = that.zoomResultList.concat(result);
						$timeout(function () {
							if (result.length > 0) {
								that.resultTotal = result[0].$length;
							}
						}, 0);
					}
				}, { noErrorMessage: true }, false);
			}


			service.tabPrecoList = [];
			service.getTabPreco = function (value) {

				var _service = this;
				var parameters = {};
				var queryproperties = {};

				if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
					parameters.disclaimers = [];

				parameters.disclaimers.push({
					property: "nr-tabpre",
					type: "string",
					value: value
				});

				queryproperties = dtsUtils.mountQueryProperties({
					parameters: parameters,
					columnDefs: this.columnDefs,
					propertyFields: this.propertyFields
				});

				return this.resource.TOTVSQuery(queryproperties, function (result) {
					service.emitenteList = result;
				}, {
					noErrorMessage: true,
					noCount: true
				}, false);

			};

			return service;

		}

		serviceTabPrecoGridSelect.$inject = ['mpd.tb-preco-pv.zoom'];
		function serviceTabPrecoGridSelect(serviceTabPrecoPv) {
			var service = {};
			angular.extend(service, serviceTabPrecoPv);
			service.useCache = false;

			service.applyFilter = function (parameters) {
				return serviceTabPrecoPv.applyFilter(parameters).then(function (result) {
					result.unshift({
						'nr-tabpre': '',
						'descricao': '',
						'r-Rowid': undefined
					})
					return result;
				});
			};

			return service;
		}


		index.register.service('mpd.tb-preco-pv.zoom', serviceTabPrecoPv);
		index.register.service('mpd.tb-preco-pv.gridselect', serviceTabPrecoGridSelect);

	});

