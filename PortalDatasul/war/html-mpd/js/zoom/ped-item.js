define([
    'index',
    '/dts/dts-utils/js/zoom/zoom.js'
], function(index) {

	/*####################################################################################################
    # Database: movdis
    # Table...: ped-item
    # Service.: servicePedItem
    # Register: mpd.ped-item.zoom
    ####################################################################################################*/

	servicePedItem.$inject = ['$totvsresource', '$rootScope', 'dts-utils.zoom', 'dts-utils.utils.Service'];
	function servicePedItem($totvsresource, $rootScope, zoomService, dtsUtils) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/dbo/dibo/bodi154na/:method/:gotomethod/:nomeAbrev/:nrPedCli/:id', {fields: "nome-abrev,nr-pedcli,nr-sequencia,it-codigo,cod-refer,cod-sit-item"}, {});
		service.zoomName = $rootScope.i18n('l-order-itens', undefined, 'dts/mpd');
		service.configuration = true;
        service.useSearchMethod = true;
        service.matches = ['nr-sequencia', 'nr-pedcli'];
        service.setConfiguration('mpd.ped-item.zoom');

		service.propertyFields = [
          	{label: 'l-customer', property: 'nome-abrev', type:'stringrange', default: true, maxlength: 12},
            {label: 'l-customer-request', property: 'nr-pedcli', type:'stringrange', maxlength: 12},
            {label: 'l-sequence', property: 'nr-sequencia', type:'integerrange', vMax: 99999},
            {label: 'l-item', property: 'it-codigo', type:'stringrange', maxlength: 16},
            {label: 'l-reference', property: 'cod-refer', type:'stringrange', maxlength: 8},
            {label: 'l-status', property: 'cod-sit-item', propertyList: [{
                id: 1,
                name: $rootScope.i18n('l-cod-sit-item-1', undefined, 'dts/mpd'),
                value: 1
            },
            {
                id: 2,
                name: $rootScope.i18n('l-cod-sit-item-2', undefined, 'dts/mpd'),
                value: 2
            },
            {
                id: 3,
                name: $rootScope.i18n('l-cod-sit-item-3', undefined, 'dts/mpd'),
                value: 3
            },
            {
                id: 4,
                name: $rootScope.i18n('l-cod-sit-item-4', undefined, 'dts/mpd'),
                value: 4
            },
            {
                id: 5,
                name: $rootScope.i18n('l-cod-sit-item-5', undefined, 'dts/mpd'),
                value: 5
            },
            {
                id: 6,
                name: $rootScope.i18n('l-cod-sit-item-6', undefined, 'dts/mpd'),
                value: 6
            },
            {
                id: 7,
                name: $rootScope.i18n('l-cod-sit-item-7', undefined, 'dts/mpd'),
                value: 7
            }] }
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-customer', undefined, 'dts/mpd'), field: 'nome-abrev', minWidth: 150},
            {headerName: $rootScope.i18n('l-nome-emit', undefined, 'dts/mpd'), field: 'nome-emit', minWidth: 200, valueGetter: function(params) {
                return params.data._['nome-emit'];
            }},
            {headerName: $rootScope.i18n('l-nr-pedcli', undefined, 'dts/mpd'), field: 'nr-pedcli'},
            {headerName: $rootScope.i18n('l-sequencia', undefined, 'dts/mpd'), field: 'nr-sequencia'},
            {headerName: $rootScope.i18n('l-cod-item', undefined, 'dts/mpd'), field: 'it-codigo', minWidth: 150},
            {headerName: $rootScope.i18n('l-descricao', undefined, 'dts/mpd'), field: 'desc-item', minWidth: 150, valueGetter: function(params) {
                return params.data._['desc-item'];
            }},
            {headerName: $rootScope.i18n('l-reference', undefined, 'dts/mpd'), field: 'cod-refer'},
            {headerName: $rootScope.i18n('l-situacao', undefined, 'dts/mpd'), field: 'cod-sit-item', minWidth: 100, valueGetter: function(params) {
                var sentence = '';
                switch (params.data['cod-sit-item']) {
                    case 1:
                        sentence = 'l-cod-sit-item-1';
                    break;
                    case 2:
                        sentence = 'l-cod-sit-item-2';
                    break;
                    case 3:
                        sentence = 'l-cod-sit-item-3';
                    break;
                    case 4:
                        sentence = 'l-cod-sit-item-4';
                    break;
                    case 5:
                        sentence = 'l-cod-sit-item-5';
                    break;
                    case 6:
                        sentence = 'l-cod-sit-item-6';
                    break;
                    case 7:
                        sentence = 'l-cod-sit-item-7';
                    break;
                }
                return $rootScope.i18n(sentence, [], 'dts/mpd');
            }}
        ];

        /*
        * Aplicar filtro inicial no zoom; Passar um objeto com a propriedade 'filter' no atributo zoom-init/select-init;
        * ex: zoom-init="{'filter': {'campo': 'valor'} }"
        */
        service.beforeQuery = function (queryproperties, parameters) {
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
            if (value) {
                return this.resource.TOTVSGet({
                    id: value,
					nrPedCli: ((init && init.filter && init.filter['nr-pedcli'])?init.filter['nr-pedcli']:undefined),
					nomeAbrev: ((init && init.filter && init.filter['nome-abrev'])?init.filter['nome-abrev']:undefined),
                    gotomethod: init ? init.gotomethod : undefined
                }, undefined, {
                    noErrorMessage: true
                }, true);
            }else{
				return undefined;
			}
        };

        service.comparator = function(item1, item2) {
            return (item1['nome-abrev'] === item2['nome-abrev'] &&
                    item1['nr-pedcli'] === item2['nr-pedcli'] &&
                    item1['nr-sequencia'] === item2['nr-sequencia'] &&
                    item1['it-codigo'] === item2['it-codigo'] &&
                    item1['cod-refer'] === item2['cod-refer']);
        };

        service.itemList = [];
        service.getItems = function (value) {

            var _service = this;
            var parameters = {};
            var queryproperties = {};

            if (!parameters.hasOwnProperty('disclaimers') || parameters.disclaimers === undefined)
                parameters.disclaimers = [];

            parameters.disclaimers.push({
                property: "nr-sequencia",
                type: "integer",
                value: value
            });

            queryproperties = dtsUtils.mountQueryProperties({
                parameters: parameters,
                columnDefs: this.columnDefs,
                propertyFields: this.propertyFields
            });

            return this.resource.TOTVSQuery(queryproperties, function (result) {
                service.itemList = result;
            }, {
                noErrorMessage: true,
                noCount: true
            }, true);

        };
		return service;
	}
	index.register.service('mpd.ped-item.zoom', servicePedItem);
});
