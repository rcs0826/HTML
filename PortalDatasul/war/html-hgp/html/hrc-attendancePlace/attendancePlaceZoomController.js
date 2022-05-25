define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	attendancePlaceZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function attendancePlaceZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauhrcglobal/:method/:id');
        service.zoomName = 'Local de Atendimento';
        service.setConfiguration('hrc.attendancePlaceZoomController');
        service.idSearchMethod = 'getAttendancePlaceByZoomId';
        service.applyFilterMethod = 'getAttendancePlacesForZoom';
        service.propertyFields = [
            {   label: 'Código',
                property: 'cdLocalAtendimento',
                type: 'integer'
            },{
                label: 'Descrição',
                property: 'dsLocalAtendimento',
                type: 'string',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdLocalAtendimento',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsLocalAtendimento',
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

    index.register.factory('hrc.attendancePlaceZoomController', attendancePlaceZoomController);

});
