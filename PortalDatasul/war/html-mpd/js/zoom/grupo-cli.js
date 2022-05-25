define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgind
	# Table...: gr-cli
	# Service.: serviceGrupoClienteZoom
	# Register: mpd.gr-cli.zoom
	####################################################################################################*/

	serviceGrupoClienteZoom.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceGrupoClienteZoom($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad129a/:method/:id', {}, {});
		service.zoomName = $rootScope.i18n('l-customer-group', undefined, 'dts/mpd');
		service.configuration = false;

		service.propertyFields = [
            {label: $rootScope.i18n('l-customer-group', undefined, 'dts/mpd'), property: 'cod-gr-cli', type:'integerrange', default: true},
			{label: $rootScope.i18n('l-description', undefined, 'dts/mpd') , property: 'descricao', type:'string'},
			{label: $rootScope.i18n('l-category', undefined, 'dts/mpd') , property: 'categoria', type:'stringrange'},
			{label: $rootScope.i18n('l-portador', undefined, 'dts/mpd') , property: 'portador', type:'integerrange'},
			{label: $rootScope.i18n('l-pay-cond', undefined, 'dts/mpd') , property: 'cod-cond-pag', type:'integerrange'},
			{label: $rootScope.i18n('l-default-carrier', undefined, 'dts/mpd') , property: 'cod-transp', type:'integerrange'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-cod-gr-cli', undefined, 'dts/mpd'), field: 'cod-gr-cli'},
			{headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'descricao'},
			{headerName: $rootScope.i18n('l-categoria', undefined, 'dts/mpd'), field: 'categoria'},
			{headerName: $rootScope.i18n('l-portador', undefined, 'dts/mpd'), field: 'portador'},
			{headerName: $rootScope.i18n('l-cdn-cond-pag', undefined, 'dts/mpd'), field: 'cod-cond-pag'},
			{headerName: $rootScope.i18n('l-transportador', undefined, 'dts/mpd'), field: 'cod-transp'}		
		];

		service.getObjectFromValue =  function (value) {
			return this.resource.TOTVSGet({
				id: value
			}, undefined, {
				noErrorMessage: true
			}, true);
		};

		service.comparator = function(item1, item2) {
			return (item1['cod-gr-cli'] === item2['cod-gr-cli']);
		};

		service.groupList = [];
		service.getGroup = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-gr-cli",
				type: "integer",
				value: value
			});

			queryproperties = dtsUtils.mountQueryProperties({
				parameters: parameters,
				columnDefs: this.columnDefs,
				propertyFields: this.propertyFields
			});

			return this.resource.TOTVSQuery(queryproperties, function (result) {
				service.groupList = result;
			}, {
				noErrorMessage: true,
				noCount: true
			}, true);

		};

		return service;

	}
	index.register.service('mpd.grupo-cli.zoom', serviceGrupoClienteZoom);

});
