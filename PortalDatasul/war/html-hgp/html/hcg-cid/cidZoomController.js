define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	cidZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function cidZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauhcgglobal/:method/:id');
        service.zoomName = 'CID';
        service.setConfiguration('hcg.cidZoomController');
        service.idSearchMethod = 'getCidByZoomId';
        service.applyFilterMethod = 'getCidsForZoom';
        service.propertyFields = [
            {   label: 'Código',
                property: 'cdCid',
                type: 'string'
            },{
                label: 'Descrição',
                property: 'dsDoenca',
                type: 'string',
                operator: 'begins',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdCid',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsDoenca',
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

    index.register.factory('hcg.cidZoomController', cidZoomController);

});
