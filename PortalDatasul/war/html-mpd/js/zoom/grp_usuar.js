define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'
       ], function(index) {
    
    // ***************************************************************************************
    // ****************************** SERVICE ZOOM *******************************************
    // ***************************************************************************************

    serviceZoomGrupoUsuario.$inject = ['$timeout', '$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    function serviceZoomGrupoUsuario($timeout, $totvsresource,$rootScope, zoomService, dtsUtils){

		var service = {};
		angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/fnbo/bofn069/:method/:gotomethod/:id'),            
        service.zoomName = $rootScope.i18n('l-grp-usuario', undefined, 'dts/mpd'),
		service.configuration = false,
        service.useSearchMethod = true,
        service.matches = ['cod_grp_usuar', 'des_grp_usuar'],
            
        service.propertyFields = [
            {label: 'l-grp-usuario', property: 'cod_grp_usuar', default: true},    
            {label: 'l-descricao', property: 'des_grp_usuar'},
        ],
        service.tableHeader = [
            {label: 'l-grp-usuario', property: 'cod_grp_usuar'},    
            {label: 'l-descricao', property: 'des_grp_usuar'},
        ],
        
        service.getObjectFromValue = function (value, init) {
            var gotomethod;
            if (init) 
                gotomethod = init.gotomethod;
            if(value){    
                return this.resource.TOTVSGet({id: value, gotomethod: gotomethod}, undefined , {noErrorMessage: true}, true);
            }
        }


        return service;
    }

    index.register.service('mpd.grp-usuar.zoom', serviceZoomGrupoUsuario);



});