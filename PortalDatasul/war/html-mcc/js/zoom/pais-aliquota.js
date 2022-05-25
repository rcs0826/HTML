define([
    'index',
    '/dts/dts-utils/js/zoom/zoom.js',
    '/dts/mcc/js/mcc-legend-service.js'
], function(index) {

	/*####################################################################################################
     # Database: mgcex
     # Table...: pais-aliquota
     # Service.: servicePaisAliquota
     # Register: mcc.pais-aliquota.zoom
     ####################################################################################################*/

    servicePaisAliquota.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service',  'mcc.zoom.serviceLegend'];
    function servicePaisAliquota($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, serviceLegend) {
		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi366/zoom-pais-aliquota', {}, { 
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

		service.zoomName = $rootScope.i18n('l-country-orig-rate', undefined, 'dts/mcc');
		service.setConfiguration('mcc.pais-aliquota.zoom');

		service.propertyFields = [
            {label: $rootScope.i18n('l-source-country', undefined, 'dts/mcc'), property: 'pais-aliquota.cod-pais', type:'integerrange', vMax: 99999, maxlength: 5, default: true},
            {label: $rootScope.i18n('l-name', undefined, 'dts/mcc'), property: 'pais.nome-pais', type:'stringrange', maxlength: 20},
            {label: $rootScope.i18n('l-import-system', undefined, 'dts/mcc'), property: 'pais-aliquota.des-regim-import', type:'stringrange', maxlength: 50},
            {label: $rootScope.i18n('l-tax-classification', undefined, 'dts/mcc'), property: 'pais-aliquota.class-fiscal', type:'stringrange', maxlength: 8},
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-source-country', undefined, 'dts/mcc'), field: 'cod-pais'},
            {headerName: $rootScope.i18n('l-name', undefined, 'dts/mcc'), field: 'nome-pais'},

            {headerName: $rootScope.i18n('l-import-system', undefined, 'dts/mcc'), field: 'regime-import'},
            {headerName: $rootScope.i18n('l-description', undefined, 'dts/mcc'), field: 'des-regim-import'},
            {headerName: $rootScope.i18n('l-tax-classification', undefined, 'dts/mcc'), field: 'class-fiscal'},
            {headerName: $rootScope.i18n('l-standard-regime', undefined, 'dts/mcc'), field: 'log-regim-import-padr', valueGetter: function(params) {
                return serviceLegend.boolean.NAME(params.data['ativo']);
            }},
            {headerName: $rootScope.i18n('l-special-ii', undefined, 'dts/mcc'), field: 'aliquota-ii'},
            {headerName: $rootScope.i18n('l-special-ipi', undefined, 'dts/mcc'), field: 'aliquota-ipi'}
        ];


        /* Função que dispara automáticamente o applyFilter quando o zoom é aberto */
        service.afterInitialize = function(){
            this.applyInternalFilter(false);
        }

        /***
        **  Transforma os disclaimers em parâmetros para a api (ttFilters)
        **  -> Recebe os parameters da função applyFilter do zoom
        *******************************/
        function parseDisclaimers(parameters) {
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
            var _zoom     = this;
            var urlParams = {};            

            if(parameters.isSelectValue){
                //if(parameters.selectedFilterValue === undefined) return;
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

            classFiscalFilter = false;
            for(var i=0; i<filters.length;i++){
                if(filters[i].cProperty == "pais-aliquota.class-fiscal"){
                    classFiscalFilter = true;
                    break;
                }
            }
            paisFilter = false;
            for(var i=0; i<filters.length;i++){
                if(filters[i].cProperty == "pais-aliquota.cod-pais"){
                    paisFilter = true;
                    break;
                }
            }


            /* passa o valor do item do zoom-init apenas se não for informado nada no range do zoom */
            if(!classFiscalFilter){
                if(parameters && parameters.init && parameters.init.filter){
                    var classFiscal = parameters.init.filter['class-fiscal'];
                    if(classFiscal != null && classFiscal != undefined)
                        filters.push({cProperty:"pais-aliquota.class-fiscal",cStartValue:classFiscal,cEndValue:classFiscal,cType:"stringrange",iExtend:undefined})
                }
            }
            if(!paisFilter){
                if(parameters && parameters.init && parameters.init.filter){
                    var codPais = parameters.init.filter['cod-pais'];
                    if(codPais != null && codPais != undefined)
                        filters.push({cProperty:"pais-aliquota.cod-pais",cStartValue:codPais,cEndValue:codPais,cType:"integerrange",iExtend:undefined})
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
            if(!value) 
                return;

            classFiscal = undefined;
            codPais = undefined
            if(init && init.filter){
                if(init.filter['class-fiscal'])
                    classFiscal = init.filter['class-fiscal'];
                if(init.filter['cod-pais'])
                    codPais = init.filter['cod-pais'];
            }

            queryParams = "?";
            queryParams += "&regimeImport="+value;
            if(classFiscal)
                queryParams += "&classFiscal="+classFiscal;
            if(codPais)
                queryParams += "&codPais="+codPais;
                
            var resource = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi366'+queryParams, {}, { 
                DTSGet: { 
                    method: 'GET',
                    isArray: true
                }
            });
            if (value) {
                return resource.TOTVSGet({
                    id: value,                    
                    gotomethod: init ? init.gotomethod : undefined
                }, undefined, {noErrorMessage: true}, true);
            }
        };

        service.comparator = function(item1, item2) {
            return (item1['cod-pais'] === item2['cod-pais']);
        };
		return service;
	}
	index.register.service('mcc.pais-aliquota.zoom', servicePaisAliquota);
});
