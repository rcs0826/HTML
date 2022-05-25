define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dbo/dbo.js'], function(index) {

    /*####################################################################################################
     # Database: mgind
     # Table...: tab-unidade
     # Service.: serviceTabUnidade
     # Register: mcc.tab-unidade.zoom
     ####################################################################################################*/
    serviceTabUnidade.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function serviceTabUnidade($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils){

		var service = {};    
        var queryproperties = {};     
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin417/:method//:id', {}, {});
        
        service.zoomName       = $rootScope.i18n('l-measure-units', [], 'dts/mcc');
        service.setConfiguration('mcc.tab-unidade.zoom');
	    service.propertyFields = [
            {label: $rootScope.i18n('l-measure-unit', [], 'dts/mcc'), property: 'un', type: 'stringextend', default: true, maxlength: 2},
            {label: $rootScope.i18n('l-description', [], 'dts/mcc'), property: 'descricao', type: 'stringextend', maxlength: 15}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-measure-unit', [], 'dts/mcc'), field: 'un', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-description', [], 'dts/mcc'), field: 'descricao', width: 100, minWidth: 100}
        ];

        service.matches = ['un', 'descricao'];        

        /* Buscar registros do select */
        service.listOfUMs = [];        
        service.getUMs = function(value) {            
            if (!value) return;

            queryproperties.method = 'search';          
            queryproperties.id =  value;
            queryproperties.fields = "un,descricao";
            queryproperties.searchfields = 'un,descricao';

            this.resource.TOTVSQuery(queryproperties, function (result) {                    
                service.listOfUMs = result;
            }, {noErrorMessage: true}, true);
        }

        // Buscar descrições (input)
        service.getObjectFromValue = function (value) {   
            if(!value) return;         
            return this.resource.TOTVSGet({id: value}, undefined , {noErrorMessage: true}, true);
        };

        return service;
	}
 
    index.register.service('mcc.tab-unidade.zoom', serviceTabUnidade);
});