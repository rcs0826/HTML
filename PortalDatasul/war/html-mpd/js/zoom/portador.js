define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgadm
	# Table...: portador
	# Service.: servicePortador
	# Register: mpd.portador.zoom
	####################################################################################################*/

	servicePortador.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];	                           
	function servicePortador($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad209na/:method/:epCodigo/:id/:modalidade', {fields: "cod-portador,modalidade,nome,nome-abrev,cod-banco,ep-codigo"});
		service.zoomName = $rootScope.i18n('l-portador', undefined, 'dts/mpd');
		service.configuration = false;
        service.useSearchMethod = true;
		service.matches = ['cod-portador', 'nome', 'nome-abrev', 'modalidade'];

		service.propertyFields = [
			  {label: 'l-code', property: 'cod-portador', type:'integerrange', default: true},
			{label: 'l-nome', property: 'nome', type:'string'}
		];

		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod-portador'},
			{headerName: $rootScope.i18n('l-nome', undefined, 'dts/mpd'), field: 'nome'},
			{headerName: $rootScope.i18n('l-modalidade', undefined, 'dts/mpd'), field: 'modalidade'},
			{headerName: $rootScope.i18n('l-zoom-portador-modalidade-desc', undefined, 'dts/mpd'), field: 'desc-modalidade'},
			{headerName: $rootScope.i18n('l-banco', undefined, 'dts/mpd'), field: 'cod-banco'},
			{headerName: $rootScope.i18n('l-empresa', undefined, 'dts/mpd'), field: 'ep-codigo'}
		];

		service.getObjectFromValue =  function (value, init) {

			if (init == undefined) return undefined;

			if (!$rootScope.currentcompanyLoaded) return undefined;

			if(typeof value != "number"){				
				value = value.substr(0,value.indexOf(' '));
			}
			
			if (value) {
				return this.resource.TOTVSGet({
					id: value, epCodigo:$rootScope.currentcompany.companycode, modalidade: init
				}, function (data) {
					service.trataModalidade(data);
				}, {
					noErrorMessage: true
				}, true);
			}
		};

		service.trataModalidade = function (value) {
			switch (value['modalidade']) {
				case 1:
					value['desc-modalidade'] =  $rootScope.i18n('l-zoom-portador-modalidade-1');
					break;
				case 2:
					value['desc-modalidade'] =  $rootScope.i18n('l-zoom-portador-modalidade-2');
					break;
				case 3:
					value['desc-modalidade'] = $rootScope.i18n('l-zoom-portador-modalidade-3');
					break;
				case 4:
					value['desc-modalidade'] = $rootScope.i18n('l-zoom-portador-modalidade-4');
					break;
				case 5:
					value['desc-modalidade'] = $rootScope.i18n('l-zoom-portador-modalidade-5');
					break;
				case 6:
					value['desc-modalidade'] = $rootScope.i18n('l-zoom-portador-modalidade-6');
					break;
				case 7:
					value['desc-modalidade'] = $rootScope.i18n('l-zoom-portador-modalidade-7');
					break;
				case 8:
					value['desc-modalidade'] = $rootScope.i18n('l-zoom-portador-modalidade-8');
					break;
				case 9:
					value['desc-modalidade'] = $rootScope.i18n('l-zoom-portador-modalidade-9');
					break;
			}
		}

		service.comparator = function(item1, item2) {
			return (item1['cod-portador'] === item2['cod-portador'] && item1['ep-codigo'] === item2['ep-codigo'] && item1['modalidade'] === item2['modalidade']);
		};

		service.beforeQuery = function (queryproperties, parameters) {

			if (parameters.init) {
				queryproperties.property = queryproperties.property || [];
				queryproperties.value = queryproperties.value || [];
				queryproperties.property.push('ep-codigo');
				queryproperties.value.push($rootScope.currentcompany.companycode);
				queryproperties.property.push('modalidade');
				queryproperties.value.push(parameters.init);
			}
			
		}

		service.afterQuery = function (queryresult, parameters) {
			angular.forEach(queryresult, function(value, key){
				service.trataModalidade(value);
			});
		}

		service.portadorList = [];
		service.getPortador = function (value) {

			var _service = this;
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "cod-portador",
				type: "integer",
				value: value
			});

			parameters.disclaimers.push({
				property: "ep-codigo",
				type: "string",
				value: '10'
			});

			parameters.disclaimers.push({
				property: "modalidade",
				type: "integer",
				value: 1
			});

			queryproperties = dtsUtils.mountQueryProperties({
				parameters: parameters,
				columnDefs: this.columnDefs,
				propertyFields: this.propertyFields				
			});

			

			return this.resource.TOTVSQuery(beforeQuery, function (result) {
				service.emitenteList = result;
			}, {
				noErrorMessage: true,
				noCount: true
			}, true);

		};

		return service;

	}
	index.register.service('mpd.portador.zoom', servicePortador);

});
