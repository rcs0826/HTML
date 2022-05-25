define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mdtcrm
	# Table...: campanha
	# Service.: serviceCampanha
	# Register: mpd.campanha.zoom
	####################################################################################################*/

	serviceCampanha.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceCampanha($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/crmbo/boCrmCampanha/:method/:gotomethod/:id', {fields: "num_id,nom_campanha,dat_inic,dat_term"}, {});
		service.zoomName = $rootScope.i18n('l-campanha-crm', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['num_id', 'nom_campanha'];

		service.propertyFields = [
			  {label: 'l-code', property: 'num_id', type:'integerrange', default: true},
			{label: 'l-campanha-crm', property: 'nom_campanha', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'num_id'},
			{headerName: $rootScope.i18n('l-campanha-crm', undefined, 'dts/mpd'), field: 'nom_campanha'},
			{headerName: $rootScope.i18n('l-dat-inic', undefined, 'dts/mpd'), field: 'dat_inic'},
			{headerName: $rootScope.i18n('l-dat-term', undefined, 'dts/mpd'), field: 'dat_term'},
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
			return (item1['num_id'] === item2['num_id']);
		};

		service.getCampanha = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "num_id",
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
	index.register.service('mpd.campanha.zoom', serviceCampanha);

});
