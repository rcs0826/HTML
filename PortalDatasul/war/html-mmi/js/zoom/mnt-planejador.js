define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) { 

    /*####################################################################################################
     # Database: mgmnt
     # Table...: mnt-planejador
     # Service.: serviceZoomMntPlanejador
     # Register: mmi.mntplanejador.zoom
     ####################################################################################################*/
    serviceZoomMntPlanejador.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
    function serviceZoomMntPlanejador($timeout, $totvsresource, $rootScope, $filter, zoomService){
        
        var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn060/:method/:id/');
        service.zoomName       = $rootScope.i18n('l-planner');
        service.configuration  = true;
        service.advancedSearch = false;
        
        service.propertyFields = [
            {label: $rootScope.i18n('l-planner'), property: 'cd-planejado', type: 'string', maxlength: '12', default: true},
            {label: $rootScope.i18n('l-name'), property: 'nome', type: 'string', maxlength: '30'}
        ];

        service.columnDefs = [
            {headerName: $rootScope.i18n('l-planner'), field: 'cd-planejado', width: 150, minWidth: 80},
            {headerName: $rootScope.i18n('l-name'), field: 'nome', width: 400, minWidth: 100}
        ];

        /*
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao
         */
        service.comparator = function(item1, item2) {
            return (item1['cd-planejado'] === item2['cd-planejado']);
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
    
    index.register.service('mmi.mntplanejador.zoom', serviceZoomMntPlanejador);
});