define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgdis
	# Table...: tab-codser
	# Service.: serviceTabCodser
	# Register: mpd.tab-codser.zoom
	####################################################################################################*/

	serviceTabCodser.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceTabCodser($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi185md/:method/:gotomethod/:id', {fields: "cod-servico,descricao"}, {});
		service.zoomName = $rootScope.i18n('l-tab-codser', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod-servico','descricao'];

		service.propertyFields = [
			  {label: 'l-tab-codser', property: 'cod-servico', type:'integerrange', default: true},
			{label: 'l-description', property: 'descricao', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-tab-codser', undefined, 'dts/mpd'), field: 'cod-servico'},
			{headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'descricao'}
		];

		service.getObjectFromValue =  function (value) {
			if (value) {
				return this.resource.TOTVSGet({
					id: value
				}, undefined, {
					noErrorMessage: true
				}, true);
			}
		};

		service.comparator = function(item1, item2) {
			return (item1['cod-servico'] === item2['cod-servico']);
		};

		service.tabCodserList = [];
		service.getTabCodser = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-servico",
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
	index.register.service('mpd.tab-codser.zoom', serviceTabCodser);

});
