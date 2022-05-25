/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
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
				templateUrl: '/dts/crm/html/strategy/goal/goal.edit.html',
				controller: 'crm.strategy-goal.edit.control as controller',
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
							helper, factory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;

		this.resultList = undefined;
		this.strategy = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);

			model.dateTimeBase = new Date();

			if (this.editMode && model.dat_inic && model.dat_fim) {
				model.initialDate = {
					start	: model.dat_inic,
					end		: model.dat_fim
				};
			} else {
				model.initialDate = {
					start	: new Date().getTime(),
					end		: new Date().getTime()
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
					title: $rootScope.i18n('l-strategy-goal', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-goal', [], 'dts/crm'), item.des_meta
					], 'dts/crm')
				});

				item.ttMetaFase = CRMControl.model.ttMetaFase;
				CRMControl.close(item, isToContinue);
			};
			
			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateStrategyGoal(CRMControl.strategy, vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.addStrategyGoal(CRMControl.strategy, vo, fnAfterSave);
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
				isValidTimeRange,
				model = CRMControl.model || {};

			if (model.initialDate && !model.initialDate.start) {
				isInvalidForm = true;
				messages.push('l-date-start');
			}

			if (!model.des_meta || model.des_meta.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-strategy-goal', messages);
			}

			if (!isInvalidForm) {

				isValidTimeRange = helper.validateTimeRange(
					CRMControl.model.initialDate,
					undefined,
					new Date()
				);

				if (isValidTimeRange > -1) {

					if (isValidTimeRange === 1) {
						messages = 'msg-period-start-after-end';
						isInvalidForm = true;
					} else if (isValidTimeRange === 2) {
						messages = 'msg-period-end-before-start';
						isInvalidForm = true;
					}

					if (isInvalidForm) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-strategy-goal', [], 'dts/crm'),
							detail: $rootScope.i18n(messages, [], 'dts/crm')
						});
					}
				}
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model || {};

			vo.num_id = model.num_id;
			vo.des_meta = model.des_meta;

			vo.num_id_estrateg_vda = CRMControl.strategy;

			vo.dat_inic = model.initialDate.start;
			vo.dat_fim  = model.initialDate.end;

			return vo;
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.goal ? angular.copy(parameters.goal) : {};
		this.strategy  = parameters.strategy ? angular.copy(parameters.strategy) : undefined;

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

	index.register.service('crm.strategy-goal.modal.edit', modal);
	index.register.controller('crm.strategy-goal.edit.control', controller);
});
