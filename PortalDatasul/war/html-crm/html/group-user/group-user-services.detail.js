/*globals index, define, angular, TOTVSEvent, console, CRMEvent */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1046.js',
	'/dts/crm/js/zoom/crm_usuar.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $stateParams, $location, TOTVSEvent, helper,
							factory, modalEdit) {

		var CRMControl = this;

		this.model = undefined;
		this.historyTextOpen = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.onEdit = function () {
			modalEdit.open({
				model: CRMControl.model
			}).then(function (result) {
				if (result) {
					CRMControl.model = result;
				}
			});
		};


		this.onRemove = function () {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-group-user', [], 'dts/crm').toLowerCase(), CRMControl.model.nom_grp_usuar
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(CRMControl.model.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-group-user', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/group-user/');
					});
				}
			});
		};

		this.convertToSaveUsers = function (user, groupId) {
			if (!user) { return; }

			var vo = {
				"num_id_grp_usuar": groupId,
				"num_id_usuar": user.num_id
			};

			return vo;
		};

		this.addUsers = function (groupUser) {
			var i,
				//usersAddWithSuccess,
				vo;

			if (CRMControl.selectedUsers.objSelected) {
				vo = [];

				for (i = 0; i < CRMControl.selectedUsers.objSelected.length; i++) {
					vo.push(this.convertToSaveUsers(CRMControl.selectedUsers.objSelected[i], groupUser.num_id));
				}

			} else {
				vo = this.convertToSaveUsers(CRMControl.selectedUsers, groupUser.num_id);
			}

			factory.addUsers(vo, function (result) {
				if (result) {
					CRMControl.getUsers(groupUser);
				}
			});

			CRMControl.selectedUsers = undefined;

		};

		this.getUsers = function (groupUser) {
			groupUser.ttUsuario = [];

			if (!groupUser || !groupUser.num_id) { return; }

			factory.getAllUsers(groupUser.num_id, function (result) {
				groupUser.ttUsuario = result;
			}, false);
		};

		this.removeUser = function (id, users, index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-user', [], 'dts/crm').toLowerCase(), users[index].nom_usuar
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.removeUser(id, function (result) {
						if (result.l_ok) {
							users.splice(index, 1);

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('l-user', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});
						}
					});

				}
			});

		};

		this.setAsResponsible = function (users, user) {

			factory.setAsResponsible(user.num_id, function (result) {

				if (!result && result.l_ok === false) { return; }

				var i;

				for (i = 0; i < users.length; i++) {
					if (users[i].num_id === user.num_id) {
						users[i].log_usuar_respons = true;
					} else {
						users[i].log_usuar_respons = false;
					}
				}
			});
		};

		this.load = function (id) {
			factory.getRecord(id, function (result) {
				if (result) {
					CRMControl.model = result;
					//CRMControl.getUsers(CRMControl.model);
				}
			});
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-group-user', [], 'dts/crm'),
				viewController = 'crm.group-user.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = {};

				if ($stateParams && $stateParams.id) {
					CRMControl.load($stateParams.id);
				}
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControl.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$stateParams', '$location', 'TOTVSEvent', 'crm.helper',
		'crm.crm_grp_usuar.factory', 'crm.group-user.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.group-user.detail.control', controller);

});
