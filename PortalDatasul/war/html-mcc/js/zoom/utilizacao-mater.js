define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dbo/dbo.js'], function(index) {

    /*####################################################################################################
     # Database: mgind
     # Table...: utilizacao-mater
     # Service.: serviceUtilizacao
     # Register: mcc.utilizacao-mater.zoom
     ####################################################################################################*/
    serviceUtilizacao.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function serviceUtilizacao($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils){

		var service = {};    
        var queryproperties = {};     
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin641/:method//:id', {}, {});

        service.zoomName       = $rootScope.i18n('l-utilization-codes', [], 'dts/mcc');
        service.setConfiguration('utilizacao-mater');
	    service.propertyFields = [
            {label: $rootScope.i18n('l-code', [], 'dts/mcc'), property: 'cod-utiliz', type: 'stringextend', default: true, maxlength: 12},
            {label: $rootScope.i18n('l-description', [], 'dts/mcc'), property: 'des-utiliz', type: 'stringextend', maxlength: 40}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-code', [], 'dts/mcc'), field: 'cod-utiliz', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-description', [], 'dts/mcc'), field: 'des-utiliz', width: 100, minWidth: 100}
        ];

        service.matches = ['cod-utiliz', 'des-utiliz'];        

        /* Buscar registros do select */
        service.listOfUtilizations = [];        
        service.getUtilizations = function(value) {
            if (!value) return;

            queryproperties.method = 'search';          
            queryproperties.id =  value;
            queryproperties.fields = "cod-utiliz,des-utiliz";
            queryproperties.searchfields = 'cod-utiliz,des-utiliz';

            this.resource.TOTVSQuery(queryproperties, function (result) {                    
                service.listOfUtilizations = result;
            }, {noErrorMessage: true}, true);
        }

        // Buscar descrições (input)
        service.getObjectFromValue = function (value) {     
            if(!value) return;       
            return this.resource.TOTVSGet({id: value}, undefined , {noErrorMessage: true}, true);
        };

        return service;
	}
 
    index.register.service('mcc.utilizacao-mater.zoom', serviceUtilizacao);
});
