/*jslint indent: 4, maxerr: 50 */
/*global define, angular */
define(['index', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function(index) {

    'use strict';

    /*####################################################################################################
     # Database: emsuni
     # Table...: banco
     # Service.: serviceBank
     # Register: cmg.banco.zoom
     ####################################################################################################*/
    function serviceBank($timeout, $totvsresource, $rootScope, zoomService, dtsUtils) {

        var service = {};

        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgfin/cmg/cmg900wb/:method//:id');
        service.zoomName = $rootScope.i18n('l-bank', undefined, 'dts/cmg');
        service.setConfiguration('cmg.banco.zoom');
        service.propertyFields = [
        {
            label: $rootScope.i18n('l-bank', undefined, 'dts/cmg'),
            property: 'cod_banco',
            type: 'stringextend',
            'default': true
        }, {
            label: $rootScope.i18n('l-name', undefined, 'dts/cmg'),
            property: 'nom_banco',
            type: 'stringextend'
        }];
        service.columnDefs = [
        {
            headerName: $rootScope.i18n('l-bank', undefined, 'dts/cmg'),
            field: 'cod_banco',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-name', undefined, 'dts/cmg'),
            field: 'nom_banco',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-bank-system-code', undefined, 'dts/cmg'),
            field: 'cod_sist_nac_bcio',
            width: 100,
            minWidth: 100
        }];
        service.comparator = function(item1, item2) {
            return ( item1.cod_banco === item2.cod_banco) ;
        }
        ;
        service.getObjectFromValue = function(value, init) {

            if (angular.isObject(value)) {
                value = value.cod_banco;
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
                property: "cod_banco",
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

    serviceBank.$inject = ['$timeout', '$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    index.register.service('cmg.banco.zoom', serviceBank);

});
