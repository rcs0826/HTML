/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchdis0051.js',
	'/dts/crm/js/api/bodi332.js',
	'/dts/crm/js/zoom/motivo.js',
	'/dts/crm/js/crm-components.js'
], function (index) {

	'use strict';

	var controllerSalesOrderCancel,
		modalCancelSalesOrder;

	// *************************************************************************************
	// *** CONTROLLER CANCEL ORDER/QUOTATION
	// *************************************************************************************
	controllerSalesOrderCancel = function ($rootScope, $scope, $modalInstance, $filter, $timeout,
										   TOTVSEvent, parameters, helper, reasonFactory, fchdis0051Factory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlCancelSalesOrder = this;

		this.model = {};
		this.opportunity = {};
		this.isQuotation = false;
		this.salesOrder = {};
		this.modalmessage = 'msg-confirm-cancel-sales-order';

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {
			if (CRMControlCancelSalesOrder.isInvalidForm()) { return; }

			var fnAfterSave, fnAfterSaveAll, vo, oppId;

			oppId = CRMControlCancelSalesOrder.opportunity ? CRMControlCancelSalesOrder.opportunity.num_id : undefined;
			vo = CRMControlCancelSalesOrder.convertToSave();

			if (!vo || !oppId) { return; }

			fnAfterSave = function (data) {

				if (!data || (CRMUtil.isDefined(data.hasError) && data.hasError === true)) { return; }

				var title = CRMControlCancelSalesOrder.isQuotation !== true ? 'l-cancel-sales-order' : 'l-cancel-quotation',
					title2 = CRMControlCancelSalesOrder.isQuotation !== true ? 'l-sales-order' : 'l-quotation',
					message = 'msg-cancel-generic';

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n(title, [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n(title2, [], 'dts/crm'),
						CRMControlCancelSalesOrder.salesOrder.orderNumber
					], 'dts/crm')
				});

				//$rootScope.$broadcast(CRMEvent.scopeSaveOpportunitySalesOrder, CRMControlCancelSalesOrder.opportunity);
				$modalInstance.close({orderNumber: CRMControlCancelSalesOrder.salesOrder.orderNumber});
			};

			fnAfterSaveAll = function (data) {
				var message, title, typeMessage = 'success';

				if (!data) { return; }

				title = 'l-opportunity';
				message = "msg-success-canceled-quotation-and-order";

				if (CRMUtil.isDefined(data.hasError) && data.hasError === true) {
					typeMessage = 'warning';
					message = "msg-not-possible-canceled-quotation-and-order";
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: typeMessage,
					title: $rootScope.i18n(title, [], 'dts/crm'),
					detail: $rootScope.i18n(message, [], 'dts/crm')
				});

				$rootScope.$broadcast(CRMEvent.scopeSaveOpportunitySalesOrder, CRMControlCancelSalesOrder.opportunity);
				$rootScope.$broadcast(CRMEvent.scopeCancelOpenQuotationAndOrderForOpportunity, CRMControlCancelSalesOrder.opportunity);

				$modalInstance.close();
			};

			if (CRMControlCancelSalesOrder.allOpenQuotationAndOrderForOpportunity === true) {
				fchdis0051Factory.cancelOpenQuotationAndOrderForOpportunity(oppId, vo, fnAfterSaveAll);
			} else {
				if (CRMControlCancelSalesOrder.isQuotation === true) {
					fchdis0051Factory.cancelQuotation(CRMControlCancelSalesOrder.salesOrder.orderNumber, vo, fnAfterSave);
				} else {
					fchdis0051Factory.cancelSalesOrder(CRMControlCancelSalesOrder.salesOrder.orderNumber, vo, fnAfterSave);
				}
			}

		};

		this.close = function () {
			$modalInstance.dismiss('cancel');
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControlCancelSalesOrder.model;

			if (!model.reason) {
				isInvalidForm = true;
				messages.push('l-sales-order-reason');
			}

			if (CRMControlCancelSalesOrder.isQuotation !== true && !model.dtCancel) {
				isInvalidForm = true;
				messages.push('l-date-cancel');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage((!CRMControlCancelSalesOrder.isQuotation ? 'l-cancel-sales-order' : 'l-cancel-quotation'), messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {
			var vo = {},
				control = CRMControlCancelSalesOrder,
				model = control.model;

			vo.codMotivo = model.reason['cod-motivo'];
			vo.descMotivo = model.dslCancel || "";

			if (control.isQuotation !== true && control.allOpenQuotationAndOrderForOpportunity !== true) {
				vo.dtCancela = model.dtCancel;
				vo.ttOrderParameters = [];
			}

			return vo;
		};

		this.getReasons = function (value) {
			CRMControlCancelSalesOrder.reasons = [];

			value = helper.parseStrictValue(value);

			reasonFactory.getCancellationReason(value, function (result) {
				if (result && result.length > 0) {
					CRMControlCancelSalesOrder.reasons = result;
					CRMControlCancelSalesOrder.model.reason = result[0];
				}
			});

		};

		this.init = function () {
			CRMControlCancelSalesOrder.model.dtCancel = new Date();

			if (this.isQuotation === true) {
				this.modalmessage = 'msg-confirm-cancel-quotation';
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.opportunity = parameters.opportunity ? angular.copy(parameters.opportunity) : {};
		this.allOpenQuotationAndOrderForOpportunity = parameters.allOpenQuotationAndOrderForOpportunity || false;

		if (this.allOpenQuotationAndOrderForOpportunity !== true) {
			this.salesOrder = parameters.salesOrder ? angular.copy(parameters.salesOrder) : {};
			this.isQuotation = parameters.isQuotation === true ? true : false;
		}

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlCancelSalesOrder = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerSalesOrderCancel.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', '$timeout', 'TOTVSEvent', 'parameters', 'crm.helper', 'crm.mpd_motivo.factory', 'crm.mpd_fchdis0051.factory'
	];


	modalCancelSalesOrder = function ($modal) {

		this.open = function (params) {

			params = params || {};

			var instance = $modal.open({
				templateUrl: '/dts/crm/html/opportunity/sales-order/sales-order.cancel.html',
				controller: 'crm.sales-order-cancel.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});

			return instance.result;
		};

	};
	modalCancelSalesOrder.$inject = ['$modal'];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.sales-order-cancel.modal', modalCancelSalesOrder);

	index.register.controller('crm.sales-order-cancel.control', controllerSalesOrderCancel);
});
