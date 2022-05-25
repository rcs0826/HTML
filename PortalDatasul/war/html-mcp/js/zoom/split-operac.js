define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) { 

    /*####################################################################################################
     # Database: movmfg
     # Table...: split-operac
     # Service.: serviceZoomSplitOperac
     # Register: mcp.split-operac.zoom
     ####################################################################################################*/
    serviceZoomSplitOperac.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceZoomSplitOperac($timeout, $totvsresource, $rootScope, $filter, zoomService){
        
        var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mfbo/bomf535/:method/:id/');
        service.zoomName       = $rootScope.i18n('l-split');
        service.configuration  = true;
        service.advancedSearch = false;
        
        service.propertyFields = [
            {label: 'l-split', property: 'num-split-operac', type:'integer', vMax: 999, default: true},
            {label: 'l-operation', property: 'op-codigo', type:'integer', vMax: 999},
            {label: 'l-workcenter', property: 'cod-ctrab', type:'string', maxlength: 16},
            {label: 'l-machine-group', property: 'gm-codigo', type:'string', maxlength: 9},
            {label: 'l-item', property: 'it-codigo', type:'string', maxlength: 16},
            {label: 'l-production-order', property: 'nr-ord-produ', type:'integer', vMax: 999999999}
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-item', undefined, 'dts/mcp'), field: 'it-codigo', width: 150, minWidth: 100}, // Item
            {headerName: $rootScope.i18n('l-operation', undefined, 'dts/mcp'), field: 'op-codigo', width: 150, minWidth: 100}, // Operação
            {headerName: $rootScope.i18n('l-production-order', undefined, 'dts/mcp'), field: 'nr-ord-produ', width: 150, minWidth: 100}, // Operação
            {headerName: $rootScope.i18n('l-split', undefined, 'dts/mcp'), field: 'num-split-operac', width: 50, minWidth: 50}, // Qtd Prevista
            {headerName: $rootScope.i18n('l-machine-group', undefined, 'dts/mcp'), field: 'gm-codigo', width: 150, minWidth: 100}, // Ordem Produção
            {headerName: $rootScope.i18n('l-workcenter', undefined, 'dts/mcp'), field: 'cod-ctrab', width: 150, minWidth: 100}, // Descrição
        ];
        
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
        
        /*
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao
         */
        service.comparator = function(item1, item2) {
            return (item1.id === item2.id);
        };
        
        service.getObjectFromValue =  function (value) {
            return this.resource.TOTVSGet({
                id: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };
        
		
        return service;
    }
    
    index.register.service('mcp.split-operac.zoom', serviceZoomSplitOperac);
});