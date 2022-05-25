define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	hospitalClassZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function hospitalClassZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauhcgglobal/:method/:id');
        service.zoomName = 'Classe Hospitalar';
        service.setConfiguration('hcg.hospitalClassZoomController');
        service.idSearchMethod = 'getHospitalClassByZoomId';
        service.applyFilterMethod = 'getHospitalClassesForZoom';
        service.propertyFields = [
            {   label: 'Código',
                property: 'cdClaHos',
                type: 'integer'
            },{
                label: 'Descrição',
                property: 'dsClaHos',
                type: 'string',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdClaHos',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsClaHos',
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

    index.register.factory('hcg.hospitalClassZoomController', hospitalClassZoomController);

});
