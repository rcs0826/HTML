define(['index', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js', '/dts/mce/js/mce-utils.js'], function (index) {
    /*####################################################################################################
         # ZOOM DA TABELA: deposito
         # SERVICO.......: serviceZoomDeposito
         # REGISTRO......: mce.deposito.zoom
     ####################################################################################################*/
    serviceZoomAgrupInvent.$inject = ['$rootScope', '$timeout', '$totvsresource','dts-utils.zoom', 'dts-utils.utils.Service', 'mce.utils.Service'];

    function serviceZoomAgrupInvent($rootScope, $timeout, $totvsresource, zoomService, dtsUtils, mceUtils) {

        var service = {};

        angular.extend(service, zoomService); // Extende o serviço de zoom padrão

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin00957/:id/');
        
        service.zoomName = $rootScope.i18n('l-group-separator', undefined, 'dts/mce');
        
       // service.setConfiguration('mce.agrup-invent.zoom');

        // Especifico para utilizacao do selec-conector
        service.matches = ['cdn-agrup', 'descricao'] ;   
        
        service.propertyFields = [

            {
                label: $rootScope.i18n('l-group-separator', undefined, 'dts/mce'),
                property: 'cdn-agrup',
                type: 'integerrange',
                default: true               
            },            
            
            {
                label: $rootScope.i18n('l-description', undefined, 'dts/mce'),
                property: 'descricao',
                type: 'stringextend',
                maxlength:200
            },
            {
                label: $rootScope.i18n('l-date', undefined, 'dts/mce'),
                property: 'dt-criacao',
                type: 'daterange',
                maxlength:200
            },
            {
                label: $rootScope.i18n('l-owner', undefined, 'dts/mce'),
                property: 'cod-respons',
                type: 'stringextend',
                maxlength:200
            }            

        ];

        service.columnDefs = [
            {
                headerName: $rootScope.i18n('l-group-separator'),
                field: 'cdn-agrup',
                width: 100,
                minWidth: 100
            },

            {
                headerName: $rootScope.i18n('l-description'),
                field: 'descricao',
                width: 351,
                minWidth: 351
            },
            
            {
                headerName: $rootScope.i18n('l-date'),
                field: 'dt-criacao',
                width: 351,
                minWidth: 351,
                valueGetter:  function(param){
                    
                    return mceUtils.formatDate(param.data['dt-criacao']);
                    
                }
            },    
            
            {
                headerName: $rootScope.i18n('l-owner'),
                field: 'cod-respons',
                width: 351,
                minWidth: 351
            },             
            
            
	   ];

        service.comparator = function (item1, item2) {
            return (item1['cdn-agrup'] === item2['cdn-agrup']);
        };

        service.getObjectFromValue = function (value) {
            
            if (!value  || value == "") return undefined;
            
            return this.resource.TOTVSGet({
                id: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };        
        
        service.mountQueryWhere  = function (params) {
                
            var query = "";                    
            // replace utilizado para tratar consultas com aspas simples
            var value = params.parameters.selectedFilterValue ? params.parameters.selectedFilterValue.replace(/'/g, "''") : "";

            if (isNaN(parseInt(value))){
                query = " descricao matches '*" + value + "*' ";                
            } else {
                query = " cdn-agrup = " + value + " OR descricao MATCHES '*" + value + "*'"; 
            }

            return {
                where: query,
                fields: dtsUtils.mountFields(params.columnDefs)
            };
                
        }
        
        service.applyFilter  = function (parameters) {
            
            var thisZoom = this,
                queryproperties = {};

            if (parameters.isSelectValue && angular.isArray(this.matches)) {

                queryproperties = this.mountQueryWhere({
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

            if (parameters.isSelectValue) {              
               queryproperties.limit = 10;                 
            } else {                  
                queryproperties.limit = 50;     
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
            }, true);
            
            
        };
        
        /* Select - warehouseList: Array de objetos da diretiva select
                    getWarehouse: Função padrao para retorno dos objetos no Select com base do valor
                                  informado em tela */
        service.agrupInventList = [];
        service.getAgrupInvent = function (value, init) {
            
            var queryproperties = { where: " cdn-agrup = '" + value + "' OR descricao MATCHES '*" + value + "*'",
                                    fields: "cdn-agrup,descricao,dt-criacao"};
            
            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.agrupInventList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);
        };

        return service;

    }

    index.register.service('mce.agrup-invent.zoom', serviceZoomAgrupInvent);
    
   
});