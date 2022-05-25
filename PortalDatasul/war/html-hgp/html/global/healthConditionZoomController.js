define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
	'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

    healthConditionZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function healthConditionZoomController($injector, $totvsresource, zoomService, dtsUtils) {

	var service = {};
        
        angular.extend(service, zoomService);

        service.resource =  $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsauhvpglobal/:method/:id');
        service.zoomName = 'Condição de Saúde';
        service.setConfiguration('hvp.healthConditionZoomController');
        service.idSearchMethod = 'getHealthConditionByZoomId';
        service.applyFilterMethod = 'getHealthConditionForZoom';

        service.propertyFields = [
            {   label: 'Código',
                property: 'cdCondicaoSaude',
                type: 'integer'
            },{
                label: 'Descrição',
                property: 'dsCondicaoSaude',
                type: 'string',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdCondicaoSaude',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsCondicaoSaude',
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

    index.register.factory('hvp.healthConditionZoomController', healthConditionZoomController);

});
