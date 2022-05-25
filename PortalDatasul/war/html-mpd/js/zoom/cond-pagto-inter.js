define(['index',
		'/dts/dts-utils/js/zoom/zoom.js',
		'/dts/mpd/js/api/fchdisdbo.js'], function(index) {

	/*####################################################################################################
	# Database: mgadm
	# Table...: cond-pagto
	# Service.: serviceCondPagto
	# Register: mpd.cond-pagto-inter.zoom
	####################################################################################################*/

	serviceCondPagto.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service', 'mpd.fchdisdbo.Factory'];
	function serviceCondPagto($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, fchdisdbo) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);
		
		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad039zoom/:method/:gotomethod/:id', {fields: "cod-cond-pag,descricao,log-cond-pagto-mais-negoc"}, {});
		service.zoomName = $rootScope.i18n('l-condicao-pagamento', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod-cond-pag', 'descricao'];
		
		service.propertyFields = [
			{label: 'l-condicao-pagamento', property: 'cod-cond-pag', type:'integerrange', default: true},
			{label: 'l-description', property: 'descricao', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-condicao-pagamento', undefined, 'dts/mpd'), field: 'cod-cond-pag'},
			{headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'descricao'}
		];
		
		
		fchdisdbo.boad039_ReturnActiveMaisNegocios({}, function (result) {
			
			if (result['p-active-mais-negocios'] === true) {
				service.propertyFields.push(
					{label: $rootScope.i18n('l-more-business', undefined, 'dts/mpd'), property: 'log-cond-pagto-mais-negoc', propertyList: [
						{value: 'true', name: $rootScope.i18n('l-yes', undefined, 'dts/mpd')},
						{value: 'false', name: $rootScope.i18n('l-no', undefined, 'dts/mpd')}
					]}
				);
				
				service.columnDefs.push(
					{headerName: $rootScope.i18n('l-more-business', undefined, 'dts/mpd'), field: 'log-cond-pagto-mais-negoc', valueGetter: function(param) {
						if(param.data['log-cond-pagto-mais-negoc'] === true) {
							return $rootScope.i18n('l-yes', undefined, 'dts/mpd');
						} else if(param.data['log-cond-pagto-mais-negoc'] === false) {
							return $rootScope.i18n('l-no', undefined, 'dts/mpd');
						}
					}}
				);
			}
		});

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
			return (item1['cod-cond-pag'] === item2['cod-cond-pag']);
		};

		service.condPagtoList = [];
		service.getCondPagto = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-cond-pag",
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
	index.register.service('mpd.cond-pagto-inter.zoom', serviceCondPagto);

});
