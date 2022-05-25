/*global $, index, angular, define, Boolean*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
    '/dts/crm/js/api/fchcrm1045.js',
    '/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalUserSummary,
		modalUserPreference,
		userPreferenceHelper,
		controllerUserSummary,
		controllerUserPreference;

	// *************************************************************************************
	// *** MODAL SUMMARY
	// *************************************************************************************
	modalUserSummary = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/user/user.summary.html',
				controller: 'crm.user.summary.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalUserSummary.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER MODAL SUMMARY
	// *************************************************************************************
	controllerUserSummary = function ($rootScope, $scope, $modalInstance, parameters,
									  userFactory, userHelper, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlUserSummary = this;

        this.accessRestriction = undefined;
		this.model      = undefined;
		this.isResource = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {
            
            accessRestrictionFactory.getUserRestrictions('user.summary', $rootScope.currentuser.login, function (result) {
                CRMControlUserSummary.accessRestriction = result || {};
            });


			var idUser = this.isResource ? this.model.num_id_usuar : this.model.num_id;

			userFactory.getSummary(idUser, function (result) {

				if (!result) { return; }

				if (CRMControlUserSummary.isResource === true) {
					result.num_id = CRMControlUserSummary.model.num_id;
					result.num_id_usuar = CRMControlUserSummary.model.num_id_usuar;
					angular.extend(CRMControlUserSummary.model, result);
				} else {
					angular.extend(CRMControlUserSummary.model, result);
				}

				userHelper.parseAcessLevel(CRMControlUserSummary.model);
			});
		};

		this.close = function () {
			$modalInstance.dismiss('cancel');
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.model;
		this.isResource = parameters.isResource || false;

		this.load();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlUserSummary = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerUserSummary.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'crm.crm_usuar.factory', 'crm.user.helper', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** MODAL PREFERENCE HELPER
	// *************************************************************************************
	userPreferenceHelper = function ($rootScope, $totvsprofile) {

		var factory = {
			group: 'crm.user.preference.global',
			searchStrict: 'search.type.strict'
		};

		factory.isStrictSearch = function (callback) {

			if (angular.isUndefined($rootScope.currentuser.crm) ||
					angular.isUndefined($rootScope.currentuser.crm.general.isStrictSearch)) {
				$totvsprofile.remote.clearCache(factory.group, factory.searchStrict);
			}

			return $totvsprofile.remote.get(factory.group, factory.searchStrict, function (result) {

				if (callback) {
					callback((result && result.length > 0 ? Boolean(result[0].dataValue) : false));
				}
			});
		};

		factory.setStrictSearch = function (value, callback) {

			$totvsprofile.remote.clearCache(factory.group, factory.searchStrict);

			$rootScope.currentuser.crm = $rootScope.currentuser.crm || {};
			$rootScope.currentuser.crm.general = $rootScope.currentuser.crm.general || {};

			return $totvsprofile.remote.set(factory.group, {
				dataCode: factory.searchStrict,
				dataValue: value
			}, function (result) {
				$rootScope.currentuser.crm.general.isStrictSearch = value;
				if (callback) { callback(value); }
			});
		};

		return factory;
	};

	userPreferenceHelper.$inject = ['$rootScope', '$totvsprofile'];

	// *************************************************************************************
	// *** MODAL PREFERENCE
	// *************************************************************************************
	modalUserPreference = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/user/user.preference.html',
				controller: 'crm.user.preference.control as controller',
				backdrop: 'static',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalUserPreference.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER MODAL PREFERENCE
	// *************************************************************************************
	controllerUserPreference = function ($rootScope, $scope, $modalInstance, parameters,
										 userPreferenceHelper, $totvsprofile) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlUserPreference = this;

		this.isLoaded = false;
		this.context = undefined;

		this.general = {
			isOpen: true,
			strictSearch: {
				value: false,
				label: $rootScope.i18n('l-search-strict', [], 'dts/crm'),
				description: $rootScope.i18n('msg-search-strict', [], 'dts/crm')
			}
		};

		this.account = {
			group: 'crm.user.preference.account',
			isOpen: true,
			filter: {
				code: 'filter',
				value: undefined,
				options: undefined,
				label: $rootScope.i18n('l-default-filter', [], 'dts/crm'),
				description: $rootScope.i18n('msg-default-filter', [], 'dts/crm')
			}
		};

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {

			var count = 0, total = 1;

			userPreferenceHelper.isStrictSearch(function (result) {
				CRMControlUserPreference.general.strictSearch.value = result;
				if (++count === total) { CRMControlUserPreference.isLoaded = true; }
			});

			if (this.context === 'account.list') {
				this.loadAccountPreferences();
			}
		};

		this.loadAccountPreferences = function () {
			var i, hasDefault = false;

			parameters.account = parameters.account || {};

			if (angular.isDefined(parameters.account.filters)) {

				this.account.filter.options = parameters.account.filters;

				for (i = 0; i < parameters.account.filters.length; i++) {
					if (parameters.account.filters[i]['default'] === true) {
						this.account.filter.value = parameters.account.filters[i];
						hasDefault = true;
						break;
					}
				}
			}
			if (hasDefault === true) {
				return;
			}

			return $totvsprofile.remote.get(this.account.group, this.account.filter.code, function (result) {
				result = (result && result.length > 0 ? result[0].dataValue : undefined);
				if (result) {
					CRMControlUserPreference.account.filter.value = result;
				}
			});
		};

		this.onChangeDefaultFilter = function () {

			var i, filter = this.account.filter;

			$totvsprofile.remote.clearCache(this.account.group, filter.code);

			return $totvsprofile.remote.set(this.account.group, {
				dataCode: filter.code,
				dataValue: filter.value
			}, function (result) {
				for (i = 0; i < filter.options.length; i++) {
					filter.options[i]['default'] = (filter.options[i].name === filter.value.name);
				}
			});
		};

		this.onChangeStrictSearch = function () {
			userPreferenceHelper.setStrictSearch(CRMControlUserPreference.general.strictSearch.value);
		};

		this.close = function () {
			$modalInstance.close({
				general: this.general,
				account: this.account
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.context = parameters.context;

		this.load();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlUserPreference = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerUserPreference.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'crm.user.preference.helper',
		'$totvsprofile'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.factory('crm.user.preference.helper', userPreferenceHelper);

	index.register.service('crm.user.modal.summary', modalUserSummary);
	index.register.service('crm.user.modal.preference', modalUserPreference);

	index.register.controller('crm.user.summary.control', controllerUserSummary);
	index.register.controller('crm.user.preference.control', controllerUserPreference);
});
