define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmnt
     # Table...: mi-turno
     # Service.: serviceZoomTurno
     # Register: mmi.mi-turno.zoom
     ####################################################################################################*/
	serviceZoomTurno.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceZoomTurno($timeout, $totvsresource, $rootScope, $filter, zoomService){
    	
		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn015/:method/:id/');
	    service.zoomName       = $rootScope.i18n('l-shifts');
        service.configuration  = true;
        service.advancedSearch = false;
        service.matches        = ['String(cd-turno)', 'descricao'];
        
        service.TOTVSPostArray = function (parameters, model, callback, headers) {
            service.resource.parseHeaders(headers);
            var call = service.resource.postArray(parameters, model);
            return service.resource.processPromise(call, callback);
        };
	    
        service.propertyFields = [
            {label: $rootScope.i18n('l-shift'), property: 'cd-turno', type: 'integer', maxlength: '3', default: true},
            {label: $rootScope.i18n('l-description'), property: 'descricao', type: 'string', maxlength: '40'}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-shift'), field: 'cd-turno', width: 80, minWidth: 40},
            {headerName: $rootScope.i18n('l-description'), field: 'descricao', width: 460, minWidth: 80}            
        ];
        
        /* 
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
         */
        service.comparator = function(item1, item2) {
            return (item1['cd-turno'] === item2['cd-turno']);
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
    
    index.register.service('mmi.mi-turno.zoom', serviceZoomTurno);
});