define([ 
	'index',
	'/dts/mcc/js/api/fchmatpackagequotationanalysis.js',
	'/dts/mcc/js/api/fchmatenterquotations.js',
	'/dts/mcc/js/api/fchmatdetailquotations.js',
	'/dts/mcc/js/api/fchmatimportquotation.js',
	'/dts/mcc/js/api/fchmatenterpackagequotations.js',
	'/dts/mcc/js/dbo/boun005na.js',
	'/dts/mcc/js/dbo/boad098f.js',
	'/dts/mcc/js/zoom/tab-unidade.js',
	'/dts/mpd/js/zoom/estabelec.js',
	'/dts/mcc/js/zoom/fab-medic-item.js',
	'/dts/mcc/js/zoom/cond-pagto-2.js',
	'/dts/mpd/js/zoom/transporte.js',
	'/dts/mcc/js/zoom/comprador.js',
	'/dts/mpd/js/zoom/pto-contr.js',
	'/dts/mpd/js/zoom/pais.js',
	'/dts/mpd/js/zoom/classif-fisc.js',
	'/dts/mpd/js/zoom/itinerario.js',
	'/dts/mpd/js/zoom/inco-cx.js',
    '/dts/mcc/js/api/ccapi367.js'
], function(index) {

	// ########################################################
	// ############# CONTROLLER DETALHE DA COTAÇÃO #############
	// ########################################################	
	ctrller.$inject = ['$rootScope', '$stateParams', '$scope', 'totvs.app-main-view.Service', 'TOTVSEvent', 'mcc.fchmatpackagequotationanalysis.Factory', 'mcc.fchmatenterquotations.Factory', 'mcc.boun005na.Factory', 'mcc.fchmatdetailquotations.Factory', 'mcc.boad098f.Factory', 'mpd.classif-fisc.zoom', 'mpd.pais.zoom', 'mpd.itinerario.zoom', 'mpd.pto-contr.zoom', 'mpd.inco-cx.zoom', 'mcc.tab-unidade.zoom', 'mpd.estabelecSE.zoom', 'mcc.fab-medic-item.zoom','mcc.cond-pagto-2.zoom', 'mpd.transporte.zoom', 'mcc.comprador.zoom', 'mcc.fchmatimportquotation.Factory', 'mcc.fchmatenterpackagequotations.Factory', 'toaster', '$timeout','mcc.ccapi367.Factory'];
	function ctrller($rootScope, $stateParams, $scope, appViewService, TOTVSEvent, fchmatpackagequotationanalysis, fchmatenterquotations, boun005na, fchmatdetailquotations, boad098f, serviceClassif, serviceCountry, serviceItiner, serviceControlPt, serviceIncoterm, serviceUnitOfMeasure, serviceSite, serviceManufacturer, servicePayCond, seviceTransp, seviceBuyer, fchmatimportquotation, fchmatenterpackagequotations, toaster, $timeout, ccapi367){
		var ctrl = this;

		/* 
		 * Objetivo: método de inicialização da tela
		 * Parâmetros: 
		 */
		ctrl.init = function() {
			createTab = appViewService.startView($rootScope.i18n('l-detail-quote'), 'mcc.quotation.DetailCtrl', ctrl);
			
			$("#menu-view").css({ 'display': "" }); //ao trocar de aba, perdia o scroll da janela
			
            ctrl.previousView = (appViewService && appViewService.previousView)
	    									    ? appViewService.previousView : undefined;
			if(!$stateParams['ordem'])
				$stateParams['ordem'] = 0;
			if( createTab == false && 
				ctrl.numOrdem == $stateParams['ordem'] && 
				ctrl.codItem == $stateParams['item'] &&
				ctrl.codEmitente == $stateParams['emitente'] && 
				ctrl.seq == $stateParams['seq']) {
                return;
            }

			ctrl.action = "READ";
			ctrl.detailAll = false;
			ctrl.model = {};
			ctrl.model.ttCotacaoItem = {};
			ctrl.model.ttSummaryPurchRequisition = {};
			ctrl.model.unlinkedQuotation = false;
			ctrl.model.ttQuotationsDefault = {};
			ctrl.lastPurchase = {};
			ctrl.lastVendorId = undefined;
			ctrl.lastPurchaseOrder = undefined;
			ctrl.model.quoteReajust = [];
			ctrl.currency = [];
			ctrl.quoteApproved = false;
            ctrl.model.lastVendorItemPurchases = {};
			ctrl.model.lastItemPurchases = {};

			
			if(!$stateParams["ordem"] || !$stateParams["emitente"] || !$stateParams["seq"])
				return;
			ctrl.numOrdem = $stateParams["ordem"];
			ctrl.codEmitente = $stateParams["emitente"];
			ctrl.seq = $stateParams["seq"];

			params = { 	pNrOrdem: $stateParams["ordem"],
						pCodEmitente: $stateParams["emitente"],
						pItCodigo: $stateParams['item'],
						pSeqCotac: $stateParams["seq"],
						pAction: ctrl.action
			};
			ctrl.getQuotationUpdate(params);
		}
		/* 
		 * Objetivo: Busca os dados da cotação
		 * Parâmetros: params - Array com os parâmetros para a busca da cotação
		 */
		ctrl.getQuotationUpdate = function(params){
			fchmatenterquotations.getQuotationUpdate(params,function(result){
				ctrl.model.ttCotacaoItem = result.ttQuotationsDefaultHtml[0];
				if(ctrl.model.ttCotacaoItem == null || ctrl.model.ttCotacaoItem == undefined)
					return;

				if(ctrl.model.ttCotacaoItem['codigo-icm'])
					ctrl.model.ttCotacaoItem['codigo-icm'] = ctrl.model.ttCotacaoItem['codigo-icm'].toString();
				ctrl.quoteApproved = ctrl.model.ttCotacaoItem['cot-aprovada'];

				if(result.ttSummaryPurchRequisition.length == 0){
					ctrl.model.unlinkedQuotation = true;
					ctrl.model.ttSummaryPurchRequisition['it-codigo'] = ctrl.model.ttCotacaoItem['it-codigo'];
					ctrl.model.ttSummaryPurchRequisition['it-codigo-desc'] = ctrl.model.ttCotacaoItem['it-codigo-desc'];
					ctrl.model.ttSummaryPurchRequisition['cod-emitente'] = ctrl.model.ttCotacaoItem['cod-emitente'];
					ctrl.model.ttSummaryPurchRequisition['un'] = ctrl.model.ttCotacaoItem['un'];
				}else{
					ctrl.model.ttSummaryPurchRequisition = result.ttSummaryPurchRequisition[0];
					ctrl.model.unlinkedQuotation = false;
				}

				// busca as informações das moedas para usar na descrição das moedas do ajuste da cotação 
				boun005na.getAllRecords(function(result){
					for(var i=0;i<result.length;i++){
						ctrl.currency[result[i]['mo-codigo']] = {descricao: result[i].descricao, sigla: result[i].sigla};
					}

					// guarda a sigla da moeda padrão (0) 
					ctrl.siglaQuoteCurrecy = ctrl.currency[0].sigla + " ";
					ctrl.sigla = ctrl.currency[ctrl.model.ttCotacaoItem['mo-codigo']]['sigla'] + " ";
					/*Descrição da Moeda*/
					ctrl.model.ttCotacaoItem['mo-codigo-desc'] = ctrl.currency[ctrl.model.ttCotacaoItem['mo-codigo']]['descricao'];
				});

				/* reajuste da cotação */
				ctrl.model.quoteReajust = result.ttQuotationsReadjustment;
				if(ctrl.model.quoteReajust.length > 0)
					ctrl.model.priceBaseDate = ctrl.model.quoteReajust[0].priceBaseDate;
				
				
				// Habilitar e desabilitar campos
				ctrl.enableFields = [];
				for(i=0; i < result.ttEnableFields.length; i++){
					ctrl.enableFields[result.ttEnableFields[i].campo] = result.ttEnableFields[i].habilitado;
				}

				ctrl.getLastPurchase();

				ctrl.getUseImportModule();
			});
		}

		/* 
		 * Objetivo: Busca as descrições das entidades
		 * Parâmetros:
		 */
		ctrl.getDescriptions = function(){

			/*Busca descrição da unidade de medida da cotação*/
			var promiseUnitOfMeasure = serviceUnitOfMeasure.getObjectFromValue(ctrl.model.ttCotacaoItem['un']);
            if (promiseUnitOfMeasure) {
                if(promiseUnitOfMeasure.then){
                    promiseUnitOfMeasure.then(function(data) {
                        ctrl.model.ttCotacaoItem['un-desc'] = data['descricao'];
                    });
                }
            }

            /*Busca descrição da unidade de medida da ordem*/
            promiseUnitOfMeasure = serviceUnitOfMeasure.getObjectFromValue(ctrl.model.ttSummaryPurchRequisition['un']);
            if (promiseUnitOfMeasure) {
                if(promiseUnitOfMeasure.then){
                    promiseUnitOfMeasure.then(function(data) {
                        ctrl.model.ttSummaryPurchRequisition['un-desc'] = data['descricao'];
                    });
                }
            }
            
            /*Busca nome do estabelecimento da ordem*/
            var promiseSite = serviceSite.getObjectFromValue(ctrl.model.ttSummaryPurchRequisition['cod-estabel']);
            if (promiseSite) {
                if(promiseSite.then){
                    promiseSite.then(function(data) {
                        ctrl.model.ttSummaryPurchRequisition['cod-estabel-desc'] = data['nome'];
                    });
                }
            }
            /*Busca nome do fabricante da cotação*/
            var promiseManufacturer = serviceManufacturer.getObjectFromValue(ctrl.model.ttCotacaoItem['manufacturer'] ,
            																{filter : {'cod-item' : ctrl.model.ttCotacaoItem['it-codigo']}});
            if (promiseManufacturer) {
                if(promiseManufacturer.then){
                    promiseManufacturer.then(function(data) {
                        ctrl.model.ttCotacaoItem['manufacturerDescription'] = data['nom-fabrican'];
                    });
                }
            }

            /*Busca descrição da condição de pagamento*/
            var promisePayCond = servicePayCond.getObjectFromValue(ctrl.model.ttCotacaoItem['cod-cond-pag']);
            if (promisePayCond) {
                if(promisePayCond.then){
                    promisePayCond.then(function(data) {
                        ctrl.model.ttCotacaoItem['cod-cond-pag-desc'] = data['descricao'];
                    });
                }
            }

            /*Busca descrição do transportador*/
            var promiseTransp = seviceTransp.getObjectFromValue(ctrl.model.ttCotacaoItem['cod-transp'],{});
            if (promiseTransp) {
                if(promiseTransp.then){
                    promiseTransp.then(function(data) {
                        ctrl.model.ttCotacaoItem['cod-transp-desc'] = data['nome'];
                    });
                }
            }

            /*Busca descrição do comprador*/
            var promiseBuyer = seviceBuyer.getObjectFromValue(ctrl.model.ttCotacaoItem['cod-comprado'],{});
            if (promiseBuyer) {
                if(promiseBuyer.then){
                    promiseBuyer.then(function(data) {
                        ctrl.model.ttCotacaoItem['cod-comprado-desc'] = data['nome'];
                    });
                }
            }

            /*Busca nome do fabricante de importação*/
            boad098f.getRecord(ctrl.model.ttCotacaoItem['cdn-fabrican'] , function(result){
				if(result)
					ctrl.model.ttCotacaoItem['cdn-fabrican-nome'] = result['nome-abrev'];
				
				
			});

            if(ctrl.importQuotation){
            	/*Busca descrição da incoterm*/
	            var promiseIncoterm = serviceIncoterm.getObjectFromValue(ctrl.model.ttCotacaoItem['cod-incoterm']);
	            if (promiseIncoterm) {
	                if(promiseIncoterm.then){
	                    promiseIncoterm.then(function(data) {
	                        ctrl.model.ttCotacaoItem['cod-incoterm-desc'] = data['descricao'];
	                    });
	                }
	            }
            	
				/*Busca descrição do ponto de controle*/
	            var promiseControlPt = serviceControlPt.getObjectFromValue(ctrl.model.ttCotacaoItem['Cod-pto-contr-base']);
	            if (promiseControlPt) {
	                if(promiseControlPt.then){
	                    promiseControlPt.then(function(data) {
	                        ctrl.model.ttCotacaoItem['cod-pto-contr-base-desc'] = data['descricao'];
	                    });
	                }
	            }

	            /*Busca descrição do Itinerário*/
	            var promiseItiner = serviceItiner.getObjectFromValue(ctrl.model.ttCotacaoItem['itinerario']);
	            if (promiseItiner) {
	                if(promiseItiner.then){
	                    promiseItiner.then(function(data) {
	                        ctrl.model.ttCotacaoItem['itinerario-desc'] = data['descricao'];
	                    });
	                }
	            }

	            /*Busca descrição da classificação fiscal*/
	            var promiseClassif = serviceClassif.getObjectFromValue(ctrl.model.ttCotacaoItem['Class-fiscal']);
	            if (promiseClassif) {
	                if(promiseClassif.then){
	                    promiseClassif.then(function(data) {
	                        ctrl.model.ttCotacaoItem['class-fiscal-desc'] = data['descricao'];
	                    });
	                }
	            }

	            /*Busca descrição do país*/
	            var promiseCountry = serviceCountry.getObjectFromValue(ctrl.model.ttCotacaoItem['cdn-pais-orig'],{});
	            if (promiseCountry) {
	                if(promiseCountry.then){
	                    promiseCountry.then(function(data) {
	                        ctrl.model.ttCotacaoItem['cdn-pais-orig-desc'] = data['nome-pais'];
	                    });
	                }
	            }
	        }
		}
		

		/* 
		 * Objetivo: Busca as informações da última compra
		 * Parâmetros:
		 */
		ctrl.getLastPurchase = function(){
            // busca as informações das últimas compras do fornecedor
			params = {	purchaseRequisitionId: ctrl.model.ttSummaryPurchRequisition['numero-ordem'],
						cItem: ctrl.model.ttSummaryPurchRequisition['it-codigo'],
						unitOfMeasure: ctrl.model.ttCotacaoItem['un'],
						vendorId: ctrl.model.ttCotacaoItem['cod-emitente']};
            
			ccapi367.getLastPurchaseOfItemVendor({}, params,function(result){
				ctrl.model.lastVendorItemPurchases = result;
			});
            
            // busca as informações das últimas compras do item
			params = {	purchaseRequisitionId: ctrl.model.ttSummaryPurchRequisition['numero-ordem'],
						site: ctrl.model.ttSummaryPurchRequisition['cod-estabel'],
						cItem: ctrl.model.ttSummaryPurchRequisition['it-codigo']};
			ccapi367.getLastPurchaseOfItem(params,function(result){
				ctrl.model.lastItemPurchases = result;
			});
		}

		/*
		 * Objetivo: Verifica se o módulo de importação está ativo.
		 */
		ctrl.getUseImportModule = function(){
		 	fchmatdetailquotations.useImportModule({},function(result){
				if(result){
					ctrl.useImportModule = result['l-import'];
					if(ctrl.useImportModule)
						ctrl.getTypeInformationDelivery();
				}
				ctrl.getVendor(ctrl.model.ttCotacaoItem['cod-emitente']);
			});
		}

		/*
		 * Objetivo: Busca as informações do emitente informado
		 * Parâmetros: vendorId: código do emitente
		 */
		ctrl.getVendor = function(vendorId){

			if(!ctrl.lastVendorId)
				ctrl.lastVendorId = vendorId;
			else{
				if(ctrl.lastVendorId == vendorId)
					return;
				ctrl.lastVendorId = vendorId;
			}

			boad098f.getRecord(vendorId, function(result){
				if(result)
					ctrl.vendor = result;
				else
					ctrl.vendor = null;

				if(ctrl.useImportModule && (ctrl.vendor && ctrl.vendor.natureza == 3 || ctrl.vendor.natureza == 4)){
					ctrl.importQuotation = true;
				}else
					ctrl.importQuotation = false;

				ctrl.getDescriptions();
			});
		}

		/*
		 * Objetivo: Se o módulo de importação estiver ativo, deve buscar qual é a informação que será mostrada no campo Prazo Entega (Accordion frete).
		 * Parâmetros: 
		 * Observações: 1: prazo-entrega; 2: data-embarque; 3: dt-entrega
		 */
		ctrl.getTypeInformationDelivery = function(){
			fchmatenterquotations.getTypeInformationDelivery({nrRequisition:ctrl.model.ttSummaryPurchRequisition['numero-ordem'],vendor:ctrl.model.ttCotacaoItem['cod-emitente']}, function(result){
				if(result.QP_typeInformation != null && result.QP_typeInformation != undefined)
					ctrl.typeInformationDelivery = result.QP_typeInformation;
				else
					ctrl.typeInformationDelivery = 1;
			});
		}
		
		/* 
		 * Objetivo: Expandir todos os collapses da tela: Última Compra; Financeiro/Fiscal; Frete/Outros; etc.
		 * Parâmetros:
		 */
		ctrl.expandAll = function(){
			ctrl.detailAll = !ctrl.detailAll;
			if(ctrl.detailAll)
				$('.panel-collapse').collapse('show');
			else
				$('.panel-collapse').collapse('hide');
			ctrl.detailLastPurchase 	 = ctrl.detailAll;
			ctrl.detailFinancialFiscal  = ctrl.detailAll;
			ctrl.detailFreightOthers 	 = ctrl.detailAll;
			ctrl.detailOwner 			 = ctrl.detailAll;
			ctrl.detailComments 		 = ctrl.detailAll;
			ctrl.detailImport 			 = ctrl.detailAll;
		}	

		/* Objetivo: retornar para a tela de listagem de cotações
		 * Parâmetros:
		 * Observações:
		 */
		ctrl.back = function(){
            appViewService.removeView(appViewService.getPageActive());
            
            if (ctrl.previousView && ctrl.previousView.name == "dts/mcc/quotation.search") 
                location.href = "#/dts/mcc/quotation/search";
            else
                location.href = "#/dts/mcc/quotation/";
		}

		/* Chama o método de inicialização da tela */ 
		if ($rootScope.currentuserLoaded){ 
			ctrl.init(); 
		}

		// *********************************************************************************
		// *** Events Listeners
		// *********************************************************************************

		// cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			ctrl.init();
		});
	}

	
	// ########################################################
	// ### Registro dos controllers
	// ########################################################	
	index.register.controller('mcc.quotation.DetailCtrl', ctrller);
});

