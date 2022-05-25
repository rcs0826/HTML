define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: mgmnt
     # Table...: epi
     # Service.: serviceZoomRefeItem
     # Register: mmi.refeItem.zoom
     ####################################################################################################*/
	serviceZoomRefeItem.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom','helperItem'];
    function serviceZoomRefeItem($timeout, $totvsresource, $rootScope, $filter, zoomService, helperItem){
    	
		var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin375//:itCodigo//:codRefer');
	    service.zoomName       = $rootScope.i18n('l-reference');
        service.configuration  = true;
        service.advancedSearch = false;
        service.matches        = ['String(cod-refer)', 'it-codigo'];
        
        service.TOTVSPostArray = function (parameters, model, callback, headers) {
            service.resource.parseHeaders(headers);
            var call = service.resource.postArray(parameters, model);
            return service.resource.processPromise(call, callback);
        };
	    
        service.propertyFields = [
            {label: $rootScope.i18n('l-reference'), property: 'cod-refer', type: 'string', default: true},
            {label: $rootScope.i18n('l-item'), property: 'it-codigo', type: 'string'}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-reference'), field: 'cod-refer', width: 80, minWidth: 40},
            {headerName: $rootScope.i18n('l-item'), field: 'it-codigo', width: 460, minWidth: 80}            
        ];
        
        /* 
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
         */
        service.comparator = function(item1, item2) {
            return (item1.id === item2.id);
        };
        
        service.getObjectFromValue =  function (value) {  

            return this.resource.TOTVSGet({
                itCodigo: helperItem.data,
                codRefer: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };

        service.beforeQuery = function (queryproperties, parameters) {

            if (queryproperties.where)
                queryproperties.where = queryproperties.where.concat(' AND it-codigo = "' + helperItem.data + '"');
            else {
                if (queryproperties.property) {
                    queryproperties.where = "String(" + queryproperties.property[0] + ') matches "' + queryproperties.value[0]+ '" AND it-codigo = "' + helperItem.data + '"';
                } else {
                    queryproperties.where = 'it-codigo = "' + helperItem.data + '"';
                }
            }
        }       

		return service;
	}
    
    index.register.service('mmi.refeItem.zoom', serviceZoomRefeItem);
});