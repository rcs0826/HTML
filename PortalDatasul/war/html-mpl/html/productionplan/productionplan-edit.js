define(['index'], function(index) {
	
	/**
	 * Controller Edit
	 */
	productionplanEditCtrl.$inject = [
		'$rootScope', 
		'$scope', 
		'$stateParams', 
		'$window', 
		'$location',
		'$state',
		'totvs.app-main-view.Service',
		'mpl.boin318.Service',
		'mpl.boin436.Service',
		'mpl.periodo.zoom',
		'mpl.tipo-per.zoom',
		'fchman.fchmanproductionplan.Factory',
		'TOTVSEvent'
	];
	
	function productionplanEditCtrl($rootScope, 
									 $scope, 
									 $stateParams, 
									 $window, 
									 $location,
									 $state,
									 appViewService,
									 boin318Service,
									 boin436Service,
									 serviceZoomPeriodo,
									 serviceZoomTipoPer,
									 fchmanproductionplanFactory,
									 TOTVSEvent) {
	
		/**
		 * Vari�vel Controller
		 */
		var controller = this;
		
		// *********************************************************************************
	    // *** Atributos
	    // *********************************************************************************
	     
	     // mantem o conteudo do registro em edição/inclusão	   
	    
	    this.model = {};
	    
	    // atributo auxiliar para determinar se é uma edição, desabilitando o campo chave
	    this.idDisabled = $state.is('dts/mpl/productionplan.edit');
	    
	    // título que será mostrado no breadcrumb de edição do html
	    var breadcrumbTitle;
	    
	    // título que será mostrado no header de edição do html
	    var headerTitle;	 
	    
	 // variÃ¡vel para controlar se o usuÃ¡rio selecionou a opÃ§Ã£o Salvar e Novo
	    var isSaveNew = false;
	    
	    var ttProductionPlanVO = {};
	    this.serviceZoomPeriodo = serviceZoomPeriodo;
	    this.serviceZoomTipoPer = serviceZoomTipoPer;
	    
	    this.nrDia = 0;
	    
    	this.comboTypePlan = [
    	                  	{
    	                  		codigo: '1',
    	                  		descricao : "PV"
    	                  	},
    	                  	{
    	              			codigo: '2',
    	              			descricao : "PP"
    	              	}];
    	          	    
    	          	    
  	    this.comboPlanHorizFix = [
              {
              	codigo: '1',
              	descricao : $rootScope.i18n('l-planned')
              },
              {
              	codigo: '2',
              	descricao : $rootScope.i18n('l-no-plan-fixed-horizon')
              },
              {
              	codigo: '3',
              	descricao : $rootScope.i18n('l-not-planned-horizon-release')
          }];
    	          	    
  	    this.comboDemand = [
  	        {
  	        	codigo: '1',
  	        	descricao: $rootScope.i18n('l-yes')
  	        },
  	        {
  	        	codigo: '2',
  	        	descricao: $rootScope.i18n('l-no')
  	        },
  	        {
  	        	codigo: '3',
  	        	descricao: $rootScope.i18n('l-item')
          }];     
  	    
  	    
  	    this.comboReprogramming = [
  	        {
  	        	codigo: 1,
  	        	descricao: $rootScope.i18n('l-anticipates-extending')
  	        },
  	        {
  	        	codigo: 2,
          		descricao: $rootScope.i18n('l-extending')
  	        },
  	        {
  	        	codigo: 3,
  	        	descricao: $rootScope.i18n('l-anticipates'),
  	        },
  	        {
  	        	codigo: 4,
          		descricao: $rootScope.i18n('l-not-reprograms')
          }];
  	    
  	    this.parameters = [{
          	ttProductionPlanVO : {},
          	actionType : ''
          }];
  	    
  	    this.closeOther = false;
  	    this.isChange = true;
	    
	    $scope.oneAtATime = true;
	    
	    $scope.status = {
    	    isFirstOpen: true,
    	    isFirstDisabled: false
	    };
	    
	    this.numberOnly = function(input){
	    	if (input != undefined)
	    		input = input.replace(/[^0-9]/g, '');
	    	
	    	return input;
	    }
	    
	    
	    this.changeSafetyDaysNumber = function(){
	    	controller.model.safetyDaysNumber = controller.numberOnly(controller.model.safetyDaysNumber);
	    }
	    
	    this.changeFixedHorizon = function(){	    
	    	controller.model.fixedHorizon = controller.numberOnly(controller.model.fixedHorizon);	    	
	    }
	    
	    this.changePlanCode = function(){
	    	controller.model.planCode = controller.numberOnly(controller.model.planCode);
	    }
	    
	    this.getPeriodFinal = function(periodType, params){
	    	controller.auxFinalPeriodString = {};	    	
            fchmanproductionplanFactory.getPeriod(periodType, params , function(result){
            	
            	controller.auxFinalPeriodString = result[0];
            	if (controller.auxFinalPeriodString){
	            	controller.model.finalPeriodString = { 
	            		'ano' : controller.auxFinalPeriodString.ano,
						'cd-tipo' : periodType,
						'dt-inicio' : controller.auxFinalPeriodString.dtInicio,
						'dt-termino' : controller.auxFinalPeriodString.dtTermino,
						'nr-periodo' : controller.auxFinalPeriodString.nrPeriodo};
					
					controller.changeFinalPeriodString();
            	}
            	
            });	    		    	
	    }
	    
	    this.getPeriodInitial = function(periodType, params){
	    	
            controller.auxInitialPeriodString = {};
            fchmanproductionplanFactory.getPeriod(periodType, params , function(result){
            	controller.auxInitialPeriodString = result[0];
            	if (controller.auxInitialPeriodString){
	            	controller.model.initialPeriodString = {
	            		'ano' : controller.auxInitialPeriodString.ano,
						'cd-tipo' : periodType,
						'dt-inicio' : controller.auxInitialPeriodString.dtInicio,
						'dt-termino' : controller.auxInitialPeriodString.dtTermino,
						'nr-periodo' : controller.auxInitialPeriodString.nrPeriodo
					};
	
	            	controller.changeIniPeriodString();
            	}
            	
            });
	    	
	    }
	    
	    this.changePeriodType = function(){
	    	
	    	controller.model.nrDay = controller.model.periodType['nr-dia'];
	    	
	    	params = {
            		nrPeriodo : 2,
            		ano : new Date().getFullYear()	            		
            }  		    	
	    	controller.getPeriodFinal(controller.model.periodType['cd-tipo'], params);
	    	
	    	params = {
            		nrPeriodo : 1,
            		ano : new Date().getFullYear()	            		
            }
	    	
	    	controller.getPeriodInitial(controller.model.periodType['cd-tipo'], params);
	    	
	    };
	    
	    
	    // *********************************************************************************
	    // *** Functions
	    // *********************************************************************************
	    
	    this.changeIniPeriodString = function(){
	    	controller.model.initialDateIni = controller.model.initialPeriodString['dt-inicio'];
	    	controller.model.finalDateIni = controller.model.initialPeriodString['dt-termino'];
	    	controller.isChange = false;
	    }
	    
	    this.changeFinalPeriodString = function(){
	    	controller.model.initialDateFim = controller.model.finalPeriodString['dt-inicio'];
	    	controller.model.finalDateFim = controller.model.finalPeriodString['dt-termino'];
	    	controller.isChange = false;
	    }	    
	    
	    this.changePlanType = function(planType){
	        if (planType != 1) {
                this.isConsidersConfirmQuantity = false;
            } else {
                this.isConsidersConfirmQuantity = true;
                this.model.considersConfirmQuantity = false;
            }
	    }
	    
	    this.changePlanInHorizon = function(planInHorizon) {
		    if (planInHorizon != 1) {
		        this.isRepressionDemandMade = false;
		        this.isRepressionDemandPurch = false;
		    } else {
		        this.isRepressionDemandMade = true;
		        this.isRepressionDemandPurch = true;
		    }
		}
	    
	    
	    this.changeThirdpartyBalancePurch = function() {
	    	
             value = controller.model.thirdpartyBalancePurch;

            if (value){
            	controller.isDeliveryPurchProcessing = false;
            	controller.isEntryPurchProcessing = false;
            	controller.isConsidersTransitBalancePurch = false;
            	controller.isDeliveryPurchPayroll = false;
            	controller.isEntryPurchPayroll = false;
	    	} else {
	    		controller.isDeliveryPurchProcessing = true;
	    		controller.isEntryPurchProcessing = true;
	    		controller.isConsidersTransitBalancePurch = true;
	    		controller.isDeliveryPurchPayroll = true;
	    		controller.isEntryPurchPayroll = true;
	            
	            if (this.model.considersStockBalancePurch) {
	            	controller.model.entryPurchProcessing = true;
	            	controller.model.entryPurchPayroll = true;
                } else {
                	controller.model.entryPurchProcessing = false;
                	controller.model.entryPurchPayroll = false;
                }
	            
	            controller.model.deliveryPurchPayroll = false;
	            controller.model.considersTransitBalancePurch = false;
	            controller.model.deliveryPurchProcessing = false;
	    	}
        }
	    
	    this.changeThirdpartyBalanceMade = function() {
	    	
            value = controller.model.thirdpartyBalanceMade;

           if (value){
           	controller.isDeliveryMadeProcessing = false;
           	controller.isEntryMadeProcessing = false;
           	controller.isConsidersTransitBalanceMade = false;
           	controller.isDeliveryMadePayroll = false;
           	controller.isEntryMadePayroll = false;
	    	} else {
	    		controller.isDeliveryMadeProcessing = true;
	    		controller.isEntryMadeProcessing = true;
	    		controller.isConsidersTransitBalanceMade = true;
	    		controller.isDeliveryMadePayroll = true;
	    		controller.isEntryMadePayroll = true;
	            
	            if (this.model.considersStockBalanceMade) {
	            	controller.model.entryMadeProcessing = true;
	            	controller.model.entryMadePayroll = true;
               } else {
               	controller.model.entryMadeProcessing = false;
               	controller.model.entryMadePayroll = false;
               }
	            
	            controller.model.deliveryMadePayroll = false;
	            controller.model.considersTransitBalanceMade = false;
	            controller.model.deliveryMadeProcessing = false;
	    	}
       }
	      
    	this.changeConsidersStockBalancePurch = function() {
    		
			value = controller.model.considersStockBalancePurch;
			if (value){
				controller.isThirdpartyBalancePurch = false;
				controller.isDeliveryPurchProcessing = false;
				controller.isEntryPurchProcessing = false;
				controller.isConsidersTransitBalancePurch = false;
				controller.isDeliveryPurchPayroll = false;
				controller.isEntryPurchPayroll = false;
    		} else {
				controller.isThirdpartyBalancePurch = true;
				controller.isDeliveryPurchProcessing = true;
				controller.isEntryPurchProcessing = true;
				controller.isConsidersTransitBalancePurch = true;
				controller.isDeliveryPurchPayroll = true;
				controller.isEntryPurchPayroll = true;
			}
			
			controller.model.entryPurchPayroll = value;
			controller.model.entryPurchProcessing = value;
			
			controller.model.thirdpartyBalancePurch = false;
			controller.changeThirdpartyBalancePurch();
			
    	}
    	
    	this.changeConsidersStockBalanceMade = function() {
    		
			value = controller.model.considersStockBalanceMade;
			if (value){
				controller.isThirdpartyBalanceMade = false;
				controller.isDeliveryMadeProcessing = false;
				controller.isEntryMadeProcessing = false;
				controller.isConsidersTransitBalanceMade = false;
				controller.isDeliveryMadePayroll = false;
				controller.isEntryMadePayroll = false;
    		} else {
				controller.isThirdpartyBalanceMade = true;
				controller.isDeliveryMadeProcessing = true;
				controller.isEntryMadeProcessing = true;
				controller.isConsidersTransitBalanceMade = true;
				controller.isDeliveryMadePayroll = true;
				controller.isEntryMadePayroll = true;
			}
			
			controller.model.entryMadePayroll = value;
			controller.model.entryMadeProcessing = value;
			
			controller.model.thirdpartyBalanceMade = false;
			controller.changeThirdpartyBalanceMade();
			
    	}
	    
		this.changeConsidersBacklogMade = function() {
			
		    if (controller.model.considersBacklogMade)
		    	controller.isOnlyApprovedMadeOrders = false;
		    else {
		    	controller.isOnlyApprovedMadeOrders = true;
		    	controller.model.onlyApprovedMadeOrders = false;
		    }
		    	
		}
		this.changeConsidersBacklogPurch = function() {
			
		    if (controller.model.considersBacklogPurch)
		    	controller.isOnlyApprovedPurchOrders = false;
		    else {
		    	controller.isOnlyApprovedPurchOrders = true;
		    	controller.model.onlyApprovedPurchOrders = false;
		    }
		    	
		}
		
		
		this.changeInitialDateIni = function(){
			param = {
					cdTipo : controller.model.periodType['cd-tipo'],
					dtInicio: controller.model.initialDateIni					
			}
			if (controller.model.initialDateIni != undefined && controller.model.initialDateIni > 0 ){
				fchmanproductionplanFactory.getPeriodByDate(param, function(result){						
					if (result){
						angular.forEach(result, function(period) {
							if (period.dtInicio != null){
								controller.model.finalDateIni = period.dtTermino;
								controller.model.initialDateIni = period.dtInicio;
								controller.model.initialPeriodString = { 'ano': period.ano,
																		 'cd-tipo': controller.model.typeCode,
																		 'dt-inicio': controller.model.initialDateIni,
																		 'dt-termino': period.dtTermino,
																		 'nr-periodo': period.nrPeriodo };
								
								controller.serviceZoomPeriodo.inicialPeriodList = controller.model.initialPeriodString;
							}								
			            });
					}
				});
			}
			controller.isChange = true;
		}
		
		this.changeFinalDateIni = function(){

			param = {
					cdTipo : controller.model.periodType['cd-tipo'],
					dtInicio: controller.model.initialDateFim					
			}
			if (controller.model.initialDateFim != undefined && controller.model.initialDateFim > 0 ){
				fchmanproductionplanFactory.getPeriodByDate(param, function(result){					
					if (result){
						angular.forEach(result, function(period) {
							if (period.dtInicio != null){
								controller.model.finalPeriodString = {};
								controller.model.finalDateFim = period.dtTermino;
								controller.model.initialDateFim = period.dtInicio;
								controller.model.finalPeriodString = { 'ano': period.ano,
																		 'cd-tipo': controller.model.typeCode,
																		 'dt-inicio': controller.model.initialDateFim,
																		 'dt-termino': period.dtTermino,
																		 'nr-periodo': period.nrPeriodo };
								
								controller.serviceZoomPeriodo.finalPeriodList = controller.model.finalPeriodString;
							}
			            });
					}
				});
			}
			controller.isChange = true;
		}
		
		
	    /**
	     * Método de leitura do registro
	     */	    
	    this.load = function(id) {
	        this.model = {};

	        fchmanproductionplanFactory.getProductionPlanDetail(id, function(result){

	        	$("input[id^='planDescription']").focus();
	        	
	        	controller.model = result[0];
	        	
				if (controller.model.planStatus == 2)
					 controller.model.planStatus = false;
				else
					 controller.model.planStatus = true;
	        	
	            if (controller.model.actionType == 2 && controller.model.planStatus == 1) {
	                controller.isPlanStatus = false;
	            }
	        	
	        	if (controller.model.planType != 2) {
	            	controller.isConsidersConfirmQuantity = true;
	            } else {
	            	controller.isConsidersConfirmQuantity = false;
	            	controller.model.considersConfirmQuantity = false;
	            }

	            if (controller.model.planInHorizon != 2) {
	            	controller.isRepressionDemandMade = true;
	            	controller.isRepressionDemandPurch = true;
	            } else {
	            	controller.isRepressionDemandMade = false;
	            	controller.isRepressionDemandPurch = false;
	            }
	            
	            controller.model.initialPeriodString = { 'ano': controller.model.initialPeriodYear,
														 'cd-tipo': controller.model.typeCode,
														 'dt-inicio': controller.model.initialDateIni,
														 'dt-termino': controller.model.finalDateIni,
														 'nr-periodo': controller.model.initialPeriod };
	            
	            controller.model.finalPeriodString = { 'ano': controller.model.finalPeriodYear,
													   'cd-tipo': controller.model.typeCode,
													   'dt-inicio': controller.model.initialDateFim,
													   'dt-termino': controller.model.finalDateFim,
													   'nr-periodo': controller.model.finalPeriod };
	            
            	auxPeriodType = controller.model.periodType;	            
	            controller.model.periodType = { 'cd-tipo': auxPeriodType,
									            'descricao': controller.model.typeDescription,
									            'int-1': 0,
									            'log-periodo-gerc': false,
									            'nr-dia': controller.model.nrDay};	    
									            	        	
	        });
	       
	    }
	    
	    this.ttProductionPlanVO = {};
	    /**
	     * Método para salvar o registro
	     */
	    
	    this.save = function() {
	    	var param = {};	    
	    	
	    	param = {		
	    		planCode : controller.model.planCode,
				planDescription : controller.model.planDescription,
				planType : controller.model.planType,
				periodType : controller.model.periodType,
				initialPeriodYear : controller.model.initialPeriodYear,
				finalPeriodYear : controller.model.finalPeriodYear,
				finalPeriodYear : controller.model.finalPeriodYear,
				finalPeriod : controller.model.finalPeriod,
				validateDate : controller.model.validateDate,
				purchasedReprogramming : controller.model.purchasedReprogramming,
				considersSafetyStockPurch : controller.model.considersSafetyStockPurch,
				considersStockBalancePurch : controller.model.considersStockBalancePurch,
				considersPurchaseReq : controller.model.considersPurchaseReq,
				considersMadeNeeds : controller.model.considersMadeNeeds,
				considersBacklogPurch : controller.model.considersBacklogPurch,
				reprogrammingMade : controller.model.reprogrammingMade,
				considersSafetyStockMade : controller.model.considersSafetyStockMade,
				considersStockBalanceMade : controller.model.considersStockBalanceMade,
				considersProductionReq : controller.model.considersProductionReq,
				considersPurchNeeds : controller.model.considersPurchNeeds,
				considersBacklogMade : controller.model.considersBacklogMade,
				generateTracking : controller.model.generateTracking,
				calculationStatus : controller.model.calculationStatus,
				regeneratePlan : controller.model.regeneratePlan,
				userCode : controller.model.userCode,
				initialDate : controller.model.initialDate,
				initialTime : controller.model.initialTime,
				finalDate : controller.model.finalDate,
				finalTime : controller.model.finalTime,
				independentDemandItems : controller.model.independentDemandItems,
				dependentDemandItems : controller.model.dependentDemandItems,
				purchaseReq : controller.model.purchaseReq,
				manufacturingReq : controller.model.manufacturingReq,
				reprogrammingReq : controller.model.reprogrammingReq,
				manufacturingItems : controller.model.manufacturingItems,
				committedNeeds : controller.model.committedNeeds,
				itemsOrder : controller.model.itemsOrder,
				plannedReq : controller.model.plannedReq,
				plannedNeeds : controller.model.plannedNeeds,
				planStatus : controller.model.planStatus,
				initialDateNetChange : controller.model.initialDateNetChange,
				finalDateNetChange : controller.model.finalDateNetChange,
				initialTimeNetChange : controller.model.initialTimeNetChange,
				finalTimeNetChange : controller.model.finalTimeNetChange,
				itemsNetChange : controller.model.itemsNetChange,
				fixedHorizon : controller.model.fixedHorizon,
				considersConfirmQuantity : controller.model.considersConfirmQuantity,
				defaultSite : controller.model.defaultSite,
				onlyApprovedPurchOrders : controller.model.onlyApprovedPurchOrders,
				onlyApprovedMadeOrders : controller.model.onlyApprovedMadeOrders,
				considersPayrollBalanceMade : controller.model.considersPayrollBalanceMade,
				considersPayrollBalancePurch : controller.model.considersPayrollBalancePurch,
				considersTransitBalanceMade : controller.model.considersTransitBalanceMade,
				considersTransitBalancePurch : controller.model.considersTransitBalancePurch,
				thirdpartyBalanceMade : controller.model.thirdpartyBalanceMade,
				thirdpartyBalancePurch : controller.model.thirdpartyBalancePurch,
				considersResupplyPurch : controller.model.considersResupplyPurch,
				considersResupplyMade : controller.model.considersResupplyMade,
				safetyDaysNumber : controller.model.safetyDaysNumber,
				planCalculation : controller.model.planCalculation,
				checkSum : controller.model.checkSum,
				numIdPlan : controller.model.numIdPlan,
				needByComponentList : controller.model.needByComponentList,
				configuredPVSales : controller.model.configuredPVSales,
				deliveryPurchProcessing : controller.model.deliveryPurchProcessing,
				entryPurchProcessing : controller.model.entryPurchProcessing,
				deliveryPurchPayroll : controller.model.deliveryPurchPayroll,
				entryPurchPayroll : controller.model.entryPurchPayroll,
				entryMadePayroll : controller.model.entryMadePayroll,
				deliveryMadePayroll : controller.model.deliveryMadePayroll,
				deliveryMadeProcessing : controller.model.deliveryMadeProcessing,
				entryMadeProcessing : controller.model.entryMadeProcessing,
				numPlanCalculation : controller.model.numPlanCalculation,
				isMultiSites : controller.model.isMultiSites,
				grossRequirements : controller.model.grossRequirements,
				repressionDemandMade : controller.model.repressionDemandMade,
				repressionDemandPurch : controller.model.repressionDemandPurch,
				planInHorizon : controller.model.planInHorizon,
				reprogramInProgressReqMade : controller.model.reprogramInProgressReqMade,
				reprogramInProgressReqPurch : controller.model.reprogramInProgressReqPurch,
				initialPeriodString : controller.model.initialPeriodString,
				finalPeriodString : controller.model.finalPeriodString,
				typeCode : controller.model.typeCode,
				typeDescription : controller.model.typeDescription,
				initialDateIni : controller.model.initialDateIni,
				finalDateIni : controller.model.finalDateIni,
				initialDateFim : controller.model.initialDateFim,
				finalDateFim : controller.model.finalDateFim,
				planHorizFix : controller.model.planHorizFix,
				demandaComp : controller.model.demandaComp,
				demandaFabr : controller.model.demandaFabr,
				nrDay : controller.model.nrDay
			};
	    	
	    	var finalPeriodString = controller.model.finalPeriodString;
	    	var initialPeriodString = controller.model.initialPeriodString;
	    	var periodType = controller.model.periodType;
	        
	    	param.initialPeriodYear = controller.model.initialPeriodString['ano'];
	    	param.finalPeriodYear = controller.model.finalPeriodString['ano'];
	    	param.initialPeriod = controller.model.initialPeriodString['nr-periodo'];
	    	param.finalPeriod = controller.model.finalPeriodString['nr-periodo'];	        
	    	param.initialPeriodString = controller.model.initialPeriodString['nr-periodo'] + "/" + param.initialPeriodString['ano'];
	    	param.finalPeriodString = controller.model.finalPeriodString['nr-periodo'] + "/" + param.finalPeriodString['ano'];
	    	param.periodType = controller.model.periodType['cd-tipo'];	       
	        
	    	param.planCode = parseInt(controller.model.planCode);
	    	
	        // se for a tela de edição, faz o update
	        if ($state.is('dts/mpl/productionplan.edit')) {
	        
	         	if (param.planStatus)
		    		param.planStatus = 1;
	        	else
	        		param.planStatus = 2;
	        	
	        	controller.isSaveNew = false;
	        	  	        
	        	fchmanproductionplanFactory.persistProductionPlan(2,param, function(result) {			
	                // se gravou o registro com sucesso
	        		if (!result.$hasError) {
	        			controller.onSaveUpdate(true, result);
	        		} else {
	        			param.finalPeriodString = finalPeriodString;
	        			param.initialPeriodString = initialPeriodString;
	        			param.periodType = periodType;
	        		}
	            });
	        } else { // senão faz o create	        	
	        	controller.isSaveNew = false;
	        	fchmanproductionplanFactory.persistProductionPlan(1, param, function(result) {
	                // se gravou o registro com sucesso
	        		if (!result.$hasError) {
	        			controller.onSaveUpdate(false, result);
	        		} else{
	        			param.finalPeriodString = finalPeriodString;
	        			param.initialPeriodString = initialPeriodString;
	        			param.periodType = periodType;	        			
	        		}
	            });
	        }
	        controller.isSaveNew = false;
	    }
	    
	    /**
	     * MÃ©todo para salvar o registro e manter o formulÃ¡rio em ediÃ§Ã£o
	     */	    
	    this.saveNew = function() {
	    	controller.save();
	    	controller.isSaveNew = true;
	    }
	      
	    /**
	     * Método para notificar o usuário da gravação do registro com sucesso
	     */	    
	    this.onSaveUpdate = function(isUpdate, result) {
	     
	    	if (controller.isSaveNew === true) {
	    		this.model = {};
	            this.headerTitle = $rootScope.i18n('l-add');
	            this.breadcrumbTitle = this.headerTitle;		        
	    	} else {
		        // redireciona a tela para a tela de detalhar
		        controller.redirectToDetail();
	    	}
	     
	        // notifica o usuario que conseguiu salvar o registro
	        $rootScope.$broadcast(TOTVSEvent.showNotification, {
	            type: 'success',
	            title: (isUpdate ? $rootScope.i18n('msg-item-updated') : $rootScope.i18n('msg-item-created')),
	            detail: (isUpdate ? $rootScope.i18n('msg-success-updated') : $rootScope.i18n('msg-success-created'))
	        });
	    }
	     
	    /**
	     * Método para a ação de cancelar
	     */	    
	    this.cancel = function() {
	        // solicita que o usuario confirme o cancelamento da edição/inclusão
	        $rootScope.$broadcast(TOTVSEvent.showQuestion, {
	            title: 'l-question',
	            text: $rootScope.i18n('l-cancel-operation'),
	            cancelLabel: 'l-no',
	            confirmLabel: 'l-yes',
	            callback: function(isPositiveResult) {
	                if (isPositiveResult) { // se confirmou, navega para a pagina anterior
	                    $window.history.back();
	                }
	            }
	        });
	    }
	    
	    /**
	     * Método para verificar se o formulario é invalido
	     */	    
	    this.isInvalidForm = function() {
	         
	        var isInvalidForm = false;
	         
	        // verifica se o codigo foi informado
	        if (!controller.model.planCode || controller.model.planCode.length === 0) {
	            isInvalidForm = true;
	        }
	         
	        // verifica se a descriçãoparams.        if (!controller.model.planDescription || controller.model.planDescription.length === 0) {
	            isInvalidForm = true;
	        //}
	         
	        // se for invalido, monta e mostra a mensagem
	        if (isInvalidForm) {
	            var warning = $rootScope.i18n('l-field');
	            if (messages.length > 1) {
	                warning = $rootScope.i18n('l-fields');
	            }
	            angular.forEach(messages, function(item) {
	                warning = warning + ' ' + $rootScope.i18n(item) + ',';
	            });
	            if (messages.length > 1) {
	                warning = warning + ' ' + $rootScope.i18n('l-requireds');
	            } else {
	                warning = warning + ' ' + $rootScope.i18n('l-required');
	            }
	            $rootScope.$broadcast(TOTVSEvent.showNotification, {
	                type: 'error',
	                title: $rootScope.i18n('l-attention'),
	                detail: warning
	            });
	        }
	         
	        return isInvalidForm;
	    }
	     
	    /**
	     * Redireciona para a tela de detalhar
	     */	    
	    this.redirectToDetail = function() {
	        $location.path('dts/mpl/productionplan/detail/' + controller.model.planCode);
	    }
	     
	    // *********************************************************************************
	    // *** Control Initialize
	    // *********************************************************************************
	     
	    this.init = function() {
	         
	    	// se é a abertura da tab, implementar aqui inicialização do controller
	        if (appViewService.startView(
	        		$rootScope.i18n('l-production-plan'), 
	        		'mpl.productionplan.EditCtrl', 
	        		controller
        		)) {}
	                        	        
	         
	        // se houver parametros na URL
	        if ($stateParams && $stateParams.id) {
	            // realiza a busca de dados inicial
	            this.load($stateParams.id);
	            this.headerTitle = $rootScope.i18n('l-edit'); //$stateParams.id;	    
	            this.breadcrumbTitle = $rootScope.i18n('l-edit');
	            this.isMultiSites = true;
	            this.isPlanStatus = true;
	            
	        } else { // se não, incica com o model em branco (inclusão)

	            this.headerTitle = $rootScope.i18n('l-add');
	            this.breadcrumbTitle = this.headerTitle;
	            this.isMultiSites = false;
	            this.isRepressionDemandMade = true;
	            this.isRepressionDemandPurch = true;
	            this.isPlanStatus = true;
	            this.isConsidersConfirmQuantity = true;
	            this.idDisabled = false;
		        
	            var currentDate = new Date(); 
            
		        controller.model = {		
			    		planCode : 0,
						planDescription : "",
						planType : "1",
						periodType : {'cd-tipo': 1,
					            	  'descricao': "",
					            	  'int-1': 0,
					            	  'log-periodo-gerc': false,
					            	  'nr-dia': 7},
						initialPeriodYear : currentDate.getFullYear(),
						finalPeriodYear : currentDate.getFullYear(),
						initialPeriod : 1,
						finalPeriod : 2,
						validateDate : 1,
						purchasedReprogramming : 1,
						considersSafetyStockPurch : true,
						considersStockBalancePurch : true,
						considersPurchaseReq : true,
						considersMadeNeeds : true,
						considersBacklogPurch : true,
						reprogrammingMade : 1,
						considersSafetyStockMade : true,
						considersStockBalanceMade : true,
						considersProductionReq : true,
						considersPurchNeeds : true,
						considersBacklogMade : true,
						generateTracking : false,
						calculationStatus : 1,
						regeneratePlan : true,
						userCode : "",
						initialDate : Date.parse(new Date()),
						initialTime : "",
						finalDate : Date.parse(new Date()),
						finalTime : "",
						independentDemandItems : 0,
						dependentDemandItems : 0,
						purchaseReq : 0,
						manufacturingReq : 0,
						reprogrammingReq : 0,
						manufacturingItems : 0,
						committedNeeds : 0,
						itemsOrder : 0,
						plannedReq : 0,
						plannedNeeds : 0,
						planStatus : 2,
						initialDateNetChange : null,
						finalDateNetChange : null,
						initialTimeNetChange : "",
						finalTimeNetChange : "",
						itemsNetChange : 0,
						fixedHorizon : 0,
						considersConfirmQuantity : false,
						defaultSite : "",
						onlyApprovedPurchOrders : true,
						onlyApprovedMadeOrders : true,
						considersPayrollBalanceMade : true,
						considersPayrollBalancePurch : true,
						considersTransitBalanceMade : true,
						considersTransitBalancePurch : true,
						thirdpartyBalanceMade : true,
						thirdpartyBalancePurch : true,
						considersResupplyPurch : true,
						considersResupplyMade : true,
						safetyDaysNumber : 0,
						planCalculation : 1,
						checkSum : "",
						numIdPlan : 0,
						needByComponentList : 1,
						configuredPVSales : false,
						deliveryPurchProcessing : true,
						entryPurchProcessing : true,
						deliveryPurchPayroll : true,
						entryPurchPayroll : true,
						entryMadePayroll : true,
						deliveryMadePayroll : true,
						deliveryMadeProcessing : true,
						entryMadeProcessing : true,
						numPlanCalculation : 0,
						isMultiSites : false,
						grossRequirements : false,
						repressionDemandMade : "1",
						repressionDemandPurch : "1",
						planInHorizon : "1",
						reprogramInProgressReqMade : false,
						reprogramInProgressReqPurch : false,
						initialPeriodString : { 'ano' : currentDate.getFullYear(),
												'cd-tipo' : 1,
												'dt-inicio' : "",
												'dt-termino' : "",
												'nr-periodo' : 1},
						finalPeriodString : { 'ano' : currentDate.getFullYear(),
												'cd-tipo' : 1,
												'dt-inicio' : "",
												'dt-termino' : "",
												'nr-periodo' : 2},
						typeCode : 3,
						typeDescription : "Periodo Semanal",
						initialDateIni : "",
						finalDateIni : "",
						initialDateFim : "",
						finalDateFim : "",
						planHorizFix : "Planeja",
						demandaComp : "Sim",
						demandaFabr : "Sim",
						nrDay : 7
					};
		        
	            params = {
	            		nrPeriodo : 1,
	            		ano : currentDate.getFullYear()	            		
	            }
	            
	            controller.getPeriodInitial(1, params);

	            params = {
	            		nrPeriodo : 2,
	            		ano : currentDate.getFullYear()	            		
	            }

	            controller.getPeriodFinal(1, params);
	            
	            controller.listTeste = [];
	            
	            boin436Service.getRecord(1, function(result){
            		
					controller.model.periodType = {
						  'cd-tipo': result['cd-tipo'],
		            	  'descricao': result['descricao'],
		            	  'int-1': result['int-1'],
		            	  'log-periodo-gerc': result['log-periodo-gerc'],
		            	  'nr-dia': result['nr-dia']};
					
					controller.model.nrDay = controller.model.periodType['nr-dia'];
	            });		        
	        }	        
	    }
	     
	    // se o contexto da aplicação já carregou, inicializa a tela.
	    if ($rootScope.currentuserLoaded) { this.init(); }
	     
	    // *********************************************************************************
	    // *** Events Listners
	    // *********************************************************************************
	     
	    // cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
	    $scope.$on(TOTVSEvent.rootScopeInitialize, function () {
	        controller.init();
	    });
	}
	
	index.register.controller('mpl.productionplan.EditCtrl', productionplanEditCtrl);
		
});