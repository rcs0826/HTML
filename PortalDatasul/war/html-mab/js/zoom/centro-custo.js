define(['index',
'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

/*####################################################################################################
# Table...: centro-custo
# Service.: mab.centroCusto.zoom
# Register: serviceZoomCentroCusto
####################################################################################################*/
serviceZoomCentroCusto.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
function serviceZoomCentroCusto($timeout, $totvsresource, $rootScope, $filter, zoomService){

var service = {};

angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin042//:id');
service.zoomName       = $rootScope.i18n('l-cc-codigo');
service.configuration  = true;
service.advancedSearch = false;
service.matches        = ['cc-codigo', 'descricao'];


service.TOTVSPostArray = function (parameters, model, callback, headers) {
    service.resource.parseHeaders(headers);
    var call = service.resource.postArray(parameters, model);
    return service.resource.processPromise(call, callback);
};

service.propertyFields = [
    {label: $rootScope.i18n('l-cc-codigo'), property: 'cc-codigo', type: 'string', maxlength: '30', default: true},
    {label: $rootScope.i18n('l-description'), property: 'descricao', type: 'string', maxlength: '60'}
];

service.columnDefs = [
    {headerName: $rootScope.i18n('l-cc-codigo'), field: 'cc-codigo', width: 80, minWidth: 40},
    {headerName: $rootScope.i18n('l-description'), field: 'descricao', width: 460, minWidth: 80}            
];

/* 
 * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
 */
service.comparator = function(item1, item2) {
    return (item1['cc-codigo'] === item2['cc-codigo']);
};

service.getObjectFromValue =  function (value) {        	
    if (!isNaN(value)){        	
        return this.resource.TOTVSGet({
            id: value
        }, undefined, {
            noErrorMessage: true
        }, true);
    }        	
};

return service;
}

index.register.service('mab.centroCusto.zoom', serviceZoomCentroCusto);
});