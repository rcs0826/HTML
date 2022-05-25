define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
    # Database: mgind
    # Table...: comprador
    # Service.: serviceComprador
    # Register: mcc.comprador.zoom
    ####################################################################################################*/

	serviceComprador.$inject = ['$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceComprador($totvsresource, $rootScope, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin055/:method/:gotomethod/:id', {fields: "cod-comprado,nome,lim-compra,mo-codigo"}, {});
		service.zoomName = $rootScope.i18n('l-buyer', undefined, 'dts/mcc');
		service.configuration = true;
        service.useSearchMethod = true;
        service.matches = ['cod-comprado', 'nome'];
        service.setConfiguration('mcc.comprador.zoom');

		service.propertyFields = [
          	{label: 'l-code', property: 'cod-comprado', type:'stringrange', default: true, maxlength: 12},
            {label: 'l-name', property: 'nome', type:'stringrange', maxlength: 40}
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-code', undefined, 'dts/mcc'), field: 'cod-comprado'},
            {headerName: $rootScope.i18n('l-name', undefined, 'dts/mcc'), field: 'nome'},
            {headerName: $rootScope.i18n('l-purchase-limit', undefined, 'dts/mcc'), field: 'lim-compra'}, // Limite de compra
            {headerName: $rootScope.i18n('l-currency', undefined, 'dts/mcc'), field: 'mo-codigo'}
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
            return (item1['cod-comprado'] === item2['cod-comprado']);
        };

        service.buyerList = [];
        service.getBuyers = function (value) {

            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "cod-comprado",
                type: "string",
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.buyerList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);

        };
		return service;
	}
	index.register.service('mcc.comprador.zoom', serviceComprador);
});
