define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	# Database: mgmnt
	# Table...: tecn-mi
	# Service.: serviceZoomTecnMi
	# Register: mmi.tecn-mi.zoom
	####################################################################################################*/
	serviceZoomTecnMi.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter'];
	
	function serviceZoomTecnMi($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter){
		
  	var service = {};

    angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

    service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn157/:method/:id/');
    service.zoomName       = i18nFilter('l-technicians', [], 'dts/mmi');
    service.configuration  = true;
    service.advancedSearch = false;
    service.matches = ['cd-tecnico','nome-compl'];

    service.TOTVSPostArray = function (parameters, model, callback, headers) {
        service.resource.parseHeaders(headers);
        var call = service.resource.postArray(parameters, model);
        return service.resource.processPromise(call, callback);
    };

    service.propertyFields = [
        {label: i18nFilter('l-technician', [], 'dts/mmi'), property: 'cd-tecnico', type: 'string', default: true},
        {label: i18nFilter('l-description', [], 'dts/mmi'), property: 'nome-compl', type: 'string'}
    ];

    service.columnDefs = [
        {headerName: i18nFilter('l-technician', [], 'dts/mmi'), field: 'cd-tecnico', width: 81, minWidth: 81},
        {headerName: i18nFilter('l-description', [], 'dts/mmi'), field: 'nome-compl', width: 80, minWidth: 80},
        {headerName: i18nFilter('l-group', [], 'dts/mmi'), field: 'log-1', width: 80, minWidth: 80, valueGetter: function(params){
            var cText = "";
            switch (params.data['log-1']){
                case true:
                    cText = i18nFilter('l-yes', [], 'dts/mmi');
                    break;
                case false:
                    cText = i18nFilter('l-no', [], 'dts/mmi');
                    break;
            };
            return cText; 
        }}
    ];

    /*
     * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao
     */
    service.comparator = function(item1, item2) {
        return (item1['cd-tecnico'] === item2['cd-tecnico']);
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

  index.register.service('mmi.tecn-mi.zoom', serviceZoomTecnMi);
});
