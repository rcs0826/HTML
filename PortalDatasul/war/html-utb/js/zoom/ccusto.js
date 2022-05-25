/*jslint plusplus: true, devel: false, indent: 4, maxerr: 50 */
/*global define, angular, $ */
define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dts-utils.js'], function (index) {
    
    'use strict';
 
    /*####################################################################################################
     # Database: emsuni
     # Table...: ccusto
     # Service.: serviceCostCenter
     # Register: utb.ccusto.zoom
     #           utb.ccusto.select
     ####################################################################################################*/
    function serviceCostCenter($timeout,
                               $totvsresource,
                               $rootScope,
                               $filter,
                               $q,
                               zoomService,
                               dtsUtils) {

		var service = {};
        
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/fch/fchutb/costcenter/:method/', {}, {
            DTSGet: {
				method: 'GET',
				isArray: true
			}
        });
        
        /* TOTVSDTSGet - Utilizado para requisicoes com retorno Array */
        service.resource.TOTVSDTSGet = function (parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.DTSGet(parameters, model);
            return this.processPromise(call, callback);
        };
        
	    service.zoomName       = $rootScope.i18n('l-cost-center', undefined, 'dts/utb');
        service.options        = {enableSorting: true}; // Habilitando ordenacao
        service.advancedSearch = false; // Nao permite filtro avancado por ja ser um zoom de filtro
        service.setConfiguration('utb.ccusto.zoom');
	    service.propertyFields = [

            {
                label: $rootScope.i18n('l-cost-center', undefined, 'dts/utb'),
                property: 'cod_ccusto',
                type: 'stringextend',
                'default': true
            }, {
                label: $rootScope.i18n('l-description', undefined, 'dts/utb'),
                property: 'des_tit_ctbl',
                type: 'stringextend'
            }
        ];
        service.columnDefs = [

            {
                headerName: $rootScope.i18n('l-cost-center', undefined, 'dts/utb'),
                field: 'cod_ccusto_f',
                width: 175,
                minWidth: 150
            }, {
                headerName: $rootScope.i18n('l-description', undefined, 'dts/utb'),
                field: 'des_tit_ctbl',
                width: 250,
                minWidth: 150
            }, {
                headerName: $rootScope.i18n('l-cost-center-plan', undefined, 'dts/utb'),
                valueGetter: 'data["cod_plano_ccusto"] + " - " + data["des_plano_ccusto"]',
                width: 200,
                minWidth: 100
            }, {
                headerName: $rootScope.i18n('l-validity-st', undefined, 'dts/utb'),
                field: 'dat_inic_valid_f',
                width: 100,
                minWidth: 90
            }, {
                headerName: $rootScope.i18n('l-end-validity', undefined, 'dts/utb'),
                field: 'dat_fim_valid_f',
                width: 100,
                minWidth: 90
            }
        ];
        service.comparator = function (item1, item2) {
            return (item1.cod_empresa      === item2.cod_empresa      &&
                    item1.cod_plano_ccusto === item2.cod_plano_ccusto &&
                    item1.cod_ccusto       === item2.cod_ccusto);
        };
        service.getObjectFromValue = function (value, init) {
            //console.log("serviceCostCenter", "function: getObjectFromValue", value, init);

            if (angular.isObject(value)) {
                value = value.cod_ccusto;
            }
            
            if (value === undefined) {
                value = "";
            }

            // se nao houver valor não deve buscar do server
            if (value == "") return;
            
            var parameters      = {},
                queryproperties = {},
                deferred;
            
            /* Cria disclaimers com base no init e parameters */
            parameters = this.createDisclaimers(init, parameters, value, 'getObjectFromValue');

            /* Monta o queryproperties para ser enviado ao progress */
            queryproperties = dtsUtils.mountQueryProperties({parameters    : parameters,
                                                             columnDefs    : this.columnDefs,
                                                             propertyFields: this.propertyFields});

            /* Metodo get a ser chamado */
            queryproperties.method = "costcenter";

            /* Utilizado o $q, pois o retorno eh um Array e a diretiva espera um objeto */
            deferred = $q.defer();
            this.resource.TOTVSDTSGet(queryproperties, {},
                                      function (result) {
                
                    deferred.resolve(result[0]);

                }, {});

            /* Retorno do objeto de promessa */
            return deferred.promise;

        };
        service.applyFilter = function (parameters) {
            //console.log("serviceCostCenter", "function: applyFilter", parameters);

            var thisZoom        = this,
                queryproperties = {},
                thisParameters  = parameters,
                init            = parameters.init || undefined;

            /* Cria disclaimers com base no init e parameters */
            parameters = this.createDisclaimers(init, parameters, undefined, 'applyFilter');

            /* Monta o queryproperties para ser enviado ao progress */
            queryproperties = dtsUtils.mountQueryProperties({parameters    : parameters,
                                                             columnDefs    : this.columnDefs,
                                                             propertyFields: this.propertyFields});
            
            /* Quantidade máxima de registros para pesquisa */
            if (parameters.isSelectValue) {
                /* Select - Default: 10 */
                if (thisZoom.limitSelect) { queryproperties.end = thisZoom.limitSelect; }
            } else {
                /* Zoom - Default: 50*/
                if (thisZoom.limitZoom) { queryproperties.end = thisZoom.limitZoom; }
            }
            
            /* Parametro more indica se a consulta eh de mais resultados */
            if (parameters.more) {
                queryproperties.start = this.zoomResultList.length;
            } else {
                thisZoom.zoomResultList = [];
            }

            //console.log("serviceCostCenter", "function: applyFilter", "TOTVSDTSGet", queryproperties);
            return this.resource.TOTVSDTSGet(queryproperties, {}, function (result) {

                if (thisParameters.more) {
                    thisZoom.zoomResultList = thisZoom.zoomResultList.concat(result);
                } else {
                    thisZoom.zoomResultList = [];
                    thisZoom.zoomResultList = thisZoom.zoomResultList.concat(result);
                }

                $timeout(function () {
                    if (result[0] && result[0].hasOwnProperty('$length')) {
                        thisZoom.resultTotal = result[0].$length;
                    } else {
                        thisZoom.resultTotal = 0;
                    }
                }, 0);
            }, {});
        };
        /* Select - costCenters: Array de objetos da diretiva select
                    getCostCenters: Função padrao para retorno dos objetos no Select com base do valor
                                    informado em tela */
        service.costCenters    = [];
        service.getCostCenters = function (value, init) {
            //console.log("serviceCostCenter", "function: getCostCenters", value, init);

            var thisService     = this,
                parameters      = {},
                queryproperties = {};
            
            /* Cria disclaimers com base no init e parameters */
            parameters = this.createDisclaimers(init, parameters, value, 'getCostCenters');

            /* Monta o queryproperties para ser enviado ao progress */
            queryproperties = dtsUtils.mountQueryProperties({parameters    : parameters,
                                                             columnDefs    : this.columnDefs,
                                                             propertyFields: this.propertyFields});

            return this.resource.TOTVSDTSGet(queryproperties, {}, function (result) {
                thisService.costCenters = result;
            }, {});
        };
        
        service.createDisclaimers = function (init, parameters, value, option) {
            
            var selectedFilterValue,
                params;

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined) {
                parameters.disclaimers = [];
            }
            
            if (init) {
                
                parameters.init = init;
                
                if (init.hasOwnProperty('params')) {
                    
                    params = init.params;
                    
                    if (params.hasOwnProperty('cod_empres_ems_2')) {
                        
                        parameters.disclaimers.push({property: "params.cod_empres_ems_2",
                                                     type: "stringextend",
                                                     extend: 1,
                                                     value: init.params.cod_empres_ems_2});

                    }
                    
                    if (params.hasOwnProperty('dat_trans')) {
                        
                        parameters.disclaimers.push({property: "params.dat_trans",
                                                     type: "stringextend",
                                                     extend: 1,
                                                     value: init.params.dat_trans});
                        
                    }
                }
            }

            if (option === 'getObjectFromValue') {
                parameters.disclaimers.push({property: "cod_ccusto",
                                             type: "stringextend",
                                             extend: 1,
                                             value: (!value)?value:value.replace(/[\.\-]/g, '')});
            }

            if (option === 'applyFilter') {
                
                /* Utilizado apenas para o Select2 */
                if (parameters.isSelectValue) {

                    selectedFilterValue = (parameters.selectedFilterValue !== undefined &&
                                           !angular.isObject(parameters.selectedFilterValue)) ?
                                            parameters.selectedFilterValue : "";

                    if (parameters.selectedFilter !== undefined) {
                        parameters.selectedFilter = undefined;
                    }

                    if (parameters.selectedFilterValue !== undefined) {
                        parameters.selectedFilterValue = undefined;
                    }

                    parameters.disclaimers = [];

                    parameters.disclaimers.push({property: "ccusto.cod_ccusto",
                                                 type: "stringextend",
                                                 extend: 2,
                                                 value: (!selectedFilterValue)?selectedFilterValue: selectedFilterValue.replace(/[\.\-]/g, '')});

                    parameters.disclaimers.push({property: "ccusto.des_tit_ctbl",
                                                 type: "stringextend",
                                                 extend: 2,
                                                 value: selectedFilterValue});

                }
            }
            
            if (option === 'getCostCenters') {
                
                parameters.disclaimers.push({property: "ccusto.cod_ccusto",
                                             type: "stringextend",
                                             extend: 2,
                                             value: (!value)?value:value.replace(/[\.\-]/g, '')});

                parameters.disclaimers.push({property: "ccusto.des_tit_ctbl",
                                             type: "stringextend",
                                             extend: 2,
                                             value: value});

            }
            
            return parameters;

        };
        
        return service;

	}
    
    serviceCostCenter.$inject = ['$timeout',
                                 '$totvsresource',
                                 '$rootScope',
                                 '$filter',
                                 '$q',
                                 'dts-utils.zoom',
                                 'dts-utils.utils.Service'];
    
    index.register.service('utb.ccusto.zoom', serviceCostCenter);
    index.register.service('utb.ccusto.select', serviceCostCenter);

});
