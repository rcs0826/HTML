define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

  /*####################################################################################################
  # Database: mgmnt
  # Table...: mi-parada
  # Service.: serviceZoomStop
  # Register: mmi.parada.zoom
  ####################################################################################################*/
  serviceZoomStop.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter'];
  function serviceZoomStop($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter){

  	var service = {};

    angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

    service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn114/:method/:id/');
    service.zoomName       = i18nFilter('l-stop-plan', [], 'dts/mmi');
    service.configuration  = true;
    service.advancedSearch = false;
    service.matches = ['cd-parada','descricao'];

    service.TOTVSPostArray = function (parameters, model, callback, headers) {
        service.resource.parseHeaders(headers);
        var call = service.resource.postArray(parameters, model);
        return service.resource.processPromise(call, callback);
    };

    service.propertyFields = [
        {label: i18nFilter('l-stop-plan', [], 'dts/mmi'), property: 'cd-parada', type: 'string', default: true},
        {label: i18nFilter('l-description', [], 'dts/mmi'), property: 'descricao', type: 'string'}
    ];

    service.columnDefs = [
        {headerName: i18nFilter('l-stop-plan', [], 'dts/mmi'), field: 'cd-parada', width: 80, minWidth: 80},
        {headerName: i18nFilter('l-description', [], 'dts/mmi'), field: 'descricao', width: 160, minWidth: 160}
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

  index.register.service('mmi.parada.zoom', serviceZoomStop);
});
