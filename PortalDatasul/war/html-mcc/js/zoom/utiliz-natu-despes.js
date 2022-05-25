define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dbo/dbo.js'], function(index) {

    /*####################################################################################################
     # Database: mgind
     # Table...: utiliz-natu-despes
     # Service.: serviceUtilizacaoNatDesp
     # Register: mcc.utiliz-natu-despes.zoom
     ####################################################################################################*/
    serviceUtilizacaoNatDesp.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function serviceUtilizacaoNatDesp($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils){

		var service = {};    
        var queryproperties = {};     
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin640/:method//:id', {}, {});

        service.zoomName       = $rootScope.i18n('l-utilization-codes', [], 'dts/mcc');
        service.setConfiguration('utiliz-natu-despes');
	    service.propertyFields = [
            {label: $rootScope.i18n('l-code', [], 'dts/mcc'), property: 'cod-utiliz', type: 'stringextend', default: true, maxlength: 12},
            {label: $rootScope.i18n('l-description', [], 'dts/mcc'), property: 'des-utiliz', type: 'stringextend', maxlength: 40}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-code', [], 'dts/mcc'), field: 'cod-utiliz', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-description', [], 'dts/mcc'), field: 'des-utiliz', width: 100, minWidth: 100, valueGetter: function (params) {
             	return params.data['_']['des-utiliz'];
            }}
        ];
        service.matches = ['cod-utiliz'];

        service.applyFilter = function (parameters) {
                        
            var useCache = true;
            
            if(this.useCache !== undefined)
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

            if(parameters.init) {                
                queryproperties.value = (parameters.init.value) ? parameters.init.value : [];
                queryproperties.property = (parameters.init.property) ? parameters.init.property : [];
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
        }

        // Buscar descrições (input)
        service.getObjectFromValue = function (value, init) {     
            if(!value) return;       
            return this.resource.TOTVSGet({id: value}, undefined , {noErrorMessage: true}, true);
        };

        return service;
	}
 
    index.register.service('mcc.utiliz-natu-despes.zoom', serviceUtilizacaoNatDesp);
});
