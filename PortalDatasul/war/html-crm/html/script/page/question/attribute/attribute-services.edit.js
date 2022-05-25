/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index'
], function (index) {

	'use strict';

	var modalScriptQuestionAttributeEdit,
		controllerScriptQuestionAttributeEdit;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalScriptQuestionAttributeEdit = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/script/page/question/attribute/attribute.edit.html',
				controller: 'crm.script-question-attribute.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};

	modalScriptQuestionAttributeEdit.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerScriptQuestionAttributeEdit = function ($rootScope, $scope, parameters, legend, $modalInstance, helper) {

		var CRMControlScriptQuestionAttributeEdit = this;

		this.model = {};

		this.ttDelimiter = [
			{name: $rootScope.i18n('l-enter', [], 'dts/crm'), value: "\n"},
			{name: ";", value: ";"},
			{name: ",", value: ","},
			{name: "#", value: "#"}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.add = function () {
			if (this.isInvalidForm()) { return; }

			var description = CRMControlScriptQuestionAttributeEdit.model.nom_description,
				listAttributes = [],
				delimiter = this.model.delimiter.value,
				pos,
				addInList,
				item = {
					val_peso: 0,
					nom_atrib: ""
				};

			addInList = function (name) {
				listAttributes.push({
					val_peso: 0,
					nom_atrib: name
				});
			};

			pos = description.indexOf(delimiter);

			if (pos === -1 && description.length > 0) {
				addInList(description);
			} else {
				while (pos !== -1) {
					addInList(description.substring(0, pos));

					description = description.substring(pos + 1, description.length);
					pos = description.indexOf(delimiter);

					if (pos === -1 && description.length > 0) {
						pos = description.length;
					}
				}
			}

			$modalInstance.close(listAttributes);
		};

		this.isInvalidForm = function () {

			var i,
				messages = [],
				isInvalidForm = false,
				model = this.model;

			if (CRMUtil.isUndefined(model.delimiter) || CRMUtil.isUndefined(model.delimiter.value)) {
				messages.push('l-delimiter');
				isInvalidForm = true;
			}

			if (CRMUtil.isUndefined(model.nom_description)) {
				messages.push('l-description');
				isInvalidForm = true;
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-attribute', messages);
			}

			return isInvalidForm;
		};

		this.init = function () {
			this.model.delimiter = this.ttDelimiter[0];
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		//CRMControlScriptQuestionAttributeEdit.parentId = angular.copy(parameters.parentId);
		this.init();


		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlScriptQuestionAttributeEdit = undefined;
		});


	};

	controllerScriptQuestionAttributeEdit.$inject = ['$rootScope', '$scope', 'parameters', 'crm.legend', '$modalInstance', 'crm.helper'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************


	index.register.service('crm.script-question-attribute.modal.edit', modalScriptQuestionAttributeEdit);
	index.register.controller('crm.script-question-attribute.edit.control', controllerScriptQuestionAttributeEdit);

});
