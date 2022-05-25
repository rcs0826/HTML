define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function(index) { 

    /*####################################################################################################
     # Database: mgmnt
     # Table...: equipe
     # Service.: serviceZoomMaintenancePlan
     # Register: mmi.plano.zoom
     ####################################################################################################*/
  serviceZoomMaintenancePlan.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter', 'helperPlanoOrigZoom', 'dts-utils.utils.Service'];
    function serviceZoomMaintenancePlan($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter, helperPlanoOrigZoom, dtsUtils){

      var serviceZoom = this;
    	
      var service = {};

      angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)

      service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchmip/fchmiporder/:method/:id/:cdEqpto/:cdTag/:fmEqpto', {}, {

        postArray: { 
          method: 'POST',
          isArray: true
        }

      });

      service.zoomName       = i18nFilter('l-maintenance-plan', [], 'dts/mmi');
      service.configuration  = true;
      service.advancedSearch = false;        
      service.useSearchMethod = true;
      service.matches        = ['cdManut', 'descricao'];

      var records = 0;
      var controlePagina = true;
      
      service.TOTVSPostArray = function (parameters, model, callback, headers) {
          service.resource.parseHeaders(headers);
          var call = service.resource.postArray(parameters, model);
          return service.resource.processPromise(call, callback);
      }; 
      
      service.propertyFields = [
          {label: i18nFilter('l-maintenance', [], 'dts/mmi'), property: 'cdManut', type: 'string', default: true},
          {label: i18nFilter('l-planner', [], 'dts/mmi'), property: 'cdPlanejador', type: 'string'},
          {label: i18nFilter('l-team', [], 'dts/mmi'), property: 'equipRes', type: 'string'}
      ];

      service.columnDefs = [
          {headerName: i18nFilter('l-origin-plan', [], 'dts/mmi'), field: 'descPlano', width: 180, minWidth: 180, maxWidth: 180},
          {headerName: i18nFilter('l-maintenance', [], 'dts/mmi'), field: 'cdManut', width: 100, minWidth: 100, maxWidth: 120},
          {headerName: i18nFilter('l-description', [], 'dts/mmi'), field: 'descManut', width: 330, minWidth: 330, maxWidth: 330},
          {headerName: i18nFilter('l-equipment', [], 'dts/mmi'), field: 'cdEquipto', width: 150, minWidth: 150, maxWidth: 150},
          {headerName: i18nFilter('l-tag', [], 'dts/mmi'), field: 'cdTag', width: 120, minWidth: 80, maxWidth: 120},
          {headerName: i18nFilter('l-family', [], 'dts/mmi'), field: 'familiaEqpto', width: 120, minWidth: 80, maxWidth: 120},          
          {headerName: i18nFilter('l-type', [], 'dts/mmi'), field: 'cdTipo', width: 80, minWidth: 80, maxWidth: 80},
          {headerName: i18nFilter('l-statistic', [], 'dts/mmi'), field: 'tipo', width: 100, minWidth: 100, maxWidth: 100},
          {headerName: i18nFilter('l-class', [], 'dts/mmi'), field: 'tpManut', width: 100, minWidth: 100, maxWidth: 100},
          {headerName: i18nFilter('l-planner', [], 'dts/mmi'), field: 'cdPlanejador', width: 100, minWidth: 100, maxWidth: 100},
          {headerName: i18nFilter('l-team', [], 'dts/mmi'), field: 'equipRes', width: 150, minWidth: 150, maxWidth: 150},
          {headerName: i18nFilter('l-inspection', [], 'dts/mmi'), field: 'cdInspecao', width: 150, minWidth: 150, maxWidth: 150}
      ];
        
      /* 
       * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
       */
      service.comparator = function(item1, item2) {

          return (item1.id === item2.id);
      };
      
      isObjectEmpty = function(obj) {
    	  for (var x in obj) { return false; }
    	  	return true;
      };
     
      service.resource.getMaintenancePlan = function(parameters, callback, headers, cache){    	 
    	  
        if (parameters.id == undefined || parameters.id == "")
          return false;
        
        if (isObjectEmpty(helperPlanoOrigZoom.data)){
			helperPlanoOrigZoom.data.cdEqpto = " ";
			helperPlanoOrigZoom.data.cdTag = " ";
			helperPlanoOrigZoom.data.fmEqpto = " ";
						
		}

        if(helperPlanoOrigZoom.data.cdEqpto == undefined){
          helperPlanoOrigZoom.data.cdEqpto = " ";
        }

        if(helperPlanoOrigZoom.data.cdTag == undefined){
          helperPlanoOrigZoom.data.cdTag = " ";
        }

        return service.resource.TOTVSGet({
            method:"getMaintenancePlan",
            id:parameters.id,
            cdEqpto: encodeURIComponent(helperPlanoOrigZoom.data.cdEqpto),
            cdTag : encodeURIComponent(helperPlanoOrigZoom.data.cdTag),
            fmEqpto : encodeURIComponent(helperPlanoOrigZoom.data.fmEqpto
          )}, function(result){

        	helperPlanoOrigZoom.data.descManut   = result.descManut;
        	helperPlanoOrigZoom.data.cdTipo      = result.cdTipo;
        	helperPlanoOrigZoom.data.equipeResp  = result.equipeResp;
        	helperPlanoOrigZoom.data.cdPlanejado = result.cdPlanejado;
        	helperPlanoOrigZoom.data.planoOrig   = result.planoOrig;

        });

      }

      var headers = { noErrorMessage: true, noCount : true };
      
      service.resource.TOTVSQuery = function(parameters, callback, headers, cache){

        if(parameters.start == undefined){
          records = 0;
        }

    	  var ttProperties = [];    	  
    	  
    	  if (parameters.searchfields){
    		  var fields = parameters.searchfields.split(',');

    		  parameters.property = [];
    		  
	    	  angular.forEach(fields, function(property){
	    		  parameters.property.push(property);
	    	  });
	    	  if (parameters.id == undefined)
	    		  parameters.id = " ";
	    	  
	    	  parameters.value = ["*" + parameters.id + "*"];
	    	  
    	  }
    	  
    	  angular.forEach(parameters.property, function(property){
    		  ttProperties.push({properties: property});
    	  });
    	  
    	  parameters = {limit : parameters.limit == 10 ? parameters.limit : records,
                      planoOrig : parameters.value != undefined ? parameters.value[0] : " ",
          			  		cdEqpto : helperPlanoOrigZoom.data.cdEqpto,
        			  			cdTag : helperPlanoOrigZoom.data.cdTag,
        			  			fmEqpto : helperPlanoOrigZoom.data.fmEqpto,
        			  			ttProperties : ttProperties};

        if(controlePagina == true){
          controlePagina = false;
        }else{
          if(records > 50){
            records = records + 50;
          }else{
            records = records + 51;
          }
        }

    	  helperPlanoOrigZoom.data.isModal = true;

    	  if (serviceZoom.cacheZoom && (parameters.planoOrig == "**" || parameters.planoOrig == "* *")) {
    		  return serviceZoom.cacheZoom;    		
    	  } else {  
    		  if (serviceZoom.cacheZoom) {
    			  return service.TOTVSPostArray({method:"getListMaintenancePlan"}, parameters, callback);
    		  } else {
	    		  var aux;
	    		  aux = service.TOTVSPostArray({method:"getListMaintenancePlan"}, parameters,
	    				  function(result){
	    			  serviceZoom.cacheZoom = aux;	    			  
	    		  });	    		  
	    		  return aux;	    		  
    		  }
    	  }
      };

      service.getObjectFromValue =  function (value) {
    	  
    	  return this.resource.getMaintenancePlan({id: value},undefined,{noErrorMessage: true}, true);    	  
    	  
      };  
            
      service.applyFilter = function (parameters) {

    	  if (parameters.init == undefined)
    		  parameters.isSelectValue = true;
    	  else {
              parameters.isSelectValue = false;
              if (parameters.init.equipto) {
                  helperPlanoOrigZoom.data.cdEqpto = parameters.init.equipto['cd-equipto'];
                  helperPlanoOrigZoom.data.cdTag = parameters.init.equipto['cd-tag'];
                  helperPlanoOrigZoom.data.fmEquipto = parameters.init.equipto['fm-equipto'];
              }
          }
    	  
    	  var useCache = true;
  			
  			if(this.useCache !== undefined)
  			{
  				useCache = this.useCache;
  			}
          
        this.isSelectValue = parameters.isSelectValue;
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
          
        if (this.beforeQuery)
            this.beforeQuery(queryproperties, parameters);


        return service.resource.TOTVSQuery(queryproperties, function (result) {

          thisZoom.zoomResultList = thisZoom.zoomResultList.concat(result);

          if (thisZoom.afterQuery)
              thisZoom.afterQuery(thisZoom.zoomResultList, parameters);
            
          $timeout(function () {
            if (result[0] && result[0].hasOwnProperty('$length')) {
              if (!parameters.isSelectValue)
                thisZoom.resultTotal = result[0].$length;
              else 
                thisZoom.resultTotal = 0;
              } else {
                thisZoom.resultTotal = 0;
                }
                }, 0);
  	      }, {
  	          noErrorMessage: thisZoom.noErrorMessage,
  	          noCount: parameters.isSelectValue
  	      }, useCache);
        };
        
        return service;
      }

    index.register.service('mmi.plano.zoom', serviceZoomMaintenancePlan);
});