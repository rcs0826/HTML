/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1076.js'
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
				templateUrl: '/dts/crm/html/strategy/goal/phase/phase.edit.html',
				controller: 'crm.strategy-goal-phase.edit.control as controller',
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

	controller = function ($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, helper, factory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;

		this.resultList = undefined;
		this.goal = undefined;
		this.phases = undefined;
        this.isIntegratedWithGP = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);

			if (model.num_id_fase > 0) {
				model.ttFase = {
					num_id_fase: model.num_id_fase,
					des_fase: model.des_fase
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
					title: $rootScope.i18n('l-strategy-phase-goal', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-goal', [], 'dts/crm'),
						item.des_fase
					], 'dts/crm')
				});

				item.ttMetaFaseUsuario = CRMControl.model.ttMetaFaseUsuario;
				CRMControl.close(item, isToContinue);
			};
			
			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateStrategyGoalPhase(CRMControl.goal, vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.addStrategyGoalPhase(CRMControl.goal, vo, fnAfterSave);
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

			if (!model.ttFase || model.ttFase.num_id_fase < 1) {
				isInvalidForm = true;
				messages.push('l-phase');
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
				helper.showInvalidFormMessage('l-strategy-phase-goal', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model || {};

			vo.num_id = model.num_id;
			vo.num_id_meta = CRMControl.goal;

			if (model.ttFase) {
				vo.num_id_fase = model.ttFase.num_id_fase;
			}

			vo.val_meta = model.val_meta;
			vo.qtd_meta = model.qtd_meta;
			vo.qti_nume_vida = model.qti_nume_vida;

			return vo;
		};

        // *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.phaseGoal ? angular.copy(parameters.phaseGoal) : {};
		this.phases = parameters.phases ? angular.copy(parameters.phases) : [];
		this.goal  = parameters.goal ? angular.copy(parameters.goal) : undefined;
        this.isIntegratedWithGP = parameters.isIntegratedWithGP;
        
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
		'crm.crm_estrateg_vda.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.strategy-goal-phase.modal.edit', modal);
	index.register.controller('crm.strategy-goal-phase.edit.control', controller);
});
