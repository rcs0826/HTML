define([
    'index',
    'angularAMD',    
    '/dts/mce/js/mce-utils.js',
    '/dts/men/js/zoom/item.js',
    '/dts/mce/js/api/fch/fchmat/fchmatinventorybalanceinquiry-services.js',
    '/dts/mce/html/ce0814/ce0814.advancedsearchcontroller.js',
    '/dts/mce/js/mce-legend-service.js'	
], function (index) {
    ce0814ListController.$inject = [
        '$rootScope',
        '$scope',
        'totvs.app-main-view.Service', 
        'mce.utils.Service', 
        '$stateParams', 
        'mce.zoom.serviceLegend', 
        'mce.fchmatInventoryBalanceInquiryFactory.factory', 
        'mce.ce0814.ModalAdvancedSearch.Service', 
        '$timeout', 
        'TOTVSEvent'
	];

    var selectedCurrency;
    var selectedMedio;

    function ce0814ListController($rootScope, $scope, appViewService, util, $stateParams, legend, fchmatInventoryBalanceInquiryFactory, modalAdvancedSearch, $timeout, TOTVSEvent) {
        // *********************************************************************************
        // *** Variables
        // *********************************************************************************

        this.itemCode = undefined;
        this.site = undefined;
        this.dateIni = new Date();
        this.dateEnd = new Date().getTime();
        this.ttCurrency = [];
        this.listOfMovements = undefined;
        this.disclaimers = [];
        this.hasParameters = false;
        this.mceUtil = util;
        this.legendUtil = legend;
        this.defaultMedio = undefined;
        this.ttGenericFilter = [];
        this.CONSTANTS = {
            REFERENCE: "ZZZZZZZZ",
            WAREHOUSE: "ZZZ",
            LOT: "ZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZZ",
            LOCATION: "ZZZZZZZZZZZZZZZZZZZZ",
            SERIE: "ZZZZZ",
            DOCUMENT: "ZZZZZZZZZZZZZZZZ"
        };

        this.balanceQuantities = {
            initial: 0,
            final: 0
        };

        var ce0814ListController = this;
		
		this.listOfItensCount = 0;
		this.codErro = 0;
		this.Icount = 0;

        /* Função....: search
           Descrição.: busca os dados
           Parâmetros: 
        */
        this.search = function () {
			
			ce0814ListController.listOfItensCount = 0;
			
            var params = {
                pItem: ce0814ListController.itemCode,
                pSite: ce0814ListController.site,
                pDtIni: ce0814ListController.dateIni,
                pDtEnd: ce0814ListController.dateEnd
            };

            fchmatInventoryBalanceInquiryFactory.getItemMovement(params, ce0814ListController.ttGenericFilter, function (result) {

                ce0814ListController.ttItem = result.ttItem[0];
                ce0814ListController.listOfMovements = result.ttInventoryTransaction;
				ce0814ListController.listOfItensCount = result.ttInventoryTransaction.length;

                ce0814ListController.balanceQuantities = {
                    initial: result.initialQuantity,
                    final: result.finalQuantity
                }

                ce0814ListController.formatListOfMovements();

            });
        };
		

		/* Função....: gerarExcel CE0814
		   Descrição.: Gerar Excel e inserir na central de documentos
		   Parâmetros: 
		*/
		this.gerarExcel = function() {	
		
			/*SE EXISTIR INFORMAÇÃO NA GRID*/
			if(ce0814ListController.listOfItensCount > 0){
				
				var params = {
					pItem: ce0814ListController.itemCode,
					pSite: ce0814ListController.site,
					pDtIni: ce0814ListController.dateIni,
					pDtEnd: ce0814ListController.dateEnd,
					pMoeda: ce0814ListController.ttCurrency[indexCurrency].description,
					pMedio: ce0814ListController.legendUtil.averageType.NAME(selectedMedio.toString())
				};			

				fchmatInventoryBalanceInquiryFactory.setGeraExcelCE0814(params, ce0814ListController.ttGenericFilter, function (result) {
					

					/*SE EXISTIR ALGUM ERRO NA  GERAÇÃO DO EXCEL*/
					if(result.ttRetornaErro[0].codErro == 1){
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							detail: $rootScope.i18n('l-msg-erro-export-excel')
						});
					/*SE OCORRER ALGUM ERRO NA CENTRAL DE DOCUMENTOS*/							
					} else if(result.ttRetornaErro[0].codErro == 2){ 
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							detail: result.ttRetornaErro[0].descErro
						});										
					}else if(result.Icount > 0 && result.ttRetornaErro[0].codErro == 3){
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							detail: $rootScope.i18n('l-msg-exec-finaliz-export-excel')
						});						
					}else{
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							detail: $rootScope.i18n('l-msg-erro-export-excel')
						});							
					} 							
				});
				
			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					detail: $rootScope.i18n('l-msg-nenhum-saldo-retornado')
				});				
			}
		}
		

        /* Função....: setDefaultsParameter
           Descrição.: busca os dados iniciais da tela
           Parâmetros: 
        */
        this.setDefaultsParameter = function () {

            // VALORES INICIAIS DA DATA DE TRANSAÇÃO     
            ce0814ListController.dateIni.setDate(ce0814ListController.dateIni.getDate() - 30);

            var params = {
                pType: "create",
                pFieldName: ""
            };

            fchmatInventoryBalanceInquiryFactory.setDefaultsParameter(params, {}, function (result) {

                //VALORES INICIAIS DO MEDIO
                var indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'medio');
                ce0814ListController.ttGenericFilter[indexFilter].initialValue = String(result['i-medio']);
                ce0814ListController.defaultMedio = (result['i-medio']);
                selectedMedio = (result['i-medio']);

                //ARRAY COM TODAS AS MOEDAS
                for (var i = 0; i < result.ttCurrency.length; i++) {
                    var currency = undefined;

                    currency = {
                        value: result.ttCurrency[i]['mo-codigo'],
                        description: result.ttCurrency[i].descricao.substr(4),
                        display: result.ttCurrency[i].descricao
                    };

                    ce0814ListController.ttCurrency.push(currency);
                }

                ce0814ListController.selectedCurrency = result.ttCurrency[0]['mo-codigo'];
                selectedCurrency = result.ttCurrency[0]['mo-codigo'];

                indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'especie');

                ce0814ListController.ttGenericFilter[indexFilter].initialValue = result.ttDocumentClasses[0]['esp-docto'];
                ce0814ListController.ttGenericFilter[indexFilter].finalValue = result.ttDocumentClasses[37]['esp-docto'];

                //ARRAY COM TODAS AS ESPÉCIES DO DOCUMENTO
                ce0814ListController.ttDocumentClasses = result.ttDocumentClasses;

                //VALOR INICIAL DO ESTABELECIMENTO
                ce0814ListController.site = result['c-cod-estabel'];

                if ($stateParams.codEstabel) {
                    ce0814ListController.site = decodeURIComponent($stateParams.codEstabel);
                }

                ce0814ListController.setInitialDisclaimers();

                if (ce0814ListController.hasParameters) {
                    if ($stateParams.itCodigo) {
                        ce0814ListController.itemCode = decodeURIComponent($stateParams.itCodigo);

                        if ($stateParams.codEstabel) {
                            ce0814ListController.site = decodeURIComponent($stateParams.codEstabel);
                        }

                        ce0814ListController.search();
                    }
                }

            });

        }

        /* Função....: setInitialDisclaimers
           Descrição.: cria os disclaimers iniciais
           Parâmetros: 
        */
        this.setInitialDisclaimers = function () {
                //CRIA O DISCLAIMER DE FAIXA DE DATA PADRÃO = 1 MÊS
                ce0814ListController.disclaimers.push({
                    property: 'transactionDateRange',
                    value: ce0814ListController.balanceDate,
                    title: $rootScope.i18n('l-transaction-date') + ': ' +
                        ce0814ListController.mceUtil.formatDate(ce0814ListController.dateIni) + ' ' + $rootScope.i18n('l-to') + ' ' + ce0814ListController.mceUtil.formatDate(ce0814ListController.dateEnd),
                    fixed: true
                });
                //CRIA O DISCLAIMER PADRÃO DE ESTABELECIMENTO (param-estoq.estabel-pad)
                ce0814ListController.disclaimers.push({
                    property: 'site',
                    value: ce0814ListController.balanceReset,
                    title: $rootScope.i18n('l-site') + ': ' +
                        ce0814ListController.site,
                    fixed: true
                });

                //BUSCA A DESCRIÇÃO DA MOEDA PADRÃO
                indexCurrency = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttCurrency, 'value', ce0814ListController.selectedCurrency);

                //CRIA O DISCLAIMER PADRÃO DA MOEDA
                ce0814ListController.disclaimers.push({
                    property: 'currency',
                    value: ce0814ListController.selectedCurrency,
                    title: $rootScope.i18n('l-currency') + ': ' +
                        ce0814ListController.ttCurrency[indexCurrency].description,
                    fixed: true
                });

                //CRIA O DISCLAIMER PADRÃO DO TIPO DE PREÇO MÉDIO
                ce0814ListController.disclaimers.push({
                    property: 'medio',
                    value: selectedMedio,
                    title: $rootScope.i18n('l-average') + ': ' +
                        ce0814ListController.legendUtil.averageType.NAME(selectedMedio.toString()),
                    fixed: true
                });
            }
            /* Função....: openAdvancedSearch
               Descrição.: abre a busca avançada
               Parâmetros: 
            */
        this.openAdvancedSearch = function () {
                modalAdvancedSearch.open({
                    dtIni: ce0814ListController.dateIni,
                    dtEnd: ce0814ListController.dateEnd,
                    ttCurrency: ce0814ListController.ttCurrency,
                    ttDocumentClasses: ce0814ListController.ttDocumentClasses,
                    site: ce0814ListController.site,
                    CONSTANTS: ce0814ListController.CONSTANTS,
                    itemCode: ce0814ListController.itemCode,
                    disclaimers: ce0814ListController.disclaimers,
                    ttGenericFilter: ce0814ListController.ttGenericFilter
                }).then(function (result) {
                    var indexFilter = undefined;

                    ce0814ListController.itemCode = result.parametros.pItem;
                    ce0814ListController.site = result.parametros.pSite;
                    ce0814ListController.dateIni = result.parametros.pDtIni;
                    ce0814ListController.dateEnd = result.parametros.pDtEnd;
                    ce0814ListController.ttGenericFilter = result.parametros.ttGenericFilter;

                    //BUSCA O TIPO DO PREÇO MÉDIO SELECIONADO
                    indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'medio');
                    selectedMedio = ce0814ListController.ttGenericFilter[indexFilter].initialValue;

                    //BUSCA A MOEDA SELECIONADA
                    indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'moeda');
                    var indexCurrency = ce0814ListController.mceUtil.findIndexByAttr(result.disclaimers, 'property', 'currency');

                    ce0814ListController.selectedCurrency = result.disclaimers[indexCurrency].value;
                    selectedCurrency = result.disclaimers[indexCurrency].value;



                    ce0814ListController.search();


                    /*ce0814ListController.gridOptions.api.refreshView();*/

                    ce0814ListController.disclaimers = result.disclaimers;
                });
            }
            /* Função....: createGenericFilter
               Descrição.: prepara os dados do filtro avançado
               Parâmetros: 
            */
        this.createGenericFilter = function () {
            var ttGenericFilter = [];

            ttGenericFilter.push({
                name: 'reference',
                initialValue: "",
                finalValue: ce0814ListController.CONSTANTS.REFERENCE
            });
            ttGenericFilter.push({
                name: 'warehouse',
                initialValue: "",
                finalValue: ce0814ListController.CONSTANTS.WAREHOUSE
            });
            ttGenericFilter.push({
                name: 'lot',
                initialValue: "",
                finalValue: ce0814ListController.CONSTANTS.LOT
            });
            ttGenericFilter.push({
                name: 'localization',
                initialValue: "",
                finalValue: ce0814ListController.CONSTANTS.LOCATION
            });
            ttGenericFilter.push({
                name: 'serie',
                initialValue: "",
                finalValue: ce0814ListController.CONSTANTS.SERIE
            });
            ttGenericFilter.push({
                name: 'document',
                initialValue: "",
                finalValue: ce0814ListController.CONSTANTS.DOCUMENT
            });
            ttGenericFilter.push({
                name: 'especie',
                initialValue: "1",
                finalValue: "38"
            });
            ttGenericFilter.push({
                name: 'medio',
                initialValue: "1",
                finalValue: "1"
            });
            ttGenericFilter.push({
                name: 'moeda',
                initialValue: "0",
                finalValue: "0"
            });

            ce0814ListController.ttGenericFilter = ttGenericFilter;
        }

        /* Função....: removeAllDisclaimers
           Descrição.: Remove um filtro
           Parâmetros: disclaimer
        */
        this.removeAllDisclaimers = function (disclaimer) {
            ce0814ListController.disclaimers = [];
        }


        this.cleanValue = function () {
            ce0814ListController.itemCode = "";
            ce0814ListController.listOfMovements = [];   
			ce0814ListController.listOfItensCount = 0;					
            ce0814ListController.balanceQuantities = {
                initial: 0,
                final: 0
            }
        }

        /* Função....: removerDisclaimer
           Descrição.: Remove um filtro
           Parâmetros: disclaimer
        */
        this.removeDisclaimer = function (disclaimer) {
                var index = ce0814ListController.disclaimers.indexOf(disclaimer);
                if (index != -1) {

                    switch (disclaimer.property) {
                        case 'referenceRange':
                            var indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'reference');
                            ce0814ListController.ttGenericFilter[indexFilter].initialValue = "";
                            ce0814ListController.ttGenericFilter[indexFilter].finalValue = ce0814ListController.CONSTANTS.REFERENCE;
                            break;
                        case 'warehouseRange':
                            var indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'warehouse');
                            ce0814ListController.ttGenericFilter[indexFilter].initialValue = "";
                            ce0814ListController.ttGenericFilter[indexFilter].finalValue = ce0814ListController.CONSTANTS.WAREHOUSE;
                            break;
                        case 'lotRange':
                            var indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'lot');
                            ce0814ListController.ttGenericFilter[indexFilter].initialValue = "";
                            ce0814ListController.ttGenericFilter[indexFilter].finalValue = ce0814ListController.CONSTANTS.LOT;
                            break;
                        case 'locationRange':
                            var indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'localization');
                            ce0814ListController.ttGenericFilter[indexFilter].initialValue = "";
                            ce0814ListController.ttGenericFilter[indexFilter].finalValue = ce0814ListController.CONSTANTS.LOCATION;
                            break;

                        case 'serieRange':
                            var indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'serie');
                            ce0814ListController.ttGenericFilter[indexFilter].initialValue = "";
                            ce0814ListController.ttGenericFilter[indexFilter].finalValue = ce0814ListController.CONSTANTS.SERIE;
                            break;
                        case 'documentRange':
                            var indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'document');
                            ce0814ListController.ttGenericFilter[indexFilter].initialValue = "";
                            ce0814ListController.ttGenericFilter[indexFilter].finalValue = ce0814ListController.CONSTANTS.DOCUMENT;
                            break;
                        case 'documentClass':
                            var indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'especie');
                            ce0814ListController.ttGenericFilter[indexFilter].initialValue = ce0814ListController.ttDocumentClasses[0]['esp-docto'];
                            ce0814ListController.ttGenericFilter[indexFilter].finalValue = ce0814ListController.ttDocumentClasses[37]['esp-docto'];
                            break;
                        case 'medio':
                            var indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'medio');
                            ce0814ListController.ttGenericFilter[indexFilter].initialValue = ce0814ListController.defaultMedio;
                            break;
                        case 'currency':
                            var indexFilter = ce0814ListController.mceUtil.findIndexByAttr(ce0814ListController.ttGenericFilter, 'name', 'currency');
                            ce0814ListController.ttGenericFilter[indexFilter].initialValue = "0";
                            ce0814ListController.ttGenericFilter[indexFilter].finalValue = "0";
                            break;
                    }

                    ce0814ListController.disclaimers.splice(index, 1);

                    ce0814ListController.search();
                }
            }
            /* Função....: formatListOfMovements
               Descrição.: Formata os dados que serão exibidos no grid
               Parâmetros: 
            */
        this.formatListOfMovements = function () {
            angular.forEach(ce0814ListController.listOfMovements, function (movement) {
                movement['dt-trans'] = ce0814ListController.mceUtil.formatDate(movement['dt-trans']);
                movement['quantidade'] = ce0814ListController.mceUtil.formatDecimal(movement['quantidade'], 4);
                movement['materialAmount'] = ce0814ListController.mceUtil.formatDecimal(movement['materialAmount'], 4);
                movement['laborAmount'] = ce0814ListController.mceUtil.formatDecimal(movement['laborAmount'], 4);
                movement['OHAmount'] = ce0814ListController.mceUtil.formatDecimal(movement['OHAmount'], 4);
                movement['esp-docto'] = ce0814ListController.legendUtil.documentClass.NAME(movement['esp-docto']);
            });
        }



        /* Função....: templateTipoMovimento
           Descrição.: Inclui ícone na coluna tipo movimento
           Parâmetros: params
        */
        this.templateTipoMovimento = function (param) {

            var template = "";

            if (!param) return;

            if (param['tipo-trans'] == 1) {
                template = '<label style="color:green">' + $rootScope.i18n('l-document-in') + '</label>';
            } else {
                template = '<label style="color:red"> ' + $rootScope.i18n('l-document-out') + ' </label>';
            }

            return template;

        };

        /* Função....: templateDetalhar
           Descrição.: Inclui link detalhar 
           Parâmetros: params
        */

        this.templateDetalhar = function (value) {
            var template = "";

            if (!value) return;
            var template = '<span> <a href="#/dts/mce/ce0814/detail/' + value['nr-trans'] + '/' + selectedCurrency + '/' + selectedMedio + '">' + $rootScope.i18n('l-to-detail') + '</a></span>';
            return template;
        };

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************

        this.init = function () {

            createTab = appViewService.startView(
                $rootScope.i18n('l-item-inventory-movement'),
                'mce.ce0814.ListController',
                ce0814ListController
            );

            if (createTab === false) {
                if ($stateParams.itCodigo && $stateParams.codEstabel) {

                    ce0814ListController.itemCode = decodeURIComponent($stateParams.itCodigo);
                    ce0814ListController.site = decodeURIComponent($stateParams.codEstabel);

                    ce0814ListController.removeAllDisclaimers();
                    ce0814ListController.createGenericFilter();
                    ce0814ListController.setDefaultsParameter();

                    ce0814ListController.search();

                }
                return;
            }

            //método necessário para o josso funcionar
            fchmatInventoryBalanceInquiryFactory.initializeInterface(function (result) {
                ce0814ListController.createGenericFilter();
                ce0814ListController.hasParameters = true;
                ce0814ListController.setDefaultsParameter();
            });

        }

        if ($rootScope.currentuserLoaded) {
            this.init();
        }

    }

    // SERVICE PESQUISA AVANCADA
    modalAdvancedSearch.$inject = ['$modal'];

    function modalAdvancedSearch($modal) {
        this.open = function (params) {

            var instance = $modal.open({

                templateUrl: '/dts/mce/html/ce0814/ce0814.advancedsearch.html',
                controller: 'mce.ce0814.advancedsearchcontroller as controller',
                backdrop: 'static',
                keyboard: false,
                size: 'md',
                resolve: {
                    parameters: function () {
                        return params;
                    }
                }

            });

            return instance.result;

        }
    }

    index.register.controller('mce.ce0814.ListController', ce0814ListController);
    index.register.service('mce.ce0814.ModalAdvancedSearch.Service', modalAdvancedSearch);

});
