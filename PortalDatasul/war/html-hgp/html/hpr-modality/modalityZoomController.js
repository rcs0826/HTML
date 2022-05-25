define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    modalityZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function modalityZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpr/fchsauhprglobal/:method/:id');
        service.zoomName       = 'Modalidade';
        service.setConfiguration('hpr.modalityZoomController');
        service.idSearchMethod = 'getModalityByZoomId';
        service.applyFilterMethod = 'getModalitiesForZoom';
        service.propertyFields = [        
		{   label: 'Código',  	       
                    property: 'cdModalidade', 
                    type: 'integer',
                    default: true
                },{   
                    label: 'Descrição',     
                    property: 'dsModalidade',
                    type: 'string'
                }
	];
            
        service.columnDefs = [
            {   headerName: 'Código', 
                field: 'cdModalidade', 
                width: 110, 
                minWidth: 100
             }, {
                 headerName: 'Descrição', 
                 field: 'dsModalidade', 
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
    
    index.register.factory('hpr.modalityZoomController', modalityZoomController);

});
