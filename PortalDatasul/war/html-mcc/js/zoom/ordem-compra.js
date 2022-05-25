define(['index',
        '/dts/dts-utils/js/zoom/zoom.js',
        '/dts/mcc/js/mcc-legend-service.js'], function(index) {

    /*####################################################################################################
     # Database: movind
     # Table...: ordem-compra
     # Service.: serviceOrdemCompra
     # Register: mcc.ordem-compra.zoom
     ####################################################################################################*/
    serviceOrdemCompra.$inject = ['$timeout', '$totvsresource', '$rootScope', '$filter', 'dts-utils.zoom', 'dts-utils.utils.Service', 'mcc.zoom.serviceLegend', '$q'];
    function serviceOrdemCompra($timeout, $totvsresource, $rootScope, $filter, zoomService, dtsUtils, serviceLegend, $q){

		var service = {}; 
                                
        angular.extend(service, zoomService); // Extende o modelo de servico de zoom (Datasul)
        service.resource = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi358/Zoom-ordem-compra', {}, { 
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

        service.zoomName       = $rootScope.i18n('l-purchase-orderlines', [], 'dts/mcc');      
        service.setConfiguration('mcc.ordem-compra.zoom');
        service.propertyFields = [
            {label: $rootScope.i18n('l-orderline-number', [], 'dts/mcc'), property: 'ordem-compra.numero-ordem', type: 'integerrange', default: true, vMin: 0, vMax: 99999999},
            {label: $rootScope.i18n('l-item', [], 'dts/mcc'), property: 'ordem-compra.it-codigo', type: 'stringextend', maxlength: 16},
            {label: $rootScope.i18n('l-item-description', [], 'dts/mcc'), property: 'item.desc-item', type: 'stringextend', maxlength: 60},
            {label: $rootScope.i18n('l-buyer', [], 'dts/mcc'), property: 'ordem-compra.cod-comprado', type: 'stringrange', default: true, maxlength: 60},   
            {label: $rootScope.i18n('l-status', undefined, 'dts/mpd'), type: 'integer' ,property: 'ordem-compra.situacao', propertyList: [
				{value: 99, name: $rootScope.i18n('l-all', undefined, 'dts/mmi')},
				{value: 1, name: $rootScope.i18n('l-not-confirmed', undefined, 'dts/mcc')},
				{value: 5, name: $rootScope.i18n('l-in-quotation', undefined, 'dts/mcc')},
				{value: "1|5", name: $rootScope.i18n('l-not-confirmed-or-in-quotation', undefined, 'dts/mcc')}
			]}           
        ];   
                              
        service.columnDefs = [
            {headerName: $rootScope.i18n('l-requisition', [], 'dts/mcc'), field: 'numero-ordem', width: 110, minWidth: 100},
            {headerName: $rootScope.i18n('l-item', [], 'dts/mcc'), field: 'it-codigo', width: 150, minWidth: 100},
            {headerName: $rootScope.i18n('l-item-description', [], 'dts/mcc'), field: 'desc-item', width: 400, minWidth: 100},            
            {headerName: $rootScope.i18n('l-requester', [], 'dts/mcc'), field: 'requisitante', width: 100, minWidth: 100},            
            {headerName: $rootScope.i18n('l-status', [], 'dts/mcc'), field: 'situacao', width: 150, minWidth: 100, valueGetter: function(params) {
                if(params.data['situacao']) return serviceLegend.purchaseRequisitionStatus.NAME(params.data['situacao']);
            }}
        ];
       
        /***
        **  Transforma os disclaimers em parâmetros para a api (ttFilters)
        **  -> Recebe os parameters da função applyFilter do zoom
        *******************************/
        function parseDisclaimers(parameters) {
            
            var cFields = [];
            var cDescricao;
            
            if (!parameters.disclaimers){               
                if(parameters.init) {                
                    if(parameters.init.filter) {
                        for (var property in parameters.init.filter) {                        
                            if (property == "ordem-compra.situacao") {
                                var field = {};
                                var situacao = service.propertyFields[4];
                                field.cProperty     = property;
                                field.cStartValue   = parameters.init.filter[property];
                                field.cEndValue     = "?";
                                field.cType         = "integer"
                                field.iExtend       = undefined;
                                if(field.cStartValue != undefined || field.cEndValue != undefined) cFields.push(field);                                                                 
                                cDescricao = service.propertyFields[4].propertyList.find( fproperty => fproperty.value == field.cStartValue); 
                                if  (service.propertyFields[4].value){
                                    service.propertyFields[4].value = {value: field.cStartValue, name: cDescricao.name}; 
                                }
                                else {
                                    situacao["value"]  = {value: field.cStartValue, name: cDescricao.name};  
                                }                               
                            }    
                            if (property == "ordem-compra.cod-comprado") {
                                var field = {};
                                var codcomprado = service.propertyFields[3];
                                field.cProperty     = property;
                                field.cStartValue   = parameters.init.filter[property];
                                field.cEndValue     = parameters.init.filter[property];
                                field.cType         = "stringrange"
                                field.iExtend       = undefined;
                                if(field.cStartValue != undefined || field.cEndValue != undefined) cFields.push(field); 
                                if  (service.propertyFields[3].value){
                                    service.propertyFields[3].value = {end: field.cEndValue, start: field.cStartValue}; 
                                }
                                else {
                                    codcomprado["value"] = {end: field.cEndValue, start: field.cStartValue}; 
                                }  
                            }
                        }
                    }                
                }              
            }

            
            /***********************************************************************************************************************/
            var fieldSituacao = {};
            angular.forEach(parameters.disclaimers, function(disclaimer) {               
                if(disclaimer.property == "ordem-compra.situacao") {
                    if(!disclaimer.value) {
                        disclaimer.value = {value: 99, name: 'Todas'};
                    }                  
                    
					if (disclaimer.value.value !== 99){
						if (disclaimer.value)  { 
						   
							if (fieldSituacao.cStartValue) {
								fieldSituacao.cStartValue   = fieldSituacao.cStartValue + "|" + disclaimer.value.value;
							}else{
								fieldSituacao.cStartValue   = disclaimer.value.value;
							};                        
							fieldSituacao.cEndValue     = "?";
							fieldSituacao.cProperty     = disclaimer.property;
							fieldSituacao.iExtend       = disclaimer.extend;
							fieldSituacao.cType         = disclaimer.type;
						}
					}
                }
                
            });

            if(fieldSituacao.cStartValue != undefined || fieldSituacao.cEndValue != undefined) cFields.push(fieldSituacao);
            /***********************************************************************************************************************/
           
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
                    if (disclaimer.type == "integer"){
                        field.cStartValue = disclaimer.value.value;
                    } else {
                        field.cStartValue = disclaimer.value.start;
                        field.cEndValue = disclaimer.value.end;
                    }                     
                } else {
                    field.cStartValue = disclaimer.value;
                }

                field.cProperty = disclaimer.property;
                field.iExtend = disclaimer.extend;
                field.cType = disclaimer.type;
                                               
                /* Tratamento para o campo item (pode conter valor em branco) */
                if(disclaimer.property == "ordem-compra.it-codigo") {
                    // Filtro simples 
                    if(parameters.selectedFilter) {
                        field.cStartValue = !disclaimer.value ? "" : disclaimer.value;
                    } else { // Filtro avançado
                        field.cStartValue = disclaimer.value;
                    }
                }else { // Demais campos
                    // Se o campo estiver em branco não deve ser inserido na query, por este motivo seta-se o valor para undefined
                    if(field.cStartValue == "") field.cStartValue = undefined;
                    if(field.cEndValue == "") field.cEndValue = undefined;
                }
                if(disclaimer.property !== "ordem-compra.situacao") {
                    if(field.cStartValue != undefined || field.cEndValue != undefined) cFields.push(field);
                }
            });             
            
            return cFields;
        }
    
       /*****
        ** Função executada ao clicar no botão aplicar do Zoom
        ** Recebe como parâmetro os filtros e valores informados pelo usuário em tela.
        **************************/
        service.applyFilter = function (parameters) {           
            if (parameters.disclaimers){              
                if (parameters.disclaimers[0].property == "ordem-compra.cod-comprado"){
                    if (parameters.disclaimers[0].value == undefined){                        
                        parameters.disclaimers = undefined;
                    }               
                }
            }            
         
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
        
        /*****
        ** Função executada no leave do campo de zoom
        ** value: Número da ordem de compra
        ** init: Filtros
        **************************/
        service.getObjectFromValue =  function (value, init) {
                        
            var resource = $totvsresource.REST('/dts/datasul-rest/resources/api/ccp/ccapi358?&numOrdem='+value, {}, { 
                DTSGet: { 
                    method: 'GET',
                    isArray: true
                }
            });
            if (value && !(value instanceof Object)) {
                return resource.TOTVSGet({
                    id: value,
                    gotomethod: init ? init.gotomethod : undefined
                }, undefined, {noErrorMessage: true}, true);
            }
        };


        return service;
	}
 
    index.register.service('mcc.ordem-compra.zoom', serviceOrdemCompra);
});
