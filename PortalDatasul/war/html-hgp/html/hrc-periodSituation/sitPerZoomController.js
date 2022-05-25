define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	sitPerZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function sitPerZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauhrcglobal/:method/:id');
        service.zoomName = 'Situação do Período';
        service.setConfiguration('hrc.sitPerZoomController');
        service.idSearchMethod = 'getSitPerByZoomId';
        service.applyFilterMethod = 'getSitPerForZoom';
        service.propertyFields = [
            {   
                label: 'Código',
                property: 'cdSitPer',
                type: 'integer',
                default: true
            },
            {   
                label: 'Descrição',
                property: 'dsSitPer',
                type: 'string',
                operator: 'begins'
            }
		];
            
        service.columnDefs = [
            {   
                headerName: 'Código',
                field: 'cdSitPer',
                width: 150,
                minWidth: 100
            },
            {   
                headerName: 'Descrição',
                field: 'dsSitPer',
                width: 150,
                minWidth: 100
            }
        ];
        
         /* Foi colocada essa funcao para que permita pesquisar valores em branco
         * ja que a funcao padrao localizada no zoom.js nao permite,
         * dessa forma todas as situações serão carregadas qdo o campo for mostrado
         */
        service.validateSelectedValue = function(value){
            return true;
        };

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

    index.register.factory('hrc.sitPerZoomController', sitPerZoomController);

});
