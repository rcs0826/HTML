define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgcex
	# Table...: inco-cx
	# Service.: serviceIncoterm
	# Register: mpd.inco-cx.zoom
	####################################################################################################*/

	serviceIncoterm.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceIncoterm($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/cxbo/bocx025na/:method/:gotomethod/:id', {fields: "cod-incoterm,descricao"}, {});
		service.zoomName = $rootScope.i18n('l-incoterm', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod-incoterm','descricao'];

		service.propertyFields = [
			  {label: $rootScope.i18n('l-code'), property: 'cod-incoterm', type:'stringrange', default: true, maxlength: 3},
			{label: $rootScope.i18n('l-descricao'), property: 'descricao', type:'string', maxlength: 30}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod-incoterm'},
			{headerName: $rootScope.i18n('l-descricao', undefined, 'dts/mpd'), field: 'descricao'}
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
			return (item1['cod-incoterm'] === item2['cod-incoterm']);
		};

		service.incotermList = [];
		service.getIncoterm = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-incoterm",
				type: "integer",
				value: value
			});

			queryproperties = dtsUtils.mountQueryProperties({
				parameters: parameters,
				columnDefs: this.columnDefs,
				propertyFields: this.propertyFields
			});

			return this.resource.TOTVSQuery(queryproperties, function (result) {
				service.incotermList = result;
			}, {
				noErrorMessage: true,
				noCount: true
			}, true);

		};
		return service;
	}
	index.register.service('mpd.inco-cx.zoom', serviceIncoterm);
});
