define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: movmnt
     # Table...: ord-manut
     # Service.: serviceZoomOrdManut
     # Register: mmi.ord-manut.zoom
     ####################################################################################################*/
	serviceZoomOrdManut.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'mce.utils.Service', 'helperOrder', 'mmi.utils.Service'];
    function serviceZoomOrdManut($timeout, $totvsresource, $rootScope, $filter, zoomService, mceUtils, helperOrder, mmiUtils){
    	
		var service = {};
        
        angular.extend(service, zoomService);
        
        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn134html/:method/:id/');
	    service.zoomName       = $rootScope.i18n('l-maintenance-orders');
        service.configuration  = true;
        service.advancedSearch = false;
        service.matches        = ['String(nr-ord-produ)', 'des-man-corr'];
        service.useCache	   = false;
        
        service.TOTVSPostArray = function (parameters, model, callback, headers) {
            service.resource.parseHeaders(headers);
            var call = service.resource.postArray(parameters, model);
            return service.resource.processPromise(call, callback);
        };
	    
        service.propertyFields = [
            {label: $rootScope.i18n('l-orderline-number'), property: 'nr-ord-produ', type: 'integer', maxlength: '9', default: true},
            {label: $rootScope.i18n('l-description'), property: 'des-man-corr', type: 'string', maxlength: '50'},
            {label: $rootScope.i18n('l-equipment'), property: 'cd-equipto', type: 'string', maxlength: '16'},
            {label: $rootScope.i18n('l-tag'), property: 'cd-tag', type: 'string', maxlength: '16'},
            {label: $rootScope.i18n('l-planner'), property: 'cd-planejado', type: 'string', maxlength: '12'},
            {label: $rootScope.i18n('l-team'), property: 'cd-equip-res', type: 'string', maxlength: '8'},
            {label: $rootScope.i18n('l-maintenance-date'), property: 'dt-manut', type: 'daterange'}
        ];
        
        service.columnDefs = [
            {
            	headerName: $rootScope.i18n('l-orderline-number'), 
            	field: 'nr-ord-produ', 
            	type: "numericColumn", 
            	width: 120, 
            	minWidth: 120,
            	valueGetter: function (params) {
                    return $filter("orderNumberMask")(params.data['nr-ord-produ'])
                }
            },
            
            {headerName: $rootScope.i18n('l-description'), field: 'des-man-corr', width: 400, minWidth: 400},
            {headerName: $rootScope.i18n('l-equipment'), field: 'cd-equipto', width: 160, minWidth: 160},
            {headerName: $rootScope.i18n('l-tag'), field: 'cd-tag', width: 160, minWidth: 160},
            {headerName: $rootScope.i18n('l-planner'), field: 'cd-planejado', width: 160, minWidth: 160},
            {headerName: $rootScope.i18n('l-team'), field: 'cd-equip-res', width: 160, minWidth: 160},
            
            {
            	headerName: $rootScope.i18n('l-state'), 
            	field: 'estado', 
            	width: 160, 
            	minWidth: 160,
            	valueGetter: function (params) {
                    return mmiUtils.buscaNomeEstadoOrdem(params.data['estado'])
                }
            },
            
            {headerName: $rootScope.i18n('l-site'), field: 'cod-estabel', width: 160, minWidth: 160},            
            
            {
            	headerName: $rootScope.i18n('l-maintenance-date'), 
            	field: 'dt-manut', 
            	width: 160, 
            	minWidth: 160,
            	valueGetter: function (params) {
                    return mceUtils.formatDate(params.data['dt-manut'])
                }
            },            
            
            {
            	headerName: $rootScope.i18n('l-end-date'), 
            	field: 'dt-fecham', 
            	width: 160, 
            	minWidth: 160,
            	valueGetter: function (params) {
                    return mceUtils.formatDate(params.data['dt-fecham'])
                }
            }
        ];
        
        service.comparator = function(item1, item2) {
            return (item1['nr-ord-produ'] === item2['nr-ord-produ']);
        };
        
        service.getObjectFromValue =  function (value) {        	
        	if (!isNaN(value)){        	
	            return this.resource.TOTVSGet({
	                id: value
	            }, undefined, {
	                noErrorMessage: true
	            }, true);
        	}        	
        };
        
        service.beforeQuery = function (queryproperties, parameters) {
	    	var codEstabel = helperOrder.data['cod-estabel'];
                 
            if (!codEstabel){
                return
            }
	    	if (queryproperties.where)
	            queryproperties.where = queryproperties.where.concat(' AND cod-estabel = "' + codEstabel + '"');
	        else {
	        	queryproperties.where = 'cod-estabel = "' + codEstabel + '"';	        	
	        }                  
	            
		}
        
		return service;
	}
    
    index.register.service('mmi.ord-manut.zoom', serviceZoomOrdManut);
});