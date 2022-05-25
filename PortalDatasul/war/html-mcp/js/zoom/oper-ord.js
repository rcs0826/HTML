define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
    # Database: movind
    # Table...: oper-ord
    # Service.: serviceOperOrd
    # Register: mcp.oper-ord.zoom
    ####################################################################################################*/

	serviceOperOrd.$inject = ['$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceOperOrd($totvsresource, $rootScope, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin260/:method/:gotomethod/:id', {fields: "estado,cod-roteiro,op-codigo,it-codigo,descricao,qtd-aprov-sfc,qtd-previs-operac,nr-ord-produ"}, {});
		service.zoomName = $rootScope.i18n('l-order-operations', undefined, 'dts/mcp');
		service.configuration = true;
        service.useSearchMethod = true;
        service.matches = ['op-codigo', 'descricao'];
        service.setConfiguration('mcp.oper-ord.zoom');

		service.propertyFields = [
          	{label: 'l-state', property: 'estado', type:'integer', default: true, propertyList: [
                {id: 1, name: $rootScope.i18n('l-not-started', undefined, 'dts/mcp'), value: 1},
                {id: 2, name: $rootScope.i18n('l-started', undefined, 'dts/mcp'), value: 2},
				{id: 3, name: $rootScope.i18n('l-finished', undefined, 'dts/mcp'), value: 3}
            ]},
            {label: 'l-routing', property: 'cod-roteiro', type:'stringrange', maxlength: 16},
            {label: 'l-operation', property: 'op-codigo', type:'integerrange', vMax: 99999},
            {label: 'l-item', property: 'it-codigo', type:'stringrange', maxlength: 16},
            {label: 'l-description', property: 'descricao', type:'stringrange', maxlength: 34},
            {label: 'l-approved-quantity', property: 'qtd-aprov-sfc', type:'decimalrange', vMax: 99999999, mDec: 4},
            {label: 'l-expected-quantity', property: 'qtd-previs-operac', type:'decimalrange', vMax: 99999999, mDec: 4},
            {label: 'l-production-order', property: 'nr-ord-produ', type:'integerrange', vMax: 999999999}
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-item', undefined, 'dts/mcp'), field: 'it-codigo', width: 170, minWidth: 160}, // Item
            {headerName: $rootScope.i18n('l-operation', undefined, 'dts/mcp'), field: 'op-codigo', width: 100, minWidth: 50}, // Operação
            {headerName: $rootScope.i18n('l-expected-quantity', undefined, 'dts/mcp'), field: 'qtd-previs-operac', width: 150, minWidth: 140}, // Qtd Prevista
            {headerName: $rootScope.i18n('l-production-order', undefined, 'dts/mcp'), field: 'nr-ord-produ', width: 170, minWidth: 110}, // Ordem Produção
            {headerName: $rootScope.i18n('l-description', undefined, 'dts/mcp'), field: 'descricao', width: 350, minWidth: 100}, // Descrição
            {headerName: $rootScope.i18n('l-state', undefined, 'dts/mcp'), field: 'estado', width: 130, minWidth: 120, valueGetter : function(params){
				var sentence;
				switch(params.data.estado) {
						case 1:
							return $rootScope.i18n('l-not-started', [], 'dts/mcp');
							break;
						case 2:
							return $rootScope.i18n('l-started', [], 'dts/mcp');
							break;
						case 3:
							return $rootScope.i18n('l-finished', [], 'dts/mcp');
							break;
						default:
							return '';
					}
					
			}}, // Estado
            {headerName: $rootScope.i18n('l-approved-quantity', undefined, 'dts/mcp'), field: 'qtd-aprov-sfc', width: 150, minWidth: 140}, // Qtd Aprovada
            {headerName: $rootScope.i18n('l-routing', undefined, 'dts/mcp'), field: 'cod-roteiro', width: 170, minWidth: 100} // Roteiro
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
            return (item1['nr-ord-produ'] === item2['nr-ord-produ'] &&
                    item1['it-codigo'] === item2['it-codigo'] &&
                    item1['cod-roteiro'] === item2['cod-roteiro'] &&
                    item1['op-codigo'] === item2['op-codigo']);
        };

        service.operationList = [];
        service.getOperations = function (value) {

            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "op-codigo",
                type: "integer",
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.operationList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);

        };
		return service;
	}
	index.register.service('mcp.oper-ord.zoom', serviceOperOrd);
});
