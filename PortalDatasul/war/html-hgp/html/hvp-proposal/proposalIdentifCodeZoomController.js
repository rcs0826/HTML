define(['index',
    '/dts/hgp/html/util/zoom/zoom.js',
    '/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    proposalIdentifCodeZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function proposalIdentifCodeZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsauhvpglobal/:method/:id');
        service.zoomName       = 'Empresa';
        service.setConfiguration('hvp.proposalIdentifCodeZoomController');
        service.idSearchMethod = 'getProposalIdentifCodeByZoomId';
        service.applyFilterMethod = 'getProposalIdentifCodeForZoom';
        service.propertyFields = [
		{   label: 'Código',  	       
                    property: 'cdEmpresa', 
                    type: 'integer',
                    default: true
                }/*,{   
                    label: 'Descrição',     
                    property: 'dsEmpresa',
                    type: 'string'
                }*/
	];
            
        service.columnDefs = [
            {   headerName: 'Código', 
                field: 'cdEmpresa', 
                width: 110, 
                minWidth: 100
             }/*, {
                 headerName: 'Descrição', 
                 field: 'dsEmpresa', 
                 width: 150, 
                 minWidth: 100
             }*/
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
    
    index.register.factory('hvp.proposalIdentifCodeZoomController', proposalIdentifCodeZoomController);

});
