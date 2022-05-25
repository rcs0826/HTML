define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgdis
	# Table...: loc-entr
	# Service.: serviceLocEntr
	# Register: mpd.loc-entr.zoom
	####################################################################################################*/

	serviceLocEntr.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceLocEntr($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi102na/:method/:gotomethod/:nomeAbrev/:id', {fields: "cod-entrega,endereco,bairro,cidade,estado,cep,caixa-postal"}, {});
		service.zoomName = $rootScope.i18n('l-local-entrega', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod-entrega'];

		service.propertyFields = [
			  {label: 'l-code', property: 'cod-entrega', type:'stringrange', default: true},
			{label: 'l-endereco', property: 'endereco', type:'string'},
			{label: 'l-bairro', property: 'bairro', type:'string'},
			{label: 'l-cidade',property: 'cidade', type:'string'},
			{label: 'l-estado',property: 'estado', type:'string'},
			{label: 'l-cep',property: 'cep', type:'string'},
			{label: 'l-caixa-postal',property: 'caixa-postal', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod-entrega'},
			{headerName: $rootScope.i18n('l-endereco', undefined, 'dts/mpd'), field: 'endereco'},
			{headerName: $rootScope.i18n('l-bairro', undefined, 'dts/mpd'), field: 'bairro'},
			{headerName: $rootScope.i18n('l-cidade', undefined, 'dts/mpd'), field: 'cidade'},
			{headerName: $rootScope.i18n('l-estado', undefined, 'dts/mpd'), field: 'estado'},
			{headerName: $rootScope.i18n('l-cep', undefined, 'dts/mpd'), field: 'cep'},
			{headerName: $rootScope.i18n('l-caixa-postal', undefined, 'dts/mpd'), field: 'caixa-postal'}
		];

		service.getObjectFromValue =  function (value, init) {
			if (value) {
				return this.resource.TOTVSGet({
					id: value,
					nomeAbrev: init
				}, undefined, {
					noErrorMessage: true
				}, true);
			}
		};

		service.beforeQuery = function (queryproperties, parameters) {
			if (parameters.init) {
				queryproperties.property = queryproperties.property || [];
				queryproperties.value = queryproperties.value || [];
				queryproperties.property.push('nome-abrev');
				queryproperties.value.push(parameters.init);
			}
		}

		service.comparator = function(item1, item2) {
			return (item1['cod-entrega'] === item2['cod-entrega'] && item1['nome-abrev'] === item2['nome-abrev']);
		};

		service.locEntrList = [];
		service.getLocEntr = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-entrega",
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

	serviceLocEntrGridSelect.$inject = ['mpd.loc-entr.zoom'];
	function serviceLocEntrGridSelect(serviceLocEntr) {
		var service = {};
		angular.extend(service, serviceLocEntr);

		service.applyFilter = function(parameters) {
			return serviceLocEntr.applyFilter(parameters).then(function (result) {
				result.unshift({
					'cod-entrega': '',
					'r-Rowid': undefined
				})
				return result;
			});
		};
		

		return service;		
	}
	
	index.register.service('mpd.loc-entr.zoom', serviceLocEntr);
	index.register.service('mpd.loc-entr.gridselect', serviceLocEntrGridSelect);

});

