define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function(index) {

	/*####################################################################################################
	# Database: movmnt
	# Table...: ord-taref
	# Service.: serviceZoomOrdTaref
	# Register: mmi.ord-taref.zoom
	####################################################################################################*/
	serviceZoomOrdTaref.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter', 'helperOrder'];
	
	function serviceZoomOrdTaref($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter, helperOrder){
		
	  	var service = {};
	
	    angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
	
	    service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn136//:pNrOrdProdu//:pCdTarefa');
	    service.zoomName       = i18nFilter('l-tasks', [], 'dts/mmi');
	    service.configuration  = true;
	    service.advancedSearch = false;
	    service.matches = ['String(cd-tarefa)','descricao'];
	
	    service.TOTVSPostArray = function (parameters, model, callback, headers) {
	        service.resource.parseHeaders(headers);
	        var call = service.resource.postArray(parameters, model);
	        return service.resource.processPromise(call, callback);
	    };
	
	    service.propertyFields = [
	        {label: i18nFilter('l-task', [], 'dts/mmi'), property: 'cd-tarefa', type: 'integer', default: true},
	        {label: i18nFilter('l-description', [], 'dts/mmi'), property: 'descricao', type: 'string'}
	    ];
	
	    service.columnDefs = [
	        {headerName: i18nFilter('l-task', [], 'dts/mmi'), field: 'cd-tarefa', width: 80, minWidth: 40},
	        {headerName: i18nFilter('l-description', [], 'dts/mmi'), field: 'descricao', width: 460, minWidth: 80},
	        {headerName: i18nFilter('l-total-time', [], 'dts/mmi'), field: 'tempo', width: 120, minWidth: 40},
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
					pCdTarefa: value
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

  index.register.service('mmi.ord-taref.zoom', serviceZoomOrdTaref);
});
