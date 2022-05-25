define(['index', '/dts/mce/js/mce-utils.js', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function (index) {
    /*####################################################################################################
     # ZOOM DA TABELA: localizacao
     # SERVICO.......: serviceZoomLocalizacao
     # REGISTRO......: mce.zoom.localizacao
 ####################################################################################################*/
    serviceZoomLocalizacao.$inject = ['$timeout', '$totvsresource', 'mce.utils.Service', 'dts-utils.zoom', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    function serviceZoomLocalizacao($timeout, $totvsresource, mceUtils, zoomService, $rootScope, zoomService, dtsUtils) {

        var service = {};

        angular.extend(service, zoomService); // Extende o serviço de zoom padrão

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin189na/:method//:codEstabel//:codDepos//:codLocaliz/');

        service.zoomName = $rootScope.i18n('l-localization', undefined, 'dts/mce');       

        service.setConfiguration('mce.localizacao.zoom');
        
        service.matches = ['cod-localiz','descricao'];  

        service.propertyFields = [

            {
                label: $rootScope.i18n('l-localization', undefined, 'dts/mce'),
                property: 'cod-localiz',
                type: 'stringextend',
                default: true,
                maxlength: 20
            },
            {
                label: $rootScope.i18n('l-description', undefined, 'dts/mce'),
                property: 'descricao',
                type: 'stringextend',
                maxlength: 30
            },
            {
                label: $rootScope.i18n('l-warehouse', undefined, 'dts/mce'),
                property: 'cod-depos',
                type: 'stringextend',
                maxlength: 3
            }

         ];


        service.columnDefs = [
            {
                headerName: $rootScope.i18n('l-localization'),
                field: 'cod-localiz',
                width: 141,
                minWidth: 141
            },
            {
                headerName: $rootScope.i18n('l-description'),
                field: 'descricao',
                width: 253,
                minWidth: 253
            },
            {
                headerName: $rootScope.i18n('l-warehouse'),
                field: 'cod-depos',
                width: 80,
                minWidth: 80
            },
            {
                headerName: $rootScope.i18n('l-site'),
                field: 'cod-estabel',
                width: 377,
                minWidth: 200,
                valueGetter: function (param) {
                    return param.data["cod-estabel"];
                    //return param.data["cod-estabel"] + " - " + param.data["_"]["nomeEstab"]
                }
            }
        ];


        service.getObjectFromValue = function (value, init) {

            if (!value) return undefined;

            return this.resource.TOTVSGet({
                codEstabel: init.filters['cod-estabel'],
                codDepos: init.filters['cod-depos'],
                codLocaliz: value
            }, undefined, {
                noErrorMessage: true
            }, true);
        };

        service.comparator = function (item1, item2) {
            return ((item1['cod-localiz'] === item2['cod-localiz']) &&
                (item1['cod-depos'] === item2['cod-depos']) &&
                (item1['cod-estabel'] === item2['cod-estabel']));
        };


        /* Select - locatiomList: Array de objetos da diretiva select
                    getLocation: Função padrao para retorno dos objetos no Select com base do valor
                                 informado em tela */
        service.locationList = [];
        service.getLocation = function (value, init) {
            console.log("serviceZoomLocalizacao", "function: getLocation", value, init);

            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (init) {
                parameters.init = init;
            }

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "cod-localiz",
                type: "string",
                value: value
            });


            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.locationList = result;
            }, {
                noErrorMessage: true               
            }, true);
        };

        return service;

    }

    index.register.service('mce.localizacao.zoom', serviceZoomLocalizacao);
 	index.register.service('mce.localiz-orig.zoom', serviceZoomLocalizacao);	
 	index.register.service('mce.localiz-dest.zoom', serviceZoomLocalizacao);		
});