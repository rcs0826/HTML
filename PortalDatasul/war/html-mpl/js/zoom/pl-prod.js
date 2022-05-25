define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {
		
	/*####################################################################################################
    # Database: mgind
    # Table...: pl-prod
    # Service.: servicePlanoProducaoZoom
    # Register: mpl.pl-prod.zoom
    ####################################################################################################*/

	servicePlanoProducaoZoom.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function servicePlanoProducaoZoom($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {
		
		var scopeService = this;
		
		var service = {};
		angular.extend(service, zoomService);
		
		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin318/:method/:id', {}, {});
		service.zoomName = "l-production-plan";
		service.configuration = false;
		
        service.propertyFields = [
          	{label: 'l-plan-code', property: 'cd-plano', type:'integerrange', default: true},
            {label: 'l-description', property: 'descricao', type:'stringrange'},
            {label: 'l-state', property: 'pl-estado', type:'integerrange'}];
        
		service.columnDefs = [
            {headerName: $rootScope.i18n('l-plan-code', undefined, 'dts/mpl'), field: 'cd-plano'},
            {headerName: $rootScope.i18n('l-description', undefined, 'dts/mpl'), field: 'descricao'},
            {headerName: $rootScope.i18n('l-state', undefined, 'dts/mpl'), field: 'pl-estado'}];
        
        service.getObjectFromValue =  function (value) {
            return this.resource.TOTVSGet({
                id: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };
        
        service.comparator = function(item1, item2) {
            return (item1.id === item2.id);
        };
        
        service.productionPlanList = [];
        service.getPlan = function (value) {
            
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];
            
            parameters.disclaimers.push({
                property: "cd-plano",
                type: "integer",
                value: value
            });
                 
            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });
            
            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.productionPlanList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);
            
        };
        
		return service;
		
	}
	index.register.service('mpl.pl-prod.zoom', servicePlanoProducaoZoom);
	
});