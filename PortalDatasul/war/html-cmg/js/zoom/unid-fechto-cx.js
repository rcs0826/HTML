/*jslint indent: 4, maxerr: 50 */
/*global define, angular */
define(['index', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function(index) {

    'use strict';

    /*####################################################################################################
     # Database: emsfin
     # Table...: unid_fechto_cx
     # Service.: serviceCashClosingUnit
     # Register: cmg.unid-fechto-cx.zoom
     ####################################################################################################*/
    function serviceCashClosingUnit($timeout, $totvsresource, $rootScope, zoomService, dtsUtils) {

        var service = {};

        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgfin/cmg/cmg900wa/:method//:id');
        service.zoomName = $rootScope.i18n('l-cash-closing-units', undefined, 'dts/cmg');
        service.setConfiguration('cmg.unid-fechto-cx.zoom');
        service.propertyFields = [
        {
            label: $rootScope.i18n('l-cash-closing-unit-micro', undefined, 'dts/cmg'),
            property: 'cod_unid_fechto_cx',
            type: 'stringextend',
            'default': true
        }, {
            label: $rootScope.i18n('l-description', undefined, 'dts/cmg'),
            property: 'des_unid_fechto_cx',
            type: 'stringextend'
        }];
        service.columnDefs = [
        {
            headerName: $rootScope.i18n('l-cash-closing-unit-micro', undefined, 'dts/cmg'),
            field: 'cod_unid_fechto_cx',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-description', undefined, 'dts/cmg'),
            field: 'des_unid_fechto_cx',
            width: 100,
            minWidth: 100
        }];
        service.comparator = function(item1, item2) {
            return ( item1.cod_unid_fechto_cx === item2.cod_unid_fechto_cx) ;
        }
        ;
        service.getObjectFromValue = function(value, init) {

            if (angular.isObject(value)) {
                value = value.cod_unid_fechto_cx;
            }

            if (value === undefined) {
                value = "";
            }

            return this.resource.TOTVSGet({
                id: value
            }, {}, function(result) {}, {});

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
                property: "cod_unid_fechto_cx",
                type: "stringextend",
                extend: 2,
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
        }
        ;

        return service;

    }

    serviceCashClosingUnit.$inject = ['$timeout', '$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    index.register.service('cmg.unid-fechto-cx.zoom', serviceCashClosingUnit);

});
