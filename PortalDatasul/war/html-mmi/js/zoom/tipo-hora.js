define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmnt
     # Table...: tipo-hora
     # Service.: serviceZoomHourType
     # Register: mmi.hourType.zoom
     ####################################################################################################*/
    serviceZoomHourType.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter'];
    function serviceZoomHourType($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter){
        
        var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn00306/:method/:id/?order=cod-tip-hora');
        service.zoomName       = $rootScope.i18n('l-hour-type');
        service.configuration  = true;
        service.advancedSearch = false;
        service.matches = ['cod-tip-hora', 'des-tip-hora'];
        service.useCache = false;
        
        service.propertyFields = [
            {label: i18nFilter('l-hour-type', [], 'dts/mmi'), property: 'cod-tip-hora', type: 'string', maxlength: '8', default: true},
            {label: i18nFilter('l-description', [], 'dts/mmi'), property: 'des-tip-hora', type: 'string', maxlength: '30'}
        ];

        service.columnDefs = [
            {headerName: i18nFilter('l-hour-type', [], 'dts/mmi'), field: 'cod-tip-hora', width: 80, minWidth: 40},
            {headerName: i18nFilter('l-description', [], 'dts/mmi'), field: 'des-tip-hora', width: 250, minWidth: 40},
            {headerName: i18nFilter('l-capacity', [], 'dts/mmi'), field: 'idi-tip-hora', width: 150, minWidth: 40, valueGetter: function(params){
            	var cText = "";
        		switch (params.data['idi-tip-hora']){
    				case 1 :
    					cText = i18nFilter('l-increase', [], 'dts/mmi');
    					break;
    				case 2 :
    					cText = i18nFilter('l-decrease', [], 'dts/mmi');
    					break;
        		};
        		return cText; 
    		}},
            {headerName: i18nFilter('l-value-type', [], 'dts/mmi'), field: 'idi-tip-val', width: 150, minWidth: 40, valueGetter: function(params){
            	var cText = "";
        		switch (params.data['idi-tip-val']){
    				case 1 :
    					cText = i18nFilter('l-hours', [], 'dts/mmi');
    					break;
    				case 2 :
    					cText = i18nFilter('l-percentage', [], 'dts/mmi');
    					break;
        		};
        		return cText; 
    		}}
        ];

        /*
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao
         */
        service.comparator = function(item1, item2) {
            return (item1['cod-tip-hora'] === item2['cod-tip-hora']);
        };
        
        service.getObjectFromValue =  function (value, init) {
            return this.resource.TOTVSGet({
                id: value,
                idiTipHora: init.filters['idi-tip-hora']
            }, undefined, {
                noErrorMessage: true
            }, true);
        };
        
        return service;
    }
    
    index.register.service('mmi.hourType.zoom', serviceZoomHourType);
});