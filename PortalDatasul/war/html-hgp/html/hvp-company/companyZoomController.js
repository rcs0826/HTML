define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	companyZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function companyZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsaucompany/:method/:id');
        service.zoomName = 'Pessoa Jurídica';
        service.setConfiguration('hvp.companyZoomController');
        service.idSearchMethod = 'getCompanyByZoomId';
        service.applyFilterMethod = 'getCompanyForZoom';
        service.propertyFields = [
            {   
                label: 'CNPJ',
                property: 'cdCnpj',
                type: 'string'
            },{
                label: 'Nome',
                property: 'nmPessoa',
                type: 'string',
                operator: 'begins',
                default: true
            }
		];
            
        service.columnDefs = [
            {   
                headerName: 'Código',
                field: 'idPessoa',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Nome',
                field: 'nmPessoa',
                width: 150,
                minWidth: 100
            },{
                headerName: 'CNPJ',
                field: 'cdCnpj',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Data de Fundação',
                field: 'dtFundacao',
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

    index.register.factory('hvp.companyZoomController', companyZoomController);

});
