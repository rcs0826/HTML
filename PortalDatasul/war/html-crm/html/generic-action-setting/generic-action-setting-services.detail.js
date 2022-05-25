/*globals index, define, angular, TOTVSEvent, console, CRMEvent */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1113.js',
	'/dts/crm/html/generic-action-setting/rules/rules-services.edit.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $stateParams, $location, TOTVSEvent, helper,
							factory, modalEdit, modalEditRules) {

		var CRMControl = this;

		this.model = undefined;
		this.historyTextOpen = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.onEdit = function () {
			modalEdit.open({
				model: CRMControl.model
			}).then(function (result) {
				if (result) {
					CRMControl.model = result;
				}
			});
		};


		this.onRemove = function () {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-generic-action-setting', [], 'dts/crm').toLowerCase(), CRMControl.model.nom_configur
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(CRMControl.model.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-generic-action-setting', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/generic-action-setting/');
					});
				}
			});
		};

		this.addRules = function () {
			var model = {
				num_id_configur_acao_ocor: CRMControl.model.num_id
			};

			modalEditRules.open({
				model: model
			}).then(function (result) {
				if (result) {
					if (!CRMControl.model.rules) {
						CRMControl.model.rules = [];
					}
					CRMControl.model.rules.unshift(result);
				}
			});
		};

		this.removeRules = function (rule, index) {
			if (!rule || !rule.num_id) { return; }

			var rules = CRMControl.model.rules;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete-attribute-rules', [rule.nom_atrib_regra], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.removeRules(rule.num_id, function (result) {
						if (result.l_ok) {
							rules.splice(index, 1);

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-rules', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});
						}
					});

				}
			});

		};

		this.load = function (id) {
			factory.getGenericActionSetting(id, function (result) {
				CRMControl.model = result;
				CRMControl.getRules(id);
			});
		};

		this.getRules = function (genericActionSettingId) {
			factory.getRules(genericActionSettingId, function (result) {
				CRMControl.model.rules = result;
			});

		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-generic-action-setting', [], 'dts/crm'),
				viewController = 'crm.generic-action-setting.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = {};

				if ($stateParams && $stateParams.id) {
					CRMControl.load($stateParams.id);
				}
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControl.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$stateParams', '$location', 'TOTVSEvent', 'crm.helper',
		'crm.crm_configur_acao_ocor.factory', 'crm.generic-action-setting.modal.edit', 'crm.generic-action-setting-rules.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.generic-action-setting.detail.control', controller);

});
