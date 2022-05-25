define(['index',
'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

/*####################################################################################################
# Table...: mab-grp-eqpto
# Service.: serviceZoomMabGrpEqpto
# Register: mab.mab-grp-eqpto.zoom
####################################################################################################*/
	serviceZoomMabGrpEqpto.$inject = ['$totvsresource', '$rootScope', 'dts-utils.zoom'];
	
	function serviceZoomMabGrpEqpto($totvsresource, $rootScope, zoomService) {
	
	var service = {};
	
	angular.extend(service, zoomService);
	
	service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/frbo/bofr011//:id');
	service.zoomName       = $rootScope.i18n('l-equipment-group');
	service.configuration  = true;
	service.advancedSearch = false;
	service.matches        = ['cod-grp-eqpto', 'des-grp-eqpto'];
	
	
	service.TOTVSPostArray = function (parameters, model, callback, headers) {
	    service.resource.parseHeaders(headers);
	    var call = service.resource.postArray(parameters, model);
	    return service.resource.processPromise(call, callback);
	};
	
	service.propertyFields = [
	    {label: $rootScope.i18n('l-group'), property: 'cod-grp-eqpto', type: 'string', maxlength: '8', default: true},
	    {label: $rootScope.i18n('l-description'), property: 'des-grp-eqpto', type: 'string', maxlength: '40'}
	];
	
	service.columnDefs = [
	    {headerName: $rootScope.i18n('l-group'), field: 'cod-grp-eqpto', width: 80, minWidth: 40},
	    {headerName: $rootScope.i18n('l-description'), field: 'des-grp-eqpto', width: 200, minWidth: 80}
	];
	
	service.comparator = function(item1, item2) {
		return (item1['cod-grp-eqpto'] === item2['cod-grp-eqpto']);		
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
	
	index.register.service('mab.mab-grp-eqpto.zoom', serviceZoomMabGrpEqpto);
});