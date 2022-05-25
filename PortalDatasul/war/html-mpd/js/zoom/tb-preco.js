define(['index',
	'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*#####################################################################################################
	 # Database: mgdis
	 # Table...: tab-preco
	 # Service.: serviceTabPreco
	 # Register: mpd.tb-preco.zoom
	 #####################################################################################################*/

	serviceTabPreco.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceTabPreco($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi189se/:method/:gotomethod/:id', {fields: "nr-tabpre,descricao,dt-inival,dt-fimval,mo-codigo,situacao"}, {});
		service.zoomName = $rootScope.i18n('l-tab-preco', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['nr-tabpre', 'descricao'];

		service.propertyFields = [
			{label: 'l-tab-preco', property: 'nr-tabpre', type: 'stringrange', default: true},
			{label: 'l-description', property: 'descricao', type: 'string'},
			{label: 'l-mo-codigo', property: 'mo-codigo', type: 'integerrange'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-tab-preco', undefined, 'dts/mpd'), field: 'nr-tabpre'},
			{headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'descricao'},
			{headerName: $rootScope.i18n('l-dt-inival-tab-preco', undefined, 'dts/mpd'), field: 'dt-inival', valueGetter: function(param) {
					return $filter('date')(param.data['dt-inival'], 'shortDate');
				}},
			{headerName: $rootScope.i18n('l-dt-fimval-tab-preco', undefined, 'dts/mpd'), field: 'dt-fimval', valueGetter: function(param) {
					return $filter('date')(param.data['dt-fimval'], 'shortDate');
				}},
			{headerName: $rootScope.i18n('l-situacao-tab-preco', undefined, 'dts/mpd'), field: 'situacao', valueGetter: function(param) {
					if (param.data.situacao === 1) {
						return $rootScope.i18n('l-ativo', undefined, 'dts/mpd');
					} else if (param.data.situacao === 2) {
						return $rootScope.i18n('l-inativo', undefined, 'dts/mpd');
					} else if (param.data.situacao === 3) {
						return $rootScope.i18n('l-simulacao', undefined, 'dts/mpd');
					}
					return param.data.situacao;
				}},
			{headerName: $rootScope.i18n('l-mo-codigo', undefined, 'dts/mpd'), field: 'mo-codigo'}
		];

		service.getObjectFromValue = function(value) {
			if (value) {
				return this.resource.TOTVSGet({
					id: value
				}, undefined, {
					noErrorMessage: true
				}, true);
			}
		};

		service.comparator = function(item1, item2) {
			return (item1['nr-tabpre'] === item2['nr-tabpre']);
		};

		service.tabPrecoList = [];
		service.getTabPreco = function(value) {

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

			return this.resource.TOTVSQuery(queryproperties, function(result) {
				service.emitenteList = result;
			}, {
				noErrorMessage: true,
				noCount: true
			}, true);

		};

		return service;

	}
	index.register.service('mpd.tb-preco.zoom', serviceTabPreco);

});
