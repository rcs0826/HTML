/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1113.js',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1031.js',
	'/dts/crm/js/api/fchcrm1033.js',
	'/dts/crm/js/api/fchcrm1036.js'
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
				templateUrl: '/dts/crm/html/generic-action-setting/rules/rules.edit.html',
				controller: 'crm.generic-action-setting-rules.edit.control as controller',
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

	controller = function ($rootScope, $scope, $location, $modalInstance, parameters, TOTVSEvent, helper,
							factory, ticketFactory, ticketFlowFactory, subjectFactory, ticketRatingFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = {};

		this.status = [];
		this.priorities = [];
		this.origins = [];
		this.flows = [];
		this.subjects = [];
		this.ratings = [];

		this.attributeTypes = [
			{ name: $rootScope.i18n('l-subject', [], 'dts/crm'), id: 1 },
			{ name: $rootScope.i18n('l-priority', [], 'dts/crm'), id: 2 },
			{ name: $rootScope.i18n('l-origin', [], 'dts/crm'), id: 3 },
			{ name: $rootScope.i18n('l-flow', [], 'dts/crm'), id: 4 },
			{ name: $rootScope.i18n('l-status', [], 'dts/crm'), id: 5 },
			{ name: $rootScope.i18n('l-classification', [], 'dts/crm'), id: 6 }
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function (callback) {
			var model = this.model || {};

			if (!model.idi_atrib_ocor || model.idi_atrib_ocor < 1) {
				model.ttAttributeType = CRMControl.attributeTypes[0];
			}

			if (callback) { callback(model); }
		};

		this.save = function () {
			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (!vo || vo.num_id_configur_acao_ocor < 1) { return; }

			factory.addRules(vo, CRMControl.afterSave);
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
				model = CRMControl.model;

			if (!model.ttValue || model.ttValue.id < 1) {
				isInvalidForm = true;
				messages.push('l-value');
			}

			if (!model.ttAttributeType || model.ttAttributeType.id < 1) {
				isInvalidForm = true;
				messages.push('l-attribute');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-rules', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id || 0;
			vo.num_id_configur_acao_ocor = model.num_id_configur_acao_ocor;
			vo.num_id_atrib_regra = model.ttValue ? model.ttValue.id : model.num_id_atrib_regra;
			vo.idi_atrib_ocor = model.ttAttributeType ? model.ttAttributeType.id : 1;

			return vo;
		};

		this.afterSave = function (item) {

			if (!item || item.num_id < 1) { return; }

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('nav-generic-action-setting', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('nav-generic-action-setting', [], 'dts/crm'),
					item.nom_configur
				], 'dts/crm')
			});

			$modalInstance.close(item);
		};

		this.onChangeAttributeType = function (item) {
			CRMControl.model.ttValue = undefined;

			if (!item || !item.id) { return; }

			/*
			switch (item.id) {
				case 1:
					break;
				case 2:
					break;
				case 3:
					break;
				case 4:
					break;
				case 5:
					break;
				case 6:
					break;
				//default;
			}
			*/
		};

		this.loadData = function (callback) {
			var i,
				count = 0,
				total = 6;

			ticketFactory.getStatus(function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControl.status.push({
							id: result[i].num_id,
							name: result[i].nom_status_ocor
						});
					}
				}
				if (++count === total && callback) { callback(); }
			}, true);

			ticketFactory.getPriorities(function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControl.priorities.push({
							id: result[i].num_id,
							name: result[i].nom_priorid_ocor
						});
					}
				}
				if (++count === total && callback) { callback(); }
			}, true);

			ticketFactory.getOrigins(function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControl.origins.push({
							id: result[i].num_id,
							name: result[i].nom_orig_ocor
						});
					}
				}
				if (++count === total && callback) { callback(); }
			}, true);

			ticketFlowFactory.getAll(function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControl.flows.push({
							id: result[i].num_id,
							name: result[i].nom_ocor_fluxo
						});
					}
				}
				if (++count === total && callback) { callback(); }
			}, true);

			subjectFactory.getSubjects(function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControl.subjects.push({
							id: result[i].num_id,
							name: result[i].nom_assunto_ocor
						});
					}
				}
				if (++count === total && callback) { callback(); }
			}, false, false);

			ticketRatingFactory.getAll(function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControl.ratings.push({
							id: result[i].num_id,
							name: result[i].nom_classif_ocor
						});
					}
				}
				if (++count === total && callback) { callback(); }
			}, true);

		};


		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.model ? angular.copy(parameters.model) : {};

		this.validadeParameterModel(function () {
			CRMControl.loadData();
		});

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
		'crm.crm_configur_acao_ocor.factory', 'crm.crm_ocor.factory', 'crm.crm_ocor_fluxo.factory', 'crm.crm_assunto_ocor.factory', 'crm.crm_classificacao_ocor.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.generic-action-setting-rules.modal.edit', modal);
	index.register.controller('crm.generic-action-setting-rules.edit.control', controller);
});
