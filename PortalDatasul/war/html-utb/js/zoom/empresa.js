/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function(index) {

    'use strict';

    /*####################################################################################################
     # Database: emsuni
     # Table...: empresa
     # Service.: serviceCompany
     # Register: utb.empresa.zoom
     ####################################################################################################*/
    function serviceCompany($timeout, $totvsresource, $rootScope, zoomService, dtsUtils) {

        var service = {};

        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgint/utb/utb936wr/:method//:id');
        service.zoomName = $rootScope.i18n('l-company', undefined, 'dts/utb');
        service.setConfiguration('utb.empresa.zoom');
        service.propertyFields = [
        {
            label: $rootScope.i18n('l-company', undefined, 'dts/utb'),
            property: 'cod_empresa',
            type: 'stringextend',
            'default': true
        }, {
            label: $rootScope.i18n('l-company-name', undefined, 'dts/utb'),
            property: 'nom_razao_social',
            type: 'stringextend'
        }, {
            label: $rootScope.i18n('l-short-name', undefined, 'dts/utb'),
            property: 'nom_abrev',
            type: 'stringextend'
        }];
        service.columnDefs = [
        {
            headerName: $rootScope.i18n('l-company', undefined, 'dts/utb'),
            field: 'cod_empresa',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-company-name', undefined, 'dts/utb'),
            field: 'nom_razao_social',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-short-name', undefined, 'dts/utb'),
            field: 'nom_abrev',
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-receive-vendor', undefined, 'dts/utb'),
            valueGetter: function(params) {
                return service.legend.logical(params.data.log_recebe_cop_fornec);
            },
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-receive-vendor-change', undefined, 'dts/utb'),
            valueGetter: function(params) {
                return service.legend.logical(params.data.log_recebe_alter_fornec);
            },
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-receive-cust', undefined, 'dts/utb'),
            valueGetter: function(params) {
                return service.legend.logical(params.data.log_recebe_cop_clien);
            },
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-receive-customer-change', undefined, 'dts/utb'),
            valueGetter: function(params) {
                return service.legend.logical(params.data.log_recebe_alter_clien);
            },
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-receive-rep-copy', undefined, 'dts/utb'),
            valueGetter: function(params) {
                return service.legend.logical(params.data.log_recebe_cop_repres);
            },
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-receive-rep-update', undefined, 'dts/utb'),
            valueGetter: function(params) {
                return service.legend.logical(params.data.log_recebe_alter_repres);
            },
            width: 100,
            minWidth: 100
        }, {
            headerName: $rootScope.i18n('l-integr-ems2', undefined, 'dts/utb'),
            valueGetter: function(params) {
                return service.legend.logical(params.data.log_livre_2);
            },
            width: 100,
            minWidth: 100
        }];
        service.comparator = function(item1, item2) {
            return ( item1.cod_empresa === item2.cod_empresa) ;
        }
        ;
        service.getObjectFromValue = function(value, init) {

            if (angular.isObject(value)) {
                value = value.cod_empresa;
            }

            if (value === undefined) {
                value = "";
            }

            return this.resource.TOTVSGet({
                id: value
            }, undefined, {
                noErrorMessage: true
            }, true);

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
                property: "cod_empresa",
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

    serviceCompany.$inject = ['$timeout', '$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    index.register.service('utb.empresa.zoom', serviceCompany);

});
