/*globals define, angular */
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1117.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controller = function ($scope, $rootScope, TOTVSEvent, helper, prfvRangeFactory, userPreferenceModal, modalEdit) {

		var CRMControl = this;

		this.listOfRanges = [];
		this.listOfRangesCount = 0;

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

			CRMControl.listOfRangesCount = 0;

			if (!isMore) {
				CRMControl.listOfRanges = [];
			}

			options = {
				start: CRMControl.listOfRanges.length,
				end: 50
			};

			CRMControl.parseQuickFilters(filters);

			filters = filters.concat(CRMControl.disclaimers);

			CRMControl.isPendingListSearch = true;

			prfvRangeFactory.findRecords(filters, options, function (result) {
				CRMControl.addItemInList(result);
				CRMControl.isPendingListSearch = false;
			});
		};

		this.updateItemInList = function (range, oldRange) {

			oldRange = oldRange || range;

			var index = this.listOfRanges.indexOf(oldRange);

			this.listOfRanges[index] = range;
		};

		this.addItemInList = function (ranges, isNew) {

			var i, range;

			if (!ranges) { return; }

			if (!angular.isArray(ranges)) {
				ranges = [ranges];
				CRMControl.listOfRangesCount += 1;
			}

			for (i = 0; i < ranges.length; i += 1) {

				range = ranges[i];

				if (range && range.$length) {
					CRMControl.listOfRangesCount = range.$length;
				}

				if (isNew !== true) {
					CRMControl.listOfRanges.push(range);
				} else {
					CRMControl.listOfRanges.unshift(range);
				}
			}
		};

		this.parseQuickFilters = function (filters) {
			if (CRMControl.quickSearchText && CRMControl.quickSearchText.trim().length > 0) {
				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControl.quickSearchText)
				});
			}
		};

		this.addEdit = function (range) {
			modalEdit.open({
				range: range
			}).then(function (result) {
				if (result !== undefined) {
					if (range !== undefined) {
						CRMControl.updateItemInList(result, range);
					} else {
						CRMControl.addItemInList(result, true);
					}
				}
			});
		};

		this.remove = function (item) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-prfv-range', [], 'dts/crm').toLowerCase(), item.des_faixa_prfv
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					prfvRangeFactory.deleteRecord(item.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						var index = CRMControl.listOfRanges.indexOf(item);

						if (index !== -1) {
							CRMControl.listOfRanges.splice(index, 1);
							CRMControl.listOfRangesCount -= 1;
						}

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-prfv-range', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'prfv-range.list' });
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function init() {

			var viewName = $rootScope.i18n('nav-prfv-range', [], 'dts/crm'),
				viewController = 'crm.prfv-range.list.control';

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
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_prfv_faixa_cabec.factory',
		'crm.user.modal.preference', 'crm.prfv-range.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.prfv-range.list.control', controller);
});
