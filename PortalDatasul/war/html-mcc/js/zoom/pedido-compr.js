define(['index',
        '/dts/dts-utils/js/zoom/zoom.js'], function(index) {

    /*####################################################################################################
     # Database: movind
     # Table...: pedido-compr
     # Service.: servicePedidoCompr
     # Register: mcc.pedido-compr.zoom
     ####################################################################################################*/
    servicePedidoCompr.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service'];
    function servicePedidoCompr($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils){

		var service = {}; 
         
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi357/Zoom-pedido-compr', {}, {
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

        service.zoomName       = $rootScope.i18n('l-purchase-orders', [], 'dts/mcc');
        service.setConfiguration('mcc.pedido-compr.zoom');
	    service.propertyFields = [
            {label: $rootScope.i18n('l-order-number', [], 'dts/mcc'), property: 'pedido-compr.num-pedido', type: 'integerrange', default: true, vMin: 0, vMax: 99999999},
            {label: $rootScope.i18n('l-order-date', [], 'dts/mcc'), property: 'pedido-compr.data-pedido', type: 'daterange'},
            {label: $rootScope.i18n('l-abrev-vendor-name', [], 'dts/mcc'), property: 'emitente.nome-abrev', type: 'stringextend', maxlength: 12},
            {label: $rootScope.i18n('l-vendor-name', [], 'dts/mcc'), property: 'emitente.nome-emit', type: 'stringextend', maxlength: 80}
        ];
        
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-order', [], 'dts/mcc'), field: 'num-pedido', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-abrev-name', [], 'dts/mcc'), field: 'nome-abrev', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-vendor-cgc', [], 'dts/mcc'), field: 'cgc', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-order-date', [], 'dts/mcc'), width: 100, minWidth: 100, valueGetter: function (params) {
                return $filter('date') (params.data["data-pedido"], $rootScope.i18n('l-date-format'));
            }},            
            {headerName: $rootScope.i18n('l-contract', [], 'dts/mcc'), field: 'nr-contrato', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-type-mcc', [], 'dts/mcc'), field: 'natureza-desc', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-vendor-name', [], 'dts/mcc'), field: 'nome-emit', width: 450, minWidth: 100}
        ];

        /***
        **  Transforma os disclaimers em parâmetros para a api (ttFilters)
        **  -> Recebe os parameters da função applyFilter do zoom
        *******************************/
        function parseDisclaimers(parameters){
            var cFields = [];
            
            angular.forEach(parameters.disclaimers, function(disclaimer) {
                var field = {};                

                /* Verifica se o disclaimers são do tipo date para converte-los de timestamp para o formato padrão */
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
                
                /* Se o campo estiver em branco não deve ser inserido na query, por este motivo seta-se o valor para undefined */
                if(field.cStartValue == "") field.cStartValue = undefined;
                if(field.cEndValue == "") field.cEndValue = undefined;

                if(field.cStartValue || field.cEndValue) cFields.push(field);                
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
 
    index.register.service('mcc.pedido-compr.zoom', servicePedidoCompr);
});
