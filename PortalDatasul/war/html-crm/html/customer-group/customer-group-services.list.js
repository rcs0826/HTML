/*globals define, angular */
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1037.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controller = function ($scope, $rootScope, TOTVSEvent, helper, customerGroupFactory, userPreferenceModal, modalCustomerGroupEdit, legend) {

		var CRMControlCustomerGroup = this;

		this.listOfCustomerGroup = [];
		this.listOfCustomerGroupCount = 0;

		this.disclaimers = [];

		this.isPendingListSearch = false;

		this.personTypes = [
			{num_id: 1, nom_tipo: legend.personalType.NAME(1)},
			{num_id: 2, nom_tipo: legend.personalType.NAME(2)},
			{num_id: 3, nom_tipo: legend.personalType.NAME(3)},
			{num_id: 4, nom_tipo: legend.personalType.NAME(4)}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.removeDisclaimer = function (disclaimer) {

			var index;

			index = CRMControlCustomerGroup.disclaimers.indexOf(disclaimer);

			if (index !== -1) {
				CRMControlCustomerGroup.disclaimers.splice(index, 1);
				CRMControlCustomerGroup.search(false);
			}
		};

		this.search = function (isMore) {

			var options, filters = [];

			if (CRMControlCustomerGroup.isPendingListSearch === true) {
				return;
			}

			CRMControlCustomerGroup.listOfCustomerGroupCount = 0;

			if (!isMore) {
				CRMControlCustomerGroup.listOfCustomerGroup = [];
			}

			options = {
				start: CRMControlCustomerGroup.listOfCustomerGroup.length,
				end: 50
			};

			CRMControlCustomerGroup.parseQuickFilters(filters);

			filters = filters.concat(CRMControlCustomerGroup.disclaimers);

			CRMControlCustomerGroup.isPendingListSearch = true;

			customerGroupFactory.findRecords(filters, options, function (result) {
				CRMControlCustomerGroup.addGroupInList(result);
				CRMControlCustomerGroup.isPendingListSearch = false;
			});
		};

		this.updateGroupInList = function (group, oldGroup) {

			oldGroup = oldGroup || group;

			var index = this.listOfCustomerGroup.indexOf(oldGroup);

			this.listOfCustomerGroup[index] = group;
		};

		this.addGroupInList = function (groups, isNew) {

			var i, group;

			if (!groups) { return; }

			if (!angular.isArray(groups)) {
				groups = [groups];
				CRMControlCustomerGroup.listOfCustomerGroupCount += 1;
			}

			for (i = 0; i < groups.length; i += 1) {

				group = groups[i];

				if (group && group.$length) {
					CRMControlCustomerGroup.listOfCustomerGroupCount = group.$length;
				}

				if (isNew !== true) {
					CRMControlCustomerGroup.listOfCustomerGroup.push(group);
				} else {
					CRMControlCustomerGroup.listOfCustomerGroup.unshift(group);
				}
			}
		};

		this.parseQuickFilters = function (filters) {
			if (CRMControlCustomerGroup.quickSearchText && CRMControlCustomerGroup.quickSearchText.trim().length > 0) {
				filters.push({
					property: 'custom.quick_search',
					value: helper.parseStrictValue(CRMControlCustomerGroup.quickSearchText)
				});
			}
		};

		this.addEdit = function (group) {
			modalCustomerGroupEdit.open({
				group: group
			}).then(function (result) {
				if (result !== undefined) {
					if (group !== undefined) {
						CRMControlCustomerGroup.updateGroupInList(result, group);
					} else {
						CRMControlCustomerGroup.addGroupInList(result, true);
					}
				}
			});
		};

		this.remove = function (group) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-customer-group', [], 'dts/crm').toLowerCase(), group.nom_grp_clien
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					customerGroupFactory.deleteRecord(group.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						var index = CRMControlCustomerGroup.listOfCustomerGroup.indexOf(group);

						if (index !== -1) {
							CRMControlCustomerGroup.listOfCustomerGroup.splice(index, 1);
							CRMControlCustomerGroup.listOfCustomerGroupCount -= 1;
						}

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-customer-group', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'customer-group.list' });
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function init() {

			var viewName = $rootScope.i18n('nav-customer-group', [], 'dts/crm'),
				viewController = 'crm.customer-group.list.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControlCustomerGroup);
				CRMControlCustomerGroup.search();
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControlCustomerGroup.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControlCustomerGroup.init();
		});

		$scope.$on('$destroy', function () {
			CRMControlCustomerGroup = undefined;
		});
	};

	controller.$inject = [
		'$scope', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_grp_clien.factory',
		'crm.user.modal.preference', 'crm.customer-group.modal.edit', 'crm.legend'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.customer-group.list.control', controller);
});
