define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function(index) {

    /*####################################################################################################
     # Database: mgmnt
     # Table...: equipto
     # Service.: serviceZoomEquipment
     # Register: mmi.equipto.zoom
     ####################################################################################################*/
    serviceZoomEquipment.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'i18nFilter', 'dts-utils.utils.Service'];
    function serviceZoomEquipment($timeout, $totvsresource, $rootScope, $filter, zoomService, i18nFilter, dtsUtils){

        var serviceZoom = this;
        var service = {};
        
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/mnbo/bomn088html/:method/:id/');
        service.zoomName       = $rootScope.i18n('l-equipments', [], 'dts/mmi');
        service.configuration  = true;
        service.advancedSearch = true;
        service.matches = ['cd-equipto', 'descricao'];
	    
        service.propertyFields = [
            {label: i18nFilter('l-equipment', [], 'dts/mmi'), property: 'cd-equipto', type: 'string', default: true},
            {label: i18nFilter('l-description', [], 'dts/mmi'), property: 'descricao', type: 'string'},
            {label: i18nFilter('l-family', [], 'dts/mmi'), property: 'fm-equipto', type: 'string'},
            {label: i18nFilter('l-tag', [], 'dts/mmi'), property: 'cd-tag', type: 'string'},
            {label: i18nFilter('l-cost-center', [], 'dts/mmi'), property: 'cc-codigo', type: 'string'},
            {label: i18nFilter('l-site', [], 'dts/mmi'), property: 'cod-estabel', type: 'string'},
            {label: i18nFilter('l-planner', [], 'dts/mmi'), property: 'cd-planejado', type: 'string'},
            {label: i18nFilter('l-status', [], 'dts/mmi'), property: 'situacao',type: 'integer',
            propertyList: [{id: 1, name: i18nFilter('l-active', [], 'dts/mmi'), value: 1 },
                           {id: 2, name: i18nFilter('l-suspended2', [], 'dts/mmi'), value: 2 },
                           {id: 3, name: i18nFilter('l-sold', [], 'dts/mmi'), value: 3 },
                           {id: 4, name: i18nFilter('l-idle', [], 'dts/mmi'), value: 4 } ] }
        ];
        
        service.columnDefs = [
            {headerName: i18nFilter('l-equipment', [], 'dts/mmi'), field: 'cd-equipto', width: 130, minWidth: 100, maxWidth: 500},
            {headerName: i18nFilter('l-description', [], 'dts/mmi'), field: 'descricao', width: 335, minWidth: 100, maxWidth: 500},
            {headerName: i18nFilter('l-family', [], 'dts/mmi'), field: 'fm-equipto', width: 120, minWidth: 80, maxWidth: 200},
            {headerName: i18nFilter('l-tag', [], 'dts/mmi'), field: 'cd-tag', width: 120, minWidth: 80, maxWidth: 200},
            {headerName: i18nFilter('l-cost-center', [], 'dts/mmi'), field: 'cc-codigo', width: 150, minWidth: 100, maxWidth: 300},
            {headerName: i18nFilter('l-site', [], 'dts/mmi'), field: 'cod-estabel', width: 130, minWidth: 107, maxWidth: 175},  
            {headerName: i18nFilter('l-busines-unit', [], 'dts/mmi'), field: 'cod-unid-negoc', width: 130, minWidth: 107, maxWidth: 175},
            {headerName: i18nFilter('l-planner', [], 'dts/mmi'), field: 'cd-planejado', width: 90, minWidth: 87, maxWidth: 100},
            {headerName: i18nFilter('l-status', [], 'dts/mmi'), field: 'situacao', width: 80, minWidth: 80, maxWidth: 100, valueGetter: function(params){
            	var cText = "";
        		switch (params.data.situacao){
    				case 1 :
    					cText = i18nFilter('l-active', [], 'dts/mmi');
    					break;
    				case 2 :
    					cText = i18nFilter('l-suspended2', [], 'dts/mmi');
    					break;
    				case 3 :
    					cText = i18nFilter('l-sold', [], 'dts/mmi');
    					break;
    				case 4 :
    					cText = i18nFilter('l-idle', [], 'dts/mmi');
    					break;
        		};
        		return cText; 
    		}}
        ];
        
        /* 
         * comparator - Funcao de comparacao utilizada principalmente para zoom de multipla selecao           
         */
        service.comparator = function(item1, item2) {
            return (item1['cd-equipto'] === item2['cd-equipto']);           
        };
        
        service.getObjectFromValue =  function (value) {
    		
    		return this.resource.TOTVSGet({
                id: encodeURIComponent(value)
            }, undefined, {
                noErrorMessage: true
            }, true);      		
        };  

        service.applyFilter = function (parameters) {
            var useCache = true;

            var lAddDisclaimer = true;
            if (parameters.disclaimers) {
                parameters.disclaimers.forEach(function (obj) {
                    if (obj.property == "situacao"){
                        lAddDisclaimer = false;
                    }
                });
            }else{
                parameters.disclaimers=[];
            }
            /*caso o campo situacao nao seja selecionado ira incluir o 
            filtro situacao = 1(Ativo) copmo default, para o filtro avancado
            sera necessario selecionar umas opcao para filtrar   */
            if (lAddDisclaimer && !parameters.isAdvanced){
                parameters.disclaimers[parameters.disclaimers.length] = {property: "situacao", 
                                                                            value: 1,
                                                                            label: i18nFilter('l-status', [], 'dts/mmi'),
                                                                             type: "integer",
                                                                           extend: 1 }; 
            }
            
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

            /* Quantidade m�xima de registros para pesquisa */
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

            return this.resource.TOTVSQuery(queryproperties, function (result) {

                thisZoom.zoomResultList = thisZoom.zoomResultList.concat(result);
                
                if (thisZoom.afterQuery)
                    thisZoom.afterQuery(thisZoom.zoomResultList, parameters);
                
                $timeout(function () {
                    if (result[0] && result[0].hasOwnProperty('$length')) {
                        thisZoom.resultTotal = result[0].$length;
                    } else {
                        thisZoom.resultTotal = 0;
                    }
                }, 0);
            }, {
                noErrorMessage: thisZoom.noErrorMessage,
                noCount : parameters.isSelectValue
            }, useCache);
        }

        return service;
	}
 
    index.register.service('mmi.equipto.zoom', serviceZoomEquipment);
});