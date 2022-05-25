define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgadm
	# Table...: transporte
	# Service.: serviceTransporte
	# Register: mpd.transporte.zoom
	####################################################################################################*/

	serviceTransporte.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceTransporte($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad268na/:method/:gotomethod/:id', {fields: "cod-transp,nome,nome-abrev,cgc"}, {});
		service.zoomName = $rootScope.i18n('l-transportador', undefined, 'dts/mpd');
        service.configuration = true;
        service.setConfiguration('mpd.transporte.zoom');
		service.useSearchMethod = true;
		service.matches = ['cod-transp','nome','nome-abrev'];

		service.propertyFields = [
          	{label: $rootScope.i18n('l-code', undefined, 'dts/mpd'), property: 'cod-transp', type:'integerrange'},
            {label: $rootScope.i18n('l-transportador', undefined, 'dts/mpd'), property: 'nome-abrev', type:'string', default: true},
            {label: $rootScope.i18n('l-nome', undefined, 'dts/mpd'), property: 'nome', type:'string'},
            {label: $rootScope.i18n('l-cgc-zoom', undefined, 'dts/mpd'), property: 'cgc', type:'string'},
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod-transp'},
			{headerName: $rootScope.i18n('l-transportador', undefined, 'dts/mpd'), field: 'nome-abrev'},
			{headerName: $rootScope.i18n('l-nome', undefined, 'dts/mpd'), field: 'nome'},
			{headerName: $rootScope.i18n('l-cgc-zoom', undefined, 'dts/mpd'), field: 'cgc'}
		];

		service.getObjectFromValue =  function (value, init) {
            if (value !== undefined && value !== null && value !== "") {
				return this.resource.TOTVSGet({
					id: value,
                    gotomethod: init ? init.gotomethod : undefined
				}, undefined, {
					noErrorMessage: true
				}, true);
			}
		};

		service.comparator = function(item1, item2) {
			return (item1['cod-transp'] === item2['cod-transp']);
		};

		service.transporteList = [];
		service.getTransporte = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-transp",
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
	index.register.service('mpd.transporte.zoom', serviceTransporte);

});

