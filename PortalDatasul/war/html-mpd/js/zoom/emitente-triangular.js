define(['index',
		'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	serviceEmitenteTriangular.$inject = [
		'$timeout',
		'$totvsresource',
		'$rootScope',
		'dts-utils.zoom',
		'dts-utils.utils.Service',
		'$q'
	];
	function serviceEmitenteTriangular(
		$timeout,
		$totvsresource,
		$rootScope,
		zoomService,
		dtsUtils,
		$q
	) {
		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad098f/:id', {}, {});
		service.zoomName = $rootScope.i18n('l-emitente', undefined, 'dts/mpd');
		service.configuration = true;
        service.setConfiguration('mpd.emitenteTriangular.zoom');
		service.useSearchMethod = true;
		service.matches = ['cod-emitente', 'nome-abrev', 'cgc', 'nome-emit'];

		service.propertyFields = [
          	{label: $rootScope.i18n('l-code', undefined, 'dts/mpd'), property: 'cod-emitente', type:'integerrange'},
            {label: $rootScope.i18n('l-short-name', undefined, 'dts/mpd'), property: 'nome-abrev', type:'string', default: true},
            {label: $rootScope.i18n('l-cgc', undefined, 'dts/mpd'), property: 'cgc', type:'string'},
            {label: $rootScope.i18n('l-emitente', undefined, 'dts/mpd'), property: 'nome-emit', type:'string'},
            {label: $rootScope.i18n('l-customer-group', undefined, 'dts/mpd'), property: 'cod-gr-cli', type:'integerrange'},
            {label: $rootScope.i18n('l-matriz', undefined, 'dts/mpd'), property: 'nome-matriz', type:'string'},
            {label: $rootScope.i18n('l-provider-group', undefined, 'dts/mpd'), property: 'cod-gr-forn', type:'integerrange'},
            {label: $rootScope.i18n('l-identification', undefined, 'dts/mpd'), property: 'identific', type:'integerrange'},
            {label: $rootScope.i18n('l-natureza', undefined, 'dts/mpd'), property: 'natureza', propertyList: [
				{value: 1, name: $rootScope.i18n('l-pessoa-fisica', undefined, 'dts/mpd')},
				{value: 2, name: $rootScope.i18n('l-pessoa-juridica', undefined, 'dts/mpd')},
				{value: 3, name: $rootScope.i18n('l-estrangeiro', undefined, 'dts/mpd')},
				{value: 4, name: $rootScope.i18n('l-trading', undefined, 'dts/mpd')}
			]}
		];
		service.columnDefs = [
			{headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod-emitente'},
			{headerName: $rootScope.i18n('l-nome-abrev', undefined, 'dts/mpd'), field: 'nome-abrev'},
			{headerName: $rootScope.i18n('l-cgc-zoom', undefined, 'dts/mpd'), field: 'cgc'},
			{headerName: $rootScope.i18n('l-emitente', undefined, 'dts/mpd'), field: 'nome-emit'},
			{headerName: $rootScope.i18n('l-grp-clien', undefined, 'dts/mpd'), field: 'cod-gr-cli'},
			{headerName: $rootScope.i18n('l-nome-matriz', undefined, 'dts/mpd'), field: 'nome-matriz'},
			{headerName: $rootScope.i18n('l-fornecedor', undefined, 'dts/mpd'), field: 'cod-gr-forn'},
			{headerName: $rootScope.i18n('l-natureza', undefined, 'dts/mpd'), field: 'natureza', valueGetter: function(param) {
				if(param.data.natureza === 1) {
					return $rootScope.i18n('l-pessoa-fisica', undefined, 'dts/mpd');
				} else if(param.data.natureza === 2) {
					return $rootScope.i18n('l-pessoa-juridica', undefined, 'dts/mpd');
				} else if(param.data.natureza === 3) {
					return $rootScope.i18n('l-estrangeiro', undefined, 'dts/mpd');
				} else if(param.data.natureza === 4) {
					return $rootScope.i18n('l-trading', undefined, 'dts/mpd');
				}
			}},
			{headerName: $rootScope.i18n('l-identific', undefined, 'dts/mpd'), field: 'identific', valueGetter: function(param) {
				if(param.data.identific === 1) {
					return $rootScope.i18n('l-customer', undefined, 'dts/mpd');
				} else if(param.data.identific === 2) {
					return $rootScope.i18n('l-fornecedor', undefined, 'dts/mpd');
				} else if(param.data.identific === 3) {
					return $rootScope.i18n('l-ambos', undefined, 'dts/mpd');
				}
			}}
		];
	
		service.afterQuery = function (queryresult, parameters) {
			/* Forçar a ordernação pelo código emitente de forma paliativa enquanto o 
			   Framework corrige o DatasulRest */			
			queryresult.sort(sortNumber);
		}

		function sortNumber(a,b) {
			return a["cod-emitente"] - b["cod-emitente"];
		}		
		
		service.beforeQuery = function (parameters) {							
				const limitFields = ["cod-emitente", "cod-gr-cli", "cod-gr-forn", "identific"];
				const stringFields = ["nome-abrev", "cgc", "nome-matriz", "nome-emit"]

				angular.forEach(parameters.disclaimers, function (disclaimer, key) {
					
					if (disclaimer.value) {
						queryproperties.property.push(disclaimer.property);
						
						if (limitFields.includes(disclaimer.property)) {
							if(!disclaimer.value.start && !disclaimer.value.end)
								return; 
								
							if (disclaimer.value.start == undefined || disclaimer.value.start == "") {
								disclaimer.value.start = 0;
							}

							if (disclaimer.value.end == undefined || disclaimer.value.end == "") {
								disclaimer.value.end = disclaimer.value.start;
							}
							queryproperties.value.push(disclaimer.value.start + ";" + disclaimer.value.end);
						}

						if (stringFields.includes(disclaimer.property))
							queryproperties.value.push("*" + disclaimer.value + "*");						
						
						if (disclaimer.property == "natureza")
							queryproperties.value.push(disclaimer.value.value);						
					}

		
				});
		};
	
		service.applyFilter = function (parameters) {
			var that = this;			
			var strQuery = "";
			
			queryproperties = { where: [], value: [], property: [] };
			queryproperties.limit = that.limitZoom;
			queryproperties.fields = "cod-emitente,nome-abrev,cgc,nome-emit,cod-gr-cli,nome-matriz,cod-gr-forn,natureza,identific";

			if (parameters.isSelectValue) {
				queryproperties.limit = that.limitSelect;
				queryproperties.where = [];	
				queryproperties.order = "cod-emitente";			

				var strQuery = " (STRING(emitente.cod-emitente) MATCHES ('" + parameters.selectedFilterValue + "*') OR emitente.nome-abrev MATCHES ('*" + parameters.selectedFilterValue + "*')" +
				" OR emitente.cgc MATCHES ('" + parameters.selectedFilterValue + "*') OR emitente.nome-emit MATCHES ('*" + parameters.selectedFilterValue + "*'))";				
				
				queryproperties.where.push(strQuery);
			} else {
				if (this.beforeQuery)
					this.beforeQuery(parameters);
			}

			if (parameters.more)
				queryproperties.start = this.zoomResultList.length;
			else
				that.zoomResultList = [];

			return this.resource.TOTVSQuery(queryproperties, function (result) {
				if ((!parameters.init || parameters.init.setDefaultValue) && (!parameters.selectedFilterValue)) return;

				if (result) {
					that.zoomResultList = that.zoomResultList.concat(result);
					$timeout(function () {
						if (result.length > 0) {
							that.resultTotal = result[0].$length;
						}
					}, 0);
				}
			}, { noErrorMessage: true }, false);
		}

		service.getObjectFromValue =  function (value) {
			if (value) {
				if (service.zoomResultList && service.zoomResultList.length > 0) {
					return $q(function (resolve, reject) {
						resolve(service.zoomResultList[0]);
					});
				}
				var queryproperties = {
					where: ["emitente.nome-abrev = " + "'" + value + "'"]
				};
				return $q(function (resolve, reject) {
					service.resource.TOTVSQuery(queryproperties, function (result) {
						resolve(result[0]);
					}, { noErrorMessage: true }, true);
				});
			}			
		};

		service.comparator = function(item1, item2) {
			return (item1['cod-emitente'] === item2['cod-emitente']);
		};

		service.emitenteList = [];
		service.getEmitente = function (value) {
			var parameters = {};
			var queryproperties = {};

			if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
				parameters.disclaimers = [];

			parameters.disclaimers.push({
				property: "nome-abrev",
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
	index.register.service('mpd.emitenteTriangular.zoom', serviceEmitenteTriangular);
});
