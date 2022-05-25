define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	restrictionZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service', 'TOTVSEvent'];
	function restrictionZoomController($injector, $totvsresource, zoomService, dtsUtils, TOTVSEvent) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauhrcglobal/:method/:id');
        service.zoomName = 'Glosa';
        service.setConfiguration('hrc.restrictionZoomController');
        service.idSearchMethod = 'getRestrictionByZoomId';
        service.applyFilterMethod = 'getRestrictionsForZoom';
        service.propertyFields = [
            {   label: 'Código',
                property: 'cdCodGlo',
                type: 'integer',
                operator: '>='
            },{
                label: 'Descrição',
                property: 'dsCodGlo',
                type: 'string',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdCodGlo',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsCodGlo',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Classe de Erro',
                field: 'rotuloClasseErro',
                width: 150,
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
            
            params.id = value;
            params.method = this.idSearchMethod;
            
            return this.resource.TOTVSGet(params, undefined, {noErrorMessage: true}, true);
        };
            
        return service;
    }

    index.register.factory('hrc.restrictionZoomController', restrictionZoomController);

});
