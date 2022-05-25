define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmnt
     # Table...: mnt-ficha-metodo.js
     # Service.: serviceZoomFichaMetodo
     # Register: mmi.mntFichaMetodo.zoom
     ####################################################################################################*/
	serviceZoomFichaMetodo.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceZoomFichaMetodo($timeout, $totvsresource, $rootScope, $filter, zoomService){
    	
		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn049/:method/:id/');
	    service.zoomName       = $rootScope.i18n('l-method-sheet');
        service.configuration  = true;
        service.advancedSearch = false;
        service.matches        = ['String(fi-codigo)', 'descricao'];
        
        service.TOTVSPostArray = function (parameters, model, callback, headers) {
            service.resource.parseHeaders(headers);
            var call = service.resource.postArray(parameters, model);
            return service.resource.processPromise(call, callback);
        };
	    
        service.propertyFields = [
            {label: $rootScope.i18n('l-method-sheet'), property: 'fi-codigo', type: 'integer', maxlength: '3', default: true},
            {label: $rootScope.i18n('l-description'), property: 'descricao', type: 'string', maxlength: '40'}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-method-sheet'), field: 'fi-codigo', width: 80, minWidth: 40},
            {headerName: $rootScope.i18n('l-description'), field: 'descricao', width: 460, minWidth: 80}            
        ];
        
        /* 
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
         */
        service.comparator = function(item1, item2) {
            return (item1.id === item2.id);
        };
        
        service.getObjectFromValue =  function (value) {        	
        	if (!isNaN(value)){        	
	            return this.resource.TOTVSGet({
	                id: value
	            }, undefined, {
	                noErrorMessage: true
	            }, true);
        	}        	
        };
        
		return service;
	}
    
    index.register.service('mmi.mntFichaMetodo.zoom', serviceZoomFichaMetodo);
});
	