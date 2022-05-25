/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1076.js',
	'/dts/crm/js/zoom/crm_usuar.js'
], function (index) {

	'use strict';

	var modal,
		controller;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/strategy/goal/phase/user/user.edit.html',
				controller: 'crm.strategy-goal-phase-user.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modal.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controller = function ($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, helper,
							factory, factoryUser) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;

		this.resultList = undefined;
		this.users = undefined;
		this.phaseGoal = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);

			if (model.num_id_usuar > 0) {
				model.ttUsuario = {
					num_id: model.num_id_usuar,
					nom_usuar: model.nom_usuar
				};
			}
		};

		this.save = function (isToContinue) {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave(),
				message,
				fnAfterSave;

			if (!vo) { return; }

			fnAfterSave = function (item) {
				if (!item) { return; }
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-strategy-goal-user', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-user', [], 'dts/crm'), item.nom_usuar
					], 'dts/crm')
				});
				CRMControl.close(item, isToContinue);
			};
			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateStrategyGoalPhaseUser(CRMControl.phaseGoal, vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.addStrategyGoalPhaseUser(CRMControl.phaseGoal, vo, fnAfterSave);
			}
		};

		this.close = function (item, isToContinue) {

			CRMControl.resultList = CRMControl.resultList || [];
			if (CRMUtil.isDefined(item)) {
				CRMControl.resultList.push(item);
				}
			if (isToContinue === true) {
				CRMControl.model = undefined;
				CRMControl.validadeParameterModel();
			} else if ($modalInstance) {
				$modalInstance.close(CRMControl.resultList);
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model || {};

			if (!model.ttUsuario || model.ttUsuario.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-user');
			}

			if (!model.val_meta || model.val_meta <= 0) {
				isInvalidForm = true;
				messages.push('l-value');
			}

			if (!model.qtd_meta || model.qtd_meta <= 0) {
				isInvalidForm = true;
				messages.push('l-quantity');
			}

			if (!model.qti_nume_vida || model.qti_nume_vida <= 0) {
				isInvalidForm = true;
				messages.push('l-items');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-strategy-goal-user', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model || {};

			vo.num_id = model.num_id;
			vo.num_id_meta = CRMControl.phaseGoal;

			if (model.ttUsuario) {
				vo.num_id_usuar = model.ttUsuario.num_id;
			}

			vo.val_meta = model.val_meta;
			vo.qtd_meta = model.qtd_meta;
			vo.qti_nume_vida = model.qti_nume_vida;

			return vo;
		};







		this.getUsers = function (value) {

			if (!value || value === '') { return []; }

			var filter = [{ property: 'nom_usuar', value: helper.parseStrictValue(value) }];

			factoryUser.typeahead(filter, undefined, function (result) {
				CRMControl.users = result;
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.goal ? angular.copy(parameters.goal) : {};
		this.phaseGoal  = parameters.phaseGoal ? angular.copy(parameters.phaseGoal) : undefined;

		this.validadeParameterModel();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			$modalInstance.dismiss('cancel');
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper',
		'crm.crm_estrateg_vda.factory', 'crm.crm_usuar.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.strategy-goal-phase-user.modal.edit', modal);
	index.register.controller('crm.strategy-goal-phase-user.edit.control', controller);
});
