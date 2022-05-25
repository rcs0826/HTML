/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1003.js',
	'/dts/crm/js/api/fchcrm1063.js',
	'/dts/crm/js/api/fchcrm1059.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerAccountDocumentTab,
		modalAccountDocumentEdit,
		controllerAccountDocumentEdit;

	controllerAccountDocumentTab = function ($rootScope, $scope, TOTVSEvent, helper, documentFactory,
											  modalAccountDocumentEdit, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccountDocumentTab = this;

		this.accessRestriction = undefined;

		this.listOfDocument = [];
		this.listOfDocumentCount = 0;

		this.account = undefined;

		this.isEnabled = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.addEdit = function (document) {
			var vo = angular.copy(document),
				index;

			modalAccountDocumentEdit.open({
				document: vo,
				account: this.account
			}).then(function (result) {

				if (!result) {
					return;
				}

				if (document) {
					index = CRMControlAccountDocumentTab.listOfDocument.indexOf(document);
					CRMControlAccountDocumentTab.listOfDocument[index] = result;
				} else {
					CRMControlAccountDocumentTab.listOfDocumentCount++;
					CRMControlAccountDocumentTab.listOfDocument.unshift(result);
				}
			});
		};

		this.load = function () {
			documentFactory.getDocumentsByAccount(this.account.num_id, function (result) {
				if (!result) { return; }

				CRMControlAccountDocumentTab.listOfDocument = result;
				CRMControlAccountDocumentTab.listOfDocumentCount = result.length;
			});
		};

		this.remove = function (document) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-document', [], 'dts/crm').toLowerCase(),
					(document.nom_tip_docto + ': ' + document.cod_docto_ident)
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (isPositiveResult) {
						documentFactory.deleteRecord(document.num_id, function (result) {

							if (!result || result.l_ok !== true) {
								return;
							}

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-document', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							var index = CRMControlAccountDocumentTab.listOfDocument.indexOf(document);

							if (index !== -1) {
								CRMControlAccountDocumentTab.listOfDocument.splice(index, 1);
								CRMControlAccountDocumentTab.listOfDocumentCount--;
							}
						});
					}
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function (account, isEnabled) {
			accessRestrictionFactory.getUserRestrictions('account.document.tab', $rootScope.currentuser.login, function (result) {
				CRMControlAccountDocumentTab.accessRestriction = result || {};
			});

			this.account = account;
			this.isEnabled = (isEnabled !== false);
			this.load();
		};

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccountDocumentTab = undefined;
		});

		$scope.$on(CRMEvent.scopeLoadAccount, function (event, account) {
			CRMControlAccountDocumentTab.init(account, account.log_acesso);
		});

	}; //controllerAttachmentTab

	controllerAccountDocumentTab.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.helper', 'crm.crm_docto_ident.factory',
		'crm.account-document.modal.edit', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** MODAL SELECT DOCUMENT TO ACCOUNT
	// *************************************************************************************

	modalAccountDocumentEdit = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/account/document/document.edit.html',
				controller: 'crm.account-document.edit.control as controller',
				backdrop: 'static',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalAccountDocumentEdit.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER SELECT DOCUMENT TO ACCOUNT
	// *************************************************************************************

	controllerAccountDocumentEdit = function ($rootScope, $scope, TOTVSEvent, $modalInstance, $filter, parameters,
											   documentFactory, documentTypeFactory, helper, accessRestrictionFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlDocumentEdit = this;

		this.accessRestriction = undefined;

		this.editMode = false;
		this.types = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.validadeParameterModel = function () {

			var control = CRMControlDocumentEdit;

			control.editMode = (control.document.num_id > 0 ? true : false);

			if (control.editMode) {
				control.document.ttTipo = {
					num_id	: control.document.num_id_tip_docto,
					nom_pais: control.document.nom_tip_docto
				};
			} else {
				control.document.log_docto_ativ = true; //default
			}

			control.model = control.document;
		};

		this.getTypes = function () {
			documentTypeFactory.getAll(function (result) {
				CRMControlDocumentEdit.types = result;
			});
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false;

			if (!this.model.ttTipo) {
				isInvalidForm = true;
				messages.push('l-type');
			}

			if (!this.model.cod_docto_ident) {
				isInvalidForm = true;
				messages.push('l-identification');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-document', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {
				num_id_pessoa: (this.account ? this.account.num_id : undefined),
				cod_docto_ident: this.model.cod_docto_ident,
				log_docto_ativ: this.model.log_docto_ativ
			};

			if (this.model.num_id && this.model.num_id > 0) {
				vo.num_id = this.model.num_id;
			}

			if (this.model.ttTipo) {
				vo.num_id_tip_docto = this.model.ttTipo.num_id;
			}

			return vo;
		};

		this.save = function () {

			if (CRMControlDocumentEdit.isInvalidForm()) { return; }

			var vo = CRMControlDocumentEdit.convertToSave(),
				postPersist;

			postPersist = function (result) {

				if (!result || result.num_id <= 0) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-document', [], 'dts/crm'),
					detail: $rootScope.i18n(CRMControlDocumentEdit.editMode ? 'msg-update-related-generic' : 'msg-save-related-generic', [
						$rootScope.i18n('l-document', [], 'dts/crm'),
						vo.cod_docto_ident,
						CRMControlDocumentEdit.account.nom_razao_social
					], 'dts/crm')
				});

				$modalInstance.close(result);
			};

			if (!vo) { return; }



			if (CRMControlDocumentEdit.account) {
				if (CRMControlDocumentEdit.editMode) {
					documentFactory.updateRecord(vo.num_id, vo, postPersist);
				} else {
					documentFactory.saveRecord(vo, postPersist);
				}

			}
		};

		this.init = function () {
			accessRestrictionFactory.getUserRestrictions('account.document.edit', $rootScope.currentuser.login, function (result) {
				CRMControlDocumentEdit.accessRestriction = result || {};
			});

			CRMControlDocumentEdit.validadeParameterModel();
			CRMControlDocumentEdit.getTypes();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.document = parameters.document ? angular.copy(parameters.document) : {};
		this.account = parameters.account ? angular.copy(parameters.account) : undefined;

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlDocumentEdit = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerAccountDocumentEdit.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', '$modalInstance', '$filter', 'parameters', 'crm.crm_docto_ident.factory', 'crm.crm_tip_docto.factory', 'crm.helper', 'crm.crm_acess_portal.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.account-document.modal.edit', modalAccountDocumentEdit);

	index.register.controller('crm.account-document.tab.control', controllerAccountDocumentTab);
	index.register.controller('crm.account-document.edit.control',	controllerAccountDocumentEdit);

});
