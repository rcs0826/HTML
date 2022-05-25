define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	beneficiaryZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function beneficiaryZoomController($injector, $totvsresource, zoomService, dtsUtils) {

        var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hvp/fchsaubeneficiary/:method/:id');
        service.zoomName       = 'Beneficiários';
        service.setConfiguration('hvp.beneficiaryZoomController');
        service.idSearchMethod = 'getBeneficiaryByZoomId';
        service.applyFilterMethod = 'getBenefsForZoom';
        service.propertyFields = [
            {   label: 'Unidade',
                property: 'cdUnidade',
                type: 'integer'
            },{
                label: 'Carteira',
                property: 'cdUnidCdCarteiraInteira',
                type: 'string',
                default: true
            },{
                label: 'Nome',
                property: 'nmUsuario',
                type: 'string',
                operator: 'begins'
            },{
                label: 'Modalidade/Contrato',
                property: 'cdModalidNrTerAdesao',
                type: 'string'            
            },{
                label: 'Nome Internacional',
                property: 'nmInternacional',
                type: 'string',
                operator: 'begins'
            },{
                label: 'Nome Contr. Origem',
                property: 'nmContratanteOrigem',
                type: 'string',
                operator: 'begins'
            },{
                label: 'Nome Contratante',
                property: 'nmContratante',
                type: 'string',
                operator: 'begins'
            },{
                label: 'CPF',
                property: 'cdCpf',
                type: 'string',
                maxlength: 14
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Carteira',
                field: 'cdUnidCdCarteiraInteira',
                width: 140,
                minWidth: 100
            },{
                headerName: 'Nome',
                field: 'nmUsuario',
                width: 210,
                minWidth: 200
            },{
                headerName: 'Modalidade',
                field: 'cdModalidade',
                width: 100,
                minWidth: 100
            },{
                headerName: 'Contrato',
                field: 'nrTerAdesao',
                width: 80,
                minWidth: 80
            },{
                headerName: 'CPF',
                field: 'cdCpf',
                width: 105,
                minWidth: 105
            },{
                headerName: 'Exclusão Benef.',
                field: 'rotuloDtExclusaoPlano',
                width: 110,
                minWidth: 80
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
            
            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: false}, true);
        };
            
        return service;
    }

    index.register.factory('hvp.beneficiaryZoomController', beneficiaryZoomController);

});
