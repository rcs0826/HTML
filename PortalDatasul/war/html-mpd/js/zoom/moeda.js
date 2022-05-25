define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mguni
	# Table...: moeda
	# Service.: serviceMoeda
	# Register: mpd.moeda.zoom
	####################################################################################################*/

	serviceMoeda.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceMoeda($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/unbo/boun005na/:method/:gotomethod/:id', {fields: "mo-codigo,descricao,sigla,cod-decex"}, {});
		service.zoomName = $rootScope.i18n('l-moeda', undefined, 'dts/mpd');
		service.configuration = true;
        service.setConfiguration('mpd.moeda.zoom');
		service.useSearchMethod = true;
		service.matches = ['mo-codigo', 'descricao'];

		service.propertyFields = [
          	{label: $rootScope.i18n('l-moeda', undefined, 'dts/mpd'), property: 'mo-codigo', type:'integerrange', default: true},
            {label: $rootScope.i18n('l-description', undefined, 'dts/mpd'), property: 'descricao', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'mo-codigo'},
			{headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'descricao'},
			{headerName: $rootScope.i18n('l-initials', undefined, 'dts/mpd'), field: 'sigla'},
			{headerName: $rootScope.i18n('l-decex', undefined, 'dts/mpd'), field: 'cod-decex'}
		];

		service.getObjectFromValue =  function (value) {
			if (value !== undefined) {
				return this.resource.TOTVSGet({
					id: value
				}, undefined, {
					noErrorMessage: true
				}, false);
			}
		};

		service.comparator = function(item1, item2) {
			return (item1['mo-codigo'] === item2['mo-codigo']);
		};

		service.moedaList = [];
		service.getMoeda = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "mo-codigo",
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
	index.register.service('mpd.moeda.zoom', serviceMoeda);

});
