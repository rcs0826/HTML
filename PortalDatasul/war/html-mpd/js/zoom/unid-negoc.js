define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgind
	# Table...: unid-negoc
	# Service.: serviceUnidNegoc
	# Register: mpd.unid-negoc.zoom
	####################################################################################################*/

	serviceUnidNegoc.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceUnidNegoc($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin745/:method/:gotomethod/:id', {fields: "cod-unid-negoc,des-unid-negoc"}, {});
		service.zoomName = $rootScope.i18n('l-unid-negoc', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod-unid-negoc','des-unid-negoc'];

		service.propertyFields = [
			  {label: 'l-code', property: 'cod-unid-negoc', type:'stringrange', default: true},
			{label: 'l-description', property: 'des-unid-negoc', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod-unid-negoc'},
			{headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'des-unid-negoc'}
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
			return (item1['cod-unid-negoc'] === item2['cod-unid-negoc']);
		};

		service.rotaList = [];
		service.getRota = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-unid-negoc",
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
	index.register.service('mpd.unid-negoc.zoom', serviceUnidNegoc);

});
