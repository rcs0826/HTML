define(['index',
'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

/*####################################################################################################
# Table...: empresa
# Service.: serviceZoomEmpresa
# Register: mab.empresa.zoom
####################################################################################################*/
serviceZoomEmpresa.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
function serviceZoomEmpresa($timeout, $totvsresource, $rootScope, $filter, zoomService){

var service = {};

angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/unbo/boun004html//:id');
service.zoomName       = $rootScope.i18n('l-company');
service.configuration  = true;
service.advancedSearch = false;
service.matches        = ['ep-codigo', 'nome'];


service.TOTVSPostArray = function (parameters, model, callback, headers) {
    service.resource.parseHeaders(headers);
    var call = service.resource.postArray(parameters, model);
    return service.resource.processPromise(call, callback);
};

service.propertyFields = [
    {label: $rootScope.i18n('l-company'), property: 'ep-codigo', type: 'string', maxlength: '30', default: true},
    {label: $rootScope.i18n('l-company-name'), property: 'nome', type: 'string', maxlength: '60'}
];

service.columnDefs = [
    {headerName: $rootScope.i18n('l-company'), field: 'ep-codigo', width: 80, minWidth: 40},
    {headerName: $rootScope.i18n('l-company-name'), field: 'nome', width: 460, minWidth: 80}            
];

/* 
 * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
 */
service.comparator = function(item1, item2) {
    return (item1['ep-codigo'] === item2['ep-codigo']);
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

index.register.service('mab.empresa.zoom', serviceZoomEmpresa);
});