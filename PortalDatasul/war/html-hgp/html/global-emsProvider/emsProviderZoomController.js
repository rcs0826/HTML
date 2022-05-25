define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	emsProviderZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function emsProviderZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/shared/fchsauprovider/:method/:id');
        service.zoomName = 'Fornecedores';
        service.setConfiguration('global.emsProviderZoomController');
        service.idSearchMethod = 'getEmsProviderByZoomId';
        service.applyFilterMethod = 'getEmsProvidersForZoom';

        service.propertyFields = [
            {   label: 'Código',
                property: 'cdnFornecedor',
                type: 'integer',
                default: true
            },{
                label: 'Nome',
                property: 'nomPessoa',
                type: 'string'
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdnFornecedor',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Nome',
                field: 'nomPessoa',
                width: 150,
                minWidth: 100
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
            
            params.id = value;
            params.method = this.idSearchMethod;
            
            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }

    index.register.factory('global.emsProviderZoomController', emsProviderZoomController);

});
