define(['index',
'/dts/dts-utils/js/zoom/zoom.js',
'/dts/mce/js/mce-utils.js'], function(index) {

/*####################################################################################################
# Table...: mmv-setor-ofici
# Service.: serviceZoomMmvOrdManut
# Register: mab.mmvOrdManut.zoom
####################################################################################################*/
	serviceZoomMmvOrdManut.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'mmi.utils.Service', 'mce.utils.Service', 'helperMmvOrdManut'];
	
	function serviceZoomMmvOrdManut($timeout, $totvsresource, $rootScope, $filter, zoomService, mmiUtils, mceUtils, helperMmvOrdManut) {
	
		var service = {};
		
		angular.extend(service, zoomService);
		
		service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/frbo/bofr072//:id');
		service.zoomName       = $rootScope.i18n('l-maintenance-orders');
		service.configuration  = true;
		service.advancedSearch = false;
		service.matches        = ['String(nr-ord-produ)'];	
		
		service.TOTVSPostArray = function (parameters, model, callback, headers) {
		    service.resource.parseHeaders(headers);
		    var call = service.resource.postArray(parameters, model);
		    return service.resource.processPromise(call, callback);
		};
		
		service.propertyFields = [
			{label: $rootScope.i18n('l-ord'), property: 'nr-ord-produ', type: 'integer', maxlength: '9', default: true},
			{label: $rootScope.i18n('l-workshop'), property: 'cod-ofici', type: 'string', maxlength: '8'},
			{label: $rootScope.i18n('l-equipment'), property: 'cod-eqpto', type: 'string', maxlength: '16'}
		];
		
		service.columnDefs = [
			{
	        	headerName: $rootScope.i18n('l-ord'), 
	        	field: 'nr-ord-produ', 
	        	type: "numericColumn", 
	        	valueGetter: function (params) {
	                return $filter("orderNumberMask")(params.data['nr-ord-produ'])
	            }
	        },
	        
	        {headerName: $rootScope.i18n('l-workshop'), field: 'cod-ofici'},
	        
	        {
	        	headerName: $rootScope.i18n('l-document-in'), 
	        	field: 'dat-entr', 
	        	valueGetter: function (params) {
	                return mceUtils.formatDate(params.data['dat-entr'])
	            }
	        },
	        {
	        	headerName: $rootScope.i18n('l-time'), 
	        	field: 'hra-entr',
	        	valueGetter: function (params) {
	                return mceUtils.formatTime(params.data['hra-entr'])
	            }
	        },
	        {
	        	headerName: $rootScope.i18n('l-state'), 
	        	field: 'estado', 
	        	valueGetter: function (params) {
	                return mmiUtils.buscaNomeEstadoOrdem(params.data['estado'])
	            }
	        },
	        
	        {headerName: $rootScope.i18n('l-company'), field: 'ep-codigo'},
	        {headerName: $rootScope.i18n('l-equipment'), field: 'cod-eqpto'}
		];
		
		service.comparator = function(item1, item2) {
		    return (item1['nr-ord-produ'] === item2['nr-ord-produ']);
		};
		
		service.getObjectFromValue =  function (value) {        	
	        return this.resource.TOTVSGet({
	            id: value
	        }, undefined, {
	            noErrorMessage: true
	        }, true);
		};
		
		service.beforeQuery = function (queryproperties, parameters) {
	    	if (helperMmvOrdManut.data) {
				var cdEquipto = helperMmvOrdManut.data.cdEquipto;
		    	
		    	if (helperMmvOrdManut.data.ttSprintSelecionada) {
			    	var datEntr = mmiUtils.converteDataHoraInvertida(helperMmvOrdManut.data.ttSprintSelecionada.dataInicial, "0000");    
			    	var datTerm = mmiUtils.converteDataHoraInvertida(helperMmvOrdManut.data.ttSprintSelecionada.dataFinal, "2359");
		    	}
	    	}
                 
            if (queryproperties.where) {
	            queryproperties.where = queryproperties.where.concat(" AND estado < 7");
            	if (cdEquipto) {
            		queryproperties.where = queryproperties.where.concat(' AND cod-eqpto="' + cdEquipto + '"');
            	}
            	if (datEntr) {
            		queryproperties.where = queryproperties.where.concat(' AND val-dat-invrtda-entr >= ' + datEntr);
            	}
            	if (datTerm) {
            		queryproperties.where = queryproperties.where.concat(' AND val-dat-invrtda-entr <= ' + datTerm);
            	}
            } else {
	        	queryproperties.where = "estado < 7";
	        	
	        	if (cdEquipto) {
            		queryproperties.where = queryproperties.where.concat(' AND cod-eqpto="' + cdEquipto + '"');
            	}
            	if (datEntr) {
            		queryproperties.where = queryproperties.where.concat(' AND val-dat-invrtda-entr >= ' + datEntr);
            	}
            	if (datTerm) {
            		queryproperties.where = queryproperties.where.concat(' AND val-dat-invrtda-entr <= ' + datTerm);
            	}	        	
	        }
		}
		
		return service;
	}
	
	index.register.service('mab.mmvOrdManut.zoom', serviceZoomMmvOrdManut);
});