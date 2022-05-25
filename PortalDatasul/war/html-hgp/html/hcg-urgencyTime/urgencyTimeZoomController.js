define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	urgencyTimeZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function urgencyTimeZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauhcgglobal/:method/:id');
        service.zoomName = 'Horário de Urgência';
        service.setConfiguration('hcg.urgencyTimeZoomController');
        service.idSearchMethod = 'getUrgencyTimeByZoomId';
        service.applyFilterMethod = 'getUrgencyTimesForZoom';
        service.propertyFields = [
            {   label: 'Código',
                property: 'cdTabUrge',
                type: 'integer',
                default: true
            },{
                label: 'Descrição',
                property: 'dsTabUrge',
                type: 'string'
            }
		];
        
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdTabUrge',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsTabUrge',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Tab. Médica',
                field: 'cdTabPrecoProc',
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

    index.register.factory('hcg.urgencyTimeZoomController', urgencyTimeZoomController);

});
