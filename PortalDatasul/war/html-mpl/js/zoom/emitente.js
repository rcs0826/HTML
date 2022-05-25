define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
    # Database: mgadm
    # Table...: emitente
    # Service.: serviceEmitente
    # Register: mpd.emitente.zoom
    ####################################################################################################*/

    serviceEmitente.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function serviceEmitente($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils) {

        var scopeService = this;

        var service = {};
        angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/adbo/boad098f/:method/:gotomethod/:id', {}, {});
        service.zoomName = $rootScope.i18n('l-issuer-name', undefined, 'dts/mpl');
        service.configuration = true;
        service.setConfiguration('mpd.emitente.zoom');
        service.useSearchMethod = true;
        service.matches = ['cod-emitente', 'nome-abrev', 'cgc'];

        service.propertyFields = [
            {label: $rootScope.i18n('l-code', undefined, 'dts/mpl'), property: 'cod-emitente', type:'integerrange'},
            {label: $rootScope.i18n('l-short-name', undefined, 'dts/mpl'), property: 'nome-abrev', type:'string', default: true},
            {label: $rootScope.i18n('l-cnpj-cpf', undefined, 'dts/mpl'), property: 'cgc', type:'string'},
            {label: $rootScope.i18n('l-issuer-name', undefined, 'dts/mpl'), property: 'nome-emit', type:'string'},
            {label: $rootScope.i18n('l-customer-group', undefined, 'dts/mpl'), property: 'cod-gr-cli', type:'integerrange'},
            {label: $rootScope.i18n('l-matriz', undefined, 'dts/mpl'), property: 'nome-matriz', type:'string'},
            {label: $rootScope.i18n('l-provider-group', undefined, 'dts/mpl'), property: 'cod-gr-forn', type:'integerrange'},
            {label: $rootScope.i18n('l-identification', undefined, 'dts/mpl'), property: 'identific', type:'integerrange'},
            {label: $rootScope.i18n('l-nature', undefined, 'dts/mpl'), property: 'natureza', propertyList: [
                {value: 1, name: $rootScope.i18n('l-priv-indiv', undefined, 'dts/mpl')},
                {value: 2, name: $rootScope.i18n('l-legal-entity', undefined, 'dts/mpl')},
                {value: 3, name: $rootScope.i18n('l-foreign', undefined, 'dts/mpl')},
                {value: 4, name: $rootScope.i18n('l-trading', undefined, 'dts/mpl')}
            ]}
        ];
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-code', undefined, 'dts/mpl'), field: 'cod-emitente'},
            {headerName: $rootScope.i18n('l-short-name', undefined, 'dts/mpl'), field: 'nome-abrev'},
            {headerName: $rootScope.i18n('l-cnpj-cpf', undefined, 'dts/mpl'), field: 'cgc'},
            {headerName: $rootScope.i18n('l-issuer-name', undefined, 'dts/mpl'), field: 'nome-emit'},
            {headerName: $rootScope.i18n('l-customer-group', undefined, 'dts/mpl'), field: 'cod-gr-cli'},
            {headerName: $rootScope.i18n('l-matriz', undefined, 'dts/mpl'), field: 'nome-matriz'},
            {headerName: $rootScope.i18n('l-vendor', undefined, 'dts/mpl'), field: 'cod-gr-forn'},
            {headerName: $rootScope.i18n('l-nature', undefined, 'dts/mpl'), field: 'natureza', valueGetter: function(param) {
                if(param.data.natureza === 1) {
                    return $rootScope.i18n('l-priv-indiv', undefined, 'dts/mpl');
                } else if(param.data.natureza === 2) {
                    return $rootScope.i18n('l-legal-entity', undefined, 'dts/mpl');
                } else if(param.data.natureza === 3) {
                    return $rootScope.i18n('l-foreign', undefined, 'dts/mpl');
                } else if(param.data.natureza === 4) {
                    return $rootScope.i18n('l-trading', undefined, 'dts/mpl');
                }
            }},
            {headerName: $rootScope.i18n('l-identification', undefined, 'dts/mpl'), field: 'identific', valueGetter: function(param) {
                if(param.data.identific === 1) {
                    return $rootScope.i18n('l-customer', undefined, 'dts/mpl');
                } else if(param.data.identific === 2) {
                    return $rootScope.i18n('l-vendor', undefined, 'dts/mpl');
                } else if(param.data.identific === 3) {
                    return $rootScope.i18n('l-both', undefined, 'dts/mpl');
                }
            }}
        ];

        service.afterQuery = function (queryresult, parameters) {
            /* Forçar a ordernação pelo código emitente de forma paliativa enquanto o Framework corrige o DatasulRest */
            queryresult.sort(sortNumber);
        }

        function sortNumber(a,b) {
            return a["cod-emitente"] - b["cod-emitente"];
        }

        service.beforeQuery = function (queryproperties, parameters) {
            queryproperties.order = "cod-emitente";

            if(parameters.init) {
                queryproperties.property = queryproperties.property || [];
                queryproperties.value = queryproperties.value || [];

                if(parameters.init.filter) {
                    for (var property in parameters.init.filter) {
                        // Verifica se o usuário informou algum valor para a propriedade, se não, utiliza o valor padrão (init)
                        if(queryproperties.property.indexOf(property) < 0) {
                            queryproperties.property.push(property);
                            queryproperties.value.push(parameters.init.filter[property]);
                        }
                    }
                }
            }
        };

        service.getObjectFromValue =  function (value, init) {

            if(value === "?"){
                return null;
            }

            if (value != null && value != undefined && value != "") {

                if (init == undefined) {
                    return this.resource.TOTVSQuery({
                        id: value,
                        method: "search",
                        searchfields: service.matches.join(','),
                        limit: 1
                    }, undefined, {
                        noErrorMessage: true
                    }, true).then(function (result) {
                        return result[0];
                    });
                } else {

                    return this.resource.TOTVSGet({
                        id: value,
                        gotomethod: init ? init.gotomethod : undefined
                    }, undefined, {
                        noErrorMessage: true
                    }, true);
                }
            }
        };

        service.comparator = function(item1, item2) {
            return (item1['cod-emitente'] === item2['cod-emitente']);
        };

        service.emitenteList = [];
        service.getEmitente = function (value) {

            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "nome-abrev",
                type: "string",
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.emitenteList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);

        };

        return service;

    }
    index.register.service('mpd.emitente.zoom', serviceEmitente);

});

