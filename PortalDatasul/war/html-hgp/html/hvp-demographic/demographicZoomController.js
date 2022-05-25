define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	demographicZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function demographicZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsaudemographic/:method/:id');
        service.zoomName = 'Pessoa Física';
        service.setConfiguration('hvp.demographicZoomController');
        service.idSearchMethod = 'getDemographicByZoomId';
        service.applyFilterMethod = 'getDemographicForZoom';
        service.propertyFields = [
            {   
                label: 'Código',
                property: 'idPessoa',
                type: 'integer',
                default: true
            },{   
                label: 'CPF',
                property: 'cdCpf',
                type: 'string'
            },{
                label: 'Nome',
                property: 'nmPessoa',
                type: 'string',
                operator: 'begins',
                
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'idPessoa',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Nome',
                field: 'nmPessoa',
                width: 150,
                minWidth: 100
            },{
                headerName: 'CPF',
                field: 'cdCpf',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Data de Nascimento',
                field: 'dtNascimento',
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

    index.register.factory('hvp.demographicZoomController', demographicZoomController);

});
