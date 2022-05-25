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
				templateUrl: '/dts/crm/html/strategy/strategy.edit.html',
				controller: 'crm.strategy.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modal.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controller = function ($rootScope, $scope, $location, $modalInstance, parameters,
							TOTVSEvent, helper, factory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;

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
		};

		this.save = function () {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (!vo) { return; }

			if (CRMControl.editMode === true) {
				factory.updateRecord(vo.num_id, vo, CRMControl.afterSave);
			} else {
				factory.saveRecord(vo, CRMControl.afterSave);
			}
		};

		this.cancel = function (item) {

			if ($modalInstance) {
				if (item) {
					$modalInstance.close(item);
				} else {
					$modalInstance.dismiss('cancel');
				}
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				isValidTimeRange,
				model = CRMControl.model;

			if (!model.des_estrateg_vda || model.des_estrateg_vda.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (model.initialDate && !model.initialDate.start) {
				isInvalidForm = true;
				messages.push('l-date-start');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-sales-strategy', messages);
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
							title:  $rootScope.i18n('l-sales-strategy', [], 'dts/crm'),
							detail: $rootScope.i18n(messages, [], 'dts/crm')
						});
					}
				}
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;
			vo.des_estrateg_vda = model.des_estrateg_vda;

			vo.dat_inic = model.initialDate.start;
			vo.dat_fim  = model.initialDate.end;

			vo.log_inclui_acao = model.log_inclui_acao;

			return vo;
		};

		this.afterSave = function (item) {

			if (!item) { return; }

			var message, model = CRMControl.model;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('l-sales-strategy', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('l-sales-strategy', [], 'dts/crm'),
					item.des_estrateg_vda
				], 'dts/crm')
			});

			item.ttFase = model.ttFase;
			item.ttMeta = model.ttMeta;
			item.ttMetaFase = model.ttMetaFase;
			item.ttMetaFaseUsuario = model.ttMetaFaseUsuario;
			item.ttTransicao = model.ttTransicao;

			$modalInstance.close(item);
			if (CRMControl.editMode === false) {
				$location.path('/dts/crm/strategy/detail/' + item.num_id);
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.strategy ? angular.copy(parameters.strategy) : {};

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
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper',
		'crm.crm_estrateg_vda.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.strategy.modal.edit', modal);
	index.register.controller('crm.strategy.edit.control', controller);
});
