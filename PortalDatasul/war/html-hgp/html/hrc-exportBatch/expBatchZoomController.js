define(['index',        
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	expBatchZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function expBatchZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauhrcglobal/:method/:nrLote');
        service.zoomName = 'Lote de Importação';
        service.setConfiguration('hrc.expBatchZoomController');
        service.idSearchMethod = 'getLoteExpByZoomId';
        service.applyFilterMethod = 'getLoteExpForZoom';
        service.propertyFields = [
            {   label: 'Lote',
                property: 'nrLoteExp',
                type: 'string',
                default: true
            },
            {   label: 'Data Inicial Exportação',
                property: 'dtExportacaoLote', 
                type: 'date',
                operator: '>='                              
            }
		]; 
            
        service.columnDefs = [
            {   
                headerName: 'Unidade Destino',
                field: 'dsRotuloUnidade',
                width: 250,
                minWidth: 100
            },{
                headerName: 'Lote',
                field: 'nrLoteExp',
                width: 50,
                minWidth: 100
            },{
                headerName: 'Data de Exportação',
                field: 'rotuloDtExportacao',
                type: 'dateColumn',
                format: 'dd/MM/yyyy',
                width: 130,
                minWidth: 100
            },{
                headerName: 'Status do Lote',
                field: 'inStatusLote',
                width: 100,
                minWidth: 100,
                lockable: false
            }
        ];
        
        /* Foi colocada essa funcao para que permita pesquisar valores em branco
         * ja que a funcao padrao localizada no zoom.js nao permite,
         * dessa forma todos as glosas serao carregadas qdo o campo for mostrado
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
            
            params.nrLote = value;           

            params.method = this.idSearchMethod;
            
            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }

    index.register.factory('hrc.expBatchZoomController', expBatchZoomController);

});
