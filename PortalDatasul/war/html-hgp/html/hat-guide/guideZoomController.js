define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	guideZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function guideZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hat/fchsauguide/:method/:id');
        service.zoomName = 'Guia de Autorização';
        service.setConfiguration('hat.guideZoomController');
        service.idSearchMethod = 'getGuideByZoomId';
        service.applyFilterMethod = 'getGuidesForZoom';
        service.propertyFields = [
            {
                label: 'Ano e Número',
                property: 'aaNrGuiaAtendimento',
                type: 'string',
                default: true
            },{
                label: 'Data de Emissão',
                property: 'dtEmissaoGuia',
                type: 'date'
            }/*,{
                label: 'Beneficiário',
                property: 'cdUnicCdCarteiraUsuario',
                type: 'string'
            }*/,{
                label: 'Carteira do Beneficiário',
                property: 'cdUnidCdCarteiraUsuarioZoom',
                type: 'string'
            },{
                label: 'Modalidade/Contrato',
                property: 'nrModalidadeTerAdesao',
                type: 'string'
            }
		];
            
        service.columnDefs = [
            {
                headerName: 'Ano',
                field: 'aaGuiaAtendimento',
                width: 50,
                minWidth: 50
            },{
                headerName: 'Número',
                field: 'nrGuiaAtendimento',
                width: 75,
                minWidth: 75
            },{
                headerName: 'Data de Emissão',
                field: 'rotuloDtEmissaoGuia',
                width: 100,
                minWidth: 100,
            },{
                headerName: 'Situação',
                field: 'rotuloSituacaoGuia',
                width: 125,
                minWidth: 125
            },{
                headerName: 'Guia Principal',
                field: 'rotuloGuiaPrincipal',
                width: 100,
                minWidth: 100
            },{
                headerName: 'Modalidade',
                field: 'cdModalidade',
                width: 100,
                minWidth: 100
            },{
                headerName: 'Contrato',
                field: 'nrTerAdesao',
                width: 100,
                minWidth: 100
            },{
                headerName: 'Beneficiário',
                field: 'rotuloBenef',
                width: 300,
                minWidth: 300
            },{
                headerName: 'Via',
                field: 'nrViaCarteira',
                width: 50,
                minWidth: 50
            },{
                headerName: 'Prestador Principal',
                field: 'rotuloPrestadorPrinc',
                width: 300,
                minWidth: 300
            },{
                headerName: 'Prestador Solicitante',
                field: 'rotuloPrestadorSolic',
                width: 300,
                minWidth: 300
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

    index.register.factory('hat.guideZoomController', guideZoomController);

});
