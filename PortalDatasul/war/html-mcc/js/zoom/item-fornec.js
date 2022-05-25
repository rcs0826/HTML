define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {
		
	/*####################################################################################################
    # Database: mgind
    # Table...: item-fornec
    # Service.: serviceItemFornec
    # Register: mcc.item-fornec.zoom
    ####################################################################################################*/

	serviceItemFornec.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service',  'mcc.zoom.serviceLegend'];
	function serviceItemFornec($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, serviceLegend) {
		
		var scopeService = this;
		
		var service = {};
		angular.extend(service, zoomService);

        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi363/zoom-item-fornec', {}, { 
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

        service.zoomName = $rootScope.i18n('l-vendor-item', undefined, 'dts/mcc');
        service.setConfiguration('mcc.item-fornec.zoom');

        service.propertyFields = [
            {label: 'l-item-code', property: 'item-fornec.it-codigo', type:'stringrange', default: true},
            {label: 'l-item-description', property: 'item.desc-item', type:'stringrange'},
            {label: 'l-vendor', property: 'item-fornec.cod-emitente', type:'integerrange'},
            {label: 'l-short-name', property: 'emitente.nome-abrev', type:'stringrange'}
        ];
		
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-item-code', undefined, 'dts/mcc'), field: 'it-codigo'},
            {headerName: $rootScope.i18n('l-item-description', undefined, 'dts/mcc'), field: 'desc-item'},
            {headerName: $rootScope.i18n('l-vendor', undefined, 'dts/mcc'), field: 'cod-emitente'},
            {headerName: $rootScope.i18n('l-short-name', undefined, 'dts/mcc'), field: 'nome-abrev'},
            {headerName: $rootScope.i18n('l-vendor-item', undefined, 'dts/mcc'), field: 'item-do-forn'},
            {headerName: $rootScope.i18n('l-measure-unit-vendor', undefined, 'dts/mcc'), field: 'unid-med-for'},
            {headerName: $rootScope.i18n('l-active', undefined, 'dts/mcc'), field: 'ativo', valueGetter: function(params) {
                return serviceLegend.boolean.NAME(params.data['ativo']);
            }}
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
                if(filters[i].cProperty == "item-fornec.it-codigo"){
                    itemFilter = true;
                    break;
                }
            }
            /* passa o valor do item do zoom-init apenas se não for informado nada no range do zoom */
            if(!itemFilter){
                if(parameters && parameters.init && parameters.init.filter){
                    var item = parameters.init.filter['it-codigo'];
                    filters.push({cProperty:"item-fornec.it-codigo",cStartValue:item,cEndValue:item,cType:"stringrange",iExtend:undefined})
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
	index.register.service('mcc.item-fornec.zoom', serviceItemFornec);
	
});
