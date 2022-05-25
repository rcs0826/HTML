define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmfg
     # Table...: modelo-cf
     # Service.: serviceModeloCF
     # Register: mcf.modelo-cf.zoom
     ####################################################################################################*/
	serviceModeloCF.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceModeloCF($timeout, $totvsresource, $rootScope, $filter, zoomService){

		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mfbo/bomf459/:method/:id/');
	    service.zoomName       = $rootScope.i18n('l-model-cf');
        service.configuration  = true;
        service.advancedSearch = false;        
	    
        service.propertyFields = [
            {label: $rootScope.i18n('l-model-cf'), property: 'mo-codigo', type: 'stringrange', maxlength: '16', default: true},
            {label: $rootScope.i18n('l-description'), property: 'descricao', type: 'stringrange', maxlength: '60', default: false},
            {label: $rootScope.i18n('l-item-model'), property: 'item-criado', type: 'stringrange', maxlength: '16', default: false}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-model-cf'), field: 'mo-codigo'},
            {headerName: $rootScope.i18n('l-description'), field: 'descricao'},
            {headerName: $rootScope.i18n('l-item-model'), field: 'item-criado'},
            {headerName: $rootScope.i18n('l-man-lead-time'), field: 'ressup-fabri', width: 130}
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
 
    index.register.service('mcf.modelo-cf.zoom', serviceModeloCF);
});