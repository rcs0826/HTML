/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function (index) {

    'use strict';
    
    /*####################################################################################################
     # Database: emsfin
     # Table...: espec_docto_financ
     # Service.: serviceArFinancialDocClass
     # Register: apb.espec-docto-financ-apb.zoom
     ####################################################################################################*/
    function serviceFinancialDocSeries($timeout,
                                        $totvsresource,
                                        $rootScope,
                                        zoomService,
                                        dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgint/utb/utb944wq/:method//:id');
        service.zoomName       = $rootScope.i18n('l-invoice-series', undefined, 'dts/apb');
        service.setConfiguration('apb.ser-fisc-nota.zoom');
        service.configuration = false;
        service.useSearchMethod = true;
        service.matches = ['cod_ser_fisc_nota', 'des_ser_fisc_nota'];
        
        service.propertyFields = [
            
            {
                label: $rootScope.i18n('l-tax-invoice-series', undefined, 'dts/apb'),
                property: 'cod_ser_fisc_nota',
                type: 'stringextend',
                'default': true
            },{
                label: $rootScope.i18n('l-description', undefined, 'dts/apb'),
                property: 'des_ser_fisc_nota',
                type: 'stringextend',
                'default': false
            }
        ];
        service.columnDefs = [
            
            {
                headerName: $rootScope.i18n('l-tax-invoice-series', undefined, 'dts/apb'), // Estabelecimento
                field: 'cod_ser_fisc_nota',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-description', undefined, 'dts/apb'), // Estabelecimento
                field: 'des_ser_fisc_nota',
                width: 100,
                minWidth: 100
            }
        ];
        service.comparator = function (item1, item2) {
            return (item1.documentSeries === item2.cod_ser_fisc_nota);
        };
        service.getObjectFromValue = function (value, init) {

            if (angular.isObject(value)) {
                value = value.cod_ser_fisc_nota;
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
            parameters.disclaimers.push({property: "cod_ser_fisc_nota",
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
    
    serviceFinancialDocSeries.$inject = ['$timeout',
                                          '$totvsresource',
                                          '$rootScope',
                                          'dts-utils.zoom',
                                          'dts-utils.utils.Service'];

    index.register.service('apb.ser-fisc-nota.zoom', serviceFinancialDocSeries);

});
