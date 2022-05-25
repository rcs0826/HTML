define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    emsPaymentFormZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function emsPaymentFormZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/shared/fchsausharedglobal/:method/:id');
        service.zoomName       = 'Formas de Pagamento';
        service.setConfiguration('global.emsPaymentFormZoomController');
        service.idSearchMethod = 'getEmsPaymentFormByZoomId';
        service.applyFilterMethod = 'getEmsPaymentFormsForZoom';
        service.propertyFields = [        
		{   label: 'Código',  	       
                    property: 'codFormaPagto', 
                    type: 'string',
                    default: true
                },{   
                    label: 'Descrição',     
                    property: 'desFormaPagto',
                    type: 'string'
                }
	    ];
            
        service.columnDefs = [
            {   headerName: 'Código', 
                field: 'codFormaPagto', 
                width: 110, 
                minWidth: 100
             }, {
                 headerName: 'Descrição', 
                 field: 'desFormaPagto', 
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
    
    index.register.factory('global.emsPaymentFormZoomController', emsPaymentFormZoomController);

});
