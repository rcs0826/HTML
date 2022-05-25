/*global $, index, angular, define, TOTVSEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1000.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1046.js',
	'/dts/crm/js/zoom/crm_usuar.js'
], function (index) {

	'use strict';

	var modalWizard,
		controllerWizard;

	// *************************************************************************************
	// *** CONTROLLER WIZARD
	// *************************************************************************************

	controllerWizard = function ($rootScope, $scope, $location, TOTVSEvent, helper, taskFactory, userFactory, paramFactory, userGroupFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlWizard = this,
			parameters = ($scope.parameters || {}),
			$modalInstance = ($scope.$modalInstance || undefined);

		this.isModal = $scope.isModal === true;

		this.page = 1;
		this.lastPage = 0;
		this.isOnlyResponsibleExecuteTask = false;
		this.groups = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.closeView = function (status) {
			if ($modalInstance) {
				if (status) {
					$modalInstance.close(status);
				} else {
					$modalInstance.dismiss('cancel');
				}
			}
		};

		this.onZoomSelectUsers = function (model) {
			var i,
				j,
				users = angular.copy(model.ttUsuario),
				lDuplicated;

			if (!CRMControlWizard.selectedUsers) { return; }

			if (CRMControlWizard.selectedUsers.objSelected && CRMControlWizard.selectedUsers.size >= 0) {
				CRMControlWizard.selectedUsers = CRMControlWizard.selectedUsers.objSelected;
			}

			if (!angular.isArray(CRMControlWizard.selectedUsers)) {
				CRMControlWizard.selectedUsers = [CRMControlWizard.selectedUsers];
			}

			if (users && users.length > 0) {

				for (i = 0; i < CRMControlWizard.selectedUsers.length; i++) {
					lDuplicated = false;

					for (j = 0; j < users.length; j++) {
						if (CRMControlWizard.selectedUsers[i].num_id === users[j].num_id) {
							lDuplicated = true;
							break;
						}
					}

					if (lDuplicated === false) {
						model.ttUsuario.push(CRMControlWizard.selectedUsers[i]);
					}

				}

			} else {
				model.ttUsuario = CRMControlWizard.selectedUsers;
			}

			CRMControlWizard.selectedUsers = undefined;
		};

		this.removeUser = function (users, index) {
			if (index > -1) {
				users.splice(index, 1);
			}
		};

		this.loadPreferences = function (callback) {
			if (CRMControlWizard.wizardTo === 'activeUserGroupTask') {
				taskFactory.isOnlyResponsibleExecuteTask(function (result) {
					CRMControlWizard.isOnlyResponsibleExecuteTask = result;
					if (callback) { callback(); }
				}, true);
			} else {
				if (callback) { callback(); }
			}
		};

		this.validateParameters = function (callback) {
			if (CRMUtil.isUndefined(parameters)) {
				if (callback) { callback(false); }
			}

			CRMControlWizard.preference = parameters.preference || {};
			CRMControlWizard.configur = [];

			if (CRMUtil.isDefined(parameters.wizardTo)) {
				CRMControlWizard.wizardTo = parameters.wizardTo;
			}

			if (callback) { callback(true); }
		};

		this.setConfigur = function () {
			if (CRMControlWizard.wizardTo === 'activeUserGroupTask') {

				CRMControlWizard.wizardTitle = $rootScope.i18n('l-active-user-group-task', [], 'dts/crm');

				CRMControlWizard.configur.push({
					description: $rootScope.i18n('msg-active-user-group-task', [], 'dts/crm'),
					title: $rootScope.i18n('l-informative', [], 'dts/crm'),
					page: 1,
					id: 1
				});

				if (CRMControlWizard.isOnlyResponsibleExecuteTask === true) {
					CRMControlWizard.configur.push({
						description: $rootScope.i18n('msg-disable-only-responsible-execute-task', [], 'dts/crm'),
						stepTitle: $rootScope.i18n('l-update-conflicting-parameter', [], 'dts/crm'),
						page: (CRMControlWizard.configur.length + 1),
						id: 2
					});
				}

				CRMControlWizard.configur.push({
					description: $rootScope.i18n('msg-set-default-user-group', [], 'dts/crm'),
					title: $rootScope.i18n('l-defining-user-group-for-crm-users', [], 'dts/crm'),
					page: (CRMControlWizard.configur.length + 1),
					id: 3
				});

				CRMControlWizard.configur.push({
					description: $rootScope.i18n('msg-set-group-user-task', [], 'dts/crm'),
					title: $rootScope.i18n('l-updating-user-group-in-tasks', [], 'dts/crm'),
					page: (CRMControlWizard.configur.length + 1),
					id: 4
				});

				CRMControlWizard.configur.push({
					description: $rootScope.i18n('msg-apply-settings', [], 'dts/crm'),
					title: $rootScope.i18n('l-confirmation', [], 'dts/crm'),
					page: (CRMControlWizard.configur.length + 1),
					id: 5
				});

			}

			CRMControlWizard.lastPage = CRMControlWizard.configur.length;
		};

		this.validateActiveUserGroupTask = function (callback) {
			var i,
				user,
				message,
				config;

			if (CRMControlWizard.page > 1) {

				config = CRMControlWizard.configur[CRMControlWizard.page - 1];

				if (config.id === 2 && config.value !== true) {
					message = 'msg-not-proceed-without-adjustments';
				} else if (config.id === 3) {

					if (CRMUtil.isUndefined(config.ttGroupUser)) {
						message = 'msg-not-proceed-without-default-group';
					}

					config.ttUsuario = config.ttUsuario || [];

					for (i = 0; i < config.ttUsuario.length; i++) {

						user = config.ttUsuario[i];

						if (CRMUtil.isUndefined(user.ttGroupUser)) {
							message = 'msg-not-proceed-without-set-user-default-group';
							break;
						}
					}
				}

				if (CRMUtil.isDefined(message)) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: ($rootScope.i18n('l-wizard', [], 'dts/crm') + ': ' + CRMControlWizard.wizardTitle),
						detail: $rootScope.i18n(message, [], 'dts/crm')
					});
				}
			}

			if (callback) { callback(CRMUtil.isUndefined(message)); }
		};

		/*
		this.getUserWithoutGroup = function (callback) {
			userFactory.getUsersWithoutGroupDefault(function (result) {
				if (callback) { callback(result); }
			}, true);
		};
		*/

		this.getGroups = function () {
			userGroupFactory.getAllGroups(function (result) {
				if (!result) { return; }
				CRMControlWizard.groups = result;
			}, true);
		};

		this.next = function () {
			var i,
				isOK = true;

			if (CRMControlWizard.wizardTo === 'activeUserGroupTask') {
				CRMControlWizard.validateActiveUserGroupTask(function (result) {
					if (result === true) {
						CRMControlWizard.page++;
					}
				});
			}
		};

		this.previous = function () {
			if (CRMControlWizard.page > 1) { CRMControlWizard.page--; }
		};

		this.save = function () {
			var i,
				j,
				config = [],
				users,
				selected;

			if (CRMControlWizard.wizardTo === 'activeUserGroupTask') {

				for (i = 0; i < CRMControlWizard.configur.length; i++) {
					selected = CRMControlWizard.configur[i];

					if (selected.id === 2) {
						config.push({
							codigo: selected.id.toString(),
							agrupador: '1-disable-only-responsible-execute-task',
							valor: selected.value.toString()
						});
					} else if (selected.id === 3) {
						config.push({
							codigo: selected.id.toString(),
							agrupador: '3-set-default-user-group',
							valor: ((selected.ttGroupUser && selected.ttGroupUser.num_id) ? selected.ttGroupUser.num_id.toString() : '')
						});

						if (CRMUtil.isDefined(selected.ttUsuario) && angular.isArray(selected.ttUsuario)) {
							users = selected.ttUsuario;
						}

					} else if (selected.id === 4 && CRMUtil.isDefined(selected.value)) {
						config.push({
							codigo: selected.id.toString(),
							agrupador: '4-set-user-group-task',
							valor: selected.value.toString()
						});
					}
				}

				if (users && users.length > 0) {
					for (j = 0; j < users.length; j++) {
						selected = users[j];

						if (CRMUtil.isDefined(selected.ttGroupUser) && CRMUtil.isDefined(selected.ttGroupUser.num_id)) {

							config.push({
								codigo: selected.num_id.toString(),
								agrupador: '2-set-user-group-user',
								valor: selected.ttGroupUser.num_id.toString()
							});
						}
					}
				}

				paramFactory.setConfigUserGroupTask(config, function (result) {
					if (!result) { return; }

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: ($rootScope.i18n('l-wizard', [], 'dts/crm') + ': ' + CRMControlWizard.wizardTitle),
						detail: $rootScope.i18n('msg-save-configuration', [], 'dts/crm')
					});

					CRMControlWizard.closeView('success');
				});
			}

		};

		this.cancel = function () {
			CRMControlWizard.closeView("cancel");
		};

		this.onChangeUsers = function (config) {
			config.isOpen = !config.isOpen;
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		CRMControlWizard.validateParameters(function (isOK) {
			if (isOK === true) {
				if (CRMControlWizard.wizardTo === 'activeUserGroupTask') {
					CRMControlWizard.getGroups();
				}

				CRMControlWizard.loadPreferences(function () {
					CRMControlWizard.setConfigur();
				});
			}
		});

		helper.loadCRMContext();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlWizard = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) {
				$modalInstance.dismiss('cancel');
			}
		});
	};

	controllerWizard.$inject = [
		'$rootScope', '$scope', '$location', 'TOTVSEvent', 'crm.helper', 'crm.crm_tar.factory', 'crm.crm_usuar.factory', 'crm.crm_param.factory', 'crm.crm_grp_usuar.factory'
	];

	// *************************************************************************************
	// *** MODAL WIZARD
	// *************************************************************************************
	modalWizard = function ($rootScope, $modal) {
		this.open = function (params) {

			params = params || {};

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/wizard/wizard.html',
				controller: 'crm.wizard.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};

	modalWizard.$inject = ['$rootScope', '$modal'];


	// ########################################################
	// ### Register
	// ########################################################
	index.register.service('crm.wizard.modal', modalWizard);

	index.register.controller('crm.wizard.control', controllerWizard);
});
