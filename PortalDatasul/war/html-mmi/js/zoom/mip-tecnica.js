define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmnt
     # Table...: mip-tecnica
     # Service.: serviceZoomTecnica
     # Register: mmi.mip-tecnica.zoom
     ####################################################################################################*/
	serviceZoomTecnica.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceZoomTecnica($timeout, $totvsresource, $rootScope, $filter, zoomService){
    	
		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn226/:method/:id/');
	    service.zoomName       = $rootScope.i18n('l-techniques');
        service.configuration  = true;
        service.advancedSearch = false;
        service.matches        = ['cod-tecnica', 'des-tecnica'];
        
        service.TOTVSPostArray = function (parameters, model, callback, headers) {
            service.resource.parseHeaders(headers);
            var call = service.resource.postArray(parameters, model);
            return service.resource.processPromise(call, callback);
        };
	    
        service.propertyFields = [
            {label: $rootScope.i18n('l-technique'), property: 'cod-tecnica', type: 'string', maxlength: '16', default: true},
            {label: $rootScope.i18n('l-description'), property: 'des-tecnica', type: 'string', maxlength: '60'}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-technique'), field: 'cod-tecnica', width: 160, minWidth: 40},
            {headerName: $rootScope.i18n('l-description'), field: 'des-tecnica', width: 400, minWidth: 80}            
        ];
        
        /* 
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
         */
        service.comparator = function(item1, item2) {
            return (item1.id === item2.id);
        };
        
        service.getObjectFromValue =  function (value) {
            return this.resource.TOTVSGet({
                id: value
            }, undefined, {
                noErrorMessage: true
            }, true);    	        	
        };
        
		return service;
	}
    
    index.register.service('mmi.mip-tecnica.zoom', serviceZoomTecnica);
});