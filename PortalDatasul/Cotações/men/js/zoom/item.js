define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*
	 * ####################################################################################################
	 * Database: mgind Table...: item Service.: serviceZoomItem Register:
	 * men.item.zoom2
	 * ####################################################################################################
	 */
    serviceZoomItem.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceZoomItem($timeout, $totvsresource, $rootScope, $filter, zoomService){

		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico
											  // de zoom (Datasul)
        
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin172html/:method//:id/', {}, {});

	    service.zoomName = $rootScope.i18n('l-items', undefined, 'dts/men');
	    service.setConfiguration('men.item.zoom2');
        service.advancedSearch = true;  
        service.matches = ['it-codigo', 'desc-item']; 
        
	    service.propertyFields = [

            {label: $rootScope.i18n('l-item', undefined, 'dts/men'), property: 'it-codigo', type: 'stringextend', maxlength: '16', default: true},
            {label: $rootScope.i18n('l-description', undefined, 'dts/men'), property: 'desc-item', type: 'stringextend', maxlength: '60'},
            {label: $rootScope.i18n('l-measure-unit', undefined, 'dts/men'), property: 'un', type: 'stringextend', maxlength: '2'},

            {label: $rootScope.i18n('l-family', undefined, 'dts/men'), property: 'fm-codigo', type: 'stringextend', maxlength: '8'},
            
            {label: $rootScope.i18n('l-stock-group', undefined, 'dts/men'), property: 'ge-codigo', type: 'integerrange'},
            
            {label: $rootScope.i18n('l-status', undefined, 'dts/men'), property: 'cod-obsoleto', type: 'integer', propertyList: [
                {id: 1, name: $rootScope.i18n('l-active', undefined, 'dts/men'), value: 1},
                {id: 2, name: $rootScope.i18n('l-obsolete-automatic-orders', undefined, 'dts/men'), value: 2},
                {id: 3, name: $rootScope.i18n('l-obsolete-all-orders', undefined, 'dts/men'), value: 3},
                {id: 4, name: $rootScope.i18n('l-totally-obsolete', undefined, 'dts/men'), value: 4}
            ]},
            
            {label: $rootScope.i18n('l-obtainment-way', undefined, 'dts/men'), property: 'compr-fabric', type: 'integer', propertyList: [
                {id: 1, name: $rootScope.i18n('l-bought', undefined, 'dts/men'),  value: 1},
                {id: 2, name: $rootScope.i18n('l-manufactured-singular', undefined, 'dts/men'), value: 2}                
            ]},
            
            {label: $rootScope.i18n('l-default-warehouse', undefined, 'dts/men'), property: 'deposito-pad', type: 'stringextend', maxlength: '3'},
            {label: $rootScope.i18n('l-localization', undefined, 'dts/men'), property: 'cod-localiz', type: 'stringextend', maxlength: '20'},
            
            {label: $rootScope.i18n('l-default-site', undefined, 'dts/men'), property: 'cod-estabel', type: 'stringextend', maxlength: '5'},
            {label: $rootScope.i18n('l-supplementary-code', undefined, 'dts/men'), property: 'codigo-refer', type: 'stringextend', maxlength: '20'},
            {label: $rootScope.i18n('l-supplementary-info', undefined, 'dts/men'), property: 'inform-compl', type: 'stringextend', maxlength: '16'},
            
            {label: $rootScope.i18n('l-planner', undefined, 'dts/men'), property: 'cd-planejado', type: 'stringextend', maxlength: '12'},
            {label: $rootScope.i18n('l-buyer', undefined, 'dts/men'), property: 'cod-comprado', type: 'stringextend', maxlength: '12'},
			{label: $rootScope.i18n('l-narrative', undefined, 'dts/men'), property: 'narrativa', type: 'stringextend', maxlength: '60'}
        ];
        
        service.columnDefs = [

			{headerName: $rootScope.i18n('l-item', undefined, 'dts/men'), field: 'it-codigo', width: 180, minWidth: 180},
			{headerName: $rootScope.i18n('l-description', undefined, 'dts/men'), field: 'desc-item', width: 350, minWidth: 350},
			{headerName: $rootScope.i18n('l-measure-unit', undefined, 'dts/men'), field: 'un', width: 130, minWidth: 130},
			
			{
				headerName: $rootScope.i18n('l-family', undefined, 'dts/men'),
				field: 'fm-codigo', 
				width: 350, 
				minWidth: 350,
				valueGetter: function (param) {
                    return param.data["fm-codigo"] + " - " + param.data["_"]["des-familia"];
                }
			},
			
			{
				headerName: $rootScope.i18n('l-stock-group', undefined, 'dts/men'),
				field: 'ge-codigo',
				width: 350, 
				minWidth: 350,
				valueGetter: function (param) {
                    return param.data["ge-codigo"] + " - " + param.data["_"]["des-grup-estoque"];
                }
			},
			
			{
				headerName: $rootScope.i18n('l-state', undefined, 'dts/men'), 
				field: 'cod-obsoleto', 
				width: 160, 
				minWidth: 160,
				valueGetter: function (param) {
					return param.data["_"]["des-cod-obsoleto"];
                }				
			},
			
			{
				headerName: $rootScope.i18n('l-obtainment-way', undefined, 'dts/men'), 
				field: 'compr-fabric', 
				width: 160, 
				minWidth: 160,
				valueGetter: function (param) {
					return param.data["_"]["des-compr-fabric"];
                }
				
			},
			
			{headerName: $rootScope.i18n('l-default-warehouse', undefined, 'dts/men'), field: 'deposito-pad', width: 160, minWidth: 160},
			{headerName: $rootScope.i18n('l-localization', undefined, 'dts/men'), field: 'cod-localiz', width: 160, minWidth: 160},
			{headerName: $rootScope.i18n('l-default-site', undefined, 'dts/men'), field: 'cod-estabel', width: 160, minWidth: 160},
			{headerName: $rootScope.i18n('l-supplementary-code', undefined, 'dts/men'), field: 'codigo-refer', width: 160, minWidth: 160},
			{headerName: $rootScope.i18n('l-supplementary-info', undefined, 'dts/men'), field: 'inform-compl', width: 160, minWidth: 160},
			{headerName: $rootScope.i18n('l-planner', undefined, 'dts/men'), field: 'cd-planejado', width: 160, minWidth: 160},
			{headerName: $rootScope.i18n('l-buyer', undefined, 'dts/men'), field: 'cod-comprado', width: 160, minWidth: 160},			
			{headerName: $rootScope.i18n('l-narrative', undefined, 'dts/men'), field: 'narrativa', width: 600, minWidth: 600},
			{headerName: $rootScope.i18n('l-inventory-control-type', undefined, 'dts/men'), field: 'tipo-con-est', width: 160, minWidth: 160}
        ];
        
        /* Buscar registros para o select */
        service.listOfItems = [];        
        service.getItems = function(value) {            
            var queryproperties = {};       	

            queryproperties.method = 'search';          
            queryproperties.id =  value;
            queryproperties.fields = "it-codigo,desc-item,tipo-con-est";
            queryproperties.searchfields = "it-codigo,desc-item,tipo-con-est";

            this.resource.TOTVSQuery(queryproperties, function (result) {                    
                service.listOfItems = result;
            }, {noErrorMessage: true}, true);
        }
        
        /*
		 * comparator - Funcao de comparacao utilizada principalmente para zoom
		 * de multipla selecao 
		 */
        service.comparator = function(item1, item2) {
            return (item1.id === item2.id);
        };
       
        service.getObjectFromValue =  function (value) {
									
			if(value === "?"){
				return null;
			}	
							
        	if (!value) return undefined;
        	return this.resource.TOTVSGet({
                id: value
            }, undefined, {
                noErrorMessage: true
            }, true);            
        };  
        
        return service;
	}
 
    index.register.service('men.item.zoom2', serviceZoomItem);
});