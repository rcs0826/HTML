/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index',
    '/dts/dts-utils/js/zoom/zoom.js',
    '/dts/dts-utils/js/dts-utils.js'], function (index) {

        'use strict';

        /*####################################################################################################
         # Database: emsfin
         # Table...: estabelecimento
         # Service.: serviceSite
         # Register: apb.estabelecimento.zoom
         ####################################################################################################*/
        function serviceSite($timeout,
            $totvsresource,
            $rootScope,
            zoomService,
            dtsUtils) {

            var service = {};

            angular.extend(service, zoomService);

            service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgint/utb/utb936ww/:method//:id');
            service.zoomName = $rootScope.i18n('l-site', undefined, 'dts/apb');
            service.setConfiguration('apb.estabelecimento.zoom');
            service.configuration = false;
            service.useSearchMethod = true;
            service.matches = ['cod_estab', 'cod_empresa', 'nom_abrev'];
            service.propertyFields = [

                {
                    label: $rootScope.i18n('l-site', undefined, 'dts/apb'),
                    property: 'cod_estab',
                    type: 'stringextend',
                    'default': true
                }, {
                    label: $rootScope.i18n('l-company', undefined, 'dts/apb'),
                    property: 'cod_empresa',
                    type: 'stringextend',
                    'default': false
                }, {
                    label: $rootScope.i18n('l-nome-abrev', undefined, 'dts/apb'),
                    property: 'nom_abrev',
                    type: 'stringextend',
                    'default': false
                }
            ];
            service.columnDefs = [

                {
                    headerName: $rootScope.i18n('l-site', undefined, 'dts/apb'),
                    field: 'cod_estab',
                    width: 100,
                    minWidth: 100
                }, {
                    headerName: $rootScope.i18n('l-nome-abrev', undefined, 'dts/apb'),
                    field: 'nom_abrev',
                    width: 100,
                    minWidth: 100
                }, {
                    headerName: $rootScope.i18n('l-company', undefined, 'dts/apb'),
                    field: 'cod_empresa',
                    width: 100,
                    minWidth: 100
                }, {
                    headerName: $rootScope.i18n('l-number-site', undefined, 'dts/apb'),
                    field: 'cdn_estab',
                    width: 100,
                    minWidth: 100
                }, {
                    headerName: $rootScope.i18n('l-legal-entity', undefined, 'dts/apb'), 
                    field: 'num_pessoa_jurid',
                    width: 100,
                    minWidth: 100
                }, {
                    headerName: $rootScope.i18n('l-name', undefined, 'dts/apb'), 
                    field: 'nom_pessoa',
                    width: 100,
                    minWidth: 100
                }, {
                    headerName: $rootScope.i18n('l-principal-site', undefined, 'dts/apb'),
                    field: 'log_estab_princ',
                    valueGetter: function (params) {
                        return service.legend.logical(params.data.log_estab_princ);
                    },
                    width: 100,
                    minWidth: 100
                }, {
                    headerName: $rootScope.i18n('l-country', undefined, 'dts/apb'),
                    field: 'cod_pais',
                    width: 100,
                    minWidth: 100
                }, {
                    headerName: $rootScope.i18n('l-federal-id', undefined, 'dts/apb'), 
                    field: 'cod_id_feder',
                    width: 100,
                    minWidth: 100
                }, {
                    headerName: $rootScope.i18n('l-welfare-id', undefined, 'dts/apb'), 
                    field: 'cod_id_previd_social',
                    width: 100,
                    minWidth: 100
                }
            ];

            service.comparator = function (item1, item2) {
                return (item1.site === item2.cod_estab);
            };

            service.getObjectFromValue = function (value, init) {

                if (angular.isObject(value)) {
                    value = value.site;
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

            };

            /* Select - selectResultList...: Array de objetos da diretiva select
                        getSelectResultList: Função padrao para retorno dos objetos no Select com base do valor
                                             informado em tela */
            service.selectResultList = [];
            service.getSelectResultList = function (value, init, callback) {

                var thisSelect = this,
                    parameters = {},
                    queryproperties = {};

                parameters.init = init;
                parameters.disclaimers = [];
                parameters.disclaimers.push({
                    property: "cod_estab",
                    type: "stringextend",
                    extend: 2,
                    value: value
                });

                queryproperties = dtsUtils.mountQueryProperties({
                    parameters: parameters,
                    columnDefs: this.columnDefs,
                    propertyFields: this.propertyFields
                });

                return this.resource.TOTVSQuery(queryproperties, function (result) {
                    thisSelect.selectResultList = result;
                    if (callback && angular.isFunction(callback)) {
                        callback(result);
                    }
                }, { noErrorMessage: true }, true);


            };

            return service;

        }

        serviceSite.$inject = ['$timeout',
            '$totvsresource',
            '$rootScope',
            'dts-utils.zoom',
            'dts-utils.utils.Service'];

        index.register.service('apb.estabelecimento.zoom', serviceSite);

    });
