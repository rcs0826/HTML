/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function (index) {

    'use strict';
    
    /*####################################################################################################
     # Database: emsfin
     # Table...: portador
     # Service.: serviceCollectors
     # Register: utb.portador.zoom
     ####################################################################################################*/
    function serviceCollectors($timeout,
                               $totvsresource,
                               $rootScope,
                               zoomService,
                               dtsUtils) {
								   								   
		var service = {};

		var queryproperties = {};

		angular.extend(service, zoomService);

        service.resource       = $totvsresource.REST('/dts/datasul-rest/resources/dbo/prgint/utb/utb936wt/:method//:id');
        service.zoomName       = $rootScope.i18n('l-carriers', undefined, 'dts/utb');
        service.setConfiguration('utb.portador.zoom');
        service.propertyFields = [
            
            {
                label: $rootScope.i18n('l-carrier', undefined, 'dts/utb'),
                property: 'cod_portador',
                type: 'stringextend',
                'default': true
            }, {
                label: $rootScope.i18n('l-short-name', undefined, 'dts/utb'),
                property: 'nom_abrev',
                type: 'stringextend'
            }
        ];
        service.columnDefs = [
            
            {
                headerName: $rootScope.i18n('l-carrier', undefined, 'dts/utb'),
                field: 'cod_portador',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-short-name', undefined, 'dts/utb'),
                field: 'nom_abrev',
                width: 100,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-carrier-type', undefined, 'dts/utb'),
                field: 'ind_tip_portad',
                width: 100,
                minWidth: 100
            }
        ];
        service.comparator = function (item1, item2) {
									
            return (item1.cod_portador === item2.cod_portador);
        };
        service.getObjectFromValue = function (value, init) {
						
            if (angular.isObject(value)) {							
                value = value.cod_portador;
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

		
		service.beforeQuery = function (queryproperties, parameters) {
						
			if (parameters.init) {
				
				queryproperties.property = queryproperties.property || [];
				queryproperties.value = queryproperties.value || [];

				if(parameters.init.length == 1){
					queryproperties.property.push('ind_tip_portad');
					queryproperties.value.push(parameters.init[0].tipo);
				}

				if(parameters.init.length == 2){
					queryproperties.where = queryproperties.where || [];
					queryproperties.where.push('ind_tip_portad = "' + parameters.init[0].tipo + '" or ind_tip_portad = "' + parameters.init[1].tipo + '"');
				}
				
			}

		}
		

		/* Select - selectResultList...: Array de objetos da diretiva select
					getSelectResultList: Fun????o padrao para retorno dos objetos no Select com base do valor
										 informado em tela */
		service.selectResultList    = [];
		service.getSelectResultList = function (value, init, callback) {
									
			var thisSelect      = this,
				parameters      = {},
				queryproperties = {};

			parameters.init = init;
			parameters.disclaimers = [];
			parameters.disclaimers.push({property: "cod_portador",
										 type: "stringextend",
										 extend: 2,
										 value: value});

			parameters.disclaimers.push({property: "ind_tip_portad",
										 type: "integer",
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
    
    serviceCollectors.$inject = ['$timeout',
                                 '$totvsresource',
                                 '$rootScope',
                                 'dts-utils.zoom',
                                 'dts-utils.utils.Service'];

    index.register.service('utb.portador.zoom', serviceCollectors);

});
