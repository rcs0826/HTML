define(['index',
    '/dts/dts-utils/js/zoom/zoom.js'
], function(index) {

    /*####################################################################################################
    # Database: mgadm
    # Table...: baseado em temp-table
    # Service.: serviceLocalCarregamento
    # Register: mpd.local-carregamento.zoom
    ####################################################################################################*/

    serviceLocalCarregamento.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    function serviceLocalCarregamento($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

        var scopeService = this;

        var service = {};
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/prg/cdp/v1/loadingLocation/', {}, {});
        service.zoomName = $rootScope.i18n('l-local-carregamento', undefined, 'dts/mpd');
        service.setConfiguration('mpd.local-carregamento.zoom');

        service.propertyFields = [{
                label: $rootScope.i18n('l-code', undefined, 'dts/mpd'),
                property: 'customerCode',
                type: 'integerrange',
                default: true
            },
            {
                label: $rootScope.i18n('l-short-name', undefined, 'dts/mpd'),
                property: 'customerName',
                type: 'string'
            }
        ];

        service.columnDefs = [{
                headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'),
                field: 'customerCode'
            },
            {
                headerName: $rootScope.i18n('l-nome-abrev', undefined, 'dts/mpd'),
                field: 'customerName'
            },
            {
                headerName: $rootScope.i18n('l-identific', undefined, 'dts/mpd'),
                field: 'identification'
            },
            {
                headerName: $rootScope.i18n('l-estado', undefined, 'dts/mpd'),
                field: 'state'
            },
            {
                headerName: $rootScope.i18n('l-cidade', undefined, 'dts/mpd'),
                field: 'city'
            },
        ];

  		service.beforeQuery = function (queryproperties, parameters) {
            if (parameters.init) {
				queryproperties.property = queryproperties.property || [];
				queryproperties.value = queryproperties.value || [];
				queryproperties.property.push('site');
				queryproperties.value.push(parameters.init);
			}
		}

        service.getObjectFromValue = function(value, init) {
            if (value === "" || value === undefined || value === null) return;
            var param = {get: value};
            angular.extend(param, {"site": init});
            return this.resource.TOTVSGet(param, undefined , {noErrorMessage: true},true);
        };

        return service;
    }
    index.register.service('mpd.local-carregamento.zoom', serviceLocalCarregamento);

});
