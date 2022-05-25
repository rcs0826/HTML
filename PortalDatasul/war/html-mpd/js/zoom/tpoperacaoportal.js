define(['index',
	'/dts/dts-utils/js/zoom/zoom.js'], function (index) {

		/*####################################################################################################
		# Database: mgdis
		# Table...: tp-operacao
		# Service.: serviceTpOperacao
		# Register: mpd.tp-operacao.zoom
		####################################################################################################*/

		serviceTpOperacao.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service', '$q'];
		function serviceTpOperacao($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, $q) {

			var scopeService = this;

			var service = {};
			angular.extend(service, zoomService);

			service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi00897pv/:gotomethod/:id', { fields: "cdn-tip-ped,descricao" }, {});
			service.zoomName = $rootScope.i18n('l-tp-oper', undefined, 'dts/mpd');
			service.configuration = false;
			service.useSearchMethod = true;
			service.matches = ['cdn-tip-ped', 'descricao'];
			service.useCache = false;

			service.propertyFields = [
				{ label: 'l-tp-oper', property: 'cdn-tip-ped', type: 'integerrange', default: true },
				{ label: 'l-description', property: 'descricao', type: 'string' }
			];

			service.columnDefs = [
				{ headerName: $rootScope.i18n('l-tp-oper', undefined, 'dts/mpd'), field: 'cdn-tip-ped' },
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
					
					strQuery = "STRING(tip-ped-cia.cdn-tip-ped) MATCHES ('" + parameters.selectedFilterValue + "*') OR descricao MATCHES ('*" + parameters.selectedFilterValue + "*')";

					delete queryproperties.method;
					delete queryproperties.searchfields;
					queryproperties.where.push(strQuery);
				} else {
					angular.forEach(parameters.disclaimers, function (disclaimer, key) {
						if (disclaimer.value) {
							queryproperties.property.push(disclaimer.property);

							if (disclaimer.property == "cdn-tip-ped") {
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
		
			service.getObjectFromValue = function (value, init) {
				var itemSelected,
					queryproperties = {where: ["tip-ped-cia.cdn-tip-ped = INTEGER(" +  value + ")"]},
					getItem = function (item){
						if (item['cdn-tip-ped'] == value) return item;
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
				return (item1['cdn-tip-ped'] === item2['cdn-tip-ped']);
			};

			service.canalVendaList = [];
			service.getTpOperacao = function (value) {

				var _service = this;
				var parameters = {};
				var queryproperties = {};

				if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
					parameters.disclaimers = [];

				parameters.disclaimers.push({
					property: "cdn-tip-ped",
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
		index.register.service('mpd.tp-operacao.zoom', serviceTpOperacao);

	});