define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {
		
	/*####################################################################################################
    # Database: movind
    # Table...: ord-prod
    # Service.: serviceOrdProdZoom
    # Register: mcp.ord-prod.zoom
    ####################################################################################################*/

	serviceOrdProdZoom.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceOrdProdZoom($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {
		
		var scopeService = this;
		
		var service = {};			
		angular.extend(service, zoomService);
		
		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin271/:method/:id', {}, {});
		service.zoomName = $rootScope.i18n("l-production-order", undefined, 'dts/mcp');
		service.setConfiguration('mcp.ord-prod.zoom');	
		
		service.propertyFields = [
          	{label: $rootScope.i18n('l-production-order', undefined, 'dts/mcp'), property: 'nr-ord-produ', type:'integerrange', default: true},
			{label: $rootScope.i18n('l-site', undefined, 'dts/mcp'), property: 'cod-estabel', type:'integer'},
			{label: $rootScope.i18n('l-item', undefined, 'dts/mcp'),property: 'it-codigo', type:'string'},
			{label: $rootScope.i18n('l-reference', undefined, 'dts/mcp'),property: 'cod-refer', type:'string'},
			{label: $rootScope.i18n('l-initial-date', undefined, 'dts/mcp'),property: 'dt-inicio', type:'date'},
			{label: $rootScope.i18n('l-end-date', undefined, 'dts/mcp'),property: 'dt-termino', type:'date'},
			{label: $rootScope.i18n('l-emission-date', undefined, 'dts/mcp'),property: 'dt-emissao', type:'date'},
			{label: $rootScope.i18n('l-state', undefined, 'dts/mcp'),property: 'estado',
			propertyList: [
	  		               {id: 0, name: $rootScope.i18n('l-not-started', undefined, 'dts/mcp'), value: 1},
	          	           {id: 1, name: $rootScope.i18n('l-released', undefined, 'dts/mcp'), value: 2},
	          	           {id: 2, name: $rootScope.i18n('l-reserved', undefined, 'dts/mcp'), value: 3},
	          	           {id: 3, name: $rootScope.i18n('l-separated', undefined, 'dts/mcp'), value: 4}
	  		        ]
			},
			{label: $rootScope.i18n('l-production-report', undefined, 'dts/mcp'),property: 'rep-prod', type:'integerrange'},
			{label: $rootScope.i18n('l-lot-serial', undefined, 'dts/mcp'),property: 'lote-serie', type:'integer'}];
			
		service.columnDefs = [
            {headerName: $rootScope.i18n('l-production-order',undefined, 'dts/mcp'), field: 'nr-ord-produ',width: 150, minWidth: 100},
			{headerName: $rootScope.i18n('l-site',undefined, 'dts/mcp'),field: 'cod-estabel',width: 150, minWidth: 100},
			{headerName: $rootScope.i18n('l-item',undefined, 'dts/mcp'),field: 'it-codigo',width: 150, minWidth: 100},
			{headerName: $rootScope.i18n('l-reference',undefined, 'dts/mcp'), field: 'cod-refer',width: 150, minWidth: 100},
			{headerName: $rootScope.i18n('l-quantity-order',undefined, 'dts/mcp'), field: 'qt-ordem',width: 150, minWidth: 100},
			{headerName: $rootScope.i18n('l-initial-date',undefined, 'dts/mcp'), field: 'dt-inicio',
				valueGetter: function(params){
                    return $filter('date')(params.data['dt-inicio'], 'dd/MM/yyyy');
                }
			,width: 100, minWidth: 50},
			{headerName: $rootScope.i18n('l-end-date',undefined, 'dts/mcp'),field: 'dt-termino',
				valueGetter: function(params){
                    return $filter('date')(params.data['dt-termino'], 'dd/MM/yyyy');
                }
			,width: 100, minWidth: 50},
			{headerName: $rootScope.i18n('l-emission-date',undefined, 'dts/mcp'),field: 'dt-emissao',
				valueGetter: function(params){
                    return $filter('date')(params.data['dt-emissao'], 'dd/MM/yyyy');
                }
			},
			{headerName: $rootScope.i18n('l-state',undefined, 'dts/mcp'), field: 'estado',width: 100, minWidth: 50},
			{headerName: $rootScope.i18n('l-production-report',undefined, 'dts/mcp'), field: 'rep-prod',width: 150, minWidth: 100},
			{headerName: $rootScope.i18n('l-lot-serial',undefined, 'dts/mcp'), field: 'lote-serie',width: 150, minWidth: 100}];
		
		service.getObjectFromValue = function (value, init) {
			
            var intValue = parseInt(value);
            
            if (isNaN(intValue)) return undefined;
			
            return this.resource.TOTVSGet({
                id: value,
            }, undefined, {
                noErrorMessage: true
            }, true);
        };
		
        service.orderProductionList = [];
        service.getOrderProduction = function (value, init) {
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (init) {
                parameters.init = init;

                if (parameters.init.noCount === undefined) {
                   parameters.init.noCount = false;
              }
            }

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "nr-ord-produ",
                type: "integer",
                extend: 1,
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });
            
            
            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.orderProductionList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);
        };
        
		return service;
		
	}
	index.register.service('mcp.ord-prod.zoom', serviceOrdProdZoom);
	
});