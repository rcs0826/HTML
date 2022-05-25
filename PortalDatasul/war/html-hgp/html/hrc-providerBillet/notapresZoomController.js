define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	notapresZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function notapresZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauhrcglobal/:method/:id');
        service.zoomName = 'Fatura';
        service.setConfiguration('hrc.notapresZoomController');
        service.idSearchMethod = 'getNotapresByZoomId';
        service.applyFilterMethod = 'getNotapresForZoom';
        service.propertyFields = [
            /*{   label: 'Unidade/Prestador',
                property: 'unidadePrestador',
                type: 'string'
            },*/
            {
                label: 'Ano/Série/Número',
                property: 'aaFaturaCdSerieNfCodFaturAp',
                type: 'string',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Unidade',
                field: 'cdUnidade',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Código Prestador',
                field: 'cdPrestador',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Ano da Fatura',
                field: 'aaFatura',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Série da Fatura',
                field: 'cdSerieNf',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Código da Fatura',
                field: 'codFaturAp',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Tipo',
                field: 'rotuloNrFatura',
                width: 150,
                minWidth: 100
            }
        ];
        
        service.validateSelectedValue = function(parameters){
            if(!parameters.selectedFilterValue
            || parameters.selectedFilterValue.length < 4
            || ! StringTools.hasOnlyNumbers(parameters.selectedFilterValue.substring(0, 4))){
                return false;
            }
            return true;
        }

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

    index.register.factory('hrc.notapresZoomController', notapresZoomController);

});
