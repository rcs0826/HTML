define(['index',
'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

/*####################################################################################################
# Table...: tab-mob-dir
# Service.: mab.tabMobDir.zoom
# Register: serviceZoomTabMobDir
####################################################################################################*/
	serviceZoomTabMobDir.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom'];
	function serviceZoomTabMobDir($timeout, $totvsresource, $rootScope, $filter, zoomService){
	
		var service = {};
		
		angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
		
		service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin566//:id');
		service.zoomName       = $rootScope.i18n('l-direct-labor-code');
		service.configuration  = true;
		service.advancedSearch = false;
		service.matches        = ['cd-mob-dir', 'descricao'];
		
		
		service.TOTVSPostArray = function (parameters, model, callback, headers) {
		    service.resource.parseHeaders(headers);
		    var call = service.resource.postArray(parameters, model);
		    return service.resource.processPromise(call, callback);
		};
		
		service.propertyFields = [
		    {label: $rootScope.i18n('l-direct-labor-code'), property: 'cd-mob-dir', type: 'string', maxlength: '30', default: true},
		    {label: $rootScope.i18n('l-description'), property: 'descricao', type: 'string', maxlength: '60'}
		];
		
		service.columnDefs = [
		    {headerName: $rootScope.i18n('l-direct-labor-code'), field: 'cd-mob-dir', width: 80, minWidth: 40},
		    {headerName: $rootScope.i18n('l-description'), field: 'descricao', width: 460, minWidth: 80}            
		];
		
		service.comparator = function(item1, item2) {
		    return (item1['cd-mob-dir'] === item2['cd-mob-dir']);
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
	
	index.register.service('mab.tabMobDir.zoom', serviceZoomTabMobDir);
});