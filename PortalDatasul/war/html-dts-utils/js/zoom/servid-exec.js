define(['index',
	'/dts/dts-utils/js/zoom/zoom.js'], function(index) {

	/*####################################################################################################
	 # Database: mgdis
	 # Table...: servid-exec
	 # Service.: serviceRPW
	 # Register: dts-utils.servidexec.zoom
	 ####################################################################################################*/

	serviceRPW.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceRPW($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

		var service = {};

		angular.extend(service, zoomService);

		service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/fnbo/bofn054/:method//:id');
		service.zoomName       = $rootScope.i18n('l-rpw-server', undefined, '');
		service.setConfiguration('fnd.servid-exec.zoom');
		service.propertyFields = [
		{
		label: $rootScope.i18n('code', undefined, ''),  	       
		property: 'cod_servid_exec', 
		type: 'stringextend',
		default: true
		},
		{
		label: $rootScope.i18n('name', undefined, ''),     
		property: 'des_servid_exec',
		type: 'stringextend'
		}
		];

		service.columnDefs = [
		{
		headerName: $rootScope.i18n('code', [], ''), 
		field: 'cod_servid_exec', 
		width: 110, 
		minWidth: 100
		}, {
		headerName: $rootScope.i18n('name', [], ''), 
		field: 'des_servid_exec', 
		width: 150, 
		minWidth: 100
		}
		];

		service.getObjectFromValue = function (value) {
		if (!value) return undefined;
		return this.resource.TOTVSGet({
		id: value
		}, undefined, {
		noErrorMessage: true
		}, true);
		};

		return service;		
		

	}
	index.register.service('dts-utils.servidexec.zoom', serviceRPW);

	

});
