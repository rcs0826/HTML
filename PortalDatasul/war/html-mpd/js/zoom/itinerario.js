define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgcex
	# Table...: itinerario
	# Service.: serviceItinerario
	# Register: mpd.itinerario.zoom
	####################################################################################################*/

	serviceItinerario.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceItinerario($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/cxbo/bocx115na/:method/:gotomethod/:id', {fields: "cod-itiner,descricao"}, {});
		service.zoomName = $rootScope.i18n('l-itineraries', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod-itiner', 'descricao'];

		service.propertyFields = [
			  {label: $rootScope.i18n('l-code'), property: 'cod-itiner', type:'integerrange', default: true},
			{label: $rootScope.i18n('l-descricao'), property: 'descricao', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod-itiner'},
			{headerName: $rootScope.i18n('l-descricao', undefined, 'dts/mpd'), field: 'descricao'},
			{headerName: $rootScope.i18n('l-dispatch', undefined, 'dts/mpd'), field: 'pto-despacho'},
			{headerName: $rootScope.i18n('l-shipment', undefined, 'dts/mpd'), field: 'pto-embarque'},
			{headerName: $rootScope.i18n('l-unloading', undefined, 'dts/mpd'), field: 'pto-desembarque'},
			{headerName: $rootScope.i18n('l-arrival', undefined, 'dts/mpd'), field: 'pto-chegada'}
		];

		service.getObjectFromValue =  function (value, init) {
			if (value) {
				return this.resource.TOTVSGet({
					id: value,
					gotomethod: init ? init.gotomethod : undefined
				}, undefined, {
					noErrorMessage: true
				}, true);
			}
		};

		service.comparator = function(item1, item2) {
			return (item1['cod-itiner'] === item2['cod-itiner']);
		};

		service.itinerList = [];
		service.getItinerario = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-itiner",
				type: "integer",
				value: value
			});

			queryproperties = dtsUtils.mountQueryProperties({
				parameters: parameters,
				columnDefs: this.columnDefs,
				propertyFields: this.propertyFields
			});

			return this.resource.TOTVSQuery(queryproperties, function (result) {
				service.itinerList = result;
			}, {
				noErrorMessage: true,
				noCount: true
			}, true);

		};
		return service;
	}
	index.register.service('mpd.itinerario.zoom', serviceItinerario);
});
