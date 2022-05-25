define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    eventZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function eventZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrb/fchsauhrbglobal/:method/:id');
        service.zoomName       = 'Evento';
        service.setConfiguration('hrb.eventZoomController');
        service.idSearchMethod = 'getEventByZoomId';
        service.applyFilterMethod = 'getEventsForZoom';
        service.propertyFields = [        
		{   label: 'Código',  	       
                    property: 'cdEvento', 
                    type: 'integer',
                    default: true
                },{   
                    label: 'Descrição',     
                    property: 'dsEvento',
                    type: 'string'
                }
	];
            
        service.columnDefs = [
            {   headerName: 'Código', 
                field: 'cdEvento', 
                width: 110, 
                minWidth: 100
             }, {
                 headerName: 'Descrição', 
                 field: 'dsEvento', 
                 width: 150, 
                 minWidth: 100
             }, {
                headerName: 'Classe', 
                field: 'inClasseEvento', 
                width: 110, 
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
    
    index.register.factory('hrb.eventZoomController', eventZoomController);

});
