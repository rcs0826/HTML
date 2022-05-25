define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgadm
	# Table...: mensagem
	# Service.: serviceMensagem
	# Register: mpd.mensagem.zoom
	####################################################################################################*/

	serviceMensagem.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceMensagem($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad176na/:method/:gotomethod/:id', {fields: "cod-mensagem,descricao"}, {});
		service.zoomName = $rootScope.i18n('l-mensagem', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod-mensagem', 'descricao'];

		service.propertyFields = [
            {label: $rootScope.i18n('l-mensagem', undefined, 'dts/mpd'), property: 'cod-mensagem', type:'integerrange', default: true},
			{label: 'l-description', property: 'descricao', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-mensagem', undefined, 'dts/mpd'), field: 'cod-mensagem'},
			{headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'descricao'}
		];
		
		service.columnDefsComplete = angular.copy(service.columnDefs);
		service.columnDefsComplete.push({headerName: $rootScope.i18n('l-text', undefined, 'dts/mcc'), field: 'texto-mensag'})

		service.getObjectFromValue =  function (value) {
			if (value !== undefined) {
				return this.resource.TOTVSGet({
					id: value
				}, undefined, {
					noErrorMessage: true
				}, true);
			}
		};

		service.comparator = function(item1, item2) {
			return (item1['cod-mensagem'] === item2['cod-mensagem']);
		};

		service.mensagemList = [];
		service.getMensagem = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-mensagem",
				type: "integer",
				value: value
			});

			queryproperties = dtsUtils.mountQueryProperties({
				parameters: parameters,
				columnDefs: this.columnDefsComplete,
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
	index.register.service('mpd.mensagem.zoom', serviceMensagem);

});
