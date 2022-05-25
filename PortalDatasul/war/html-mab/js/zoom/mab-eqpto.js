define(['index',
'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

/*####################################################################################################
# Table...: mab-eqpto
# Service.: serviceZoomMabEqpto
# Register: mab.mabEqpto.zoom
####################################################################################################*/
	serviceZoomMabEqpto.$inject = ['$totvsresource', '$rootScope', 'dts-utils.zoom'];
	
	function serviceZoomMabEqpto($totvsresource, $rootScope, zoomService) {
	
	var service = {};
	
	angular.extend(service, zoomService);
	
	service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/frbo/bofr007//:id');
	service.zoomName       = $rootScope.i18n('l-equipment');
	service.configuration  = true;
	service.advancedSearch = false;
	service.matches        = ['ep-codigo', 'cod-eqpto', 'cod-model'];
	
	
	service.TOTVSPostArray = function (parameters, model, callback, headers) {
	    service.resource.parseHeaders(headers);
	    var call = service.resource.postArray(parameters, model);
	    return service.resource.processPromise(call, callback);
	};
	
	service.propertyFields = [
	    {label: $rootScope.i18n('l-company'), property: 'ep-codigo', type: 'string', maxlength: '3', default: true},
	    {label: $rootScope.i18n('l-equipment'), property: 'cod-eqpto', type: 'string', maxlength: '16'},
	    {label: $rootScope.i18n('l-model-cf'), property: 'cod-model', type: 'string', maxlength: '8'}
	];
	
	service.columnDefs = [
	    {headerName: $rootScope.i18n('l-company'), field: 'ep-codigo', width: 80, minWidth: 40},
	    {headerName: $rootScope.i18n('l-equipment'), field: 'cod-eqpto', width: 120, minWidth: 60},
	    {headerName: $rootScope.i18n('l-model-cf'), field: 'cod-model', width: 80, minWidth: 40},
	    {
	    	headerName: $rootScope.i18n('l-description'), 
	    	field: 'desModelo', 
	    	width: 200, 
	    	minWidth: 100,
	    	valueGetter: function (params) {
	    		if (params.data && params.data._) {
	    			return params.data._.desModelo;
	    		}
            }
	    }
	];
	
	service.comparator = function(item1, item2) {
	    return (item1['ep-codigo'] === item2['ep-codigo'] && item1['cod-eqpto'] === item2['cod-eqpto']);
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
	
	index.register.service('mab.mab-eqpto.zoom', serviceZoomMabEqpto);
});