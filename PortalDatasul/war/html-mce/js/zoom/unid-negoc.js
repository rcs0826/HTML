define(['index', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function (index) {

    /*####################################################################################################
     # ZOOM DA TABELA: Unidade de Negocio
     # SERVICO.......: serviceUnidadeNegocio
     # REGISTRO......: mce.unid-negoc.zoom
     ####################################################################################################*/
    serviceUnidadeNegocio.$inject = ['$rootScope', '$timeout', '$totvsresource', 'mce.utils.Service', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    function serviceUnidadeNegocio($rootScope, $timeout, $totvsresource, mceUtils, zoomService, dtsUtils) {

        var service = {};

        angular.extend(service, zoomService); // Extende o serviço de zoom padrão

        
        service.useSearchMethod = true;
		service.searchParameter = 'id';
		service.useCache = true;         
        
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin745/:method//:id');
        
        service.zoomName =  $rootScope.i18n('l-business-unit', undefined, 'dts/mce');  
        
        service.setConfiguration('mce.unid-negoc.zoom');
        
        // Especifico para utilizacao do selec conector
        service.matches = ['cod-unid-negoc', 'des-unid-negoc'];
        
        service.propertyFields = [
            {
                label: $rootScope.i18n('l-business-unit', undefined, 'dts/mce'),
                property: 'cod-unid-negoc',
                type: 'stringextend',
                default: true,
                maxlength: 3
            },
            {
                label: $rootScope.i18n('l-description', undefined, 'dts/mce'),
                property: 'des-unid-negoc',
                type: 'stringextend',
                maxlength: 40
            }
        ];

        service.columnDefs = [
            {
                headerName: $rootScope.i18n('l-business-unit', undefined, 'dts/mce'),
                field: 'cod-unid-negoc',
                width: 200,
                minWidth: 100
            },
            {
                headerName: $rootScope.i18n('l-description', undefined, 'dts/mce'),
                field: 'des-unid-negoc',
                width: 650,
                minWidth: 300
            },
        ];

        service.comparator = function (item1, item2) {
            return (item1['cod-unid-negoc'] === item2['cod-unid-negoc']);
        };

        service.getObjectFromValue = function (value) {
        if (!value) return undefined;
            
            return this.resource.TOTVSGet({
                id: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };

        /* Select - warehouseList: Array de objetos da diretiva select
                    getWarehouse: Função padrao para retorno dos objetos no Select com base do valor
                                  informado em tela */

        service.bussinesUnitList = [];
        service.getBusinessUnit = function (value, init) {
            console.log("serviceUnidadeNegocio", "function: getBusinessUnit", value, init);

            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (init) {
                parameters.init = init
            };

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "cod-unid-negoc",
                type: "string",
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });
            queryproperties.method = 'search';   

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.bussinesUnitList = result;
            }, {
                noErrorMessage: true
            }, true);
        };



        return service;
    }
    index.register.service('mce.unid-negoc.zoom',   serviceUnidadeNegocio);
});