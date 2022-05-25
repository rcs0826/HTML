define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgind
	# Table...: ref-item
	# Service.: serviceReferenciaZoom
	# Register: mpd.referencia.Zoom
	#################################################################################################### */

	serviceReferenciaZoom.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceReferenciaZoom($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin375/:method/:itCodigo/:id', {fields: "it-codigo,cod-refer"}),
		service.zoomName = $rootScope.i18n('l-cod-refer', undefined, 'dts/mpd');
		service.configuration = false;
				service.useSearchMethod = true;
				service.matches = ['cod-refer', 'descricao'];

		service.propertyFields = [
			  {label: 'l-cod-refer', property: 'cod-refer', type:'string', default: true},
			  {label: 'l-description', property: 'descricao', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-cod-refer', undefined, 'dts/mpd'), field: 'cod-refer'},
			{headerName: $rootScope.i18n('l-description', undefined, 'dts/mpd'), field: 'descricao', valueGetter: function(params) {
				return params.data._['descricao'];
			}}
		];

		service.getObjectFromValue =  function (value, init) {
						
			if(value === "?"){				
				return null;
			}			

			var objectReturnValue = null;

			if (value && init) {
				objectReturnValue =  this.resource.TOTVSGet({
					id: value, itCodigo: init
				}, function(data){
					data.descricao = data['_']['descricao'];
				}, {
					noErrorMessage: true
				}, false);

				return objectReturnValue;
			}
		};

		service.beforeQuery = function (queryproperties, parameters) {
			if (parameters.init) {
				queryproperties.property = queryproperties.property || [];
				queryproperties.value = queryproperties.value || [];
				queryproperties.property.push('it-codigo');
				queryproperties.value.push(parameters.init);
			}
		}


		service.afterQuery = function (queryresult, parameters) {
			angular.forEach(queryresult, function(value, key){
				value['descricao'] = value['_']['descricao'];
			});
		}

		service.comparator = function(item1, item2) {
			return (item1['it-codigo'] === item2['it-codigo'] && item1['cod-refer'] === item2['cod-refer']);
		};
	
		service.referenciaZoomList = [];
		service.getReferenciaZoom = function (value, init) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "it-codigo",
				type: "string",
				value: init
			});
			parameters.disclaimers.push({
				property: "cod-refer",
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
				service.referenciaZoomList = result;
				
			}, {
				noErrorMessage: true,
				noCount: true
			}, false);

		};

		return service;

	}
	index.register.service('mpd.referencia.Zoom', serviceReferenciaZoom);

});

