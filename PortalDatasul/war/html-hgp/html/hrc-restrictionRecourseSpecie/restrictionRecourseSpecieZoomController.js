define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
	'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    restrictionRecourseSpecieZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function restrictionRecourseSpecieZoomController($injector, $totvsresource, zoomService, dtsUtils) {

	var service = {};
        
        angular.extend(service, zoomService);

        service.resource =  $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauhrcglobal/:method/:id');
        service.zoomName = 'Espécie Recurso de Glosa';
        service.setConfiguration('hrc.restrictionRecourseSpecieZoomController');
        service.idSearchMethod = 'getRestrictionRecourseSpecieByZoomId';
        service.applyFilterMethod = 'getRestrictionRecourseSpecieForZoom';
        service.useCache = false;

        service.propertyFields = [
            {   label: 'Espécie Documento',
                property: 'codEspecDocto',
                type: 'string',
                default: true
            },{
                label: 'Descrição Espécie',
                property: 'desEspecDocto',
                type: 'string'
            } 
		];
            
        service.columnDefs = [
            {   headerName: 'Espécie Documento',
                field: 'codEspecDocto',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição Espécie',
                field: 'desEspecDocto',
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

    index.register.factory('hrc.restrictionRecourseSpecieZoomController', restrictionRecourseSpecieZoomController);

});
