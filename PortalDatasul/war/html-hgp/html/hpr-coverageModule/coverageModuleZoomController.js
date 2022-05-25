define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    coverageModuleZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function coverageModuleZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpr/fchsauhprglobal/:method/:id');
        service.zoomName       = 'Módulo';
        service.setConfiguration('hpr.coverageModuleZoomController');
        service.idSearchMethod = 'getCoverageModuleByZoomId';
        service.applyFilterMethod = 'getCoverageModulesForZoom';
        service.propertyFields = [        
		{   label: 'Código',  	       
                    property: 'cdModulo', 
                    type: 'integer',
                    default: true
                },{   
                    label: 'Descrição',     
                    property: 'dsModulo',
                    type: 'string'
                }
	];
            
        service.columnDefs = [
            {   headerName: 'Código', 
                field: 'cdModulo', 
                width: 110, 
                minWidth: 100
             }, {
                 headerName: 'Descrição', 
                 field: 'dsModulo', 
                 width: 150, 
                 minWidth: 100
             }
        ];
        
        // Buscar descriÃ§Ãµes (input)
        service.getObjectFromValue = function (value) {     
            
            if(!value) return;
            
            return this.resource.TOTVSGet(
                    {method: this.idSearchMethod,
                         id: value}, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }
    
    index.register.factory('hpr.coverageModuleZoomController', coverageModuleZoomController);

});
