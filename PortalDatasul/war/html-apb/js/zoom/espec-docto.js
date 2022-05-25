/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index',
    '/dts/dts-utils/js/zoom/zoom.js',
    '/dts/dts-utils/js/dts-utils.js'], function (index) {

        'use strict';

        /*####################################################################################################
         # Database: emsfin
         # Table...: espec_docto
         # Service.: serviceArFinancialDocClass
         # Register: apb.espec-docto-financ-apb.zoom
         ####################################################################################################*/
        function serviceDocClass($timeout,
            $totvsresource,
            $rootScope,
            zoomService,
            dtsUtils) {

            var service = {};

            angular.extend(service, zoomService);

            service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgint/utb/utb936wz/:method//:id');
            service.zoomName = $rootScope.i18n('l-document-type', undefined, 'dts/apb');
            service.setConfiguration('apb.espec-docto.zoom');
            service.configuration = false;
            service.useSearchMethod = true;
            service.matches = ['cod_espec_docto', 'des_espec_docto'];
            
            service.propertyFields = [

                {
                    label: $rootScope.i18n('l-document-class', undefined, 'dts/apb'),
                    property: 'cod_espec_docto',
                    type: 'stringextend',
                    'default': true
                }, {
                    label: $rootScope.i18n('l-description', undefined, 'dts/apb'),
                    property: 'des_espec_docto',
                    type: 'stringextend'
                }
            ];
            service.columnDefs = [

                {
                    headerName: $rootScope.i18n('l-document-class', undefined, 'dts/apb'),
                    field: 'cod_espec_docto',
                    width: 100,
                    minWidth: 100
                }, {
                    headerName: $rootScope.i18n('l-description', undefined, 'dts/apb'),
                    field: 'des_espec_docto',
                    width: 100,
                    minWidth: 100
                }, {
                    headerName: $rootScope.i18n('l-class-type', undefined, 'dts/apb'),
                    field: 'ind_tip_espec_docto',
                    width: 100,
                    minWidth: 100
                }
            ];
            service.comparator = function (item1, item2) {
                return (item1.cod_espec_docto === item2.cod_espec_docto);
            };
            service.getObjectFromValue = function (value, init) {

                if (angular.isObject(value)) {
                    value = value.cod_espec_docto;
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

            service.selectResultList = [];
            service.getSelectResultList = function (value, init, callback) {

                var thisSelect = this,
                    parameters = {},
                    queryproperties = {};

                parameters.init = init;
                parameters.disclaimers = [];
                parameters.disclaimers.push({
                    property: "cod_espec_docto",
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

        serviceDocClass.$inject = ['$timeout',
            '$totvsresource',
            '$rootScope',
            'dts-utils.zoom',
            'dts-utils.utils.Service'];

        index.register.service('apb.espec-docto.zoom', serviceDocClass);

    });
