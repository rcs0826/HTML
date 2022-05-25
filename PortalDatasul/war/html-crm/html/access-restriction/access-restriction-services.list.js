/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1046.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_grp_usuar.js',
	'/dts/crm/html/user/user-services.js'
], function (index) {

	'use strict';

	var controllerAccessRestrictionList,

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************

	controllerAccessRestrictionList = function ($rootScope, $scope, TOTVSEvent, accessRestrictionFactory, modalAdvancedSearch,
		modalEdit, $location, helper, userPreferenceModal) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccessRestrictionList = this;

		this.listOfAccessRestriction = [];
		this.listOfAccessRestrictionCount = 0;

		this.disclaimers = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.search = function (isMore) {

			if (CRMControlAccessRestrictionList.isPendingListSearch === true) {
				return;
			}

			CRMControlAccessRestrictionList.listOfAccessRestrictionCount = 0;

			if (!isMore) {
				CRMControlAccessRestrictionList.listOfAccessRestriction = [];
			}

			var i,
				options = { start: CRMControlAccessRestrictionList.listOfAccessRestriction.length, end: 50},
				filters = [];

			if (CRMControlAccessRestrictionList.quickSearchText
					&& CRMControlAccessRestrictionList.quickSearchText.trim().length > 0) {
				this.disclaimers = [];

				filters.push({ property: 'nom_acess', value: helper.parseStrictValue(CRMControlAccessRestrictionList.quickSearchText) });
			}

			filters = filters.concat(this.disclaimers);

			CRMControlAccessRestrictionList.isPendingListSearch = true;
			accessRestrictionFactory.findRecords(filters, options, function (result) {

				for (i = 0; i < result.length; i++) {

					var accessRestriction = result[i];

					if (accessRestriction && accessRestriction.$length) {
						CRMControlAccessRestrictionList.listOfAccessRestrictionCount = accessRestriction.$length;
					}

					CRMControlAccessRestrictionList.listOfAccessRestriction.push(accessRestriction);
				}

				CRMControlAccessRestrictionList.isPendingListSearch = false;
			});
		};

		this.openAdvancedSearch = function () {
			modalAdvancedSearch.open({
				disclaimers: CRMControlAccessRestrictionList.disclaimers
			}).then(function (result) {
				CRMControlAccessRestrictionList.quickSearchText = undefined;
				CRMControlAccessRestrictionList.disclaimers = result.disclaimers || [];
				CRMControlAccessRestrictionList.search(false);
			});
		};

		this.removeDisclaimer = function (disclaimer) {
			var index = CRMControlAccessRestrictionList.disclaimers.indexOf(disclaimer);
			if (index !== -1) {
				CRMControlAccessRestrictionList.disclaimers.splice(index, 1);
				CRMControlAccessRestrictionList.search(false);
			}
		};

		this.addEdit = function (restriction) {
			modalEdit.open({
				restriction: restriction
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					CRMControlAccessRestrictionList.addAccessRestrictionInList(result, true);
					$location.path('/dts/crm/access-restriction/detail/' + result.num_id);
				}
			});
		};

		this.addAccessRestrictionInList = function (restrictions, isNew) {

			var i,
				restriction;

			if (!restrictions) { return; }

			if (!angular.isArray(restrictions)) {
				restrictions = [restrictions];
				CRMControlAccessRestrictionList.listOfAccessRestrictionCount++;
			}

			for (i = 0; i < restrictions.length; i++) {

				restriction = restrictions[i];

				if (restriction && restriction.$length) {
					CRMControlAccessRestrictionList.listOfAccessRestrictionCount = restriction.$length;
				}

				if (isNew === true) {
					CRMControlAccessRestrictionList.listOfAccessRestriction.unshift(restriction);
				} else {
					CRMControlAccessRestrictionList.listOfAccessRestriction.push(restriction);
				}
			}
		};

		this.remove = function (restriction) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-restriction', [], 'dts/crm').toLowerCase(), restriction.nom_acess
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					accessRestrictionFactory.deleteRecord(restriction.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-restriction', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						var index = CRMControlAccessRestrictionList.listOfAccessRestriction.indexOf(restriction);

						if (index > -1) {
							CRMControlAccessRestrictionList.listOfAccessRestriction.splice(index, 1);
							CRMControlAccessRestrictionList.listOfAccessRestrictionCount--;
						}
					});
				}
			});
		};

		this.userSettings = function () {
			userPreferenceModal.open({ context: 'access.restriction.list' });
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			helper.loadCRMContext(function () {

				var viewName = $rootScope.i18n('nav-restriction', [], 'dts/crm'),
					startView,
					viewController = 'crm.access-restriction.list.control';

				startView = helper.startView(viewName, viewController, CRMControlAccessRestrictionList);

				if (startView.isNewContext) {
					CRMControlAccessRestrictionList.search(false);
				}
			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccessRestrictionList = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlAccessRestrictionList.init();
		});
	}; // controllerAccessRestrictionList
	controllerAccessRestrictionList.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.crm_acess_portal.factory',
		'crm.access-restriction.modal.advanced.search', 'crm.access-restriction.modal.edit',
		'$location', 'crm.helper', 'crm.user.modal.preference'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.access-restriction.list.control', controllerAccessRestrictionList);
});
