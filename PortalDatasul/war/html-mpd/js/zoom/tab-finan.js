define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {
		
	/*####################################################################################################
    # Database: mgdis
    # Table...: tab-finan
    # Service.: serviceTabFinan
    # Register: mpd.tab-finan.zoom
    ####################################################################################################*/

	serviceTabFinan.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceTabFinan($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {
		
		var scopeService = this;
		
		var service = {};
		angular.extend(service, zoomService);
		
		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi187na/:method/:gotomethod/:id', {fields: "nr-tab-finan"}, {});
		service.zoomName = $rootScope.i18n('l-tab-finan', undefined, 'dts/mpd');
		service.configuration = false;
        service.useSearchMethod = true;
        service.matches = ['nr-tab-finan'];  
        
		service.propertyFields = [
          	{label: 'l-tab-finan', property: 'nr-tab-finan', type:'integerrange', default: true}
        ];
			
		service.columnDefs = [
            {headerName: $rootScope.i18n('l-tab-finan', undefined, 'dts/mpd'), field: 'nr-tab-finan'},
        ];
        
        service.getObjectFromValue =  function (value) {
            if (value) {
                return this.resource.TOTVSGet({
                    id: value
                }, undefined, {
                    noErrorMessage: true
                }, true);                
            }
        };
        
        service.comparator = function(item1, item2) {
            return (item1['nr-tab-finan'] === item2['nr-tab-finan']);
        };
        
        service.tabFinanList = [];
        service.getTabFinan = function (value) {
            
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];
            
            parameters.disclaimers.push({
                property: "nr-tab-finan",
                type: "integer",
                value: value
            });
                 
            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });
            
            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.emitenteList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);
            
        };
        
		return service;
		
	}
	index.register.service('mpd.tab-finan.zoom', serviceTabFinan);
	
});