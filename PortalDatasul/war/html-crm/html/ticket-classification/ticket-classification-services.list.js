/*globals index, define, angular, TOTVSEvent, console, CRMUtil, CRMEvent */
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1111.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controller = function ($scope, $rootScope, TOTVSEvent, helper, factory, modalEdit, userPreferenceModal) {

		var CRMControl = this;

		this.list = [];
		this.listCount = 0;

		this.disclaimers = [];

		this.isPendingListSearch = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.removeDisclaimer = function (disclaimer) {

			var index;

			index = CRMControl.disclaimers.indexOf(disclaimer);

			if (index !== -1) {
				CRMControl.disclaimers.splice(index, 1);
				CRMControl.search(false);
			}
		};

		this.search = function (isMore) {

			var options, filters = [];

			if (CRMControl.isPendingListSearch === true) {
				return;
			}

			CRMControl.listCount = 0;

			if (!isMore) {
				CRMControl.list = [];
			}

			options = {
				start: CRMControl.list.length,
				end: 50
			};

			if (CRMControl.quickSearchText && CRMControl.quickSearchText.trim().length > 0) {
				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControl.quickSearchText)
				});
			}

			filters = filters.concat(CRMControl.disclaimers);

			CRMControl.isPendingListSearch = true;

			factory.findRecords(filters, options, function (result) {
				CRMControl.addInList(result);
				CRMControl.isPendingListSearch = false;
			});
		};

		this.updateInList = function (result, old) {

			old = old || result;

			var index = this.list.indexOf(old);

			this.list[index] = result;
		};

		this.addInList = function (itens, isNew) {

			var i, item;

			if (!itens) { return; }

			if (!angular.isArray(itens)) {
				itens = [itens];
				CRMControl.listCount += 1;
			}

			for (i = 0; i < itens.length; i += 1) {

				item = itens[i];

				if (item && item.$length) {
					CRMControl.listCount = item.$length;
				}

				if (isNew !== true) {
					CRMControl.list.push(item);
				} else {
					CRMControl.list.unshift(item);
				}
			}
		};

		this.addEdit = function (item) {
			modalEdit.open({
				ticketClassification: item
			}).then(function (result) {
				if (result !== undefined) {
					if (item !== undefined) {
						CRMControl.updateInList(result, item);
					} else {
						CRMControl.addInList(result, true);
					}

					CRMControl.selectItem(result);
				}
			});
		};

		this.remove = function (item) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-ticket-classification', [], 'dts/crm').toLowerCase(), item.nom_classif_ocor
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(item.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						var index = CRMControl.list.indexOf(item);

						if (index !== -1) {
							CRMControl.list.splice(index, 1);
							CRMControl.listCount -= 1;
						}

						CRMControl.selectItem(result);

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-ticket-classification', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'ticket-classification.list' });
		};

		this.selectItem = function (item) {

			var CRMControl = this;

			if (item) {

				if (CRMUtil.isUndefined(CRMControl.selectedItem)) {
					CRMControl.selectedItem = item;
				}

				CRMControl.selectedItem.$selected = false;
				CRMControl.selectedItem = item;
				CRMControl.selectedItem.$selected = true;
			} else {
				CRMControl.selectedItem = undefined;
			}

			$rootScope.$broadcast(CRMEvent.scopeLoadTicketClassification, CRMControl.selectedItem);
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function init() {

			var viewName = $rootScope.i18n('nav-ticket-classification', [], 'dts/crm'),
				viewController = 'crm.ticket-classification.list.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);
				CRMControl.search();
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControl.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});
	};

	controller.$inject = [
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_classif_ocor.factory',
		'crm.ticket-classification.modal.edit', 'crm.user.modal.preference'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.ticket-classification.list.control', controller);
});
