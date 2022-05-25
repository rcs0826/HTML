/*jslint indent: 4, maxerr: 50 */
/*global define, angular */
define(['index', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function(index) {

    'use strict';

    /*####################################################################################################
     # Database: emsfin
     # Table...: padr_fluxo_cx
     # Service.: serviceCashFlowPattern
     # Register: cfl.padr-fluxo-cx.zoom
     ####################################################################################################*/

    var serviceCashFlowPattern;

    function serviceCashFlowPattern($timeout, $totvsresource, $rootScope, zoomService, dtsUtils) {

        var service = {};

        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgfin/cfl/cfl908wd/:method//:id');
        service.zoomName = $rootScope.i18n('l-cash-flow-pattern', undefined, 'dts/cfl');
        service.setConfiguration('cfl.padr-fluxo-cx.zoom');
        service.configuration = false;
        service.useSearchMethod = true;
        service.matches = ['cod_padr_fluxo_cx', 'des_padr_fluxo_cx', 'cod_unid_control_financ'];
        service.propertyFields = [
            {
                label: $rootScope.i18n('l-cash-flow-pattern', undefined, 'dts/cfl'),
                property: 'cod_padr_fluxo_cx',
                type: 'stringextend',
                'default': true
            }, {
                label: $rootScope.i18n('l-description', undefined, 'dts/cfl'),
                property: 'des_padr_fluxo_cx',
                type: 'stringextend'
            }, {
                label: $rootScope.i18n('l-control-unity', undefined, 'dts/cfl'),
                property: 'cod_unid_control_financ',
                type: 'stringextend'
            }
        ];
        service.columnDefs = [
            {
                headerName: $rootScope.i18n('l-cash-flow-pattern', undefined, 'dts/cfl'),
                field: 'cod_padr_fluxo_cx',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-description', undefined, 'dts/cfl'),
                field: 'des_padr_fluxo_cx',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-control-unity', undefined, 'dts/cfl'),
                field: 'cod_unid_control_financ',
                width: 100,
                minWidth: 100
            }
        ];
        service.comparator = function(item1, item2) {
            return ( item1.cod_padr_fluxo_cx === item2.cod_padr_fluxo_cx) ;
        }
        ;
        service.getObjectFromValue = function(value, init) {

            if (angular.isObject(value)) {
                value = value.cod_padr_fluxo_cx;
            }

            if (value === undefined) {
                value = "";
            }

            if (value != null && value != undefined && value != "") {
                return this.resource.TOTVSGet({
                    id: value,
                    gotomethod: init ? init.gotomethod : undefined
                }, undefined, {
                        noErrorMessage: true
                    }, true);
            }

        }
        ;

        /* Select - selectResultList...: Array de objetos da diretiva select
                    getSelectResultList: Função padrao para retorno dos objetos no Select com base do valor
                                         informado em tela */
        service.selectResultList = [];
        service.getSelectResultList = function(value, init, callback) {

            var thisSelect = this
              , parameters = {}
              , queryproperties = {};

            parameters.init = init;
            parameters.disclaimers = [];
            parameters.disclaimers.push({
                property: "cod_padr_fluxo_cx",
                type: "stringextend",
                extend: 8,
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function(result) {
                thisSelect.selectResultList = result;
                if (callback && angular.isFunction(callback)) {
                    callback(result);
                }
            }, {
                noErrorMessage: true
            }, true);
        };

        return service;

    }

    serviceCashFlowPattern.$inject = ['$timeout', '$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    index.register.service('cfl.padr-fluxo-cx.zoom', serviceCashFlowPattern);

});
