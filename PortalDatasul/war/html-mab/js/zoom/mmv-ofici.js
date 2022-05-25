define(['index',
'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

/*####################################################################################################
# Table...: oficina
# Service.: serviceZoomOficina
# Register: mab.oficina.zoom
####################################################################################################*/
	serviceZoomOficina.$inject = ['$totvsresource', '$rootScope', 'dts-utils.zoom'];
	
	function serviceZoomOficina($totvsresource, $rootScope, zoomService) {
	
	var service = {};
	
	angular.extend(service, zoomService);
	
	service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/frbo/bofr033//:id');
	service.zoomName       = $rootScope.i18n('l-workshop');
	service.configuration  = true;
	service.advancedSearch = false;
	service.matches        = ['cod-ofici', 'des-ofici'];
	
	
	service.TOTVSPostArray = function (parameters, model, callback, headers) {
	    service.resource.parseHeaders(headers);
	    var call = service.resource.postArray(parameters, model);
	    return service.resource.processPromise(call, callback);
	};
	
	service.propertyFields = [
	    {label: $rootScope.i18n('l-workshop'), property: 'cod-ofici', type: 'string', maxlength: '8', default: true},
	    {label: $rootScope.i18n('l-name'), property: 'des-ofici', type: 'string', maxlength: '30'},
	    {label: $rootScope.i18n('l-site'), property: 'cod-estabel', type: 'string', maxlength: '5'}
	];
	
	service.columnDefs = [
	    {headerName: $rootScope.i18n('l-workshop'), field: 'cod-ofici', width: 80, minWidth: 40},
	    {headerName: $rootScope.i18n('l-name'), field: 'des-ofici', width: 240, minWidth: 80},
	    {headerName: $rootScope.i18n('l-site'), field: 'cod-estabel', width: 80, minWidth: 40}    
	    
	];
	
	service.comparator = function(item1, item2) {
		return (item1['cod-ofici'] === item2['cod-ofici']);
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
	
	index.register.service('mab.oficina.zoom', serviceZoomOficina);
});