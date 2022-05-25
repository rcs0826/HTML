/*jslint indent: 4, maxerr: 50 */
/*global define, angular */
define(['index', '/dts/dts-utils/js/zoom/zoom.js', '/dts/dts-utils/js/dts-utils.js'], function(index) {

    'use strict';

    /*####################################################################################################
     # Database: emsfin
     # Table...: unid_control_financ
     # Service.: serviceFinancialControlUnit
     # Register: cfl.unid-control-financ.zoom
     ####################################################################################################*/

    var serviceFinancialControlUnit;

    function serviceFinancialControlUnit($timeout, $totvsresource, $rootScope, zoomService, dtsUtils) {

        var service = {},
            code = [],
            description = [],
            i = 0;

        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgfin/cfl/cfl908we/:method//:id');
        service.zoomName = $rootScope.i18n('l-financial-control-unity', undefined, 'dts/cfl');
        service.setConfiguration('cfl.unid-control-financ.zoom');
        service.configuration = false;
        service.useSearchMethod = true;
        service.matches = ['cod_unid_control_financ', 'des_unid_control_financ', 'ind_niv_unid_control_financ'];

        service.propertyFields = [
            {
                label: $rootScope.i18n('l-control-unity', undefined, 'dts/cfl'),
                property: 'cod_unid_control_financ',
                type: 'stringextend',
                'default': true
            }, {
                label: $rootScope.i18n('l-description', undefined, 'dts/cfl'),
                property: 'des_unid_control_financ',
                type: 'stringextend'
            }, {
                label: $rootScope.i18n('l-ucf-level', undefined, 'dts/cfl'),
                property: 'ind_niv_unid_control_financ',
                type: 'stringextend'
            }
        ];
        service.columnDefs = [
            {
                headerName: $rootScope.i18n('l-control-unity', undefined, 'dts/cfl'),
                field: 'cod_unid_control_financ',
                valueGetter: function(params) {
                    code.push(params.data['cod_unid_control_financ']);
                    return params.data['cod_unid_control_financ'];
                },
                width: 55,
                minWidth: 55
            }, {
                headerName: $rootScope.i18n('l-description', undefined, 'dts/cfl'),
                field: 'des_unid_control_financ',
                valueGetter: function(params) {
                    description.push(params.data['des_unid_control_financ']);
                    return params.data['des_unid_control_financ'];
                },
                width: 145,
                minWidth: 145
            }, {
                headerName: $rootScope.i18n('l-ucf-level', undefined, 'dts/cfl'),
                field: 'ind_niv_unid_control_financ',
                width: 40,
                minWidth: 40
            }, {
                headerName: $rootScope.i18n('l-parent-control-unity', undefined, 'dts/cfl'),
                field: 'cod_livre_1',
                valueGetter: function(params) {
                    var codLivre = params.data['cod_livre_1'];
                    for (i = 0; i < code.length; i++) {
                        if (codLivre != "") {
                            if (codLivre = code[i]) {
                                codLivre = codLivre + " - " + description[i];
                                return codLivre;
                            }
                        }
                    };                    
                },
                width: 160,
                minWidth: 160
            }
        ];
        service.comparator = function(item1, item2) {
            return ( item1.cod_unid_control_financ === item2.cod_unid_control_financ);
        };
        service.getObjectFromValue = function (value, init) {

            if (angular.isObject(value)) {
                value = value.documentClass;
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
        service.getSelectResultList = function(value, init, callback) {

            var thisSelect = this,
            parameters = {},
            queryproperties = {};

            parameters.init = init;
            parameters.disclaimers = [];
            parameters.disclaimers.push({
                property: "cod_unid_control_financ",
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

    serviceFinancialControlUnit.$inject = ['$timeout', '$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];

    index.register.service('cfl.unid-control-financ.zoom', serviceFinancialControlUnit);

});
