define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    reasonZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function reasonZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrs/fchsaureason/:method/:id');
        service.zoomName       = 'Motivo';
        service.setConfiguration('hrs.reasonZoomController');
        service.idSearchMethod = 'getReasonByZoomId';
        service.applyFilterMethod = 'getReasonsForZoom';
        service.propertyFields = [
		{   label: 'Código',  	       
                    property: 'idMotivo', 
                    type: 'integer',
                    default: true
                },{   
                    label: 'Descrição',     
                    property: 'dsMotivo',
                    type: 'string'
                }
	];
            
        service.columnDefs = [
            {   headerName: 'Natureza', 
                field: 'dsNatureza', 
                width: 210, 
                minWidth: 200
             },
            {   headerName: 'Código', 
                field: 'idMotivo', 
                width: 70, 
                minWidth: 70
             }, {
                 headerName: 'Descrição', 
                 field: 'dsMotivo', 
                 width: 250, 
                 minWidth: 200
             }
        ];
        
        // Buscar descrições (input)
        service.getObjectFromValue = function (value) {     
            
            if(!value) return;
            
            return this.resource.TOTVSGet(
                    {method: this.idSearchMethod,
                         id: value}, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }
    
    index.register.factory('hrs.reasonZoomController', reasonZoomController);

});
