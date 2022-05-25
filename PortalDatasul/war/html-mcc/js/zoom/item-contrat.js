define([
    'index',
    '/dts/dts-utils/js/zoom/zoom.js',
    '/dts/mcc/js/mcc-legend-service.js'
], function(index) {

	/*####################################################################################################
    # Database: mgind
    # Table...: item-contrat
    # Service.: serviceItemContrat
    # Register: mcc.item-contrat.zoom
    ####################################################################################################*/

	serviceItemContrat.$inject = ['$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service', 'mcc.zoom.serviceLegend'];
	function serviceItemContrat($totvsresource, $rootScope, zoomService, dtsUtils, serviceLegend) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin582/:method/:gotomethod/:item/:id/:seq/', {fields: "nr-contrato,cod-emitente,num-seq-item,it-codigo,ind-sit-item,log-libera"}, {});
		service.zoomName = $rootScope.i18n('l-contract-item', undefined, 'dts/mcc');
		service.configuration = true;
        service.useSearchMethod = true;
        service.matches = ['nr-contrato', 'it-codigo', 'num-seq-item'];
        service.setConfiguration('mcc.item-contrat.zoom');

		service.propertyFields = [
          	{label: 'l-contract', property: 'nr-contrato', type:'integerrange', default: true, vMax: 999999999},
            {label: 'l-item', property: 'it-codigo', type:'stringrange', maxlength: 16},
            {label: 'l-vendor', property: 'cod-emitente', type:'integerrange', vMax: 999999999}
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-contract', undefined, 'dts/mcc'), field: 'nr-contrato', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-vendor', undefined, 'dts/mcc'), field: 'cod-emitente', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-abrev-name', undefined, 'dts/mcc'), field: 'nome-abrev', width: 130, minWidth: 120, valueGetter: function(params) {
                return params.data._['nome-abrev'];
            }},
            {headerName: $rootScope.i18n('l-sequence', undefined, 'dts/mcc'), field: 'num-seq-item', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-item', undefined, 'dts/mcc'), field: 'it-codigo', width: 170, minWidth: 160},
            {headerName: $rootScope.i18n('l-item-description', undefined, 'dts/mcc'), field: 'desc-item', width: 400, minWidth: 100, valueGetter: function(params) {
                return params.data._['desc-item'];
            }},
            {headerName: $rootScope.i18n('l-status', undefined, 'dts/mcc'), field: 'ind-sit-item', width: 100, minWidth: 100, valueGetter: function(params) {
                return serviceLegend.contractItemStatus.NAME(params.data['ind-sit-item']);
            }},
            {headerName: $rootScope.i18n('l-active', undefined, 'dts/mcc'), field: 'log-libera', width: 50, minWidth: 30, valueGetter: function(params) {
                return serviceLegend.boolean.NAME(params.data['log-libera']);
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
                    item: (init && init.filter && init.filter['it-codigo'])? init.filter['it-codigo'] : undefined,
                    id: value,
                    seq: (init && init.filter && init.filter['num-seq-item'])? init.filter['num-seq-item'] : undefined,
                    gotomethod: init ? init.gotomethod : undefined
                }, undefined, {
                    noErrorMessage: true
                }, true);
            }
        };

        service.comparator = function(item1, item2) {
            return (item1['nr-contrato'] === item2['nr-contrato'] && item1['num-seq-item'] === item2['num-seq-item']);
        };

        service.itemsList = [];
        service.getItems = function (value) {

            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "nr-contrato",
                type: "integer",
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.itemsList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);

        };
		return service;
	}
	index.register.service('mcc.item-contrat.zoom', serviceItemContrat);
});
