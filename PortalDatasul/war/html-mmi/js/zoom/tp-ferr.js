define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmnt
     # Table...: mi-turno
     # Service.: serviceZoomTpFerr
     # Register: mmi.mi-turno.zoom
     ####################################################################################################*/
	serviceZoomTpFerr.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceZoomTpFerr($timeout, $totvsresource, $rootScope, $filter, zoomService){
    	
		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn160//:id');
	    service.zoomName       = $rootScope.i18n('l-tool');
        service.configuration  = true;
        service.advancedSearch = false;
        service.matches        = ['cd-tp-ferr', 'descricao'];
	    
        service.propertyFields = [
            {label: $rootScope.i18n('l-tool'), property: 'cd-tp-ferr', type: 'string', maxlength: '8', default: true},
            {label: $rootScope.i18n('l-description'), property: 'descricao', type: 'string', maxlength: '30'}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-tool'), field: 'cd-tp-ferr', width: 80, minWidth: 40},
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
    
    index.register.service('mmi.tp-ferr.zoom', serviceZoomTpFerr);
});