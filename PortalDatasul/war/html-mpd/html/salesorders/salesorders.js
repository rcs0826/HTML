define(['index',
		'/dts/mpd/js/userpreference.js',
		'/dts/mpd/js/portal-factories.js',
		'/dts/mpd/js/mpd-factories.js',
		'/dts/mpd/js/api/fchdis0051.js',
		'/dts/mpd/js/zoom/emitente.js',
		'/dts/mpd/js/zoom/transporte.js',
		'/dts/mpd/js/zoom/cond-pagto-inter.js',
		'/dts/mpd/js/api/fchdis0035api.js',
		'/dts/mpd/js/mpd-factories.js',
		'/dts/mpd/js/zoom/repres.js',
		'/dts/dts-utils/js/lodash-angular.js'
		//'/dts/mpd/js/zoom/cond-pagto.js',
	], function(index) {

	index.stateProvider
			.state('dts/mpd/salesorders', {
				abstract: true,
				template: '<ui-view/>'
			})
			.state('dts/mpd/salesorders.start', {
			    url: '/dts/mpd/salesorders/quotation/:nrCotac',
			    controller: 'salesorder.salesorders.Controller',
			    controllerAs: 'controller',
			    templateUrl: '/dts/mpd/html/salesorders/salesorders.html'
			})
			.state({
			    name: 'dts/mpd/salesorders.filterNomAbrev',
			    url: '/dts/mpd/salesorders/:codEmitente?nomAbrev&isLead',
			    controller: 'salesorder.salesorders.Controller',
			    controllerAs: 'controller',
			    templateUrl: '/dts/mpd/html/salesorders/salesorders.html'
			})
			.state('dts/mpd/salesorders.copy', {
				url: '/dts/mpd/salesorders/:orderId/copy',
				controller: 'salesorder.salesorders.CopyController',
				controllerAs: 'copyController',
				templateUrl: '/dts/mpd/html/salesorders/salesorders.copy.html'
			});

	salesOrdersCtrl.$inject = ['$rootScope','$location', '$window', 'totvs.app-main-view.Service', 'salesorder.salesorders.Factory', 'userPreference', '$filter', '$q', '$modal', '$stateParams', 'customization.generic.Factory', 'portal.generic.Controller', 'portal.getUserData.factory', 'mpd.companyChange.Factory', 'mpd.fchdis0051.Factory', '$state', 'mpd.fchdis0035.factory'];

	function salesOrdersCtrl($rootScope, $location, $window, appViewService, salesOrdersResource, userPreference, $filter, $q, $modal, $stateParams, customService, genericController, userdata, companyChange, fchdis0051, $state, fchdis0035) {

		var ordersCtrl          = this;
		ordersCtrl.currentUser  = [];
		ordersCtrl.customerUser = null;
		ordersCtrl.nrCotac = 0;
		ordersCtrl.totalReject = 0;

		var paramVisibleFieldsPedVendaLista = {cTable: "ped-venda-lista"};

		genericController.decorate(this, salesOrdersResource);

		this.i18n = $filter('i18n');

		ordersCtrl.STATUSPORTALORDER1 = 1;
		ordersCtrl.STATUSPORTALORDER2 = 2;
		ordersCtrl.STATUSPORTALORDER3 = 3;
		ordersCtrl.STATUSPORTALORDER4 = 4;
		ordersCtrl.STATUSPORTALORDER5 = 5;
		ordersCtrl.STATUSPORTALORDER6 = 6;
		ordersCtrl.STATUSPORTALORDER7 = 7;
		ordersCtrl.STATUSPORTALORDER8 = 8;
		ordersCtrl.STATUSPORTALORDER9 = 9;
        
        ordersCtrl.showButtonShipment = false;

		this.advancedSearch = {model: {}};

		ordersCtrl.getBoolean = function (value){
		   switch(value){
				case true:
				case "true":
				case 1:
				case "1":
				case "yes":
					return true;
				default:
					return false;
			}
		}

		ordersCtrl.isLead = this.getBoolean($stateParams.isLead);
		ordersCtrl.codEmitente = $stateParams.codEmitente || undefined;

		this.optionFieldsStatus = [
			{
				label: this.i18n('l-status-order-1'), //Em Processamento
				value: '1'
			}, {
				label: this.i18n('l-status-order-2'), //Em DigitaÃ§Ã£o
				value: '2'
			}, {
				label: this.i18n('l-status-order-3'), //'Em AnÃ¡lise'
				value: '3'
			}, {
				label: this.i18n('l-status-order-4'), //'Atend Parcial'
				value: '4'
			}, {
				label: this.i18n('l-status-order-5'), //'Atend Total'
				value: '5'
			}, {
				label: this.i18n('l-status-order-6'), //'Suspensos'
				value: '6'
			}, {
				label: this.i18n('l-status-order-7'), //'Cancelados'
				value: '7'
			}, {
				label: this.i18n('l-status-order-8'), //'Reprovados'
				value: '8'
			}
		];

		this.selectedOptionStatus = this.optionFieldsStatus[0];

		this.showSelectSearchField = false;
		this.showDateSearchField = false;

		this.canCreateModel = false;

		this.callEpc = function(item, index) {
			// chamada de ponto de customização
			customService.callEvent('salesorder.salesorders', 'afterLoadOrders', {controller: ordersCtrl, item: item, index: index});
		};

		this.loadOrders = function() {
			this.findRecords(null, ordersCtrl.filterBy);	
			var vDtEmissIni = $filter('date')(ordersCtrl.advancedSearch.model.dtEmissIni, 'shortDate');
			salesOrdersResource.getRejectOrders({iDateFilter: vDtEmissIni}, function(result) {
				if(result) {
					ordersCtrl.totalReject = result.qtdOrders;
				};
			});		
		};

		this.applySimpleFilter = function() {
			ordersCtrl.clearFilter();
			ordersCtrl.setAdvancedFilterValues();
			if(ordersCtrl.quickSearchText){
				ordersCtrl.addFilter("simpleFilter", ordersCtrl.quickSearchText, ordersCtrl.i18n('l-simple-filter'), ordersCtrl.i18n('l-simple-filter') + ': ' + ordersCtrl.quickSearchText, ordersCtrl);
			}
			ordersCtrl.loadOrders();
		};

		this.setQuickFilter = function(value) {

			ordersCtrl.clearFilter();

			if (value == ordersCtrl.STATUSPORTALORDER1) {
				ordersCtrl.addFilter("statusPortalOrder1", value, 'l-status', ordersCtrl.i18n('l-status-order-1'), ordersCtrl);
			}
			if (value == ordersCtrl.STATUSPORTALORDER2) {
				ordersCtrl.addFilter("statusPortalOrder2", value, 'l-status', ordersCtrl.i18n('l-status-order-2'), ordersCtrl);
			}
			if (value == ordersCtrl.STATUSPORTALORDER3) {
				ordersCtrl.addFilter("statusPortalOrder3", value, 'l-status', ordersCtrl.i18n('l-status-order-3'), ordersCtrl);
			}
			if (value == ordersCtrl.STATUSPORTALORDER4) {
				ordersCtrl.addFilter("statusPortalOrder4", value, 'l-status', ordersCtrl.i18n('l-status-order-4'), ordersCtrl);
			}
			if (value == ordersCtrl.STATUSPORTALORDER5) {
				ordersCtrl.addFilter("statusPortalOrder5", value, 'l-status', ordersCtrl.i18n('l-status-order-5'), ordersCtrl);
			}
			if (value == ordersCtrl.STATUSPORTALORDER6) {
				ordersCtrl.addFilter("statusPortalOrder6", value, 'l-status', ordersCtrl.i18n('l-status-order-6'), ordersCtrl);
			}
			if (value == ordersCtrl.STATUSPORTALORDER7) {
				ordersCtrl.addFilter("statusPortalOrder7", value, 'l-status', ordersCtrl.i18n('l-status-order-7'), ordersCtrl);
			}
			if (value == ordersCtrl.STATUSPORTALORDER8) {
				ordersCtrl.addFilter("statusPortalOrder8", value, 'l-status', ordersCtrl.i18n('l-status-order-8'), ordersCtrl);
			}
			if (value == ordersCtrl.STATUSPORTALORDER9) {
				ordersCtrl.addFilter("statusPortalOrder9", value, 'l-status', ordersCtrl.i18n('l-status-sales-order-9'), ordersCtrl);
			}

			ordersCtrl.setAdvancedFilterValues();

			ordersCtrl.loadOrders();
		};

		this.searchAdvancedFilter = function() {
			ordersCtrl.clearFilter();
			ordersCtrl.setAdvancedFilterValues();
			ordersCtrl.loadOrders();
		};

		this.setAdvancedFilterValues = function() {

			var cStatusOrder = "";

			if (ordersCtrl.nrCotac > 0) {
				ordersCtrl.addFilter("nrCotac", ordersCtrl.nrCotac, "", ordersCtrl.i18n('l-quotations') + ":" + ordersCtrl.nrCotac, ordersCtrl);
			}

			if (ordersCtrl.advancedSearch.model.codCliIni) {
				ordersCtrl.addFilter("codCliIni", ordersCtrl.advancedSearch.model.codCliIni, "", ordersCtrl.i18n('l-cod-emitente-inicial') + ":" + ordersCtrl.advancedSearch.model.codCliIni, ordersCtrl);
			}
			if (ordersCtrl.advancedSearch.model.codCliFim) {
				ordersCtrl.addFilter("codCliFim", ordersCtrl.advancedSearch.model.codCliFim, "", ordersCtrl.i18n('l-cod-emitente-final') + ":" + ordersCtrl.advancedSearch.model.codCliFim, ordersCtrl);
			}

			if (ordersCtrl.advancedSearch.model.codIdProsp) {
				ordersCtrl.addFilter("codIdProsp", ordersCtrl.advancedSearch.model.codIdProsp, "", ordersCtrl.i18n('l-cod-lead') + ":" + ordersCtrl.advancedSearch.model.codIdProsp, ordersCtrl);
			}

			if (ordersCtrl.advancedSearch.model.nrPedCliIni) {
				ordersCtrl.addFilter("nrPedCliIni", ordersCtrl.advancedSearch.model.nrPedCliIni, "", ordersCtrl.i18n('l-initial-nr-customer-order') + ":" + ordersCtrl.advancedSearch.model.nrPedCliIni, ordersCtrl);
			}

			if (ordersCtrl.advancedSearch.model.nrPedCliFim) {
				ordersCtrl.addFilter("nrPedCliFim", ordersCtrl.advancedSearch.model.nrPedCliFim, "", ordersCtrl.i18n('l-final-nr-customer-order') + ":" + ordersCtrl.advancedSearch.model.nrPedCliFim, ordersCtrl);
			}

			if (ordersCtrl.advancedSearch.model.nrPedVendaIni) {
				ordersCtrl.addFilter("nrPedVendaIni", ordersCtrl.advancedSearch.model.nrPedVendaIni, '', ordersCtrl.i18n('l-initial-nr-pedido') + ":" + ordersCtrl.advancedSearch.model.nrPedVendaIni, ordersCtrl);
			}

			if (ordersCtrl.advancedSearch.model.nrPedVendaFim) {
				ordersCtrl.addFilter("nrPedVendaFim", ordersCtrl.advancedSearch.model.nrPedVendaFim, '', ordersCtrl.i18n('l-final-nr-pedido') + ":" + ordersCtrl.advancedSearch.model.nrPedVendaFim, ordersCtrl);
			}

			if (ordersCtrl.advancedSearch.model.nomAbrevIni) {
				ordersCtrl.addFilter("nomAbrevIni", ordersCtrl.advancedSearch.model.nomAbrevIni, '', ordersCtrl.i18n('l-initial-short-name') + ":" + ordersCtrl.advancedSearch.model.nomAbrevIni, ordersCtrl);
			}

			if (ordersCtrl.advancedSearch.model.nomAbrevFim) {
				ordersCtrl.addFilter("nomAbrevFim", ordersCtrl.advancedSearch.model.nomAbrevFim, '', ordersCtrl.i18n('l-final-short-name') + ":" + ordersCtrl.advancedSearch.model.nomAbrevFim, ordersCtrl);
			}

			if (ordersCtrl.advancedSearch.model.purchaseOrderIni) {
				ordersCtrl.addFilter("purchaseOrderIni", ordersCtrl.advancedSearch.model.purchaseOrderIni, '', ordersCtrl.i18n('l-nr-ordem-start') + ":" + ordersCtrl.advancedSearch.model.purchaseOrderIni, ordersCtrl);
			}

			if (ordersCtrl.advancedSearch.model.purchaseOrderFim) {
				ordersCtrl.addFilter("purchaseOrderFim", ordersCtrl.advancedSearch.model.purchaseOrderFim, '', ordersCtrl.i18n('l-nr-ordem-end') + ":" + ordersCtrl.advancedSearch.model.purchaseOrderFim, ordersCtrl);
			}			

			if (ordersCtrl.advancedSearch.model.dtEmissIni) {

				var vDtEmissIni = $filter('date')(ordersCtrl.advancedSearch.model.dtEmissIni, 'shortDate');

				ordersCtrl.addFilter("dtEmissIni", vDtEmissIni, '', ordersCtrl.i18n('l-initial-dt-emiss') + ":" + vDtEmissIni, ordersCtrl);
				userPreference.setPreference('summaryInitDate', ordersCtrl.advancedSearch.model.dtEmissIni);
			}

			if (ordersCtrl.advancedSearch.model.dtEmissFim) {
				var vDtEmissFim = $filter('date')(ordersCtrl.advancedSearch.model.dtEmissFim, 'shortDate');
				ordersCtrl.addFilter("dtEmissFim", vDtEmissFim, '', ordersCtrl.i18n('l-final-dt-emiss') + ":" + vDtEmissFim, ordersCtrl);
			}

			if (ordersCtrl.codeRepresentatives) {
				$rootScope.MPDSalesOrderCustomRepresentative = true;
				ordersCtrl.addFilter("representatives", ordersCtrl.codeRepresentatives, '', ordersCtrl.i18n('l-representantes') + ": " + ordersCtrl.representativesNames);
			}

			angular.forEach(ordersCtrl.filterBy, function(value, key){
				switch(value.property){
					case "statusPortalOrder1":
						cStatusOrder = "statusPortalOrder1";
						break;
					case "statusPortalOrder2":
						cStatusOrder = "statusPortalOrder2";
						break;
					case "statusPortalOrder3":
						cStatusOrder = "statusPortalOrder3";
						break;
					case "statusPortalOrder4":
						cStatusOrder = "statusPortalOrder4";
						break;
					case "statusPortalOrder5":
						cStatusOrder = "statusPortalOrder5";
						break;
					case "statusPortalOrder6":
						cStatusOrder = "statusPortalOrder6";
						break;
					case "statusPortalOrder7":
						cStatusOrder = "statusPortalOrder7";
						break;
					case "statusPortalOrder8":
						cStatusOrder = "statusPortalOrder8";
						break;
				}

			});
			if (ordersCtrl.advancedSearch.model.statusPortalOrder1 && cStatusOrder != "statusPortalOrder1") {
				ordersCtrl.addFilter("statusPortalOrder1", ordersCtrl.advancedSearch.model.statusPortalOrder1, 'l-status-1', ordersCtrl.i18n('l-status-order-1'), ordersCtrl);
			}
			if (ordersCtrl.advancedSearch.model.statusPortalOrder2 && cStatusOrder != "statusPortalOrder2") {
				ordersCtrl.addFilter("statusPortalOrder2", ordersCtrl.advancedSearch.model.statusPortalOrder2, 'l-status-2', ordersCtrl.i18n('l-status-order-2'), ordersCtrl);
			}
			if (ordersCtrl.advancedSearch.model.statusPortalOrder3 && cStatusOrder != "statusPortalOrder3") {
				ordersCtrl.addFilter("statusPortalOrder3", ordersCtrl.advancedSearch.model.statusPortalOrder3, 'l-status-3', ordersCtrl.i18n('l-status-order-3'), ordersCtrl);
			}
			if (ordersCtrl.advancedSearch.model.statusPortalOrder4 && cStatusOrder != "statusPortalOrder4") {
				ordersCtrl.addFilter("statusPortalOrder4", ordersCtrl.advancedSearch.model.statusPortalOrder4, 'l-status-4', ordersCtrl.i18n('l-status-order-4'), ordersCtrl);
			}
			if (ordersCtrl.advancedSearch.model.statusPortalOrder5 && cStatusOrder != "statusPortalOrder5") {
				ordersCtrl.addFilter("statusPortalOrder5", ordersCtrl.advancedSearch.model.statusPortalOrder5, 'l-status-5', ordersCtrl.i18n('l-status-order-5'), ordersCtrl);
			}
			if (ordersCtrl.advancedSearch.model.statusPortalOrder6 && cStatusOrder != "statusPortalOrder6") {
				ordersCtrl.addFilter("statusPortalOrder6", ordersCtrl.advancedSearch.model.statusPortalOrder6, 'l-status-6', ordersCtrl.i18n('l-status-order-6'), ordersCtrl);
			}
			if (ordersCtrl.advancedSearch.model.statusPortalOrder7 && cStatusOrder != "statusPortalOrder7") {
				ordersCtrl.addFilter("statusPortalOrder7", ordersCtrl.advancedSearch.model.statusPortalOrder7, 'l-status-7', ordersCtrl.i18n('l-status-order-7'), ordersCtrl);
			}
			if (ordersCtrl.advancedSearch.model.statusPortalOrder8 && cStatusOrder != "statusPortalOrder8") {
				ordersCtrl.addFilter("statusPortalOrder8", ordersCtrl.advancedSearch.model.statusPortalOrder8, 'l-status-8', ordersCtrl.i18n('l-status-order-8'), ordersCtrl);
			}
		};

		this.removeSelectedFilter = function(filter) {

			ordersCtrl.advancedSearch.model[filter.property] = undefined;
			
			if (filter.property == "representatives") {
				ordersCtrl.codeRepresentatives = undefined;
				ordersCtrl.advancedSearch.listRepres = '';
			} else if (filter.property == "nrCotac") {
				$location.search('nr-cotac', null);
				ordersCtrl.nrCotac = null;
			}

			ordersCtrl.searchAdvancedFilter();
		};



		this.getOrderItens = function(order) {
			if (!order.orderItens) {
				salesOrdersResource.getOrder({nrPedido: order['nr-pedido']}, function(result) {
					order.orderItens = result.ttOrderItem;
				});
			}
		};

		this.removeFilterByProperty =  function (property) {
			angular.forEach(ordersCtrl.filterBy, function(value) {
				if (value.property === property) {
					var index = ordersCtrl.filterBy.indexOf(value);
					if (index != -1) {
						ordersCtrl.filterBy.splice(index, 1);
					}
				}
			});
		};

		this.applyRepresentativeFilter = function() {
			//Faz o filtro pelos representantes selecionados
			if($rootScope.selectedRepresentatives && $rootScope.MPDSalesOrderCustomRepresentative === false) {
				var codRepList = "";
				var nomeAbrevList = "";
				var icountRepres = 0;
				var disclaimers = [];

				angular.forEach($rootScope.selectedRepresentatives, function (value, key) {

					icountRepres = icountRepres + 1;
					codRepList = codRepList + value['nome-abrev'] + '|';
					if (icountRepres < 4) {
						if (nomeAbrevList == "") nomeAbrevList = value['cod-rep'] + ' - ' + value['nome'];
						else nomeAbrevList = nomeAbrevList + ', ' + value['cod-rep'] + ' - ' + value['nome'];
					}
					disclaimers.push({
						property: 'repres',
						value: value['nome-abrev'],
						title: value['cod-rep'] + ' - ' + value['nome']
					});
				});

				if (icountRepres > 3) {
					nomeAbrevList = nomeAbrevList + '...';
				}

				ordersCtrl.codeRepresentatives = codRepList;
				ordersCtrl.representativesNames = nomeAbrevList;
				ordersCtrl.advancedSearch.listRepres = disclaimers;

				ordersCtrl.removeFilterByProperty("representatives");
				// somente re-adiciona o filter caso este foi definido
				if (ordersCtrl.codeRepresentatives) {
					ordersCtrl.addFilter("representatives", ordersCtrl.codeRepresentatives, '', ordersCtrl.i18n('l-representantes') + ": " + ordersCtrl.representativesNames);
				}
				// Carrega a tela mesmo que não haja um filter (pode ter sido removido)
				ordersCtrl.clearDefaultData(true);
				ordersCtrl.loadOrders();
			}
		}

		this.openAdvancedSearch = function() {

			ordersCtrl.advancedSearch.model.isRepresentative = ordersCtrl.salesOrdersProfileConfig.isRepresentative;

			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/salesorders/salesorders-adv-search.html',
				controller: 'salesorder.salesorders.adv-search.Controller as controller',
				size: 'lg',
				resolve: {
					model: function() {
						return ordersCtrl.advancedSearch;
					}
				}
			});

			modalInstance.result.then(function(selectedItem) {
				ordersCtrl.codeRepresentatives = ordersCtrl.advancedSearch.codeRepresentatives;
				ordersCtrl.representativesNames = ordersCtrl.advancedSearch.representativesNames
				ordersCtrl.searchAdvancedFilter();
			});
		};


		this.getProfileConfig = function(){

			ordersCtrl.isRepresentative = false;
			ordersCtrl.isCustomer = false;

			for (var i = ordersCtrl.currentUser.length - 1; i >= 0; i--) {
				if(ordersCtrl.currentUser[i] == "representative"){
					ordersCtrl.isRepresentative = true;
				}

				if(ordersCtrl.currentUser[i] == "customer"){
					ordersCtrl.isCustomer = true;
				}
			}

			ordersCtrl.salesOrdersProfileConfig = {fields: ordersCtrl.pedVendaListaVisibleFields,
											  isRepresentative: ordersCtrl.isRepresentative,
											  isCustomer: ordersCtrl.isCustomer
											};

		}


		ordersCtrl.nrCotac = $stateParams.nrCotac;

		var title = ordersCtrl.nrCotac != undefined && ordersCtrl.nrCotac != null && ordersCtrl.nrCotac > 0 ? ordersCtrl.i18n('l-order-portfolio') + ' ' + ordersCtrl.nrCotac : ordersCtrl.i18n('l-order-portfolio');

		if (appViewService.startView(title, 'salesorder.salesorders.Controller', this)) {

			// Busca todas as empresas vinculadas ao usuario logado | Método getDataCompany presente na fchdis0035api.js |
			if (companyChange.checkContextData() === false){
				companyChange.getDataCompany(true);
			}


			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				ordersCtrl.searchAdvancedFilter();
			});

			salesOrdersResource.getOrderParam(function(ttPortalParam){
				for (var i = 0; i < ttPortalParam.length; i++) {
					if (ttPortalParam[i]['cod-param'] == 'createOrderModel') {
						ordersCtrl.canCreateModel = true;
					}
				}
			});

			//Faz o filtro pelo cliente selecionado
			if($rootScope.selectedcustomer){
				ordersCtrl.advancedSearch.model.nomAbrevIni = $rootScope.selectedcustomer['nome-abrev'];
				ordersCtrl.advancedSearch.model.nomAbrevFim = $rootScope.selectedcustomer['nome-abrev'];
				//ordersCtrl.searchAdvancedFilter();
			}

			ordersCtrl.applyRepresentativeFilter();

			$q.all([userPreference.getPreference('summaryInitDate')])
					.then(function(data) {
						var dt = new Date();
						if (data && data[0].prefValue) {
							dt = new Date(parseFloat(data[0].prefValue));
						} else {
							dt.setMonth(dt.getMonth() - 1);
						}
						if ( isNaN(dt.getTime())) {
							dt = new Date();
							dt.setMonth(dt.getMonth() - 1);
						}

						ordersCtrl.advancedSearch.model.dtEmissIni = dt.getTime();

						if (ordersCtrl.isLead === true && ordersCtrl.codEmitente) {
							//ordersCtrl.advancedSearch.model.isLead = true;
							ordersCtrl.advancedSearch.model.codIdProsp = ordersCtrl.codEmitente;
						} else if ($stateParams.nomAbrev) {
							ordersCtrl.advancedSearch.model.nomAbrevIni = $stateParams.nomAbrev;
							ordersCtrl.advancedSearch.model.nomAbrevFim = $stateParams.nomAbrev;
						}
						ordersCtrl.searchAdvancedFilter();
			});


			fchdis0035.getUserRoles({usuario: userdata['user-name']}, function(result){
				ordersCtrl.currentUser = result.out.split(",");

				fchdis0035.getVisibleFields(paramVisibleFieldsPedVendaLista, function(result) {
					ordersCtrl.pedVendaListaVisibleFields = result;
					ordersCtrl.getProfileConfig();

					angular.forEach(ordersCtrl.pedVendaListaVisibleFields, function(value) {
						if (value.fieldName === "novo-fluxo-inclusao-pedido") {
							ordersCtrl.newOrderInclusionFlow = value.fieldEnabled; 
						}
						
						if (value.fieldName === "btn-edit") {
							ordersCtrl.btnEdit = value.fieldEnabled; 
						}
						
						if (value.fieldName === "btn-copy") {
							ordersCtrl.btnCopy = value.fieldEnabled; 
						}
                        
                        if (value.fieldName === "btn-shipment") {
                            ordersCtrl.showButtonShipment = value.fieldEnabled;
                        }

					});


				});
			});


		} else {

			ordersCtrl.applyRepresentativeFilter();

			// busca os dados novamente quando feita a troca de empresa
			$rootScope.$$listeners['mpd.selectCompany.event'] = [];
			$rootScope.$on("mpd.selectCompany.event", function (event, currentcompany) {
				ordersCtrl.searchAdvancedFilter();
			});

			salesOrdersResource.getOrderParam(function(ttPortalParam){
				for (var i = 0; i < ttPortalParam.length; i++) {
					if (ttPortalParam[i]['cod-param'] == 'createOrderModel') {
						ordersCtrl.canCreateModel = true;
					}
				}
			});


			if ((ordersCtrl.isLead === true && ordersCtrl.codEmitente) && (ordersCtrl.codEmitente !== ordersCtrl.advancedSearch.model.codIdProsp)) {
				//ordersCtrl.advancedSearch.model.isLead = true;
				ordersCtrl.advancedSearch.model.codIdProsp = ordersCtrl.codEmitente;
			} else if ($stateParams.nomAbrev &&
					(ordersCtrl.advancedSearch.model.nomAbrevIni != $stateParams.nomAbrev ||
							ordersCtrl.advancedSearch.model.nomAbrevFim != $stateParams.nomAbrev)
					)
			{
				ordersCtrl.advancedSearch.model.nomAbrevIni = $stateParams.nomAbrev;
				ordersCtrl.advancedSearch.model.nomAbrevFim = $stateParams.nomAbrev;

				ordersCtrl.searchAdvancedFilter();
			}
		}

		this.loadMore = function () {
			this.findRecords(ordersCtrl.listResult.length, ordersCtrl.filterBy);			
		};

		ordersCtrl.quickSearchText = '';

		this.openModalCopy = function(nrPedidoOriginal) {

			/*
			salesOrdersResource.newCopy({}, function(data) {
				$modal.open({
					templateUrl: '/dts/mpd/html/ordercopy/ordercopy.html',
					controller: 'salesorder.modalOrderCopy.Controller as controller',
					size: 'lg',
					resolve: {
						modalParams: function() {
							return {
								nrPedidoNovo: data.nrPedido,
								nrPedidoOriginal: nrPedidoOriginal,
								nrPedidoClienteNovo: data.nrPedido
							};
						}
					}
				});
			});
			*/

			for (var i = 0; i < ordersCtrl.currentUser.length; i++) {
				if (ordersCtrl.currentUser[i] == "customer") {
					ordersCtrl.customerUser = true;
				}
			};

			// Caso perfil do usuario seja cliente faz a copia simples
			if(ordersCtrl.customerUser){
				salesOrdersResource.newCopy({}, function(data) {
					$modal.open({
						templateUrl: '/dts/mpd/html/ordercopy/ordercopy.html',
						controller: 'salesorder.modalOrderCopy.Controller as controller',
						size: 'lg',
						resolve: {
							modalParams: function() {
								return {
									nrPedidoNovo: data.nrPedido,
									nrPedidoOriginal: nrPedidoOriginal,
									nrPedidoClienteNovo: data.nrPedido
								};
							}
						}
					});
				});
			// Caso perfil do usuario seja representante faz a copia customizada
			}else{
				fchdis0051.cancopyorder ({nrPedido: nrPedidoOriginal} , function (result) {
					customService.callCustomEvent("canCopyOrder", {
						controller:ordersCtrl,
						result: result
					});
					if (result.canCopy) {
						$state.go('dts/mpd/salesorders.copy', {orderId: nrPedidoOriginal});
					}
				});
			}

		};

		this.print = function(orderId) {
			salesOrdersResource.getPrintUrl(orderId, function(url) {
				$window.open(url);
			});
		};

		this.openInvoice = function(order) {

			var invoicesUrl = '/dts/mpd/invoices/' + encodeURIComponent(order['nr-pedcli']) + '/' + encodeURIComponent(order['nome-abrev']);

			$location.path(invoicesUrl);
		}

	}//function salesOrdersCtrl()

	modalOrderCopyCtrl.$inject = ['$location', 'salesorder.salesorders.Factory', 'modalParams', '$modalInstance'];

	function modalOrderCopyCtrl($location, salesOrdersResource, modalParams, $modalInstance) {

		var _self = this;

		this.nrPedidoNovo = parseInt(modalParams.nrPedidoNovo);
		this.nrPedidoOriginal = parseInt(modalParams.nrPedidoOriginal);
		this.nrPedidoClienteNovo = parseInt(modalParams.nrPedidoClienteNovo);

		this.close = function() {
			$modalInstance.dismiss('cancel');
		};

		this.confirm = function() {

			if((_self.nrPedidoNovo == undefined) || (_self.nrPedidoClienteNovo == undefined)) return;

			salesOrdersResource.copy({nrPedido: _self.nrPedidoOriginal, newNrPedido: _self.nrPedidoNovo, newNrPedcli: _self.nrPedidoClienteNovo}, function(result) {
				$modalInstance.dismiss('confirm');
				$location.path('/dts/mpd/order/' + result.nrPedido);
			});
		};
	}

	salesordersAdvSearchController.$inject = ['$modalInstance', 'model'];
	function salesordersAdvSearchController($modalInstance, model) {
		this.advancedSearch = model;

		var ctrl = this;

		if (this.advancedSearch.listRepres) {
			ctrl.disclaimers = this.advancedSearch.listRepres;
		}

		this.search = function() {

			this.codeRepresentatives = "";
			this.representativesNames = "";

			ctrl.icountRepres = 0;
			angular.forEach(ctrl.disclaimers, function (value, key) {

				ctrl.icountRepres = ctrl.icountRepres + 1;
				ctrl.codeRepresentatives = ctrl.codeRepresentatives + value.value + '|';
				if (ctrl.icountRepres < 4) {
					if (ctrl.representativesNames == "") ctrl.representativesNames = value.title;
					else ctrl.representativesNames = ctrl.representativesNames + ', ' + value.title;
				}
			});

			if (ctrl.icountRepres > 3) {
				ctrl.representativesNames = ctrl.representativesNames + '...';
			}
			ctrl.advancedSearch.codeRepresentatives = ctrl.codeRepresentatives;
			ctrl.advancedSearch.representativesNames = ctrl.representativesNames;
			ctrl.advancedSearch.listRepres = ctrl.disclaimers;

			$modalInstance.close();
		};

		this.clear = function() {
			ctrl.advancedSearch.model.codCliIni = undefined;
			ctrl.advancedSearch.model.codCliFim = undefined;
			ctrl.advancedSearch.model.nrPedCliIni = undefined;
			ctrl.advancedSearch.model.nrPedCliFim = undefined;
			ctrl.advancedSearch.model.nrPedVendaIni = undefined;
			ctrl.advancedSearch.model.nrPedVendaFim = undefined;
			ctrl.advancedSearch.model.nomAbrevIni = undefined;
			ctrl.advancedSearch.model.nomAbrevFim = undefined;
			//ctrl.advancedSearch.model.isLead = undefined;
			ctrl.advancedSearch.model.codIdProsp = undefined;
			ctrl.advancedSearch.model.dtEmissIni = undefined;
			ctrl.advancedSearch.model.dtEmissFim = undefined;
			ctrl.advancedSearch.model.statusPortalOrder1 = undefined;
			ctrl.advancedSearch.model.statusPortalOrder2 = undefined;
			ctrl.advancedSearch.model.statusPortalOrder3 = undefined;
			ctrl.advancedSearch.model.statusPortalOrder4 = undefined;
			ctrl.advancedSearch.model.statusPortalOrder5 = undefined;
			ctrl.advancedSearch.model.statusPortalOrder6 = undefined;
			ctrl.advancedSearch.model.statusPortalOrder7 = undefined;
			ctrl.advancedSearch.model.statusPortalOrder8 = undefined;
		};

		this.close = function() {
			$modalInstance.dismiss();
		};

		this.onZoomSelectRepresentatives = function () {

			if (!this.selectedRepresentatives) return;

			if (this.selectedRepresentatives.objSelected && this.selectedRepresentatives.size >= 0) {
				this.selectedRepresentatives = this.selectedRepresentatives.objSelected;
			}

			if (!angular.isArray(this.selectedRepresentatives)) {
				this.selectedRepresentatives = [this.selectedRepresentatives];
			}

			var representatives = [];
			this.disclaimers = [];
			for (var i = 0; i < this.selectedRepresentatives.length; i++) {
				var representatives = this.selectedRepresentatives[i];
				ctrl.addDisclaimer("repres", representatives['nome-abrev'], representatives['cod-rep'] + ' - ' + representatives['nome'] + ' ');
			}

			this.allRepresentatives = representatives;
			delete this.selectedRepresentatives;
		}

		// adiciona um objeto na lista de disclaimers
		this.addDisclaimer = function (property, value, label) {
			ctrl.disclaimers.push({
				property: property,
				value: value,
				title: label
			});
		}

		// remove um disclaimer
		this.removeDisclaimer = function (disclaimer) {
			// pesquisa e remove o disclaimer do array
			var index = ctrl.disclaimers.indexOf(disclaimer);
			if (index != -1) {
				ctrl.disclaimers.splice(index, 1);
			}
		}
	}


	copyController.$inject = [
		'$rootScope',
		'$filter',
		'$stateParams',
		'$modal',
		'mpd.fchdis0051.Factory',
		'mpd.fchdis0035.factory',
		'totvs.app-main-view.Service',
		'customization.generic.Factory',
		'TOTVSEvent'];
	function copyController (
		$rootScope,
		$filter,
		$stateParams,
		$modal,
		fchdis0051,
		fchdis0035,
		appViewService,
		customService,
		TOTVSEvent) {

		var copyController = this;

		copyController.copyParams = {

			'i-situacao'       : '1',
			'i-natur-oper'     : '1',
			'l-exp-dt-entrega' : false,
			'i-qtde-item'      : '1',
			'i-origem'         : '2' /* Portal de Vendas */
		}

		var i18n = $filter('i18n');
		var currency = $filter('currency');
		var number = $filter('number');
		this.newOrderInclusionFlow = false;
		var paramVisibleFieldsPedVendaLista = {cTable: "ped-venda-lista"};

		copyController.orderId = $stateParams.orderId;

		copyController.selectEmitente = function (copy) {
			copy['cod-emitente'] = copy['emitente']['cod-emitente'];
			copy['nome-abrev']   = copy['emitente']['nome-abrev'];

			fchdis0051.changeemitentecopyorder ({nrPedido: copyController.orderId}, copy,function (result) {

				customService.callCustomEvent("changeEmitenteCopyOrder", {
					controller:copyController,
					result: result
				});

				copy['nome-transp'] = result['tt-ped-copia'][0]['nome-transp'];
				copy['cod-entrega'] = result['tt-ped-copia'][0]['cod-entrega'];
			})
		}

		copyController.orderCopies = [];
		copyController.newCopy = function () {

			copyController.copyResult = [];

			fchdis0051.newcopyorder({nrPedido: copyController.orderId} , function (result) {

				customService.callCustomEvent("newCopyOrder", {
					controller:copyController,
					result: result
				});

				copyController.orderCopies.push(result['tt-ped-copia'][0]);
			});

		}

		copyController.removeCopy = function ($index) {
			copyController.orderCopies.splice($index,1);
		}

		copyController.parameters = function () {

			var modalInstance = $modal.open({

				templateUrl: '/dts/mpd/html/salesorders/salesorders.copy.params.html',
				controller: 'salesorder.salesordersCopyParams.Controller as copyParamscontroller',
				size: 'lg',
				resolve: {
					copyParameters: function() {
						return copyController.copyParams;
					}
				}
			});

			modalInstance.result.then(function (data) {
				copyController.copyParams = data;
			});

		}

		copyController.updateItems = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/salesorders/salesorders.copy.items.html',
				controller: 'salesorder.salesordersCopyItems.Controller as copyItemsController',
				size: 'lg',
				resolve: {
					copyItems: function() {
						return copyController.copyItems;
					}
				}
			});

			modalInstance.result.then(function (data) {
				copyController.copyItems = data;
			});
		}

		copyController.executeCopy = function () {

			/* Determina a origem da cópia como Portal de Vendas */
			copyController.copyParams['i-origem'] = 2.

			fchdis0051.copyorder({nrPedido: copyController.orderId}, {'tt-copy-params':copyController.copyParams, 'tt-ped-copia':copyController.orderCopies, 'tt-item-copia':copyController.copyItems}, function (result) {

				customService.callCustomEvent("copyOrder", {controller:copyController,result: result });
				copyController.copyResult = result['tt-pedidos-criados'];

				if (result['tt-pedidos-criados'].length) {

					var lista = "";
					for(var i = 0; i < result['tt-pedidos-criados'].length; i++) {
						if (i > 0) lista = lista + ", ";
						lista = lista + result['tt-pedidos-criados'][i].nrPedido;
					}

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'info',
						title: i18n('Cópia de Pedidos', [], 'dts/mpd/'),
						detail: i18n('Os pedidos foram copiados:', [], 'dts/mpd/') + ": " + lista
					});

					copyController.orderCopies = [];
				}

			});
		}

		if(appViewService.startView(i18n('Cópia de Pedido',[],'dts/mpd') + " " + copyController.orderId,'salesorder.salesorders.CopyController', copyController)){
			fchdis0035.getVisibleFields(paramVisibleFieldsPedVendaLista, function(result) {
				angular.forEach(result, function(value) {
					if (value.fieldName === "novo-fluxo-inclusao-pedido") {
						copyController.newOrderInclusionFlow = value.fieldEnabled; 
					}
				});
			});
		}

		fchdis0051.cancopyorder ({nrPedido: copyController.orderId} , function (result) {

			customService.callCustomEvent("checkCanCopyOrder", {
				controller:copyController,
				result: result
			});

			if (!result.canCopy) {
				var views = appViewService.openViews;
				var i, len = views.length, view;

				for (i = 0; i < len; i += 1) {
					if (views[i].url === "/dts/mpd/salesorders/" + copyController.orderId + "/copy") {
						view = views[i];
						break;
					}
				}

				if (view)
					appViewService.removeView(view);

			} else {

				fchdis0051.itemcopyorder({nrPedido: copyController.orderId}, copyController.copyParams , function (result) {

					customService.callCustomEvent("itemCopyOrder", {
						controller:copyController,
						result: result
					});
					 copyController.copyItems = result['tt-item-copia'];
				});
			}
		});
	}

	copyItemsController.$inject = ['$modalInstance','copyItems'];
	function copyItemsController ($modalInstance,copyItems) {

		var copyItemsController = this;

		for(var i = 0; i < copyItems.length; i++) {
			copyItems[i].$selected = copyItems[i].selecionado;
		}

		copyItemsController.copyItems = copyItems;

		copyItemsController.confirm = function() {
			for(var i = 0; i < copyItemsController.copyItems.length; i++) {
				copyItemsController.copyItems[i].selecionado = copyItemsController.copyItems[i].$selected;
			}
			$modalInstance.close(copyItemsController.copyItems);
		}

		copyItemsController.close = function() {
			$modalInstance.dismiss('cancel');
		}

	}

	copyParamscontroller.$inject = ['$modalInstance','copyParameters'];
	function copyParamscontroller ($modalInstance,copyParameters) {
		var copyParamscontroller = this;

		copyParamscontroller.copyParameters = copyParameters;

		copyParamscontroller.confirm = function() {
			$modalInstance.close(copyParamscontroller.copyParameters);
		}

		copyParamscontroller.close = function() {
			$modalInstance.dismiss('cancel');
		}

	}

	/* Registro dos controllers */
	index.register.controller('salesorder.salesordersCopyParams.Controller', copyParamscontroller);
	index.register.controller('salesorder.salesordersCopyItems.Controller', copyItemsController);
	index.register.controller('salesorder.salesorders.Controller', salesOrdersCtrl);
	index.register.controller('salesorder.salesorders.CopyController', copyController);
	index.register.controller('salesorder.modalOrderCopy.Controller', modalOrderCopyCtrl);
	index.register.controller('salesorder.salesorders.adv-search.Controller', salesordersAdvSearchController);
});
