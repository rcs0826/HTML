define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmnt
     # Table...: equipe
     # Service.: serviceZoomTeam
     # Register: mmi.equipe.zoom
     ####################################################################################################*/
    serviceZoomTeam.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter'];
    function serviceZoomTeam($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter){
        
        var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn087/:method/:id/');
        service.zoomName       = $rootScope.i18n('l-team');
        service.configuration  = true;
        service.advancedSearch = false;
        
        service.propertyFields = [
            {label: i18nFilter('l-team', [], 'dts/mmi'), property: 'cd-equipe', type: 'string', maxlength: '8', default: true},
            {label: i18nFilter('l-description', [], 'dts/mmi'), property: 'desc-equipe', type: 'string', maxlength: '30'},
            {label: i18nFilter('l-owner', [], 'dts/mmi'), property: 'resp-equipe', type: 'string',  maxlength: '20'}
        ];

        service.columnDefs = [
            {headerName: i18nFilter('l-team', [], 'dts/mmi'), field: 'cd-equipe', width: 150, minWidth: 40},
            {headerName: i18nFilter('l-description', [], 'dts/mmi'), field: 'desc-equipe', width: 250, minWidth: 40},
            {headerName: i18nFilter('l-owner', [], 'dts/mmi'), field: 'resp-equipe', width: 150, minWidth: 40},
            {headerName: i18nFilter('l-status', [], 'dts/mmi'), field: 'situacao', width: 50, minWidth: 40, valueGetter: function(params){
                var cText = "";

                switch (params.data.situacao){
                    case 1 :
                        cText = i18nFilter('l-active', [], 'dts/mmi');
                        break;
                    case 2 :
                        cText = i18nFilter('l-inact', [], 'dts/mmi');
                        break;
                };
                return cText; 
            }}
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
    
    index.register.service('mmi.equipe.zoom', serviceZoomTeam);
});