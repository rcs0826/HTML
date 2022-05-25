define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	providerGroupZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function providerGroupZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauhcgglobal/:method/:id');
        service.zoomName = 'Grupos do Prestador';
        service.setConfiguration('hcg.providerGroupZoomController');
        service.idSearchMethod = 'getProviderGroupByZoomId';
        service.applyFilterMethod = 'getProvidersGroupsForZoom';

        service.propertyFields = [
            {   label: 'Código',
                property: 'cdGrupoPrestador',
                type: 'integer',
                default: true
            },{   label: 'Código Inicial',
                property: 'cdGrupoPrestadorIni',
                type: 'integer',
                default: true
            },{
                label: 'Nome',
                property: 'dsGrupoPrestador',
                type: 'string'
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdGrupoPrestador',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Nome',
                field: 'dsGrupoPrestador',
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

    index.register.factory('hcg.providerGroupZoomController', providerGroupZoomController);

});
