define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	serviceEstado.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceEstado($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {
		
		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/fnbo/bofn068/:method/:gotomethod/:id', {fields: "cod_prog_dtsul,des_prog_dtsul"}, {});
		service.zoomName = $rootScope.i18n('l-program', undefined, 'dts/mft');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod_prog_dtsul,des_prog_dtsul'];

		service.propertyFields = [
			{label: 'l-code', property: 'cod_prog_dtsul', type:'stringrange', default: true}			
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-program', undefined, 'dts/mft'), field: 'cod_prog_dtsul'},
			{headerName: $rootScope.i18n('l-desc', undefined, 'dts/mft'), field: 'des_prog_dtsul'}
		];

		service.getObjectFromValue = function (value) {
			if (value === "" || value === undefined || value === null) return;
			return this.resource.TOTVSGet({id: value}, undefined , {noErrorMessage: true},true);
		},

		service.beforeQuery = function (queryproperties, parameters) {
			if (parameters.init) {
				queryproperties.property = queryproperties.property || [];
				queryproperties.value = queryproperties.value || [];
				queryproperties.property.push('cod_prog_dtsul');
				queryproperties.value.push(parameters.init);
			}
		}

		service.comparator = function(item1, item2) {
			return (item1['cod_prog_dtsul'] === item2['cod_prog_dtsul']);
		};

		service.estadosList = [];
		service.getEstado = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod_prog_dtsul",
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
	index.register.service('mft.programa.zoom', serviceEstado);

});
