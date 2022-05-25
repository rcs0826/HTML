/*global $, index, angular, define, Boolean, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1092.js',
	'/dts/crm/html/attachment-type/attachment-type-services.edit.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var modalUserSummary,
		controllerUserSummary;

	// *************************************************************************************
	// *** MODAL SUMMARY
	// *************************************************************************************
	modalUserSummary = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/attachment/attachment-type.select.html',
				controller: 'crm.attachment-type.select.control as controller',
				backdrop: 'static',
				keyboard: false,
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalUserSummary.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER MODAL SUMMARY
	// *************************************************************************************
	controllerUserSummary = function ($rootScope, $scope, $modalInstance, TOTVSEvent, parameters, attachmentTypeFactory,
									  modalEditAttachmentType, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAttachmentType = this;

        this.accessRestriction = undefined;
		this.model				= undefined;
		this.selectedFiles		= undefined;
		this.ttAttachmentType	= undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function () {

			accessRestrictionFactory.getUserRestrictions('attachment-type.select', $rootScope.currentuser.login, function (result) {
				CRMControlAttachmentType.accessRestriction = result || {};
			});

			attachmentTypeFactory.getAll(function (result) {

				if (!result) { return; }

				CRMControlAttachmentType.ttAttachmentType = angular.copy(result);

			});
		};

		this.removeFile = function (file) {
			var index = CRMControlAttachmentType.selectedFiles.indexOf(file);
			if (index !== -1) {
				CRMControlAttachmentType.selectedFiles.splice(index, 1);
			}
			if (CRMControlAttachmentType.selectedFiles.length === 0) {
				CRMControlAttachmentType.close();
			}
		};

		this.isInvalidForm = function () {
			var isInvalidForm = false,
				files = '',
				isPlural,
				message,
				countFiles = 0,
				i;

			for (i = 0; i < CRMControlAttachmentType.selectedFiles.length; i += 1) {
				if (!CRMControlAttachmentType.selectedFiles[i].ttTipAnexo) {
					files += CRMControlAttachmentType.selectedFiles[i].name;
					if (CRMControlAttachmentType.selectedFiles.length > 1 && i !== (CRMControlAttachmentType.selectedFiles.length - 1)) {
						files += ', ';
					}
					countFiles = countFiles + 1;

					isInvalidForm = true;
				}
			}

			if (isInvalidForm) {

				isPlural = countFiles > 1;
				message	 = 'msg-undefined-attachment-type' + (isPlural ? '-plural' : '');

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('nav-attachment', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [files], 'dts/crm')
				});
			}

			return isInvalidForm;
		};

		this.confirm = function () {
			if (!CRMControlAttachmentType.isInvalidForm()) {
				$modalInstance.close({
					selectedFiles: CRMControlAttachmentType.selectedFiles
				});
			}
		};

		this.close = function () {
			$modalInstance.dismiss('cancel');
		};

		this.openNewAttachment = function (item) {
			modalEditAttachmentType.open({
				attachmentType: item
			}).then(function (results) {

				results = results || [];

				var i, result;

				for (i = 0; i < results.length; i++) {

					result = results[i];

					if (CRMUtil.isUndefined(result)) { continue; }

					CRMControlAttachmentType.ttAttachmentType.unshift(result);
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.selectedFiles = parameters;

		this.load();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAttachmentType = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerUserSummary.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'TOTVSEvent', 'parameters', 'crm.crm_tip_anexo.factory',
		'crm.attachment-type.modal.edit', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.attachment-type.select.modal.control', modalUserSummary);

	index.register.controller('crm.attachment-type.select.control', controllerUserSummary);
});
