/*globals index, define, angular, TOTVSEvent, console, CRMUtil, CRMEvent */
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1046.js',
	'/dts/crm/js/api/fchcrm1004.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controller = function ($scope, $rootScope, TOTVSEvent, helper, factory, modalEdit, userPreferenceModal, preferenceFactory) {

		var CRMControl = this;

		this.list = [];
		this.listCount = 0;

		this.disclaimers = [];

		this.isPendingListSearch = false;
		this.isIntegratedWithEMS = false;
		this.canOverrideProduct = true;

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

			factory.findProducts(filters, options, function (result) {
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

		this.canEdit = function (item) {
			if (CRMControl.isIntegratedWithEMS == true && item && item.cod_item_erp && item.cod_item_erp != '') {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('nav-product', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-validate-product-erp', [], 'dts/crm')
				});
				return false;
			} else {
				return true;
			}
		};

		this.addEdit = function (item) {
			if (CRMControl.canEdit(item) == true) {

				modalEdit.open({
					model: item
				}).then(function (result) {
					if (result !== undefined) {
						if (item !== undefined) {
							CRMControl.updateInList(result, item);
						} else {
							CRMControl.addInList(result, true);
						}
					}
				});

			}
		};

		this.remove = function (item) {

			if (CRMControl.canEdit(item) == true) {

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-delete',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n('msg-confirm-delete', [
						$rootScope.i18n('nav-product', [], 'dts/crm').toLowerCase(), item.nom_produt
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

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-product', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});
						});
					}
				});

			}
		};

		this.onTechnicalAssistence = function (item, value) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-to-update',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-update-product-support', [item.nom_produt], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.setTechnicalAssistence(item.num_id, value, function (result) {

						if (!result || result.l_ok !== true) { return; }

						item.log_produt_assist_tec = value;

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-product', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-generic', [item.nom_produt], 'dts/crm')
						});
					});
				}
			});
		}

		this.loadPreferences = function (callback) {
			var count = 0, total = 1;

			preferenceFactory.isIntegratedWithEMS(function (result) {
				CRMControl.isIntegratedWithEMS = result;
				if (++count === total && callback) { callback(); }
			});
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'product.list' });
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function init() {

			var viewName = $rootScope.i18n('nav-product', [], 'dts/crm'),
				viewController = 'crm.product.list.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);
				CRMControl.loadPreferences();
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
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_produt.factory',
		'crm.product.modal.edit', 'crm.user.modal.preference', 'crm.crm_param.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.product.list.control', controller);
});
