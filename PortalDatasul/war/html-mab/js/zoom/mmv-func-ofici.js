define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'
        ], function(index) {

	/*####################################################################################################
	# Database: 
	# Table...: mmv-func-ofici
	# Service.: serviceZoomMmvFuncOfici
	# Register:mab.mmv-func-ofici.zoom
	####################################################################################################*/
	serviceZoomMmvFuncOfici.$inject = ['$totvsresource', '$rootScope', 'dts-utils.zoom','helperZoomFunc'];
	
	function serviceZoomMmvFuncOfici($totvsresource, $rootScope, zoomService, helperZoomFunc){
		
	  	var service = {};
	
	    angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
	
	    service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/frbo/bofr032//:pEmpresa//:pCodEstabel//:pCodMatricula');
	    service.zoomName       =  $rootScope.i18n('l-employee');
	    service.configuration  = true;
	    service.advancedSearch = false;
	    service.matches = ['cod-matr', 'nom-func'];
	
	    service.TOTVSPostArray = function (parameters, model, callback, headers) {
	        service.resource.parseHeaders(headers);
	        var call = service.resource.postArray(parameters, model);
	        return service.resource.processPromise(call, callback);
	    };
	
	    service.propertyFields = [
            {label: $rootScope.i18n('l-code-employee'), property: 'cod-matr', type: 'string', default: true},
            {label: $rootScope.i18n('l-employee'), property: 'nom-func', type: 'string'}            
	    ];
            
	    service.columnDefs = [
            {headerName: $rootScope.i18n('l-code-employee'), field: 'cod-matr', width: 50, minWidth: 40},
            {headerName: $rootScope.i18n('l-employee'), field: 'nom-func', width: 120, minWidth: 40},
            {headerName: $rootScope.i18n('l-company'), field: 'ep-codigo', width: 50, minWidth: 40},
            {headerName: $rootScope.i18n('l-site'), field: 'cod-estabel', width: 50, minWidth: 40},
            {headerName: $rootScope.i18n('l-sector'), field: 'cod-setor-ofici', width: 50, minWidth: 40},
	    ];
	
        service.getObjectFromValue =  function (value) {  

            return this.resource.TOTVSGet({
                pEmpresa: helperZoomFunc.data.pEmpresa,
                pCodEstabel: helperZoomFunc.data.pCodEstabel,
                pCodMatricula: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };
		return service;
  }

  index.register.service('mab.mmv-func-ofici.zoom', serviceZoomMmvFuncOfici);
});
