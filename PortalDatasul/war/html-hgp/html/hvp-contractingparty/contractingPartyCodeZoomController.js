define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {
 
	contractingPartyCodeZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function contractingPartyCodeZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsauhvpglobal/:method/:id');
        service.zoomName       = 'Contratante';
        service.setConfiguration('hvp.contractingPartyCodeZoomController');
        service.idSearchMethod = 'getContractingPartyCodeByZoomId';
        service.applyFilterMethod = 'getContractingPartyCodeForZoom';
        service.propertyFields = [
            {
                label: 'Inscrição',
                property: 'nrInscContratante',
                type: 'integer'
            },
            {
                label: 'Código',
                property: 'cdContratante',
                type: 'integer',
            },
            {
                label: 'CPF/CNPJ',
                property: 'nrCgcCpf',
                type: 'string',
                operator: 'begins'
            },
            {
                label: 'Nome',
                property: 'nmContratante',
                type: 'string',
                operator: 'begins',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Inscrição',
                field: 'nrInscContratante',
                width: 100,
                minWidth: 100
            },{   headerName: 'Código',
                field: 'cdContratante',
                width: 100,
                minWidth: 100
            },{   headerName: 'CPF/CNPJ',
                field: 'nrCgcCpf',
                width: 100,
                minWidth: 100
            },{
                headerName: 'Nome',
                field: 'nmContratante',
                width: 310,
                minWidth: 200
            }
        ];
        
        // Buscar descricoes (input)
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

    index.register.factory('hvp.contractingPartyCodeZoomController', contractingPartyCodeZoomController);

});
