define(['index',    
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	providerCouncilZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function providerCouncilZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauhcgglobal/:method/:id');
        service.zoomName = 'Conselho';
        service.setConfiguration('hcg.providerCouncilZoomController');
        service.idSearchMethod = 'getProviderCouncilByZoomId';
        service.applyFilterMethod = 'getProviderCouncilsForZoom';
        service.propertyFields = [
            {   label: 'Código',
                property: 'cdConselho',
                type: 'string'
            },{
                label: 'Descrição',
                property: 'dsConselho',
                type: 'string',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdConselho',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsConselho',
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

    index.register.factory('hcg.providerCouncilZoomController', providerCouncilZoomController);

});
