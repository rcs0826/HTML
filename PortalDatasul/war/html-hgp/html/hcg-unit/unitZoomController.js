define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	unitZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function unitZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauhcgglobal/:method/:id');
        service.zoomName = 'Unidades';
        service.setConfiguration('hcg.unitZoomController');
        service.idSearchMethod = 'getUnitByZoomId';
        service.applyFilterMethod = 'getUnitsForZoom';

        service.propertyFields = [
            {   label: 'Código',
                property: 'cdUnimed',
                type: 'integer',
                default: true
            },{
                label: 'Código Inicial',
                property: 'iniCdUnimed',
                type: 'integer',
                default: true
            },{
                label: 'Nome',
                property: 'nmUnimed',
                type: 'string'
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdUnimed',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Nome',
                field: 'nmUnimed',
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

    index.register.factory('hcg.unitZoomController', unitZoomController);

});
