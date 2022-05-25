define(['index',
		'/dts/mpd/js/portal-factories.js',
		'/dts/dts-utils/js/lodash-angular.js',
		'/dts/mpd/js/api/fchdis0035api.js',
		'/dts/mpd/html/order2/orderItems.js',
		'/dts/mpd/js/api/cfapi004.js'], function (index) {

	index.stateProvider

	.state('dts/mpd/orderdetail', {
		abstract: true,
		template: '<ui-view/>'
	})
	.state('dts/mpd/orderdetail.start', {
	  url:'/dts/mpd/orderdetail/:orderId',
	  controller:'salesorder.orderDetail.Controller',
	  controllerAs: 'controller',
	  templateUrl:'/dts/mpd/html/orderdetail/orderdetail.html',
	});

	orderDetailCtrl.$inject = ['totvs.app-main-view.Service',
							   '$rootScope',
							   '$stateParams',
							   '$window',
							   'salesorder.salesorders.Factory',
							   '$filter',
							   'customization.generic.Factory',
							   'salesorder.message.Factory',
							   'mpd.fchdis0035.factory',
							   'portal.getUserData.factory',
							   'order.itemconfig.narrative.modal'];

	function orderDetailCtrl(appViewService, $rootScope, $stateParams, $window, orderResource, $filter, customService, userMessages, fchdis0035, userdata, modalItemConfigNarrative) {

		var ctrl = this;
		var i18n = $filter('i18n');
		this.newOrderInclusionFlow = false;

		this.orderId = $stateParams.orderId;

		this.viewName = $rootScope.i18n('l-order-details') + " " + ctrl.orderId;
		this.currentUserRoles  = [];

		var paramVisibleFieldsPedVendaDetalhe = {cTable: "ped-venda-detalhe"};
		var paramVisibleFieldsPedItemDetalhe = {cTable: "ped-item-detalhe"};

		this.showHeader = true;
		this.showItens = true;

		this.print = function () {
			orderResource.getPrintUrl(ctrl.orderId, function (url) {
			   $window.open(url);
			});
		};

		this.cancel = function () {
			$window.history.back();
		};

		this.getProfileConfig = function(){

			ctrl.isRepresentative = false;
			ctrl.isCustomer = false;

			ctrl.showBasic = false;
			ctrl.showDelivery = false;
			ctrl.showInvoicing = false;
			ctrl.showObs = false;
			ctrl.showCondition = false;
			ctrl.showSalesRep = false;

			ctrl.itemShowHead = false;
			ctrl.itemShowQndy = false;
			ctrl.itemShowTreatment = false;
			ctrl.itemShowPrice = false;
			ctrl.itemShowFiscal = false;
			ctrl.itemShowOther = false;
			ctrl.itemShowObs = false;

			ctrl.showItemRefHeader = false;

			for (var i = ctrl.currentUserRoles.length - 1; i >= 0; i--) {
				if(ctrl.currentUserRoles[i] == "representative"){
					ctrl.isRepresentative = true;
				}

				if(ctrl.currentUserRoles[i] == "customer"){
					ctrl.isCustomer = true;
				}
				
			}

			for (var i = ctrl.pedVendaDetalheVisibleFields.length - 1; i >= 0; i--) {


				if (ctrl.pedVendaDetalheVisibleFields[i].fieldName === "novo-fluxo-inclusao-pedido") {
					ctrl.newOrderInclusionFlow = ctrl.pedVendaDetalheVisibleFields[i].fieldEnabled; 
				}

				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "nr-pedido") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "nr-pedcli") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "nat-operacao") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "contato") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-des-merc") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "tp-preco") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "num-id-campanha-crm") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-emissao") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-implant") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-sit-aval") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-sit-com") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-sit-ped") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-sit-ped-portal") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "completo") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "e-mail") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "no-ab-reppri") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "nome-abrev") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "val-desconto-total") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "val-pct-desconto-total") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "vl-liq-abe") ctrl.showBasic = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "vl-tot-ped") ctrl.showBasic = true;

				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "bairro") ctrl.showDelivery = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cidade") ctrl.showDelivery = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-entrega") ctrl.showDelivery = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "endereco_text") ctrl.showDelivery = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "estado") ctrl.showDelivery = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "local-entreg") ctrl.showDelivery = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "pais") ctrl.showDelivery = true;

				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-cond-pag") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-estabel") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-portador") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-priori") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-rota") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-entorig") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-entrega") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-fimvig") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-inivig") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-lim-fat") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-minfat") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "ind-fat-par") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "mo-fatur") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "nome-tr-red") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "nome-transp") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "placa") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "uf-placa") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "val-embal") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "val-frete") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "val-perc-embal") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "val-perc-frete") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "val-perc-seguro") ctrl.showInvoicing = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "nome-abrev-tri") ctrl.showInvoicing = true;

				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "observacoes") ctrl.showObs = true;

				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "desc-cancela") ctrl.showCondition = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "desc-reativa") ctrl.showCondition = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "desc-suspend") ctrl.showCondition = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-cancela") ctrl.showCondition = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-reativ") ctrl.showCondition = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-suspensao") ctrl.showCondition = true;

				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "nr-pedrep") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "aprov-forcado") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-mot-canc-cot") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "user-canc") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cidade-cif") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-canal-venda") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-gr-cli") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-sit-pre") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-sit-preco") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-usu-alt-sit") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cond-redespa") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dat-alter-sit") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "desc-forc-cr") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-apr-cred") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-entrega-prim") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "dt-useralt") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "ind-tp-frete") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "cod-modalid-frete") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "nr-versao") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "proc-edi") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "quem-aprovou") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "user-alte") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "user-impl") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "val-seguro") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "desc-bloq-cr") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "vl-liq-ped") ctrl.showSalesRep = true;
				if(ctrl.pedVendaDetalheVisibleFields[i].fieldName == "no-ab-reppri") ctrl.showBasic = true;

			}


			for (var i = ctrl.pedItemDetalheVisibleFields.length - 1; i >= 0; i--) {

				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "cod-refer") {
					ctrl.itemShowHead = true;
					ctrl.showItemRefHeader = true;
				};
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "cod-sit-item")     ctrl.itemShowHead = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "ind-componen")     ctrl.itemShowHead = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "it-codigo")        ctrl.itemShowHead = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "nr-sequencia")     ctrl.itemShowHead = true;

				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "cod-un")        ctrl.itemShowQndy = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "des-un-medida") ctrl.itemShowQndy = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "qt-atendida")   ctrl.itemShowQndy = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "qt-pedida")     ctrl.itemShowQndy = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "qt-un-fat")     ctrl.itemShowQndy = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "qt-alocada")    ctrl.itemShowQndy = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "qt-log-aloca")  ctrl.itemShowQndy = true;

				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "ind-fat-qtfam")  ctrl.itemShowTreatment = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "log-canc-saldo") ctrl.itemShowTreatment = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "dt-entrega")     ctrl.itemShowTreatment = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "dt-max-fat")     ctrl.itemShowTreatment = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "dt-min-fat")     ctrl.itemShowTreatment = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "per-minfat")     ctrl.itemShowTreatment = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "tipo-atend")     ctrl.itemShowTreatment = true;

				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "per-des-item")           ctrl.itemShowPrice = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "val-desconto-total")     ctrl.itemShowPrice = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "val-embal")              ctrl.itemShowPrice = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "val-frete")              ctrl.itemShowPrice = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "val-pct-desconto-total") ctrl.itemShowPrice = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "vl-preori")              ctrl.itemShowPrice = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "vl-preori-un-fat")       ctrl.itemShowPrice = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "vl-pretab")              ctrl.itemShowPrice = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "vl-preuni")              ctrl.itemShowPrice = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "vl-tot-it")              ctrl.itemShowPrice = true;

				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "aliquota-ipi")  ctrl.itemShowFiscal = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "cod-class-fis") ctrl.itemShowFiscal = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "ind-icm-ret")   ctrl.itemShowFiscal = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "nat-operacao")  ctrl.itemShowFiscal = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "per-des-icms")  ctrl.itemShowFiscal = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "val-aliq-iss")  ctrl.itemShowFiscal = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "val-ipi")       ctrl.itemShowFiscal = true;

				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "cod-unid-negoc")      ctrl.itemShowOther = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "dt-canseq")           ctrl.itemShowOther = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "dt-reativ")           ctrl.itemShowOther = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "dt-suspensao")        ctrl.itemShowOther = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "nr-config")           ctrl.itemShowOther = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "nr-ord-produ")        ctrl.itemShowOther = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "cod-ord-compra")      ctrl.itemShowOther = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "nr-progcli")          ctrl.itemShowOther = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "nr-programa")         ctrl.itemShowOther = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "nr-versao")           ctrl.itemShowOther = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "num-id-campanha-crm") ctrl.itemShowOther = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "parcela")             ctrl.itemShowOther = true;
				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "estab-atend-item")    ctrl.itemShowOther = true;

				if(ctrl.pedItemDetalheVisibleFields[i].fieldName == "observacao")        ctrl.itemShowObs = true;

			};

			ctrl.orderDetailProfileConfig = {fields: ctrl.pedVendaDetalheVisibleFields,
											  itemFields: ctrl.pedItemDetalheVisibleFields,
											  isRepresentative: ctrl.isRepresentative,
											  isCustomer: ctrl.isCustomer,
											  showBasic: ctrl.showBasic,
											  showDelivery: ctrl.showDelivery,
											  showInvoicing: ctrl.showInvoicing,
											  showObs: ctrl.showObs,
											  showCondition: ctrl.showCondition,
											  showSalesRep: ctrl.showSalesRep,
											  itemShowHead: ctrl.itemShowHead,
											  itemShowQndy: ctrl.itemShowQndy,
											  itemShowTreatment: ctrl.itemShowTreatment,
											  itemShowPrice: ctrl.itemShowPrice,
											  itemShowFiscal: ctrl.itemShowFiscal,
											  itemShowOther: ctrl.itemShowOther,
											  itemShowObs: ctrl.itemShowObs
											};
		}


		/************* initialize ***************/

		ctrl.init = function () {

			fchdis0035.getUserRoles({usuario: userdata['user-name']}, function(result){

				ctrl.currentUserRoles = result.out.split(",");

				fchdis0035.getVisibleFields(paramVisibleFieldsPedVendaDetalhe, function(result) {

					ctrl.pedVendaDetalheVisibleFields = result;

					angular.forEach(ctrl.pedVendaDetalheVisibleFields, function(value) {
												
						if (value.fieldName === "btn-open-order") {
							ctrl.btnOpenOrder = value.fieldEnabled; 
						}

					});

					fchdis0035.getVisibleFields(paramVisibleFieldsPedItemDetalhe, function(result) {
						ctrl.pedItemDetalheVisibleFields = result;

						ctrl.getProfileConfig();
					}, true, userdata['user-name']);
				}, true, userdata['user-name']);
			}, true);

			orderResource.getOrder({nrPedido: this.orderId}, function(result){
				ctrl.order = result.ttDetailOrder[0];
				ctrl.orderItens = result.ttOrderItem;

				userMessages.getMessages('orderdetail', function (messages){
					var mess = new Array();

					angular.forEach(messages, function (value, key){
						mess.push(value['user-message']);
					});

					ctrl.messageList = mess;
				});

				// chamada de ponto de customização
				customService.callCustomEvent('afterLoadOrderDetail', {controller: ctrl});
				customService.callEvent ('salesorder.orderdetail', 'afterLoadOrderDetail', {controller: ctrl});
			});
		};

		if (appViewService.startView(ctrl.viewName, 'salesorder.orderDetail.Controller', ctrl)){

			/* foi necessario o reajuste, pq quando tem mais de uma tab aberta somente a 
				primeira armazena o contexto correto, no order.js foi feito um ajuste tecnico 
				para salvar corretamente o contexto, nesse caso optou-se por uso de cache 
				no profile e visiblefields e sempre recarregar.

			fchdis0035.getUserRoles({usuario: userdata['user-name']}, function(result){

				ctrl.currentUserRoles = result.out.split(",");

				fchdis0035.getVisibleFields(paramVisibleFieldsPedVendaDetalhe, function(result) {

					ctrl.pedVendaDetalheVisibleFields = result;

					fchdis0035.getVisibleFields(paramVisibleFieldsPedItemDetalhe, function(result) {
						ctrl.pedItemDetalheVisibleFields = result;

						ctrl.getProfileConfig();
						ctrl.init();
					});
				});
			}, true);
			*/
			ctrl.init();
		} else {
			//ctrl.getProfileConfig();
			ctrl.init();
		}

		ctrl.openConfigNarrative = function(itCodigo, codRefer) {
			modalItemConfigNarrative.open({
				itCodigo: itCodigo,
				codRefer: codRefer
			});			
		}

	}
	index.register.controller('salesorder.orderDetail.Controller', orderDetailCtrl);
});


