define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmnt
     # Table...: mi-espec
     # Service.: serviceZoomEspecialidade
     # Register: mmi.mi-espec.zoom
     ####################################################################################################*/
    serviceZoomEspecialidade.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceZoomEspecialidade($timeout, $totvsresource, $rootScope, $filter, zoomService){

		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn112/:method/:id/');
	    service.zoomName       = $rootScope.i18n('l-specialtys');
        service.configuration  = true;
        service.advancedSearch = false;
        service.matches        = ['tp-especial', 'descricao'];
	    
        service.propertyFields = [
            {label: $rootScope.i18n('l-specialty'), property: 'tp-especial', type: 'string', maxlength: '8', default: true},
            {label: $rootScope.i18n('l-description'), property: 'descricao', type: 'string', maxlength: '30'},
            {label: $rootScope.i18n('l-alternative'), property: 'esp-alt', type: 'string', maxlength: '8'},
            {label: $rootScope.i18n('l-calend'), property: 'cd-calen', type: 'string', maxlength: '9'}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-specialty'), field: 'tp-especial', width: 120, minWidth: 120},
            {headerName: $rootScope.i18n('l-description'), field: 'descricao', width: 350, minWidth: 300},
            {headerName: $rootScope.i18n('l-alternative'), field: 'esp-alt', width: 110, minWidth: 110},
            {headerName: $rootScope.i18n('l-calend'), field: 'cd-calen', width: 110, minWidth: 110}
        ];
        
        /* 
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
         */
        service.comparator = function(item1, item2, item3, item4) {
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
 
    index.register.service('mmi.mi-espec.zoom', serviceZoomEspecialidade);
});