define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function(index) {

	/*####################################################################################################
	# Database: 
	# Table...: mmv-tar-ord-manut
	# Service.: serviceZoomMmvTarOrdManut
	# Register: mab.mmvTarOrdManut.zoom
	####################################################################################################*/
	serviceZoomMmvTarOrdManut.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter', 'helperOrder'];
	
	function serviceZoomMmvTarOrdManut($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter, helperOrder){
		
	  	var service = {};
	
	    angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
	
	    service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/frbo/bofr073//:pNrOrdProdu//:pnumSeqTarefa');
	    service.zoomName       = i18nFilter('l-tasks', [], 'dts/mab');
	    service.configuration  = true;
	    service.advancedSearch = false;
	    service.matches = ['String(num-seq)'];
	
	    service.TOTVSPostArray = function (parameters, model, callback, headers) {
	        service.resource.parseHeaders(headers);
	        var call = service.resource.postArray(parameters, model);
	        return service.resource.processPromise(call, callback);
	    };
	
	    service.propertyFields = [
            {label: i18nFilter('l-task', [], 'dts/mab'), property: 'num-seq', type: 'integer', default: true}            
	    ];
            
	    service.columnDefs = [
            {headerName: i18nFilter('l-task', [], 'dts/mab'), field: 'num-seq', width: 80, minWidth: 40},
            {headerName: $rootScope.i18n('l-description'), field: 'desc-tarefa', width: 400, minWidth: 100,
                valueGetter: function (params) {
                    if (params.data && params.data._) {
                        return params.data._['desc-tarefa'];
                    }
                }
            },
            {headerName: $rootScope.i18n('l-state'), field: 'desc-estado', width: 160, minWidth: 100,
                valueGetter: function (params) {
                    if (params.data && params.data._) {
                        return params.data._['desc-estado'];
                    }
                }
            }
	    ];
	
	    /*
	     * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao
	     */
	    service.comparator = function(item1, item2) {
	        return (item1.id === item2.id);
	    };
	
	    service.getObjectFromValue =  function (value) {
	    	var nrOrdProdu;
	    	var nrOrdemFiltro = helperOrder.data.nrOrdemFiltro;
	    	
	    	if (nrOrdemFiltro !== undefined) {
	    		nrOrdProdu = nrOrdemFiltro;
	    	} else {
	    		nrOrdProdu = helperOrder.data['nr-ord-produ'];
	    	}
	    	
	    	if (!isNaN(value)) {
		    	return this.resource.TOTVSGet({
					pNrOrdProdu: nrOrdProdu,
					pnumSeqTarefa: value
                }, undefined, {
		            noErrorMessage: true
		        }, true);
	    	}
	    };
	    
	    service.beforeQuery = function (queryproperties, parameters) {
	    	var nrOrdProdu;
	    	var nrOrdemFiltro = helperOrder.data.nrOrdemFiltro;
	    	
	    	if (nrOrdemFiltro !== undefined) {
	    		nrOrdProdu = nrOrdemFiltro;
	    	} else {
	    		nrOrdProdu = helperOrder.data['nr-ord-produ'];
	    	}	    	
	
	    	if (queryproperties.where)
	            queryproperties.where = queryproperties.where.concat(' AND nr-ord-produ = "' + nrOrdProdu + '"');
	        else {
	        	if (queryproperties.property) {
	        		queryproperties.where = "String(" + queryproperties.property[0] + ') matches "'+queryproperties.value[0]+'" AND nr-ord-produ = "' + nrOrdProdu + '"';
	        	} else {
	        		queryproperties.where = "nr-ord-produ = " + nrOrdProdu;
	        	}
	        }                 	            
        }
        	    	
		return service;
  }

  index.register.service('mab.mmv-tar-ord-manut.zoom', serviceZoomMmvTarOrdManut);
});
