define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	unitZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function unitZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/healthmanagementwebservices/rest/hrc/document/zoom/getUnitByFilter/:id');
        service.zoomName = 'Unidade';
        service.setConfiguration('hrc.unitZoomController');
        service.propertyFields = [
            {   label: 'Código',
                property: 'cdUnimed',
                type: 'integer'
            },{
                label: 'Descrição',
                property: 'nmUnimed',
                type: 'string',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdUnimed',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
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
            
            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }

    index.register.factory('hrc.unitZoomController', unitZoomController);

});
