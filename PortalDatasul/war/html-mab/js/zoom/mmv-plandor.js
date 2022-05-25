define(['index',
'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

/*####################################################################################################
# Table...: mmv-plandor
# Service.: serviceZoomMmvPlandor
# Register: mab.mmvPlandor.zoom
####################################################################################################*/
	serviceZoomMmvPlandor.$inject = ['$totvsresource', '$rootScope', 'dts-utils.zoom'];
	
	function serviceZoomMmvPlandor($totvsresource, $rootScope, zoomService) {
	
	var service = {};
	
	angular.extend(service, zoomService);
	
	service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/frbo/bofr077//:id');
	service.zoomName       = $rootScope.i18n('l-planner');
	service.configuration  = true;
	service.advancedSearch = false;
	service.matches        = ['cod-plandor', 'nom-plandor'];
	
	
	service.TOTVSPostArray = function (parameters, model, callback, headers) {
	    service.resource.parseHeaders(headers);
	    var call = service.resource.postArray(parameters, model);
	    return service.resource.processPromise(call, callback);
	};
	
	service.propertyFields = [
	    {label: $rootScope.i18n('l-planner'), property: 'cod-plandor', type: 'string', maxlength: '12', default: true},
	    {label: $rootScope.i18n('l-name'), property: 'nom-plandor', type: 'string', maxlength: '30'}
	];
	
	service.columnDefs = [
	    {headerName: $rootScope.i18n('l-planner'), field: 'cod-plandor', width: 80, minWidth: 40},
	    {headerName: $rootScope.i18n('l-name'), field: 'nom-plandor', width: 200, minWidth: 80},
	    {headerName: $rootScope.i18n('l-email'), field: 'des-email', width: 200, minWidth: 40},	    
	    {
	    	headerName: $rootScope.i18n('l-status'), 
	    	field: 'num-livre-1', 
	    	width: 80, 
	    	minWidth: 40,
	    	valueGetter: function (params) {
	    		if (params.data['num-livre-1'] === 1) {
	    			return $rootScope.i18n('l-active');
	    		} else {
	    			return $rootScope.i18n('l-inactive');
	    		}
            }
	    }
	];
	
	service.comparator = function(item1, item2) {
		return (item1['cod-plandor'] === item2['cod-plandor']);
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
	
	index.register.service('mab.mmv-plandor.zoom', serviceZoomMmvPlandor);
});