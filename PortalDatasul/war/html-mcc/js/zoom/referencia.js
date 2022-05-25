define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dbo/dbo.js'], function(index) {

    /*####################################################################################################
     # Database: mgind
     # Table...: referencia
     # Service.: serviceReferencia
     # Register: mcc.referencia.zoom
     ####################################################################################################*/
    serviceReferencia.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function serviceReferencia($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils){

		var service = {};    
        var queryproperties = {};     
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin377/:method//:id', {}, {});

        service.zoomName       = $rootScope.i18n('l-references', [], 'dts/mcc');
        service.setConfiguration('mcc.referencia.zoom');
	    service.propertyFields = [
            {label: $rootScope.i18n('l-reference', [], 'dts/mcc'), property: 'cod-refer', type: 'stringextend', maxlength: 8, default: true},
            {label: $rootScope.i18n('l-description', [], 'dts/mcc'), property: 'descricao', type: 'stringextend', maxlength: 32},
            {label: $rootScope.i18n('l-subproduct', [], 'dts/mcc'), property: 'subproduto', propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no'),
                        value: false
                    }]}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-reference', [], 'dts/mcc'), field: 'cod-refer', width: 240, minWidth: 100},
            {headerName: $rootScope.i18n('l-description', [], 'dts/mcc'), field: 'descricao', width: 480, minWidth: 100},            
            {headerName: $rootScope.i18n('l-subproduct', [], 'dts/mcc'), field: 'subproduto', width: 100, minWidth: 100, valueGetter: function (params) {
                if (params.data["subproduto"]) return $rootScope.i18n('l-yes', [], 'dts/mcc');  
                else return $rootScope.i18n('l-no', [], 'dts/mcc');
            }}
        ];
        service.matches = ['cod-refer', 'descricao'];

        /* Buscar registros do select */
        service.listOfReferences = [];        
        service.getReferences = function(value) {
            if (!value) return;

            queryproperties.method = 'search';          
            queryproperties.id = value;
            queryproperties.fields = 'cod-refer,descricao';
            queryproperties.searchfields = 'cod-refer,descricao';

            this.resource.TOTVSQuery(queryproperties, function (result) {                    
                service.listOfReferences = result;
            }, {noErrorMessage: true}, true);
        }

        // Buscar descrições (input)
        service.getObjectFromValue = function (value) {            
            if(!value) return;
            return this.resource.TOTVSGet({id: value}, undefined , {noErrorMessage: true}, true);
        };

        return service;
	}
 
    index.register.service('mcc.referencia.zoom', serviceReferencia);
});