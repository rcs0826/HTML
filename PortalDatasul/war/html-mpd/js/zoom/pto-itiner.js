define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
    # Database: mgcex
    # Table...: pto-itiner
    # Service.: servicePtoItiner
    # Register: mpd.pto-itiner.zoom
    ####################################################################################################*/

	servicePtoItiner.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function servicePtoItiner($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/cxbo/bocx120a/:method/:gotomethod/:codItiner/:id', {fields: "cod-pto-contr"}, {});
		service.zoomName = $rootScope.i18n('l-control-points', undefined, 'dts/mpd');
		service.configuration = false;
        // service.useSearchMethod = true;
        // service.matches = ['cod-pto-contr'];

		service.propertyFields = [
          	{label: $rootScope.i18n('l-code'), property: 'cod-pto-contr', type:'integerrange', default: true}
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'), field: 'cod-pto-contr'},
            {headerName: $rootScope.i18n('l-descricao', undefined, 'dts/mpd'), valueGetter: function(params) {
                return params.data._.descricao;
            }}
        ];

        service.beforeQuery = function (queryproperties, parameters) {
            queryproperties.order = ['cod-pto-contr'];
            if(parameters.init) {
                queryproperties.property = queryproperties.property || [];
                queryproperties.value = queryproperties.value || [];

                if(parameters.init.properties && parameters.init.values) {
                    parameters.init.properties.forEach(function(property, i) {
                        queryproperties.property.push(property);
                        queryproperties.value.push(parameters.init.values[i]);
                    });
                }
            }
        };

        service.getObjectFromValue =  function (value, init) {
            if (value) {
                return this.resource.TOTVSGet({
                    id: value,
                    gotomethod: init ? init.gotomethod : undefined,
                    codItiner: init ? init.codItiner : undefined
                }, undefined, {
                    noErrorMessage: true
                }, true);
            }
        };

        service.comparator = function(item1, item2) {
            return (item1['cod-pto-contr'] === item2['cod-pto-contr'] && item1['cod-itiner'] === item2['cod-itiner']);
        };

        service.ptoList = [];
        service.getPtos = function (value) {

            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "cod-pto-contr",
                type: "integer",
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.ptoList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);

        };
		return service;
	}
	index.register.service('mpd.pto-itiner.zoom', servicePtoItiner);
});
