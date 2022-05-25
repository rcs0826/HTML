define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    ledgerAccountZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function ledgerAccountZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hpp/fchsauhppglobal/:method/:id');
        service.zoomName       = 'Conta Contábil';
        service.setConfiguration('hpp.ledgerAccountZoomController');
        service.idSearchMethod = 'getLedgerAccountByZoomId';
        service.applyFilterMethod = 'getLedgerAccountsForZoom';
        service.propertyFields = [        
		{   label: 'Código',  	       
                    property: 'codCtaCtbl', 
                    type: 'string',
                    default: true
                },{   
                    label: 'Descrição',     
                    property: 'desTitCtbl',
                    type: 'string'
                }
	];
            
        service.columnDefs = [
            {   headerName: 'Código', 
                field: 'codCtaCtbl', 
                width: 110, 
                minWidth: 100
             }, {
                 headerName: 'Descrição', 
                 field: 'desTitCtbl', 
                 width: 150, 
                 minWidth: 100
             }, {
                headerName: 'Tipo', 
                field: 'indEspecCtaCtbl', 
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
    
    index.register.factory('hpp.ledgerAccountZoomController', ledgerAccountZoomController);

});
