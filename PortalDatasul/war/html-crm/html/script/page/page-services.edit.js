/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1068.js'
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
				templateUrl: '/dts/crm/html/script/page/page.edit.html',
				controller: 'crm.script-page.edit.control as controller',
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

	controller = function ($rootScope, $scope, $modalInstance, parameters, helper, legend,
							TOTVSEvent, factory) {

		var CRMControl = this;

		this.model = undefined;
		this.resultList = undefined;
		this.script = undefined;
		this.sequence = undefined;
		this.editMode = false;

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
					title: $rootScope.i18n('nav-script', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-page', [], 'dts/crm'), item.nom_pag
					], 'dts/crm')
				});

				item.ttQuestionarioQuestao = CRMControl.model.ttQuestionarioQuestao;
				CRMControl.close(item, isToContinue);
			};

			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updatePage(CRMControl.script, vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.savePage(CRMControl.script, vo, fnAfterSave);
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

			if (model.nom_pag === undefined || model.nom_pag.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-script', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;
			vo.num_id_script = CRMControl.script;
			vo.num_pag = model.num_pag || this.sequence;
			vo.nom_pag = model.nom_pag;
			vo.val_peso = model.val_peso;

			return vo;
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.page ? angular.copy(parameters.page) : {};
		this.script = parameters.script ? angular.copy(parameters.script) : undefined;

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
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'crm.helper', 'crm.legend',
		'TOTVSEvent', 'crm.crm_script.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.script-page.modal.edit', modal);
	index.register.controller('crm.script-page.edit.control', controller);
});
