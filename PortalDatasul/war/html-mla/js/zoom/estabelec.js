define(['index', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function (index) {

    serviceZoomEstabelecimento.$inject = ['$rootScope', '$timeout', '$totvsresource', 'dts-utils.utils.Service', 'dts-utils.zoom'];
    function serviceZoomEstabelecimento($rootScope, $timeout, $totvsresource, dtsUtils, zoomService) {

        var service = {};

        angular.extend(service, zoomService); // Extende o serviço de zoom padrão
        
		service.useSearchMethod = true;
		service.searchParameter = 'siteId';
		service.useCache = true;
		
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad107na/:method/:siteId', {}, {
            DTSGet: {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/dbo/adbo/boad107na/:siteId',
                params: {}
            }          
        });
        
        service.zoomName = $rootScope.i18n('l-site', undefined, 'dts/mla');

        // Método customizado para requisições GET
        service.resource.TOTVSDTSGet = function (parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.DTSGet(parameters, model);            
            return this.processPromise(call, callback);
        };
     
        service.setConfiguration('mla.estabelec.zoom');
        // Especifico para utilizacao do selec conector
        service.matches = ['cod-estabel', 'nome', 'cidade', 'estado'];                
        service.propertyFields = [{
                label: $rootScope.i18n('l-code', undefined, 'dts/mla'),
                property: 'cod-estabel',
                type: 'stringextend',
                default: true,
                maxlength:5
            },
            {
                label: $rootScope.i18n('l-name', undefined, 'dts/mla'),
                property: 'nome',
                type: 'stringextend',
                maxlength:40
            },
            {
                label: $rootScope.i18n('l-city', undefined, 'dts/mla'),
                property: 'cidade',
                type: 'stringextend',
                maxlength:25
            },
            {
                label: $rootScope.i18n('l-city-state', undefined, 'dts/mla'),
                property: 'estado',
                type: 'stringextend',
                maxlength:4
            }];

        service.columnDefs = [
            {
                headerName: $rootScope.i18n('l-code', undefined, 'dts/mla'),
                field: 'cod-estabel',
                width: 100,
                minWidth: 80
                
            },
            {
                headerName: $rootScope.i18n('l-name', undefined, 'dts/mla'),
                field: 'nome',
                width: 350,
                minWidth: 150
            },
            {
                headerName: $rootScope.i18n('l-city', undefined, 'dts/mla'),
                field: 'cidade',
                width: 250,
                minWidth: 100
            },
            {
                headerName: $rootScope.i18n('l-city-state', undefined, 'dts/mla'),
                field: 'estado',
                width: 150,
                minWidth: 50
                
            },
			{
                headerName: $rootScope.i18n('l-company', undefined, 'dts/utb'), 
                field: 'ep-codigo',
                width: 100,
                minWidth: 80
                
            }];

        service.getObjectFromValue = function (value) {
           
            if (!value) return undefined;
            
            return this.resource.TOTVSGet({
                siteId: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };
        service.comparator = function (item1, item2) {
            return (item1['cod-estabel'] === item2['cod-estabel']);
        };
        
        /* Select - siteList: Array de objetos da diretiva select
                     getSite: Função padrao para retorno dos objetos no Select com base do valor
                              informado em tela */
        service.siteList = [];
        service.getSite = function (value, init) {
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            // Busca o item pelo código ou pela descrição
            queryproperties.where  = "cod-estabel MATCHES '"+value+"*' OR nome MATCHES '"+value+"*'"; 
            queryproperties.limit  = 20;
            queryproperties.fields = "cod-estabel,nome";

            this.resource.TOTVSDTSGet(queryproperties, undefined, function (result) {                    
                service.siteList = result;
            }, {noErrorMessage: true}, true);
        };

        return service;
    }
    index.register.service('mla.estabelec.zoom', serviceZoomEstabelecimento);
    index.register.service('mla.estabelec.select', serviceZoomEstabelecimento);
	
    serviceZoomEstabelecimentoSE.$inject = ['mla.estabelec.zoom','$totvsresource'];
    function serviceZoomEstabelecimentoSE(serviceZoomEstabelecimento, $totvsresource) {

        var service = {};

        angular.extend(service, serviceZoomEstabelecimento); // Extende o serviço de zoom padrão
        
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad107se/:method/:siteId/:companyId', {}, {
            DTSGet: {
                method: 'GET',
                isArray: true,
                url: '/dts/datasul-rest/resources/dbo/adbo/boad107se/:siteId',
                params: {}
            }            
        });
		

        // # Purpose: Executado antes de retornar os registros do zoom
        // # Parameters: 
        // #     queryproperties: Propriedades utilizadas para o filtro dos registros
        // #     parameters: Parâmetros do zoom
        // # Notes: Método criado para que considere o filtro passado para o zoom-init 
        // #        ao aplicar a consulta do zoom
		service.beforeQuery = function (queryproperties, parameters) {
            queryproperties.where = queryproperties.where || [];

			if(parameters.init) {
				queryproperties.property = queryproperties.property || [];
				queryproperties.value = queryproperties.value || [];

				if(parameters.init.filter) {
					for (var property in parameters.init.filter) {
						// Verifica se o usuário informou algum valor para a propriedade, se não, utiliza o valor padrão (init)
						if(queryproperties.property.indexOf(property) < 0) {

						    if (parameters.init.filter[property] !== undefined){ 
			                    queryproperties.property.push(property);                            
			                    queryproperties.value.push(parameters.init.filter[property]);       
			                }							
						}
					}
                }
                
                if (parameters.init['selected-sites']){
                    var whereSitesRestriction = "";
                    var sites = parameters.init['selected-sites'].split(",");
    
                    var i = 0;
                    while (sites[i]) {
                        if(whereSitesRestriction != ""){
                            whereSitesRestriction = whereSitesRestriction + ' or estabelec.cod-estabel = "' + sites[i] + '"';
                        }else{
                            whereSitesRestriction = whereSitesRestriction + 'estabelec.cod-estabel = "' + sites[i] + '"';
                        }
                        i++;
                    }
    
                    whereSitesRestriction = "(" + whereSitesRestriction + ")";
                    queryproperties.where.push(whereSitesRestriction);
                }
			}
		};
		

        // # Purpose: Executado ao digitar um valor no campo do zoom para 
        // #          consultar e retornar o registro correspondente
        // # Parameters: 
        // #     value: Valor digitado no campo do zoom
        // #     init: Parâmetros passados para o zoom
        // # Notes:
		service.getObjectFromValue = function (value, init) {
           
            if (!value) return undefined;
            
            return this.resource.TOTVSGet({
                siteId: value,
				companyId: (init && init.filter && init.filter['ep-codigo']) ? init.filter['ep-codigo'] : undefined,
				method: (init && init.method) ? init.method : undefined
            }, undefined, {
                noErrorMessage: true
            }, true);
        };
        
        return service;
    }
    index.register.service('mla.estabelecSE.zoom', serviceZoomEstabelecimentoSE);
    index.register.service('mla.estabelecSE.select', serviceZoomEstabelecimentoSE);
	
});