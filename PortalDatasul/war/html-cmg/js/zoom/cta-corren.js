/*jslint indent: 4, maxerr: 50 */
/*global define, angular */
define(['index', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function(index) {

    'use strict';

    /*####################################################################################################
     # Database: emsuni
     # Table...: cta_corren
     # Service.: serviceCheckingAcct
     # Register: cmg.cta-corren.zoom
     ####################################################################################################*/
    function serviceCheckingAcct($timeout, $totvsresource, $rootScope, zoomService, dtsUtils) {

        var service = {};

        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgfin/cmg/cmg900wd/:method//:id');
        service.zoomName = $rootScope.i18n('l-checking-account', undefined, 'dts/cmg');
        service.setConfiguration('cmg.cta-corren.zoom');
        service.propertyFields = [
        {
            label: $rootScope.i18n('l-checking-account-short', undefined, 'dts/cmg'),
            property: 'cod_cta_corren',
            type: 'stringextend',
            'default': true
        }, {
            label: $rootScope.i18n('l-short-name', undefined, 'dts/cmg'),
            property: 'nom_abrev',
            type: 'stringextend'
        }];
        service.columnDefs = [
        {
            headerName: $rootScope.i18n('l-checking-account-short', undefined, 'dts/cmg'),
            field: 'cod_cta_corren',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-short-name', undefined, 'dts/cmg'),
            field: 'nom_abrev',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-type', undefined, 'dts/cmg'),
            field: 'ind_tip_cta_corren',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-site', undefined, 'dts/cmg'),
            field: 'cod_estab',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-business-unit-short', undefined, 'dts/cmg'),
            field: 'cod_unid_negoc',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-purpose', undefined, 'dts/cmg'),
            field: 'cod_finalid_econ',
            width: 100,
            minWidth: 100
        }
        ];
        service.comparator = function(item1, item2) {
            return ( item1.cod_cta_corren === item2.cod_cta_corren) ;
        }
        ;
        service.getObjectFromValue = function(value, init) {

            if (angular.isObject(value)) {
                value = value.cod_cta_corren;
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
                property: "cod_cta_corren",
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

    serviceCheckingAcct.$inject = ['$timeout', '$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    index.register.service('cmg.cta-corren.zoom', serviceCheckingAcct);

});
