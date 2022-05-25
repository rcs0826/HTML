define([
    'index',
    'angularAMD',
    '/dts/mce/js/mce-utils.js',
    '/dts/men/js/zoom/item.js',
    '/dts/mce/js/api/fch/fchmat/fchmatinventorybalanceinquiry-services.js',
    '/dts/mce/html/ce0830/ce0830.AdvancedSearchController.js'	
], function (index) {

    ce0830ListController.$inject = [
		'$rootScope', '$scope', '$stateParams', 'totvs.app-main-view.Service', 'mce.utils.Service', 'mce.fchmatInventoryBalanceInquiryFactory.factory', 'mce.ce0830.ModalAdvancedSearch.Service', 'TOTVSEvent', '$filter'
	];

    function ce0830ListController($rootScope, $scope, $stateParams, appViewService, util, fchmatInventoryBalanceInquiryFactory, modalAdvancedSearch, TOTVSEvent, $filter) {

        // *********************************************************************************
        // *** Variables
        // *********************************************************************************
               
        this.listOfItensCount = 0;
        this.listOfItens = undefined;
        this.disclaimers = [];
        this.mceUtil = util;
        this.itemCode = undefined;
        this.site = undefined;
        this.balanceDate = new Date().getTime();
        this.balanceReset = false; /*saldo zerado*/
        this.model = [];
        this.ttTotalInventoryBalance = undefined;
        this.totalQuantity = 0;
        this.totalQtyAvail = 0;
        this.situation = undefined;
        this.itemInformation = undefined;
        this.warehouse = undefined;
        this.location = undefined;
        this.lot = undefined;
        this.showAlert = false;
        this.showItemInformation = false;
		this.codErro = 0;
		
        var ce0830ListControl = this;
        var isDashboardSource = false;


        // *********************************************************************************
        // *** Functions
        // *********************************************************************************
        /* Função....: search
           Descrição.: Busca o saldo do item
           Parâmetros: 
        */
        this.search = function () {

            ce0830ListControl.listOfItens = {};
            ce0830ListControl.listOfItensCount = 0;
			ce0830ListControl.totalQtyAvail = 0;
			ce0830ListControl.totalQuantity = 0;

            var params = {
                pItem: ce0830ListControl.itemCode,
                pDtBalance: ce0830ListControl.balanceDate,
                pSite: ce0830ListControl.site,
                pWarehouse: ce0830ListControl.warehouse,
                pLocaliz: ce0830ListControl.location,
                pLote: ce0830ListControl.lot,
                pBalanceReset: ce0830ListControl.balanceReset
            };

            fchmatInventoryBalanceInquiryFactory.getMergeInventoryItemBalance(params, {}, function (result) {

                ce0830ListControl.ttItem = result.ttItem[0];
                ce0830ListControl.ttTotalInventoryBalance = result.ttTotalInventoryBalance[0];
                ce0830ListControl.listOfItens = result.ttInventoryBalance;
                ce0830ListControl.listOfItensCount = result.ttInventoryBalance.length;	
				ce0830ListControl.totalQtyAvail = result.ttTotalInventoryBalance[0].totalQtyAvail;		
				ce0830ListControl.totalQuantity = result.ttTotalInventoryBalance[0].quantidade;		
				ce0830ListControl.totalQtyAvail = ce0830ListControl.mceUtil.formatDecimal(ce0830ListControl.totalQtyAvail, 4);
				ce0830ListControl.totalQuantity = ce0830ListControl.mceUtil.formatDecimal(ce0830ListControl.totalQuantity, 4);				
				
                for (var index = 0; index < ce0830ListControl.listOfItens.length; index++) {
                    var element = ce0830ListControl.listOfItens[index];
                    // problema com caracter barra no codigo da tabela de preço
                    // tem que codificar 2 vezes, porque o browser decodifica automaricamente na URL;
                    element['it-codigo'] = encodeURIComponent(encodeURIComponent(element['it-codigo']));
                    element['cod-estabel'] = encodeURIComponent(encodeURIComponent(element['cod-estabel']));
                }

            });

        };
		
		/* Função....: gerarExcel
		   Descrição.: Gerar Excel e inserir na central de documentos
		   Parâmetros: 
		*/
		this.gerarExcel = function() {	
		
			/*SE EXISTIR INFORMAÇÃO NA GRID*/
			if(ce0830ListControl.listOfItensCount > 0){
				
				var params = {
					pItem: ce0830ListControl.itemCode,
					pDtBalance: ce0830ListControl.balanceDate,
					pSite: ce0830ListControl.site,
					pWarehouse: ce0830ListControl.warehouse,
					pLocaliz: ce0830ListControl.location,
					pLote: ce0830ListControl.lot,
					pBalanceReset: ce0830ListControl.balanceReset
				};			

				fchmatInventoryBalanceInquiryFactory.setGeraExcel(params, {}, function (result) {
					

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
					}else if(result.ttTotalInventoryBalance.length > 0 && result.ttRetornaErro[0].codErro == 3){
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

        /* Função....: cleanValue
           Descrição.: limpar campos de pesquisa e inicializr objetos
           Parâmetros: 
        */

        this.cleanValue = function () {
            ce0830ListControl.itemCode = "";
            ce0830ListControl.ttItem = [];
            ce0830ListControl.ttTotalInventoryBalance = [];
            ce0830ListControl.listOfItens = [];
            ce0830ListControl.listOfItensCount = 0;
			ce0830ListControl.totalQuantity = 0;
			ce0830ListControl.totalQtyAvail = 0;
        }

        /* Função....: setInitialDisclaimers
           Descrição.: Cria os disclaimers iniciais da tela
           Parâmetros: 
        */
        this.setInitialDisclaimers = function () { 
		
            ce0830ListControl.disclaimers.push({
                property: 'balanceDate',
                value: ce0830ListControl.balanceDate,
                title: $rootScope.i18n('l-balance-date') + ': ' +
                    ce0830ListControl.mceUtil.formatDate(ce0830ListControl.balanceDate),
                fixed: true
            });

            ce0830ListControl.disclaimers.push({
                property: 'noBalance',
                value: ce0830ListControl.balanceReset,
                title: $rootScope.i18n('l-no-balance') + ': ' +
                    ce0830ListControl.mceUtil.formatBoolean(ce0830ListControl.balanceReset),
                fixed: true
            });

        };

        /* Função....: removerDisclaimer
           Descrição.: Remove um filtro
           Parâmetros: disclaimer
        */
        this.removeDisclaimer = function (disclaimer) {
            var index = ce0830ListControl.disclaimers.indexOf(disclaimer);
            if (index != -1) {

                switch (disclaimer.property) {
                    case 'site':
                        ce0830ListControl.site = undefined;
                        break;
                    case 'warehouse':
                        ce0830ListControl.warehouse = undefined;
                        break;
                    case 'location':
                        ce0830ListControl.location = undefined;
                        break;
                    case 'lot':
                        ce0830ListControl.lot = undefined;
                        break;
                }

                ce0830ListControl.disclaimers.splice(index, 1);
                ce0830ListControl.search();
            }
        };



        this.templateMovimento = function (value) {
            var link = '<span> <a href="#/dts/mce/ce0814/' + value['it-codigo'] + '/' + value['cod-estabel'] + '">' +
                $rootScope.i18n('l-to-detail') + '</a></span>';
            return link;
        };

        this.templateNumber = function (dataItem, campo) {
            if (!dataItem['campo'])
                return 0;
            var val = ce0830ListControl.mceUtil.formatDecimal(dataItem['campo'], 4);
            return val;
        };

        /*######################################### Watch ##########################################*/

        /* Função....: openAdvancedSearch
           Descrição.: abre a busca avançada
           Parâmetros: 
        */
        this.openAdvancedSearch = function () {
            modalAdvancedSearch.open({
                itemCode: ce0830ListControl.itemCode,
                balanceDate: ce0830ListControl.balanceDate,
                disclaimers: ce0830ListControl.disclaimers
            }).then(function (result) {

                ce0830ListControl.itemCode = result.parametros.pItem;
                ce0830ListControl.balanceDate = result.parametros.pbalanceDate;
                ce0830ListControl.site = result.parametros.pSite;
                ce0830ListControl.warehouse = result.parametros.pWarehouse;
                ce0830ListControl.location = result.parametros.pLocation;
                ce0830ListControl.lot = result.parametros.pLote;
                ce0830ListControl.balanceReset = result.parametros.pBalanceReset;

                if (ce0830ListControl.itemCode != undefined) {
                    ce0830ListControl.search();
                }

                ce0830ListControl.disclaimers = result.disclaimers;
            });
        }

        // *********************************************************************************
        // *** Control Initialize
        // *********************************************************************************
        this.init = function () {
                                                                     
            createTab = appViewService.startView(
                $rootScope.i18n('l-item-balance'),
                'mce.ce0830.ListController',
                ce0830ListControl
            );

            isDashboardSource = $stateParams.site && $stateParams.itemCode && $stateParams.warehouse;

            if (createTab === false && !isDashboardSource) {
                return;
            }

            if (isDashboardSource){
                ce0830ListControl.disclaimers = [];
            }

            //método necessário para o josso funcionar
            fchmatInventoryBalanceInquiryFactory.initializeInterface(function (result) {
                ce0830ListControl.setInitialDisclaimers();
            });
            
            if (isDashboardSource) {
                ce0830ListControl.site = decodeURIComponent($stateParams.site);
                ce0830ListControl.itemCode = decodeURIComponent($stateParams.itemCode);
                ce0830ListControl.warehouse = decodeURIComponent($stateParams.warehouse);             

                if (ce0830ListControl.itemCode != undefined) {
                    setTimeout(function(){                         
                        ce0830ListControl.search();

                        ce0830ListControl.removeDisclaimer
                        
                        ce0830ListControl.disclaimers.push({
                            property: 'site',
                            value: ce0830ListControl.site,
                            title: $rootScope.i18n('l-site') + ': ' + ce0830ListControl.site,
                            fixed: false
                        });

                        ce0830ListControl.disclaimers.push({
                            property: 'itemCode',
                            value: ce0830ListControl.itemCode,
                            title: $rootScope.i18n('l-item') + ': ' + ce0830ListControl.itemCode,
                            fixed: false
                        });
                                               
                        ce0830ListControl.disclaimers.push({
                            property: 'warehouse',
                            value: ce0830ListControl.warehouse,
                            title: $rootScope.i18n('l-warehouse') + ': ' + ce0830ListControl.warehouse,
                            fixed: false
                        });    

                    }, 1000);                    
                }
                
            }

        }

        if ($rootScope.currentuserLoaded) {
            this.init();
        }

        // *********************************************************************************
        // *** Events Listners
        // *********************************************************************************

        $scope.$on('$destroy', function () {
            ce0830ListControl = undefined;
        });

        $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
            ce0830ListControl.init();
        });
    }

    // SERVICE PESQUISA AVANCADA
    modalAdvancedSearch.$inject = ['$modal'];

    function modalAdvancedSearch($modal) {
        this.open = function (params) {

            var instance = $modal.open({

                templateUrl: '/dts/mce/html/ce0830/ce0830.advancedsearch.html',
                controller: 'mce.ce0830.AdvancedSearchController as controller',
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

    index.register.controller('mce.ce0830.ListController', ce0830ListController);
    index.register.service('mce.ce0830.ModalAdvancedSearch.Service', modalAdvancedSearch);

});
