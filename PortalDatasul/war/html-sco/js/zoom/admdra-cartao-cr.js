/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function (index) {

    'use strict';
    
    /*####################################################################################################
     # Database: emsfin
     # Table...: admdra_cartao_cr
     # Service.: serviceCreditCardAdministrator
     # Register: sco.admdra-cartao-cr.zoom
     ####################################################################################################*/
    function serviceCreditCardAdministrator($timeout,
                                            $totvsresource,
                                            $rootScope,
                                            zoomService,
                                            dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgfin/sco/sco901wd/:method//:id');
        service.zoomName       = $rootScope.i18n('l-credit-card-administrator', undefined, 'dts/sco');
        service.setConfiguration('sco.admdra-cartao-cr.zoom');
        service.propertyFields = [
            
            {
                label: $rootScope.i18n('l-credit-card-administrator', undefined, 'dts/sco'),
                property: 'cod_admdra_cartao_cr',
                type: 'stringextend',
                'default': true
            }, {
                label: $rootScope.i18n('l-flag', undefined, 'dts/sco'),
                property: 'cod_band',
                type: 'stringextend'
            }
        ];
        service.columnDefs = [
            
            {
                headerName: $rootScope.i18n('l-credit-card-administrator', undefined, 'dts/sco'),
                field: 'cod_admdra_cartao_cr',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-flag', undefined, 'dts/sco'),
                field: 'cod_band',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-short-name', undefined, 'dts/sco'),
                field: 'nom_abrev',
                width: 100,
                minWidth: 100
            }
        ];
        service.comparator = function (item1, item2) {
            return (item1.cod_admdra_cartao_cr === item2.cod_admdra_cartao_cr);
        };
        service.getObjectFromValue = function (value, init) {

            if (angular.isObject(value)) {
                value = value.cod_admdra_cartao_cr;
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
        service.selectResultList    = [];
        service.getSelectResultList = function (value, init, callback) {
            
            var thisSelect      = this,
                parameters      = {},
                queryproperties = {};
            
            parameters.init = init;
            parameters.disclaimers = [];
            parameters.disclaimers.push({property: "cod_admdra_cartao_cr",
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
    
    serviceCreditCardAdministrator.$inject = ['$timeout',
                                              '$totvsresource',
                                              '$rootScope',
                                              'dts-utils.zoom',
                                              'dts-utils.utils.Service'];

    index.register.service('sco.admdra-cartao-cr.zoom', serviceCreditCardAdministrator);

});
