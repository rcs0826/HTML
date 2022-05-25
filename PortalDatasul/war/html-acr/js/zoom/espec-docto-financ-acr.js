/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function (index) {

    'use strict';
    
    /*####################################################################################################
     # Database: emsfin
     # Table...: espec_docto_financ_acr
     # Service.: serviceArFinancialDocClass
     # Register: acr.espec-docto-financ-acr.zoom
     ####################################################################################################*/
    function serviceArFinancialDocClass($timeout,
                                        $totvsresource,
                                        $rootScope,
                                        zoomService,
                                        dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgfin/acr/acr931wg/:method//:id');
        service.zoomName       = $rootScope.i18n('l-financial-doc-class', undefined, 'dts/acr');
        service.setConfiguration('acr.espec-docto-financ-acr.zoom');
        service.propertyFields = [
            
            {
                label: $rootScope.i18n('l-document-type', undefined, 'dts/acr'),
                property: 'cod_espec_docto',
                type: 'stringextend',
                'default': true
            }
        ];
        service.columnDefs = [
            
            {
                headerName: $rootScope.i18n('l-document-type', undefined, 'dts/acr'),
                field: 'cod_espec_docto',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-accounting', undefined, 'dts/acr'),
                field: 'log_ctbz_aprop_ctbl',												
				valueGetter: function(params) {										
					return service.legend.logical(params.data.log_ctbz_aprop_ctbl);
				},
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-generates-anticipation', undefined, 'dts/acr'),
                field: 'log_gera_antecip',
				valueGetter: function(params) {										
					return service.legend.logical(params.data.log_gera_antecip);
				},
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
            parameters.disclaimers.push({property: "cod_espec_docto",
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
    
    serviceArFinancialDocClass.$inject = ['$timeout',
                                          '$totvsresource',
                                          '$rootScope',
                                          'dts-utils.zoom',
                                          'dts-utils.utils.Service'];

    index.register.service('acr.espec-docto-financ-acr.zoom', serviceArFinancialDocClass);

});
