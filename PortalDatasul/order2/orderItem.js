/* global TOTVSEvent, angular*/
define(['index'], function(index) {

	modalItemcontroller.$inject = [
		'mpd.fchdis0063.Factory',
		'mpd.fchdis0064.Factory',
		'$stateParams',
		'modalParams',
		'$modalInstance',
		'$modal',
		'$window',
		'$filter',
		'$timeout',
		'$rootScope',
		'$scope',
		'$http',
		'$q',
		'TOTVSEvent',
		'userPreference',
        'dts-utils.message.Service',
		'mcf.pendingproduct.informConfiguration.modal',
		'customization.generic.Factory'];

	function modalItemcontroller(
		fchdis0063,
		fchdis0064,
		$stateParams,
		modalParams,
		$modalInstance,
		$modal,
		$window,
		$filter,
		$timeout,
        $rootScope,
		$scope,
		$http,
		$q,
		TOTVSEvent,
		userPreference,
        messageUtils,	
		modalInformConfiguration,	
		customService) {
		
		var itemController = this;
		var i18n = $filter('i18n');
		var lastitcodigo = undefined;
		var lastcodrefer = undefined;
		var lastcodreferAux = undefined;
		var typingTimer;
		var doneTypingInterval = 1000;

		this.itemCadastroVisibleFields = [];
						
		itemController.orderController = modalParams.orderController;
										
		itemController.indFatQtfam = [
			{id: 1, desc: i18n('l-order-ind-qt-fam-1')},
			{id: 2, desc: i18n('l-order-ind-qt-fam-2')},
			{id: 3, desc: i18n('l-order-ind-qt-fam-3')}
		];

		itemController.tipoAtend = [{id: 1, desc: i18n('l-order-tipo-atend-1')},
			{id: 2, desc: i18n('l-order-tipo-atend-2')},
			{id: 3, desc: i18n('l-order-tipo-atend-3')}];

		itemController.operation = modalParams.operation;
		itemController.order = modalParams.order;
		itemController.ttParamBonif = modalParams.ttParamBonif;
		itemController.nrPedido = modalParams.order['nr-pedido'];
		itemController.nrSequencia = modalParams['nr-sequencia'];
		itemController.estabelecFilter = null;
		if (modalParams.ttParamBonif == undefined){
			itemController.ttParamBonif = modalParams.orderController.ttParamBonif;			
		}else{
			itemController.ttParamBonif = modalParams.ttParamBonif;
		};	
			
		itemController.itemCadastroVisibleFields = modalParams.itemCadastroVisibleFields;
		itemController.integrationAccountInit = modalParams.orderController.integrationAccountInit;
		itemController.costCenterInit = modalParams.orderController.costCenterInit;
		itemController.cameFromZoom  = false;
		itemController.cameFromInput = false;
		itemController.foundItem = true;
		itemController.nrTabPre = modalParams.order['nr-tabpre'];
		itemController.nrTabPreAux = modalParams.order['nr-tabpre'];
		itemController.nrTabPreFromUserPref;
		itemController.codUn;
		itemController.desUnMedida;
		itemController.enabledUseTabDes = false;
		itemController.isCustomer = itemController.orderController.isCustomer;
		itemController.isRepresentative = itemController.orderController.isRepresentative;
								
		itemController.fields = itemController.itemCadastroVisibleFields;

		// TODO - Utilizar quando for desenvolvido inclusão de itens filhos e inclusão rápida de item
		/*if (itemController.operation == "addchild" ||
			 (itemController.operation == "edit" && modalParams.item['ind-componen'] == 3) ||
			 (itemController.operation == "show" && modalParams.item['ind-componen'] == 3)) {
			itemController.fields = itemController.permissions['ped-item-child'];
		}
		if (itemController.operation == "fastadd") {
			itemController.fields = itemController.permissions['ped-item-fastadd'];
		}*/

		itemController.itemDisabled = modalParams.operation == 'show' || modalParams.situacao == 6;

		itemController.enabledFields = {};

		itemController.getEnabledField = function (fieldName) {
			if (itemController.itemDisabled) return true;
			if (itemController.enabledFields.hasOwnProperty(fieldName))
				return !itemController.enabledFields[fieldName];
			return false;
		}

		itemController.setEnabled = function (ttVisibleFields) {
			for (var i = 0; i < ttVisibleFields.length; i++) {
				itemController.enabledFields[ttVisibleFields[i].fieldName] = ttVisibleFields[i].fieldEnabled;
			}
			itemController.newItemRef = itemController.newItem && itemController.enabledFields['cod-refer'];
		}

		itemController.callEditItemEpc = function(){
			// chamada de ponto de customização
			customService.callCustomEvent ('portalOnEditOrderItem', {controller: itemController});
		}
		
		itemController.customGridDiscount = function(){
			// chamada de ponto de customização
			customService.callCustomEvent ('portalCustomGridDiscount', {controller: itemController});
		}

		itemController.getNewOrderItem = function(nrSequencia){
			fchdis0063.getNewOrderItem({
				nrPedido: itemController.nrPedido,
				sequencia: nrSequencia
			}, {}, function(result) {
				customService.callCustomEvent("getNewOrderItem", {
					controller:itemController,
					result: result
				});

				itemController.item = result.ttOrderItemPortalScreen[0];
				itemController.itemMirror = result.ttOrderItemPortalScreen[0];

				//Controle para item branco
				if(itemController.operation == 'add' || 
				   itemController.operation == 'addchild') {
					itemController.item['it-codigo'] = undefined;
					itemController.valueItemSelected = undefined;					

					// TODO - implementar quando o portal possuir parâmetros de pedido
					/*if (modalParams.ttOrderParameters['log-livre-1'] && lastitcodigo) {
						itemController.item['it-codigo'] = lastitcodigo;
						itemController.valueItemSelected = itemController.item['it-codigo'];
						itemController.leaveItCodigo();
					}*/
					
				}

				refocus();

				itemController.callEditItemEpc();
			});
		}

		itemController.estabAtendFilter = function(){
			fchdis0063.getEstabAtend({nrPedido: itemController.nrPedido, nomeAbrev: " ", itCodigo: itemController.item['it-codigo'] , codRefer: itemController.item['cod-refer']}, function(result) {
				customService.callCustomEvent("getEstabAtend", {
					controller:itemController,
					result: result
				});

				itemController.estabelecFilter = result['estabelec-filter'];
			});
		};

		itemController.cancel = function() {
			 $modalInstance.dismiss('cancel');
		};

		itemController.reloadDiscounts = function() {
			var item = itemController.item;

			fchdis0063.loadOrderItemDiscounts({
				nrPedido: itemController.nrPedido,
				nrSeq: item['nr-sequencia'],
				itemCode: item['it-codigo'],
				itemRef: item['cod-refer']
			},
			[item],
			function(result) {
				customService.callCustomEvent("loadOrderItemDiscounts", {
					controller:itemController,
					result: result
				});

				itemController.itemDiscount = result.ttOrderItemDiscount;
				itemController.applyDiscounts();
			});

		};

		itemController.applyDiscounts = function() {
			var item = itemController.item;
			
			if (itemController.itemDiscount.length == 0){
				item["val-pct-desconto-prazo"] = 0;
				item["val-pct-desconto-periodo"] = 0;
				item["val-desconto"][0] = 0;
				item["val-desconto"][1] = 0;
				item["val-desconto"][2] = 0;
				item["val-desconto"][3] = 0;
				item["val-desconto"][4] = 0;
			} else {
				var itemDiscount = itemController.itemDiscount[0];
				item["val-pct-desconto-prazo"] = itemDiscount["val-pct-desconto-prazo"];
				item["val-pct-desconto-periodo"] = itemDiscount["val-pct-desconto-periodo"];
				item["val-desconto"][0] = itemDiscount["val-desconto"][0];
				item["val-desconto"][1] = itemDiscount["val-desconto"][1];
				item["val-desconto"][2] = itemDiscount["val-desconto"][2];
				item["val-desconto"][3] = itemDiscount["val-desconto"][3];
				item["val-desconto"][4] = itemDiscount["val-desconto"][4];

			}
			
		};

		itemController.applyLeaveEstabAtend = function() {

			var item = itemController.item;

			if (item['estab-atend-item'] != undefined) {

				if(!item['it-codigo'] || item['it-codigo'] == ""){
					item['it-codigo'] = " ";
				}

				fchdis0063.leaveEstabAtend(
					{
						nomeAbrev: item['nome-abrev'],
						nrPedcli: item['nr-pedcli'],
						codEntrega: item['cod-entrega'],
						estabAtendItem: item['estab-atend-item'],
						itCodigo: item['it-codigo']
					}, function(result) {

						customService.callCustomEvent("leaveEstabAtend", {
							controller:itemController,
							result: result
						});

						itemController.item['nat-operacao'] = result['nat-operacao'];
						itemController.item['cod-servico-iss'] = parseInt(result['codigo-servico-iss']);
				});
			}
		};

		itemController.discountGridEdit = function(event) {
            $timeout(function () {
                var inputs = $(event.container).find("input:focus:text");
                if (inputs.length > 0) inputs[0].setSelectionRange(0,999);
            },50);
		}
		
		itemController.up = function(){
            clearTimeout(typingTimer);
            typingTimer = setTimeout(doneTyping, doneTypingInterval);                        
        };
            
        itemController.down = function(){
            clearTimeout(typingTimer);                        
        };
                
        function doneTyping (){
			if(itemController.valueItemSelected != itemController.valueItemSelectedAux)
            	itemController.leaveItCodigoFromInput();
        }
								
		itemController.leaveItCodigoFromInput = function() {
						
			var item = itemController.item;
			
			item['it-codigo'] = itemController.valueItemSelected;
						
			if (item['it-codigo'] == undefined) return;

			itemController.estabAtendFilter();

			if (itemController.operation != 'add' &&
				itemController.operation != 'fastadd'&&
				itemController.operation != 'addchild') return;			

			fchdis0063.leaveItCodigo({
				nrPedido: itemController.nrPedido,
				itemCode: item['it-codigo']				
			},{
				ttOrderParameters: modalParams.ttOrderParameters,
				ttOrderItemPortal: item
			}, function(result) {
				customService.callCustomEvent("leaveItCodigo", {
					controller:itemController,
					result: result
				});

				itemController.item = result.ttOrderItemPortal[0];
				itemController.itemDiscount = result.ttOrderItemDiscount;

				itemController.setEnabled(result.ttVisibleFields);
				itemController.callEditItemEpc();				

				if(itemController.operation == 'add' && lastcodrefer && itemController.newItemRef){

					// TODO - implementar quando o portal possuir parâmetros de pedido
					/*if (modalParams.ttOrderParameters['l-sugerir-refer-ant']) {
						itemController.item['cod-refer'] = lastcodrefer;
					}*/
				} else {
					if(!itemController.newItemRef)						
						itemController.item['cod-refer'] = "";
				}

				if (itemController.item['desc-item'] === "") {                    
					$('#idItCodigo').select();
                    $rootScope.$broadcast(TOTVSEvent.showNotification, [{
						type: 'warning', 
						title: $rootScope.i18n('l-item-not-found'),
						detail: $rootScope.i18n('l-could-not-find-item!') 
					}]);
                } else {											
					itemController.valueItemSelected = itemController.item['it-codigo'] + ' - ' + itemController.item['desc-item'];
					itemController.valueItemSelectedAux = itemController.valueItemSelected;
				}
			});		
		}				

		itemController.leaveItCodigo = function() {
			
			var item = itemController.item;	
			
			if (item['it-codigo'] == undefined) return;

			itemController.estabAtendFilter();
					
			if (itemController.operation != 'add' &&
				itemController.operation != 'fastadd'&&
				itemController.operation != 'addchild') return;			

			fchdis0063.leaveItCodigo({
				nrPedido: itemController.nrPedido,
				itemCode: item['it-codigo']
			},{
				ttOrderParameters: modalParams.ttOrderParameters,
				ttOrderItemPortal: item
			}, function(result) {
				customService.callCustomEvent("leaveItCodigo", {
					controller:itemController,
					result: result
				});

				itemController.item = result.ttOrderItemPortal[0];
				itemController.itemDiscount = result.ttOrderItemDiscount;

				itemController.setEnabled(result.ttVisibleFields);
				itemController.callEditItemEpc();


				if(itemController.operation == 'add' && lastcodrefer && itemController.newItemRef){

					// TODO - implementar quando o portal possuir parâmetros de pedido
					/*if (modalParams.ttOrderParameters['l-sugerir-refer-ant'] && !itemController.cameFromZoom) {
						itemController.item['cod-refer'] = lastcodrefer;
					}*/
				}else{
					if(!itemController.newItemRef)						
						itemController.item['cod-refer'] = "";
				}
				
				if(itemController.item['desc-item'] === ""){                    
					$('#idItCodigo').select();
					itemController.item = angular.copy(itemController.itemMirror);
					itemController.valueItemSelected = "";
					itemController.valueItemSelectedAux = "";
					itemController.foundItem = false;
                }else{						
					itemController.foundItem = true;
					itemController.valueItemSelected = itemController.item['it-codigo'] + ' - ' + itemController.item['desc-item'];
					itemController.valueItemSelectedAux = itemController.valueItemSelected;
				}		
											
				if(itemController.nrTabPre != itemController.item['nr-tabpre']){	
					if(itemController.cameFromZoom){	
						itemController.item['nr-tabpre']     = itemController.nrTabPre;
						itemController.item['cod-un']        = itemController.codUn;
						itemController.item['des-un-medida'] = itemController.desUnMedida;
						itemController.applyLeaveItem('qt-un-fat');					
					}
					if(itemController.cameFromInput){														
						itemController.item['nr-tabpre'] = itemController.nrTabPreAux;
						itemController.applyLeaveItem('qt-un-fat');
					}
				}
				
				if(itemController.cameFromZoom){
					angular.element('input[name="itemcontroller_item[qt-un-fat]"]').select();
				}
				
				if(itemController.cameFromInput){
                    if(itemController.nrTabPreFromUserPref){
                        itemController.item['nr-tabpre'] = itemController.nrTabPreFromUserPref;
                    }
					itemController.applyLeaveItem('qt-un-fat');
					if(itemController.newItemRef){
						$("input[name='itemcontroller_item_cod_refer_input']").focus();
					}
				}
				
			});
			
		}		
							
		itemController.applyLeaveItem = function(field) {
															
			if (itemController.operation == 'show') return;
			
			$timeout(function () {
				var item = itemController.item;

				if (item) {										
					/*
					if(item['cod-refer'] === undefined) {							
						item['cod-refer'] = lastcodrefer;
					}
					*/
					fchdis0063.leaveOrderItem({
							nrPedido: itemController.nrPedido,
							nrSeq: item['nr-sequencia'],
							itemCode: item['it-codigo'],
							itemRef: item['cod-refer'],
							fieldname: field,
							action: itemController.newItem ? 'Add' : 'Update'
						}, {
							ttOrderItemPortalScreen: [item],
							ttOrderParameters: modalParams.ttOrderParameters
						}, function(result) {
							
							customService.callCustomEvent("leaveOrderItem", {
								controller:itemController,
								result: result
							});
							
							itemController.item = result.ttOrderItemPortalScreen[0];

							if (result.ttOrderItemDiscount != 0) {
							    itemController.itemDiscount = result.ttOrderItemDiscount;
							}

							itemController.setEnabled(result.ttVisibleFields);
							
							if(itemController.itemDiscount.length == 0) {
								itemController.applyDiscounts();
							}
					});					
				}
			});						
		};


		itemController.configurado = function(item) {
            messageUtils.question( {
                title: $rootScope.i18n('l-configure-item'),
                text: $rootScope.i18n('l-is-product-configured'),
                cancelLabel: $rootScope.i18n('l-no'),
                confirmLabel: $rootScope.i18n('l-yes'),
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
						modalInformConfiguration.open({itemCotacao: item['it-codigo'],
													descItem: item['desc-item'],
													un: item['cod-un'],
													nrPedido: itemController.nrPedido,
													sequencia: item['nr-sequencia'],
													nomeAbrev: item['nome-abrev']}).then(function(result){
							if (result.nrEstrut) {
								fchdis0063.addOrderItemConfigured({nrEstrut: result.nrEstrut}, item, function(result) {
									if (!result.$hasError) $scope.$emit("salesorder.portal.loadorder","orderItem");
								});
							}
						});                        
                    }
                }
            });
		}

		itemController.applySelectRange = function($event){	
			if($event.target){					
				$event.target.setSelectionRange(0, 999); 	
			}		
		}

		itemController.save = function (fechar) {

			$timeout(function () {
				if ($http.pendingRequests.length === 0) {
					messageUtils.question({
						title: $rootScope.i18n('l-save-item'),
						text: $rootScope.i18n('l-confirm-saving-item'),
						cancelLabel: $rootScope.i18n('l-no'),
						confirmLabel: $rootScope.i18n('l-yes'),
						callback: function (isPositiveResult) {
							if (isPositiveResult) {
								itemController.saveItem(fechar);
							}
						}
					});
				} else {
					itemController.save(fechar);
				}
			}, 100);
							
		}

		itemController.saveItem = function(fechar) {
			
			if (itemController.item.hasOwnProperty('showChildren'))
				delete itemController.item['showChildren'];
			
			var item = itemController.item;

			// bug do canclean
			if (item['nr-tabpre'] == null) item['nr-tabpre'] = '';

			if (itemController.itemDiscount.length > 0){
				if (itemController.itemDiscount[0]['val-desconto'] != undefined){
					if (itemController.itemDiscount[0]['val-desconto'].length > 0){
						for (var i = 0; i < itemController.itemDiscount[0]['val-desconto'].length; i++) {
							if (
								itemController.itemDiscount[0]['val-desconto'][i] == null
								|| itemController.itemDiscount[0]['val-desconto'][i] == undefined
							) {
								itemController.itemDiscount[0]['val-desconto'][i] = 0;
							}
						}
					}
				};
			};

			if (itemController.itemDiscount.length > 0){
				if (itemController.itemDiscount[0]['val-pct-desconto-prazo'] == null) {
					itemController.itemDiscount[0]['val-pct-desconto-prazo'] = 0;
				}

				if (itemController.itemDiscount[0]['val-pct-desconto-periodo'] == null) {
					itemController.itemDiscount[0]['val-pct-desconto-periodo'] = 0
				}
			};

			var action;
			
			if (itemController.newItem) {
				if (itemController.operation == "addchild") {
					action = "AddChild";
				} else {
					action = "Add";
				}				
			} else {
				action = "Update";
			}
			
			fchdis0063.saveOrderItem({
				nrPedido: itemController.nrPedido,
				nrSeq: item['nr-sequencia'],
				itemCode: item['it-codigo'],
				itemRef: item['cod-refer'],
				action: action
			}, {
				ttOrderItemPortalScreen: [item],
				ttOrderParameters: modalParams.ttOrderParameters,
				ttOrderItemAllocation: [],
				ttOrderItemDiscount: itemController.itemDiscount,
				ttOrderDelivery: []
			}, function(result) {


				customService.callCustomEvent("saveOrderItem", {
					controller:itemController,
					result: result
				});

				if (!result.$hasError) {
										
					if (result.ttOrderItemPortalScreen[0]['char-2'].substr(89, 3) == 'yes' &&
						result.ttOrderItemPortalScreen[0]['cod-refer'] == '') {

						itemController.configurado(item);						
					}					
				
					if (fechar || !itemController.newItem) {
						$modalInstance.close('confirm');
					} else {
						// Atualiza o item cadastrado na grade
						//$rootScope.$broadcast("salesorder.portal.loaditemsGrid");	
						
						// TODO - implementar quando o portal possuir parâmetros de pedido
						/*if (modalParams.ttOrderParameters['log-livre-1']) {
							lastitcodigo = item['it-codigo'];
						}
						if (modalParams.ttOrderParameters['l-sugerir-refer-ant']) {
							lastcodrefer = item['cod-refer'];
						}*/

						
						newOrderItem();
					}

					if (itemController.newItem) {
						$rootScope.$broadcast(TOTVSEvent.showNotification,							
							[{ type: 'sucess', 
							   title: $rootScope.i18n('l-it-codigo') + item['it-codigo'] + $rootScope.i18n('l-success-added')
							}]);
					} else {
						$rootScope.$broadcast(TOTVSEvent.showNotification,
							[{ type: 'sucess', 
							   title: $rootScope.i18n('l-it-codigo') + item['it-codigo'] + $rootScope.i18n('l-success-updated') 
							}]);
					}
										
					refocus();												
				}
			});
		};

		itemController.itemStock = function () {

			var ttItemEstoqueDeposito = [];
			var itemdeposito = itemController.orderController.ttItemEstoqueDeposito;

			if (itemdeposito)  {
				if (itemdeposito.hasOwnProperty('size')) {
					for (var i = 0; i < itemdeposito.size; i++) {
						ttItemEstoqueDeposito.push({
							"deposito": itemdeposito.objSelected[i]['cod-depos']
						})
					}
				} else {
					ttItemEstoqueDeposito.push({
						"deposito": itemdeposito['cod-depos']
					})
				}
			}

			fchdis0063.itemstock({
				item: itemController.item['it-codigo'],
				referencia: itemController.item['cod-refer']
			}, {
				ttItemEstoqueDeposito: ttItemEstoqueDeposito,
				ttItemEstoqueParam: itemController.orderController.ttItemEstoqueParam || []
			}, function (data) {

				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/order2/itemSearch.stock.html',
					controller: 'salesorder.itemsearch.stock.Controller as modalStockController',
					size: 'lg',
					resolve: {
						modalParams: function () {
							return {
								ttItemEstoque: data.ttItemEstoque[0],
								ttItemEstoqueParam: data.ttItemEstoqueParam[0],
								ttItemEstoqueDeposito: itemdeposito
							}
						}
					}
				});

				modalInstance.result.then(function (data) {
					itemController.orderController.ttItemEstoqueDeposito = data.ttItemEstoqueDeposito;
					itemController.orderController.ttItemEstoqueParam    = data.ttItemEstoqueParam;
				});
			});
		}


		function newOrderItem() {
			if (itemController.operation == 'add' ||
				itemController.operation == 'fastadd' ||
				itemController.operation == 'addchild') {
				itemController.newItem = true;
				itemController.newItemRef = false;
				if (itemController.operation == 'addchild') {
					itemController.newSequence = false;
					itemController.getNewOrderItem(itemController.nrSequencia);
				} else {
					itemController.newSequence = true;
					itemController.getNewOrderItem();
				}
			} else {
				itemController.newItem = false;
				itemController.newItemRef = false;
				itemController.newSequence = false;
				itemController.item = modalParams.item;
				itemController.callEditItemEpc();
				if (itemController.operation == 'edit') {

					var item = itemController.item;

					fchdis0063.loadOrderItem({
						nrPedido: itemController.nrPedido,
						nrSeq: item['nr-sequencia'],
						itemCode: item['it-codigo'],
						itemRef: item['cod-refer']
					}, function(result) {
						customService.callCustomEvent("loadOrderItem", {
							controller:itemController,
							result: result
						});
						itemController.item = result.ttOrderItemPortalScreen[0];
						itemController.valueItemSelected = itemController.item['it-codigo'] + ' - ' + itemController.item['desc-item'];
						itemController.valueItemSelectedAux = itemController.valueItemSelected;												
						itemController.itemDiscount = result.ttOrderItemDiscount;
						itemController.setEnabled(result.ttVisibleFields);
						itemController.estabAtendFilter();
						refocus();
					});
				}
			}

			fchdis0064.getParametersAux({}, function (data) {
				angular.forEach(data, function(value, key) {
				   if(value["cod-param"] === "funcao-vipal-usa-tab-des") {
					 if (value["val-param"] === "yes") {
						itemController.enabledUseTabDes = true; 
					 }
				   }                          
				});            
			}
			);
		}

		function refocus() {			
			if (itemController.newSequence) {
				angular.element('input[name="itemcontroller_item[nr-sequencia]"]').focus();
			} else if (itemController.newItem) {
				angular.element('input[name="itemcontroller_item[it-codigo]"]').focus();
			} else {
				angular.element('input[name="itemcontroller_item[qt-un-fat]"]').focus();
			}			
			itemController.cameFromZoom  = false;
			itemController.cameFromInput = false;
		}

		newOrderItem();

		$timeout(function () {
			$('input[name="itemcontroller_item_it_codigo_input"]').blur(function () {
    			if (itemController.item['it-codigo'] == undefined) {
					itemController.item['it-codigo'] = '';
					itemController.leaveItCodigo();
				}
			});

		});

		itemController.blurItem = function(){	

			itemController.item['vl-preori-un-fat'] = 0;
			itemController.item['vl-preori']        = 0;
			
			$q.all([userPreference.getPreference('salesorder.portal.NrTabPre'),
                    userPreference.getPreference('salesorder.portal.SoItemTabPrecoPedido')]).then(function(data) {  						
                if(data[1].prefValue != 'true'){
                    itemController.nrTabPreFromUserPref = data[0].prefValue;
                }				
			});			
												
			if(itemController.valueItemSelected == undefined || itemController.valueItemSelected == ''){
				itemController.cameFromInput = true;
				itemController.cameFromZoom  = false;
				itemController.item['it-codigo'] = '';
				itemController.leaveItCodigo();
			}else if(itemController.valueItemSelected != itemController.valueItemSelectedAux){
				itemController.cameFromInput = true;
				itemController.cameFromZoom  = false;
				itemController.item['it-codigo'] = itemController.valueItemSelected;
				itemController.leaveItCodigo();
			}else{					
				if(itemController.operation == 'add' && lastcodrefer && itemController.newItemRef){						
					
					// TODO - implementar quando o portal possuir parâmetros de pedido
					/*if (modalParams.ttOrderParameters['l-sugerir-refer-ant']) {								
						itemController.item['cod-refer'] = lastcodrefer;
					}*/
				}else{					
					if(!itemController.newItemRef)						
						itemController.item['cod-refer'] = "";
				}				
			}
		}

		itemController.cleanItem = function(item) {            
            $('#idItCodigo').select();
			itemController.valueItemSelected = '';
			itemController.item['cod-refer'] = '';
			itemController.item['it-codigo'] = undefined;
			itemController.item['desc-item'] = undefined;
			itemController.leaveItCodigo();				
		}
		 
		itemController.openItemZoom = function() {

            var modalInstance = $modal.open({
                templateUrl: '/dts/mpd/html/order2/orderItem.zoom.html',
                controller: 'salesorder.order2.orderItemZoom.Controller as openItemZoomController',
                size: 'lg',
                resolve: {
                    modalParams: function() {
                        return {
							nrPedido: itemController.nrPedido,
                            orderobj: itemController.orderController
                        }
                    }
                }
            });

            modalInstance.result.then(function(data) {										
                itemController.item['it-codigo'] = data.itemSelected['it-codigo'];
				itemController.item['cod-refer'] = data.itemSelected['cod-refer'];
				itemController.nrTabPre 		 = data.itemSelected['nr-tabpre'];
				itemController.codUn             = data.itemSelected['cod-un'];
				itemController.desUnMedida       = data.itemSelected['des-un-medida'];
				itemController.cameFromZoom 	 = true;
				itemController.cameFromInput     = false;
				if(lastcodreferAux === undefined) lastcodrefer = itemController.item['cod-refer'];
				itemController.leaveItCodigo();
            });
			
        }		
		
	}
	index.register.controller('salesorder.order2.orderItem.Controller', modalItemcontroller);
	 
	/************************* CONTROLLER QUE ABRE O ZOOM ****************************/
	/*********************************************************************************/
	openItemZoomController.$inject = ['modalParams', '$modalInstance', 'userPreference', '$q', '$rootScope', '$modal', '$q', 'userPreference', 'mpd.fchdis0063.Factory', 'customization.generic.Factory', 'TOTVSEvent'];
    function openItemZoomController(modalParams, $modalInstance, userPreference, $q, $rootScope, $modal, $q, userPreference, fchdis0063, customService, TOTVSEvent) {
				
        var openItemZoomController = this;
		openItemZoomController.zoomoptions = {model: {}};
		openItemZoomController.quickSearchText = '';
		openItemZoomController.zoomoptions.model.zoomFilterId = 1;
		openItemZoomController.listResult = [];
		
		openItemZoomController.applySelectRange = function($event){			
			$event.target.setSelectionRange(0, 999); 			
		}
		 
		openItemZoomController.searchParams = {'SoItemCli':false, 
                                         	   'ConsideraFamilia': false, 
                                         	   'ConsideraGrupo': false, 
                                         	   'FamilyBusiness': null,
                                               'GroupStocks': null,
                                         	   'SoItemTabPrecoPedido':true,
                                         	   'NrTabPre': null};

		$q.when($rootScope.currentuser).then(function(result) {

			$q.all([userPreference.getPreference('salesorder.portal.SoItemCli'),
				userPreference.getPreference('salesorder.portal.ConsideraFamilia'),
				userPreference.getPreference('salesorder.portal.ConsideraGrupo'),
				userPreference.getPreference('salesorder.portal.FamilyBusiness'),
				userPreference.getPreference('salesorder.portal.GroupStocks'),
				userPreference.getPreference('salesorder.portal.SoItemTabPrecoPedido'),
				userPreference.getPreference('salesorder.portal.NrTabPre')]).then(function(data) {


                openItemZoomController.searchParams.SoItemCli            = data[0].prefValue == 'true';
                openItemZoomController.searchParams.ConsideraFamilia     = data[1].prefValue == 'true';
                openItemZoomController.searchParams.ConsideraGrupo       = data[2].prefValue == 'true';
                openItemZoomController.searchParams.FamilyBusiness       = data[3].prefValue;
                openItemZoomController.searchParams.GroupStocks          = data[4].prefValue;
                openItemZoomController.searchParams.SoItemTabPrecoPedido = data[5].prefValue == 'true';
                
                if(openItemZoomController.searchParams.SoItemTabPrecoPedido) {
                    openItemZoomController.searchParams.NrTabPre = modalParams.orderobj.order['nr-tabpre'];
                }else{
                    openItemZoomController.searchParams.NrTabPre = data[6].prefValue;
                }
            });
        });									
		
		openItemZoomController.zoomoptions.types = [
			{zoomFilterId: 1, zoomDescType: $rootScope.i18n('l-codigo')},
			{zoomFilterId: 2, zoomDescType: $rootScope.i18n('l-description')},
			{zoomFilterId: 3, zoomDescType: $rootScope.i18n('l-ambos')},
		];

        openItemZoomController.close = function() {
            $modalInstance.dismiss('cancel');
        }

		openItemZoomController.applyInternalFilter = function() {			
            openItemZoomController.listResult = [];
            openItemZoomController.loadMore();
        }
		
		openItemZoomController.loadMore = function() {
			
            var nrTabPre = null;

            if(openItemZoomController.searchParams.SoItemTabPrecoPedido == true){
                nrTabPre = modalParams.orderobj.order['nr-tabpre'];  
            }else{
                nrTabPre = openItemZoomController.searchParams.NrTabPre;
            }
			
            var codEstabel = modalParams.orderobj.order['cod-estabel'];
            var params = angular.extend(
                    {},
                    openItemZoomController.searchParams,
                    {
						nrPedido: modalParams.nrPedido,
						SimpleSearchType: openItemZoomController.zoomoptions.model.zoomFilterId,
                        SearchTerm: "*" + openItemZoomController.quickSearchText + "*",
                        NrTabPre: nrTabPre,
                        CodEstab: codEstabel,
						Start: openItemZoomController.listResult.length,
						searchType: 1,
						shoppingPeriod: 0						
                    }
            );

            fchdis0063.searchproductsfromzoom(
                    params
                    , function(data) {
                        customService.callCustomEvent("searchproductsfromzoom", {
                            controller: openItemZoomController,
                            result: data
                        });

                        openItemZoomController.listResult = openItemZoomController.listResult.concat(data.dsOrderItemSearch);
                        openItemZoomController.hasMore = data.lMore;

                        if (data.dsOrderItemSearch.length == 0) {
                            $rootScope.$broadcast(TOTVSEvent.showNotification, [{
								type: 'warning', 
								title: $rootScope.i18n('l-search-with-results'), 
								detail: $rootScope.i18n('l-search-term')
							}]);
                        }
                    }
            );
        };

		openItemZoomController.relatedItemsGridSave = function(column, value, currentIndex, master, table) {
            var index1 = openItemZoomController.searchItemsGrid.dataSource.indexOf(master);
            openItemZoomController.listResult[index1][table][currentIndex]["qt-un-fat"] = value;
        }

		openItemZoomController.copyQtd = function(dataItem, table, master) {
            dataItem.set('["qt-un-fat"]', master['qt-un-fat']);
            var index1 = openItemZoomController.searchItemsGrid.dataSource.indexOf(master);
            var index2 = dataItem.parent().indexOf(dataItem);
            openItemZoomController.listResult[index1][table][index2]["qt-un-fat"] = master['qt-un-fat'];
        }

		openItemZoomController.copyPriceSelected = function(dataItem, master) {
            
			var index1 = openItemZoomController.searchItemsGrid.dataSource.indexOf(master);

			if(openItemZoomController.listResult[index1]["qt-un-fat"] < dataItem['quant-min']){
				openItemZoomController.listResult[index1]["qt-un-fat"] = dataItem['quant-min'];
				openItemZoomController.listResult[index1]["qt-pedida"] = dataItem['quant-min'];

				master.set('["qt-un-fat"]', dataItem['quant-min']);
				master.set('["qt-pedida"]', dataItem['quant-min']);
			}

			openItemZoomController.listResult[index1]["des-un-medida"] = dataItem['cod-unid-med'];
			openItemZoomController.listResult[index1]["vl-preori"] = dataItem['preco-venda'];

			master.set('["des-un-medida"]', dataItem['cod-unid-med']);
			master.set('["vl-preori"]', dataItem['preco-venda']);

		}
				 				 
		openItemZoomController.consigSearchItens = function() {

            var modalInstance = $modal.open({
                templateUrl: '/dts/mpd/html/order2/orderItem.zoom.params.html',
                controller: 'salesorder.order2.orderItemZoomParam.Controller as searchItemParamZoomController',
                size: 'lg',
                resolve: {
                    modalParams: function() {
                        return {
                            searchParams: openItemZoomController.searchParams,
                            nrTabPrecoPedido: modalParams.orderobj.order['nr-tabpre'] 
                        }
                    }
                }
            });

            modalInstance.result.then(function(data) {
                openItemZoomController.searchParams = data.searchParams;
                openItemZoomController.applyInternalFilter();
            });				                        
            
        }		
		
		openItemZoomController.confirm = function(item){			
			item['nr-tabpre'] = openItemZoomController.searchParams['NrTabPre'];			
			$modalInstance.close({				
				itemSelected: item
			});
		}

    }

    index.register.controller('salesorder.order2.orderItemZoom.Controller', openItemZoomController);

    /************************* CONTROLLER QUE ABRE A TELA DE PARAMETROS ****************************/ 
	/***********************************************************************************************/ 	 
	searchItemParamZoomController.$inject = ['modalParams', '$modalInstance', 'userPreference', '$q', '$rootScope'];
    function searchItemParamZoomController(modalParams, $modalInstance, userPreference, $q, $rootScope) {
		
		var searchItemParamZoomController = this;
								
        searchItemParamZoomController.searchParams     = modalParams.searchParams;        
        searchItemParamZoomController.searchParamsAux  = searchItemParamZoomController.searchParams;
        searchItemParamZoomController.nrTabPrecoPedido = modalParams.nrTabPrecoPedido;                        
				
        if(searchItemParamZoomController.searchParams.SoItemTabPrecoPedido == true && searchItemParamZoomController.searchParams.NrTabPre == null){
            searchItemParamZoomController.searchParams.NrTabPre = searchItemParamZoomController.nrTabPrecoPedido;
        }

        searchItemParamZoomController.close = function() {
            $modalInstance.close({
                searchParams: searchItemParamZoomController.searchParams
            });
        }
        
        searchItemParamZoomController.cancel = function() {  										
			$q.all([userPreference.getPreference('salesorder.portal.SoItemCli'),
				userPreference.getPreference('salesorder.portal.ConsideraFamilia'),
				userPreference.getPreference('salesorder.portal.ConsideraGrupo'),
				userPreference.getPreference('salesorder.portal.FamilyBusiness'),
				userPreference.getPreference('salesorder.portal.GroupStocks'),
				userPreference.getPreference('salesorder.portal.SoItemTabPrecoPedido'),
				userPreference.getPreference('salesorder.portal.NrTabPre')]).then(function(data) {


                searchItemParamZoomController.searchParams.SoItemCli            = data[0].prefValue == 'true';
                searchItemParamZoomController.searchParams.ConsideraFamilia     = data[1].prefValue == 'true';
                searchItemParamZoomController.searchParams.ConsideraGrupo       = data[2].prefValue == 'true';
                searchItemParamZoomController.searchParams.FamilyBusiness       = data[3].prefValue;
                searchItemParamZoomController.searchParams.GroupStocks          = data[4].prefValue;
                searchItemParamZoomController.searchParams.SoItemTabPrecoPedido = data[5].prefValue == 'true';
                searchItemParamZoomController.searchParams.NrTabPre             = data[6].prefValue;
            });                                                                                    
			$modalInstance.dismiss('cancel');                            			
        }

        searchItemParamZoomController.confirm = function() {
			$q.all([userPreference.setPreference('salesorder.portal.SoItemCli', searchItemParamZoomController.searchParams.SoItemCli),
                userPreference.setPreference('salesorder.portal.ConsideraFamilia', searchItemParamZoomController.searchParams.ConsideraFamilia),
                userPreference.setPreference('salesorder.portal.ConsideraGrupo', searchItemParamZoomController.searchParams.ConsideraGrupo),
                userPreference.setPreference('salesorder.portal.FamilyBusiness', searchItemParamZoomController.searchParams.FamilyBusiness),
                userPreference.setPreference('salesorder.portal.GroupStocks', searchItemParamZoomController.searchParams.GroupStocks),
                userPreference.setPreference('salesorder.portal.SoItemTabPrecoPedido', searchItemParamZoomController.searchParams.SoItemTabPrecoPedido),
                userPreference.setPreference('salesorder.portal.NrTabPre', searchItemParamZoomController.searchParams.NrTabPre)]).then(function() {
                $modalInstance.close({
                    searchParams: searchItemParamZoomController.searchParams
                });
            });
        };
        
        searchItemParamZoomController.changeOnlyOrderPriceTable = function(){
            if(searchItemParamZoomController.searchParams.SoItemTabPrecoPedido == true){
                searchItemParamZoomController.searchParams.NrTabPre = searchItemParamZoomController.nrTabPrecoPedido; 
            }
        }
    }
    index.register.controller('salesorder.order2.orderItemZoomParam.Controller', searchItemParamZoomController);    
});
