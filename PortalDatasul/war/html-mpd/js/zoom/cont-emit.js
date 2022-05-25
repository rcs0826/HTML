define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgadm
	# Table...: cont-emit
	# Service.: serviceContEmit
	# Register: mpd.cont-emit.zoom
	####################################################################################################*/

	serviceContEmit.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceContEmit($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad043na/:method/:gotomethod/:codEmit/:id', {fields: "cod-emitente,sequencia,nome,area,cargo,telefone,ramal,telefax,ramal-fax,e-mail"}, {});
		service.zoomName = $rootScope.i18n('l-contatos', undefined, 'dts/mpd');
		service.configuration = true;
		service.setConfiguration('mpd.cont-emit.zoom');
		service.useSearchMethod = true;
		service.matches = ['sequencia', 'nome'];

		service.propertyFields = [
			  {label: $rootScope.i18n('l-emitente'), property: 'cod-emitente', type:'integerrange', default: true},
			{label: $rootScope.i18n('l-contato'), property: 'nome', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-seq', undefined, 'dts/mpd'), field: 'sequencia', hide: true},
			{headerName: $rootScope.i18n('l-emitente', undefined, 'dts/mpd'), field: 'cod-emitente'},
			{headerName: $rootScope.i18n('l-issuer', undefined, 'dts/mpd'), field: 'nome'},
			{headerName: $rootScope.i18n('l-area-cont-emit', undefined, 'dts/mpd'), field: 'area'},
			{headerName: $rootScope.i18n('l-cargo-cont-emit', undefined, 'dts/mpd'), field: 'cargo'},
			{headerName: $rootScope.i18n('l-telefone-cont-emit', undefined, 'dts/mpd'), field: 'telefone'},
			{headerName: $rootScope.i18n('l-ramal', undefined, 'dts/mpd'), field: 'ramal'},
			{headerName: $rootScope.i18n('l-telefax', undefined, 'dts/mpd'), field: 'telefax'},
			{headerName: $rootScope.i18n('l-ramal', undefined, 'dts/mpd'), field: 'ramal-fax'},
			{headerName: $rootScope.i18n('l-email', undefined, 'dts/mpd'), field: 'e-mail'}
		];

		service.beforeQuery = function (queryproperties, parameters) {
			if(parameters.init) {
				queryproperties.property = queryproperties.property || [];
				queryproperties.value = queryproperties.value || [];

				if(parameters.init.filter) {
					for (var property in parameters.init.filter) {
						// Verifica se o usuário informou algum valor para a propriedade, se não, utiliza o valor padrão (init)
						if(queryproperties.property.indexOf(property) < 0) {
							queryproperties.property.push(property);
							queryproperties.value.push(parameters.init.filter[property]);
						}
					}
				}
			}
		};

		service.getObjectFromValue =  function (value, init) {
			if (value) {
				return this.resource.TOTVSGet({
					id: value,
					gotomethod: init ? init.gotomethod : undefined,
					codEmit: init ? init.codEmit : undefined
				}, undefined, {
					noErrorMessage: true
				}, true);
			}
		};

		service.comparator = function(item1, item2) {
			return (item1.sequencia === item2.sequencia && item1['cod-emitente'] === item2['cod-emitente']);
		};

		service.contEmitList = [];
		service.getContacts = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "sequencia",
				type: "integer",
				value: value
			},
			{
				property: "nome",
				type: "string",
				value: value
			});

			queryproperties = dtsUtils.mountQueryProperties({
				parameters: parameters,
				columnDefs: this.columnDefs,
				propertyFields: this.propertyFields
			});

			return this.resource.TOTVSQuery(queryproperties, function (result) {
				service.contEmitList = result;
			}, {
				noErrorMessage: true,
				noCount: true
			}, true);

		};
		return service;
	}
	index.register.service('mpd.cont-emit.zoom', serviceContEmit);
});
