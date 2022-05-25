define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	emsFinancialFlowTypeZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function emsFinancialFlowTypeZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/shared/fchsausharedglobal/:method/:id');
        service.zoomName = 'Tipos de Receitas/Despesas';
        service.setConfiguration('global.emsFinancialFlowTypeZoomController');
        service.idSearchMethod = 'getEmsFinancialFlowTypeByZoomId';
        service.applyFilterMethod = 'getEmsFinancialFlowTypesForZoom';

        service.propertyFields = [
            {   label: 'Código',
                property: 'codTipFluxoFinanc',
                type: 'string',
                default: true
            },{
                label: 'Nome',
                property: 'desTipFluxoFinanc',
                type: 'string'
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'codTipFluxoFinanc',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Nome',
                field: 'desTipFluxoFinanc',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Tipo',
                field: 'indTipSecaoFluxoCx',
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

    index.register.factory('global.emsFinancialFlowTypeZoomController', emsFinancialFlowTypeZoomController);

});
