define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) { 

    /*####################################################################################################
     # Database: mgmfg
     # Table...: ferr-prod
     # Service.: serviceZoomFerrProd
     # Register: mcp.ferr-prod.zoom
     ####################################################################################################*/
    serviceZoomFerrProd.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceZoomFerrProd($timeout, $totvsresource, $rootScope, $filter, zoomService){
        
        var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin465h/:method/:id/');
        service.zoomName       = $rootScope.i18n('l-production-tool');
        service.configuration  = true;
        service.advancedSearch = false;
        
        service.propertyFields = [
          	{label: 'l-production-tool', property: 'cod-ferr-prod', type:'string', maxlength: 16, default: true},
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-production-tool', undefined, 'dts/mcp'), field: 'cod-ferr-prod', width: 150, minWidth: 100}, 
            {headerName: $rootScope.i18n('l-description', undefined, 'dts/mcp'), field: 'des-ferr-prod', width: 150, minWidth: 100}
            
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
    
    index.register.service('mcp.ferr-prod.zoom', serviceZoomFerrProd);
});