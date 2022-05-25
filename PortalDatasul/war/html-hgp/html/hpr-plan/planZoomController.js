define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    planZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function planZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpr/fchsauhprglobal/:method/:id');
        service.zoomName       = 'Plano';
        service.setConfiguration('hpr.planZoomController');
        service.idSearchMethod = 'getPlanByZoomId';
        service.applyFilterMethod = 'getPlanForZoom';
        service.useCache = false;
        service.propertyFields = [        
		{   label: 'Código',  	       
                    property: 'cdPlano', 
                    type: 'integer',
                    default: true
                },{   
                    label: 'Descrição',     
                    property: 'nmPlano',
                    type: 'string'
                }
	];
            
        service.columnDefs = [
            {   headerName: 'Código', 
                field: 'cdPlano', 
                width: 110, 
                minWidth: 100
             }, {
                 headerName: 'Descrição', 
                 field: 'nmPlano', 
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
    
    index.register.factory('hpr.planZoomController', planZoomController);

});
