define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {
		
	/*####################################################################################################
    # Database: mgadm
    # Table...: cond-pagto
    # Service.: serviceCondPagto
    # Register: mpd.cond-pagto.zoom
    ####################################################################################################*/

	serviceCondPagto.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceCondPagto($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {
		
		var scopeService = this;
		
		var service = {};
		angular.extend(service, zoomService);
		
		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad039na/:method/:gotomethod/:id', {fields: "cod-cond-pag,descricao"}, {});
		service.zoomName = $rootScope.i18n('l-pay-cond', undefined, 'dts/mcc');
		service.configuration = true;
        service.setConfiguration('mcc.cond-pagto-2.zoom');
        service.useSearchMethod = true;
        service.matches = ['cod-cond-pag', 'descricao'];  
        
		service.propertyFields = [
          	{label: $rootScope.i18n('l-pay-cond', undefined, 'dts/mcc'), property: 'cod-cond-pag', type:'integerrange', default: true},
            {label: $rootScope.i18n('l-description', undefined, 'dts/mcc'), property: 'descricao', type:'stringrange'}
        ];
			
		service.columnDefs = [
            {headerName: $rootScope.i18n('l-pay-cond', undefined, 'dts/mcc'), field: 'cod-cond-pag'},
            {headerName: $rootScope.i18n('l-description', undefined, 'dts/mcc'), field: 'descricao'}
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
            return (item1['cod-cond-pag'] === item2['cod-cond-pag']);
        };
        
        service.condPagtoList = [];
        service.getCondPagto = function (value) {
            
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];
            
            parameters.disclaimers.push({
                property: "cod-cond-pag",
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
	index.register.service('mcc.cond-pagto-2.zoom', serviceCondPagto);
	
});
