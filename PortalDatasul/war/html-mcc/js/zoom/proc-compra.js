define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
    # Database: mgind
    # Table...: proc-compra
    # Service.: serviceProcCompra
    # Register: mcc.proc-compra.zoom
    ####################################################################################################*/

	serviceProcCompra.$inject = ['$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service', '$filter'];
	function serviceProcCompra($totvsresource, $rootScope, zoomService, dtsUtils, $filter) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin358/:method/:gotomethod/:id', {fields: "nr-processo,descricao,cod-comprado,dt-inicio"}, {});
		service.zoomName = $rootScope.i18n('l-purchase-package', undefined, 'dts/mcc');
		service.configuration = true;
        service.useSearchMethod = true;
        service.matches = ['nr-processo', 'descricao'];
        service.setConfiguration('mcc.proc-compra.zoom');

		service.propertyFields = [
          	{label: 'l-number', property: 'nr-processo', type:'integerrange', default: true, vMax: 999999},
            {label: 'l-description', property: 'descricao', type:'stringrange', maxlength: 40},
            {label: 'l-buyer', property: 'cod-comprado', type:'stringrange', maxlength: 12},
            {label: 'l-initial-date', property: 'dt-inicio', type:'daterange'}
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-number', undefined, 'dts/mcc'), field: 'nr-processo', width: 100, minWidth: 80},
            {headerName: $rootScope.i18n('l-description', undefined, 'dts/mcc'), field: 'descricao', width: 400, minWidth: 100},
            {headerName: $rootScope.i18n('l-buyer', undefined, 'dts/mcc'), field: 'cod-comprado', width: 130, minWidth: 120},
            {headerName: $rootScope.i18n('l-initial-date', undefined, 'dts/mcc'), field: 'dt-inicio', width: 130, minWidth: 100, valueGetter: function(params) {
                return $filter('date') (params.data["dt-inicio"], $rootScope.i18n('l-date-format'));
            }}
        ];

        /*
        * Aplicar filtro inicial no zoom; Passar um objeto com a propriedade 'filter' no atributo zoom-init/select-init;
        * ex: zoom-init="{'filter': {'campo': 'valor'} }"
        */
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
                    gotomethod: init ? init.gotomethod : undefined
                }, undefined, {
                    noErrorMessage: true
                }, true);
            }
        };

        service.comparator = function(item1, item2) {
            return (item1['nr-processo'] === item2['nr-processo']);
        };

        service.packageList = [];
        service.getPurchasePackages = function (value) {

            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "nr-processo",
                type: "integer",
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.packageList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);

        };
		return service;
	}
	index.register.service('mcc.proc-compra.zoom', serviceProcCompra);
});
