define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	cityZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function cityZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/healthmanagementwebservices/rest/hvp/beneficiary/zoom/getCityByFilter/:id');
        service.zoomName = 'Cidades';
        service.setConfiguration('hvp.cityZoomController');
        service.propertyFields = [
            {   label: 'Código',
                property: 'cdCidade',
                type: 'integer',
                default: true
            },{
                label: 'Nome',
                property: 'nmCidade',
                type: 'string'
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdCidade',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Nome',
                field: 'nmCidade',
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

    index.register.factory('hvp.cityZoomController', cityZoomController);

});
