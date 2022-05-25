define(['index',
'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

/*####################################################################################################
# Table...: mmv-plano-prevent
# Service.: serviceZoomMmvPlanoPrevent
# Register: mab.mmvPlanoPrevent.zoom
####################################################################################################*/
	serviceZoomMmvPlanoPrevent.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
	
	function serviceZoomMmvPlanoPrevent($timeout, $totvsresource, $rootScope, $filter, zoomService) {
	
	var service = {};
	
	angular.extend(service, zoomService);
	
	service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/frbo/bofr035//:id');
	service.zoomName       = $rootScope.i18n('l-maintenance-plan');
	service.configuration  = true;
	service.advancedSearch = false;
	service.matches        = ['cod-model', 'cod-plano'];
	
	service.TOTVSPostArray = function (parameters, model, callback, headers) {
	    service.resource.parseHeaders(headers);
	    var call = service.resource.postArray(parameters, model);
	    return service.resource.processPromise(call, callback);
	};
	
	service.propertyFields = [
	    {label: $rootScope.i18n('l-model-cf'), property: 'cod-model', type: 'string', maxlength: '8', default: true},
	    {label: $rootScope.i18n('l-description'), property: 'des-model', type: 'string', maxlength: '30'}
	];
	
	service.columnDefs = [
		{headerName: $rootScope.i18n('l-model-cf'), field: 'cod-model', width: 100, minWidth: 40},
		{headerName: $rootScope.i18n('l-description'), field: 'desModelo', width: 280, minWidth: 80,
		    valueGetter: function (params) {
		    	if (params.data && params.data._) {
		    		return params.data._.desModelo;
		    	}
	        }
	    },
		{headerName: $rootScope.i18n('l-plan'), field: 'cod-plano', width: 120, minWidth: 40},
		{headerName: $rootScope.i18n('l-description'), field: 'des-plano-manut', width: 280, minWidth: 80},
		{headerName: $rootScope.i18n('l-event'), field: 'cod-evento', width: 80, minWidth: 40},	
		{headerName: $rootScope.i18n('l-subsystem'), field: 'cod-sub-sist', width: 80, minWidth: 40},		
		{headerName: $rootScope.i18n('l-maintenance-type'), field: 'cd-tipo', width: 120, minWidth: 40},
		{headerName: $rootScope.i18n('l-calend'), field: 'cod-calend-padr', width: 80, minWidth: 40},
	];
	
	service.comparator = function(item1, item2) {
		return (item1['cod-model'] === item2['cod-model'] && item1['cod-plano'] === item2['cod-plano']);
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
	
	index.register.service('mab.mmv-plano-prevent.zoom', serviceZoomMmvPlanoPrevent);
});