define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mguni
	# Table...: pais
	# Service.: servicePais
	# Register: mpd.pais.zoom
	####################################################################################################*/

	servicePais.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function servicePais($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/unbo/boun006na/:method/:gotomethod/:id', {fields: "cod-pais,nome-pais"}, {});
		service.zoomName = $rootScope.i18n('l-country', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod-pais','nome-pais'];

		service.propertyFields = [
			  {label: 'l-code', property: 'cod-pais', type:'integerrange', default: true},
			{label: 'l-pais', property: 'nome-pais', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod-pais'},
			{headerName: $rootScope.i18n('l-pais', undefined, 'dts/mpd'), field: 'nome-pais'}
		];

		service.getObjectFromValue =  function (value, init) {
			if (value) {
				return this.resource.TOTVSGet({
					id: value,
					gotomethod: init.gotomethod
				}, undefined, {
					noErrorMessage: true
				}, true);
			}
		};

		service.comparator = function(item1, item2) {
			return (item1['cod-pais'] === item2['cod-pais']);
		};

		service.paisList = [];
		service.getPais = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-pais",
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
	index.register.service('mpd.pais.zoom', servicePais);

});
