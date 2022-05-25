define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	providerProfessionalLinkedZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function providerProfessionalLinkedZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauprofisvincprestdorjurid/:method/:id');
        service.zoomName = 'Profissional Executante';
        service.setConfiguration('global.providerProfessionalLinkedZoomController');
        service.idSearchMethod = 'getProfisVincPrestdorJuridForZoomId';
        service.applyFilterMethod = 'getProfisVincPrestdorJuridForZoom';
        service.useCache = false;

        service.propertyFields = [
            {
                label: 'Nome do Profissional',
                property: 'nomPrestdor',
                type: 'string',
                operator: 'begins',
                default: true 
            },{
                label: 'CPF',
                property: 'codCpf',
                type: 'string'
            },{
                label: 'Conselho/Número do Conselho/UF',
                property: 'chaveConselho',
                type: 'string'
            },{
                label: 'UF Conselho',
                property: 'codUfConsMedic',
                type: 'string'
            },{
                label: 'Conselho Profissional',
                property: 'codConsMedic',
                type: 'string'
            },{
                label: 'Número do Conselho',
                property: 'codRegistro',
                type: 'integer'
            }
		];
            
        service.columnDefs = [
            {
                headerName: 'UF Conselho',
                field: 'codUfConsMedic'
             },{
                headerName: 'Conselho',
                field: 'codConsMedic'
             },{
                headerName: 'Registro',
                field: 'codRegistro'
             },{
                headerName: 'Nome',
                field: 'nomPrestdor'
            },{
                headerName: 'CPF',
                field: 'codCpf'
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
            
            params.id = encodeURIComponent(value);
            params.method = this.idSearchMethod;

            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }

    index.register.factory('global.providerProfessionalLinkedZoomController', providerProfessionalLinkedZoomController);

});
