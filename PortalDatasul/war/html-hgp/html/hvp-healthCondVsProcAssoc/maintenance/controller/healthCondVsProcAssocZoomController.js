define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    transactionZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function transactionZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsauhvpglobal/:method/:id');
        service.zoomName       = 'CondicaoSaude';
        service.setConfiguration('hvp.condicaoSaudeZoomController');
        service.idSearchMethod = 'getTransactionByZoomId';
        service.applyFilterMethod = 'getTransactionsForZoom';
        service.propertyFields = [
        {   label: 'Condição de Saúde',           
                    property: 'cdCondicaoSaude', 
                    type: 'integer',
                    default: true
                },{   
                    label: 'Descrição',     
                    property: 'dsCondicaoSaude',
                    type: 'string'
                }
    ];
            
        service.columnDefs = [
            {   headerName: 'Condição de Saúde', 
                field: 'cdCondicaoSaude', 
                width: 110, 
                minWidth: 100
             }, {
                 headerName: 'Descrição', 
                 field: 'dsCondicaoSaude', 
                 width: 150, 
                 minWidth: 100
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
    
    index.register.factory('hvp.healthCondVsProcAssocZoomController', healthCondVsProcAssocZoomController);

});
