define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'
], function(index) {

    /*####################################################################################################
     # Database: mgind
     # Table...: mla-usuar-aprov
     # Service.: serviceMlaUsuarAprov
     # Register: mla.mla-usuar-aprov.zoom
     ####################################################################################################*/
    serviceMlaUsuarAprov.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function serviceMlaUsuarAprov($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils){
		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin785/:id');
	    service.zoomName       = $rootScope.i18n('l-alternative-users', undefined, 'dts/mla');
        service.setConfiguration('mla.mla-usuar-aprov.zoom');        
	    service.propertyFields = [
                                    {
                                        label: $rootScope.i18n('l-code', undefined, 'dts/mla'), 
                                        property: 'cod-usuar', 
                                        type: 'stringextend', 
                                        default: true,
                                        maxlength: 12
                                    },
                                    {
                                        label: $rootScope.i18n('l-name', undefined, 'dts/mla'),
                                        property: 'nome-usuar', 
                                        type: 'stringextend',
                                        maxlength: 40
                                    },
                                    {
                                        label: $rootScope.i18n('l-site', undefined, 'dts/mla'), 
                                        property: 'cod-estabel', 
                                        type: 'stringextend',
                                        maxlength: 5
                                    }
                                ];
        
        service.columnDefs = [
            {
                headerName: $rootScope.i18n('l-cod', undefined, 'dts/mla'), 
                field: 'cod-usuar', 
                width: 100, 
                minWidth: 100
            },
            {
                headerName: $rootScope.i18n('l-name', undefined, 'dts/mla'), 
                field: 'nome-usuar', 
                width: 200, 
                minWidth: 200
            },
            {
                headerName: $rootScope.i18n('l-stocking', undefined, 'dts/mla'), 
                field: 'cod-lotacao', 
                width: 100, 
                minWidth: 100
            },
            {
                headerName: $rootScope.i18n('l-release-funds', undefined, 'dts/mla'), 
                field: 'libera-verba', 
                width: 100, 
                minWidth: 100, 
                valueGetter: function(params){ 
                    return service.legend.logical(params.data['libera-verba']);
                }
            },
            {
                headerName: $rootScope.i18n('l-site', undefined, 'dts/mla'), 
                field: 'cod-estabel', 
                width: 100, 
                minWidth: 100
            }
        ];

        /* Especifico para utilizacao do selec conector 
            (autocomplete funcionar tanto por cod-usuar quanto para nome-usuar)*/
        service.matches = ['cod-usuar', 'nome-usuar'] ;

        service.disclaimerSelect =  { type: "string" };

        service.comparator = function(item1, item2) {
            return (item1.id === item2.id);
        };
        
        service.getObjectFromValue = function (value, init) {			
			if (!value) 
                return;            
			return this.resource.TOTVSGet({'id': value}, undefined , {noErrorMessage: true}, true);
        };

        return service;
	}
    
    index.register.service('mla.mla-usuar-aprov.zoom', serviceMlaUsuarAprov);
    index.register.service('mla.mla-usuar-aprov.select', serviceMlaUsuarAprov);

});
