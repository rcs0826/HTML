/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index'
], function (index) {

	'use strict';

	var modalAttribute,
		controllerAttribute;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalAttribute = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/report/parameter-attribute.edit.html',
				controller: 'crm.parameter-attribute.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};

	modalAttribute.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerAttribute = function ($rootScope, $scope, parameters, legend, $modalInstance, helper, TOTVSEvent) {

		var CRMControl = this;

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

			var description = CRMControl.model.nom_description,
				list = [],
				msg = "",
				delimiter = this.model.delimiter.value,
				pos,
				res,
				addInList;

			addInList = function (description) {
				if (CRMUtil.isDefined(description)) {
					res = description.split("|");
				}

				if (res && res[0].trim().length > 40) {
					msg = (msg.length > 0) ? (msg + ", " + res[0]) : (msg + res[0]);
				} else {
					list.push({
						nom_atrib: res[0],
						cod_atrib: res.length > 1 ? res[1] : res[0]
					});
				}
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

			if (msg && msg.trim().length > 0) {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					type: 'warning',
					title: 'l-confirm-save',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n('l-confirm-disregard-attributes-with-error', [msg, 40], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (!isPositiveResult) { return; }
						$modalInstance.close(list);
					}
				});
			} else {
				$modalInstance.close(list);
			}
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
				messages.push('l-attribute');
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

		//CRMControl.parentId = angular.copy(parameters.parentId);
		this.init();


		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});


	};

	controllerAttribute.$inject = ['$rootScope', '$scope', 'parameters', 'crm.legend', '$modalInstance',
								   'crm.helper', 'TOTVSEvent'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************


	index.register.service('crm.parameter-attribute.modal.edit', modalAttribute);

	index.register.controller('crm.parameter-attribute.edit.control', controllerAttribute);

});
