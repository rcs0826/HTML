define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {
		
	/*####################################################################################################
    # Database: mgind
    # Table...: ped-venda
    # Service.: servicePedidoVendaZoom
    # Register: mpd.ped-venda.zoom
    ####################################################################################################*/

	servicePedidoVendaZoom.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function servicePedidoVendaZoom($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {
		
		var scopeService = this;
		
		var service = {};
		angular.extend(service, zoomService);
		
		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi159/:method/:nomeAbrev/:numPedido', {}, {});
		service.zoomName = $rootScope.i18n("l-salesorder", undefined, 'dts/mpd');
		service.configuration = false;
		
        service.propertyFields = [
          	{label: $rootScope.i18n('nr-pedcli', undefined, 'dts/mpd'), property: 'nr-pedcli', type:'stringrange', default: true},
            {label: $rootScope.i18n('l-short-name', undefined, 'dts/mpd'), property: 'nome-abrev', type:'stringrange'},
            {label: $rootScope.i18n('l-nr-pedido', undefined, 'dts/mpd'), property: 'nr-pedido', type:'integerrange'},
            {label: $rootScope.i18n('l-natureza', undefined, 'dts/mpd'), property: 'nat-operacao', type:'stringrange'},
            {label: $rootScope.i18n('l-dt-emissao', undefined, 'dts/mpd'), property: 'dt-implant', type:'daterange'},
            {label: $rootScope.i18n('l-dt-entrega', undefined, 'dts/mpd'), property: 'dt-entrega', type:'daterange'},
            {label: $rootScope.i18n('l-cod-estabel', undefined, 'dts/mpd'), property: 'cod-estabel', type:'stringrange'},
            {label: $rootScope.i18n('l-cod-sit-ped', undefined, 'dts/mpd'), property: 'cod-sit-ped', type:'integerrange'},
            {label: $rootScope.i18n('l-cod-sit-aval', undefined, 'dts/mpd'), property: 'cod-sit-aval', type:'integerrange'}];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-nr-pedido', undefined, 'dts/mpd'), field: 'nr-pedido'},
            {headerName: $rootScope.i18n('nr-pedcli', undefined, 'dts/mpd'), field: 'nr-pedcli'},
            {headerName: $rootScope.i18n('l-nome-abrev', undefined, 'dts/mpd'), field: 'nome-abrev'},
            {headerName: $rootScope.i18n('l-natureza', undefined, 'dts/mpd'), field: 'nat-operacao'},
            {headerName: $rootScope.i18n('l-dt-emissao', undefined, 'dts/mpd'), field: 'dt-implant', valueGetter: function(params) {
                return new Date(params.data['dt-implant']).toLocaleDateString();
            }},
            {headerName: $rootScope.i18n('l-dt-entrega', undefined, 'dts/mpd'), field: 'dt-entrega', valueGetter: function(params) {
                return new Date(params.data['dt-entrega']).toLocaleDateString();
            }},
            {headerName: $rootScope.i18n('l-cod-estabel', undefined, 'dts/mpd'), field: 'cod-estabel'},
            {headerName: $rootScope.i18n('l-cod-sit-ped', undefined, 'dts/mpd'), field: 'cod-sit-ped', 
			valueGetter:function(params){
				switch(params.data['cod-sit-ped']){
					case 1: return $rootScope.i18n('l-open2', undefined, 'dts/mpd');break;
					case 2: return $rootScope.i18n('l-partially-processed', undefined, 'dts/mpd'); break;
					case 3:	return $rootScope.i18n('l-total-processed', undefined, 'dts/mpd'); break;
					case 4:	return $rootScope.i18n('l-pending', undefined, 'dts/mpd'); break;
					case 5: return $rootScope.i18n('l-suspended2', undefined, 'dts/mpd'); break;
					case 6: return $rootScope.i18n('l-canceled2', undefined, 'dts/mpd'); break;
					case 7:	return $rootScope.i18n('l-immed-invoicing', undefined, 'dts/mpd');	break;
				}
			}},
            {headerName: $rootScope.i18n('l-cod-sit-aval', undefined, 'dts/mpd'), field: 'cod-sit-aval',valueGetter:function(params){
				switch(params.data['cod-sit-aval']){
					case 1: return $rootScope.i18n('l-not-evaluated', undefined, 'dts/mpd');break;
					case 2: return $rootScope.i18n('l-evaluated', undefined, 'dts/mpd'); break;
					case 3:	return $rootScope.i18n('l-approved-gen', undefined, 'dts/mpd'); break;
					case 4:	return $rootScope.i18n('l-not-approved-gen', undefined, 'dts/mpd'); break;
					case 5: return $rootScope.i18n('l-information-pending', undefined, 'dts/mpd'); break;
				}
			} }];
			
        service.getObjectFromValue =  function (value, init) {
			if(value){
				return this.resource.TOTVSGet({
					numPedido: value,
					nomeAbrev: ((init && init.property && init.property === 'nome-abrev')?init.value.start:undefined),
					method: init ? init.method : undefined
				}, undefined, {
					noErrorMessage: true
				}, true);
			}else{
				return undefined;
			}
        };
        
        service.comparator = function(pedcli1, pedcli2) {
            return (pedcli1['nome-abrev'] === pedcli2['nome-abrev'] && 
			        pedcli1['nr-pedcli'] === pedcli2['nr-pedcli']);
        };
        
        service.applyFilter = function (parameters) {
            var useCache = true;
            var hasUserFilter = false;
            
            if (parameters.init !== undefined && parameters.init.property === 'nome-abrev') {
                angular.forEach(parameters.disclaimers, function(result) {
                    if (result.property === parameters.init.property) {
                        hasUserFilter = true;
                    }
                });
                
                if (hasUserFilter == false) {
                    if (parameters.init.value.start != "" && parameters.init.value.end != "") {

                        parameters.disclaimers.push({label: 'l-short-name',
                                                     property: parameters.init.property,
                                                     type: 'stringrange',
                                                     value: parameters.init.value});
                    }
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
        
        service.requestList = [];
        service.getRequest = function (value) {
            
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];
            
            
            if (value['pedido'] != undefined) {
                parameters.disclaimers.push({
                    property: "nr-pedcli",
                    type: "string",
                    value: value['pedido']
                });
            }
            
            if (value['nomeAbrev'] != undefined) {
                parameters.disclaimers.push({
                    property: "nome-abrev",
                    type: "string",
                    value: value['nomeAbrev']
                });
            }
                 
            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });
            
            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.requestList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);
            
        };
        
		return service;
		
	}
	index.register.service('mpd.ped-venda.zoom', servicePedidoVendaZoom);
	
});
