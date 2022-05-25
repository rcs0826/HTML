/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/js/api/fchcrm1046.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_grp_usuar.js',
	'/dts/crm/html/user/user-services.js'
], function (index) {

	'use strict';

	var controllerAccessRestrictionDetail;

	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controllerAccessRestrictionDetail = function ($rootScope, $scope, $stateParams, TOTVSEvent, appViewService, accessRestrictionFactory,
												   modalFormSelection, modalEdit, $location, helper) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlAccessRestrictionDetail = this;

		this.model = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function (id) {
			accessRestrictionFactory.getRecord(id, function (result) {
				if (result) {
					CRMControlAccessRestrictionDetail.model = result;
				}
			});
		};

		this.onEdit = function () {
			modalEdit.open({
				restriction: CRMControlAccessRestrictionDetail.model
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					CRMControlAccessRestrictionDetail.model = result;
				}
			});
		};

		this.onRemove = function () {

			var restriction = CRMControlAccessRestrictionDetail.model;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-restriction', [], 'dts/crm').toLowerCase(), restriction.nom_acess
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					accessRestrictionFactory.deleteRecord(restriction.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-restriction', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/access-restriction/');
					});
				}
			});
		};

		this.addForm = function () {

			var restriction = this.model;

			modalFormSelection.open({
				idRestriction: restriction.num_id,
				listOfAccessRestrictionForms: restriction.ttRegraAcesso
			}).then(function (result) {

				if (!result || result.length === 0) { return; }

				var i,
					forms = '',
					formGeneral;

				restriction.ttRegraAcesso = restriction.ttRegraAcesso || [];

				for (i = 0; i < result.length; i++) {

					if (i === 0) {
						forms = result[i].nom_form;
					} else {
						forms += ', ' + result[i].nom_form;
					}

					restriction.ttRegraAcesso.splice(1, 0, result[i]);
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-restriction', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic', [
						$rootScope.i18n((result.length > 0 ? 'nav-restriction' : 'l-restriction'), [], 'dts/crm'),
						forms, restriction.nom_acess
					], 'dts/crm')
				});

				formGeneral = restriction.ttRegraAcesso[0];
				CRMControlAccessRestrictionDetail.loadFormComponents(formGeneral, true);
			});
		};

		this.removeForm = function (form, $event) {

			$event.preventDefault();
			$event.stopPropagation();

			var restriction = this.model;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-form', [], 'dts/crm').toLowerCase(), form.nom_form
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					var index,
						formGeneral;


					if (!isPositiveResult) { return; }

					accessRestrictionFactory.deleteForm(form.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-form', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						index = restriction.ttRegraAcesso.indexOf(form);

						if (index !== -1) {
							restriction.ttRegraAcesso.splice(index, 1);
						}

						formGeneral = restriction.ttRegraAcesso[0];

						if (restriction.ttRegraAcesso.length > 1) {
							CRMControlAccessRestrictionDetail.loadFormComponents(formGeneral, true);
						} else {
							formGeneral.ttComponente = [];
						}
					});
				}
			});
		};

		this.loadFormComponents = function (form, reloadGeneral) {

			if (form.ttComponente && reloadGeneral !== true) { return; }

			form.ttComponente = [];

			accessRestrictionFactory.getFormComponents(this.model.num_id, form.num_id_acess_form_portal, function (result) {
				if (!result) { return; }

				result = result.sort(function (item1, item2) {
					if (item1.nom_compon < item2.nom_compon) { return -1; }
					if (item1.nom_compon > item2.nom_compon) { return 1; }
					return 0;
				});

				form.ttComponente = result;
			});
		};

		this.setFormComponentEditable = function (form, $index) {
			// Utilizado o $index para o $scope reconhecer a alteração no model aninhado do ng-repeat. Do not touch!
			form.ttComponente[$index].log_visivel = true;
			form.ttComponente[$index].log_disable_editable = true;
			this.setFormComponentRestriction(form, $index);
		};

		this.setFormComponentVisible = function (form, $index) {
			// Utilizado o $index para o $scope reconhecer a alteração no model aninhado do ng-repeat. Do not touch!
			form.ttComponente[$index].log_editavel = true;
			form.ttComponente[$index].log_disable_visible = true;
			this.setFormComponentRestriction(form, $index);
		};

		this.setFormComponentRestriction = function (form, $index) {
			// Utilizado o $index para o $scope reconhecer a alteração no model aninhado do ng-repeat. Do not touch!
			accessRestrictionFactory.setFormComponentRestriction(form.ttComponente[$index], function (result) {
				if (!result) { return; }
				result.log_disable_editable = false;
				result.log_disable_visible = false;
				form.ttComponente[$index] = result;
			});
		};

		this.onZoomSelectUsersOrGroups = function () {

			if (!this.selectedUsersOrGroups) { return; }

			if (this.selectedUsersOrGroups.objSelected && this.selectedUsersOrGroups.size >= 0) {
				this.selectedUsersOrGroups = this.selectedUsersOrGroups.objSelected;
			}

			if (!angular.isArray(this.selectedUsersOrGroups)) {
				this.selectedUsersOrGroups = [this.selectedUsersOrGroups];
			}

			var i,
				userGroup,
				userGroups = [],
				restriction,
				userGroupsNames;

			for (i = 0; i < this.selectedUsersOrGroups.length; i++) {

				userGroup = this.selectedUsersOrGroups[i];

				if (CRMUtil.isDefined(userGroup.nom_usuar)) {
					userGroups.push({num_id_usuar: userGroup.num_id});
				} else {
					userGroups.push({num_id_grp_usuar: userGroup.num_id});
				}
			}

			this.selectedUsersOrGroups = undefined;

			restriction = this.model;

			accessRestrictionFactory.addUserGroups(restriction.num_id, userGroups, function (result) {

				if (!result || result.length === 0) { return; }

				restriction.ttUsuario = restriction.ttUsuario || [];

				userGroupsNames = '';

				for (i = 0; i < result.length; i++) {

					if (i === 0) {
						userGroupsNames = (result[i].log_usuar ? result[i].nom_usuar : result[i].nom_grp_usuar);
					} else {
						userGroupsNames += ', ' + (result[i].log_usuar ? result[i].nom_usuar : result[i].nom_grp_usuar);
					}

					restriction.ttUsuario.push(result[i]);
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-restriction', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-save-related-generic', [
						$rootScope.i18n((result.length > 0 ? 'nav-restriction' : 'l-restriction'), [], 'dts/crm'),
						userGroupsNames, restriction.nom_acess
					], 'dts/crm')
				});
			});
		};

		this.removeUserGroup = function (userGroup) {

			var restriction = this.model;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n((userGroup.log_usuar ? 'l-user' : 'l-group'), [], 'dts/crm').toLowerCase(),
					(userGroup.log_usuar ? userGroup.nom_usuar : userGroup.nom_grp_usuar)
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					accessRestrictionFactory.deleteUserGroup(userGroup.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n((userGroup.log_usuar ? 'l-user' : 'l-group'), [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						var index = restriction.ttUsuario.indexOf(userGroup);

						if (index !== -1) {
							restriction.ttUsuario.splice(index, 1);
						}
					});
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			helper.loadCRMContext(function () {
				appViewService.startView($rootScope.i18n('nav-restriction', [], 'dts/crm'), 'crm.access-restriction.detail.control', CRMControlAccessRestrictionDetail);
				CRMControlAccessRestrictionDetail.model = undefined;

				if ($stateParams && $stateParams.id) {
					CRMControlAccessRestrictionDetail.load($stateParams.id);
				}
			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlAccessRestrictionDetail = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlAccessRestrictionDetail.init();
		});
	}; // controllerAccessRestrictionDetail
	controllerAccessRestrictionDetail.$inject = [
		'$rootScope', '$scope', '$stateParams', 'TOTVSEvent', 'totvs.app-main-view.Service',
		'crm.crm_acess_portal.factory', 'crm.access-restriction.modal.selection',
		'crm.access-restriction.modal.edit', '$location', 'crm.helper'
	];
	// ***************************************************
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.access-restriction.detail.control', controllerAccessRestrictionDetail);
});
