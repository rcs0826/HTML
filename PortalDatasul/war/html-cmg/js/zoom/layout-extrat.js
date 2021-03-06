/*jslint indent: 4, maxerr: 50 */
/*global define, angular */
define(['index', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function(index) {

    'use strict';

    /*####################################################################################################
     # Database: emsuni
     # Table...: layout_extrat
     # Service.: serviceStmntLayout
     # Register: cmg.layout-extrat.zoom
     ####################################################################################################*/
    function serviceStmntLayout($timeout, $totvsresource, $rootScope, zoomService, dtsUtils) {

        var service = {};

        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgfin/cmg/cmg900wc/:method//:id');
        service.zoomName = $rootScope.i18n('l-checking-acct-stmnt-layout', undefined, 'dts/cmg');
        service.setConfiguration('cmg.layout-extrat.zoom');
        service.propertyFields = [
        {
            label: $rootScope.i18n('l-stmnt-layout', undefined, 'dts/cmg'),
            property: 'cod_layout_extrat',
            type: 'stringextend',
            'default': true
        }, {
            label: $rootScope.i18n('l-description', undefined, 'dts/cmg'),
            property: 'des_layout_extrat',
            type: 'stringextend'
        }];
        service.columnDefs = [
        {
            headerName: $rootScope.i18n('l-stmnt-layout', undefined, 'dts/cmg'),
            field: 'cod_layout_extrat',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-description', undefined, 'dts/cmg'),
            field: 'des_layout_extrat',
            width: 100,
            minWidth: 100
        }
        ];
        service.comparator = function(item1, item2) {
            return ( item1.cod_layout_extrat === item2.cod_layout_extrat) ;
        }
        ;
        service.getObjectFromValue = function(value, init) {

            if (angular.isObject(value)) {
                value = value.cod_layout_extrat;
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
                    getSelectResultList: Fun????o padrao para retorno dos objetos no Select com base do valor
                                         informado em tela */
        service.selectResultList = [];
        service.getSelectResultList = function(value, init, callback) {

            var thisSelect = this
              , parameters = {}
              , queryproperties = {};

            parameters.init = init;
            parameters.disclaimers = [];
            parameters.disclaimers.push({
                property: "cod_layout_extrat",
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

    serviceStmntLayout.$inject = ['$timeout', '$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    index.register.service('cmg.layout-extrat.zoom', serviceStmntLayout);

});
