define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

        adhesionContractZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
        function adhesionContractZoomController($injector, $totvsresource, zoomService, dtsUtils) {

            var service = {};
            
            angular.extend(service, zoomService);

            service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/global/fchsauadhesioncontract/:method/:id');
            service.zoomName       = 'Termo de Adesão';
            service.setConfiguration('global.adhesionContractZoomController');
            service.idSearchMethod = 'getAdhesionContractByZoomId';
            service.applyFilterMethod = 'getAdhesionContractForZoom';
            service.useCache = false;
            service.propertyFields = [      
            {   
                label: 'Termo Adesão',
                property: 'nrTerAdesao',
                type: 'integer',
                default: true
            },
            {   
                label: 'Código Contratante',
                property: 'cdContratante',
                type: 'integer'
            },    
            {
                label: 'Proposta',
                property: 'nrProposta',
                type: 'integer'
        },
            {
                label: 'Nome Contratante',
                property: 'nmContratante',
                type: 'string'
            }
        ];
            
        service.columnDefs = [
            {
                headerName: 'Modalidade', 
                field: 'cdModalidade',
                width: 50, 
                minWidth: 100
            },
            {
                headerName: 'Termo Adesão', 
                field: 'nrTerAdesao',
                width: 60, 
                minWidth: 100
            },
            {
                headerName: 'Proposta', 
                field: 'nrProposta',
                width: 60, 
                minWidth: 100
            },
            {
                headerName: 'Contratante', 
                field: 'cdContratante',
                width: 80, 
                minWidth: 100
            }, 
            {
                headerName: 'Nome Contratante', 
                field: 'nmContratante',
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
    
    index.register.factory('global.adhesionContractZoomController', adhesionContractZoomController);

});
