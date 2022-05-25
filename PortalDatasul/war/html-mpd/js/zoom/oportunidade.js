define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mdtcrm
	# Table...: oportunidade
	# Service.: serviceOportunidade
	# Register: mpd.oportunidade.zoom
	####################################################################################################*/

	serviceOportunidade.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceOportunidade($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/crmbo/boCrmOportunVda/:method/:gotomethod/:id', {fields: "num_id,des_oportun_vda"}, {});
		service.zoomName = $rootScope.i18n('l-campanha-crm', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['num_id', 'des_oportun_vda'];

		service.propertyFields = [
			  {label: 'l-code', property: 'num_id', type:'integerrange', default: true},
			{label: 'l-oportun-vda', property: 'des_oportun_vda', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'num_id'},
			{headerName: $rootScope.i18n('l-oportun-vda', undefined, 'dts/mpd'), field: 'des_oportun_vda'}
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

		service.getOportunidade = function (value) {

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
	index.register.service('mpd.oportunidade.zoom', serviceOportunidade);

});
