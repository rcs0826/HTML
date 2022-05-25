define([ 
	'index',
	'/dts/mcc/js/zoom/ordem-compra.js',
	'/dts/mpd/js/zoom/emitente.js',
	'/dts/mpd/js/zoom/moeda.js',
	'/dts/mcc/js/zoom/cond-pagto-2.js',
	'/dts/mcc/js/zoom/tab-unidade.js',
	'/dts/mcc/js/zoom/comprador.js',
	'/dts/mpd/js/zoom/cont-emit.js',
	'/dts/mpd/js/zoom/inco-cx.js',
	'/dts/mpd/js/zoom/pto-contr.js',
	'/dts/mpd/js/zoom/pais.js',
	'/dts/mpd/js/zoom/classif-fisc.js',
	'/dts/mpd/js/zoom/itinerario.js',
	'/dts/men/js/zoom/item.js',
	'/dts/mpd/js/zoom/transporte.js',
	'/dts/mcc/js/zoom/item-fornec.js',
	'/dts/mcc/js/zoom/fab-medic-item.js',
	'/dts/mcc/js/zoom/item-unid-compra.js',
	'/dts/mcc/js/zoom/pais-aliquota.js',
	'/dts/mcc/js/api/fchmatpackagequotationanalysis.js',
	'/dts/mcc/js/api/fchmatenterquotations.js',
	'/dts/mcc/js/api/fchmatdetailquotations.js',
	'/dts/mcc/js/api/fchmatimportquotation.js',
	'/dts/mcc/js/api/fchmatenterpackagequotations.js',
	'/dts/mcc/js/dbo/boun005na.js',
	'/dts/mcc/js/dbo/boad098f.js',
	'/dts/mcc/html/quotation/approvemodal/approvemodal-services.js'
], function(index) {

	// ########################################################
	// ############# CONTROLLER EDIÇÃO DA COTAÇÃO #############
	// ########################################################	
	quotationListController.$inject = ['$rootScope', '$scope', 'totvs.app-main-view.Service', 'TOTVSEvent', '$q'];
	function quotationListController($rootScope, $scope, appViewService, TOTVSEvent, $q){
		var quotationListControl = this;

		/* 
		 * Objetivo: método de inicialização da tela
		 * Parâmetros: 
		 */
		quotationListControl.init = function() {
			quotationListControl.selected = [];
			quotationListControl.dirty = [];
			quotationListControl.filters = [];
			quotationListControl.orderbyList = [];			

			quotationListControl.oc = [];
			for(var i=1;i<10;i++){
				quotationListControl.oc.push({"numeroOrdem":i ,"qtd":i,"un":"pc"+i,"item":"itemTeste"+i,"obs":i+"observacao asd klsmdl kamskldm alsdm lksm lms ", "valor":(i * 10)});
			}
			quotationListControl.quotationsCount = quotationListControl.oc.length;
			quotationListControl.disclaimers =  [{property: 'pendente', value: 'true', title: $rootScope.i18n('l-pending'), fixed:true}];			

			quotationListControl.orderbyList =  [{title:$rootScope.i18n('l-generation-date'), property:"nr-trans", asc:false, default:true},
												{title:$rootScope.i18n('l-value'), property:"mla-doc-pend-aprov-valor-doc", asc:false},
												{title:$rootScope.i18n('l-company'), property:"mla-ep-codigo", asc:false}];											
		}

		/*
		 * Objetivo: Abre a modal de configuração
		 * Parâmetros:
		 * Observações:
		 */
		quotationListControl.settings = function(){
			console.info("settings");
		}

		/*
		 * Objetivo: Abre a modal de busca avançada
		 * Parâmetros:
		 * Observações:
		 */
		quotationListControl.openAdvancedSearch = function(){
			var modalInstance = modalAdvancedSearch.open({disclaimers: quotationListControl.disclaimers});
		}

		/*
		 * Objetivo: alterar a ordenação dos resultados
		 * Parâmetros: orderby: objeto que contém a ordenação selecionada pelo usuário em tela
		 * Observações: - orderby.property - nome do campo que será usado na ordenação
						- orderby.asc - indica se a ordenação é crescente (asc = true), ou decrescente (asc = false)
		 */
		quotationListControl.selectOrderBy = function(orderby){
			console.info("selectOrderBy = ",orderby)
		}
		
		quotationListControl.onEdit = function(event, column) {
		}

		quotationListControl.onSave = function(event, column, value, currentIndex, original) {
		}

		quotationListControl.onChange = function(event) {
		}

		quotationListControl.onData = function(data) {
		}

		/* Chama o método de inicialização da tela */ 
		if ($rootScope.currentuserLoaded){ 
			quotationListControl.init(); 
		}

		// *********************************************************************************
		// *** Events Listeners
		// *********************************************************************************

		// cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			quotationListControl.init();
		});
	}
	
	// ########################################################
	// ############# CONTROLLER EDIÇÃO DA COTAÇÃO #############
	// ########################################################	
	quotationEditController.$inject = ['$rootScope', '$stateParams', '$state', '$scope', 'totvs.app-main-view.Service', 'TOTVSEvent', 'mcc.fchmatpackagequotationanalysis.Factory', 'mcc.fchmatenterquotations.Factory', 'mcc.boun005na.Factory', 'mcc.fchmatdetailquotations.Factory', 'mcc.boad098f.Factory', 'mcc.fchmatimportquotation.Factory', 'mcc.quotation.approveModal', 'mcc.fchmatenterpackagequotations.Factory', 'toaster', '$timeout', 'totvs.app-notification.Service'];
	function quotationEditController($rootScope, $stateParams, $state, $scope, appViewService, TOTVSEvent, fchmatpackagequotationanalysis, fchmatenterquotations, boun005na, fchmatdetailquotations, boad098f, fchmatimportquotation, approveModal, fchmatenterpackagequotations, toaster, $timeout, appNotificationService){
		var quotationEditControl = this;

		/*
		 * Objetivo: Validar os dados do formulário
		 * Parâmetros: 
		 * Observações: Retorna false se houver algum erro na validação dos campos.
		 */
		quotationEditControl.checkValidForm = function(){
			var messages = [];

			if(quotationEditControl.model.ttCotacaoItem['codigo-icm'])
				quotationEditControl.model.ttCotacaoItem['codigo-icm'] = parseInt(quotationEditControl.model.ttCotacaoItem['codigo-icm']);

			if(quotationEditControl.model.ttCotacaoItem['perc-descto']===undefined || (quotationEditControl.model.ttCotacaoItem['perc-descto'] && quotationEditControl.model.ttCotacaoItem['perc-descto'].toString().length > 8))
				messages.push($rootScope.i18n('l-discount-perc-short', undefined, 'dts/mcc'));

			if(quotationEditControl.model.ttCotacaoItem['valor-descto']===undefined || (quotationEditControl.model.ttCotacaoItem['valor-descto'] && quotationEditControl.model.ttCotacaoItem['valor-descto'].toString().length > 16))
				messages.push($rootScope.i18n('l-discount-value', undefined, 'dts/mcc'));

			if(quotationEditControl.model.ttCotacaoItem['valor-taxa']===undefined || (quotationEditControl.model.ttCotacaoItem['valor-taxa'] && quotationEditControl.model.ttCotacaoItem['valor-taxa'].toString().length > 8))
				messages.push($rootScope.i18n('l-financial-rate', undefined, 'dts/mcc'));

			if(quotationEditControl.model.ttCotacaoItem['nr-dias-taxa']===undefined || (quotationEditControl.model.ttCotacaoItem['nr-dias-taxa'] && quotationEditControl.model.ttCotacaoItem['nr-dias-taxa'].toString().length > 3))
				messages.push($rootScope.i18n('l-financial-rate-days', undefined, 'dts/mcc'));

			if(quotationEditControl.model.ttCotacaoItem['aliquota-ipi']===undefined || (quotationEditControl.model.ttCotacaoItem['aliquota-ipi'] && quotationEditControl.model.ttCotacaoItem['aliquota-ipi'].toString().length > 6))
				messages.push($rootScope.i18n('l-aliquot-ipi', undefined, 'dts/mcc'));

			if(quotationEditControl.model.ttCotacaoItem['aliquota-icm']===undefined || (quotationEditControl.model.ttCotacaoItem['aliquota-icm'] && quotationEditControl.model.ttCotacaoItem['aliquota-icm'].toString().length > 6))
				messages.push($rootScope.i18n('l-icms-tax', undefined, 'dts/mcc'));

			if(quotationEditControl.model.ttCotacaoItem['aliquota-iss']===undefined || (quotationEditControl.model.ttCotacaoItem['aliquota-iss'] && quotationEditControl.model.ttCotacaoItem['aliquota-iss'].toString().length > 6))
				messages.push($rootScope.i18n('l-aliquot-iss', undefined, 'dts/mcc'));

			if(quotationEditControl.model.ttCotacaoItem['aliquota-ii']===undefined || (quotationEditControl.model.ttCotacaoItem['aliquota-ii'] && quotationEditControl.model.ttCotacaoItem['aliquota-ii'].toString().length > 16))
				messages.push($rootScope.i18n('l-aliquot-ii', undefined, 'dts/mcc'));

			if(quotationEditControl.model.ttCotacaoItem['valor-frete']===undefined || (quotationEditControl.model.ttCotacaoItem['valor-frete'] && quotationEditControl.model.ttCotacaoItem['valor-frete'].toString().length > 6))
				messages.push($rootScope.i18n('l-freight-value', undefined, 'dts/mcc'));

			if(quotationEditControl.model.ttCotacaoItem['prazo-entreg']===undefined || (quotationEditControl.model.ttCotacaoItem['prazo-entreg'] && quotationEditControl.model.ttCotacaoItem['prazo-entreg'].toString().length > 4))
				messages.push($rootScope.i18n('l-deliverer-time', undefined, 'dts/mcc'));

			if(quotationEditControl.model.ttCotacaoItem['dias-validade']===undefined || (quotationEditControl.model.ttCotacaoItem['dias-validade'] && quotationEditControl.model.ttCotacaoItem['dias-validade'].toString().length > 3))
				messages.push($rootScope.i18n('l-validity-days', undefined, 'dts/mcc'));

			if(quotationEditControl.model.ttCotacaoItem['narrativa']===undefined || (quotationEditControl.model.ttCotacaoItem['narrativa'] && quotationEditControl.model.ttCotacaoItem['narrativa'].toString().length > 2000))
				messages.push($rootScope.i18n('l-comments', undefined, 'dts/mcc'));

			/* Reajusta cotação */
			if(quotationEditControl.model.ttCotacaoItem['possui-reaj']){
				/* valida percentual do reajuste da cotação */
				var totalPercent = 0;
				var validCurrency = true;
				var validIndexDate = true;
				for(var i=0;i<quotationEditControl.model.quoteReajust.length;i++){
					if(quotationEditControl.model.quoteReajust[i].percReadjustment != null && quotationEditControl.model.quoteReajust[i].percReadjustment != undefined)
						totalPercent = totalPercent + parseFloat(quotationEditControl.model.quoteReajust[i].percReadjustment);
					/* validação moeda do reajuste */
					if(validCurrency){
						if(!quotationEditControl.model.quoteReajust[i].currency || quotationEditControl.model.quoteReajust[i].currency == 0)
							validCurrency = false;
					}

					/* validação da data do reajuste */
					if(validIndexDate){
						if(quotationEditControl.model.quoteReajust[i].indexDate == undefined || quotationEditControl.model.quoteReajust[i].indexDate == null){
							validIndexDate = false;
						}
					}
				}
				if(totalPercent != 100){
					messages.push($rootScope.i18n('l-total-readjustment-equals-100'));
				}

				if(!validCurrency){
					messages.push($rootScope.i18n('l-currency-must-be-bigger-than-zero'));
				}

				if(!validIndexDate){
					messages.push($rootScope.i18n('l-quote-readjust') + " - " + $rootScope.i18n('l-invalid-date'));
				}
			}

			var today = new Date();
			today.setHours(0,0,0,0);
			today = today.getTime();

			if(quotationEditControl.typeInformationDelivery == 2){
				var dtEmbarqueValid = true;
				if(quotationEditControl.model.ttCotacaoItem['dt-embarque'] === undefined || quotationEditControl.model.ttCotacaoItem['dt-embarque'] == null || quotationEditControl.model.ttCotacaoItem['dt-embarque'] == ""){
					dtEmbarqueValid = false;
				}else{
					if(quotationEditControl.isNew && (quotationEditControl.model.ttCotacaoItem['dt-embarque'] < today)){
						dtEmbarqueValid = false;
					}
				}
				if(!dtEmbarqueValid)
					messages.push($rootScope.i18n('l-dt-shipment', undefined, 'dts/mcc'));
			}

			if(quotationEditControl.typeInformationDelivery == 3){
				var dtEntregaValid = true;
				if(quotationEditControl.model.ttCotacaoItem['dt-entrega'] === undefined || quotationEditControl.model.ttCotacaoItem['dt-entrega'] == null || quotationEditControl.model.ttCotacaoItem['dt-entrega'] == ""){
					dtEntregaValid = false;
				}else{
					if(quotationEditControl.isNew && (quotationEditControl.model.ttCotacaoItem['dt-entrega'] < today)){
						dtEntregaValid = false;
					}
				}
				if(!dtEntregaValid)
					messages.push($rootScope.i18n('l-delivery-date', undefined, 'dts/mcc'));
			}
			
			if(quotationEditControl.model.ttCotacaoItem['preco-fornec']===undefined || (quotationEditControl.model.ttCotacaoItem['preco-fornec'] && quotationEditControl.model.ttCotacaoItem['preco-fornec'].toString().length > 20))
				messages.push($rootScope.i18n('l-vendor-price', undefined, 'dts/mcc'));

			if(messages.length > 0){
				for(var i=0; i < messages.length; i++){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-invalid-value', [], 'dts/mcc'),
						detail: messages[i]
					});
				}
				return false;
			}else{
				quotationEditControl.checkDataCotacao();
			}
		}

		// # Purpose: Valida se a data da cotação é menor que a data da ordem. Se for pede a confirmação do usuário para continuar o processamento
		// # Parameters: 
		// # Notes: 
		quotationEditControl.checkDataCotacao = function(){
			if(quotationEditControl.model.ttCotacaoItem['data-cotacao'] < quotationEditControl.model.ttSummaryPurchRequisition['data-emissao']){
				return appNotificationService.question({
						title: 'l-question',
						text: $rootScope.i18n('l-confirm-quotation-date-less-than-orderline-date', [], 'dts/mcc'),
						cancelLabel: 'l-no',
						confirmLabel: 'l-yes',
						callback: function(isPositiveResult) {
							if(isPositiveResult)
								quotationEditControl.checkII();
							else
								return false;
						}
					});
			}else{
				quotationEditControl.checkII();
			}
		}

		// # Purpose: Se for uma cotação de importação valida se a alíquota de II foi informada. Caso não tenha sido informada pede confirmação do usuário.
		// # Parameters: 
		// # Notes: 
		quotationEditControl.checkII = function(){
			if(quotationEditControl.importQuotation && (!quotationEditControl.model.ttCotacaoItem['aliquota-ii'] || parseFloat(quotationEditControl.model.ttCotacaoItem['aliquota-ii']) == 0)){
				return appNotificationService.question({
					title: 'l-question',
					text: $rootScope.i18n('l-confirm-aliquot-ii-free', [], 'dts/mcc'),
					cancelLabel: 'l-no',
					confirmLabel: 'l-yes',
					callback: function(isPositiveResult) {
						if(isPositiveResult)
							quotationEditControl.afterCheckValidForm();
						else
							return false;
					}
				});
			}else{
				quotationEditControl.afterCheckValidForm();
			}
		}

		// # Purpose: Após efetuar as validações do formulário segue o processamento para salvar a cotação.
		// # Parameters: 
		// # Notes: Caso seja aprovação/desaprovação de cotação é preciso abrir a modal de aprovação.
		quotationEditControl.afterCheckValidForm = function(){			
			/* desaprovar cotação */
			if(!quotationEditControl.isNew && quotationEditControl.quoteApproved != quotationEditControl.model.ttCotacaoItem['cot-aprovada']){
				quotationEditControl.openApproveModal();
			}else{
				if(quotationEditControl.isNew && quotationEditControl.model.ttCotacaoItem['cot-aprovada']){
					quotationEditControl.openApproveModal();
				}else{
					quotationEditControl.continueSave(null);
				}
			}
		}

		/* 
		 * Objetivo: método de inicialização da tela
		 * Parâmetros: 
		 */
		quotationEditControl.init = function() {
			createTab = appViewService.startView($rootScope.i18n('l-new-quote'), 'mcc.quotation.EditCtrl', quotationEditControl);
			
			if( appViewService && appViewService.previousView && appViewService.previousView.name &&
                createTab === false &&
                (appViewService.previousView.name.toLowerCase().indexOf("dts/mcc/quotation") == -1 || 
                 appViewService.previousView.name.toLowerCase().indexOf("dts/mcc/quotation.search") > -1 ||
                 appViewService.previousView.name.toLowerCase().indexOf("dts/mcc/quotation.detail") > -1)) {
                return;
            }
			if($stateParams && $stateParams.item){
				if(!$stateParams.ordem)
					$stateParams.ordem = 0;
				quotationEditControl.action = "UPDATE";
				quotationEditControl.isNew = false;
				quotationEditControl.pageTitle = $rootScope.i18n('l-update-quote', undefined, 'dts/mcc');
			}else{
				quotationEditControl.action = "CREATE";
				quotationEditControl.isNew = true;
				quotationEditControl.pageTitle = $rootScope.i18n('l-new-quote', undefined, 'dts/mcc');
			}

			quotationEditControl.afterInitialize();
		}

		
		/* 
		 * Objetivo: método executado após inicialização
		 * Parâmetros: 
		 */
		quotationEditControl.afterInitialize = function(){
			quotationEditControl.detailAll = false;
			quotationEditControl.model = {};
			quotationEditControl.model.ttCotacaoItem = {};
			quotationEditControl.model.ttSummaryPurchRequisition = {};
			quotationEditControl.model.unlinkedQuotation = false;
			quotationEditControl.model.ttQuotationsDefault = {};
			quotationEditControl.lastPurchase = {};
			quotationEditControl.zoomFabMedicItemInit = {};
			quotationEditControl.zoomItemFornecInit = {};			
			//quotationEditControl.enableFields = [];
			quotationEditControl.lastVendorId = undefined;
			quotationEditControl.lastPurchaseOrder = undefined;
			quotationEditControl.multipleRequisitions = [];
			quotationEditControl.mrSelected = [];
			quotationEditControl.mrDirty = [];
			quotationEditControl.model.quoteReajust = [];
			quotationEditControl.currency = [];
			quotationEditControl.quoteApproved = false;
			quotationEditControl.dtEntrega = null;
			quotationEditControl.dtEmbarque = null;
			quotationEditControl.model.priceBaseDate = null;


			if($rootScope.currentuser)
				quotationEditControl.creator = $rootScope.currentuser.login;

			quotationEditControl.getUseImportModule();

			/* busca as informações das moedas para usar na descrição das moedas do ajuste da cotação */
			boun005na.getAllRecords(function(result){
				for(var i=0;i<result.length;i++){ 
					quotationEditControl.currency[result[i]['mo-codigo']] = {descricao: result[i].descricao, sigla: result[i].sigla};
				}

				/* guarda a sigla da moeda padrão (0) */
				quotationEditControl.siglaQuoteCurrecy = quotationEditControl.currency[0].sigla + " ";
				quotationEditControl.sigla = quotationEditControl.sigla;

				if(!quotationEditControl.isNew){
					if(!$stateParams["ordem"] || !$stateParams["emitente"] || !$stateParams["seq"])
						return;

					params = { 	pNrOrdem: $stateParams["ordem"],
								pCodEmitente: $stateParams["emitente"],
								pItCodigo: $stateParams["item"],
								pSeqCotac: $stateParams["seq"],
								pAction: quotationEditControl.action
					};
					quotationEditControl.getQuotationUpdate(params);
				}
			});
		}

		quotationEditControl.getQuotationUpdate = function(params){
			fchmatenterquotations.getQuotationUpdate(params,function(result){
				quotationEditControl.model.ttCotacaoItem = result.ttQuotationsDefaultHtml[0];
				if(quotationEditControl.model.ttCotacaoItem['codigo-icm'])
					quotationEditControl.model.ttCotacaoItem['codigo-icm'] = quotationEditControl.model.ttCotacaoItem['codigo-icm'].toString();
				quotationEditControl.quoteApproved = quotationEditControl.model.ttCotacaoItem['cot-aprovada'];


				if(result.ttSummaryPurchRequisition.length == 0){
					quotationEditControl.model.unlinkedQuotation = true;
					quotationEditControl.model.ttSummaryPurchRequisition['it-codigo'] = quotationEditControl.model.ttCotacaoItem['it-codigo'];
					quotationEditControl.model.ttSummaryPurchRequisition['cod-emitente'] = quotationEditControl.model.ttCotacaoItem['cod-emitente'];
					quotationEditControl.model.ttSummaryPurchRequisition['un'] = quotationEditControl.model.ttCotacaoItem['un'];
				}else{
					quotationEditControl.model.ttSummaryPurchRequisition = result.ttSummaryPurchRequisition[0];
					quotationEditControl.model.unlinkedQuotation = false;
				}

				quotationEditControl.zoomFabMedicItemInit = {filter: {'cod-item': quotationEditControl.model.ttSummaryPurchRequisition['it-codigo']}};
				quotationEditControl.zoomItemFornecInit = 	{filter: {'it-codigo': quotationEditControl.model.ttSummaryPurchRequisition['it-codigo']}};
				quotationEditControl.getVendor(quotationEditControl.model.ttCotacaoItem['cod-emitente']);

				quotationEditControl.sigla = quotationEditControl.currency[quotationEditControl.model.ttCotacaoItem['mo-codigo']]['sigla'] + " ";

				/* reajuste da cotação */
				quotationEditControl.model.quoteReajust = result.ttQuotationsReadjustment;
				if(quotationEditControl.model.quoteReajust.length > 0)
					quotationEditControl.model.priceBaseDate = quotationEditControl.model.quoteReajust[0].priceBaseDate;

				// Habilitar e desabilitar campos
				quotationEditControl.enableFields = [];
				for(i=0; i < result.ttEnableFields.length; i++){
					quotationEditControl.enableFields[result.ttEnableFields[i].campo] = result.ttEnableFields[i].habilitado;
				}
				quotationEditControl.getVendor(quotationEditControl.model.ttCotacaoItem['cod-emitente']);
				quotationEditControl.getLastPurchase();
			});
		}

		/*
		 * Objetivo: Busca as informações de reajuste da cotação
		 * Parâmetros: 	pItCodigo: código do item
						pCodEmitente: código do emitente
						pNumOrder: número da ordem
		 * Observações: 
		 */
		quotationEditControl.getQuotationsReadjustment = function(pItCodigo,pCodEmitente,pNumOrder){
			var params = {pItCodigo:pItCodigo, pCodEmitente:pCodEmitente, pNumOrder:pNumOrder};
			fchmatenterpackagequotations.getQuotationsReadjustment(params, function(result){
			});
		}
		

		/* 
		 * Objetivo: Busca as informações da última compra
		 * Parâmetros:
		 */
		quotationEditControl.getLastPurchase = function(){
			params = {	purchaseRequisitionId:quotationEditControl.model.ttSummaryPurchRequisition['numero-ordem'],
						siteId:quotationEditControl.model.ttSummaryPurchRequisition['cod-estabel'],
						itemId:quotationEditControl.model.ttSummaryPurchRequisition['it-codigo'],
						unitOfMeasure:quotationEditControl.model.ttCotacaoItem['un'],
						vendorId:quotationEditControl.model.ttCotacaoItem['cod-emitente']};
			fchmatpackagequotationanalysis.getLastPurchaseOfItemVendor(params,function(result){
				quotationEditControl.lastPurchase = result[0];
			});
		}

		/*
		 * Objetivo: Busca a descricao da moeda
		 * Parâmetros: currencyId: código da moeda
		 * Observações: 
		 */
		quotationEditControl.getCurrencyDescription = function(currencyId){
			if(currencyId != null && currencyId != undefined)
				return currencyId + " - " + quotationEditControl.currency[currencyId]['descricao'];
			else
				return "";
		}
		

		/*
		 * Objetivo: Verifica se o módulo de importação está ativo.
		 */
		quotationEditControl.getUseImportModule = function(){
		 	fchmatdetailquotations.useImportModule({},function(result){
				if(result){
					quotationEditControl.useImportModule = result['l-import'];					
				}
			});
		}


		/*
		 * Objetivo: Busca as informações da ordem de compra seleciona no botão do zoom
		 * Parâmetros: 
		 * Observações: 
		 */
		quotationEditControl.selectedOrdemCompraZoom = function(){
			quotationEditControl.model.ttSummaryPurchRequisition['numero-ordem'] = quotationEditControl.ordemCompraZoom["numero-ordem"];
			quotationEditControl.getSummaryPurchRequisition();
		}

		/*
		 * Objetivo: Buscar informações da ordem de compra
		 */
		quotationEditControl.getSummaryPurchRequisition = function(){
			/* Se for edição, não deve executar este método */
			if(!quotationEditControl.isNew || (!quotationEditControl.model.ttSummaryPurchRequisition['numero-ordem'] && !quotationEditControl.model.ttSummaryPurchRequisition['it-codigo']))
				return;

			if(!quotationEditControl.lastPurchaseOrder)
				quotationEditControl.lastPurchaseOrder = quotationEditControl.model.ttSummaryPurchRequisition['numero-ordem'];
			else{
				if(quotationEditControl.lastPurchaseOrder == quotationEditControl.model.ttSummaryPurchRequisition['numero-ordem'])
					return;
				else
					quotationEditControl.lastPurchaseOrder = quotationEditControl.model.ttSummaryPurchRequisition['numero-ordem'];
			}
			
			quotationEditControl.model.ttCotacaoItem = [];
			quotationEditControl.lastPurchase = [];
			quotationEditControl.importQuotation = false;
			quotationEditControl.enableFields = [];

			/* zera as informações das ordens múltiplas */
			quotationEditControl.multipleRequisitions = [];
			quotationEditControl.mrSelected = [];
			quotationEditControl.mrDirty = [];
			
			/* fecha os agrupadores */
			quotationEditControl.detailAll = true;
			quotationEditControl.expandAll();

			/* Cotação vinculada a ordem de compra */
			if(!quotationEditControl.model.unlinkedQuotation){

				fchmatenterquotations.getSummaryPurchRequisition({pNrOrdem:quotationEditControl.model.ttSummaryPurchRequisition['numero-ordem']},function(result){
					if(result.length > 0){
						quotationEditControl.model.ttSummaryPurchRequisition = result[0];

						quotationEditControl.setDefaultsQuotation(quotationEditControl.action,"",quotationEditControl.model.ttSummaryPurchRequisition);
						quotationEditControl.zoomFabMedicItemInit = {filter: {'cod-item': quotationEditControl.model.ttSummaryPurchRequisition['it-codigo']}};
						quotationEditControl.zoomItemFornecInit = 	{filter: {'it-codigo': quotationEditControl.model.ttSummaryPurchRequisition['it-codigo']}};
						quotationEditControl.getVendor(quotationEditControl.model.ttCotacaoItem['cod-emitente']);
					}
				});
			}else{
				/* Quando é cotação desvinculada não é possível buscar a ordem de compra*/
				quotationEditControl.setDefaultsQuotation(quotationEditControl.action,"",quotationEditControl.model.ttSummaryPurchRequisition);
				quotationEditControl.zoomFabMedicItemInit = {filter: {'cod-item': quotationEditControl.model.ttSummaryPurchRequisition['it-codigo']}};
				quotationEditControl.zoomItemFornecInit = 	{filter: {'it-codigo': quotationEditControl.model.ttSummaryPurchRequisition['it-codigo']}};
				quotationEditControl.getVendor(quotationEditControl.model.ttCotacaoItem['cod-emitente']);
			}			
		}

		/*
		 * Objetivo: Busca as informações do emitente informado
		 * Parâmetros: vendorId: código do emitente
		 */
		quotationEditControl.getVendor = function(vendorId){
			if (vendorId == undefined || vendorId == null)
				return;

			if(!quotationEditControl.lastVendorId)
				quotationEditControl.lastVendorId = vendorId;
			else{
				if(quotationEditControl.lastVendorId == vendorId)
					return;
				quotationEditControl.lastVendorId = vendorId;
			}

			boad098f.getRecord(vendorId, function(result){
				quotationEditControl.getTypeInformationDelivery();
				if(result)
					quotationEditControl.vendor = result;
				else
					quotationEditControl.vendor = null;

				if(quotationEditControl.useImportModule && quotationEditControl.vendor && (quotationEditControl.vendor.natureza == 3 || quotationEditControl.vendor.natureza == 4)){
					quotationEditControl.importQuotation = true;
					quotationEditControl.getQuotationImport();
				}else
					quotationEditControl.importQuotation = false;
			});
		}

		/* 
		 * Objetivo: Busca as informações atualizadas de acordo com a alteração do campo
		 * Parâmetros: fieldName: nome do campo que foi alterado
		 */
		quotationEditControl.changeField = function(fieldName){
			$timeout(function() {
				if(quotationEditControl.model.ttCotacaoItem[fieldName] != undefined){
					quotationEditControl.setDefaultsQuotation(quotationEditControl.action,fieldName,quotationEditControl.model.ttCotacaoItem);					
				}
				if(fieldName == "mo-codigo"){
					quotationEditControl.sigla = quotationEditControl.currency[quotationEditControl.model.ttCotacaoItem['mo-codigo']]['sigla'] + " ";
				}
			});
		}

		/* 
		 * Objetivo: buscar as informações da cotação
		 * Parâmetros: 	action: ação da página
		  				fieldName: nome do campo (quando a chamada é feita no change do campo, caso contrário passar branco '')
		  				quotation: array com as informações da cotação.
		 */
		quotationEditControl.setDefaultsQuotation = function(action, fieldName, quotation){
			$timeout(function() {
				params = {	pType: action,
							pFieldName: fieldName,
							ttQuotations: quotation};
								
				fchmatenterquotations.setDefaultsQuotation(params,function(result){
					if(result.ttQuotationsDefault){
						quotationEditControl.model.ttCotacaoItem = result.ttQuotationsDefault[0];
						quotationEditControl.model.ttCotacaoItem['codigo-icm'] = quotationEditControl.model.ttCotacaoItem['codigo-icm'].toString();

						quotationEditControl.model.compradorMultiplasOrdens = quotationEditControl.model.ttCotacaoItem['cod-comprado'];

						/* Busca a sigla da moeda indicada no campo em tela */
						if(quotationEditControl.currency)
							quotationEditControl.sigla = quotationEditControl.currency[quotationEditControl.model.ttCotacaoItem['mo-codigo']]['sigla'] + " ";

						// Habilitar e desabilitar campos						
						if(quotationEditControl.enableFields === null || quotationEditControl.enableFields === undefined)
							quotationEditControl.enableFields = [];
						for(i=0; i < result.ttEnableFields.length; i++){
							quotationEditControl.enableFields[result.ttEnableFields[i].campo] = result.ttEnableFields[i].habilitado;
						}

						quotationEditControl.model.ttCotacaoItem['dt-entrega'] = quotationEditControl.dtEntrega;
						quotationEditControl.model.ttCotacaoItem['dt-embarque'] = quotationEditControl.dtEmbarque;
						if(!quotationEditControl.model.priceBaseDate)
							quotationEditControl.model.priceBaseDate = quotationEditControl.model.ttCotacaoItem['data-cotacao'];

						quotationEditControl.getVendor(quotationEditControl.model.ttCotacaoItem['cod-emitente']);
						quotationEditControl.getLastPurchase();
					}
				});
			}, 1000);
		}

		/* 
		 * Objetivo: Salva a data de entrega informada em tela
		 */
		quotationEditControl.changeDtEntrega = function(){
			if(!quotationEditControl.dtEntrega){
				quotationEditControl.dtEntrega = quotationEditControl.model.ttCotacaoItem['dt-entrega'];
			}
		}

		/* 
		 * Objetivo: Salva a data de embarque informada em tela
		 */
		quotationEditControl.changeDtEmbarque = function(){
			if(!quotationEditControl.dtEmbarque){
				quotationEditControl.dtEmbarque = quotationEditControl.model.ttCotacaoItem['dt-embarque'];
			}
		}

		/*
		 * Objetivo: Se o módulo de importação estiver ativo, deve buscar qual é a informação que será mostrada no campo Prazo Entega (Accordion frete).
		 * Parâmetros: 
		 * Observações: 1: prazo-entrega; 2: data-embarque; 3: dt-entrega
		 */
		quotationEditControl.getTypeInformationDelivery = function(){
			var params = {nrRequisition: quotationEditControl.model.ttSummaryPurchRequisition['numero-ordem'],
						  vendor: quotationEditControl.model.ttCotacaoItem['cod-emitente']};
			fchmatenterquotations.getTypeInformationDelivery(params, function(result){
				if(result.QP_typeInformation != null && result.QP_typeInformation != undefined)
					quotationEditControl.typeInformationDelivery = result.QP_typeInformation;
				else
					quotationEditControl.typeInformationDelivery = 1;
			});			
		}


		/* 
		 * Objetivo: Busca as informações atualizadas de acordo com a alteração do campo
		 * Parâmetros: fieldName: nome do campo que foi alterado
		 */
		quotationEditControl.changeFieldImport = function(fieldName){
			params = {	ttQuotations: quotationEditControl.model.ttCotacaoItem, 
						pAction: quotationEditControl.action, 
						pFieldName: fieldName,
						pAliquotaAntiga: quotationEditControl.model.ttCotacaoItem['aliquota-ipi'],
						cCodEstabel:quotationEditControl.model.ttSummaryPurchRequisition['cod-estabel']
					};
			
			fchmatimportquotation.setDefaultsQuotation(params, function(result){
				if(result.ttQuotationsDefault.length == 0)
					return;
				
				quotationEditControl.model.ttCotacaoItem = result.ttQuotationsDefault[0];

				/* Adiciona os campos que possuem restrição de alteração no array ttEnableFields */
				if(quotationEditControl.enableFields === null || quotationEditControl.enableFields === undefined)
					quotationEditControl.enableFields = [];
				for(i=0; i < result.ttEnableFields.length; i++){
					quotationEditControl.enableFields[result.ttEnableFields[i].campo] = result.ttEnableFields[i].habilitado;
				}
			});
		}

		
		/*
		 * Objetivo: Busca as informações default da cotação quando for importação.
		 */
		quotationEditControl.getQuotationImport = function(){
			/* Se for edição, não deve executar este método */
			if(!quotationEditControl.isNew) 
				return;
			params = {	ttQuotations: quotationEditControl.model.ttCotacaoItem, 
						pAction: quotationEditControl.action, 
						pAliquotaAntiga: quotationEditControl.model.ttCotacaoItem['aliquota-ipi'],
						cCodEstabel:quotationEditControl.model.ttSummaryPurchRequisition['cod-estabel']
					};
			fchmatimportquotation.getQuotationImport(params, function(result){
				$timeout(function() {
					quotationEditControl.model.ttCotacaoItem = result.ttQuotationsDefault[0];

					/* Adiciona os campos que possuem restrição de alteração no array ttEnableFields */
					if(quotationEditControl.enableFields === null || quotationEditControl.enableFields === undefined)
						quotationEditControl.enableFields = [];
					for(i=0; i < result.ttEnableFields.length; i++){
						quotationEditControl.enableFields[result.ttEnableFields[i].campo] = result.ttEnableFields[i].habilitado;
					}

					quotationEditControl.model.ttCotacaoItem['dt-entrega'] = quotationEditControl.dtEntrega;
					quotationEditControl.model.ttCotacaoItem['dt-embarque'] = quotationEditControl.dtEmbarque;
				},1000);
			});
		}

		/*
		 * Objetivo: Abrir a modal de aprovação/reprovação da cotação
		 * Parâmetros:
		 */
		quotationEditControl.openApproveModal = function(){
			params = {	ttCotacaoItem: quotationEditControl.model.ttCotacaoItem,
						vendor:quotationEditControl.vendor
					 };
			var modalInstance = approveModal.open(params)
				.then(function(result) {
					quotationEditControl.continueSave(result);
			});
		}

		/*
		 * Objetivo: Executa o leve do campo "comprador" da tela que reflete nas informações do grid múltiplas ordens
		 * Parâmetros: 
		 * Observações: 
		 */
		quotationEditControl.changeBuyer = function(){
			quotationEditControl.model.compradorMultiplasOrdens = quotationEditControl.model.ttCotacaoItem['cod-comprado'];
			quotationEditControl.multipleRequisitions = [];
			quotationEditControl.mrSelected = [];
			quotationEditControl.mrDirty = [];
		}

		/*
		 * Objetivo: Buscar as informações do accordion "Múltiplas Ordens"
		 * Parâmetros:
		 */
		quotationEditControl.getMultipleRequisitions = function(){
			var params = {pItCodigo:quotationEditControl.model.ttSummaryPurchRequisition['it-codigo'],
							cComprador: quotationEditControl.model.compradorMultiplasOrdens};
			fchmatenterquotations.getMultipleRequisitions(params,function(result){
				quotationEditControl.multipleRequisitions = result;
			});
		}

		/*
		 * Objetivo: Evento de alteração do totvs-grid
		 * Parâmetros: e: evento do componente totvs-grid
		 */
		quotationEditControl.mrGridOnChange = function(e){
			var kendo = e.sender;
			
			if(kendo.dataItem(kendo.select()))
				quotationEditControl.mrComments = kendo.dataItem(kendo.select()).narrativa;
			else
				quotationEditControl.mrComments = "";
		}

		/*
		 * Objetivo: Adicionar reajustes na cotação
		 * Parâmetros:
		 */
		quotationEditControl.addQuoteReajust = function(){
			newQuote = {sequence: (quotationEditControl.model.quoteReajust.length + 1),
						purchaseRequisition: quotationEditControl.model.ttSummaryPurchRequisition['numero-ordem'],
						vendor: quotationEditControl.model.ttCotacaoItem['cod-emitente'],
						item: quotationEditControl.model.ttSummaryPurchRequisition['it-codigo'],
						priceBaseDate: quotationEditControl.model.priceBaseDate,
						currency: undefined,
						indexDate: quotationEditControl.model.priceBaseDate,
						percReadjustment: undefined};
			quotationEditControl.model.quoteReajust.push(newQuote);			
		}

		quotationEditControl.removeQuoteReajust = function(index){
			quotationEditControl.model.quoteReajust.splice(index,1);
		}


		/* 
		 * Objetivo: Buscar as informações atualizadas de acordo com a alteração em determinados campos
		 * Parâmetros: fieldName
		 *
		quotationEditControl.getDescField = function(fieldName){
			if(!fieldName)
				fieldName = "";
			quotationEditControl.setDefaultsQuotation(action,fieldName,quotationEditControl.model.ttCotacaoItem);
		}*/

		/* 
		 * Objetivo: Expandir todos os collapses da tela: Última Compra; Financeiro/Fiscal; Frete/Outros; etc.
		 * Parâmetros:
		 */
		quotationEditControl.expandAll = function(){
			quotationEditControl.detailAll = !quotationEditControl.detailAll;
			if(quotationEditControl.detailAll)
				$('.panel-collapse').collapse('show');
			else
				$('.panel-collapse').collapse('hide');
			quotationEditControl.detailLastPurchase 	= quotationEditControl.detailAll;
			quotationEditControl.detailFinancialFiscal  = quotationEditControl.detailAll;
			quotationEditControl.detailFreightOthers 	= quotationEditControl.detailAll;
			quotationEditControl.detailOwner 			= quotationEditControl.detailAll;
			quotationEditControl.detailMultipleRequests = quotationEditControl.detailAll;
			quotationEditControl.detailComments 		= quotationEditControl.detailAll;
			quotationEditControl.detailImport 			= quotationEditControl.detailAll;
			if(quotationEditControl.detailMultipleRequests)
				quotationEditControl.getMultipleRequisitions();
		}

		/*
		 * Objetivo: Salvar cotação e continuar incluindo uma nova cotação
		 * Parâmetros: 
		 * Observações: 
		 */
		quotationEditControl.saveNew = function(){
			quotationEditControl.isSaveNew = true;
			quotationEditControl.checkValidForm();
		}

		/* 
		 * Objetivo: Salvar cotação
		 * Parâmetros:
		 */
		quotationEditControl.save = function(){
			quotationEditControl.isSaveNew = false;
			quotationEditControl.checkValidForm();
		}

		/* 
		 * Objetivo: Cancelar a cotação
		 * Parâmetros:
		 */
		quotationEditControl.cancel = function() {
            // solicita que o usuario confirme o cancelamento da edição/inclusão
            $rootScope.$broadcast(TOTVSEvent.showQuestion, {
                title: 'l-question',
                text: $rootScope.i18n('l-cancel-operation', [], 'dts/mcc'),
                cancelLabel: 'l-no',
                confirmLabel: 'l-yes',
                callback: function(isPositiveResult) {
                    if (isPositiveResult) {
                         $state.go('dts/mcc/quotation.start');
                    }
                }
            });
        }
		


        // # Purpose: Salva a cotação no ERP
        // # Parameters: params: informações da modal de aprovação/reprovação da cotação
        // # Notes: 
		quotationEditControl.continueSave = function(params){
			// múltiplas ordens: 
			var saveQuotationParams = {	pType: quotationEditControl.action,
										cCodEstabel: quotationEditControl.model.ttSummaryPurchRequisition['cod-estabel'],
										iNumPedido: null
									};
			/* Múltiplas Ordens */
			saveQuotationParams.ttSummaryPurchRequisition = [];
			if(quotationEditControl.multipleRequisitions && quotationEditControl.multipleRequisitions.length > 0){
				for(var i=0;i<quotationEditControl.multipleRequisitions.length;i++){
					if(quotationEditControl.multipleRequisitions[i].$selected)
						saveQuotationParams.ttSummaryPurchRequisition.push(quotationEditControl.multipleRequisitions[i]);
				}
			}
				

			/* Aprovação - Entregas */
			if(params && params.parts && params.parts.length>0){
				saveQuotationParams.ttDeliverySchedule = params.parts;
				quotationEditControl.model.ttCotacaoItem["motivo-apr"] = params.comments;
			}else
				saveQuotationParams.ttDeliverySchedule = [];

			/* Cotações */			
			saveQuotationParams.ttQuotations = quotationEditControl.trimObject(quotationEditControl.model.ttCotacaoItem);

			/* Reajusta cotação */
			saveQuotationParams.ttQuotationsReadjustment = quotationEditControl.model.quoteReajust;
			for(var i=0; i<saveQuotationParams.ttQuotationsReadjustment.length; i++){
				saveQuotationParams.ttQuotationsReadjustment[i].sequence = i+1;
			}
			fchmatenterquotations.saveQuotation({},saveQuotationParams,function(result){	
				if(result.$hasError == undefined && (result.RowErrors == null || result.RowErrors == undefined)){
					if(quotationEditControl.isNew) 
						toaster.pop('success', $rootScope.i18n('l-quotation-created'));
					else
						toaster.pop('success', $rootScope.i18n('l-quotation-updated'));

					if(quotationEditControl.isSaveNew)
						quotationEditControl.afterInitialize();
					else
						location.href = "#/dts/mcc/quotation/";
				}
			});
		}

		quotationEditControl.trimObject = function(obj){
			for(var index in obj) { 
				if (obj.hasOwnProperty(index)) {
					if(typeof obj[index] === "string")
						obj[index] = obj[index].trim();
				}
			}

			return obj;
		}


		/* Chama o método de inicialização da tela */ 
		if ($rootScope.currentuserLoaded){ 
			quotationEditControl.init(); 
		}

		// *********************************************************************************
		// *** Events Listeners
		// *********************************************************************************

		// cria um listerner de evento para inicializar o controller somente depois de inicializar o contexto da aplicação.
		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			quotationEditControl.init();
		});
	}

	
	// ########################################################
	// ### Registro dos controllers
	// ########################################################	
	index.register.controller('mcc.quotation.ListCtrl', quotationListController);
	index.register.controller('mcc.quotation.EditCtrl', quotationEditController);
});
