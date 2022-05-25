/*jslint plusplus: true, devel: true, indent: 5, maxerr: 50 */
/*global define, angular, $ */

define(['index', 
        'angularAMD',        
        '/dts/mpd/js/zoom/estabelec.js',
        '/dts/mce/js/mce-utils.js', 
        '/dts/mce/js/api/fch/fchmat/fchmatinventorybalanceinquiry-services.js', 
        '/dts/mce/js/mce-legend-service.js'], function (index) {

    /*####################################################################################################
     # CONTROLLER: controllerAdvancedSearch
     * REGISTRO..: mce.itembalance.AdvancedSearchController
     # DESCRICAO.: Controle da Pesquisa Avançada
     ####################################################################################################*/
    // CONTROLLER PESQUISA AVANCADA
    controllerAdvancedSearch.$inject = [ '$rootScope', '$scope', '$modalInstance', 'parameters', 'mce.fchmatInventoryBalanceInquiryFactory.factory', 'mce.utils.Service', 'mce.zoom.serviceLegend', 'TOTVSEvent' ];

     function controllerAdvancedSearch($rootScope, $scope, $modalInstance, parameters,  fchmatInventoryBalanceInquiryFactory, mceUtil, legend, TOTVSEvent) {
          var _controller = this;
          this.mceUtils = mceUtil;
          this.legendUtils = legend;
          this.model = {};
          this.disclaimers = undefined;
          this.itemCode = parameters.itemCode;
          this.param = {};
          this.ttGenericFilter = parameters.ttGenericFilter;
          this.ttDocumentClasses = [];
          this.ttCurrency = [];
          this.selectedInitialDocumentClass = {};
          this.selectedFinalDocumentClass = {};
          this.transactionDateRange = {};
          this.referenceRange = {};
          this.warehouseRange = {};
          this.lotRange = {};
          this.locationRange = {};
          this.serieRange = {};
          this.documentRange = {};
          this.CONSTANTS = parameters.CONSTANTS;
          this.param = {};
          this.collapse = false;
         
        /* Função....: apply
           Descrição.: aplica o filtro, cria os disclaimers e retorna para a tela os parâmetros selecionados
           Parâmetros: <não há> 
        */
          this.apply = function () {
              this.isInvalidForm();
            
              this.getMedioDescription();
                         
              this.parseModelToDisclaimers();
              
              this.prepareParams();
              
              $modalInstance.close({disclaimers: _controller.disclaimers,
                                    parametros: _controller.param}); // fecha modal retornando parametro
            
            
        }

        /* Função....: prepareParams
           Descrição.: prepara os dados utilizados na busca avançada
           Parâmetros: 
        */
        this.prepareParams = function() {
            
            var ttGenericFilter = [];
            
            ttGenericFilter.push({name:'reference' , initialValue: _controller.model.referenceRange.start , finalValue: _controller.model.referenceRange.end});
            
            ttGenericFilter.push({name:'warehouse' , initialValue: _controller.model.warehouseRange.start , finalValue: _controller.model.warehouseRange.end});
            ttGenericFilter.push({name:'lot' , initialValue: _controller.model.lotRange.start , finalValue: _controller.model.lotRange.end});
            ttGenericFilter.push({name:'localization' , initialValue: _controller.model.locationRange.start, finalValue: _controller.model.locationRange.end});
            ttGenericFilter.push({name:'serie' , initialValue: _controller.model.serieRange.start, finalValue: _controller.model.serieRange.end});
            ttGenericFilter.push({name:'document' , initialValue: _controller.model.documentRange.start, finalValue: _controller.model.documentRange.end});
            ttGenericFilter.push({name:'especie' , initialValue: _controller.model.documentClass.start['esp-docto'], finalValue: _controller.model.documentClass.end['esp-docto']});
            ttGenericFilter.push({name:'medio' , initialValue: _controller.model.medio.value, finalValue: _controller.model.medio.value});
            ttGenericFilter.push({name:'moeda' , initialValue: _controller.model.currency.value, finalValue: _controller.model.currency.value});
                        
            _controller.ttGenericFilter = ttGenericFilter;
            
            _controller.param = { pItem: _controller.itemCode,
                                  pSite: _controller.model.site,
                                  pDtIni: _controller.model.transactionDateRange.start,
                                  pDtEnd: _controller.model.transactionDateRange.end,
                                  ttGenericFilter: _controller.ttGenericFilter};              
        }
        
        /* Função....: getMedioDescription
           Descrição.: busca a descrição do médio
           Parâmetros: 
        */
        this.getMedioDescription = function() {
            _controller.model.medio.description = _controller.legendUtils.averageType.NAME(_controller.model.medio.value);
        }
        
        /* Função....: changeCollapse
           Descrição.: exibe ou esconde as faixas
           Parâmetros: 
        */
        this.changeCollapse = function() {
            _controller.collapse = !_controller.collapse;
        }
        
        /* Função....: setDefaultsParameter
           Descrição.: executa o método setDefaultsParameter na fachada e retorna os filtros iniciais da tela
           Parâmetros: <não há> 
        */  
        this.setDefaultsParameter = function () {
            
            var indexFilter = 0;
            var indexDocumentClass = 0;
            
            _controller.ttGenericFilter = parameters.ttGenericFilter;
            _controller.ttDocumentClasses = parameters.ttDocumentClasses;
            
            
            // VALORES INICIAIS DA DATA DE TRANSAÇÃO     
            _controller.model.transactionDateRange = {};
            _controller.model.transactionDateRange.start = parameters.dtIni;
            _controller.model.transactionDateRange.end = parameters.dtEnd;            
            
            
            //VALOR DEFAULT DO ESTABELECIMENTO
            _controller.model.site = parameters.site;
            
            
            //VALORES INICIAIS DA MOEDA
            _controller.model.currency = {};
            _controller.ttCurrency = parameters.ttCurrency;
            indexFilter = _controller.mceUtils.findIndexByAttr(_controller.ttGenericFilter, 'name', 'moeda');
            _controller.model.currency = _controller.ttCurrency[_controller.ttGenericFilter[indexFilter].initialValue];
                        
            
            //VALORES INICIAIS DO MEDIO
            _controller.model.medio = {};
            indexFilter = _controller.mceUtils.findIndexByAttr(_controller.ttGenericFilter, 'name', 'medio');
            _controller.model.medio.value = _controller.ttGenericFilter[indexFilter].initialValue;
            
            
            //VALORES INICIAIS DA ESPÉCIE DO DOCUMENTO
            _controller.model.documentClass = {};
            
            //busca o indice da espécie dentro da ttGenericFilter
            indexFilter = _controller.mceUtils.findIndexByAttr(_controller.ttGenericFilter, 'name', 'especie');
            //busca o indice da espécie passada selecionada na ttGenericFilter dentro do array com todas as espécies
            indexDocumentClass = _controller.mceUtils.findIndexByAttr(_controller.ttDocumentClasses, 'esp-docto', _controller.ttGenericFilter[indexFilter].initialValue);
            //seta a espécie inicial 
            _controller.model.documentClass.start = _controller.ttDocumentClasses[indexDocumentClass];
            
            //busca o indice da espécie passada selecionada na ttGenericFilter dentro do array com todas as espécies
            indexDocumentClass = _controller.mceUtils.findIndexByAttr(_controller.ttDocumentClasses, 'esp-docto', _controller.ttGenericFilter[indexFilter].finalValue);
            //seta a espécie final 
            _controller.model.documentClass.end = _controller.ttDocumentClasses[indexDocumentClass];
                                                                          
            // VALORES INICIAIS DA REFERÊNCIA
            _controller.model.referenceRange = {};
            indexFilter = _controller.mceUtils.findIndexByAttr(_controller.ttGenericFilter, 'name', 'reference');
            _controller.model.referenceRange.start = _controller.ttGenericFilter[indexFilter].initialValue;
            _controller.model.referenceRange.end =   _controller.ttGenericFilter[indexFilter].finalValue;
            
            // VALORES INICIAIS DO DEPÓSITO
            _controller.model.warehouseRange = {};
            indexFilter = _controller.mceUtils.findIndexByAttr(_controller.ttGenericFilter, 'name', 'warehouse');
            _controller.model.warehouseRange.start = _controller.ttGenericFilter[indexFilter].initialValue;
            _controller.model.warehouseRange.end   = _controller.ttGenericFilter[indexFilter].finalValue;
            
            // VALORES INICIAIS DO LOTE
            _controller.model.lotRange = {};
            indexFilter = _controller.mceUtils.findIndexByAttr(_controller.ttGenericFilter, 'name', 'lot');
            _controller.model.lotRange.start = _controller.ttGenericFilter[indexFilter].initialValue;
            _controller.model.lotRange.end   = _controller.ttGenericFilter[indexFilter].finalValue;
            
            // VALORES INICIAIS DA LOCALIZAÇÃO
            _controller.model.locationRange = {};
            indexFilter = _controller.mceUtils.findIndexByAttr(_controller.ttGenericFilter, 'name', 'localization');
            _controller.model.locationRange.start = _controller.ttGenericFilter[indexFilter].initialValue;
            _controller.model.locationRange.end   = _controller.ttGenericFilter[indexFilter].finalValue;
            
            // VALORES INICIAIS DA SÉRIE
            _controller.model.serieRange = {};
            indexFilter = _controller.mceUtils.findIndexByAttr(_controller.ttGenericFilter, 'name', 'serie');
            _controller.model.serieRange.start = _controller.ttGenericFilter[indexFilter].initialValue;
            _controller.model.serieRange.end   = _controller.ttGenericFilter[indexFilter].finalValue;
            
            // VALORES INICIAIS DO DOCUMENTO
            _controller.model.documentRange = {};
            indexFilter = _controller.mceUtils.findIndexByAttr(_controller.ttGenericFilter, 'name', 'document');
            _controller.model.documentRange.start = _controller.ttGenericFilter[indexFilter].initialValue;
            _controller.model.documentRange.end   = _controller.ttGenericFilter[indexFilter].finalValue;

            
        }

        /* Função....: isInvalidForm
           Descrição.: valida se a data e estabelecimento estão informados
           Parâmetros: <não há> 
        */  
        this.isInvalidForm = function () {
            var messages = [];
            var warning = '';
            var isInvalidForm = false;

            // Data Saldo Obrigatório
            if (_controller.model.transactionDateRange == undefined ||
                _controller.model.transactionDateRange.start == undefined ||
                _controller.model.transactionDateRange.end == undefined) {

                isInvalidForm = true;

                warning = $rootScope.i18n('l-field') + ": " + $rootScope.i18n('l-transaction-date') + " " + $rootScope.i18n('l-required') + '. ';

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: warning
                });
            }

            if (_controller.model.site == undefined) {

                isInvalidForm = true;

                warning = $rootScope.i18n('l-field') + ": " + $rootScope.i18n('l-site') + " " + $rootScope.i18n('l-required') + '. ';

                $rootScope.$broadcast(TOTVSEvent.showNotification, {
                    type: 'error',
                    title: $rootScope.i18n('l-attention'),
                    detail: warning
                });
            }

            return isInvalidForm;
        }

        /* Função....: parseModelToDisclaimers
           Descrição.: transforma os disclaimers recebidos da tela em filtros da tela
           Parâmetros: <não há> 
        */  
        this.parseModelToDisclaimers = function() {	
			_controller.disclaimers = [];

			for (key in _controller.model) {
				var model = _controller.model[key];
                
                if(model == undefined)
					continue;

				switch(key) {
					case 'transactionDateRange':
						_controller.disclaimers.push(
							this.mceUtils.parseTypeToDisclaimer('date-range', key, model, $scope.i18n('l-transaction-date'), true, '')
						);                    
					break;
					case 'site':
						_controller.disclaimers.push(
							this.mceUtils.parseTypeToDisclaimer('char', key, model, $scope.i18n('l-site'), true, '')
						);
					break;                        
					case 'currency':
						_controller.disclaimers.push(
							this.mceUtils.parseTypeToDisclaimer('select', key, model, $scope.i18n('l-currency'), true, '')
						);
					break;                         
					case 'medio':
                        _controller.disclaimers.push(
							this.mceUtils.parseTypeToDisclaimer('select', key, model, $scope.i18n('l-average'), true, '')
						);
					break;
					case 'referenceRange':
                        if((_controller.model.referenceRange.start != "" && _controller.model.referenceRange.start != undefined) || _controller.model.referenceRange.end != _controller.CONSTANTS.REFERENCE){
                            _controller.disclaimers.push(
                                this.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-reference'), false, '')
                            );
                        }
					break;
					case 'warehouseRange':
                        if((_controller.model.warehouseRange.start != "" && _controller.model.warehouseRange.start != undefined)  || _controller.model.warehouseRange.end != _controller.CONSTANTS.WAREHOUSE){
                            _controller.disclaimers.push(
                                this.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-warehouse'), false, '')
                            );
                        }
					break;
                    case 'lotRange':
                        if((_controller.model.lotRange.start != "" && _controller.model.lotRange.start != undefined) || _controller.model.lotRange.end != _controller.CONSTANTS.LOT){
                            _controller.disclaimers.push(
                                this.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-lot'), false, '')
                            );
                        }
					break;
                    case 'locationRange':
                        if((_controller.model.locationRange.start != "" && _controller.model.locationRange.start != undefined)  || _controller.model.locationRange.end != _controller.CONSTANTS.LOCATION){
                            _controller.disclaimers.push(
                                this.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-localization'), false, '')
                            );
                        }
					break;
                    case 'serieRange':
                        if((_controller.model.serieRange.start != "" && _controller.model.serieRange.start != undefined) || _controller.model.serieRange.end != _controller.CONSTANTS.SERIE){
                            _controller.disclaimers.push(
                                this.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-series'), false, '')
                            );
                        }
					break;
                    case 'documentRange':
                        if((_controller.model.documentRange.start != "" && _controller.model.documentRange.start != undefined) || _controller.model.documentRange.end != _controller.CONSTANTS.DOCUMENT){
                            _controller.disclaimers.push(
                                this.mceUtils.parseTypeToDisclaimer('char-range', key, model, $scope.i18n('l-document'), false, '')
                            );
                        }
					break;
                    case 'documentClass':
                        if(_controller.model.documentClass.start != _controller.ttDocumentClasses[0] ||
                           _controller.model.documentClass.end != _controller.ttDocumentClasses[37]){
                            
                            if (_controller.model.documentClass.start == _controller.model.documentClass.end){
                                
                                var disclaimer = {
                                    property: "documentClass",
                                    title: $rootScope.i18n('l-species') + ': ' 
                                        + _controller.model.documentClass.start.docClassDescription,               
                                    model: { start: _controller.model.documentClass.start.docClassDescription, 
                                               end: _controller.model.documentClass.end.docClassDescription }
                                };
                                
                            } else {                            
                                var disclaimer = {
                                    property: "documentClass",
                                    title: $rootScope.i18n('l-species') + ': ' 
                                        + _controller.model.documentClass.start.docClassDescription + ' ' 
                                        + $rootScope.i18n('l-to') + ' ' 
                                        + _controller.model.documentClass.end.docClassDescription,                                
                                    model: { start: _controller.model.documentClass.start.docClassDescription, 
                                               end: _controller.model.documentClass.end.docClassDescription }
                                };
                            }
                                
                            _controller.disclaimers.push(disclaimer);
                        }
					break;
				}
			};
		}       
       
        
        /* Função....: cancel
           Descrição.: cancela o filtro e fecha a tela. não retorna nenhum disclaimer
           Parâmetros: <não há> 
        */  
        this.cancel = function () {
            $modalInstance.dismiss('cancel'); // fecha modal sem retornar parametros
        }

        /* Função....: init
           Descrição.: chama os métodos que devem ser executados ao abrir a tela
           Parâmetros: <não há> 
        */  
        this.init = function () {            
            _controller.setDefaultsParameter();
        }


        if ($rootScope.currentuserLoaded) {
            this.init();
        }
         
        $scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {  
             $modalInstance.dismiss('cancel');
        });
    };

    index.register.controller('mce.ce0814.advancedsearchcontroller', controllerAdvancedSearch);

});