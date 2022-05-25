define([
    'index',
    '/dts/dts-utils/js/zoom/zoom.js',
    '/dts/mcc/js/mcc-legend-service.js'
], function(index) {

	/*####################################################################################################
     # Database: mgind
     # Table...: fab-medic-item
     # Service.: serviceFabMedicItem
     # Register: mcc.fab-medic-item.zoom
     ####################################################################################################*/

    serviceFabMedicItem.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service',  'mcc.zoom.serviceLegend'];
    function serviceFabMedicItem($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, serviceLegend) {
		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi365/zoom-fab-medic-item', {}, { 
            DTSPost: { 
                method: 'POST',
                isArray: true
            }
        });

        // Método customizado para realizar requisições com o método HTTP POST
        service.resource.TOTVSDTSPost = function (parameters, model, callback, headers) {
            this.parseHeaders(headers);
            var call = this.DTSPost(parameters, model);
            return this.processPromise(call, callback);
        };

		service.zoomName = $rootScope.i18n('l-item-medicament-manufacturer', undefined, 'dts/mcc');
		service.setConfiguration('mcc.fab-medic-item.zoom');

		service.propertyFields = [
            {label: $rootScope.i18n('l-manufacturer-code', undefined, 'dts/mcc'), property: 'fab-medic-item.cdn-fabrican', type:'integerrange', default: true, vMax: 999999999, maxlength: 9},
            {label: $rootScope.i18n('l-manufacturer', undefined, 'dts/mcc'), property: 'fab-medic.nom-fabrican', type:'stringrange', maxlength: 60},
            {label: $rootScope.i18n('l-item-code', undefined, 'dts/mcc'), property: 'fab-medic-item.cod-item', type:'stringrange', maxlength: 16}
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-manufacturer-code', undefined, 'dts/mcc'), field: 'cdn-fabrican'},
            {headerName: $rootScope.i18n('l-manufacturer', undefined, 'dts/mcc'), field: 'nom-fabrican'},
            {headerName: $rootScope.i18n('l-item-code', undefined, 'dts/mcc'), field: 'cod-item'}
        ];


        /***
        **  Transforma os disclaimers em parâmetros para a api (ttFilters)
        **  -> Recebe os parameters da função applyFilter do zoom
        *******************************/
        function parseDisclaimers(parameters) {
            //console.info("@@@ parseDisclaimers  parameters= ", parameters);
            var cFields = [];
            
            angular.forEach(parameters.disclaimers, function(disclaimer) {
                var field = {};
                if(!disclaimer.type)
                    disclaimer.type = "stringrange";

                /* Verifica se o disclaimer é do tipo date para aplicar o filtro de data e converter para o formato padrão */
                switch(disclaimer.type) {
                    case 'date':
                        disclaimer.value = $filter('date')(new Date(disclaimer.value), $rootScope.i18n('l-date-format', undefined, 'dts/mcc'));
                        break;
                    case 'daterange':
                        disclaimer.value.start = $filter('date')(new Date(disclaimer.value.start), $rootScope.i18n('l-date-format', undefined, 'dts/mcc'));
                        disclaimer.value.end = $filter('date')(new Date(disclaimer.value.end), $rootScope.i18n('l-date-format', undefined, 'dts/mcc'));
                        break;                    
                }         
                
                if(disclaimer.value instanceof Object) { /* Se for um campo do tipo range */
                    field.cStartValue = disclaimer.value.start;
                    field.cEndValue = disclaimer.value.end; 
                } else {
                    field.cStartValue = disclaimer.value;
                }

                field.cProperty = disclaimer.property;
                field.iExtend = disclaimer.extend;
                field.cType = disclaimer.type;

                if(field.cProperty == "nom-fabrican")
                    field.cProperty = "fab-medic.nom-fabrican";
                if(field.cProperty == "cdn-fabrican")
                    field.cProperty = "fab-medic-item.cdn-fabrican";
                
                if(field.cStartValue == "") field.cStartValue = undefined;
                if(field.cEndValue == "") field.cEndValue = undefined;     

                if(field.cStartValue != undefined || field.cEndValue != undefined) 
                    cFields.push(field);
            });            

            return cFields;
        }

        /*****
        ** Função executada ao clicar no botão aplicar do Zoom
        ** Recebe como parâmetro os filtros e valores informados pelo usuário em tela.
        **************************/
        service.applyFilter = function (parameters) {              
            //console.info("@@@ applyFilter  parameters = ", parameters);
            var _zoom     = this;
            var urlParams = {};            

            if(parameters.isSelectValue){
                if(parameters.selectedFilterValue === undefined) return;
                
                parameters.disclaimers = [];
                parameters.disclaimers.push({property:"applyFilter",
                                            type:"*",
                                            value:parameters.selectedFilterValue});
            }
            var filters   = parseDisclaimers(parameters);
           
            if (parameters.more) {
                urlParams.start = this.zoomResultList.length;
            } else {
                _zoom.zoomResultList = [];
            }

            itemFilter = false;
            for(var i=0; i<filters.length;i++){
                if(filters[i].cProperty == "fab-medic-item.cod-item"){
                    itemFilter = true;
                    break;
                }
            }
            /* passa o valor do item do zoom-init apenas se não for informado nada no range do zoom */
            if(!itemFilter){
                if(parameters && parameters.init && parameters.init.filter){
                    var item = parameters.init.filter['cod-item'];
                    filters.push({cProperty:"fab-medic-item.cod-item",cStartValue:item,cEndValue:item,cType:"stringrange",iExtend:undefined})
                }
            }

            /*******
            ** Chama o método da API passando como parâmetro o array com os filtros (filters) 
            ** e outros parâmetros na URL (urlParams).            
            *********************/
            return this.resource.TOTVSDTSPost(urlParams, filters, function (result) {
                _zoom.zoomResultList = _zoom.zoomResultList.concat(result);
                $timeout(function () {
                    if (result[0] && result[0].hasOwnProperty('$length'))
                        _zoom.resultTotal = result[0].$length;
                    else
                        _zoom.resultTotal = 0;
                }, 0);
            }, {noErrorMessage: _zoom.noErrorMessage}, true);
        };


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
            codItem = undefined;
            if(init && init.filter && init.filter['cod-item'])
                codItem = init.filter['cod-item'];
            
            var resource = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi365?&cdnFabrican='+value+'&codItem='+codItem, {}, { 
                DTSGet: { 
                    method: 'GET',
                    isArray: true
                }
            });
            if (value) {
                return resource.TOTVSGet({
                    id: value,
                    item: init ? init.filter['cod-item'] : undefined,
                    gotomethod: init ? init.gotomethod : undefined
                }, undefined, {noErrorMessage: true}, true);
            }
        };

        service.comparator = function(item1, item2) {
            return (item1['cdn-fabrican'] === item2['cdn-fabrican'] && item1['cod-item'] === item2['cod-item']);
        };
        
		return service;
	}
	index.register.service('mcc.fab-medic-item.zoom', serviceFabMedicItem);
});
