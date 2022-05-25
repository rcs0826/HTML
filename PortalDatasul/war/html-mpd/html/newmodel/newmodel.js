/*globals angular, $, index, define, TOTVSEvent*/
define([
	'index',
	'/dts/mpd/js/portal-factories.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	index.stateProvider.state('dts/mpd/newmodel', {
		abstract: true,
		template: '<ui-view/>'
	}).state('dts/mpd/newmodel.start', {
		url: '/dts/mpd/newmodel/:orderId?modelType',
		controller: 'salesorder.newModel.Controller',
		controllerAs: 'controller',
		templateUrl: '/dts/mpd/html/newmodel/newmodel.html'
	});

var newModelcontroller = function ($rootScope, $stateParams, $filter, appViewService, orderResource, modelResource, $window, TOTVSEvent, fchdis0035, userdata) {

		var controller = this;
		
		var i18n = $filter('i18n');

		var paramVisibleFieldsPedVendaCadastro = {cTable: "ped-venda-cadastro"};
		var paramVisibleFieldsPedItemCadastro = {cTable: "ped-item-cadastro"};

		this.selectedAll = false;

		this.nomeModelo = '';
		this.descricaoModelo = '';

		this.modelFields = [];

		this.orderId = $stateParams.orderId;
		this.modelType = $stateParams.modelType;

		if(this.modelType == 2) {
			paramVisibleFieldsPedVendaCadastro = {cTable: "cotac-ped-venda-cadastro"};
			paramVisibleFieldsPedItemCadastro = {cTable: "cotac-ped-item-cadastro"};
 		}

		if(appViewService.startView(i18n('l-model') + ' ' + this.orderId, 'salesorder.newModel.Controller')){

			fchdis0035.getUserRoles({usuario: userdata['user-name']}, function(result){                
				controller.currentUserRoles = result.out.split(",");

				

				fchdis0035.getVisibleFields(paramVisibleFieldsPedVendaCadastro, function(result) {

					controller.pedVendaCadastroVisibleFields = result;

					fchdis0035.getVisibleFields(paramVisibleFieldsPedItemCadastro, function(result) {
						controller.pedItemCadastroVisibleFields = result;	

						controller.getProfileConfig();

					});	
				});
			});	

		};

		this.getProfileConfig = function(){

			controller.isRepresentative = false;
			controller.isCustomer = false;

			controller.showBasic = false;
			controller.showDelivery = false;
			controller.showInvoicing = false;
			controller.showObs = false;			

			controller.itemShowHead = false;
			controller.itemShowQndy = false;
			controller.itemShowTreatment = false;
			controller.itemShowPrice = false;			
			controller.itemShowOther = false;
			controller.itemShowObs = false;

			for (var i = controller.currentUserRoles.length - 1; i >= 0; i--) {
				if(controller.currentUserRoles[i] == "representative"){
					controller.isRepresentative = true;
				}

				if(controller.currentUserRoles[i] == "customer"){
					controller.isCustomer = true;				
				}
			}

			for (var i = controller.pedVendaCadastroVisibleFields.length - 1; i >= 0; i--) {

				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "nr-pedido") controller.showBasic = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "nr-pedcli") controller.showBasic = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "nat-operacao") controller.showBasic = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "contato") controller.showBasic = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "cod-des-merc") controller.showBasic = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "num-id-campanha-crm") controller.showBasic = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "e-mail") controller.showBasic = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "nome-abrev") controller.showBasic = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "cod-entrega-tri") controller.showBasic = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "dt-implant") controller.showBasic = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "cod-canal-venda") controller.showBasic = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "dec-1") controller.showBasic = true;				
			
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "bairro") controller.showDelivery = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "cidade") controller.showDelivery = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "cod-entrega") controller.showDelivery = true;		
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "endereco_text") controller.showDelivery = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "estado") controller.showDelivery = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "local-entreg") controller.showDelivery = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "pais") controller.showDelivery = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "cidade-cif") controller.showDelivery = true;
		
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "cod-cond-pag") controller.showInvoicing = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "cod-estabel") controller.showInvoicing = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "cod-portador") controller.showInvoicing = true;		
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "cod-priori") controller.showInvoicing = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "cod-rota") controller.showInvoicing = true;				
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "dt-entrega") controller.showInvoicing = true;		
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "dt-fimvig") controller.showInvoicing = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "dt-inivig") controller.showInvoicing = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "dt-lim-fat") controller.showInvoicing = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "dt-minfat") controller.showInvoicing = true;			
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "ind-fat-par") controller.showInvoicing = true;				
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "nome-tr-red") controller.showInvoicing = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "nome-transp") controller.showInvoicing = true;			
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "placa") controller.showInvoicing = true;
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "uf-placa") controller.showInvoicing = true;				
				
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "observacoes") controller.showObs = true;					
				if(controller.pedVendaCadastroVisibleFields[i].fieldName == "nr-contrato") controller.showObs = true;
                if(controller.pedVendaCadastroVisibleFields[i].fieldName == "tp-operacao") controller.showObs = true;
                if(controller.pedVendaCadastroVisibleFields[i].fieldName == "local-carregamento") controller.showObs = true;
						
	
			}


			for (var i = controller.pedItemCadastroVisibleFields.length - 1; i >= 0; i--) {

				if(controller.pedItemCadastroVisibleFields[i].fieldName == "cod-refer")        controller.itemShowHead = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "cod-sit-item")     controller.itemShowHead = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "ind-componen")     controller.itemShowHead = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "it-codigo")        controller.itemShowHead = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "nr-sequencia")     controller.itemShowHead = true;
		
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "cod-un")        controller.itemShowQndy = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "des-un-medida") controller.itemShowQndy = true;				
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "qt-pedida")     controller.itemShowQndy = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "qt-un-fat")     controller.itemShowQndy = true;
											
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "vl-preori")              controller.itemShowPrice = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "vl-preori-un-fat")       controller.itemShowPrice = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "vl-pretab")              controller.itemShowPrice = true;			
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "vl-preuni")              controller.itemShowPrice = true;	
				
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "observacao")        controller.itemShowObs = true;
								
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "cod-unid-negoc")      controller.itemShowOther = true;				
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "nr-config")           controller.itemShowOther = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "nr-ord-produ")        controller.itemShowOther = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "cod-ord-compra")      controller.itemShowOther = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "nr-progcli")          controller.itemShowOther = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "nr-programa")         controller.itemShowOther = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "nr-versao")           controller.itemShowOther = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "num-id-campanha-crm") controller.itemShowOther = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "parcela")             controller.itemShowOther = true;				

				if(controller.pedItemCadastroVisibleFields[i].fieldName == "ind-fat-qtfam")  controller.itemShowTreatment = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "log-canc-saldo") controller.itemShowTreatment = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "dt-entrega")     controller.itemShowTreatment = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "dt-max-fat")     controller.itemShowTreatment = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "dt-min-fat")     controller.itemShowTreatment = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "per-minfat")     controller.itemShowTreatment = true;
				if(controller.pedItemCadastroVisibleFields[i].fieldName == "tipo-atend")     controller.itemShowTreatment = true;										

			};

			controller.orderNewModelProfileConfig = {fields: controller.pedVendaCadastroVisibleFields,
											  itemFields: controller.pedItemCadastroVisibleFields,
											  isRepresentative: controller.isRepresentative,
											  isCustomer: controller.isCustomer,
											  showBasic: controller.showBasic,
											  showDelivery: controller.showDelivery,
											  showInvoicing: controller.showInvoicing,
											  showObs: controller.showObs,											  
											  itemShowHead: controller.itemShowHead,
											  itemShowQndy: controller.itemShowQndy,
											  itemShowTreatment: controller.itemShowTreatment,
											  itemShowPrice: controller.itemShowPrice,											  
											  itemShowOther: controller.itemShowOther,
											  itemShowObs: controller.itemShowObs
											};
		}

		this.showHeader = true;

		orderResource.getOrder({nrPedido: this.orderId}, function (result) {
			controller.order = result.ttDetailOrder[0];
			controller.orderItens = result.ttOrderItem;
		});

		this.addFieldtoModel = function (field, element, sequence) {

			if (angular.isUndefined(element)) {

				element = $('input[type="checkbox"].model-cb[data-field-id="' + field + '"]');

				if (angular.isDefined(element) && element.length > 0) {
					element = element[0];
				}

			} else {
				element = element.target || element;
			}

			if (controller.isModelHeaderValid()) {

				if (field === "cod-refer" || field === "it-codigo" || field === "nr-sequencia") {
					controller.addField("cod-refer", document.getElementById('cod-refer_' + sequence), sequence);
					controller.addField("it-codigo", document.getElementById('it-codigo_' + sequence), sequence);
					controller.addField("nr-sequencia", document.getElementById('nr-sequencia_' + sequence), sequence);
				} else {
					controller.addField(field, element, sequence);
				}

				controller.selectedAll = ($('input[type="checkbox"].model-cb').length === controller.modelFields.length);
			} else {
				element.checked = false;
			}
		};

		this.addField = function (field, element, sequence) {

			if (!sequence) {
				sequence = "0";
			}

			var x = 0, i;

			for (i = 0; i < controller.modelFields.length; i += 1) {

				if (controller.modelFields[i].fieldName === field && controller.modelFields[i].numSequence === sequence) {

					x = 1;
					controller.modelFields.splice(i, 1);

					if (element.checked === true) { element.checked = false; }

					break;
				}
			}

			if (x === 0) {

				controller.modelFields.push({fieldName: field, modelDescription: controller.descricaoModelo, modelId: controller.nomeModelo, numSequence: sequence});

				if (element.checked === false) {
					element.checked = true;
				}
			}

		};

		this.isModelHeaderValid = function (isTovalidateModelField) {

			var isOk = true;

			if (controller.nomeModelo === '') {
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{type: 'warning', title: 'Modelo', detail: 'Informe um Nome para o Modelo'}]);
				isOk = false;
			} else if (controller.descricaoModelo === '') {
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{type: 'warning', title: 'Modelo', detail: 'Informe uma Descrição para o Modelo'}]);
				isOk = false;
			} else if (isTovalidateModelField === true && controller.modelFields.length === 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, [{type: 'warning', title: 'Modelo', detail: 'É preciso selecionar ao menos um campo para o modelo.'}]);
				isOk = false;
			}

			return isOk;
		};

		this.selectAll = function (event) {

			event.stopPropagation();
			event.preventDefault();

			if (!controller.isModelHeaderValid()) { return; }

			var i, fields, field, selector = ':checked';

			if (controller.selectedAll !== true) {
				selector = ':not(:checked)';
			}

			fields = $('input[type="checkbox"].model-cb' + selector);

			$rootScope.pendingRequests += 1;

			for (i = 0; i < fields.length; i += 1) {
				field = angular.element(fields[i]);
				controller.addFieldtoModel(field.attr('data-field-id'), fields[i], field.attr('data-field-sequence'));
			}

			$rootScope.pendingRequests -= 1;
		};

		this.saveModel = function () {

			if (!controller.isModelHeaderValid(true)) { return; }

			modelResource.createModel({nrPedido: controller.orderId, modelType: controller.modelType}, angular.toJson(controller.modelFields), function (data) {
				if (data) {
					appViewService.removeView({
						url: '/dts/mpd/newmodel/' + controller.orderId,
						name: i18n('l-order-model') + ' ' + controller.orderId,
						active: true
					});
				}
			});

		};
		
		// metodo para a ação de cancelar
        this.cancel = function() {
            $window.history.back();            
        }		
		

	}; // function newModelcontroller($location, loadedModules)


    newModelcontroller.$inject = ['$rootScope', '$stateParams', '$filter', 'totvs.app-main-view.Service', 'salesorder.salesorders.Factory', 'salesorder.model.Factory', '$window', 'TOTVSEvent', 'mpd.fchdis0035.factory', 'portal.getUserData.factory'];

	index.register.controller('salesorder.newModel.Controller', newModelcontroller);

});
