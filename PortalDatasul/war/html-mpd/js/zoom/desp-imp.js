define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgcex
	# Table...: desp-imp
	# Service.: serviceDespImp
	# Register: mpd.desp-imp.zoom
	####################################################################################################*/

	serviceDespImp.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceDespImp($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/cxbo/bocx095d/:method/:gotomethod/:id', {fields: "cod-desp,descricao"}, {});
		service.zoomName = $rootScope.i18n('l-expenses-taxes', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod-desp', 'descricao'];

		service.propertyFields = [
			  {label: $rootScope.i18n('l-code'), property: 'cod-desp', type:'integerrange', default: true},
			{label: $rootScope.i18n('l-descricao'), property: 'descricao', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod-desp'},
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
			return (item1['cod-desp'] === item2['cod-desp']);
		};

		service.despList = [];
		service.getDespesa = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-desp",
				type: "integer",
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
	index.register.service('mpd.desp-imp.zoom', serviceDespImp);
});
