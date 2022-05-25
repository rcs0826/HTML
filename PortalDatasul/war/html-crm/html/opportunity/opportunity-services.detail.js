/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1007.js',
	'/dts/crm/js/api/fchcrm1009.js',
	'/dts/crm/js/api/fchcrm1019.js',
	'/dts/crm/js/api/fchcrm1020.js',
	'/dts/crm/js/api/fchcrm1029.js',
	'/dts/crm/js/api/fchcrm1030.js',
	'/dts/crm/js/api/fchcrm1044.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1047.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/js/zoom/crm_produt.js',
	'/dts/crm/js/zoom/crm_tab_preco.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/html/task/task-services.advanced-search.js',
	'/dts/crm/html/task/task-services.calendar.js',
	'/dts/crm/html/task/task-services.detail.js',
	'/dts/crm/html/task/task-services.edit.js',
	'/dts/crm/html/task/task-services.list.js',
	'/dts/crm/html/history/history-services.list.js',
	'/dts/crm/html/history/history-services.detail.js',
	'/dts/crm/html/history/history-services.advanced-search.js',
	'/dts/crm/html/history/history-services.edit.js',
	'/dts/crm/html/account/account-services.list.js',
	'/dts/crm/html/account/account-services.detail.js',
	'/dts/crm/html/account/account-services.edit.js',
	'/dts/crm/html/account/account-services.advanced-search.js',
	'/dts/crm/html/attachment/attachment-services.js',
	'/dts/crm/html/opportunity/product/product-services.js',
	'/dts/crm/html/opportunity/gain-loss/gain-loss-services.js',
	'/dts/crm/html/opportunity/sales-order/sales-order-services.js',
	'/dts/crm/html/opportunity/strong-weak/strong-weak-services.js',
	'/dts/crm/html/opportunity/resale/resale-services.js',
	'/dts/crm/html/opportunity/competitor/competitor-services.js',
	'/dts/crm/html/opportunity/contact/contact-services.js',
	'/dts/crm/html/e-mail/e-mail-services.js',
	'/dts/crm/html/report/report-services.list.js',
	'/dts/crm/html/report/report-services.edit.js',
	'/dts/crm/html/report/report-services.detail.js',
	'/dts/crm/html/report/report-services.available.js',
	'/dts/crm/html/report/report-services.parameter.js',
	'/dts/crm/html/report/report-services.advanced-search.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/js/api/fchdis0051.js',
	'/dts/crm/html/opportunity/sales-order/sales-order.cancel.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerOpportunityDetail;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************
	controllerOpportunityDetail = function ($rootScope, $scope, $stateParams, $filter, TOTVSEvent, appViewService,
								  opportunityHelper, opportunityFactory, helper, $location,
								  modalAccountSummary, legend, modalOpportunityEdit, $timeout,
								  preferenceFactory, accountFactory, serviceOpportunityParam,
								  userSummaryModal, modalHistoryEdit, modalEmailEdit, fchdis0051Factory, modalCancelSalesOrder, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlOpportunityDetail = this;

		this.accessRestriction = undefined;

		this.model = undefined;

		this.groupAccountOpen = false;

		this.groupAttributeOpen = true;

		this.loadAccountContent = false;

		this.isIntegratedWithEMS = false;
		this.isIntegratedWithGP = false;
		this.isControlCifFobEnable = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.parseColor = function (colorId) {
			return opportunityHelper.funnelColors[colorId - 1].nom_cor;
		};

		this.load = function (id, dispatchBroadcast) {

			opportunityFactory.getRecord(id, function (result) {

				if (result) {

					opportunityHelper.parseOpportunityColor(result);

					CRMControlOpportunityDetail.model = result;

					if (CRMControlOpportunityDetail.groupAccountOpen) {
						accountFactory.getSummary(CRMControlOpportunityDetail.model.ttConta.num_id, function (result) {
							if (result) {
								CRMControlOpportunityDetail.model.ttConta = result;
								CRMControlOpportunityDetail.loadAccountContent = true;
							}
						});
					}

					opportunityFactory.getDescription(id, function (description) {
						if (description) {
							CRMControlOpportunityDetail.model.dsl_oportun_vda = description.dsl_oportun_vda;
						}
					});
					if (dispatchBroadcast !== true) {
						$timeout(function () {
							$scope.$broadcast(CRMEvent.scopeLoadOpportunity, result);
						});
					}

				}
			});
		};

		this.loadAccountSummary = function () {
			if (this.loadAccountContent !== false) { return; }

			accountFactory.getSummary(this.model.ttConta.num_id, function (result) {
				if (result) {
					CRMControlOpportunityDetail.model.ttConta = result;
					CRMControlOpportunityDetail.loadAccountContent = true;
				}
			});
		};

		this.detailLink = function (id, model, $event) {
			/*Faz não disparar o evento do accordion que está por trás*/
			$event.preventDefault();
			$event.stopPropagation();
			$location.path('/dts/crm/' + model + '/detail/' + id);
		};

		this.loadPreferences = function (callback) {
			var count = 0, total = 3;

			preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControlOpportunityDetail.isIntegratedWithGP = result;
				if (++count === total && callback) { callback(); }
			});

			preferenceFactory.isIntegratedWithEMS(function (result) {
				CRMControlOpportunityDetail.isIntegratedWithEMS = result;
				if (++count === total && callback) { callback(); }
			});

			preferenceFactory.getPreferenceAsBoolean('LOG_CONTROL_CIF_FOB', function (result) {
				CRMControlOpportunityDetail.isControlCifFobEnable = result;
				if (++count === total && callback) { callback(); }
			});

		};

		this.openAccountSummary = function () {
			if (this.model.ttConta) {
				modalAccountSummary.open({model: this.model.ttConta, isAccount: true});
			}
		};

		this.reopen = function (opp) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-reopen', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-reopen', [
					$rootScope.i18n('l-opportunity', [], 'dts/crm').toLowerCase(), opp.des_oportun_vda
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					var strategyId = opp.num_id_estrateg_vda;

					opportunityFactory.getAllPhases(strategyId, function (result) {

						if (!result) { return; }

						var i,
							vo,
							phases = result,
							isEditAvailable = false,
							devId = 0;

						for (i = 0; i < phases.length; i++) {
							if (phases[i].num_id === opp.num_id_fase) {
								isEditAvailable = phases[i].log_permite_alter;
							}

							if ((devId === 0) && (phases[i].log_fechto_fase === false)) {
								devId = phases[i].num_id;
							}
						}

						if (isEditAvailable === true) {
							if (devId !== 0) {
								vo = opp;
								vo.num_id_fase = devId;
								vo.dat_fechto_oportun = "";
								CRMControlOpportunityDetail.updateOpportunity(vo, opp);
							} else {
								$rootScope.$broadcast(TOTVSEvent.showNotification, {
									type: 'error',
									title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
									detail: $rootScope.i18n('msg-phase-not-found-to-reopening', [], 'dts/crm')
								});
							}
						} else {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'error',
								title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-phase-not-allow-change', [], 'dts/crm')
							});
						}

					},   true);
				}
			});

		};

		this.toogleSuspend = function () {
			var opportunity = CRMControlOpportunityDetail.model,
				title,
				msg;

			if (!opportunity) { return; }

			title = ((opportunity.log_suspenso !== true) ? 'l-confirm-suspend' : 'l-confirm-reactivate');

			msg = ((opportunity.log_suspenso !== true) ? 'msg-confirm-suspend' : 'msg-confirm-reactivate');

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: title,
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n(msg, [
					$rootScope.i18n('l-opportunity', [], 'dts/crm').toLowerCase(), opportunity.des_oportun_vda
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					opportunityFactory.toogleSuspendOpportunity(opportunity.num_id, function (result) {
						if (CRMUtil.isUndefined(result)) {
							return;
						}

						CRMControlOpportunityDetail.model = result;
						$scope.$broadcast(CRMEvent.scopeSaveOpportunity, CRMControlOpportunityDetail.model);

					});

				}
			});

		};

		this.lost = function (opp) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-set-lost-phase-to-opportunity', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-lost-opportunity', [
					opp.des_oportun_vda
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					opportunityFactory.lostOpportunity(opp.num_id, function (result) {
						if (!result) { return; }

						CRMControlOpportunityDetail.model = result;
						$scope.$broadcast(CRMEvent.scopeSaveOpportunity, CRMControlOpportunityDetail.model);

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-sucess-lost-opportunity', [
								opp.des_oportun_vda
							], 'dts/crm')
						});

						CRMControlOpportunityDetail.cancelQuotationAndSalesOrder(CRMControlOpportunityDetail.model);
					});
				}
			});

		};

		this.cancelQuotationAndSalesOrder = function (opp) {
			if (CRMUtil.isUndefined(opp)) { return; }

			if (CRMControlOpportunityDetail.isIntegratedWithEMS !== true) { return; }

			var fnConfirmCancel;

			fnConfirmCancel = function (result) {
				// se tiver cotações ou pedidos abertos então questiona se deseja cancelar
				if (result && result.isOK === true) {

					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
						title: $rootScope.i18n('l-confirm-cancellation', [], 'dts/crm'),
						cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
						confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
						text: $rootScope.i18n('msg-confirm-cancellation-quotation-and-orders', [], 'dts/crm'),
						callback: function (isPositiveResult) {

							if (!isPositiveResult) { return; }

							CRMControlOpportunityDetail.openCancelQuotationAndSalesOrder(opp);
						}
					});

				}
			};

			fchdis0051Factory.hasOpenQuotationOrOrderForOpportunity(opp.num_id, fnConfirmCancel);
		};

		this.openCancelQuotationAndSalesOrder = function (opp, callback) {
			modalCancelSalesOrder.open({
				opportunity: opp,
				allOpenQuotationAndOrderForOpportunity: true
			}).then(function (result) {
				if (callback) { callback(result); }
			});
		};

		this.updateOpportunity = function (vo, opportunity) {
			opportunityFactory.updateRecord(vo.num_id, vo, function (result) {

				if (!result) { return; }

				CRMControlOpportunityDetail.afterSave(result, opportunity);

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-update-opportunity', [
						opportunity.des_oportun_vda
					], 'dts/crm')
				});
			});
		};

		this.afterSave = function (opportunity, oldOpportunity, isChangeStatus) {

			opportunityHelper.parseOpportunityColor(opportunity);

			CRMControlOpportunityDetail.model = opportunity;

			if (isChangeStatus !== true) {
				if (opportunity.ttEstrategia) {
					if ((opportunity.ttEstrategia.log_inclui_acao === true) && CRMUtil.isDefined(oldOpportunity)) {
						CRMControlOpportunityDetail.registerHistory(opportunity, true);
					}
				} else {
					var filter = { property: 'num_id',  value: opportunity.num_id };
					opportunityFactory.findRecords(filter, undefined, function (result) {
						if (!result) { return; }
						var opp = result[0];
						if ((opp.ttEstrategia.log_inclui_acao === true) && CRMUtil.isDefined(oldOpportunity)) {
							CRMControlOpportunityDetail.registerHistory(opp, false);
						}
					});
				}
			}

			$scope.$broadcast(CRMEvent.scopeSaveOpportunity, opportunity);
		};

		this.registerHistory = function (opportunity) {
			modalHistoryEdit.open({
				history: {
					ttOportunidadeOrigem: opportunity
				}
			}).then(function (history) {
				// TODO: ?
			});
		};

		this.sendEmail = function (opportunity) {
			modalEmailEdit.open({
				model: {
					ttOportunidadeOrigem: opportunity
				}
			}).then(function (email) {
				// TODO: ?
			});
		};

		this.onEdit = function () {

			if ((CRMControlOpportunityDetail.model)
					&& (CRMControlOpportunityDetail.model.ttFaseDesenvolvimento)
					&& (CRMControlOpportunityDetail.model.ttFaseDesenvolvimento.log_permite_alter === false)) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-phase-not-allow-change', [], 'dts/crm')
				});
				return;
			}

			var service = modalOpportunityEdit;

			service.open({
				opportunity: CRMControlOpportunityDetail.model
			}).then(function (result) {
				if (result) {
					CRMControlOpportunityDetail.model = result;
					CRMControlOpportunityDetail.afterSave(result, undefined);
				}
			});
		};

		this.onRemove = function () {

			var opportunity = CRMControlOpportunityDetail.model;

			if ((opportunity)
					&& (opportunity.ttFaseDesenvolvimento)
					&& (opportunity.ttFaseDesenvolvimento.log_permite_exc === false)) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-phase-not-allow-delete', [], 'dts/crm')
				});
				return;
			}

			if ((opportunity) && (opportunity.num_id_usuar_respons !== $rootScope.currentuser.idCRM)) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-only-responsible-can-delete', [], 'dts/crm')
				});
				return;
			}

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-opportunity', [], 'dts/crm').toLowerCase(), opportunity.des_oportun_vda
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					opportunityFactory.deleteRecord(opportunity.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$location.path('/dts/crm/opportunity/');

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-opportunity', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

					});
				}
			});
		};

		this.openUserSummary = function (user) {
			var opportunityUser = user;
			if (opportunityUser) {
				userSummaryModal.open({
					model: opportunityUser
				});
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			helper.loadCRMContext(function () {

				accessRestrictionFactory.getUserRestrictions('opportunity.detail', $rootScope.currentuser.login, function (result) {
					CRMControlOpportunityDetail.accessRestriction = result || {};

					appViewService.startView($rootScope.i18n('nav-opportunity', [], 'dts/crm'), 'crm.opportunity.detail.control', CRMControlOpportunityDetail);
					CRMControlOpportunityDetail.model = undefined;

					if ($stateParams && $stateParams.id) {
						CRMControlOpportunityDetail.loadPreferences();
						CRMControlOpportunityDetail.loadAccountContent = false;
						CRMControlOpportunityDetail.load($stateParams.id);
					}
				});

			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlOpportunityDetail = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlOpportunityDetail.init();
		});

		$scope.$on(CRMEvent.scopeSaveOpportunitySalesOrder, function (event, opportunity) {
			if (opportunity && opportunity.num_id > 0) {
				CRMControlOpportunityDetail.load(opportunity.num_id, true);
			}
		});

		$scope.$on(CRMEvent.scopeSaveOpportunityProduct, function (event, opportunityId) {
			opportunityFactory.getRecord(opportunityId, function (result) {
				if (result) {
					opportunityHelper.parseOpportunityColor(result);
					CRMControlOpportunityDetail.model = result;
				}
			});
		});

		$scope.$on(CRMEvent.scopeSaveHistoryOpportunity, function (event, opportunityId) {
			opportunityFactory.getRecord(opportunityId, function (result) {
				if (result) {
					opportunityHelper.parseOpportunityColor(result);
					CRMControlOpportunityDetail.model = result;
				}
			});
		});

		$scope.$on(CRMEvent.scopeSaveOpportunity, function (event, opportunity) {
			opportunityFactory.getRecord(opportunity.num_id, function (result) {
				if (result) {
					opportunityHelper.parseOpportunityColor(result);
					CRMControlOpportunityDetail.model = result;
					$scope.$broadcast(CRMEvent.scopeLoadOpportunity, result);
				}
			});
		});
	};
	controllerOpportunityDetail.$inject = [
		'$rootScope', '$scope', '$stateParams', '$filter', 'TOTVSEvent', 'totvs.app-main-view.Service',
		'crm.opportunity.helper', 'crm.crm_oportun_vda.factory', 'crm.helper', '$location',
		'crm.account.modal.summary', 'crm.legend', 'crm.opportunity.modal.edit', '$timeout',
		'crm.crm_param.factory', 'crm.crm_pessoa.conta.factory', 'crm.opportunity.param-service',
		'crm.user.modal.summary', 'crm.history.modal.edit', 'crm.send-email.modal', 'crm.mpd_fchdis0051.factory', 'crm.sales-order-cancel.modal', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.opportunity.detail.control', controllerOpportunityDetail);

});
