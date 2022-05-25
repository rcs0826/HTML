define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

        documentSpecieZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
        function documentSpecieZoomController($injector, $totvsresource, zoomService, dtsUtils) {

            var service = {};
            
            angular.extend(service, zoomService);

            service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/global/fchsaudocumentspecie/:method/:id');
            service.zoomName       = 'Espécies de Documentos';
            service.setConfiguration('global.documentSpecieZoomController');
            service.idSearchMethod = 'getDocumentSpecieByZoomId';
            service.applyFilterMethod = 'getDocumentSpecieForZoom';
            service.useCache = false;
            service.propertyFields = [        
            {   label: 'Código',  	       
                property: 'codEspecDocto', 
                type: 'string',
                default: true
            }, {   
                label: 'Descrição',     
                property: 'desEspecDocto',
                type: 'string'
            }
        ];
            
        service.columnDefs = [
            {   headerName: 'Código', 
                field: 'codigo',
                width: 110, 
                minWidth: 100
            }, {
                headerName: 'Descrição', 
                field: 'descricao',
                width: 150, 
                minWidth: 100
            }, {
                headerName: 'Tipo', 
                field: 'tipo',
                width: 150, 
                minWidth: 100
           }
        ];
        
        // Buscar descrições (input)
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
            
            params.id = encodeURIComponent(value);
            params.method = this.idSearchMethod;
            
            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: false}, true);
        };
            
        return service;
    }
    
    index.register.factory('global.documentSpecieZoomController', documentSpecieZoomController);

});
