define(['index',
'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

/*####################################################################################################
# Table...: mab-model
# Service.: serviceZoomMabModel
# Register: mab.mab-model.zoom
####################################################################################################*/
	serviceZoomMabModel.$inject = ['$totvsresource', '$rootScope', 'dts-utils.zoom'];
	
	function serviceZoomMabModel($totvsresource, $rootScope, zoomService) {
	
	var service = {};
	
	angular.extend(service, zoomService);
	
	service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/frbo/bofr016//:id');
	service.zoomName       = $rootScope.i18n('l-model');
	service.configuration  = true;
	service.advancedSearch = false;
	service.matches        = ['cod-model', 'des-model'];
	
	
	service.TOTVSPostArray = function (parameters, model, callback, headers) {
	    service.resource.parseHeaders(headers);
	    var call = service.resource.postArray(parameters, model);
	    return service.resource.processPromise(call, callback);
	};
	
	service.propertyFields = [
	    {label: $rootScope.i18n('l-model-cf'), property: 'cod-model', type: 'string', maxlength: '8', default: true},
	    {label: $rootScope.i18n('l-description'), property: 'des-model', type: 'string', maxlength: '40'}
	];
	
	service.columnDefs = [
	    {headerName: $rootScope.i18n('l-model-cf'), field: 'cod-model', width: 80, minWidth: 40},
	    {headerName: $rootScope.i18n('l-description'), field: 'des-model', width: 200, minWidth: 80},
	    {headerName: $rootScope.i18n('l-brand'), field: 'cod-marca', width: 80, minWidth: 40}
	];
	
	service.comparator = function(item1, item2) {
		return (item1['cod-model'] === item2['cod-model']);
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
	
	index.register.service('mab.mab-model.zoom', serviceZoomMabModel);
});