define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgcex
	# Table...: pto-contr
	# Service.: servicePtoContr
	# Register: mpd.pto-contr.zoom
	####################################################################################################*/

	servicePtoContr.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function servicePtoContr($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/cxbo/bocx110na/:method/:gotomethod/:id', {fields: "cod-pto-contr,descricao"}, {});
		service.zoomName = $rootScope.i18n('l-control-point', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod-pto-contr', 'descricao'];

		service.propertyFields = [
			  {label: $rootScope.i18n('l-code'), property: 'cod-pto-contr', type:'integerrange', default: true},
			{label: $rootScope.i18n('l-descricao'), property: 'descricao', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod-pto-contr'},
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
			return (item1['cod-pto-contr'] === item2['cod-pto-contr']);
		};

		service.ptoList = [];
		service.getPtos = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-pto-contr",
				type: "integer",
				value: value
			});

			queryproperties = dtsUtils.mountQueryProperties({
				parameters: parameters,
				columnDefs: this.columnDefs,
				propertyFields: this.propertyFields
			});

			return this.resource.TOTVSQuery(queryproperties, function (result) {
				service.ptoList = result;
			}, {
				noErrorMessage: true,
				noCount: true
			}, true);

		};
		return service;
	}
	index.register.service('mpd.pto-contr.zoom', servicePtoContr);
});
