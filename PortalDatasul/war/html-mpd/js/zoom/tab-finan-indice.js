define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {
		
	/*####################################################################################################
    # Database: mgdis
    # Table...: tab-finan-indice
    # Service.: serviceTabFinanIndice
    # Register: mpd.tab-finan-indice.zoom
    ####################################################################################################*/

	serviceTabFinanIndice.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceTabFinanIndice($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {
		
		var scopeService = this;
		
		var service = {};
		angular.extend(service, zoomService);
		
		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi388na/:method/:tabfinan/:id', {fields: "nr-tab-finan,num-seq,tab-ind-fin,tab-dia-fin"}),
		service.zoomName = $rootScope.i18n('l-nr-ind-finan', undefined, 'dts/mpd');
		service.configuration = false;
                service.useSearchMethod = true;
                service.matches = ['num-seq'];  
        
		service.propertyFields = [
          	{label: 'l-nr-ind-finan', property: 'numseq', type:'integerrange', default: true}
        ];
			
		service.columnDefs = [
            {headerName: $rootScope.i18n('l-tab-finan', undefined, 'dts/mpd'), field: 'nr-tab-finan'},
            {headerName: $rootScope.i18n('l-num-seq-tab-fin', undefined, 'dts/mpd'), field: 'num-seq'},
            {headerName: $rootScope.i18n('l-tab-ind-fin-tab-fin', undefined, 'dts/mpd'), field: 'tab-ind-fin'},
            {headerName: $rootScope.i18n('l-tab-dia-fin-tab-fin', undefined, 'dts/mpd'), field: 'tab-dia-fin'},
        ];
        
        service.getObjectFromValue =  function (value, init) {
            if (value && init) {
                return this.resource.TOTVSGet({
                    id: value, tabfinan: init
                }, undefined, {
                    noErrorMessage: true
                }, false);                
            }
        };
        
        service.beforeQuery = function (queryproperties, parameters) {
            if (parameters.init) {
                queryproperties.property = queryproperties.property || [];
                queryproperties.value = queryproperties.value || [];
				queryproperties.property.push('nr-tab-finan');
				queryproperties.value.push(parameters.init);                
            }
        }
        
        service.comparator = function(item1, item2) {
            return (item1['nr-tab-finan'] === item2['nr-tab-finan'] && item1['num-seq'] === item2['num-seq']);
        };
        
        service.tabFinanIndiceList = [];
        service.getTabFinanIndice = function (value, init) {
            
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];
            
            parameters.disclaimers.push({
                property: "nr-tab-finan",
                type: "integer",
                value: init
            });
            parameters.disclaimers.push({
                property: "nr-seq",
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
	index.register.service('mpd.tab-finan-indice.zoom', serviceTabFinanIndice);
	
});