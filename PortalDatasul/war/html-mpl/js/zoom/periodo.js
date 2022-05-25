define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
    # Database: mgind
    # Table...: periodo
    # Service.: servicePeriodoZoom
    # Register: mpl.periodo.zoom
    ####################################################################################################*/

    servicePeriodoZoom.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function servicePeriodoZoom($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

        var scopeService = this;

        var service = {};
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/inbo/boin299/:method/:id', {}, {});
        service.zoomName = "l-period";
        service.configuration = true;

        service.propertyFields = [
            {label: 'l-period', property: 'nr-periodo', type:'integerrange', default: true},
            {label: 'l-year', property: 'ano', type:'integerrange'},
            {label: 'l-type',property: 'cd-tipo', type:'stringrange'},
            {label: 'l-initial-date',property: 'dt-inicio', type:'date'},
            {label: 'l-final-date',property: 'dt-termino', type:'date'}];

        service.columnDefs = [
            {headerName: $rootScope.i18n('l-period', undefined, 'dts/mpl'), field: 'nr-periodo'},
            {headerName: $rootScope.i18n('l-year', undefined, 'dts/mpl'),field: 'ano'},
            {headerName: $rootScope.i18n('l-type', undefined, 'dts/mpl'), field: 'cd-tipo'},
            {headerName: $rootScope.i18n('l-initial-date', undefined, 'dts/mpl'), field: 'dt-inicio',
                valueGetter: function(params){
                    return $filter('date')(params.data['dt-inicio'], 'dd/MM/yyyy');
                }
            },
            {headerName: $rootScope.i18n('l-final-date', undefined, 'dts/mpl'),field: 'dt-termino',
                valueGetter: function(params){
                    return $filter('date')(params.data['dt-termino'], 'dd/MM/yyyy');
                }
            }];

        service.getObjectFromValue = function (value, init) {

            if (isNaN(intValue)) return undefined;

            return this.resource.TOTVSGet({
                id: value,
            }, undefined, {
                noErrorMessage: true
            }, true);
        };

        service.periodList = [];
        service.getPeriod = function (value) {

            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            if (value['periodo'] != undefined) {
                var aux = value['periodo'].split("/");

                parameters.disclaimers.push({
                    property: "ano",
                    type: "integer",
                    value: aux[1]
                });

                parameters.disclaimers.push({
                    property: "nr-periodo",
                    type: "integer",
                    extend: 1,
                    value: aux[0]
                });
            }

            if (value['tipo'] != undefined) {
                parameters.disclaimers.push({
                    property: "cd-tipo",
                    type: "integer",
                    value: value['tipo']
                });
            }

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.periodList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);

        };

        service.inicialPeriodList = [];
        service.getInitialPeriod = function (value, init) {
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (init) {
                parameters.init = init;

                if (parameters.init.noCount === undefined) {
                   parameters.init.noCount = false;
              }
            }

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            var aux = value.split("/");

            if (aux[1] != ""){
                parameters.disclaimers.push({
                    property: "ano",
                    type: "integer",
                    value: aux[1]
                });
            }

            parameters.disclaimers.push({
                property: "nr-periodo",
                type: "integer",
                extend: 1,
                value: aux[0]
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.inicialPeriodList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);
        };

        service.finalPeriodList = [];
        service.getFinalPeriod = function (value, init) {
            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (init) {
                parameters.init = init;

                if (parameters.init.noCount === undefined) {
                   parameters.init.noCount = false;
              }
            }

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            var aux = value.split("/");

            if (aux[1] != ""){
                parameters.disclaimers.push({
                    property: "ano",
                    type: "integer",
                    value: aux[1]
                });
            }

            parameters.disclaimers.push({
                property: "nr-periodo",
                type: "integer",
                extend: 1,
                value: aux[0]
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.finalPeriodList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);
        };


        service.applyFilter = function (parameters) {

            var useCache = true;
            var hasUserFilter = false;

            if (!parameters.disclaimers) {
                parameters.disclaimers = [];
            }

            if (parameters.init !== undefined && parameters.init.property === 'cd-tipo') {
                angular.forEach(parameters.disclaimers, function(result) {
                    if (result.property === parameters.init.property) {
                        hasUserFilter = true;
                    }
                });

                if (hasUserFilter == false) {
                    parameters.disclaimers.push({label: 'l-type',
                                                 property: parameters.init.property,
                                                 type: 'stringrange',
                                                 value: parameters.init.value});
                }
            }

            if (this.useCache !== undefined)
            {
                useCache = this.useCache;
            }
            if (parameters.isSelectValue) {
                if (this.disclaimerSelect) {
                    parameters.disclaimers[0].type = this.disclaimerSelect.type;
                    if (this.disclaimerSelect.extend !== undefined) {
                        parameters.disclaimers[0].extend = this.disclaimerSelect.extend;
                    }
                }
            }

            var thisZoom = this,
                queryproperties = {};


            if (this.useSearchMethod && parameters.isSelectValue && angular.isArray(this.matches)) {
                queryproperties[this.searchParameter] = parameters.disclaimers[0].value;
                queryproperties.method = 'search';
                queryproperties.searchfields = this.matches.join(',');
                queryproperties.fields = queryproperties.searchfields;

            } else if (parameters.isSelectValue && angular.isArray(this.matches)) {

                queryproperties = dtsUtils.mountQueryWhere({
                    matches: this.matches,
                    columnDefs: this.columnDefs,
                    parameters: parameters
                });

            } else {
                queryproperties = dtsUtils.mountQueryProperties({
                    parameters: parameters,
                    columnDefs: this.columnDefs,
                    propertyFields: this.propertyFields
                });
            }

            /* Quantidade máxima de registros para pesquisa */
            if (parameters.isSelectValue) {
                /* Select - Default: 10 */
                if (this.limitSelect) { queryproperties.limit = this.limitSelect; }
            } else {
                /* Zoom - Default: 50*/
                if (this.limitZoom) { queryproperties.limit = this.limitZoom; }
            }

            if (parameters.more) {
                queryproperties.start = this.zoomResultList.length;
            } else {
                thisZoom.zoomResultList = [];
            }

            return this.resource.TOTVSQuery(queryproperties, function (result) {

                thisZoom.zoomResultList = thisZoom.zoomResultList.concat(result);
                $timeout(function () {
                    if (result[0] && result[0].hasOwnProperty('$length')) {
                        thisZoom.resultTotal = result[0].$length;
                    } else {
                        thisZoom.resultTotal = 0;
                    }
                }, 0);
            }, {
                noErrorMessage: thisZoom.noErrorMessage
            }, useCache);
        };

        return service;
    }

    index.register.service('mpl.periodo.zoom', servicePeriodoZoom);

});