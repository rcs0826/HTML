/*####################################################################################################
# Database: mgadm
# Table...: repres
# Service.: serviceRepresentante
# Register: mpd.repres.zoom
####################################################################################################*/
define(['index', '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	serviceRepresentante.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceRepresentante($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {
		var scopeService = this;
		var service = {};

		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST(
			'/dts/datasul-rest/resources/dbo/adbo/boad229na/:method/:gotomethod/:id',
			{ fields: "cod-rep,nome-abrev,nome" },
			{}
		);
		service.zoomName = $rootScope.i18n('l-repres', undefined, 'dts/mpd');
		service.configuration = false;
		service.useSearchMethod = true;
		service.matches = ['cod-rep','nome-abrev','nome'];

		service.propertyFields = [
			{ label: $rootScope.i18n('l-code', undefined, 'dts/mpd'), property: 'cod-rep', type:'integerrange', default: true },
			{ label: $rootScope.i18n('l-short-name', undefined, 'dts/mpd'), property: 'nome-abrev', type:'string' },
			{ label: $rootScope.i18n('l-nome', undefined, 'dts/mpd'), property: 'nome', type:'string' }
		];

		service.columnDefs = [
			{ headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod-rep' },
			{ headerName: $rootScope.i18n('l-nome-abrev', undefined, 'dts/mpd'), field: 'nome-abrev' },
			{ headerName: $rootScope.i18n('l-cgc', undefined, 'dts/mpd'), field: 'cgc' },
			{ headerName: $rootScope.i18n('l-nome', undefined, 'dts/mpd'), field: 'nome' },
			{ headerName: $rootScope.i18n('l-nome-ab-reg', undefined, 'dts/mpd'), field: 'nome-ab-reg' }
		];

		service.applyFilter = function (parameters) {
            var that = this;
            var strQuery = "";
            var queryproperties = {};

            queryproperties.property = [];
            queryproperties.value = [];
            queryproperties.limit = that.limitZoom;
            
            if (parameters.isSelectValue) {
                queryproperties.where = [];

                strQuery += "(repres.nome-abrev MATCHES('*" + parameters.selectedFilterValue + 
							"*') OR repres.nome MATCHES('*" + parameters.selectedFilterValue + "'))";

                delete queryproperties.method;
				delete queryproperties.searchfields;
				delete queryproperties.siteId;

                queryproperties.where.push(strQuery);
            } else {
				
				if (parameters.init) {
					if(parameters.init.gotomethod) {
						// init widget regra de time.
						if (parameters.init.gotomethod != 'gotonomeabrev') {
							if(parameters.init) {
								queryproperties.property.push('cod-rep');
								queryproperties.value.push(parameters.init);
							}
						}
					} else {
						if(parameters.init) {
							queryproperties.property.push('cod-rep');
							queryproperties.value.push(parameters.init);
						}
					}
				}

                angular.forEach(parameters.disclaimers, function (disclaimer, key) { 

                    if (disclaimer.value) {
						queryproperties.property.push(disclaimer.property);

						if (disclaimer.property == 'cod-rep') {

							if (disclaimer.value.start == undefined || disclaimer.value.start == "") {
								disclaimer.value.start = "";
							}

							if (disclaimer.value.end == undefined || disclaimer.value.end == "") {
								disclaimer.value.end = "";
							}

                            if (disclaimer.value.end != "") {
                                queryproperties.value.push(disclaimer.value.start + ";" + disclaimer.value.end);
                            } else {
                                queryproperties.value.push(disclaimer.value.start + ";999999999");
                            }
						} else {
                            queryproperties.value.push("*" + disclaimer.value + "*");
                        }
					}
                });
			}

            if (parameters.more)
                queryproperties.start = this.zoomResultList.length;
            else
                that.zoomResultList = [];

            return this.resource.TOTVSQuery(queryproperties, function (result) {
	            if (result) {
                    that.zoomResultList = that.zoomResultList.concat(result);
                    $timeout(function () {
                        if (result.length > 0) {
                            that.resultTotal = result[0].$length;
                        } else {
                            that.resultTotal = 0;
                        }
                    }, 0);
                }
            }, { noErrorMessage: true }, false);
        }

		service.getObjectFromValue =  function (value, init) {
			if (value) {
				var gotomethod;
				if (init && init.gotomethod)
					gotomethod = init.gotomethod;
				return this.resource.TOTVSGet({
					id: value,
					gotomethod: gotomethod
				}, undefined, {
					noErrorMessage: true
				}, true);
			}
		};

		service.comparator = function(item1, item2) {
			return (item1['cod-rep'] === item2['cod-rep']);
		};

		service.represList = [];
		service.getRepres = function (value) {
			var _service = this;
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
	index.register.service('mpd.repres.zoom', serviceRepresentante);
});
