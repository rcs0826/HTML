define([
    'index',
    '/dts/dts-utils/js/zoom/zoom.js',
    '/dts/mcc/js/mcc-legend-service.js'
], function(index) {

	/*####################################################################################################
     # Database: mgind
     # Table...: item-unid-compra
     # Service.: serviceItemUnidCompra
     # Register: mcc.item-unid-compra.zoom
     ####################################################################################################*/

    serviceItemUnidCompra.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service',  'mcc.zoom.serviceLegend'];
    function serviceItemUnidCompra($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, serviceLegend) {

		var scopeService = this;

		var service = {};
		angular.extend(service, zoomService);

		service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi364/zoom-item-unid-compra', {}, { 
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

		service.zoomName = $rootScope.i18n('l-item-un', undefined, 'dts/mcc');
		service.setConfiguration('mcc.item-unid-compra.zoom');

		service.propertyFields = [
          	{label: 'l-un', property: 'item-unid-compra.un', type:'stringrange', maxlength: 16, default: true,},
            {label: 'l-description', property: 'tab-unidade.descricao', type:'stringrange', maxlength: 15},
            {label: 'l-item-code', property: 'item-unid-compra.it-codigo', type:'stringrange', maxlength: 16}
        ];

		service.columnDefs = [
            {headerName: $rootScope.i18n('l-un', undefined, 'dts/mcc'), field: 'un'},
            {headerName: $rootScope.i18n('l-description', undefined, 'dts/mcc'), field: 'descricao'},
            {headerName: $rootScope.i18n('l-item-code', undefined, 'dts/mcc'), field: 'it-codigo'}
        ];


        /***
        **  Transforma os disclaimers em parâmetros para a api (ttFilters)
        **  -> Recebe os parameters da função applyFilter do zoom
        *******************************/
        function parseDisclaimers(parameters) {
            var cFields = [];
            
            angular.forEach(parameters.disclaimers, function(disclaimer) {
                var field = {};

                /* Verifica se o disclaimer é do tipo date para aplicar o filtro de data e converter para o formato padrão */
                switch(disclaimer.type) {
                    case 'date':
                        disclaimer.value = $filter('date')(new Date(disclaimer.value), $rootScope.i18n('l-date-format'));
                        break;
                    case 'daterange':
                        disclaimer.value.start = $filter('date')(new Date(disclaimer.value.start), $rootScope.i18n('l-date-format'));
                        disclaimer.value.end = $filter('date')(new Date(disclaimer.value.end), $rootScope.i18n('l-date-format'));
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
            var filters   = parseDisclaimers(parameters);
           
            if (parameters.more) {
                urlParams.start = this.zoomResultList.length;
            } else {
                _zoom.zoomResultList = [];
            }

            itemFilter = false;
            for(var i=0; i<filters.length;i++){
                if(filters[i].cProperty == "item-unid-compra.it-codigo"){
                    itemFilter = true;
                    break;
                }
            }
            /* passa o valor do item do zoom-init apenas se não for informado nada no range do zoom */
            if(!itemFilter){
                if(parameters && parameters.init && parameters.init.filter){
                    var item = parameters.init.filter['it-codigo'];
                    filters.push({cProperty:"item-unid-compra.it-codigo",cStartValue:item,cEndValue:item,cType:"stringrange",iExtend:undefined})
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

        return service;
	}
	index.register.service('mcc.item-unid-compra.zoom', serviceItemUnidCompra);
});
