define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) { 

    /*####################################################################################################
     # Database: mgmfg
     # Table...: ctrab
     # Service.: serviceZoomCtrab
     # Register: mcp.ctrab.zoom
     ####################################################################################################*/
    serviceZoomCtrab.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceZoomCtrab($timeout, $totvsresource, $rootScope, $filter, zoomService){
        
        var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mfbo/bomf513/:method/:id/');
        service.zoomName       = $rootScope.i18n('l-workcenter');
        service.configuration  = true;
        service.advancedSearch = false;
        
        service.propertyFields = [
            {label: 'l-workcenter', property: 'cod-ctrab', type:'string', maxlength: 16, default: true},
            {label: 'l-machine-group', property: 'gm-codigo', type:'string', maxlength: 9}            
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-workcenter', undefined, 'dts/mcp'), field: 'cod-ctrab', width: 150, minWidth: 100}, 
            {headerName: $rootScope.i18n('l-machine-group', undefined, 'dts/mcp'), field: 'gm-codigo', width: 150, minWidth: 100},
            {headerName: $rootScope.i18n('l-description', undefined, 'dts/mcp'), field: 'des-ctrab', width: 350, minWidth: 100},
            
        ];
        
		service.beforeQuery = function (queryproperties, parameters) {
			if(parameters.init) {
				queryproperties.property = queryproperties.property || [];
				queryproperties.value = queryproperties.value || [];

				if(parameters.init.filter) {
					for (var property in parameters.init.filter) {
						// Verifica se o usu??rio informou algum valor para a propriedade, se n??o, utiliza o valor padr??o (init)
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
    
    index.register.service('mcp.ctrab.zoom', serviceZoomCtrab);
});