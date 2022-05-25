/*global $, index, angular, define, TOTVSEvent, CRMUtil, CRMEvent*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1048.js',
	'/dts/crm/js/zoom/crm_pessoa.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalPrfvAdvancedSearch,
		controllerPrfvAdvancedSearch;

	// *************************************************************************************
	// *** MODAL ADVANCED SEARCH
	// *************************************************************************************

	modalPrfvAdvancedSearch = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/prfv/prfv.advanced.search.html',
				controller: 'crm.prfv.advanced.search.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};
	modalPrfvAdvancedSearch.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER ADVANCED SEARCH
	// *************************************************************************************

	controllerPrfvAdvancedSearch = function ($rootScope, $scope, $modalInstance, parameters,
										  userFactory, accountFactory, contactFactory,
										  helper, prfvFactory, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlPrfvAdvancedSearch = this;

		this.disclaimers = undefined;
		this.model = undefined;

		this.accounts = [];
		this.contacts = [];
		this.users = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.apply = function () {

			this.parseModelToDisclaimers();

			parameters.fixedDisclaimers = parameters.fixedDisclaimers || [];

			$modalInstance.close({
				disclaimers: parameters.fixedDisclaimers.concat(this.disclaimers),
				fixedDisclaimers: parameters.fixedDisclaimers
			});
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.parseDisclaimersToModel = function (disclaimers) {
			var filter = disclaimers || parameters.disclaimers;
			helper.parseDisclaimersToModel(filter, function (model, disclaimers) {
				CRMControlPrfvAdvancedSearch.model = model;
				CRMControlPrfvAdvancedSearch.disclaimers = disclaimers;
			});
		};

		this.parseModelToDisclaimers = function () {

			var key,
				model;

			this.disclaimers = [];

			for (key in this.model) {

				if (this.model.hasOwnProperty(key)) {

					model = this.model[key];

					if (key === 'num_id' && CRMUtil.isDefined(model)) {

						this.disclaimers.push({
							property: 'num_id',
							value: model,
							title: $rootScope.i18n('l-code', [], 'dts/crm') + ': ' + model
						});

					} else if (key === 'num_id_pessoa' && CRMUtil.isDefined(model)) {

						this.disclaimers.push({
							property: 'num_id_pessoa',
							value: model.num_id,
							title: $rootScope.i18n('l-account', [], 'dts/crm') + ': ' + model.nom_razao_social,
							model: { value: model }
						});

					} else if (key === 'num_id_prfv' && CRMUtil.isDefined(model)) {

						this.disclaimers.push({
							property: 'num_id_prfv',
							value: model.num_id,
							title: $rootScope.i18n('l-prfv', [], 'dts/crm') + ': ' + model.des_faixa_prfv,
							model: { value: model }
						});

					} else if (key === 'dat_exec' && CRMUtil.isDefined(model.start)) {

						this.disclaimers.push(helper.parseDateRangeToDisclaimer(model, 'dat_exec', 'l-date-execution'));

					}
				}
			}
		};

		this.getAccounts = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_razao_social', value: helper.parseStrictValue(value) };
			accountFactory.typeahead(filter, undefined, function (result) {
				CRMControlPrfvAdvancedSearch.accounts = result;
			});
		};

		this.getPrfvs = function () {
			prfvFactory.getAllPrfvs(function (result) {
				if (!result) { return; }
				CRMControlPrfvAdvancedSearch.prfvs = result;
			}, true);
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('prfv.advanced.search', $rootScope.currentuser.login, function (result) {
				CRMControlPrfvAdvancedSearch.accessRestriction = result || {};
			});

			this.parseDisclaimersToModel();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlPrfvAdvancedSearch = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};
	controllerPrfvAdvancedSearch.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'parameters',
		'crm.crm_usuar.factory', 'crm.crm_pessoa.conta.factory', 'crm.crm_pessoa.contato.factory',
		'crm.helper', 'crm.crm_prfv_faixa.factory', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.prfv.modal.advanced.search', modalPrfvAdvancedSearch);
	index.register.controller('crm.prfv.advanced.search.control', controllerPrfvAdvancedSearch);
});
