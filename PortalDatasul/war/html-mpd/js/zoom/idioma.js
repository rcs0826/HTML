define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: emsfnd
	# Table...: idioma
	# Service.: serviceIdioma
	# Register: mpd.idioma.zoom
	####################################################################################################*/

	serviceIdioma.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceIdioma($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {
		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/fnbo/bofn167a/:method/:gotomethod/:id', {fields: "cod_idioma,des_idioma"}, {});
		service.zoomName = $rootScope.i18n('l-languages', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod_idioma', 'des_idioma'];

		service.propertyFields = [
			  {label: $rootScope.i18n('l-code'), property: 'cod_idioma', type:'stringrange', default: true, maxlength: 12},
			{label: $rootScope.i18n('l-descricao'), property: 'des_idioma', type:'string', maxlength: 20}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod_idioma'},
			{headerName: $rootScope.i18n('l-descricao', undefined, 'dts/mpd'), field: 'des_idioma'}
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
			return (item1.cod_idioma === item2.cod_idioma);
		};

		service.idiomaList = [];
		service.getIdioma = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod_idioma",
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

	index.register.service('mpd.idioma.zoom', serviceIdioma);
});
