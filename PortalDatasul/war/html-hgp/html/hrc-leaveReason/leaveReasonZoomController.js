define(['index',
        '/dts/hgp/html/util/zoom/zoom.js',
		'/dts/hgp/html/js/util/StringTools.js'
], function (index) {

	leaveReasonZoomController.$inject = ['$injector', '$totvsresource', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function leaveReasonZoomController($injector, $totvsresource, zoomService, dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchsau/hrc/fchsauhrcglobal/:method/:id');
        service.zoomName = 'Motivo de Alta';
        service.setConfiguration('hrc.leaveReasonZoomController');
        service.idSearchMethod = 'getLeaveReasonByZoomId';
        service.applyFilterMethod = 'getLeaveReasonsForZoom';
        service.propertyFields = [
            {   label: 'Código',
                property: 'cdMotivoAlta',
                type: 'integer'
            },{
                label: 'Descrição',
                property: 'dsMotivo',
                type: 'string',
                default: true
            }
		];
            
        service.columnDefs = [
            {   headerName: 'Código',
                field: 'cdMotivoAlta',
                width: 150,
                minWidth: 100
            },{
                headerName: 'Descrição',
                field: 'dsMotivo',
                width: 150,
                minWidth: 100
            }
        ];
        
        /* Foi colocada essa funcao para que permita pesquisar valores em branco
         * ja que a funcao padrao localizada no zoom.js nao permite,
         * dessa forma todos os motivos de alta serao carregados qdo o campo for mostrado
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

    index.register.factory('hrc.leaveReasonZoomController', leaveReasonZoomController);

});
