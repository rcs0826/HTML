define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/dts-utils/js/dbo/dbo.js'], function(index) {

    /*####################################################################################################
     # Database: mginv
     # Table...: sub-div-ordem
     # Service.: serviceSubDivOrdem
     # Register: mcc.sub-div-ordem.zoom
     ####################################################################################################*/
    serviceSubDivOrdem.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service', '$totvsprofile'];
    function serviceSubDivOrdem($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, $totvsprofile){

        var service = {};
                
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)        
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/inp/inapi412/Zoom-ordem-investimento/', {}, { 
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

        service.zoomName       = $rootScope.i18n('l-investment-orders', [], 'dts/mcc');
        service.setConfiguration('mcc.sub-div-ordem.zoom');
        service.propertyFields = [
            {label: $rootScope.i18n('l-exe-site', [], 'dts/mcc'), property: 'sub-div-ordem.cod-est-exec', type: 'stringrange', maxlength: 5},
            {label: $rootScope.i18n('l-project-num', [], 'dts/mcc'), property: 'sub-div-ordem.num-projeto', type: 'integerrange', vMin: 0, vMax:  99999},
            {label: $rootScope.i18n('l-section', [], 'dts/mcc'), property: 'sub-div-ordem.num-secao', type: 'integerrange', vMin: 0, vMax: 99999},
            {label: $rootScope.i18n('l-company', [], 'dts/mcc'), property: 'sub-div-ordem.ep-codigo', type: 'stringrange', maxlength: 3},
            {label: $rootScope.i18n('l-orderline-number', [], 'dts/mcc'), property: 'sub-div-ordem.num-ordem', type: 'integerrange', default: true, vMin: 0, vMax: 999},
            {label: $rootScope.i18n('l-sub-specialty', [], 'dts/mcc'), property: 'sub-div-ordem.cod-sub-espec', type: 'integerrange', vMin: 0, vMax: 99999},
            {label: $rootScope.i18n('l-update-user', [], 'dts/mcc'), property: 'sub-div-ordem.usuario-atu', type: 'stringextend', maxlength: 12},
            {label: $rootScope.i18n('l-id-solumn', [], 'dts/mcc'), property: 'sub-div-ordem.cod-id-solum', type: 'stringextend', maxlength: 100},
            {label: $rootScope.i18n('l-ems-order', [], 'dts/mce'), property: 'sub-div-ordem.num-ord-magnus', type: 'integerrange', vMin: 0, vMax: 99999999},
            {label: $rootScope.i18n('l-specialty', [], 'dts/mcc'), property: 'sub-div-ordem.cod-especialidade', type: 'integerrange', vMin: 0, vMax: 99999},
            {label: $rootScope.i18n('l-payment-deadline', [], 'dts/mcc'), property: 'sub-div-ordem.prazo-pagto', type: 'integerrange', vMin: 0, vMax: 99999},
            {label: $rootScope.i18n('l-expense-source', [], 'dts/mcc'), property: 'sub-div-ordem.cod-origem', type: 'integerrange', vMin: 0, vMax: 9},
            {label: $rootScope.i18n('l-observation', [], 'dts/mcc'), property: 'sub-div-ordem.observacao', type: 'stringextend', maxlength: 76},
        ];
        
        service.columnDefs = [	
            {headerName: $rootScope.i18n('l-orderline-number', [], 'dts/mcc'), field: 'num-ordem', width: 128, minWidth: 100},
            {headerName: $rootScope.i18n('l-orderline-description', [], 'dts/mcc'), field: 'ordem-inv-descricao', width: 177, minWidth: 100},
            {headerName: $rootScope.i18n('l-ems-order', [], 'dts/mce'), field: 'num-ord-magnus', width: 116, minWidth: 100},
            {headerName: $rootScope.i18n('l-exe-site', [], 'dts/mcc'), field: 'cod-est-exec', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-project-num', [], 'dts/mcc'), field: 'num-projeto', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-project-description', [], 'dts/mcc'), field: 'proj-inv-descricao', width: 154, minWidth: 100},
            {headerName: $rootScope.i18n('l-section', [], 'dts/mcc'), field: 'num-secao', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-section-description', [], 'dts/mcc'), field: 'secao-inv-descricao', width: 146, minWidth: 100},
            {headerName: $rootScope.i18n('l-company', [], 'dts/mcc'), field: 'ep-codigo', width: 100, minWidth: 100},            
            {headerName: $rootScope.i18n('l-sub-specialty', [], 'dts/mcc'), field: 'cod-sub-espec', width: 132, minWidth: 100},
            {headerName: $rootScope.i18n('l-sub-specialty-description', [], 'dts/mcc'), field: 'sub-espec-descricao', width: 200, minWidth: 100 },
            {headerName: $rootScope.i18n('l-estimated-value', [], 'dts/mcc'), field: 'vl-estimado', width: 119, minWidth: 100, valueGetter: function(params) {
                return params.data['vl-estimado'][0];
            }},
            {headerName: $rootScope.i18n('l-update-user', [], 'dts/mcc'), field: 'usuario-atu', width: 143, minWidth: 100},
            {headerName: $rootScope.i18n('l-id-solumn', [], 'dts/mcc'), field: 'cod-id-solum', width: 125, minWidth: 100},
            {headerName: $rootScope.i18n('l-reestimated-value', [], 'dts/mcc'), field: 'vl-reestimado', width: 131, minWidth: 100, valueGetter: function(params) {
                return params.data['vl-reestimado'][0];
            }},            
            {headerName: $rootScope.i18n('l-specialty', [], 'dts/mcc'), field: 'cod-especialidade', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-specialty-description', [], 'dts/mcc'), field: 'especialidade-descricao', width: 190, minWidth: 100},
            {headerName: $rootScope.i18n('l-payment-deadline', [], 'dts/mcc'), field: 'prazo-pagto', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-expense-source', [], 'dts/mcc'), field: 'cod-origem', width: 129, minWidth: 100},
            {headerName: $rootScope.i18n('l-last-update', [], 'dts/mcc'), field: 'dt-atualizacao', width: 132, minWidth: 100, valueGetter: function(params) {
                if(params.data['dt-atualizacao']) return $filter('date') (params.data['dt-atualizacao'], $rootScope.i18n('l-date-format', [], 'dts/mcc'));
            }},
            {headerName: $rootScope.i18n('l-observation', [], 'dts/mcc'), field: 'observacao', width: 100, minWidth: 100},
            {headerName: $rootScope.i18n('l-payment-time', [], 'dts/mcc'), field: 'tempo-pagto', width: 100, minWidth: 100}
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

				// Se o campo estiver em branco não deve ser inserido na query, por este motivo seta-se o valor para undefined
				if(field.cStartValue == "") field.cStartValue = undefined;
				if(field.cEndValue == "") field.cEndValue = undefined;
                if(field.cStartValue != undefined || field.cEndValue != undefined) cFields.push(field);
            });   

            if(parameters.init) {

                if(parameters.init.filter) {
                    for (var property in parameters.init.filter) {
                        var field = {};
                        field.cProperty = property;
                        field.cStartValue = parameters.init.filter[property];
                        if(field.cStartValue != undefined || field.cEndValue != undefined) cFields.push(field);
                    }
                }
            }         

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
			
            /*foi incluído cProperty == "ep-codigo" por conta da chamada que o programa purchaseorderline faz*/
			if (filters[0] == undefined || filters[0] == {} || filters[0].cProperty == "ep-codigo"){
				filters = {cStartValue: "1", cEndValue: "99999", cType: "integerrange", cProperty: "sub-div-ordem.num-projeto"};
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
		
        /* Função que dispara automáticamente o applyFilter quando o zoom é aberto */
        service.afterInitialize = function(){
            this.applyInternalFilter(false);
        }		

        service.getObjectFromValue = function (value, init) {
			if (!value) return undefined;
			
			var resource = $totvsresource.REST('/dts/datasul-rest/resources/api/inp/inapi412/:method/', {}, { 								
                DTSGet: { 
                    method: 'GET',
                    isArray: true
                }
            });
			
            if (value && !(value instanceof Object)) {
                return resource.TOTVSGet({
		        id: value,					
                'company': (init.filter && init.filter['ep-codigo']) ? init.filter['ep-codigo']:undefined,					
                'method': init && init.method ? init.method : undefined		
                }, undefined, {
					noErrorMessage: true
				}, true);
            }			
			
        };


        return service;
    }
 
    index.register.service('mcc.sub-div-ordem.zoom', serviceSubDivOrdem);
});
