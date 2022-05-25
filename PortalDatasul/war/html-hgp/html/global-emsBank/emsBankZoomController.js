define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    emsBankZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function emsBankZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/shared/fchsausharedglobal/:method/:id');
        service.zoomName       = 'Bancos';
        service.setConfiguration('global.emsBankZoomController');
        service.idSearchMethod = 'getEmsBankByZoomId';
        service.applyFilterMethod = 'getEmsBanksForZoom';
        service.propertyFields = [        
		{   label: 'Código',  	       
                    property: 'codBanco', 
                    type: 'string',
                    default: true
                },{   
                    label: 'Descrição',     
                    property: 'nomBanco',
                    type: 'string'
                }
	    ];
            
        service.columnDefs = [
            {   headerName: 'Código', 
                field: 'codBanco', 
                width: 110, 
                minWidth: 100
             }, {
                 headerName: 'Descrição', 
                 field: 'nomBanco', 
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
    
    index.register.factory('global.emsBankZoomController', emsBankZoomController);

});
