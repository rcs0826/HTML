define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmnt
     # Table...: mi-sist
     # Service.: serviceZoomSistema
     # Register: mmi.mi-sist.zoom
     ####################################################################################################*/
    serviceZoomSistema.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter'];
    function serviceZoomSistema($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter){

		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn257/:method/:id/');
	    service.zoomName       = i18nFilter('l-systems', [], 'dts/mmi');
        service.configuration  = true;
        service.advancedSearch = false;        
	    service.matches = ['cod-sistema','des-sistema'];
        
        service.propertyFields = [
            {label: i18nFilter('l-system', [], 'dts/mmi'), property: 'cod-sistema', type: 'string', maxlength: '8', default: true},
            {label: i18nFilter('l-description', [], 'dts/mmi'), property: 'des-sistema', type: 'string', maxlength: '40'}
        ];
        
        service.columnDefs = [
            {headerName: i18nFilter('l-system', [], 'dts/mmi'), field: 'cod-sistema', width: 40, minWidth: 40},
            {headerName: i18nFilter('l-description', [], 'dts/mmi'), field: 'des-sistema', width: 80, minWidth: 80}            
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
 
    index.register.service('mmi.mi-sist.zoom', serviceZoomSistema);
});