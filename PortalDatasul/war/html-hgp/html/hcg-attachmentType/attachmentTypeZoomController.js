define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	attachmentTypeZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function attachmentTypeZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hcg/fchsauhcgglobal/:method/:id');
        service.zoomName = 'Tipos de Anexos';
        service.setConfiguration('hcg.attachmentTypeZoomController');
        service.idSearchMethod = 'getAttachmentTypeByZoomId';
        service.applyFilterMethod = 'getAttachmentTypesForZoom';

        service.propertyFields = [
            {   label: 'Código',
                property: 'cdnTipAnexo',
                type: 'integer',
                default: true
            },{
                label: 'Nome',
                property: 'desTipAnexo',
                type: 'string',
                operator: 'begins'
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdnTipAnexo',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Nome',
                field: 'desTipAnexo',
                width: 150,
                minWidth: 100
            }
        ];
        
         /* Foi colocada essa funcao para que permita pesquisar valores em branco
         * ja que a funcao padrao localizada no zoom.js nao permite,
         * dessa forma todas as situações serão carregadas qdo o campo for mostrado
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

    index.register.factory('hcg.attachmentTypeZoomController', attachmentTypeZoomController);

});
