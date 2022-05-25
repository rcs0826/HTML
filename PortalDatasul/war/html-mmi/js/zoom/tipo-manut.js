define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) { 

    /*####################################################################################################
     # Database: mgmnt
     # Table...: equipe
     # Service.: serviceZoomTipoManut
     # Register: mmi.tipo-manut.zoom
     ####################################################################################################*/
    serviceZoomTipoManut.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter'];
    function serviceZoomTipoManut($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter){
        
        var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn158/:method/:id/');
        service.zoomName       = $rootScope.i18n('l-maintenance-type');
        service.configuration  = true;
        service.advancedSearch = false;
        service.matches = [('string(cd-tipo)'), 'descricao'];
        
        service.propertyFields = [
            {label: i18nFilter('l-type'), property: 'cd-tipo', type: 'integer', maxlength: '16', default: true},
            {label: i18nFilter('l-description'), property: 'descricao', type: 'string', maxlength: '40'}
        ];
        
        service.columnDefs = [
            {headerName: i18nFilter('l-type'), field: 'cd-tipo', width: 50, minWidth: 40},
            {headerName: i18nFilter('l-description'), field: 'descricao', width: 250, minWidth: 80},
            {headerName: i18nFilter('l-statistic'), field: 'tipo', width: 100, minWidth: 100, valueGetter: function(params){
                var cText = "";
                switch (params.data.tipo){
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
            {headerName: i18nFilter('l-class'), field: 'tp-manut', width: 100, minWidth: 100, valueGetter: function(params){
                var cText = "";
                switch (params.data['tp-manut']){
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
            {headerName: i18nFilter('l-order-account'), field: 'ct-ordem', width: 150, minWidth: 150},
            {headerName: i18nFilter('l-order-cost-center'), field: 'sc-ordem', width: 150, minWidth: 150},
            {headerName: i18nFilter('l-expense-account'), field: 'ct-despesa', width: 150, minWidth: 150},
            {headerName: i18nFilter('l-cost-center-expense'), field: 'sc-despesa', width: 150, minWidth: 150}
        ];

        service.comparator = function(item1, item2) {
            return (item1['cd-tipo'] === item2['cd-tipo']);
        };
        
        service.getObjectFromValue =  function (value) {
        	if (typeof value === "string") {
				value = value.replace(/\./g, "");
			}
        	
        	if (!isNaN(value)) {        	
	            return this.resource.TOTVSGet({
	                id: value
	            }, undefined, {
	                noErrorMessage: true
	            }, true);
        	}
        	
        };
        
        return service;
    }
    
    index.register.service('mmi.tipo-manut.zoom', serviceZoomTipoManut);
});