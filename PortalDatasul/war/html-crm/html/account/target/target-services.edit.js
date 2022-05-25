/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint continue: true*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1000.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1054.js'
], function (index) {

	'use strict';

	var modalTargetEdit,
		controllerTargetEditModal;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
	modalTargetEdit = function ($modal) {
		this.open = function (params) {

			var template,
				instance;

			template = '/dts/crm/html/account/target/target.edit.html';
			instance = $modal.open({
				templateUrl: template,
				controller: 'crm.account.target.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'md',
				resolve: { parameters: function () { return params; } }
			});

			return instance.result;
		};
	};

	modalTargetEdit.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER
	// *************************************************************************************

	controllerTargetEditModal = function ($rootScope, $scope, TOTVSEvent, helper, parameters,
										   $modalInstance, targetFactory, accountFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlTargetEdit = this;

		this.accountsSize = 0;
		this.disclaimers = undefined;

		this.isInvalidDisclaimersControl = false;

		this.model = {};

		this.save = function () {

			if (CRMControlTargetEdit.isInvalidForm()) {
				return;
			}

			targetFactory.persistTarget(CRMControlTargetEdit.model, CRMControlTargetEdit.disclaimers, function (result) {

				if (!result || (result && CRMUtil.isUndefined(result.ttUsuarioCadastro))) {
					return;
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'warning',
					title:  $rootScope.i18n('l-target', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-target', [$rootScope.i18n('l-target', [], 'dts/crm'), result.nom_public_alvo], 'dts/crm')
				});
			});
            
            $rootScope.$broadcast(TOTVSEvent.showNotification, {
                type:   'info',
                title:  $rootScope.i18n('l-target', [], 'dts/crm'),
                detail: $rootScope.i18n('msg-target-generate', [], 'dts/crm'),
                timeout: 1000
            });
            
            $modalInstance.close();

		};

		this.cancel = function () {
			$modalInstance.close('dismiss');
		};

		this.isInvalidForm = function () {

			var isInvalidForm = false,
				messages = [];

			if (!CRMControlTargetEdit.model.nom_public_alvo || CRMControlTargetEdit.model.nom_public_alvo.length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-target', messages);
			}

			return isInvalidForm;
		};

		this.isInvalidDisclaimers = function () {

			var isInvalidDisclaimers = false,
				messages = [];

			if (!CRMControlTargetEdit.disclaimers || CRMControlTargetEdit.disclaimers.length === 0) {

				isInvalidDisclaimers = true;
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-target', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-target-invalid-disclaimers', [], 'dts/crm')
				});
			}

			return isInvalidDisclaimers;
		};

		// *********************************************************************************
		// *** INIT
		// *********************************************************************************

		this.disclaimers = parameters.disclaimers || [];

		this.init = function () {
			var i;

			if (!CRMControlTargetEdit.isInvalidDisclaimers()) {

				for (i = 0; i < CRMControlTargetEdit.disclaimers.length; i++) {
					CRMControlTargetEdit.disclaimers[i].fixed = true;
				}

				accountFactory.getCountAccounts(CRMControlTargetEdit.disclaimers, function (result) {

					if (!result || !result.i_count) {
						return;
					}

					CRMControlTargetEdit.accountsSize = result.i_count;

				});

			} else {
				CRMControlTargetEdit.isInvalidDisclaimersControl = true;
			}

		};

		this.init();

	};

	controllerTargetEditModal.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'crm.helper',
		'parameters',
		'$modalInstance',
		'crm.crm_public.factory',
		'crm.crm_pessoa.conta.factory'
	];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.account.target.modal.edit', modalTargetEdit);
	index.register.controller('crm.account.target.edit.control', controllerTargetEditModal);
});

