
define(['index',
		'/dts/mpd/js/userpreference.js',
		'/dts/mpd/js/portal-factories.js',
		'/dts/mpd/js/api/fchdis0047.js',
		'/dts/mpd/js/zoom/emitente.js',
		'/dts/mpd/js/zoom/usuario.js',
		'less!/dts/mpd/assets/css/portalordersmanager.less',
		'/dts/dts-utils/js/resizer.js',
		'/dts/mpd/js/api/fchdis0035api.js',
		'/dts/mpd/js/mpd-components/mpd-components.js'
], function(index) {

	index.stateProvider
			.state('dts/mpd/portalordersmanager', {
				abstract: true,
				template: '<ui-view/>'
			})
			.state('dts/mpd/portalordersmanager.start', {
				url: '/dts/mpd/portalordersmanager',
				controller: 'salesorder.portalordersmanager.Controller',
				controllerAs: 'controller',
				templateUrl: '/dts/mpd/html/portalordersmanager/portalordersmanager.html'
			})
			.state('dts/mpd/portalordersmanager.openbysummary', {
				url: '/dts/mpd/portalordersmanager/:openby',
				controller: 'salesorder.portalordersmanager.Controller',
				controllerAs: 'controller',
				templateUrl: '/dts/mpd/html/portalordersmanager/portalordersmanager.html'
			})
			.state('dts/mpd/portalordersmanager.search', {
				url: '/dts/mpd/portalordersmanager/:search',
				controller: 'salesorder.portalordersmanager.Controller',
				controllerAs: 'controller',
				templateUrl: '/dts/mpd/html/portalordersmanager/portalordersmanager.html'
			});

	portalOrdersManagerCtrl.$inject = ['$rootScope', '$state', '$stateParams', 'totvs.app-main-view.Service', 'salesorder.portalordersmanager.Factory', 'userPreference', 'portal.generic.Controller', 'customization.generic.Factory', '$modal', '$filter', 'portal.getUserData.factory', '$q', 'TOTVSEvent', 'dts-utils.Resize.Service', '$location', 'hotkeys', 'mpd.fchdis0035.factory', '$scope'];

	function portalOrdersManagerCtrl($rootScope, $state, $stateParams, appViewService, portalOrdersManagerResources, userPreference, genericController, customService, $modal, $filter, userdata, $q, TOTVSEvent, resizeService, $location, hotkeys, fchdis0035, $scope) {

		var i18n = $filter('i18n');

		var ctrl = this;
		ctrl.filterBy = [];

		ctrl.fullSize = false;

		ctrl.showWithGrid = true;

		ctrl.tabSelected = 1;

		ctrl.isCRMActive = false;

		ctrl.isWorkflowActive = false;

		ctrl.commentRepres = [];

		ctrl.qtdCommentsRepres = 0;

		portalOrdersManagerResources.max = 25;

		function getHotkeysPage() {
			return [{
						combo: 'ctrl+alt+m',
						allowIn: ['INPUT'],
						description: 'Maximizar/Minimizar',
						callback: function (event) {
							ctrl.changeSize();
						},
					}];
		}


		this.hotKeysPage = getHotkeysPage();

		this.setTabSelected = function(tabSelected){
			ctrl.tabSelected = tabSelected;

			if(ctrl.tabSelected === 1){
				//if ternario com problema no tab active
				ctrl.selectedtab1 = true;
				ctrl.selectedtab2 = false;
				ctrl.selectedtab3 = false;
				ctrl.setTypeFilter();			
				ctrl.loadData();
			}else{
				if(ctrl.tabSelected === 2){
					ctrl.selectedtab1 = false;
					ctrl.selectedtab2 = true;
					ctrl.selectedtab3 = false;
					ctrl.clearFilter();
					ctrl.setTypeFilter();
					this.addFilters();
					ctrl.loadData();
				}else{
					ctrl.selectedtab1 = false;
					ctrl.selectedtab2 = false;
					ctrl.selectedtab3 = true;
					ctrl.totalRecords = 0;
				}
			}
		}

		this.setTypeFilter = function(){
			if(ctrl.tabSelected === 1){
				ctrl.filterBy.push({label: 'typesearch', property: 'typesearch', value: '0', title: 'typesearch', hide: true});
			}else{
				if(ctrl.tabSelected === 2){
					ctrl.filterBy.push({label: 'typesearch', property: 'typesearch', value: '1', title: 'typesearch', hide: true});
				}
			}
		};

		genericController.decorate(this, portalOrdersManagerResources);

		this.startPreferences = function(){
			$q.all([userPreference.getPreference('summaryOrderManagerStartorder'),
				userPreference.getPreference('summaryOrderManagerEndorder'),

				userPreference.getPreference('summaryOrderManagerStartcustomerorder'),
				userPreference.getPreference('summaryOrderManagerEndcustomerorder'),

				userPreference.getPreference('summaryOrderManagerStartshortname'),
				userPreference.getPreference('summaryOrderManagerEndshortname'),

				userPreference.getPreference('summaryOrderManagerStartrepresentative'),
				userPreference.getPreference('summaryOrderManagerEndrepresentative'),

				userPreference.getPreference('summaryOrderManagerSponsoruser'),
				userPreference.getPreference('summaryOrderManagerDayswithoutmov'),

				userPreference.getPreference('summaryOrderManagerTypeDateWhitoutMov'),
				userPreference.getPreference('portalordersmanager.showgrid'),


				])
				.then(function(data) {

					ctrl.advancedSearch = {model: {}};

					ctrl.advancedSearch.model.startorder = data[0].prefValue;

					ctrl.advancedSearch.model.endorder = data[1].prefValue;

					ctrl.advancedSearch.model.startcustomerorder = data[2].prefValue;

					ctrl.advancedSearch.model.endcustomerorder = data[3].prefValue;

					ctrl.advancedSearch.model.startshortname = data[4].prefValue;

					ctrl.advancedSearch.model.endshortname = data[5].prefValue;

					ctrl.advancedSearch.model.startrepresentative = data[6].prefValue;

					ctrl.advancedSearch.model.endrepresentative = data[7].prefValue;

					ctrl.advancedSearch.model.sponsoruser = data[8].prefValue;

					if(isNaN(data[9].prefValue)) {
						ctrl.advancedSearch.model.dayswithoutmov = 0;
						ctrl.dayswithoutmov = 0;
					} else {
						ctrl.advancedSearch.model.dayswithoutmov =  parseInt(data[9].prefValue);
						ctrl.dayswithoutmov =  parseInt(data[9].prefValue);
					}

					if(data[10].prefValue)
						ctrl.advancedSearch.model.consideraDiasSemMovto = parseInt(data[10].prefValue);
					else
						ctrl.advancedSearch.model.consideraDiasSemMovto = 0;

					if(data[11]){
						if(data[11].prefValue == 'true') ctrl.showWithGrid = true;
						else ctrl.showWithGrid = false;
					}else{
						ctrl.showWithGrid = true;
					}

					//Faz o filtro pelo cliente selecionado
					if($rootScope.selectedcustomer){
						ctrl.advancedSearch.model.startshortname = $rootScope.selectedcustomer['nome-abrev'];
						ctrl.advancedSearch.model.endshortname = $rootScope.selectedcustomer['nome-abrev'];
					}

					ctrl.setFiltersTags();
					ctrl.loadData();
				});
		}

		this.setQuickFilter = function(opt) {

			switch (opt) {
			   case 2:
				   this.labelSimpleFilter = i18n('l-canceled-in-portal');
				   break;
			   case 3:
				   this.labelSimpleFilter = i18n('l-write-x-days') + " " + ctrl.dayswithoutmov + " " +  i18n('l-days');
				   break;
			   case 4:
				   this.labelSimpleFilter = i18n('l-status-order-2');
				   break;
			   case 5:
				   this.labelSimpleFilter = i18n('l-ready-for-approval');
				   break;
			   case 6:
				   this.labelSimpleFilter = i18n('l-pending-for-approval');
				   break;
			   case 8:
				   this.labelSimpleFilter = i18n('l-status-order-manager-11');
				   break;
			}

			ctrl.clearFilter();

			if((opt != 3) && (opt != 4) && (opt != 5)){
				ctrl.addFilter("filterlegend", opt, '', this.labelSimpleFilter);
			}else{
				if(opt === 3){
					//param 1 - Tipo de data por liberação no portal ou por emissão do pedido (0 ou 1)
					//param 2 - dias sem movimento
					//param 3 - opção de filtro por legenda
					var daysWithoutMovWithType = ctrl.advancedSearch.model.consideraDiasSemMovto + "|" + ctrl.dayswithoutmov + "|" + opt;
					ctrl.addFilter("dayswithoutmov", daysWithoutMovWithType, '', i18n('l-write-x-days') + " " + ctrl.dayswithoutmov + " " +  i18n('l-days'));
				}else{
					if(opt === 4){
						ctrl.addFilter("writestatus", opt + "|" + ctrl.dayswithoutmov, '', this.labelSimpleFilter);
					}
				}
			}

			//se não há integração com workflows não retorna dados para situação 'pendente de aprovação'.
			if((opt === 6)&&($rootScope.portalmanagerparamworkflowactive === false)){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-msg-portal-manager-status-pend-aprov')
				});
				return;
			}

			ctrl.setTypeFilter();
			this.addFilters();
			this.loadData();
		}

		this.addFilters = function() {

			ctrl.setFiltersTags();

			$q.all([userPreference.setPreference('summaryOrderManagerStartorder', ctrl.advancedSearch.model.startorder),
				userPreference.setPreference('summaryOrderManagerEndorder', ctrl.advancedSearch.model.endorder),

				userPreference.setPreference('summaryOrderManagerStartcustomerorder', ctrl.advancedSearch.model.startcustomerorder),
				userPreference.setPreference('summaryOrderManagerEndcustomerorder', ctrl.advancedSearch.model.endcustomerorder),

				userPreference.setPreference('summaryOrderManagerStartshortname', ctrl.advancedSearch.model.startshortname),
				userPreference.setPreference('summaryOrderManagerEndshortname', ctrl.advancedSearch.model.endshortname),

				userPreference.setPreference('summaryOrderManagerStartrepresentative', ctrl.advancedSearch.model.startrepresentative),
				userPreference.setPreference('summaryOrderManagerEndrepresentative', ctrl.advancedSearch.model.endrepresentative),

				userPreference.setPreference('summaryOrderManagerSponsoruser', ctrl.advancedSearch.model.sponsoruser),
				userPreference.setPreference('summaryOrderManagerDayswithoutmov', ctrl.advancedSearch.model.dayswithoutmov),

				userPreference.setPreference('summaryOrderManagerTypeDateWhitoutMov', ctrl.advancedSearch.model.consideraDiasSemMovto)])
			.then(function() {});
		}

		this.setFiltersTags = function(){

			//ctrl.clearFilter();

			if ($stateParams.openby == 'openbysummary') {
				ctrl.advancedSearch.model.startorder = undefined;
				ctrl.advancedSearch.model.endorder = undefined;
				ctrl.advancedSearch.model.startcustomerorder = undefined;
				ctrl.advancedSearch.model.endcustomerorder = undefined;
				ctrl.advancedSearch.model.startshortname = undefined;
				ctrl.advancedSearch.model.endshortname = undefined;
				ctrl.advancedSearch.model.startrepresentative = undefined;
				ctrl.advancedSearch.model.endrepresentative = undefined;
				ctrl.advancedSearch.model.dateemiss = undefined;
				ctrl.advancedSearch.model.datelib = undefined;
				ctrl.advancedSearch.model.sponsoruser = undefined;
			}

			if (ctrl.quickSearchText) {
				ctrl.addFilter("simpleFilter", ctrl.quickSearchText, '', i18n('l-simple-filter') + ": " + ctrl.quickSearchText);
			}

			if (ctrl.advancedSearch.model.startorder) {
				ctrl.addFilter("startorder", ctrl.advancedSearch.model.startorder, '', i18n('l-nr-order-start') + ": " + ctrl.advancedSearch.model.startorder);
			}

			if (ctrl.advancedSearch.model.endorder) {
				ctrl.addFilter("endorder", ctrl.advancedSearch.model.endorder, '', i18n('l-nr-order-end') + ": " + ctrl.advancedSearch.model.endorder);
			}

			if (ctrl.advancedSearch.model.startcustomerorder) {
				ctrl.addFilter("startcustomerorder", ctrl.advancedSearch.model.startcustomerorder, '', i18n('l-nr-customer-order-start') + ": " + ctrl.advancedSearch.model.startcustomerorder);
			}

			if (ctrl.advancedSearch.model.endcustomerorder) {
				ctrl.addFilter("endcustomerorder", ctrl.advancedSearch.model.endcustomerorder, '', i18n('l-nr-customer-order-end') + ": " + ctrl.advancedSearch.model.endcustomerorder);
			}

			if (ctrl.advancedSearch.model.startshortname) {
				ctrl.addFilter("startshortname", ctrl.advancedSearch.model.startshortname, '', i18n('l-nr-customer-short-name-start') + ": " + ctrl.advancedSearch.model.startshortname);
			}

			if (ctrl.advancedSearch.model.endshortname) {
				ctrl.addFilter("endshortname", ctrl.advancedSearch.model.endshortname, '', i18n('l-nr-customer-short-name-end') + ": " + ctrl.advancedSearch.model.endshortname);
			}

			if (ctrl.advancedSearch.model.startrepresentative) {
				ctrl.addFilter("startrepresentative", ctrl.advancedSearch.model.startrepresentative, '', i18n('l-representative-start') + ": " + ctrl.advancedSearch.model.startrepresentative);
			}

			if (ctrl.advancedSearch.model.endrepresentative) {
				ctrl.addFilter("endrepresentative", ctrl.advancedSearch.model.endrepresentative, '', i18n('l-representative-end') + ": " + ctrl.advancedSearch.model.endrepresentative);
			}

			if (ctrl.advancedSearch.model.dateemiss) {
				var vDtEmiss = $filter('date')(ctrl.advancedSearch.model.dateemiss, 'shortDate');
				ctrl.addFilter("dateemiss", vDtEmiss, '', i18n('l-initial-dt-impl') + ": " + vDtEmiss);
			}else{

				if ((ctrl.vDate != undefined) && (ctrl.vDate != '')) {
					var date = new Date(parseInt(ctrl.vDate));
					ctrl.advancedSearch.model.dateemiss = date;
					var vDtEmiss = $filter('date')(ctrl.advancedSearch.model.dateemiss, 'shortDate');
					ctrl.addFilter("dateemiss", vDtEmiss, '', i18n('l-initial-dt-impl') + ": " + vDtEmiss);
				}else{
					var dt = new Date();
					dt.setMonth(dt.getMonth() - 1);
					ctrl.advancedSearch.model.dateemiss = dt;
					var vDtEmiss = $filter('date')(ctrl.advancedSearch.model.dateemiss, 'shortDate');
					ctrl.addFilter("dateemiss", vDtEmiss, '', i18n('l-initial-dt-impl') + ": " + vDtEmiss);
				}
			}

			if (ctrl.advancedSearch.model.datelib) {
				var vDtLib = $filter('date')(ctrl.advancedSearch.model.datelib, 'shortDate');
				ctrl.addFilter("datelib", vDtLib, '', i18n('l-date-lib') + ": " + vDtLib);
			}

			if (ctrl.advancedSearch.model.sponsoruser) {
				ctrl.addFilter("sponsoruser", ctrl.advancedSearch.model.sponsoruser, '', i18n('l-user-sponsor') + ": " + ctrl.advancedSearch.model.sponsoruser);
			}

			ctrl.dayswithoutmov = ctrl.advancedSearch.model.dayswithoutmov;

		
			ctrl.addFilter("filterlegend", 5, '', i18n('l-ready-for-approval'));

		}

		this.removeSelectedFilter = function(filter) {

			ctrl.removeFilter(filter);

			if (filter.property == "simpleFilter") {
				ctrl.quickSearchText = '';
			}

			delete ctrl.advancedSearch.model[filter.property];
			ctrl.loadData();
		}

		this.search = function() {
			ctrl.clearFilter();
			ctrl.setTypeFilter();
			this.addFilters();
			this.loadData();
		}

		this.loadData = function() {
			ctrl.max = 25;

			this.findRecords(null, ctrl.filterBy).then(function(){
				ctrl.resizeView();
			});
		};

		this.loadMore = function() {
			ctrl.max = 25;

			this.findRecords(ctrl.listResult.length, ctrl.filterBy).then(function(){
				ctrl.resizeView();
			});
		};

		this.changeSize = function(){
			ctrl.fullSize = !ctrl.fullSize;
			resizeService.doResize();
		}

		this.resizeView = function(){
			resizeService.doResize();
		}

		this.openAdvancedSearch = function() {
			var modalInstance = $modal.open({
			  templateUrl: '/dts/mpd/html/portalordersmanager/portalordersmanager-adv-search.html',
			  controller: 'salesorder.portalordersmanager.adv-search.Controller as controller',
			  size: 'lg',
			  resolve: {
					model: function () {
					  return ctrl.advancedSearch;
					}
			  }
			});

			modalInstance.result.then(function (selectedItem) {
				ctrl.clearFilter();
				ctrl.setTypeFilter();
				ctrl.addFilters();
				ctrl.loadData();
			});
		}

		this.getOrderItens = function(orderManager) {
			if (!orderManager.orderItens) {
				portalOrdersManagerResources.getOrderItems({nrPedido: orderManager['nr_pedido']}, function(result) {
					orderManager.orderItens = result;
				});

				portalOrdersManagerResources.getCommentRepres({nrPedido: orderManager['nr_pedido']}, function(result) {
					orderManager.commentRepres = result;
				});
			}
		};

		this.removeOrder = function (orderManager) {

			if (!orderManager) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'alert',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-order')
				});
			} else {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-remove-order-title',
					text: "Confirma a exclusão dos pedidos selecionados?",
					cancelLabel: 'l-no',
					confirmLabel: 'l-yes',
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							portalOrdersManagerResources.deleteOrder(orderManager, function (result) {
								if (result.$hasError == true) {
									return;
								}
								else {
									ctrl.loadData();
								}
							});
						}
					}
				});
			}
		};


		this.openOrderHistory = function(order){

			if(!order || order.length > 1){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'alert',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-order')
				});
			}else{
				$location.url('/dts/mpd/internalorderhistory/' + order[0].nr_pedido);
			}
		}

		this.portalOrdersSanitize = function(){

			var messages = [];
			var isInvalidForm = false;

			if ((ctrl.orderSanitize.params.dtInicial == undefined) || (ctrl.orderSanitize.params.dtInicial == '')) {
				isInvalidForm = true;
			}

			// se for invalido, monta e mostra a mensagem
			if(isInvalidForm === true) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-valid-initial-date')
				});
			}else{

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
						title: 'l-remove-order-title',
						text: $rootScope.i18n('l-remove-order-sanitize-text'),
						cancelLabel: 'l-no',
						confirmLabel: 'l-yes',
					callback: function(isPositiveResult) {
						if (isPositiveResult) {
							portalOrdersManagerResources.portalOrdersSanitize({eliminaPedCancel: ctrl.orderSanitize.params.eliminaPedCancel,
																   eliminaPedNaoLib: ctrl.orderSanitize.params.eliminaPedNaoLib,
																   dtEmissao: ctrl.orderSanitize.params.dtEmissao,
																   diasSemLib: ctrl.orderSanitize.params.diasSemLib,
																   dtInicial: ctrl.orderSanitize.params.dtInicial,
																   nomeAbrev: ctrl.orderSanitize.params.nomeAbrev}, function(result){

								if(result.$hasError == true){
									return;
								}else{
									$rootScope.$broadcast(TOTVSEvent.showNotification, {
										type: 'success',
										title: $rootScope.i18n('l-information'),
										detail: $rootScope.i18n('l-sanitaize-order-with-success')
									});
								}
							});
						}
					}
				});
			}
		}

		this.disableButton = function () {
			if(ctrl.selectedOrderToApprove && ctrl.selectedOrderToApprove.length > 0) {
				for (var i = 0; i < ctrl.selectedOrderToApprove.length; i++) {
					if (ctrl.selectedOrderToApprove[i].cod_sit_ped != '1' &&
						ctrl.selectedOrderToApprove[i].cod_sit_ped != '2')
						return true;
				}
			} else
				return true;

			return false;
		}

		this.showBadge = function() {
			
			if(ctrl.selectedOrderToApprove && ctrl.selectedOrderToApprove.length == 1) {
				for (var i = 0; i < ctrl.selectedOrderToApprove.length; i++) {
					if (ctrl.selectedOrderToApprove[i].qtd_interac_rep != '0' ) {
						ctrl.qtdCommentsRepres = ctrl.selectedOrderToApprove[i].qtd_interac_rep;
						return true;
					}
				}
			}

			return false;
		}

		this.openModalSavaAndSendTask = function(orderManager) {

			var cotationLead = 0;
			
			if (orderManager.length > 0) { // Pedidos selecionados na grade
				for (var i = 0; i < orderManager.length; i++) {
					if (orderManager[i].crmAccountName && orderManager[i].log_cotacao ) {
						cotationLead++;
					}
				}
				
				if (cotationLead > 0) {				
					if (cotationLead == 1) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'warning',
							title: $rootScope.i18n('l-lead-cotation'),
							detail: $rootScope.i18n('l-convert-quote')
						});
						$location.url('/dts/mpd/pd4000/' + orderManager[0].nr_pedido);
					} else {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'warning',
							title: $rootScope.i18n('l-lead-cotation'),
							detail: $rootScope.i18n('l-convert-quote')
						});
					}
				} else {
					var modalInstance = $modal.open({
						templateUrl: '/dts/mpd/html/portalordersmanager/portalordersmanager.saveandsendtask.html',
						controller: 'mpd.portalordersmanager.saveandsendtask.Controller as controller',
						size: 'lg',
						resolve: {
							model: function () {
								return orderManager;
							}
						}
					});

					modalInstance.result.then(function () {
						ctrl.loadData();
					});
				}
			} else { // Pedidos selecionados na lista
				if (orderManager.cod_id_prosp) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('l-lead-cotation'),
						detail: $rootScope.i18n('l-convert-quote')
					});
					$location.url('/dts/mpd/pd4000/' + orderManager.nr_pedido);
				} else {
					var modalInstance = $modal.open({
						templateUrl: '/dts/mpd/html/portalordersmanager/portalordersmanager.saveandsendtask.html',
						controller: 'mpd.portalordersmanager.saveandsendtask.Controller as controller',
						size: 'lg',
						resolve: {
							model: function () {
								return orderManager;
							}
						}
					});

					modalInstance.result.then(function () {
						ctrl.loadData();
					});
				}
			}
		}

		this.approveOrderCancelation = function(orderManager, approve){

			if(!orderManager){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'alert',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-order')
				});
			}else{
				portalOrdersManagerResources.approveOrderCancelationWhitoutWorkflow({approve: approve}, orderManager,function(result) {
					if(result.$hasError == true){
						return;
					}
					else{
						ctrl.loadData();
					}
				});
			}
		}


		this.setShowWithGrid = function(){
			ctrl.showWithGrid = !ctrl.showWithGrid;
			$q.all([userPreference.setPreference('portalordersmanager.showgrid', ctrl.showWithGrid)]).then(function() {});
			resizeService.doResize();
		};


		this.removeFilters = function(){

			ctrl.clearFilter();

			if (ctrl.quickSearchText) {
				ctrl.quickSearchText = '';
			}

			this.setTypeFilter();

			this.loadData();
		};

		this.isCRMActive = function (callback) {
			fchdis0035.isCRMActive(function(result) {
				ctrl.isCRMActive =  (result && result.isActive) ? result.isActive : false;
				if (callback) { callback(vm.isCRMActive); }
			});
		};

		if (appViewService.startView($rootScope.i18n('l-portal-orders-manager'), "salesorder.portalordersmanager.Controller", this)) {

			$rootScope.$on('removeMobileFilters', function(event, data) {
				ctrl.removeFilters();
			});

			ctrl.isCRMActive();

			portalOrdersManagerResources.paramWorkflowActive(function(result) {

				if ($stateParams.openby == 'openbysummary') {

					$q.all([userPreference.getPreference('summaryOrderManagerInitDate')]).then(function(results) {
					   ctrl.vDate = results[0].prefValue;
					});

				}

				//parametros de integração com workflows
				$rootScope.portalmanagerparamworkflowactive = result.workflowactive;
				ctrl.isWorkflowActive = result.workflowactive;
				ctrl.clearFilter();
				ctrl.startPreferences();
				ctrl.orderSanitize = {params: {}};
				ctrl.orderSanitize.params.eliminaPedCancel = false;
				ctrl.orderSanitize.params.eliminaPedNaoLib = false;
				ctrl.orderSanitize.params.dtEmissao = 1;
				ctrl.orderSanitize.params.diasSemLib = 0;
				ctrl.orderSanitize.params.dtInicial = undefined;
				ctrl.orderSanitize.params.nomeAbrev = " ";
			});
		}else {
			ctrl.startPreferences();
		}

	} // function portalOrdersManagerCtrl(loadedModules)

	index.register.controller('salesorder.portalordersmanager.Controller', portalOrdersManagerCtrl);

	portalOrdersManagerAdvSearchController.$inject = ['$rootScope', '$modalInstance', 'model', '$filter', 'TOTVSEvent'];
	function portalOrdersManagerAdvSearchController($rootScope, $modalInstance, model, $filter, TOTVSEvent) {

		var i18n = $filter('i18n');

		this.advancedSearch = model;

		this.search = function () {
			$modalInstance.close();
		}

		this.close = function () {
			$modalInstance.dismiss();
		}

		this.removeFilters = function() {
			$rootScope.$emit("removeMobileFilters", "removeFilters");
		}

		this.comboDiasSemMovto = [
			{codDiasSemMovto: 0, descDiasSemMovto: i18n('l-dt-ult-alt-portal', [], 'dts/mpd/')},
			{codDiasSemMovto: 1, descDiasSemMovto: i18n('l-data-implant', [], 'dts/mpd/')}
		];

		this.clear = function() {
			this.advancedSearch.model.startorder = undefined;
			this.advancedSearch.model.endorder = undefined;
			this.advancedSearch.model.startcustomerorder = undefined;
			this.advancedSearch.model.endcustomerorder = undefined;
			this.advancedSearch.model.startshortname = undefined;
			this.advancedSearch.model.endshortname = undefined;
			this.advancedSearch.model.startrepresentative = undefined;
			this.advancedSearch.model.endrepresentative = undefined;
			this.advancedSearch.model.dateemiss = undefined;
			this.advancedSearch.model.datelib = undefined;
			this.advancedSearch.model.sponsoruser = undefined;
			this.advancedSearch.model.dayswithoutmov = 0;
			this.advancedSearch.model.consideraDiasSemMovto = 0;
		};
	}
	index.register.controller('salesorder.portalordersmanager.adv-search.Controller', portalOrdersManagerAdvSearchController);

	portalOrdersManagerSaveAndSendTask.$inject = ['salesorder.portalordersmanager.Factory', '$modalInstance', 'model', '$filter', 'TOTVSEvent'];
	function portalOrdersManagerSaveAndSendTask(portalOrdersManagerResources, $modalInstance, model, $filter, TOTVSEvent) {

		var i18n = $filter('i18n');
		var ctrl = this;
		ctrl.selectedOptionTask = 0;
		ctrl.orderManager = model;

		this.taskOptions = function(orderManager){
			portalOrdersManagerResources.taskOptions({nrPedCli: orderManager.nr_pedcli, nomeAbrev: orderManager.nome_abrev }, orderManager, function(result) {
				ctrl.taskOptionsList = result;
				if(ctrl.taskOptionsList[0]) ctrl.selectedOptionTask = ctrl.taskOptionsList[0].id;

				if(ctrl.taskOptionsList[0]){
					switch(ctrl.taskOptionsList[0].id){
						case 2:	 /*Atividade de transferencia no workflows*/
							ctrl.observacao = i18n('l-msg-franfer-task', [], 'dts/mpd/');
							this.loadUser(ctrl.orderManager);
							break;
						case 4: /*Atividade de aprovação no workflows*/
							ctrl.observacao = i18n('l-msg-approve-task', [], 'dts/mpd/');
							break;
						case 6: /*Atividade de reprovação no workflows*/
							ctrl.observacao = i18n('l-msg-reprove-task', [], 'dts/mpd/');
							break;
					}
				}

			});
		};

		this.loadUser = function(orderManager){
			portalOrdersManagerResources.loadUser({selecao: ctrl.selectedOptionTask}, orderManager, function(result) {
				ctrl.usersToTransfer = result;
				if(ctrl.usersToTransfer[0]) ctrl.selectedUserToTransfer = ctrl.usersToTransfer[0].username;
			});
		};

		this.saveAndSendTask = function () {
			switch (ctrl.selectedOptionTask) {
				case 0: //Atividade de assumir workflow
					ctrl.actionType = "ASSUMIR";
					break;
				case 2: //Atividade de transferencia no workflows
					ctrl.actionType = "TRANSFERIR";
					break;
				case 4: //Atividade de aprovação no workflows
					ctrl.actionType = "APROVACAO";
					break;
				case 6: //Atividade de reprovação no workflows
					ctrl.actionType = "REPROVACAO";
					break;
			}

			ctrl.parametersToSendTask = {
				selecao: ctrl.selectedOptionTask,
				descricao: ctrl.observacao,
				usuario: ctrl.selectedUserToTransfer,
				tela: ctrl.actionType
			};

			var obj = {
				ttParamSendTask: ctrl.parametersToSendTask,
				ttPedVenda: ctrl.orderManager
			};

			portalOrdersManagerResources.saveAndSendTask({}, obj, function (result) {
				if (result.$hasError == true) {
					return;
				} else {
					$modalInstance.close();
				}
			});
		};

		this.changeOptionTask = function(){
			switch(ctrl.selectedOptionTask) {
				case 2:
					ctrl.observacao = i18n('l-msg-process-trans-task', [], 'dts/mpd/');
					ctrl.loadUser(ctrl.orderManager);
					break;
				case 4:
					ctrl.observacao = i18n('l-msg-process-approved-task', [], 'dts/mpd/');
					break;
				case 6:
					ctrl.observacao = i18n('l-msg-process-reproved-task', [], 'dts/mpd/');
					break;
			}
		}

		this.close = function () {
			$modalInstance.dismiss();
		}

		ctrl.taskOptions(ctrl.orderManager);
	}
	index.register.controller('mpd.portalordersmanager.saveandsendtask.Controller', portalOrdersManagerSaveAndSendTask);

});