define(['index',
	'/dts/dts-utils/js/zoom/zoom.js'], function (index) {

		/*####################################################################################################
		# Database: mgdis
		# Table...: canal-venda
		# Service.: serviceCanalVenda
		# Register: mpd.canal-venda.zoom
		####################################################################################################*/

		serviceCanalVenda.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service', '$q'];
		function serviceCanalVenda($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, $q) {

			var scopeService = this;

			var service = {};
			angular.extend(service, zoomService);

			service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi232pv/:gotomethod/:id', { fields: "cod-canal-venda,descricao" }, {});
			service.zoomName = $rootScope.i18n('l-canal-venda', undefined, 'dts/mpd');
			service.configuration = false;
			service.useSearchMethod = true;
			service.matches = ['cod-canal-venda', 'descricao'];

			service.propertyFields = [
				{ label: 'l-canal-venda', property: 'cod-canal-venda', type: 'integerrange', default: true },
				{ label: 'l-description', property: 'descricao', type: 'string' }
			];

			service.columnDefs = [
				{ headerName: $rootScope.i18n('l-canal-venda', undefined, 'dts/mpd'), field: 'cod-canal-venda' },
				{ headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'descricao' }
			];

			service.applyFilter = function (parameters) {
				var that = this;
				var strQuery = "";

				var queryproperties = {};
				queryproperties.property = [];
				queryproperties.value = [];

				queryproperties.limit = that.limitZoom;

				if (parameters.isSelectValue) {
					queryproperties.where = [];

					strQuery += "STRING(canal-venda.cod-canal-venda) MATCHES ('" + parameters.selectedFilterValue + "*') OR canal-venda.descricao MATCHES ('*" + parameters.selectedFilterValue + "*')";

					delete queryproperties.method;
					delete queryproperties.searchfields;
					queryproperties.where.push(strQuery);
				} else {
					angular.forEach(parameters.disclaimers, function (disclaimer, key) {
						if (disclaimer.value) {
							queryproperties.property.push(disclaimer.property);

							if (disclaimer.property == "cod-canal-venda") {
								if (disclaimer.value.start == undefined || disclaimer.value.start == "") {
									disclaimer.value.start = 0;
								}

								if (disclaimer.value.end == undefined || disclaimer.value.end == "") {
									disclaimer.value.end = disclaimer.value.start;
								}
								queryproperties.value.push(disclaimer.value.start + ";" + disclaimer.value.end);
							}

							if (disclaimer.property == "descricao") {
								queryproperties.value.push("*" + disclaimer.value + "*");
							}

						}
					});
				}

				if (parameters.more)
					queryproperties.start = this.zoomResultList.length;
				else
					that.zoomResultList = [];

				return this.resource.TOTVSQuery(queryproperties, function (result) {
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

			service.getObjectFromValue = function (value) {
				var itemSelected,
				queryproperties = {where: ["canal-venda.cod-canal-venda = INTEGER(" + value + ")" ]},
				getItem = function (item){
					if (item['cod-canal-venda'] == value) return item;
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
				
			};


			service.comparator = function (item1, item2) {
				return (item1['cod-canal-venda'] === item2['cod-canal-venda']);
			};

			service.canalVendaList = [];
			service.getCanalVenda = function (value) {

				var _service = this;
				var parameters = {};
				var queryproperties = {};

				if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
					parameters.disclaimers = [];

				parameters.disclaimers.push({
					property: "cod-canal-venda",
					type: "integer",
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
				}, true);

			};

			return service;

		}
		index.register.service('mpd.canal-venda.zoom', serviceCanalVenda);

	});
