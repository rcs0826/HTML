/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1068.js'
], function (index) {

	'use strict';

	var modalScriptEdit,
		controllerScriptEdit;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalScriptEdit = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/script/script.edit.html',
				controller: 'crm.script.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};

	modalScriptEdit.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerScriptEdit = function ($rootScope, $scope, parameters, legend, $modalInstance, $location,
									 scriptFactory, TOTVSEvent, helper, scriptHelper) {

		var CRMControlScriptEdit = this;

		this.model = undefined;

		this.types = scriptHelper.types;

		this.duplicateOrigin = undefined;
		this.duplicateMode = undefined;
		this.editMode = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.save = function () {

			if (this.isInvalidForm()) { return; }

			var i,
				vo = this.convertToSave(),
				ticketPostPersist;

			if (!vo) { return; }

			if (this.duplicateMode === true) {
				scriptFactory.duplicateRecord(this.duplicateOrigin, vo, CRMControlScriptEdit.afterSave);
			} else if (this.editMode === true) {
				scriptFactory.updateRecord(vo.num_id, vo, CRMControlScriptEdit.afterSave);
			} else {
				scriptFactory.saveRecord(vo, CRMControlScriptEdit.afterSave);
			}
		};

		this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false;

			if (!this.model.idi_tip_script || !this.model.idi_tip_script.num_id) {
				isInvalidForm = true;
				messages.push('l-script-type');
			}

			if (!this.model.nom_script || this.model.nom_script.length <= 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (!this.model.dsl_script || this.model.dsl_script.length <= 0) {
				isInvalidForm = true;
				messages.push('l-description');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-script', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {
			var modelToSave = {},
				removeTimeFromDate;

			removeTimeFromDate = function (date) {
				date = new Date(date);
				date.setHours(0);
				date.setMinutes(0);
				date.setMilliseconds(0);
				return date.getTime();
			};

			if (this.model.num_id && this.model.num_id > 0) {
				modelToSave.num_id = this.model.num_id;
			}

			modelToSave.nom_script = this.model.nom_script;
			modelToSave.dsl_script = this.model.dsl_script;

			if (this.model.idi_tip_script) {
				modelToSave.idi_tip_script = this.model.idi_tip_script.num_id;
			}

			modelToSave.val_inic_valid = this.model.val_inic_valid || 1;
			modelToSave.val_fim_valid  = this.model.val_fim_valid  || 1;
			modelToSave.num_livre_1    = this.model.num_livre_1    || 1;

			return modelToSave;
		};

		this.afterSave = function (script) {
			var message;

			if (script) {
				$rootScope.$broadcast(CRMEvent.scopeSaveScript, script);
			}

			if (CRMControlScriptEdit.duplicateMode === true) {
				message = $rootScope.i18n('msg-script-duplicate', [], 'dts/crm');
				$location.path('/dts/crm/script/detail/' + script.num_id);
			} else if (CRMControlScriptEdit.editMode === true) {
				message = $rootScope.i18n('msg-update-generic', [$rootScope.i18n('l-script', [], 'dts/crm'), script.nom_script], 'dts/crm');
			} else {
				message = $rootScope.i18n('msg-save-generic', [$rootScope.i18n('l-script', [], 'dts/crm'), script.nom_script], 'dts/crm');
				$location.path('/dts/crm/script/detail/' + script.num_id);
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('nav-script', [], 'dts/crm'),
				detail: message
			});

			$modalInstance.close(script);
		};

		this.loadPreferences = function (callback) {
			if (callback) { callback(); }
		};

		this.validadeParameterModel = function () {
			var model = CRMControlScriptEdit.model;

			if (CRMControlScriptEdit.duplicateMode === true) {
				CRMControlScriptEdit.duplicateOrigin = CRMControlScriptEdit.model.num_id;

				delete CRMControlScriptEdit.model.num_id;
				CRMControlScriptEdit.editMode = false;

				CRMControlScriptEdit.model.nom_script = "";
				CRMControlScriptEdit.model.log_edit_remove = true;
				CRMControlScriptEdit.model.val_inic_valid = 0;
				CRMControlScriptEdit.model.val_fim_valid  = 0;

				model.idi_tip_script = {
					num_id: model.idi_tip_script,
					nom_tip_script: model.nom_tip_script
				};
			}

			if (CRMControlScriptEdit.editMode === true) {
				model.idi_tip_script = {
					num_id: model.idi_tip_script,
					nom_tip_script: model.nom_tip_script
				};
			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		CRMControlScriptEdit.model = parameters.script ? angular.copy(parameters.script) : {};
		CRMControlScriptEdit.editMode = (CRMControlScriptEdit.model && CRMControlScriptEdit.model.num_id !== undefined) ? true : false;
		CRMControlScriptEdit.duplicateMode = parameters.duplicate || false;


		this.loadPreferences(function () {
			CRMControlScriptEdit.validadeParameterModel();
		});

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlScriptEdit = undefined;
		});


	};

	controllerScriptEdit.$inject = ['$rootScope', '$scope', 'parameters', 'crm.legend', '$modalInstance', '$location',
								   'crm.crm_script.factory', 'TOTVSEvent', 'crm.helper', 'crm.script.helper'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.script.modal.edit', modalScriptEdit);

	index.register.controller('crm.script.edit.control', controllerScriptEdit);

});
