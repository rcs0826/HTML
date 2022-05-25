define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	medicalSpecialtyZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function medicalSpecialtyZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/healthmanagementwebservices/rest/hrc/document/zoom/getMedicalSpecialtyByFilter/:id');
        service.zoomName = 'Especialidade';
        service.setConfiguration('hrc.medicalSpecialtyZoomController');
        service.propertyFields = [
            {   label: 'Código',
                property: 'cdEspecialid',
                type: 'integer'
            },{
                label: 'Descrição',
                property: 'dsEspecialid',
                type: 'string',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdEspecialid',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsEspecialid',
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

    index.register.factory('hrc.medicalSpecialtyZoomController', medicalSpecialtyZoomController);

});
