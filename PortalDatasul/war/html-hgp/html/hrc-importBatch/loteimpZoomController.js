define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	loteimpZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function loteimpZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauhrcglobal/:method/:nrLote/:nrSequencia');
        service.zoomName = 'Lote de Importação';
        service.setConfiguration('hrc.loteimpZoomController');
        service.idSearchMethod = 'getLoteimpByZoomId';
        service.applyFilterMethod = 'getLoteimpForZoom';
        service.propertyFields = [
            {   label: 'Lote/Sequência',
                property: 'nrLoteNrSequencia',
                type: 'string',
                default: true
            }
		];
            
        service.columnDefs = [
            {   
                headerName: 'Unidade',
                field: 'cdUnidade',
                width: 100,
                minWidth: 100
            },{
                headerName: 'Código Prestador',
                field: 'cdPrestador',
                width: 130,
                minWidth: 100
            },{
                headerName: 'Lote',
                field: 'nrLote',
                width: 130,
                minWidth: 100
            },{
                headerName: 'Sequência',
                field: 'nrSequencia',
                width: 100,
                minWidth: 100
            },{
                headerName: 'Data de Importação',
                field: 'rotuloDtImportacao',
                width: 130,
                minWidth: 100
            },{
                headerName: 'Status do Lote',
                field: 'rotuloStatusLote',
                width: 300,
                minWidth: 100,
                lockable: false
            },{
                headerName: 'Tipo do Lote',
                field: 'rotuloTipoLote',
                width: 350,
                minWidth: 100
            },{
                headerName: 'Nome do Arquivo',
                field: 'nmArqLote',
                width: 450,
                minWidth: 100
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
            
            params.nrLote = value.split("/")[0];

            if(angular.isUndefined(value.split("/")[1])){
                params.nrSequencia = 0;
            }else{
                params.nrSequencia = value.split("/")[1];
            }

            params.method = this.idSearchMethod;
            
            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }

    index.register.factory('hrc.loteimpZoomController', loteimpZoomController);

});
