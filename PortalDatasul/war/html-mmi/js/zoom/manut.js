define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmnt
     # Table...: manut
     # Service.: serviceZoomMaintenance
     # Register: mmi.manut.zoom
     ####################################################################################################*/
	serviceZoomMaintenance.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter'];
    function serviceZoomMaintenance($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter){

		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn110/:method/:id/');
	    service.zoomName       = i18nFilter('l-maintenance', [], 'dts/mmi');
        service.configuration  = true;
        service.advancedSearch = false;        
        service.matches = ['cd-manut','descricao'];
        
        service.propertyFields = [
            {label: i18nFilter('l-maintenance', [], 'dts/mmi'), property: 'cd-manut', type: 'string', default: true},
            {label: i18nFilter('l-description', [], 'dts/mmi'), property: 'descricao', type: 'string'},
            {label: i18nFilter('l-type', [], 'dts/mmi'), property: 'cd-tipo', type: 'integer'},
            {label: i18nFilter('l-planner', [], 'dts/mmi'), property: 'cd-planejado', type: 'string'},            
            {label: i18nFilter('l-team', [], 'dts/mmi'), property: 'cd-equip-res', type: 'string'} 
        ];        
        service.columnDefs = [
            {headerName: i18nFilter('l-maintenance', [], 'dts/mmi'), field: 'cd-manut', width: 98, minWidth: 98, maxWidth: 98},
            {headerName: i18nFilter('l-description', [], 'dts/mmi'), field: 'descricao', width: 335, minWidth: 335, maxWidth: 335},            
            {headerName: i18nFilter('l-type', [], 'dts/mmi'), field: 'cd-tipo', width: 80, minWidth: 80, maxWidth: 80},  
            {headerName: i18nFilter('l-statistic', [], 'dts/mmi'), field: 'tipo', width: 90, minWidth: 90, maxWidth: 90, valueGetter: function(params){
            	var cText = "";
        		switch (params.data._.tipo){
    				case 1 :
    					cText = i18nFilter('l-preventive', [], 'dts/mmi');
    					break;
    				case 2 :
    					cText = i18nFilter('l-corrective', [], 'dts/mmi');
    					break;
    				case 3 :
    					cText = i18nFilter('l-predictive', [], 'dts/mmi');
    					break;
    				case 4 :
    					cText = i18nFilter('l-others', [], 'dts/mmi');
    					break;
        		};
        		return cText; 
    		}},
            {headerName: i18nFilter('l-class', [], 'dts/mmi'), field: 'tp-manut', width: 105, minWidth: 105, maxWidth: 105, valueGetter: function(params){
            	var cText = "";
        		switch (params.data['_']['tp-manut']){
					case 1 :
						cText = i18nFilter('l-systematic2', [], 'dts/mmi');
						break;
					case 2 :
						cText = i18nFilter('l-predictive', [], 'dts/mmi');
						break;
					case 3 :
						cText = i18nFilter('l-calibration', [], 'dts/mmi');
						break;
					case 4 :
						cText = i18nFilter('l-lubrification', [], 'dts/mmi');
						break;
					case 5 :
						cText = i18nFilter('l-productive', [], 'dts/mmi');
						break;
					case 6 :
						cText = i18nFilter('l-general-services', [], 'dts/mmi');
						break;
					case 7 :
						cText = i18nFilter('l-palleative', [], 'dts/mmi');
						break;
					case 8 :
						cText = i18nFilter('l-remedial', [], 'dts/mmi');
						break;
					case 9 :
						cText = i18nFilter('l-others', [], 'dts/mmi');
						break;
					case 10 :
						cText = i18nFilter('l-inspection', [], 'dts/mmi');
						break;
					case 11 :
						cText = i18nFilter('l-investigation', [], 'dts/mmi');
						break;
        		};
        		return cText;
            }},
            {headerName: i18nFilter('l-planner', [], 'dts/mmi'), field: 'cd-planejado', width: 88, minWidth: 88, maxWidth: 88},  
            {headerName: i18nFilter('l-team', [], 'dts/mmi'), field: 'cd-equip-res', width: 210, minWidth: 210, maxWidth: 210}];
        
        /* 
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
         */
        service.comparator = function(item1, item2) {
            return (item1['cd-manut'] === item2['cd-manut']);
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
 
    index.register.service('mmi.manut.zoom', serviceZoomMaintenance);
});