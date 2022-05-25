define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dbo/dbo.js',
        '/dts/mcc/js/mcc-utils.js'], function(index) {

    /*####################################################################################################
     # Database: movind
     # Table...: requisitante
     # Service.: serviceRequisitante
     # Register: mcc.requisitante.zoom
     ####################################################################################################*/
    serviceRequisitante.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service', '$totvsprofile', 'mcc.utils.Service'];
    function serviceRequisitante($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, $totvsprofile, mccUtils){

		var service = {};    
        var queryproperties = {};     
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin386/:method//:id', {}, {});

        service.zoomName       = $rootScope.i18n('l-requesters', [], 'dts/mcc');
	    service.propertyFields = [
            {label: $rootScope.i18n('l-user', [], 'dts/mcc'), property: 'nome-abrev', type: 'stringextend', default: true, maxlength: 12},
            {label: $rootScope.i18n('l-name', [], 'dts/mcc'), property: 'nome', type: 'stringextend', maxlength: 40}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-abrev-name', [], 'dts/mcc'), field: 'nome-abrev', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-name', [], 'dts/mcc'), field: 'nome', width: 215, minWidth: 215}, 
            {headerName: $rootScope.i18n('l-request-limit', [], 'dts/mcc'), field: 'limite-requis', width: 135, minWidth: 135, valueGetter: function(params) {            
                return mccUtils.formatDecimal(params.data['limite-requis'], '4');
            }}, 
            {headerName: $rootScope.i18n('l-currency', [], 'dts/mcc'), width: 100, minWidth: 100, valueGetter: 'data["_"]["desc-moeda"]'},
            {headerName: $rootScope.i18n('l-price-type', [], 'dts/mcc'), field: 'tp-preco', width: 100, minWidth: 100, valueGetter: 'data["_"]["desc-preco"]'},
            {headerName: $rootScope.i18n('l-cost-center', [], 'dts/mcc'), field: 'sc-codigo', width: 145, minWidth: 145}, 
            {headerName: $rootScope.i18n('l-phone', [], 'dts/mcc'), field: 'telefone', width: 130, minWidth: 130, valueGetter: 'data["telefone"][0]'}, 
            {headerName: $rootScope.i18n('l-branch', [], 'dts/mcc'), field: 'ramal', width: 100, minWidth: 100, valueGetter: 'data["ramal"][0]'},
        ];

        service.setConfiguration('mcc.requisitante.zoom');
        service.matches = ['nome-abrev', 'nome'];           
        service.useSearchMethod = true;
        service.searchParameter = 'id';
        service.useCache = true;

        /* Buscar registros do select */
        service.listOfRequesters = [];
        service.getRequesters = function(value) {
            if (!value) return;

            queryproperties.method = 'search';          
            queryproperties.id =  value;
            queryproperties.fields = "nome-abrev,nome";
            queryproperties.searchfields = 'nome-abrev,nome';

            this.resource.TOTVSQuery(queryproperties, function (result) {
                service.listOfRequesters = result;
            }, {noErrorMessage: true}, true);
        }

        // Buscar descrições (input)
        service.getObjectFromValue = function (value) {            
            if(!value) return;
            return this.resource.TOTVSGet({id: value}, undefined , {noErrorMessage: true}, true);
        };

        return service;
	}
 
    index.register.service('mcc.requisitante.zoom', serviceRequisitante);
    index.register.service('mcc.requisitante.select', serviceRequisitante);
});
