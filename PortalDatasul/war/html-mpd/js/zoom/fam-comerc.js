define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgdis
	# Table...: fam-comerc
	# Service.: serviceFamComerc
	# Register: mpd.fam-comerc.zoom
	####################################################################################################*/

	serviceFamComerc.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceFamComerc($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi050na/:method/:gotomethod/:id', {fields: "fm-cod-com,descricao"}, {});
		service.zoomName = $rootScope.i18n('l-fm-cod-com', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['fm-cod-com', 'descricao'];

		service.propertyFields = [
			  {label: $rootScope.i18n('l-code', undefined, 'dts/mpd'), property: 'fm-cod-com', type:'stringrange', default: true},
			{label: $rootScope.i18n('l-descricao', undefined, 'dts/mpd'), property: 'descricao', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'fm-cod-com'},
			{headerName: $rootScope.i18n('l-descricao', undefined, 'dts/mpd'), field: 'descricao'},
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
			return (item1['fm-cod-com'] === item2['fm-cod-com']);
		};

		service.despList = [];
		service.getDespesa = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "fm-cod-com",
				type: "string",
				value: value
			});

			queryproperties = dtsUtils.mountQueryProperties({
				parameters: parameters,
				columnDefs: this.columnDefs,
				propertyFields: this.propertyFields
			});

			return this.resource.TOTVSQuery(queryproperties, function (result) {
				service.despList = result;
			}, {
				noErrorMessage: true,
				noCount: true
			}, true);

		};
		return service;
	}
	index.register.service('mpd.fam-comerc.zoom', serviceFamComerc);
});
