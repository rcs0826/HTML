define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {
		
	/*####################################################################################################
    # Database: mgind
    # Table...: ref-item
    # Service.: serviceReferenciaItem
    # Register: men.referenciaItem.zoom
    ####################################################################################################*/

	serviceReferenciaItem.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function serviceReferenciaItem($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {
		
		var scopeService = this;
		
		var service = {};
		angular.extend(service, zoomService);
		
		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin375/:method/:id', {}, {});
		service.zoomName = "l-reference";
		service.configuration = false;
		
		service.propertyFields = [
          	{label: 'l-reference', property: 'cod-refer', type:'stringrange', default: true},
            {label: 'l-item', property: 'it-codigo', type:'stringrange'}];
        
		service.columnDefs = [
            {headerName: $rootScope.i18n('l-reference'), field: 'cod-refer'},
            {headerName: $rootScope.i18n('l-item'), field: 'it-codigo'}];
        
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
        
        service.applyFilter = function (parameters) {
            var useCache = true;
            var hasUserFilter = false;
            
            if (parameters.init !== undefined && parameters.init.property === 'it-codigo') {
                angular.forEach(parameters.disclaimers, function(result) {
                    if (result.property === parameters.init.property) {
                        hasUserFilter = true;
                    }
                });
                
                if (hasUserFilter == false) {
                    if (!parameters.disclaimers) {
                        parameters.disclaimers = [];
                    }
                    parameters.disclaimers.push({label: 'l-item',
                                                 property: parameters.init.property,
                                                 type: 'stringrange',
                                                 value: parameters.init.value});
                }
            }
            
            if (this.useCache !== undefined)
            {
                useCache = this.useCache;
            }
            if (parameters.isSelectValue) {
                if (this.disclaimerSelect) {
                    parameters.disclaimers[0].type = this.disclaimerSelect.type;
                    if (this.disclaimerSelect.extend !== undefined) {
                        parameters.disclaimers[0].extend = this.disclaimerSelect.extend;
                    }
                }
            }

            var thisZoom = this,
                queryproperties = {};


            if (this.useSearchMethod && parameters.isSelectValue && angular.isArray(this.matches)) {
                queryproperties[this.searchParameter] = parameters.disclaimers[0].value;
                queryproperties.method = 'search';
                queryproperties.searchfields = this.matches.join(',');
                queryproperties.fields = queryproperties.searchfields;

            } else if (parameters.isSelectValue && angular.isArray(this.matches)) {

                queryproperties = dtsUtils.mountQueryWhere({
                    matches: this.matches,
                    columnDefs: this.columnDefs,
                    parameters: parameters
                });

            } else {
                queryproperties = dtsUtils.mountQueryProperties({
                    parameters: parameters,
                    columnDefs: this.columnDefs,
                    propertyFields: this.propertyFields
                });
            }

            /* Quantidade máxima de registros para pesquisa */
            if (parameters.isSelectValue) {
                /* Select - Default: 10 */
                if (this.limitSelect) { queryproperties.limit = this.limitSelect; }
            } else {
                /* Zoom - Default: 50*/
                if (this.limitZoom) { queryproperties.limit = this.limitZoom; }
            }
            
            if (parameters.more) {
                queryproperties.start = this.zoomResultList.length;
            } else {
                thisZoom.zoomResultList = [];
            }
            
            return this.resource.TOTVSQuery(queryproperties, function (result) {

                thisZoom.zoomResultList = thisZoom.zoomResultList.concat(result);
                $timeout(function () {
                    if (result[0] && result[0].hasOwnProperty('$length')) {
                        thisZoom.resultTotal = result[0].$length;
                    } else {
                        thisZoom.resultTotal = 0;
                    }
                }, 0);
            }, {
                noErrorMessage: thisZoom.noErrorMessage
            }, useCache);
        };
        
        service.referenceList = [];
        service.getReference = function (value) {
            
            var _service = this;
            var parameters = {};
            var queryproperties = {};
            
            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];
            
            if (value.search) {
                parameters.disclaimers.push({
                    property: "cod-refer",
                    type: "string",
                    value: value.search
                });
            }
            
            if (value.init !== undefined && value.init.property === 'it-codigo') {
                parameters.disclaimers.push(value.init);
            }
                 
            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });
            
            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.referenceList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);
            
        };
        
		return service;
		
	}
	index.register.service('men.referenciaitem.zoom', serviceReferenciaItem);
	
});