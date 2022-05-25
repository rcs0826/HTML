define(['index', '/dts/mce/js/mce-legend-service.js', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function (index) {
    /*####################################################################################################
         # ZOOM DA TABELA: deposito
         # SERVICO.......: serviceZoomDeposito
         # REGISTRO......: mce.deposito.zoom
     ####################################################################################################*/
    serviceZoomDeposito.$inject = ['$rootScope', '$timeout', '$totvsresource', 'mce.zoom.serviceLegend', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    function serviceZoomDeposito($rootScope, $timeout, $totvsresource, serviceLegend, zoomService, dtsUtils) {

        var service = {};

        angular.extend(service, zoomService); // Extende o serviço de zoom padrão

        service.useSearchMethod = true;
		service.searchParameter = 'id';
		service.useCache = true;
        
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin084/:method//:id', {}, {});
                
        service.zoomName = $rootScope.i18n('l-warehouse', undefined, 'dts/mce');
        
        service.setConfiguration('mce.deposito.zoom');

        // Especifico para utilizacao do selec-conector
        service.matches = ['cod-depos', 'nome'] ;   
        
        service.propertyFields = [

            {
                label: $rootScope.i18n('l-warehouse', undefined, 'dts/mce'),
                property: 'cod-depos',
                type: 'stringextend',
                default: true,
                maxlength:3
            },
            {
                label: $rootScope.i18n('l-description', undefined, 'dts/mce'),
                property: 'nome',
                type: 'stringextend',
                maxlength:40
            },

            {
                label: $rootScope.i18n('l-quality-control-warehouse', undefined, 'dts/mce'),
                property: 'ind-dep-cq',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },
            {
                label: $rootScope.i18n('l-external-source', undefined, 'dts/mce'),
                property: 'log-orig-ext',
                type: 'logical',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },
            {
                label: $rootScope.i18n('l-aloca-qtd-wms', undefined, 'dts/mce'),
                property: 'log-aloca-qtd-wms',
                type: 'logical',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name:$rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },
            {
                label: $rootScope.i18n('l-consider-available-balance', undefined, 'dts/mce'),
                property: 'cons-saldo',
                type: 'logical',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },
            {
                label: $rootScope.i18n('l-warehouse-type', undefined, 'dts/mce'),
                property: 'ind-tipo-dep',
                type: 'integer',
                propertyList: [{
                        id: 1,
                        name: serviceLegend.warehouseType.NAME(1),
                        default: true
                    },
                    {
                        id: 2,
                        name: serviceLegend.warehouseType.NAME(2)
                    }]
            },
            {
                label: $rootScope.i18n('l-consider-alocatted-balance', undefined, 'dts/mce'),
                property: 'alocado',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },
            {
                label: $rootScope.i18n('l-waste-warehouse', undefined, 'dts/mce'),
                property: 'ind-dep-rej',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },
            {
                label: $rootScope.i18n('l-recycled-warehouse', undefined, 'dts/mce'),
                property: 'log-reciclagem',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },
            {
                label: $rootScope.i18n('l-finnished-warehouse', undefined, 'dts/mce'),
                property: 'ind-acabado',
                propertyList: [{
                        id: true,
                        name:$rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },
            {
                label: $rootScope.i18n('l-consider-mrp-order', undefined, 'dts/mce'),
                property: 'log-ordens-mrp',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name:$rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },
            {
                label: $rootScope.i18n('l-wms-warehouse', undefined, 'dts/mce'),
                property: 'log-gera-wms',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            },
            {
                label: $rootScope.i18n('l-process-warehouse', undefined, 'dts/mce'),
                property: 'ind-processo',
                propertyList: [{
                        id: true,
                        name: $rootScope.i18n('l-yes', undefined, 'dts/mce'),
                        value: true
                    },
                    {
                        id: false,
                        name: $rootScope.i18n('l-no', undefined, 'dts/mce'),
                        value: false
                    }]
            }

        ];

        service.columnDefs = [
            {
                headerName: $rootScope.i18n('l-warehouse', undefined, 'dts/mce'),
                field: 'cod-depos',
                width: 100,
                minWidth: 100
            },

            {
                headerName: $rootScope.i18n('l-description', undefined, 'dts/mce'),
                field: 'nome',
                width: 351,
                minWidth: 351
            },

            {
                headerName: $rootScope.i18n('l-quality-control-warehouse', undefined, 'dts/mce'),
                field: 'ind-dep-cq',
                width: 99,
                minWidth: 99,
                valueGetter: 'data["_"]["indDepCQ"]'
            },

            {
                headerName: $rootScope.i18n('l-external-source', undefined, 'dts/mce'),
                field: 'log-orig-ext',
                width: 116,
                minWidth: 116,
                valueGetter: 'data["_"]["logOrigExt"]'
            },

            {
                headerName: $rootScope.i18n('l-aloca-qtd-wms', undefined, 'dts/mce'),
                field: 'log-aloca-qtd-wms',
                width: 124,
                minWidth: 124,
                valueGetter: 'data["_"]["logAlocaQtdWms"]'
            },

            {
                headerName: $rootScope.i18n('l-consider-available-balance', undefined, 'dts/mce'),
                field: 'cons-saldo',
                width: 187,
                minWidth: 187,
                valueGetter: 'data["_"]["consSaldo"]'
            },

            {
                headerName: $rootScope.i18n('l-warehouse-type', undefined, 'dts/mce'),
                field: 'ind-tipo-dep',
                width: 116,
                minWidth: 116,
                valueGetter: 'data["_"]["indTipoDep"]'
            },

            {
                headerName: $rootScope.i18n('l-consider-alocatted-balance', undefined, 'dts/mce'),
                field: 'alocado',
                width: 181,
                minWidth: 181,
                valueGetter: 'data["_"]["alocado"]'
            },

            {
                headerName: $rootScope.i18n('l-waste-warehouse', undefined, 'dts/mce'),
                field: 'ind-dep-rej',
                width: 119,
                minWidth: 119,
                valueGetter: 'data["_"]["indDepRej"]'
            },

            {
                headerName: $rootScope.i18n('l-recycled-warehouse', undefined, 'dts/mce'),
                field: 'log-reciclagem',
                width: 134,
                minWidth: 134,
                valueGetter: 'data["_"]["logReciclagem"]'
            },

            {
                headerName: $rootScope.i18n('l-finnished-warehouse', undefined, 'dts/mce'),
                field: 'ind-acabado',
                width: 188,
                minWidth: 188,
                valueGetter: 'data["_"]["indAcabado"]'
            },

            {
                headerName: $rootScope.i18n('l-consider-mrp-order', undefined, 'dts/mce'),
                field: 'log-ordens-mrp',
                width: 170,
                minWidth: 170,
                valueGetter: 'data["_"]["logOrdensMrp"]'
            },

            {
                headerName: $rootScope.i18n('l-wms-warehouse', undefined, 'dts/mce'),
                field: 'log-gera-wms',
                width: 151,
                minWidth: 151,
                valueGetter: 'data["_"]["logGeraWms"]'
            },

            {
                headerName: $rootScope.i18n('l-process-warehouse', undefined, 'dts/mce'),
                field: 'ind-processo',
                width: 150,
                minWidth: 150,
                valueGetter: 'data["_"]["indProcesso"]'
            },
	   ];

        service.comparator = function (item1, item2) {
            return (item1['cod-depos'] === item2['cod-depos']);
        };

        service.getObjectFromValue = function (value) {
            
            if (!value  || value == "") return undefined;
            
            return this.resource.TOTVSGet({
                id: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };


        /* Select - warehouseList: Array de objetos da diretiva select
                    getWarehouse: Função padrao para retorno dos objetos no Select com base do valor
                                  informado em tela */
        service.warehouseList = [];
        service.getWarehouse = function (value, init) {
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (init) {
                parameters.init = init;

                if (parameters.init.noCount === undefined) {
                    parameters.init.noCount = false;
                }

            }

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "cod-depos",
                type: "string",
                extend: 1,
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });
            
                  

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.warehouseList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);
        };

        return service;

    }

    index.register.service('mce.deposito.zoom', serviceZoomDeposito);
    index.register.service('mce.deposito-orig.zoom', serviceZoomDeposito);
    index.register.service('mce.deposito-dest.zoom', serviceZoomDeposito);

});