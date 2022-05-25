/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-color-picker-proxy.js',
	'/dts/crm/js/api/fchcrm1076.js',
	'/dts/crm/js/api/fchcrm1077.js',
	'/dts/crm/html/phase/phase-services.edit.js'
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
				templateUrl: '/dts/crm/html/strategy/phase/phase.edit.html',
				controller: 'crm.strategy-phase.edit.control as controller',
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

	controller = function ($rootScope, $scope, $modalInstance, parameters, TOTVSEvent,
							helper, factory, factoryPhase, modalPhaseEdit) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;

		this.resultList = undefined;

		this.phases = undefined;
		this.strategy = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);

			if (model.num_id_fase > 0) {
				model.ttFase = {
					num_id: model.num_id_fase,
					des_fase: model.des_fase
				};
			} else {
				model.ttFase = {
					num_id: 0,
					des_fase: "",
					cod_livre_1: "#"
				};
			}
			this.model = model;
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
					title: $rootScope.i18n('l-strategy-phase', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-phase', [], 'dts/crm'),
						item.des_fase
					], 'dts/crm')
				});

				CRMControl.close(item, isToContinue);
			};

			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateStrategyPhase(CRMControl.strategy, vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.addStrategyPhase(CRMControl.strategy, vo, fnAfterSave);
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
				CRMControl.model.cod_livre_1 = "#";
			} else if ($modalInstance) {
				$modalInstance.close(CRMControl.resultList);
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.ttFase || model.ttFase.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-phase');
			}

			if (!model.cod_livre_1 || model.cod_livre_1.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-color');
			} else {

				model.cod_livre_1 = model.cod_livre_1.trim();

				if (model.cod_livre_1.indexOf("#") !== 0) {

					if (model.cod_livre_1.length !== 3 && model.cod_livre_1.length !== 6) {
						isInvalidForm = true;
						messages.push('l-color');
					} else {
						model.cod_livre_1 = '#' + model.cod_livre_1;
					}
				} else if (model.cod_livre_1.length !== 4 && model.cod_livre_1.length !== 7) {
					isInvalidForm = true;
					messages.push('l-color');
				}

				if (isInvalidForm === false && !model.cod_livre_1.match(/([#][0-9A-Fa-f]{3}|[#][0-9A-Fa-f]{6})/g)) {
					isInvalidForm = true;
					messages.push('l-color');
				}
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-strategy-phase', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;
			vo.num_id_estrateg_vda = CRMControl.strategy;

			if (model.ttFase) {
				vo.num_id_fase = model.ttFase.num_id;
			}

			vo.log_permite_exc   = model.log_permite_exc;
			vo.log_permite_alter = model.log_permite_alter;
			vo.log_omit_funil    = model.log_omit_funil;

			vo.num_dias = model.num_dias;
			vo.num_order = model.num_order || 0;

			vo.idi_cor_con = model.idi_cor_con;
			vo.cod_livre_1 = model.cod_livre_1; /* COR */

			return vo;
		};

		this.getPhases = function () {
			factoryPhase.getAll(function (result) {
				CRMControl.phases = result || [];
			}, false);
		};

		this.addPhase = function () {
			modalPhaseEdit.open(undefined).then(function (results) {

				results = results || [];

				var i, result;

				for (i = 0; i < results.length; i++) {

					result = results[i];

					if (CRMUtil.isUndefined(result)) { continue; }

					CRMControl.phases.push(result);
				}

				CRMControl.model.ttFase = result;
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.phase ? angular.copy(parameters.phase) : {};
		this.strategy  = parameters.strategy ? angular.copy(parameters.strategy) : undefined;

		this.getPhases();

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
		'crm.crm_estrateg_vda.factory', 'crm.crm_fase_estrateg_vda.factory', 'crm.phase.modal.edit'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.strategy-phase.modal.edit', modal);
	index.register.controller('crm.strategy-phase.edit.control', controller);
});
