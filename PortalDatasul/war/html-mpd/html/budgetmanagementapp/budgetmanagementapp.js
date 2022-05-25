define(['index', '/dts/mpd/js/userpreference.js', '/dts/mpd/js/portal-factories.js', '/dts/mpd/js/api/fchdis0061.js', 'less!/dts/mpd/assets/css/budgetmanagementapp.less', '/dts/dts-utils/js/resizer.js', '/dts/mpd/js/api/fchdis0035api.js'], function (index) {

	index.stateProvider
		.state('dts/mpd/budgetmanagementapp', {
			abstract: true,
			template: '<ui-view/>'
		})
		.state('dts/mpd/budgetmanagementapp.start', {
			url: '/dts/mpd/budgetmanagementapp',
			controller: 'salesorder.budgetmanagementapp.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/mpd/html/budgetmanagementapp/budgetmanagementapp.html'
		})
		.state('dts/mpd/budgetmanagementapp.search', {
			url: '/dts/mpd/budgetmanagementapp/:search',
			controller: 'salesorder.budgetmanagementapp.Controller',
			controllerAs: 'controller',
			templateUrl: '/dts/mpd/html/budgetmanagementapp/budgetmanagementapp.html'
		});

	budgetManagementAppCtrl.$inject = ['$rootScope', '$state', '$stateParams', 'totvs.app-main-view.Service', 'mpd.budgetManagementApp.Factory', 'userPreference', 'portal.generic.Controller', 'customization.generic.Factory', '$modal', '$filter', 'portal.getUserData.factory', '$q', 'TOTVSEvent', 'dts-utils.Resize.Service', '$location', 'hotkeys','$timeout', 'mpd.fchdis0035.factory', 'salesorder.salesorders.Factory', '$scope'];

	function budgetManagementAppCtrl($rootScope, $state, $stateParams, appViewService, budgetManagementAppResources, userPreference, genericController, customService, $modal, $filter, userdata, $q, TOTVSEvent, resizeService, $location, hotkeys, $timeout, fchdis0035, orderResource, $scope) {

		var i18n = $filter('i18n');

		var ctrl 	       = this;
		ctrl.filterBy      = [];
		ctrl.userRoles     = [];
		ctrl.isUserAnalyst = false;
		ctrl.isUserRep     = false;
		ctrl.fullSize      = false;
		ctrl.date = $filter('date');
		budgetManagementAppResources.max = 50;
		ctrl.newOrderInclusionFlow = false;

		this.disclaimers = [];

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

		genericController.decorate(this, budgetManagementAppResources);

		this.startPreferences = function (userRoles) {

			$q.all([userPreference.getPreference('budgetManagementAppStartCodRep'),
					userPreference.getPreference('budgetManagementAppEndCodRep'),
					userPreference.getPreference('budgetManagementAppStartCodOrcto'),
					userPreference.getPreference('budgetManagementAppEndCodOrcto'),
					userPreference.getPreference('budgetManagementAppStartDatOrcto'),
					userPreference.getPreference('budgetManagementAppEndDatOrcto'),
					userPreference.getPreference('budgetManagementAppStartDatOrctoSinc'),
					userPreference.getPreference('budgetManagementApEndDatOrctoSinc'),
					userPreference.getPreference('budgetManagementAppStartNrPedCli'),
					userPreference.getPreference('budgetManagementAppEndNrPedCli'),
					userPreference.getPreference('budgetManagementAppStartNomeAbrev'),
					userPreference.getPreference('budgetManagementAppEndNomeAbrev')/*,
					userPreference.getPreference('budgetManagementShowGrid')*/
				])
				.then(function (data) {

					ctrl.advancedSearch = {
						model: {}
					};

					ctrl.advancedSearch.model.startCodRep 		= data[0].prefValue;
					ctrl.advancedSearch.model.endCodRep 		= data[1].prefValue;
					ctrl.advancedSearch.model.startCodOrcto 	= data[2].prefValue;
					ctrl.advancedSearch.model.endCodOrcto 		= data[3].prefValue;
					ctrl.advancedSearch.model.startDatOrcto 	= data[4].prefValue ? new Date(Number(data[4].prefValue)).getTime() : '';
					ctrl.advancedSearch.model.endDatOrcto 		= data[5].prefValue ? new Date(Number(data[5].prefValue)).getTime() : '';
					ctrl.advancedSearch.model.startDatOrctoSinc = data[6].prefValue ? new Date(Number(data[6].prefValue)).getTime() : '';
					ctrl.advancedSearch.model.endDatOrctoSinc 	= data[7].prefValue ? new Date(Number(data[7].prefValue)).getTime() : '';
					ctrl.advancedSearch.model.startNrPedCli 	= data[8].prefValue;
					ctrl.advancedSearch.model.endNrPedCli 		= data[9].prefValue;
					ctrl.advancedSearch.model.startNomeAbrev 	= data[10].prefValue;
					ctrl.advancedSearch.model.endNomeAbrev   	= data[11].prefValue;
					//ctrl.showWithGrid 						 	= data[12].prefValue;

					//if (ctrl.showWithGrid == ""){
					//	ctrl.showWithGrid = 'false';
					//}

					resizeService.doResize();

					ctrl.setFiltersTags();
					ctrl.loadData();
				});
		}

		this.setQuickFilter = function (opt) {

			switch (opt) {
				case 1:
					this.labelSimpleFilter = i18n('l-status-budget-1');
					break;
				case 2:
					this.labelSimpleFilter = i18n('l-status-budget-2');
					break;
				case 3:
					this.labelSimpleFilter = i18n('l-status-budget-3');
					break;
				case 4:
					this.labelSimpleFilter = i18n('l-status-budget-4');
					break;
				case 5:
					this.labelSimpleFilter = i18n('l-status-budget-5');
					break;
			}

			ctrl.clearFilter();
			ctrl.addFilter("filterlegend", opt, '', this.labelSimpleFilter);

			this.addFilters();
			this.loadData();
		}

		this.addFilters = function () {

			ctrl.setFiltersTags();

			$q.all([userPreference.setPreference('budgetManagementAppStartCodRep', ctrl.advancedSearch.model.startCodRep),
					userPreference.setPreference('budgetManagementAppEndCodRep', ctrl.advancedSearch.model.endCodRep),
					userPreference.setPreference('budgetManagementAppStartCodOrcto', ctrl.advancedSearch.model.startCodOrcto),
					userPreference.setPreference('budgetManagementAppEndCodOrcto', ctrl.advancedSearch.model.endCodOrcto),
					userPreference.setPreference('budgetManagementAppStartDatOrcto', ctrl.advancedSearch.model.startDatOrcto ? ctrl.advancedSearch.model.startDatOrcto : ''),
					userPreference.setPreference('budgetManagementAppEndDatOrcto', ctrl.advancedSearch.model.endDatOrcto ? ctrl.advancedSearch.model.endDatOrcto : ''),
					userPreference.setPreference('budgetManagementAppStartDatOrctoSinc', ctrl.advancedSearch.model.startDatOrctoSinc ? ctrl.advancedSearch.model.startDatOrctoSinc : ''),
					userPreference.setPreference('budgetManagementApEndDatOrctoSinc', ctrl.advancedSearch.model.endDatOrctoSinc ? ctrl.advancedSearch.model.endDatOrctoSinc : ''),
					userPreference.setPreference('budgetManagementAppStartNrPedCli', ctrl.advancedSearch.model.startNrPedCli),
					userPreference.setPreference('budgetManagementAppEndNrPedCli', ctrl.advancedSearch.model.endNrPedCli),
					userPreference.setPreference('budgetManagementAppStartNomeAbrev', ctrl.advancedSearch.model.startNomeAbrev),
					userPreference.setPreference('budgetManagementAppEndNomeAbrev', ctrl.advancedSearch.model.endNomeAbrev)
				])
				.then(function () {});
		}

		this.setFiltersTags = function () {

			if (ctrl.quickSearchText) {
				ctrl.addFilter("simpleFilter", ctrl.quickSearchText, '', i18n('l-simple-filter') + ": " + ctrl.quickSearchText);
			}

			if (ctrl.advancedSearch.model.startCodRep) {
				ctrl.addFilter("startCodRep", ctrl.advancedSearch.model.startCodRep, '', i18n('l-initial-rep-pri') + ": " + ctrl.advancedSearch.model.startCodRep);
			}

			if (ctrl.advancedSearch.model.endCodRep) {
				ctrl.addFilter("endCodRep", ctrl.advancedSearch.model.endCodRep, '', i18n('l-final-rep-pri') + ": " + ctrl.advancedSearch.model.endCodRep);
			}

			if (ctrl.advancedSearch.model.startCodOrcto) {
				ctrl.addFilter("startCodOrcto", ctrl.advancedSearch.model.startCodOrcto, '', i18n('l-initial-code-budget') + ": " + ctrl.advancedSearch.model.startCodOrcto);
			}

			if (ctrl.advancedSearch.model.endCodOrcto) {
				ctrl.addFilter("endCodOrcto", ctrl.advancedSearch.model.endCodOrcto, '', i18n('l-final-code-budget') + ": " + ctrl.advancedSearch.model.endCodOrcto);
			}

			if (ctrl.advancedSearch.model.startDatOrcto) {
				var vDtEmiss = $filter('date')(ctrl.advancedSearch.model.startDatOrcto, 'shortDate');
				ctrl.addFilter("startDatOrcto", vDtEmiss, '', i18n('l-initial-date-budget') + ": " + vDtEmiss);
			} else {
				var dt = new Date();
				dt.setMonth(dt.getMonth() - 1);
				ctrl.advancedSearch.model.startDatOrcto = dt;
				var vDtEmiss = $filter('date')(ctrl.advancedSearch.model.startDatOrcto, 'shortDate');
				ctrl.addFilter("startDatOrcto", vDtEmiss, '', i18n('l-initial-date-budget') + ": " + vDtEmiss);
			}

			if (ctrl.advancedSearch.model.endDatOrcto) {
				var vDtEmissEnd = $filter('date')(ctrl.advancedSearch.model.endDatOrcto, 'shortDate');
				ctrl.addFilter("endDatOrcto", vDtEmissEnd, '', i18n('l-final-date-budget') + ": " + vDtEmissEnd);
			}

			if (ctrl.advancedSearch.model.startDatOrctoSinc) {
				var vDtEmissSinc = $filter('date')(ctrl.advancedSearch.model.startDatOrctoSinc, 'shortDate');
				ctrl.addFilter("startDatOrctoSinc", vDtEmissSinc, '', i18n('l-initial-date-synced-budget') + ": " + vDtEmissSinc);
			}

			if (ctrl.advancedSearch.model.endDatOrctoSinc) {
				var vDtEmissSincEnd = $filter('date')(ctrl.advancedSearch.model.endDatOrctoSinc, 'shortDate');
				ctrl.addFilter("endDatOrctoSinc", vDtEmissSincEnd, '', i18n('l-final-date-synced-budget') + ": " + vDtEmissSincEnd);
			}

			if (ctrl.advancedSearch.model.startNrPedCli) {
				ctrl.addFilter("startNrPedCli", ctrl.advancedSearch.model.startNrPedCli, '', i18n('l-initial-nr-customer-order') + ": " + ctrl.advancedSearch.model.startNrPedCli);
			}

			if (ctrl.advancedSearch.model.endNrPedCli) {
				ctrl.addFilter("endNrPedCli", ctrl.advancedSearch.model.endNrPedCli, '', i18n('l-final-nr-customer-order') + ": " + ctrl.advancedSearch.model.endNrPedCli);
			}

			if (ctrl.advancedSearch.model.startNomeAbrev) {
				ctrl.addFilter("startNomeAbrev", ctrl.advancedSearch.model.startNomeAbrev, '', i18n('l-initial-nome-abrev') + ": " + ctrl.advancedSearch.model.startNomeAbrev);
			}

			if (ctrl.advancedSearch.model.endNomeAbrev) {
				ctrl.addFilter("endNomeAbrev", ctrl.advancedSearch.model.endNomeAbrev, '', i18n('l-final-nome-abrev') + ": " + ctrl.advancedSearch.model.endNomeAbrev);
			}
		}

		this.removeSelectedFilter = function (filter) {
			ctrl.removeFilter(filter);

			if (filter.property == "simpleFilter") {
				ctrl.quickSearchText = '';
			}

			delete ctrl.advancedSearch.model[filter.property];
			ctrl.loadData();
		}

		this.search = function () {
			ctrl.clearFilter();
			this.addFilters();
			this.loadData();
		}

		this.getBudgetList = function (start) {

			if (start === null || start === undefined)
					this.listResult = [];

			var properties = [];
			var values = [];

			// Aplica os filtros
			if (ctrl.filterBy) {
				if (ctrl.filterBy instanceof Array) {
					angular.forEach(ctrl.filterBy, function (filter) {
						if (filter.property) {
							properties.push(filter.property);
							values.push(filter.value);
						}
					});
				} else {
					if (ctrl.filterBy.property) {
						properties.push(ctrl.filterBy.property);
						values.push(ctrl.filterBy.value);
					}
				}
			}

			var params = {
				start: ctrl.listResult.length,
				max: 50,
				properties: properties,
				values: values,
				orderBy: this.orderBy,
				asc: this.asc,
				userLogin: userdata['login'],
				isUserAnalyst: ctrl.isUserAnalyst
			};

			budgetManagementAppResources.getBudgetList(params, function (result) {
				ctrl.listResult = ctrl.listResult.concat(result['ttBudget']);
				ctrl.totalRecords = result.REST_paramcount;
				ctrl.resizeView();				
			});

			this.listBudgetProblem = [];
			this.listBudgetProblemErrors = [];
			budgetManagementAppResources.getBudgetProblem(function (result) {
				ctrl.listBudgetProblem = ctrl.listBudgetProblem.concat(result['ttBudget']);
				ctrl.listBudgetProblemErrors = ctrl.listBudgetProblemErrors.concat(result['ttBudgetProblem']);
			});

		};

		this.itemsGridEdit = function(event, column, value, original) {
			ctrl.currentDatValid = event.model['dat-valid'];

			$timeout(function () {
				var inputs = $(event.container).find("input:focus:text");
				if (inputs.length > 0) inputs[0].setSelectionRange(0,999);
			},50);
		}

		this.itemsGridSave = function(event, column, value, original, currentIndex) {

			if (original[column.column] != undefined &&
					value != undefined &&
					value != null &&
					original[column.column].toString().toUpperCase() === value.toString().toUpperCase()) {
				return;
			}

			if (value == undefined || value == null) {
				event.preventDefault();
				return;
			}
			
			var valueExpiredDateParam = new Date(value).getTime();
			var valueExpiredDate = new Date(value);
			ctrl.inputDatValid = $(event.container).eq(currentIndex); //.find("input:focus:text");

			event.preventDefault();

			budgetManagementAppResources.updateBudgetExpiredDate({budgetId: ctrl.selectedBudget['cdn-orcto-id'], expiredDate: valueExpiredDateParam},function(result){
				if(!result.$hasError){
					ctrl.inputDatValid.context.innerHTML = valueExpiredDate.toISOString().substr(0, 10).split('-').reverse().join('/');

					ctrl.selectedBudget['dat-valid'] = valueExpiredDate;
					ctrl.selectedBudget['cdn-sit-orcto'] = 1;
					ctrl.selectedBudget['desc-sit-orcto'] = $rootScope.i18n('l-status-budget-1');

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('l-budget'),
						detail: $rootScope.i18n('l-success-update-expired-date') + '!'
					});
				}
			});

		}

		this.loadData = function () {
			ctrl.getBudgetList();
		};

		this.loadMore = function () {
			ctrl.getBudgetList(ctrl.listResult.length);
		};

		this.changeSize = function () {
			ctrl.fullSize = !ctrl.fullSize;
			resizeService.doResize();
		}

		this.resizeView = function () {
			resizeService.doResize();
		}

		this.openAdvancedSearch = function () {
			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/budgetmanagementapp/budgetmanagementapp-adv-search.html',
				controller: 'salesorder.budgetmanagementapp.adv-search.Controller as controller',
				size: 'lg',
				resolve: {
					model: function () {
						return {advancedSearch: ctrl.advancedSearch,
								isUserAnalyst: ctrl.isUserAnalyst
						}
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				ctrl.clearFilter();
				ctrl.addFilters();
				ctrl.loadData();
			});
		}
        
        this.setBudgetLiberate = function setBudgetLiberate(budget) {
            if (budget != undefined){
                budgetManagementAppResources.putLiberateBudget({budgetId: budget['cdn-orcto-id']},function(result){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
                        type: 'success',
                        title: $rootScope.i18n('l-budget'),
                        detail: $rootScope.i18n('l-success-liberated') + '!'
					});
					ctrl.loadData(); 
				});
            }
		}
		
		this.openGenerateOrderView = function openGenerateOrderView(budget) {

			if(budget != undefined){

				if(budget['nr-pedido'] > 0){
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-attention'),
						detail: $rootScope.i18n('Já foi gerado um pedido de venda para esse orçamento!')
					});
				}else{
					let nrPedido;
					orderResource.newCopy(function(result){
						nrPedido = result['nrPedido'];
						budgetManagementAppResources.createOrderAndItems({nrPedido: nrPedido,
																		nomeAbrev: budget['nome-abrev'],
																		codOrcto: budget['cod-orcto']}, function(result){
							if(!result['$hasError']){
								if(ctrl.isUserRep){
									$location.url('/dts/mpd/order/'+nrPedido);
								}else if(ctrl.isUserAnalyst){
									$location.url('/dts/mpd/pd4000/'+nrPedido);
								}else{

								}
							}
						})
					})
				}
			}else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-a-relationship')
				});
			}
		};

		this.cancelBudgetView = function cancelBudgetView(budget) {

			if(budget != undefined){

				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/budgetmanagementapp/budgetmanagementapp.confirm.html',
					controller: 'budgetmanagementapp.confirm.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'md'
				});


				modalInstance.result.then(function (data) {

					if (data.motivo == undefined) data.motivo = "?";

					budgetManagementAppResources.putCancelOrder({ codOrcto: budget['cod-orcto'],
																  nrPedido: budget['nr-pedido'],
																  nomeAbrev: budget['nome-abrev'],
																  motivo: data.motivo }, function(result){
							if(!result['$hasError']){
								ctrl.clearFilter();
								ctrl.startPreferences();
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'success',
									title: $rootScope.i18n('l-success'),
									detail: $rootScope.i18n('l-order-canceled')
								});
							}
					})

				});
			 }else{
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-a-relationship')
				});
			}
		};

		this.openBudgetProblem = function(){

			var modalInstance = $modal.open({
				templateUrl: '/dts/mpd/html/budgetmanagementapp/budgetmanagementapp.problem.html',
				controller: 'budgetmanagementapp.problem.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: {
					modalParams: function() {
						return {
							budgetProblem: ctrl.listBudgetProblem,
							budgetProblemErrors: ctrl.listBudgetProblemErrors,
							isUserRep: ctrl.isUserRep,
							isUserAnalyst: ctrl.isUserAnalyst
						}
					}
				}
			});

			modalInstance.result.then(function (data) {			

				if (data.openOrder) {

					if(ctrl.isUserAnalyst){
						$location.url('/dts/mpd/pd4000/'+ data.nrPedido);
					}else if(ctrl.isUserRep){
						if (!ctrl.newOrderInclusionFlow) {
							$location.url('/dts/mpd/order/'+ data.nrPedido);
						} else {
							$location.url('/dts/mpd/order2/'+ data.nrPedido + '/edit');
						}
					}

					/*if(ctrl.isUserAnalyst){
						$location.url('/dts/mpd/internalorderdetail/'+ data.nrPedido);
					}else if(ctrl.isUserRep && !ctrl.isUserAnalyst){
						$location.url('/dts/mpd/orderdetail/'+ data.nrPedido);
					}*/
				} else if (data.close){
					budgetManagementAppResources.getBudgetProblem(function (result) {
						ctrl.listBudgetProblem = [];
						ctrl.listBudgetProblemErrors = [];
						ctrl.listBudgetProblem = ctrl.listBudgetProblem.concat(result['ttBudget']);
						ctrl.listBudgetProblemErrors = ctrl.listBudgetProblemErrors.concat(result['ttBudgetProblem']);
					});
				}
			});
		}

		this.showObs = function (budget) {
			if (budget.observacao != null) {
				var modalInstance = $modal.open({
					templateUrl: '/dts/mpd/html/budgetmanagementapp/budgetmanagementapp.desc.html',
					controller: 'budgetmanagementapp.desc.control as controller',
					backdrop: 'static',
					keyboard: false,
					size: 'md',
					resolve: {
						modalParams: function () {
							return {
								title: "l-observation", 
								description: budget.observacao
							}
						}
					}
				})
			}			
		}

		this.showCancel = function (budget) {

			if (budget != undefined && budget['cdn-sit-orcto'] == 4) {

				budgetManagementAppResources.getDescCancel({ nrPedido: budget['nr-pedido'], codOrcto: budget['cod-orcto'] }, function (result) {
					if (!result.$hasError) {

						let whyItWasCancelled = result['p-desc-cancel'];

						var modalInstance = $modal.open({
							templateUrl: '/dts/mpd/html/budgetmanagementapp/budgetmanagementapp.desc.html',
							controller: 'budgetmanagementapp.desc.control as controller',
							backdrop: 'static',
							keyboard: false,
							size: 'md',
							resolve: {
								modalParams: function() {
									return {
										title:"l-motive-cancel",
										description: whyItWasCancelled
									}
								}
							}
						});						
					}
				});
			}
		}

		this.openCommunicationView = function openCommunicationView(budget) {

			if(!budget){
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'alert',
					title: $rootScope.i18n('l-attention'),
					detail: $rootScope.i18n('l-select-budget'),
				});
			}
			else{
				$location.url('/dts/mpd/budgetcommunication/'+budget['cdn-orcto-id']+'/'+budget['cod-orcto']);
			}


		};


		this.getBudgetItems = function (orderManager) {
			if (!orderManager.orderItens) {
				budgetManagementAppResources.getBudgetItems({nrPedido: orderManager['cdn-orcto-id']}, function (result) {
					orderManager.orderItens = result;
				});
			}
		};

		this.setShowWithGrid = function (value) {
			//if(value != ctrl.showWithGrid){
			//   ctrl.showWithGrid = value;
			//   $q.all([userPreference.setPreference('budgetManagementShowGrid', ctrl.showWithGrid)]).then(function () {});
			//   resizeService.doResize();
			//}
		};

		this.removeFilters = function () {
			ctrl.clearFilter();

			if (ctrl.quickSearchText) {
				ctrl.quickSearchText = '';
			}
			this.loadData();
		};


		this.init = function init(isStartedView){

			var hasError = false;

			$timeout(function () {
				budgetManagementAppResources.getParameters(function(result) {

					if (!result['QP_l_log_usa_app']){
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'warning',
							title: $rootScope.i18n('l-warning'),
							detail: $rootScope.i18n('l-param-app', [], 'dts/mpd/')
						});
						var pageActive = appViewService.getPageActive();
							appViewService.releaseConsume(pageActive);
							appViewService.removeView(pageActive);
					   }
					});
				}, 500);

			if (!hasError) {
				fchdis0035.getUserRoles({usuario: userdata['login']}, function(result){
					ctrl.userRoles = result.out.split(",");
					ctrl.isUserRep     = (ctrl.userRoles.indexOf("representative") > -1);
					ctrl.isUserAnalyst = (ctrl.userRoles.indexOf("analystsalesorder") > -1);

					if(isStartedView){

						var paramVisibleFieldsPedVendaDetalhe = {cTable: "ped-venda-detalhe"};
						fchdis0035.getVisibleFields(paramVisibleFieldsPedVendaDetalhe, function(result) {
							angular.forEach(result, function(value) {
								if (value.fieldName === "novo-fluxo-inclusao-pedido") {
									ctrl.newOrderInclusionFlow = value.fieldEnabled; 
								}
							});
						});


						ctrl.clearFilter();
						ctrl.startPreferences();
					}else{
						resizeService.doResize();
						ctrl.loadData();
					}

				})
			}
		}

		if (appViewService.startView($rootScope.i18n('l-portal-orders-manager'), "salesorder.budgetmanagementapp.Controller", this)){
			ctrl.init(true);
		}else{
			ctrl.init(false);
		}

	}

	index.register.controller('salesorder.budgetmanagementapp.Controller', budgetManagementAppCtrl);

	budgetManagementAppAdvSearchCtrl.$inject = ['$modalInstance', 'model', '$filter', 'TOTVSEvent'];

	function budgetManagementAppAdvSearchCtrl($modalInstance, model, $filter, TOTVSEvent) {

		var i18n = $filter('i18n');

		this.advancedSearch = model.advancedSearch;

		if(!model.isUserAnalyst){
			this.showFilterRep = true;
		}

		this.search = function () {
			$modalInstance.close();
		}

		this.close = function () {
			$modalInstance.dismiss();
		}

		this.clear = function () {
			this.advancedSearch.model.startCodRep = undefined;
			this.advancedSearch.model.endCodRep = undefined;
			this.advancedSearch.model.startCodOrcto = undefined;
			this.advancedSearch.model.endCodOrcto = undefined;
			this.advancedSearch.model.startDatOrcto = undefined;
			this.advancedSearch.model.endDatOrcto = undefined;
			this.advancedSearch.model.startDatOrctoSinc = undefined;
			this.advancedSearch.model.endDatOrctoSinc = undefined;
			this.advancedSearch.model.startNrPedCli = undefined;
			this.advancedSearch.model.endNrPedCli = undefined;
			this.advancedSearch.model.startNomeAbrev = undefined;
			this.advancedSearch.model.endNomeAbrev = undefined;
		};
	}
	index.register.controller('salesorder.budgetmanagementapp.adv-search.Controller', budgetManagementAppAdvSearchCtrl);

	budgetCancelController.$inject = ['$modalInstance'];
	function budgetCancelController($modalInstance) {

		var controller = this;

		controller.close = function() {
			$modalInstance.dismiss('cancel');
		}

		controller.confirm = function(){
			$modalInstance.close({
				motivo: controller.motivoCancelamento
			});
		}
	}
	index.register.controller('budgetmanagementapp.confirm.control', budgetCancelController);

	budgetModalDescController.$inject = ['$modalInstance', 'modalParams'];
	function budgetModalDescController($modalInstance, modalParams) {

		var controller = this;

		controller.title = modalParams['title'];
		controller.description = modalParams['description'];

		controller.close = function() {
			$modalInstance.dismiss('cancel');
		}

	}
	index.register.controller('budgetmanagementapp.desc.control', budgetModalDescController);

	budgetProblemController.$inject = ['$rootScope','$modalInstance', '$location', 'modalParams', 'mpd.budgetManagementApp.Factory', 'TOTVSEvent'];
	function budgetProblemController($rootScope, $modalInstance, $location, modalParams, budgetManagementAppResources, TOTVSEvent) {

		var controller = this;

		controller.budgetProblem = modalParams.budgetProblem;
		controller.budgetProblemErrors = modalParams.budgetProblemErrors;
		controller.isUserRep = modalParams.isUserRep;
		controller.isUserAnalyst = modalParams.isUserAnalyst;		

		angular.forEach(controller.budgetProblem, function (budgetProblem) {			
			var count = 1;
			angular.forEach(controller.budgetProblemErrors, function (budgetProblemErrors) {
				if (budgetProblemErrors.codOrcto == budgetProblem['cod-orcto']){					
					budgetProblem.totalRecords = count++;
				}
			});
		});

		controller.getBudgetProblemErrors = function(budgetProblem){

			budgetProblem.budgetErrors = [];

			angular.forEach(controller.budgetProblemErrors, function (budgetProblemErrors) {
				if (budgetProblemErrors.codOrcto == budgetProblem['cod-orcto']) {
					budgetProblem.budgetErrors = budgetProblem.budgetErrors.concat(budgetProblemErrors);
				}
			});
		}

		controller.completeReviewError = function(budgetProblem){			
			budgetManagementAppResources.putCompleteReviewError({codOrcto: budgetProblem['cod-orcto']}, function(result){

				if (result['ttBudget']){					
					controller.budgetProblem = [];
					controller.budgetProblemErrors = [];
					controller.budgetProblem = controller.budgetProblem.concat(result['ttBudget']);
					controller.budgetProblemErrors = controller.budgetProblemErrors.concat(result['ttBudgetProblem']);

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('l-success'),
						detail: $rootScope.i18n('l-budget-conclude-error-sucess')
					});
				}				
			});
		}

		controller.openOrder = function(budget){
			$modalInstance.close({
				openOrder: true,
				nrPedido: budget['nr-pedido']
			});		
		}

		controller.close = function() {			
			$modalInstance.close({
				close: true
			});
		}		
	}
	index.register.controller('budgetmanagementapp.problem.control', budgetProblemController);

});