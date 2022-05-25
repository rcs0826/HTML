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
        
        service.zoomName = $rootScope.i18n('l-estabel', undefined, 'dts/mpd');

        // Método customizado para requisições GET
        service.resource.TOTVSDTSGet = function (parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.DTSGet(parameters, model);            
            return this.processPromise(call, callback);
        };
     
        service.setConfiguration('mpd.estabelec.zoom');
        // Especifico para utilizacao do selec conector
        service.matches = ['cod-estabel', 'nome', 'cidade', 'estado'];                
        service.propertyFields = [{
                label: $rootScope.i18n('l-code', undefined, 'dts/mpd'),
                property: 'cod-estabel',
                type: 'stringextend',
                default: true,
                maxlength:5
            },
            {
                label: $rootScope.i18n('l-nome', undefined, 'dts/mpd'),
                property: 'nome',
                type: 'stringextend',
                maxlength:40
            },
            {
                label: $rootScope.i18n('l-cidade', undefined, 'dts/mpd'),
                property: 'cidade',
                type: 'stringextend',
                maxlength:25
            },
            {
                label: $rootScope.i18n('l-estado', undefined, 'dts/mpd'),
                property: 'estado',
                type: 'stringextend',
                maxlength:4
            }];

        service.columnDefs = [
            {
                headerName: $rootScope.i18n('l-code', undefined, 'dts/mpd'),
                field: 'cod-estabel',
                width: 100,
                minWidth: 80
                
            },
            {
                headerName: $rootScope.i18n('l-nome', undefined, 'dts/mpd'),
                field: 'nome',
                width: 350,
                minWidth: 150
            },
            {
                headerName: $rootScope.i18n('l-cidade', undefined, 'dts/mpd'),
                field: 'cidade',
                width: 250,
                minWidth: 100
            },
            {
                headerName: $rootScope.i18n('l-estado', undefined, 'dts/mpd'),
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
    index.register.service('mpd.estabelec.zoom', serviceZoomEstabelecimento);
    index.register.service('mpd.estabelec.select', serviceZoomEstabelecimento);
	
    serviceZoomEstabelecimentoSE.$inject = ['mpd.estabelec.zoom', '$timeout', '$totvsresource', '$q'];
    function serviceZoomEstabelecimentoSE(serviceZoomEstabelecimento, $timeout, $totvsresource, $q) {

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

        service.applyFilter = function (parameters) {
            var that = this;
            var strQuery = "";
            var queryproperties = {};
            
            queryproperties.property = [];
            queryproperties.value = [];
            queryproperties.limit = that.limitZoom;
            
            if (parameters.isSelectValue) {
                queryproperties.where = [];

                strQuery += "(estabelec.cod-estabel MATCHES ('" + parameters.selectedFilterValue + 
                            "*') OR estabelec.nome MATCHES ('*" + parameters.selectedFilterValue + "*'))";

                delete queryproperties.method;
				delete queryproperties.searchfields;
				delete queryproperties.siteId;

                queryproperties.where.push(strQuery);
            } else {
                angular.forEach(parameters.disclaimers, function (disclaimer, key) { 
                    if (disclaimer.value) {
                        queryproperties.property.push(disclaimer.property);

                        // Aqui será inserido a regra de 'igual', 'contém', 'inicia'. 
                        if (disclaimer.extend === 1) {
                            queryproperties.value.push(disclaimer.value);
                        }
                        if (disclaimer.extend === 2) {
                            queryproperties.value.push('*' + disclaimer.value + '*');
                        } 
                        if (disclaimer.extend === 3) {
                            queryproperties.value.push(disclaimer.value + '*');
                        }
                    }
                });
			}
            
            if (parameters.more)
                queryproperties.start = this.zoomResultList.length;
            else
                that.zoomResultList = [];

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                if ((!parameters.init || parameters.init.setDefaultValue) && (!parameters.selectedFilterValue)) return;
                
                if (result) {
                    that.zoomResultList = that.zoomResultList.concat(result);
                    $timeout(function () {
                        if (result.length > 0) {
                            that.resultTotal = result[0].$length;
                        } else {
                            that.resultTotal = 0;
                        }
                    }, 0);
                }
            }, { noErrorMessage: true }, false);
        }

        // # Purpose: Executado ao digitar um valor no campo do zoom para 
        // #          consultar e retornar o registro correspondente
        // # Parameters: 
        // #     value: Valor digitado no campo do zoom
        // #     init: Parâmetros passados para o zoom
        // # Notes:
		service.getObjectFromValue = function (value, init) {
            var itemSelected,
            queryproperties = {where: ["estabelec.cod-estabel = " + "'" + value + "'"]},
            getItem = function (item){
                if (item['cod-estabel'] == value) return item;
            };
                        
            if (value) {

                if (service.zoomResultList && service.zoomResultList.length > 0) {
                    itemSelected = service.zoomResultList.filter(getItem);
                }

                if (itemSelected && itemSelected.length > 0) {
                    return $q(function (resolve, reject) {
                        resolve(itemSelected[0]);
                    });
                } else {
                    return $q(function (resolve, reject) {
                        service.resource.TOTVSQuery(queryproperties, function (result) {
                            resolve(result[0]);
                        }, { noErrorMessage: true }, true);
                    });
                }

            }	
        };
        
        return service;
    }
    index.register.service('mpd.estabelecSE.zoom', serviceZoomEstabelecimentoSE);
    index.register.service('mpd.estabelecSE.select', serviceZoomEstabelecimentoSE);
	
});