/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function (index) {

    'use strict';
    
    /*####################################################################################################
     # Database: emsfin
     # Table...: cart_bcia
     # Service.: serviceBankingCards
     # Register: acr.cart-bcia.zoom
     ####################################################################################################*/
    function serviceBankingCards($timeout,
                                 $totvsresource,
                                 $rootScope,
                                 zoomService,
                                 dtsUtils) {

		var service = {};
		
		var queryproperties = {};
        
        angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgfin/acr/acr931ww/:method//:id');
        service.zoomName       = $rootScope.i18n('l-banking-cards', undefined, 'dts/acr');
        service.setConfiguration('acr.cart-bcia.zoom');
        service.propertyFields = [
            
            {
                label: $rootScope.i18n('l-banking-cards', undefined, 'dts/acr'),
                property: 'cod_cart_bcia',
                type: 'stringextend',
                'default': true
            }, {
                label: $rootScope.i18n('l-description', undefined, 'dts/acr'),
                property: 'des_cart_bcia',
                type: 'stringextend'
            }
        ];
        service.columnDefs = [
            
            {
                headerName: $rootScope.i18n('l-banking-cards', undefined, 'dts/acr'),
                field: 'cod_cart_bcia',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-description', undefined, 'dts/acr'),
                field: 'des_cart_bcia',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-banking-cards-type', undefined, 'dts/acr'),
                field: 'ind_tip_cart_bcia',
                width: 100,
                minWidth: 100
            }
        ];
        service.comparator = function (item1, item2) {
            return (item1.cod_cart_bcia === item2.cod_cart_bcia);
        };
        service.getObjectFromValue = function (value, init) {

            if (angular.isObject(value)) {
                value = value.cod_cart_bcia;
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
		
		/* Implementação para que seja feito o filtro por Tipo de Relacionamento */
		service.beforeQuery = function (queryproperties, parameters) {
						
			if (parameters.init) {
				queryproperties.property = queryproperties.property || [];
				queryproperties.value = queryproperties.value || [];

				if(parameters.init.length == 1){
					queryproperties.property.push('ind_tip_cart_bcia');
					queryproperties.value.push(parameters.init[0].tipo);
				}
				
				if(parameters.init.length == 2){
					queryproperties.where = queryproperties.where || [];
					queryproperties.where.push('ind_tip_cart_bcia = "' + parameters.init[0].tipo + '" or ind_tip_cart_bcia = "' + parameters.init[1].tipo + '"');
				}
				
			}						

		}		

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
            parameters.disclaimers.push({property: "cod_cart_bcia",
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
    
    serviceBankingCards.$inject = ['$timeout',
                                   '$totvsresource',
                                   '$rootScope',
                                   'dts-utils.zoom',
                                   'dts-utils.utils.Service'];

    index.register.service('acr.cart-bcia.zoom', serviceBankingCards);

});
