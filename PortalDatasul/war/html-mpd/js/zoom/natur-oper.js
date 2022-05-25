define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgind
	# Table...: natur-oper
	# Service.: serviceNaturOper
	# Register: mpd.natur-oper.zoom
	####################################################################################################*/

	serviceNaturOper.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceNaturOper($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin245/:method/:gotomethod/:id', {fields: "nat-operacao,denominacao,narrativa,aliquota-icm,cd-situacao,tipo,cd-trib-icm,cd-trib-ipi,cod-cfop"}, {});
		service.zoomName = $rootScope.i18n('l-natur-oper', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['nat-operacao', 'denominacao'];

		service.propertyFields = [
			{label: 'l-natur-oper', property: 'nat-operacao', type:'stringrange', default: true},
			{label: 'l-description', property: 'denominacao', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-natur-oper', undefined, 'dts/mpd'), field: 'nat-operacao'},
			{headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'denominacao'}
		];

		service.getObjectFromValue =  function (value) {
			if (value) {
				return this.resource.TOTVSGet({
					id: value
				}, undefined, {
					noErrorMessage: true
				}, true);
			}
		};

		service.comparator = function(item1, item2) {
			return (item1['nat-operacao'] === item2['nat-operacao']);
		};

		service.naturOperList = [];
		service.getNaturOper = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "nat-operacao",
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
			}, true);

		};

		return service;

	}
	index.register.service('mpd.natur-oper.zoom', serviceNaturOper);

});
