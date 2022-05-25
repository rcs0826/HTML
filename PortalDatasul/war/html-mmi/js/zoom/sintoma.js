define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

  /*####################################################################################################
  # Database: mgmnt
  # Table...: sintoma
  # Service.: serviceZoomSympthom
  # Register: mmi.sintoma.zoom
  ####################################################################################################*/
	serviceZoomSympthom.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter'];
  function serviceZoomSympthom($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter){

  	var service = {};

    angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

    service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn149/:method/:id/');
    service.zoomName       = i18nFilter('l-sympthom', [], 'dts/mmi');
    service.configuration  = true;
    service.advancedSearch = false;
    service.matches = ['cd-sint-padr','descricao'];

    service.TOTVSPostArray = function (parameters, model, callback, headers) {
        service.resource.parseHeaders(headers);
        var call = service.resource.postArray(parameters, model);
        return service.resource.processPromise(call, callback);
    };

    service.propertyFields = [
        {label: i18nFilter('l-sympthom', [], 'dts/mmi'), property: 'cd-sint-padr', type: 'string', default: true},
        {label: i18nFilter('l-description', [], 'dts/mmi'), property: 'descricao', type: 'string'}
    ];

    service.columnDefs = [
        {headerName: i18nFilter('l-sympthom', [], 'dts/mmi'), field: 'cd-sint-padr', width: 81, minWidth: 81},
        {headerName: i18nFilter('l-description', [], 'dts/mmi'), field: 'descricao', width: 80, minWidth: 80}
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

  index.register.service('mmi.sintoma.zoom', serviceZoomSympthom);
});
