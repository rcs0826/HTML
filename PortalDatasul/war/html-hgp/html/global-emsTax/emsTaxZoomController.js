define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	emsTaxZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function emsTaxZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/shared/fchsausharedglobal/:method/:id');
        service.zoomName = 'Imposto';
        service.setConfiguration('global.emsTaxZoomController');
        service.idSearchMethod = 'getEmsTaxByZoomId';
        service.applyFilterMethod = 'getEmsTaxesForZoom';

        service.propertyFields = [
            {   label: 'Código',
                property: 'codImposto',
                type: 'string',
                default: true
            },{
                label: 'Nome',
                property: 'desImposto',
                type: 'string'
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'codImposto',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Nome',
                field: 'desImposto',
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
            params.method = this.idSearchMethod;
            
            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }

    index.register.factory('global.emsTaxZoomController', emsTaxZoomController);

});
