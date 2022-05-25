define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mguni
	# Table...: estado
	# Service.: serviceEstado
	# Register: mpd.estado.zoom
	####################################################################################################*/

	serviceEstado.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceEstado($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/unbo/boun007na/:method/:gotomethod/:pais/:id', {fields: "pais,estado,no-estado"}, {});
		service.zoomName = $rootScope.i18n('l-estado', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['estado', 'no-estado','pais'];

		service.propertyFields = [
			  {label: 'l-code', property: 'estado', type:'stringrange', default: true},
			{label: 'l-estado', property: 'no-estado', type:'string'},
			{label: 'l-pais', property: 'pais', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-pais', undefined, 'dts/mpd'), field: 'pais'},
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'estado'},
			{headerName: $rootScope.i18n('l-estado', undefined, 'dts/mpd'), field: 'no-estado'}
		];

		service.getObjectFromValue =  function (value, init) {
			if (value) {
				return this.resource.TOTVSGet({
					id: value,
					pais: init
				}, undefined, {
					noErrorMessage: true
				}, true);
			}
		};

		service.beforeQuery = function (queryproperties, parameters) {
			if (parameters.init) {
				queryproperties.property = queryproperties.property || [];
				queryproperties.value = queryproperties.value || [];
				queryproperties.property.push('pais');
				queryproperties.value.push(parameters.init);
			}
		}

		service.comparator = function(item1, item2) {
			return (item1['estado'] === item2['estado'] && item1['pais'] === item2['pais']);
		};

		service.estadosList = [];
		service.getEstado = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "estado",
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
	index.register.service('mpd.estado.zoom', serviceEstado);

});
