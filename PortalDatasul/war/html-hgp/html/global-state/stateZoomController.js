define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	stateZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function stateZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/healthmanagementwebservices/rest/hrc/document/zoom/getStateByFilter/:id');
        service.zoomName = 'Estado (UF)';
        service.setConfiguration('global.stateZoomController');
        service.propertyFields = [
            {   label: 'Sigla',
                property: 'enUf',
                type: 'string'
            },{
                label: 'Nome',
                property: 'nmEstado',
                type: 'string',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Sigla',
                field: 'enUf',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Nome',
                field: 'nmEstado',
                width: 150,
                minWidth: 100
            }
        ];
        
        // Buscar descricoes (input)
        service.getObjectFromValue = function (value, fixedFilters) {     
            
            if(!value) return;
            
            var params = {};
            
            if(fixedFilters){
                var conversionParams = {};
                if(fixedFilters.hasOwnProperty('filters')){
                    conversionParams = {parameters: {init: fixedFilters}};
            	}else{
                    conversionParams = {parameters: {init: { filters : fixedFilters}}};
            	}
                
                params = dtsUtils.mountQueryProperties(conversionParams);
            }
            
            params.id = value;
            
            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }

    index.register.factory('global.stateZoomController', stateZoomController);

});
