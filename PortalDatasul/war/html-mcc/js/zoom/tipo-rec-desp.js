define([
    'index',
    '/dts/dts-utils/js/zoom/zoom.js',
    '/dts/mcc/js/mcc-legend-service.js'
], function(index) {

	/*####################################################################################################
    # Database: mgadm
    # Table...: tipo-rec-desp
    # Service.: serviceTipoRecDesp
    # Register: mcc.tipo-rec-desp.zoom
    ####################################################################################################*/

	serviceTipoRecDesp.$inject = ['$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service', 'mcc.zoom.serviceLegend'];
	function serviceTipoRecDesp($totvsresource, $rootScope, zoomService, dtsUtils, serviceLegend) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad259na/:method/:gotomethod/:id', {fields: "tp-codigo,descricao,tipo"}, {});
		service.zoomName = $rootScope.i18n('l-expense-type', undefined, 'dts/mcc');
		service.configuration = true;
        service.useSearchMethod = true;
        service.matches = ['tp-codigo', 'descricao'];
        service.setConfiguration('mcc.tipo-rec-desp.zoom');

		service.propertyFields = [
          	{label: 'l-code', property: 'tp-codigo', type:'integerrange', default: true, vMax: 999},
            {label: 'l-description', property: 'descricao', type:'stringrange', maxlength: 30},
            {label: 'l-type', property: 'tipo', type: 'integer', propertyList: [
                {id: 1, name: $rootScope.i18n('l-income', undefined, 'dts/mcc'), value: 1},
                {id: 2, name: $rootScope.i18n('l-expense', undefined, 'dts/mcc'), value: 2},
            ]}
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-code', undefined, 'dts/mcc'), field: 'tp-codigo', width: 100, minWidth: 30},
            {headerName: $rootScope.i18n('l-description', undefined, 'dts/mcc'), field: 'descricao', width: 400, minWidth: 310},
            {headerName: $rootScope.i18n('l-type', undefined, 'dts/mcc'), field: 'tipo', width: 100, minWidth: 80, valueGetter: function(params) {
                if(params.data.tipo) {
                    return serviceLegend.expenseOrIncome.NAME(params.data.tipo);
                }
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
            return (item1['tp-codigo'] === item2['tp-codigo']);
        };

        service.expenseList = [];
        service.getExpenses = function (value) {

            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "tp-codigo",
                type: "integer",
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.expenseList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);

        };
		return service;
	}
	index.register.service('mcc.tipo-rec-desp.zoom', serviceTipoRecDesp);
});
