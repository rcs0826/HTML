define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js' 
], function (index) {

	anestheticMeasureZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function anestheticMeasureZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauhrcglobal/:method/:id');
        service.zoomName = 'Porte Anestésico';
        service.setConfiguration('hrc.anestheticMeasureZoomController');
        service.idSearchMethod = 'getPortanesByZoomId';
        service.applyFilterMethod = 'getPortanesForZoom';
        
        service.useCache = false;

        service.propertyFields = [
            {   label: 'Código',
                property: 'cdPorteAnestesico',
                type: 'integer'
            },{
                label: 'Descrição',
                property: 'dsPorteAnestesico',
                type: 'string',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdPorteAnestesico',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsPorteAnestesico',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Porte Padrão',
                field: 'rotuloPortePadrao',
                width: 150,
                minWidth: 100
            }
        ];

        /*service.validateSelectedValue = function(value){
            return true;
        };*/
        
        // Buscar descricoes (input)
        service.getObjectFromValue = function (value, fixedFilters) {     

            if(!(value >= 0)) return;
            
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

    index.register.factory('hrc.anestheticMeasureZoomController', anestheticMeasureZoomController);

});
