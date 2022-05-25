/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1051.js',
	'/dts/crm/js/api/fchcrm1052.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_propried.js',
	'/dts/crm/html/user/user-services.js'
], function (index) {

	'use strict';

	var controllerReportDetail;
	// *************************************************************************************
	// *** CONTROLLER DETAIL
	// *************************************************************************************

	controllerReportDetail = function ($rootScope, $scope, $stateParams, TOTVSEvent, reportFactory,
		$location, helper, modalReportEdit, reportHelper, modalReportParameter) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlReportDetail = this;

		this.model         = undefined;
		this.selectedUsers = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.load = function (id) {
			reportFactory.getRecord(id, function (result) {
				if (result) {
					result.ttCRMModule = helper.parseCRMModuleByID(result.idi_modul_crm);
					result.ttParametro = reportHelper.parseParameterType(result.ttParametro);
					CRMControlReportDetail.model = result;
				}
			});
		};

		this.onEdit = function () {
			modalReportEdit.open({
				report: CRMControlReportDetail.model
			}).then(function (result) {
				if (CRMUtil.isDefined(result)) {
					CRMControlReportDetail.model = result;
					CRMControlReportDetail.model.ttCRMModule = helper.parseCRMModuleByID(result.idi_modul_crm);
					CRMControlReportDetail.model.ttParametro = reportHelper.parseParameterType(result.ttParametro);
				}
			});
		};

		this.onRemove = function () {

			var report = CRMControlReportDetail.model;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-report', [], 'dts/crm').toLowerCase(), report.nom_relat
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					reportFactory.deleteRecord(report.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-report', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/report/');
					});
				}
			});
		};

		this.onZoomSelectUsers = function () {

			if (!this.selectedUsers) { return; }

			var user, users = [], usersAlreadyInList = [], messages, toAdd, report, i, j;

			if (this.selectedUsers.objSelected && this.selectedUsers.size >= 0) {
				this.selectedUsers = this.selectedUsers.objSelected;
			}

			if (!angular.isArray(this.selectedUsers)) {
				this.selectedUsers = [this.selectedUsers];
			}

			report = this.model || {};
			report.ttUsuario = report.ttUsuario || [];

			for (i = 0; i < this.selectedUsers.length; i++) {

				user = this.selectedUsers[i];
				toAdd = true;

				for (j = 0; j < report.ttUsuario.length; j++) {
					if (report.ttUsuario[j].num_id_usuar === user.num_id) {
						toAdd = false;
						break;
					}
				}

				if (toAdd) {
					users.push({
						num_id_usuar: user.num_id,
						num_id_relat_web: report.num_id
					});
				} else {
					if (usersAlreadyInList.length === 0) {
						usersAlreadyInList = user.nom_usuar;
					} else {
						usersAlreadyInList += ', ' + user.nom_usuar;
					}
				}
			}

			this.selectedUsers = undefined;

			if (usersAlreadyInList && usersAlreadyInList.length > 0) {

				if (usersAlreadyInList.indexOf(', ') >= 0) {
					messages = 'msg-report-user-in-list-plural';
				} else {
					messages = 'msg-report-user-in-list';
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'info',
					title: $rootScope.i18n('l-report', [], 'dts/crm'),
					detail: $rootScope.i18n(messages, [ usersAlreadyInList ], 'dts/crm')
				});
			}

			if (users && users.length > 0) {

				reportFactory.addUsers(report.num_id, users, function (result) {

					if (!result || result.length === 0) { return; }

					report.ttUsuario = report.ttUsuario || [];

					var i, names = '';

					for (i = 0; i < result.length; i++) {

						if (i === 0) {
							names = result[i].nom_usuar;
						} else {
							names += ', ' + result[i].nom_usuar;
						}

						report.ttUsuario.push(result[i]);
					}

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('l-report', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-save-related-generic', [
							$rootScope.i18n((result.length > 0 ? 'nav-report' : 'l-report'), [], 'dts/crm'),
							names, report.nom_relat
						], 'dts/crm')
					});
				});
			}
		};

		this.removeUser = function (reportUser) {

			var report = this.model;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-user', [], 'dts/crm').toLowerCase(), reportUser.nom_usuar
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					reportFactory.deleteUser(reportUser.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-user', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						var index = report.ttUsuario.indexOf(reportUser);

						if (index !== -1) {
							report.ttUsuario.splice(index, 1);
						}
					});
				}
			});
		};

		this.addEditParameter = function (reportParameter) {

			modalReportParameter.open({
				idReport: this.model.num_id,
				parameter: reportParameter
			}).then(function (result) {

				if (CRMUtil.isDefined(result)) {

					reportHelper.parseParameterType(result);

					if (CRMUtil.isDefined(reportParameter)) {

						var index = CRMControlReportDetail.model.ttParametro.indexOf(reportParameter);
						CRMControlReportDetail.model.ttParametro[index] = result;

					} else {
						CRMControlReportDetail.model.ttParametro.push(result);
					}
				}
			});
		};

		this.removeParameter = function (reportParameter) {

			var report = this.model;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-user', [], 'dts/crm').toLowerCase(), reportParameter.nom_param
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					reportFactory.deleteParameter(reportParameter.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-parameter', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						var index = report.ttParametro.indexOf(reportParameter);

						if (index !== -1) {
							report.ttParametro.splice(index, 1);
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

				var startView,
					viewName = $rootScope.i18n('nav-report', [], 'dts/crm'),
					viewController = 'crm.report.detail.control';

				startView = helper.startView(viewName, viewController, CRMControlReportDetail);

				if (startView.isNewTab) {
					if ($stateParams && $stateParams.id) {
						CRMControlReportDetail.load($stateParams.id);
					}
				} else if (CRMUtil.isUndefined(CRMControlReportDetail.model)
						   || CRMControlReportDetail.model.num_id !== $stateParams.id) {
					CRMControlReportDetail.load($stateParams.id);
				}
			});
		};

		if ($rootScope.currentuserLoaded) { this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlReportDetail = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlReportDetail.init();
		});
	};

	controllerReportDetail.$inject = [
		'$rootScope', '$scope', '$stateParams', 'TOTVSEvent', 'crm.crm_relat_web.factory', '$location',
		'crm.helper', 'crm.report.modal.edit', 'crm.report.helper', 'crm.report.modal.parameter'
	];


	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.report.detail.control', controllerReportDetail);
});
