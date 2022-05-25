define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	cityZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function cityZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauhcgglobal/:method/:id');
        service.zoomName = 'Cidades';
        service.setConfiguration('hcg.cityZoomController');
        service.idSearchMethod = 'getCityByZoomId';
        service.applyFilterMethod = 'getCitiesForZoom';

        service.propertyFields = [
            {   label: 'Código',
                property: 'cdCidade',
                type: 'integer',
                default: true
            },{
                label: 'Nome',
                property: 'nmCidade',
                type: 'string'
            },{
                label: 'Estado',
                property: 'estado',
                type: 'string'
            },{
                label: 'Código IBGE',
                property: 'ibge',
                type: 'integer'
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
            },{
                headerName: 'Estado',
                field: 'estado',
                width: 50,
                minWidth: 100
            },{
                headerName: 'Código IBGE',
                field: 'ibge',
                width: 80,
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
            params.method = this.idSearchMethod;
            
            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }

    index.register.factory('hcg.cityZoomController', cityZoomController);

});
