/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/html/opportunity/opportunity-services.detail.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/html/opportunity/sales-order/sales-order.cancel.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchdis0051.js',
	'/dts/dts-utils/js/lodash-angular.js',
	'/dts/crm/js/api/fchdis0064.js'
], function (index) {

	'use strict';

	var modalSelectEstablishment,
		controllerOpportunitySalesOrderTab,
		controllerSalesOrderSelectEstablishment;

	controllerOpportunitySalesOrderTab = function ($rootScope, $scope, $location, TOTVSEvent, helper,
		opportunityFactory, salesOrderOpportunityHelper, preferenceFactory, modalSelectEstablishment, modalCancelSalesOrder, fchdis0051Factory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunitySalesOrderTab = this;

		this.accessRestriction = undefined;

		this.listOfSalesOrder = [];
		this.listOfSalesOrderCount = 0;

		this.parent = undefined;

		this.isEnabled = true;
		this.hasDetailQuotation = false;
		this.isActiveOrder2 = false;
		this.isOpenCotacProgress = undefined;
		this.isPortalContext = false;
		this.valConfigurEstablishment = 1;
		this.selectedEstablishment = undefined;
		this.isControlCifFobEnable = false;

		this.orderDetailProgram = undefined;

		this.currentUserRepresentativeOrClient = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.loadPreferences = function (callback) {
			var count = 0, total = 4,
				isPoral = typeof (APP_BASE_URL) !== "undefined" ? (APP_BASE_URL.indexOf('/portal/') >= 0) : false;

			if (isPoral) {
				CRMControlOpportunitySalesOrderTab.isPortalContext = true;
				CRMControlOpportunitySalesOrderTab.orderDetailProgram = 1;
				if (++count === total && callback) { callback(); }
			} else {
				preferenceFactory.getPreferenceAsInteger('PROGRAM_ORDER_DETAIL', function (result) {
					CRMControlOpportunitySalesOrderTab.orderDetailProgram = result || 1;
					if (++count === total && callback) { callback(); }
				});
			}

			preferenceFactory.getPreferenceAsBoolean('COTAC_PROGRESS', function (result) {
				CRMControlOpportunitySalesOrderTab.isOpenCotacProgress = result;
				if (++count === total && callback) { callback(); }
			});

			preferenceFactory.getPreferenceAsInteger('ESTAB_COTAC_PED_VDA', function (result) {
				CRMControlOpportunitySalesOrderTab.valConfigurEstablishment = result;
				if (++count === total && callback) { callback(); }
			});

			preferenceFactory.getPreferenceAsBoolean('LOG_CONTROL_CIF_FOB', function (result) {
				CRMControlOpportunitySalesOrderTab.isControlCifFobEnable = result;
				if (++count === total && callback) { callback(); }
			});

		};

		this.load = function () {

			this.loadPreferences(function(){
				if (CRMControlOpportunitySalesOrderTab.isPortalContext === true) {
					opportunityFactory.getConfigSalesOrder($rootScope.currentuser, function (result){
						CRMControlOpportunitySalesOrderTab.hasDetailQuotation = result.isEnableQuotation;
						CRMControlOpportunitySalesOrderTab.isActiveOrder2 = result.isActiveOrder2;
					});
				}				
			});

			this.currentUserRepresentativeOrClient = CRMControlOpportunitySalesOrderTab.isCurrentUserRepresentativeOrClient();

			opportunityFactory.getSalesOrder(this.parent.num_id, function (salesorder) {
				if (!salesorder) { return; }
				CRMControlOpportunitySalesOrderTab.listOfSalesOrder = salesorder;
				CRMControlOpportunitySalesOrderTab.listOfSalesOrderCount = salesorder.length;
				salesOrderOpportunityHelper.parseSalesOrder(CRMControlOpportunitySalesOrderTab.listOfSalesOrder);
			}, true);
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		this.updateSalesOrderInList = function (order, oldOrder) {

			salesOrderOpportunityHelper.parseSalesOrder(order);

			var index = this.listOfSalesOrder.indexOf(oldOrder);

			this.listOfSalesOrder[index] = order;

		};

		this.addSalesOrderInList = function (orders) {

			var i,
				order;

			if (!orders) { return; }

			if (!angular.isArray(orders)) {
				orders = [orders];
				CRMControlOpportunitySalesOrderTab.listOfSalesOrderCount++;
			}

			salesOrderOpportunityHelper.parseSalesOrder(orders);

			for (i = 0; i < orders.length; i++) {

				order = orders[i];

				if (order) {
					CRMControlOpportunitySalesOrderTab.listOfSalesOrderCount++;
					CRMControlOpportunitySalesOrderTab.listOfSalesOrder.unshift(order);
				}

			}
		};

		this.isControlCifFobMode = function () {
			var opp = this.parent;
			return this.isControlCifFobEnable === true && (opp.num_id_estab > 0);
		};

		this.calculateSalesOrder = function (order) {
			var control = CRMControlOpportunitySalesOrderTab,
				orderNumber = order.orderNumber,
				idOportunity = control.parent.num_id;

			opportunityFactory.calculateSalesOrder(idOportunity, orderNumber, function (result) {
				if (result && angular.isArray(result) && result.length > 0) {
					control.updateSalesOrderInList(result[0], order);
				}
			});

		};

		this.generateQuotation = function () {

			var opp = this.parent,
				establishmentId,
				generateSalesOrder,				
				control = CRMControlOpportunitySalesOrderTab;

			generateSalesOrder = function (modalValue) {
				establishmentId = modalValue.ttEstabelecimento ? modalValue.ttEstabelecimento.num_id : undefined;

				opportunityFactory.generateSalesOrder(opp.num_id, true, establishmentId, modalValue.order_number, modalValue.order_cli_number, modalValue.delivery_date, function (result) {
					if (result && angular.isArray(result) && result.length > 0) {

						var orderNumber = result[0].orderNumber;

						control.addSalesOrderInList(result);

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('btn-generate-quotation', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-quotation-successfully-generated', [orderNumber], 'dts/crm')
						});

						$rootScope.$broadcast(CRMEvent.scopeSaveOpportunitySalesOrder, opp);

						if (!control.isPortalContext && control.isOpenCotacProgress === true) {
							$rootScope.$broadcast(TOTVSEvent.showQuestion, {
								title: 'l-quotation',
								cancelLabel: 'btn-cancel',
								confirmLabel: 'btn-confirm',
								text: $rootScope.i18n('msg-confirm-open-salesorder', [$rootScope.i18n('l-quotation', [], 'dts/crm').toLowerCase(), orderNumber], 'dts/crm'),
								callback: function (isPositiveResult) {
									if (isPositiveResult !== true) {
										return;
									}
									control.openCotacProgress([orderNumber, opp.num_id]);
								}
							});
						}
					}
				}, true);

			};

			this.selectEstablishment(opp, true, function (establishment) {
				generateSalesOrder(establishment);
			});

		};

		this.generateSalesOrder = function () {
			var opp = this.parent,
				establishmentId,
				generateSalesOrder,
				control = CRMControlOpportunitySalesOrderTab;

			generateSalesOrder = function (modalValue) {
				establishmentId = modalValue.ttEstabelecimento ? modalValue.ttEstabelecimento.num_id : undefined;

				if (!opp.ttConta || Number(opp.ttConta.cod_pessoa_erp) <= 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-account-erp-not-generate-sales-order', [], 'dts/crm')
					});
				} else {
					opportunityFactory.generateSalesOrder(opp.num_id, false, establishmentId, modalValue.order_number, modalValue.order_cli_number, modalValue.delivery_date, function (result) {

						if (result && angular.isArray(result) && result.length > 0) {

							var orderNumber = result[0].orderNumber;

							control.addSalesOrderInList(result);

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('btn-generate-sales-order', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-sales-order-successfully-generated', [orderNumber], 'dts/crm')
							});

							$rootScope.$broadcast(CRMEvent.scopeSaveOpportunitySalesOrder, opp);

							if (!control.isPortalContext && control.isOpenCotacProgress === true) {
								$rootScope.$broadcast(TOTVSEvent.showQuestion, {
									title: 'l-sales-order',
									cancelLabel: 'btn-cancel',
									confirmLabel: 'btn-confirm',
									text: $rootScope.i18n('msg-confirm-open-salesorder', [$rootScope.i18n('l-sales-order', [], 'dts/crm'), orderNumber], 'dts/crm'),
									callback: function (isPositiveResult) {
										if (isPositiveResult !== true) {
											return;
										}
										control.openOrderProgram([orderNumber]);
									}
								});
							}

						}
					});
				}
			};

			this.selectEstablishment(opp, false, function (opportunity) {
				generateSalesOrder(opportunity);
			});

		};

		this.cancelQuotationOrSalesOrder = function (salesOrder) {
			var fnConfirmLostOpportunity, opp = this.parent;

			fnConfirmLostOpportunity = function (result) {
				// ainda tem cotação ou pedido aberto
				if (result && result.isOK === true) { return; }

				// senão
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-set-lost-phase-to-opportunity',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n('msg-confirm-change-opportunity-to-lost-phase', [
						opp.des_oportun_vda
					], 'dts/crm'),
					callback: function (isPositiveResult) {

						if (!isPositiveResult) { return; }

						opportunityFactory.lostOpportunity(opp.num_id, function (result) {
							if (!result) { return; }

							$rootScope.$broadcast(CRMEvent.scopeSaveOpportunity, opp);

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-sucess-lost-opportunity', [
									opp.des_oportun_vda
								], 'dts/crm')
							});
						});
					}
				});
			};

			this.openCancel(salesOrder, opp, function (result) {

				if (result && result.orderNumber) {
					salesOrder.situation = 6;
					salesOrderOpportunityHelper.parseSalesOrder(CRMControlOpportunitySalesOrderTab.listOfSalesOrder);

					fchdis0051Factory.hasOpenQuotationOrOrderForOpportunity(opp.num_id, fnConfirmLostOpportunity);
				}
			});


		};

		this.openCancel = function (salesOrder, opp, callback) {
			modalCancelSalesOrder.open({
				opportunity: opp,
				salesOrder: salesOrder,
				isQuotation: salesOrder.quotation
			}).then(function (result) {
				if (callback) { callback(result); }
			});
		};

		this.selectEstablishment = function (opp, isQuotation, callback) {
			modalSelectEstablishment.open({ opportunity: opp, isQuotation: isQuotation, isCifFobMode: CRMControlOpportunitySalesOrderTab.isControlCifFobMode(), establishmentSelecMode: CRMControlOpportunitySalesOrderTab.valConfigurEstablishment }).then(function (result) {
				if (callback) { callback(result); }
			});
		};

		this.openOrderProgram = function (param) {
			var control = CRMControlOpportunitySalesOrderTab;

			switch (control.orderDetailProgram) {
				case 1:
					this.openHTMLOrderDetail(param);
					break;
				case 2:
					this.openPD4000Progress(param);
					break;
				case 3:
					this.openPD4050Progress(param);
					break;
			}
		};
		
		this.openQuotationProgram = function (param) {
			$location.url("/dts/mpd/quotation/" + param[0] + "/edit");
		};

		this.openCotacProgress = function (param) {
			this.openProgress("fch/fchcrm/fchcrm1007wqo0310.p", "fchcrm1007wqo0310", [
				{ "type": "integer", "value": param[0] },
				{ "type": "integer", "value": param[1] }
			]);
		};

		this.openPD4000Progress = function (param) {
			this.openProgress("fch/fchcrm/fchcrm1003wpd4000.p", "fchcrm1003wpd4000", [
				{ "type": "integer", "value": param[0] }
			]);
		};

		this.openPD4050Progress = function (param) {
			this.openProgress("fch/fchcrm/fchcrm1003wpd4050.p", "fchcrm1003wpd4050", [
				{ "type": "integer", "value": param[0] }
			]);
		};

		this.openHTMLOrderDetail = function (param) {
			if (CRMControlOpportunitySalesOrderTab.isPortalContext === true) {
				$location.url("/dts/mpd/orderdetail/" + param[0]);
			} else {
				$location.url("/dts/mpd/internalorderdetail/" + param[0]);
			}
		};

		this.openProgress = function (path, program, param) {
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'info',
				title: $rootScope.i18n('nav-sales-order-quotation', [], 'dts/crm'),
				detail: $rootScope.i18n('msg-open-di-flex', [], 'dts/crm')
			});
			$rootScope.openProgramProgress(path, program, param);
		};

		this.isCurrentUserRepresentativeOrClient = function () {
			var currentUser = $rootScope.currentuser;

			if (currentUser.roles.indexOf("representative") !== -1 || currentUser.roles.indexOf("client") !== -1) {
				return true;
			}
			return false;
		};

		this.init = function (opportunity, isEnabled) {
			accessRestrictionFactory.getUserRestrictions('opportunity.sales.order.tab', $rootScope.currentuser.login, function (result) {
				CRMControlOpportunitySalesOrderTab.accessRestriction = result || {};
			});

			this.parent = opportunity;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlOpportunitySalesOrderTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadOpportunity, function (event, opportunity) {
			CRMControlOpportunitySalesOrderTab.init(opportunity, opportunity.ttConta.log_acesso);
		});

		$scope.$on(CRMEvent.scopeSaveOpportunity, function (event, opportunity) {
			CRMControlOpportunitySalesOrderTab.parent = opportunity;
		});

		$scope.$on(CRMEvent.scopeCancelOpenQuotationAndOrderForOpportunity, function (event, opportunity) {
			CRMControlOpportunitySalesOrderTab.init(opportunity, opportunity.ttConta.log_acesso);
		});

	}; //controllerOpportunitySalesOrderTab

	controllerOpportunitySalesOrderTab.$inject = [
		'$rootScope', '$scope', '$location', 'TOTVSEvent', 'crm.helper', 'crm.crm_oportun_vda.factory', 'crm.opportunity-sales-order.helper', 'crm.crm_param.factory', 'crm.sales-order-select-establishment.modal', 'crm.sales-order-cancel.modal', 'crm.mpd_fchdis0051.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** CONTROLLER SELECT ESTABLISHMENT
	// *************************************************************************************
	controllerSalesOrderSelectEstablishment = function ($rootScope, $scope, $modalInstance, $filter, $timeout,
		TOTVSEvent, parameters, helper, establishmentFactory, opportunityFactory, userFactory, fchdis0064Factory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlSelectEstablishment = this;

		this.model = { num_id_estab: undefined };
		this.establishments = [];
		this.opportunity = {};
		this.isQuotation = false;
		this.modalTitle = 'btn-generate-sales-order';
		this.orderTitle = "";
		this.orderCliTitle = "";
		this.modalMessage = "";
		this.readOnlyMode = false;
		this.establishmentSelecMode = 0;

		this.reasons = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {
			if (CRMControlSelectEstablishment.opportunity.ttEstabelecimento && this.isValidModal()) {
				$modalInstance.close(CRMControlSelectEstablishment.opportunity);
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.getEstablishments = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'type_ahead', value: helper.parseStrictValue(value) };

			establishmentFactory.typeahead(filter, undefined, function (result) {
				CRMControlSelectEstablishment.establishments = result;
			});

		};

		this.getDefaultUserEstablishment = function () {
			var filter = { property: 'num_id', value: $rootScope.currentuser.idCRM };
			userFactory.typeahead(filter, undefined, function (result) {
				CRMControlSelectEstablishment.getEstablishment(result[0].num_id_estab);
			});
		};

		this.getDefaultEstablishmentPD0301 = function () {

			opportunityFactory.getDefaultEstablishmentPD0301(function (result) {
				CRMControlSelectEstablishment.getEstablishment(result);
			});

		};

		this.getEstablishment = function (id) {

			var filter = { property: 'num_id', value: id };
			establishmentFactory.typeahead(filter, undefined, function (result) {
				CRMControlSelectEstablishment.opportunity.ttEstabelecimento = result[0];
			});

		};

		this.init = function () {
			this.orderTitle = 'l-order-of-number';
			this.orderCliTitle = 'l-order-of-number-cli';
			this.modalMessage = $rootScope.i18n('msg-confirm-generate-sales-order', [this.opportunity.des_oportun_vda], 'dts/crm');
			if (this.isQuotation === true) {
				this.modalTitle = 'btn-generate-quotation';
				this.orderTitle = 'l-order-of-quotation';
				this.orderCliTitle = 'l-order-of-quotation-cli';
				this.modalMessage = $rootScope.i18n('msg-confirm-generate-quotation', [this.opportunity.des_oportun_vda], 'dts/crm');
			} 

			if (this.isCifFobMode) {

				this.readOnlyMode = true;

				if (this.isQuotation === true) {
					this.modalCifFobMessage = $rootScope.i18n('msg-confirm-generate-quotation-with-cif-fob', [], 'dts/crm');
				} else {
					this.modalCifFobMessage = $rootScope.i18n('msg-confirm-generate-sales-order-with-cif-fob', [], 'dts/crm');
				}

			} else {
				if (this.establishmentSelecMode === 1) {

					this.readOnlyMode = true;
					this.getDefaultEstablishmentPD0301();

				} else if (this.establishmentSelecMode === 2) {

					this.readOnlyMode = true;
					this.getDefaultUserEstablishment();

				}
			}

			fchdis0064Factory.newCopy({}, function (result) {
				CRMControlSelectEstablishment.opportunity.order_number = result.nrPedido;
				CRMControlSelectEstablishment.opportunity.order_cli_number = result.nrPedido;
			});
			CRMControlSelectEstablishment.opportunity.delivery_date = new Date();
		};


		this.validatorNrPedCli = function () {
			if (CRMControlSelectEstablishment.opportunity.order_cli_number) {
				if (CRMControlSelectEstablishment.opportunity.order_cli_number.length > 12) {
					CRMControlSelectEstablishment.opportunity.order_cli_number = CRMControlSelectEstablishment.opportunity.orderCliNumberVal;
				} else {
					CRMControlSelectEstablishment.opportunity.orderCliNumberVal = CRMControlSelectEstablishment.opportunity.order_cli_number;
				}
			}
		};


		this.isValidModal = function () {

			var i, fields, isPlural, message,
				messages = [],
				isValidForm = true;
			
			var title = this.isQuotation === true ? 'btn-generate-quotation' : 'btn-generate-sales-order';

			if (!CRMControlSelectEstablishment.opportunity.delivery_date) {
				isValidForm = false;
				messages.push('l-delivery-date');
			}

			if (!CRMControlSelectEstablishment.opportunity.order_cli_number) {
				isValidForm = false;
				messages.push('l-order-of-number-cli');
			}

			if (!isValidForm) {
				fields = '';
				isPlural = messages.length > 1;
				message = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (i = 0; i < messages.length; i++) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n(title, [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
				return isValidForm;
			}

			if (CRMControlSelectEstablishment.opportunity.delivery_date) {
				var date1 = new Date(CRMControlSelectEstablishment.opportunity.delivery_date);
				var date2 = new Date();
				date1.setHours(0, 0, 0, 0);
				date2.setHours(0, 0, 0, 0);

				if (date1 < date2) {
					isValidForm = false;
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n(title, [], 'dts/crm'),
						detail: $rootScope.i18n('l-delivery-date-invalid', [], 'dts/crm')
					});
				}
			}
			return isValidForm;
		};


		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		this.opportunity = parameters.opportunity ? angular.copy(parameters.opportunity) : {};
		this.isQuotation = parameters.isQuotation === true ? true : false;
		this.isCifFobMode = parameters.isCifFobMode;
		this.establishmentSelecMode = parameters.establishmentSelecMode;

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlSelectEstablishment = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerSalesOrderSelectEstablishment.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', '$timeout', 'TOTVSEvent', 'parameters', 'crm.helper',
		'crm.crm_estab.factory', 'crm.crm_oportun_vda.factory', 'crm.crm_usuar.factory', 'crm.mpd_fchdis0064.Factory'
	];

	// *************************************************************************************
	// *** MODAL SELECT ESTABLISHMENT
	// *************************************************************************************
	modalSelectEstablishment = function ($modal) {
		this.open = function (params) {

			params = params || {};

			var instance = $modal.open({
				templateUrl: '/dts/crm/html/opportunity/sales-order/select-establishment.html',
				controller: 'crm.sales-order-select-establishment.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalSelectEstablishment.$inject = ['$modal'];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.sales-order-select-establishment.modal', modalSelectEstablishment);

	index.register.controller('crm.opportunity-sales-order.tab.control', controllerOpportunitySalesOrderTab);
	index.register.controller('crm.sales-order-select-establishment.control', controllerSalesOrderSelectEstablishment);
});
