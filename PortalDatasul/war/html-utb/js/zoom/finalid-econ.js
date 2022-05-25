/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function (index) {

    'use strict';
    
    /*####################################################################################################
     # Database: emsuni
     # Table...: finalid_econ
     # Service.: serviceEconPurpose
     # Register: utb.finalid-econ.zoom
     ####################################################################################################*/
    function serviceEconPurpose($timeout,
                                $totvsresource,
                                $rootScope,
                                zoomService,
                                dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgint/utb/utb936wb/:method//:id');
        service.zoomName       = $rootScope.i18n('l-economic-purpose', undefined, 'dts/utb');
        service.setConfiguration('utb.finalid-econ.zoom');
        service.propertyFields = [
            
            {
                label: $rootScope.i18n('l-purpose', undefined, 'dts/utb'),
                property: 'cod_finalid_econ',
                type: 'stringextend',
                'default': true
            }, {
                label: $rootScope.i18n('l-description', undefined, 'dts/utb'),
                property: 'des_finalid_econ',
                type: 'stringextend'
            }
        ];
        service.columnDefs = [
            
            {
                headerName: $rootScope.i18n('l-purpose', undefined, 'dts/utb'),
                field: 'cod_finalid_econ',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-description', undefined, 'dts/utb'),
                field: 'des_finalid_econ',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-store', undefined, 'dts/utb'),
                field: 'ind_armaz_val',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-enter-values', undefined, 'dts/utb'),
                valueGetter: function (params) {
                    return service.legend.logical(params.data.log_infor_val);
                },
                width: 100,
                minWidth: 100
            }
        ];
        service.comparator = function (item1, item2) {
            return (item1.cod_finalid_econ === item2.cod_finalid_econ);
        };
        service.getObjectFromValue = function (value, init) {

            if (angular.isObject(value)) {
                value = value.cod_finalid_econ;
            }

            if (value === undefined) {
                value = "";
            }

            return this.resource.TOTVSGet({id: value}, {}, function (result) {}, {});

        };

        /* Select - selectResultList...: Array de objetos da diretiva select
                    getSelectResultList: Função padrao para retorno dos objetos no Select com base do valor
                                         informado em tela */
        service.selectResultList    = [];
        service.getSelectResultList = function (value, init, callback) {
            
            var thisSelect      = this,
                parameters      = {},
                queryproperties = {};
            
            parameters.init = init;
            parameters.disclaimers = [];
            parameters.disclaimers.push({property: "cod_finalid_econ",
                                         type: "stringextend",
                                         extend: 2,
                                         value: value});

            queryproperties = dtsUtils.mountQueryProperties({parameters    : parameters,
                                                             columnDefs    : this.columnDefs,
                                                             propertyFields: this.propertyFields});

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                thisSelect.selectResultList = result;
                if (callback && angular.isFunction(callback)) {
                    callback(result);
                }
            }, {noErrorMessage: true}, true);
        };
        
        return service;

	}
    
    serviceEconPurpose.$inject = ['$timeout',
                                  '$totvsresource',
                                  '$rootScope',
                                  'dts-utils.zoom',
                                  'dts-utils.utils.Service'];

    index.register.service('utb.finalid-econ.zoom', serviceEconPurpose);

});
