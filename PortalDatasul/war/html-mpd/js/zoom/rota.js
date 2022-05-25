define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgdis
	# Table...: rota
	# Service.: serviceRota
	# Register: mpd.rota.zoom
	####################################################################################################*/

	serviceRota.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceRota($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi181na2/:method/:gotomethod/:id', {fields: "cod-rota,descricao"}, {});
		service.zoomName = $rootScope.i18n('l-rota', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod-rota', 'descricao'];

		service.propertyFields = [
			  {label: 'l-rota', property: 'cod-rota', type:'stringrange', default: true},
			{label: 'l-description', property: 'descricao', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-rota', undefined, 'dts/mpd'), field: 'cod-rota'},
			{headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'descricao'}
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
			return (item1['cod-rota'] === item2['cod-rota']);
		};

		service.rotaList = [];
		service.getRota = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-rota",
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
	index.register.service('mpd.rota.zoom', serviceRota);

});
