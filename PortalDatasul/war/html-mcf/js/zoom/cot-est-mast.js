define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: movmfg
     # Table...: cot-est-mast
     # Service.: serviceConfiguration
     # Register: mcf.cot-est-mast.zoom
     ####################################################################################################*/
	serviceConfiguration.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceConfiguration($timeout, $totvsresource, $rootScope, $filter, zoomService){

		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mfbo/bomf067/:method/:id/');
	    service.zoomName       = $rootScope.i18n('l-configuration');
        service.configuration  = true;
        service.advancedSearch = false;        
	    
        service.propertyFields = [
            {label: $rootScope.i18n('l-configuration'), property: 'nr-estrut', type: 'integerrange', maxlength: '16', default: true},
            {label: $rootScope.i18n('l-description'), property: 'descricao', type: 'stringrange', maxlength: '60', default: false}            
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-configuration'), field: 'nr-estrut', width: 50},
            {headerName: $rootScope.i18n('l-description'), field: 'descricao'},
            {headerName: $rootScope.i18n('l-status'), field: 'ind-aprov', width: 70, valueGetter: function (param) {
				return param.data["_"]["c-ind-aprov"]}}
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
 
    index.register.service('mcf.cot-est-mast.zoom', serviceConfiguration);
});