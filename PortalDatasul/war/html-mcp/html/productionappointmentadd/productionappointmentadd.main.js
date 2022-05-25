define(['index'], function (index) {

	/**
	 * Controller List
	 */
	productionappointmentaddMainCtrl.$inject = [
		'$rootScope',
		'$scope',
		'$modal',
		'$filter',
		'$window',
		'totvs.app-main-view.Service',
		'fchman.fchmanproductionappointment.Factory',
		'TOTVSEvent',
		'totvs.app-notification.Service',
		'$stateParams',
		'$location'
	];

	function productionappointmentaddMainCtrl(
		$rootScope,
		$scope,
		$modal,
		$filter,
		$window,
		appViewService,
		fchmanproductionappointmentFactory,
		TOTVSEvent,
		appNotificationService,
		$stateParams,
		$location) {

		/**
		 * Variável Controller
		 */
		var controller = this;
		/**
		 * Variáveis
		 */

		controller.titleText = "";
		controller.aptoText = "";

		this.listResult = [];       // array que mantem a lista de registros
		this.totalRecords = 0;      // atributo que mantem a contagem de registros da pesquisa
		this.disclaimers = [];      // array que mantem a lista de filtros aplicados
		this.ptrProd = 0;
		var quickSearchText = "";   // atributo que contem o valor da pesquisa rápida
		var createTab;
		var previousView;
		var today = new Date();
		var ordemParam;
		var ordem;
		var opSfc;
		var splitCode;
		var machineCode;
		var filter = "";
		var appointmentType;

		controller.isPcp = false;
		controller.isSfc = false;
		controller.showDepLoc = false;
		controller.showLotValid = false;
		controller.showlotDueDate = true;
		controller.disableLoteValid = false;
		controller.showPerPpm = false;
		controller.disablePerPpm = false;
		controller.disableLocation = false;
		controller.disabledQtdProd = false;

		controller.ttRepSfc = {};
		controller.ttRepProd = {};
		
		
		this.ttAppointmentParam = {
			prodOrderCodeIni: 0,
			prodOrderCodeFin: 999999999
		};
		
		controller.ttReporte = {
			ordem: 0,
			itemCode: "",
			itemRefer: "",
			warehouseCode: "",
			locationCode: "",
			lotCode: "",
			lotDueDate: today,
			perPpm: 0,
			outFlowWarehouseCode: "",
			outFlowlocationCode: "",
			reportDate: today,
			datIniReporte: today,
			datFinReporte: today,
			reportIniTime: today.getTime(),
			reportFinTime: today.getTime(),
			qtdProd: 0,
			qtdScrap: 0
		}

		controller.ttRef = [];

		controller.ttParamApontSfc = {};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			createTab = appViewService.startView($rootScope.i18n('l-production-appointment'), 'mcp.productionappointmentadd.MainCtrl', controller);
			previousView = appViewService.previousView;

			if (previousView.controller) {
                
			}
			ordemParam = $stateParams.ordemParam;
			
			controller.showDepLoc = false;
			controller.showLotValid = false;

			controller.ttReporte = {};
			controller.loadData();
		}

		// *************************************************************************************
		// *** Functions
		// *************************************************************************************

		/**
		 * Método de leitura dos dados
		 */
		this.loadData = function () {

			this.ordem = $stateParams.ordemParam;
			this.opSfc = $stateParams.opSfc;
			this.splitCode = $stateParams.splitCode;
			this.machineCode = $stateParams.ctrab;

			if(this.machineCode == undefined){
				this.machineCode = "";
			}
			
			if(this.opSfc != undefined && this.splitCode != undefined){

				controller.titleText = $rootScope.i18n('l-sfc-appointment');
				controller.aptoText = $rootScope.i18n('l-quantity-aprov');

				controller.isSfc = true;
				controller.isPcp = false;

				controller.ttParamApontSfc = {
					nrOrdProdu: this.ordem,
					numOperacSfc: this.opSfc,
					numSplitOperac: this.splitCode,
					codCtrab: this.machineCode,
					baixaReservas: 1,
					informaDeposito: true,
					informaLocalizacao: false,
					requisicaoAutomatica: false,
					buscaSaldos: false,
					sugereRequis: false,
					lRefPadrao: true,
					lAlocaPadrao: true,
					lReservasPadrao: true,
					lMatRecicladoPadrao: true,
					lMobGgfPadrao: true
				}

				fchmanproductionappointmentFactory.carregaDadosApontSfc(controller.ttParamApontSfc,function(result){
					if(result){
						controller.ttReporte = {
							ordem: controller.ttParamApontSfc.nrOrdProdu,
							itemCode: result.ttRepSfc[0].codItemOp,
							itemRefer: result.ttRepSfc[0].referAcab,
							warehouseCode: result.ttRepSfc[0].depAcab,
							locationCode: result.ttRepSfc[0].locAcab,
							perPpm: result.ttRepSfc[0].perPpm,
							outFlowWarehouseCode: "",
							outFlowlocationCode: "",
							datIniReporte: controller.formatDateChar(result.ttRepSfc[0].datInicReporte),
							datFinReporte: controller.formatDateChar(result.ttRepSfc[0].datFimReporte),
							reportIniTime: result.ttRepSfc[0].hraInicRep,
							reportFinTime: result.ttRepSfc[0].hraFimRep,
							qtdProd: 0,
							qtdScrap: result.ttRepSfc[0].qtdRefgda
						}
						controller.ttRepSfc = result.ttRepSfc[0];
						controller.showDepLoc = result.ttRepSfc[0].logOperacFinal;
						controller.showPerPpm = (result.ttRepSfc[0].logPerPpmHidden == false);
						controller.disablePerPpm = (result.ttRepSfc[0].logPerPpmEnable == false);
						controller.ptrProd = formatNumber(result.ttRepSfc[0].ptrProd,1);

						if(result.ttRepSfc[0].tipoConEst == 2){
							controller.ttReporte.qtdProd = 1;
							controller.disabledQtdProd = true;
						}else{
							controller.ttReporte.qtdProd = result.ttRepSfc[0].qtdAprov;
							controller.disabledQtdProd = false;
						}

						if (result.ttRepSfc[0].logLoteEnabled == true && controller.showDepLoc == true){
							controller.showLotValid = !result.ttRepSfc[0].logLoteHidden;
							controller.disableLoteValid = !result.ttRepSfc[0].logLoteEnable;
							controller.ttReporte.lotCode = result.ttRepSfc[0].loteAcab;
							controller.ttReporte.lotDueDate = controller.formatDateChar(result.ttRepSfc[0].dtValidLote);
						}
					}
				});

			}else{
				controller.titleText = $rootScope.i18n('l-production-appointment');
				controller.aptoText = $rootScope.i18n('l-quantity-produced');

				controller.isPcp = true;
				controller.isSfc = false;
				controller.ttReporte.ordem = this.ordem;
				controller.showDepLoc = true;
				controller.showLotValid = true;

				fchmanproductionappointmentFactory.carregaDadosApontPcp(this.ordem,function(result){
					if(result){
						controller.ttReporte.itemCode = result[0].itemCode;
						controller.ttReporte.itemRefer = result[0].itemRefer;
						controller.ttReporte.warehouseCode = result[0].warehouseCode;
						controller.ttReporte.locationCode = result[0].locationCode;
						controller.ttReporte.lotCode = result[0].lotCode;
						controller.ttReporte.lotDueDate = controller.formatDateChar(result[0].lotDueDate);
						controller.ttReporte.perPpm = result[0].perPpm;
						
						if(result[0].tipoConEst == 1){
							controller.showLotValid = false;
							controller.ttReporte.qtdProd = result[0].qtdProd;
						}else if(result[0].tipoConEst == 2){
							controller.ttReporte.qtdProd = 1;
							controller.showlotDueDate = false;
							controller.disabledQtdProd = true;
						}else{
							controller.ttReporte.qtdProd = result[0].qtdProd;
							controller.disabledQtdProd = false;
						}

						if(result[0].tipoFormula == 1 || result[0].tipoFormula == 4){
							controller.showPerPpm = false;
						}else{
							controller.showPerPpm = true;
						}

						controller.ttReporte.qtdScrap = result[0].qtdScrap;
						controller.ptrProd = result[0].ptrProd;
						controller.ttReporte.documentCode = result[0].documentCode;
						controller.ttReporte.un = result[0].un;
						
						controller.disableLocation = !result[0].locationCodeEnabled;

						if(result[0].reportDateTime != null){
							controller.ttReporte.reportDate = controller.formatDateChar(result[0].reportDateTime);
						}else{
							controller.ttReporte.reportDate = controller.formatDateChar(today);
						}

						controller.ttRepProd = result;
					}
				});
			}
		}
		
		/* Método formato decimal*/
		function formatNumber(num, decimals) {
			return num.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits:decimals});
		}

		this.formatDate = function (data) {

			myDate = new Date(data);
			if (data != null && data.length == null) {
				dia = myDate.getDate();
				mes = myDate.getMonth() + 1;
				ano = myDate.getFullYear();

				var myNumber = 7;
				var formattedDia = ("0" + dia).slice(-2);
				var formattedMes = ("0" + mes).slice(-2);
				

				return formattedDia + '/' + formattedMes + '/' + ano;
			} else {
				return data;
			}
		}		
		
		this.formatDateChar = function (data) {
			if (data != null) {
				dia = data.slice(0,2);
				mes = data.slice(2,4);
				ano = data.slice(4,8);
				return dia + '/' + mes + '/' + ano;
			} else return "";
		}

		/**
		 * Método de apontamento dos dados
		 */
		controller.save = function () {

			if(controller.isPcp){
				
				/*if(controller.ttReporte.qtdScrap > 0){
					controller.criattWasteReason();
				}*/

				controller.ttRepProd = {
					prodOrderCode: controller.ttReporte.ordem,
					outflowWarehouseCode: controller.ttRepProd.outflowWarehouseCode,
					outflowLocationCode: controller.ttRepProd.outflowLocationCode,
					reportDateTime: this.formatDate(controller.ttReporte.reportDate),
					un: controller.ttReporte.un, // buscar do item
					qtdProd: controller.ttReporte.qtdProd,
					qtdScrap: controller.ttReporte.qtdScrap,
					itemCode: controller.ttReporte.itemCode,
					approvedQuantity: 0, // Não usado
					documentCode: controller.ttReporte.documentCode, // não usado
					documentSeries: "", // não usado
					warehouseCode: controller.ttReporte.warehouseCode,
					lotCode: controller.ttReporte.lotCode,
					itemRefer: controller.ttReporte.itemRefer,
					closeOrder: false, // informar campo em tela
					closeOperation: false, // informar campo em tela
					lotDueDate: this.formatDate(controller.ttReporte.lotDueDate), //today
					locationCode: controller.ttReporte.locationCode
				}


				parameters = {
					ttRepProd: this.ttRepProd,
					ttWasteReason: controller.ttWasteReason
				}

				fchmanproductionappointmentFactory.aptoPcp(parameters, function(result){
					if(result.length > 0) {
						angular.forEach(result,function(resultErrors){
							if(resultErrors){
								var alert = {
									type: 'error',
									title: $rootScope.i18n('l-error') + ": " + resultErrors.errorNumber,
									size: 'md',  //opicional
									detail: resultErrors.errorDescription
								};
								appNotificationService.notify(alert);
							}
						});
					}else{
						fchmanproductionappointmentFactory.ptrProd(controller.ttRepProd.prodOrderCode, function(result){
							if(result){
								controller.ptrProd = result.ptrProd;
							}
						});

						var alert = {
							type: 'success',
							title: "Sucesso",
							size: 'md',  //opicional
							detail: "Apontamento realizado com Sucesso"
						};
						appNotificationService.notify(alert);
						
						$location.path("dts/mcp/productionappointment");
					}
				});
				
			} else {
				if (controller.ttReporte.qtdScrap > 0) {
					
					controller.ttRef = [];

					var modalInstance = $modal.open({
						templateUrl: '/dts/mcp/html/productionappointmentadd/productionappointment.scrap.reasons.html',
						controller: 'mcp.productionappointmentadd.ScrapResonsCtrl as controller',
						size: 'lg',
						resolve: {
							model: function () {
								//passa o objeto com os dados da pesquisa avançada para o modal
								return controller.ttRef;
							}
						}
					});
					
					// quando o usuario clicar em apontar
					modalInstance.result.then(function () {
						controller.processSFC();
					});
				} else {
					controller.ttRef = {};
					controller.processSFC();
				}
			}
		}

		controller.processSFC = function () {		
			controller.ttAloca = {};
			controller.ttReservas = {};
			controller.ttMatReciclado = {};
			controller.ttApontMob = {};
			
			/*
			this.ttRepSfc = {
				codCtrab:        	controller.ttRepSfc.codCtrab,          
				codFerrProd:        controller.ttRepSfc.codFerrProd,       
				codItemOp:          controller.ttRepSfc.codItemOp,         
				codUnidNegoc:       controller.ttRepSfc.codUnidNegoc,      
				datFimSetup:        controller.ttRepSfc.datFimSetup,       
				datInicSetup:       controller.ttRepSfc.datInicSetup,      
				desCtrab:           controller.ttRepSfc.desCtrab,          
				desFerram:          controller.ttRepSfc.desFerram,         
				desOper:            controller.ttRepSfc.desOper,           
				desUnidNegoc:       controller.ttRepSfc.desUnidNegoc,      
				hraFimSetup:        controller.ttRepSfc.hraFimSetup,       
				hraInicSetup:       controller.ttRepSfc.hraInicSetup,      
				nrOrdProdu:         controller.ttRepSfc.nrOrdProdu,        
				numContadorFim:     controller.ttRepSfc.numContadorFim,    
				numContadorInic:    controller.ttRepSfc.numContadorInic,   
				numSplitOperac:     controller.ttRepSfc.numSplitOperac,    
				operacao:           controller.ttRepSfc.operacao,          
				codMob:             controller.ttRepSfc.codMob,            
				datFimReporte:      controller.ttReporte.datFinReporte,     
				datInicReporte:     controller.ttReporte.datIniReporte,    
				deRelacRefugoItem:  controller.ttRepSfc.deRelacRefugoItem, 
				deTempoOper:        controller.ttRepSfc.deTempoOper,       
				desEquipe:          controller.ttRepSfc.desEquipe,         
				desMob:             controller.ttRepSfc.desMob,            
				equipe:             controller.ttRepSfc.equipe,            
				hraFimRep:          controller.ttReporte.reportFinTime,         
				hraInicRep:         controller.ttReporte.reportIniTime,        
				operador:           controller.ttRepSfc.operador,          
				qtdAprov:           controller.ttReporte.qtdProd,          
				qtdRefgda:          controller.ttRepSfc.qtdRefgda,         
				qtdRefgdaRef:       controller.ttRepSfc.qtdRefgdaRef,      
				qtdRetrab:          controller.ttRepSfc.qtdRetrab,         
				qtdTotal:           controller.ttReporte.qtdProd,          
				ccustoDebito:       controller.ttRepSfc.ccustoDebito,      
				ccustoRefugo:       controller.ttRepSfc.ccustoRefugo,      
				codDepos:           controller.ttRepSfc.codDepos,          
				codLocaliz:         controller.ttRepSfc.codLocaliz,        
				ctDebito:           controller.ttRepSfc.ctDebito,          
				ctRefugo:           controller.ttRepSfc.ctRefugo,          
				depAcab:            controller.ttRepSfc.depAcab,           
				depRefugo:          controller.ttRepSfc.depRefugo,         
				dtValidLote:        controller.ttRepSfc.dtValidLote,       
				locAcab:            controller.ttRepSfc.locAcab,           
				locRefugo:          controller.ttRepSfc.locRefugo,         
				loteAcab:           controller.ttRepSfc.loteAcab,          
				perPpm:             controller.ttRepSfc.perPpm,            
				referAcab:          controller.ttRepSfc.referAcab,         
				deTempoSetup: 	    controller.ttRepSfc.deTempoSetup, 	    
				logOperacFinal:	    controller.ttRepSfc.logOperacFinal,	
				logUsaLote:		    controller.ttRepSfc.logUsaLote
			}
			*/

			controller.ttRepSfc.referAcab		= 	controller.ttReporte.itemRefer;
			controller.ttRepSfc.hraInicRep		=	controller.ttReporte.reportIniTime;
			controller.ttRepSfc.hraFimRep		=	controller.ttReporte.reportFinTime;
			controller.ttRepSfc.datInicReporte	=	this.formatDate(controller.ttReporte.datIniReporte);
			controller.ttRepSfc.datFimReporte	=	this.formatDate(controller.ttReporte.datFinReporte);
			controller.ttRepSfc.qtdAprov		=	controller.ttReporte.qtdProd;
			controller.ttRepSfc.qtdRefgda		=	controller.ttReporte.qtdScrap;
			controller.ttRepSfc.qtdTotal		=	parseFloat(controller.ttReporte.qtdProd) + parseFloat(controller.ttReporte.qtdScrap);

			/*Validação aplicada na fachada*/
			controller.ttRepSfc.depAcab     = controller.ttReporte.warehouseCode;
			controller.ttRepSfc.locAcab     = controller.ttReporte.locationCode;
			controller.ttRepSfc.loteAcab    = controller.ttReporte.lotCode;
			controller.ttRepSfc.dtValidLote = this.formatDate(controller.ttReporte.lotDueDate);
			controller.ttRepSfc.perPpm      = controller.ttReporte.perppm;

			parameters = {
				ttParamApontSfc: controller.ttParamApontSfc,
				ttRepSfc: controller.ttRepSfc,
				ttRef: controller.ttRef,
				ttAloca: controller.ttAloca,
				ttReservas: controller.ttReservas,
				ttMatReciclado: controller.ttMatReciclado,
				ttApontMob: controller.ttApontMob
			}
			
			fchmanproductionappointmentFactory.aptoSfc(parameters, function(result){
				if(result.length > 0) {
					angular.forEach(result,function(resultErrors){
						if(resultErrors){
							var alert = {
								type: 'error',
								title: $rootScope.i18n('l-error') + ": " + resultErrors.errorNumber,
								size: 'md',  //opicional
								detail: resultErrors.errorDescription
							};
							appNotificationService.notify(alert);
						}
					});
				}else{
					var alert = {
						type: 'success',
						title: "Sucesso",
						size: 'md',  //opicional
						detail: "Apontamento realizado com Sucesso"
					};
					appNotificationService.notify(alert);
					$location.path("dts/mcp/productionappointment");
				}
			});
			
		}

		controller.cancel = function(){
			$location.path("dts/mcp/productionappointment");
		}

		controller.criattWasteReason = function() {
			controller.ttWasteReason = {
				prodOrderCode: this.ttRepProd.prodOrderCode,
				scrapCode: 1,
				qtdScrap: this.ttRepProd.qtdScrap,
				observation: "Item refugado",
				prodOrderSeq: 0
			}
		}

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listeners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			controller = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			controller.init();
		});

	}


	// *********************************************************************************
	// *** Motivos de Refugo
	// *********************************************************************************
	productionappointmentScrapReasonsCtrl.$inject = [
		'$modalInstance',
		'$rootScope',
		'$scope',
		'model',
		'$filter',
		'totvs.app-notification.Service',
		'fchman.fchmanproductionappointment.Factory'];


	function productionappointmentScrapReasonsCtrl(
						$modalInstance,
						$rootScope,
						$scope,
						model, 
						$filter, 
						appNotificationService,
						fchmanproductionappointmentFactory) {

		var controller = this;

		this.ttRef = model;
		
		this.motivoRefugo = "";
		this.quantidadeRefugo = 0;
		
		this.selectedItem;

		/**
		 * formatNumber
		 */
		this.formatNumber = function (num, decimals) {
			return num.toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits:decimals});
		}

		// ação de pesquisar
		this.search = function () {
			// close é o fechamento positivo
			$modalInstance.close();
		}
		
		this.adicionaMotivos = function () {
			var lfound = false;
			
			if (controller.quantidadeRefugo <= 0) {
				appNotificationService.notify({
					type: 'error',
					title: "Erro",
					size: 'md',  //opicional
					detail: "Quantidade deve ser maior que zero"
				});
				return;
			}

			angular.forEach(controller.ttRef, function(result) {
				if (result.codMotivRefugo == controller.motivoRefugo) {
					lfound = true;
					return;
					//result.qtdOperacRefgda = parseFloat(result.qtdOperacRefgda) + parseFloat(controller.quantidadeRefugo);
				}
			});
			
			if (lfound == false) {
				controller.ttRef.push({
					line: 0,
					nrOrdProd: 0, 
					codMotivRefugo: controller.motivoRefugo, 
					desMotivRefugo: "", 
					codigoRejei: 0,
					qtdOperacRefgda: controller.quantidadeRefugo,
					qtdOperacRefgdaFormated: controller.formatNumber(parseFloat(controller.quantidadeRefugo), 4),
					qtdOperacRetrab: 0
				});
			} else {
				appNotificationService.notify({
					type: 'error',
					title: "Erro",
					size: 'md',  //opcional
					detail: "Motivo já incluso"
				});
				return;
			}
		}

		this.removeMotivo = function () {
			if (controller.selectedItem != null) {
				i=0;
				angular.forEach(controller.ttRef, function(result) {
					if (result.codMotivRefugo == controller.selectedItem.codMotivRefugo) {
						controller.ttRef.splice(i,1);
					}
					i++;
				});
			}
		}
		
		// ação de fechar
		this.close = function () {
			// dismiss é o fechamento quando cancela ou quando clicar fora do modal (ESC)
			$modalInstance.dismiss();
		}

	}

	index.register.controller('mcp.productionappointmentadd.MainCtrl', productionappointmentaddMainCtrl);
	index.register.controller('mcp.productionappointmentadd.ScrapResonsCtrl', productionappointmentScrapReasonsCtrl);	

});