define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmnt
     # Table...: tag
     # Service.: serviceZoomTag
     # Register: mmi.tag.zoom
     ####################################################################################################*/
	serviceZoomTag.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter'];
    function serviceZoomTag($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter){

		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn152html/:method/:id/');
	    service.zoomName       = i18nFilter('l-tag', [], 'dts/mmi');
        service.configuration  = true;
        service.advancedSearch = false;      
        
        service.matches =['cd-tag','descricao']; 
	    
        service.propertyFields = [
            {label: i18nFilter('l-tag', [], 'dts/mmi'), property: 'cd-tag', type: 'string', default: true},
            {label: i18nFilter('l-description', [], 'dts/mmi'), property: 'descricao', type: 'string'},            
            {label: i18nFilter('l-cost-center', [], 'dts/mmi'), property: 'cc-codigo', type: 'string'},
            {label: i18nFilter('l-site', [], 'dts/mmi'), property: 'cod-estabel', type: 'string'},
            {label: i18nFilter('l-planner', [], 'dts/mmi'), property: 'cd-planejado', type: 'string'},
            {label: i18nFilter('l-level-type', [], 'dts/mmi'), property: 'cod-tipo', type: 'integer'}
        ];
        
        service.columnDefs = [
            {headerName: i18nFilter('l-tag', [], 'dts/mmi'), field: 'cd-tag', width: 120, minWidth: 80, maxWidth: 200},
            {headerName: i18nFilter('l-description', [], 'dts/mmi'), field: 'descricao', width: 335, minWidth: 335, maxWidth: 335},            
            {headerName: i18nFilter('l-cost-center', [], 'dts/mmi'), field: 'cc-codigo', width: 150, minWidth: 107, maxWidth: 175},  
            {headerName: i18nFilter('l-site', [], 'dts/mmi'), field: 'cod-estabel', width: 130, minWidth: 107, maxWidth: 175},  
            {headerName: i18nFilter('l-planner', [], 'dts/mmi'), field: 'cd-planejado', width: 90, minWidth: 90, maxWidth: 135},  
            {headerName: i18nFilter('l-level-type', [], 'dts/mmi'), field: 'cod-tipo', width: 100, minWidth: 100, maxWidth: 175}  
        ];
        
        /* 
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
         */
        service.comparator = function(item1, item2) {
            return (item1['cd-tag'] === item2['cd-tag']);
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
 
    index.register.service('mmi.tag.zoom', serviceZoomTag);
});