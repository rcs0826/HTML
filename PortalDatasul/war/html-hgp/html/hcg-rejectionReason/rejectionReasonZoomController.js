define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	rejectionReasonZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function rejectionReasonZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauhcgglobal/:method/:id');
        service.zoomName = 'Motivo de Cancelamento';
        service.setConfiguration('hcg.rejectionReasonZoomController');
        service.idSearchMethod = 'getRejectionReasonByZoomId';
        service.applyFilterMethod = 'getRejectionReasonsForZoom';
        service.propertyFields = [
            {   label: 'Código',
                property: 'cdMotivo',
                type: 'integer',
                default: true
            },{
                label: 'Descrição',
                property: 'dsMotivo',
                type: 'string'
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdMotivo',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsMotivo',
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

    index.register.factory('hcg.rejectionReasonZoomController', rejectionReasonZoomController);

});
