define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
    # Database: mgmnt
    # Table...: epi
    # Service.: serviceZoomEpi
    # Register: mmi.epi.zoom
    ####################################################################################################*/
	serviceZoomEpi.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter'];
    function serviceZoomEpi($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter){

		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn086/:method/:id/');
	    service.zoomName       = i18nFilter('l-epi', [], 'dts/mmi');
        service.configuration  = true;
        service.advancedSearch = false;        
        service.matches = ['cd-epi','descricao'];
        
        service.propertyFields = [
            {label: i18nFilter('l-epi', [], 'dts/mmi'), property: 'cd-epi', type: 'string', default: true},
            {label: i18nFilter('l-description', [], 'dts/mmi'), property: 'descricao', type: 'string'}
        ];        
        service.columnDefs = [
            {headerName: i18nFilter('l-epi', [], 'dts/mmi'), field: 'cd-epi', width: 98, minWidth: 98, maxWidth: 98},
            {headerName: i18nFilter('l-description', [], 'dts/mmi'), field: 'descricao', width: 335, minWidth: 335, maxWidth: 335}];
        
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
 
    index.register.service('mmi.epi.zoom', serviceZoomEpi);
});        
        