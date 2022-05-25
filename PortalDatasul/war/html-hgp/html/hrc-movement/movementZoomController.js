define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
	'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    movementZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function movementZoomController($injector, $totvsresource, zoomService, dtsUtils) {

	var service = {};
        
        angular.extend(service, zoomService);

        service.resource =  $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsaumovements/:method/:id');
        service.zoomName = 'Movimento';
        service.setConfiguration('hrc.movementZoomController');
        service.idSearchMethod = 'getMovementByZoomId';
        service.applyFilterMethod = 'getMovementsForZoom';
        service.useCache = false;

        service.propertyFields = [
            {   label: 'Código ou Início do Código',
                property: 'iniCdMovimento',
                type: 'integer'
            },{
                label: 'Descrição',
                property: 'dsMovimento',
                type: 'string',
                default: true
            } /*,{
                label: 'Início do Código',
                property: 'iniCdMovimento',
                type: 'integer'
            }*/
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdMovimento',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsMovimento',
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

    index.register.factory('hrc.movementZoomController', movementZoomController);

});
