define(['index',
'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

/*####################################################################################################
# Table...: mmv-setor-ofici
# Service.: serviceZoomMmvSetorOfici
# Register: mab.mmvSetorOfici.zoom
####################################################################################################*/
	serviceZoomMmvSetorOfici.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
	
	function serviceZoomMmvSetorOfici($timeout, $totvsresource, $rootScope, $filter, zoomService) {
	
	var service = {};
	
	angular.extend(service, zoomService);
	
	service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/frbo/bofr036//:id');
	service.zoomName       = $rootScope.i18n('l-sector');
	service.configuration  = true;
	service.advancedSearch = false;
	service.matches        = ['cod-setor-ofici', 'des-setor-ofici','cod-ofici'];
	
	
	service.TOTVSPostArray = function (parameters, model, callback, headers) {
	    service.resource.parseHeaders(headers);
	    var call = service.resource.postArray(parameters, model);
	    return service.resource.processPromise(call, callback);
	};
	
	service.propertyFields = [
	    {label: $rootScope.i18n('l-sector'), property: 'cod-setor-ofici', type: 'string', maxlength: '8', default: true},
		{label: $rootScope.i18n('l-description'), property: 'des-setor-ofici', type: 'string', maxlength: '30'},
		{label: $rootScope.i18n('l-workshop'), property: 'cod-ofici', type: 'string', maxlength: '8'}
	];
	
	service.columnDefs = [
	    {headerName: $rootScope.i18n('l-sector'), field: 'cod-setor-ofici', width: 80, minWidth: 40},
	    {headerName: $rootScope.i18n('l-description'), field: 'des-setor-ofici', width: 260, minWidth: 80},
	    {headerName: $rootScope.i18n('l-workshop'), field: 'cod-ofici', width: 80, minWidth: 40},	    
	    {
	    	headerName: $rootScope.i18n('l-description'), 
	    	field: 'desOficina', 
	    	width: 260, 
	    	minWidth: 80,
	    	valueGetter: function (params) {
	    		if (params.data && params.data._) {
	    			return params.data._.desOficina;
	    		}
            }
	    }
	];
	
	service.comparator = function(item1, item2) {
	    return (item1['cod-setor-ofici'] === item2['cod-setor-ofici']);
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
	
	index.register.service('mab.mmvSetorOfici.zoom', serviceZoomMmvSetorOfici);
});