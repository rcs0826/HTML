/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1071.js'
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
				templateUrl: '/dts/crm/html/objective/objective.edit.html',
				controller: 'crm.objective.edit.control as controller',
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

	controller = function ($rootScope, $scope, $modalInstance, parameters, TOTVSEvent,
							helper, factory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;

		this.resultList = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);
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
					title: $rootScope.i18n('l-objective', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-objective', [], 'dts/crm'),
						item.nom_objet_acao
					], 'dts/crm')
				});

				CRMControl.close(item, isToContinue);
			};

			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateRecord(vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.saveRecord(vo, fnAfterSave);
			}
		};

		this.close = function (item, isToContinue) {

			CRMControl.resultList = CRMControl.resultList || [];

			if (CRMUtil.isDefined(item)) {
				CRMControl.resultList.push(item);
			}

			if (isToContinue === true) {

				CRMControl.model = {};
				CRMControl.validadeParameterModel();

			} else if ($modalInstance) {
				$modalInstance.close(CRMControl.resultList);
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.nom_objet_acao || model.nom_objet_acao.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-objective', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;
			vo.nom_objet_acao = model.nom_objet_acao;

			return vo;
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.objective ? angular.copy(parameters.objective) : {};

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
		'crm.crm_objet.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.objective.modal.edit', modal);
	index.register.controller('crm.objective.edit.control', controller);
});
