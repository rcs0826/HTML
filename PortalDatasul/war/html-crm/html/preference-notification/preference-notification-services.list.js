/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1090.js'
], function (index) {

	'use strict';

	var controllerPreferenceNotificationList;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************
	controllerPreferenceNotificationList = function ($rootScope, $scope, TOTVSEvent, notificationFactory, preferenceFactory,
		helper, filterHelper, $location) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlPreferenceNotification = this;

		this.listOfNotify = [];
		this.listOfNotifyCount = 0;
		this.model = {};
		this.file = undefined;
		this.templateHTML = undefined;
		this.fileSelect = false;
		this.nom_URL = undefined;

		this.disclaimers		= [];
		this.fileSizeLimit = 0;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.getParamSizeLimit = function (callback) {
			preferenceFactory.getPreferenceAsDecimal('TAM_MAX_UPLOAD_ANEXO', function (result) {
				CRMControlPreferenceNotification.fileSizeLimit = result || 0;
				if (callback) { callback(); }
			});
		};

		this.load = function () {

			var i;

			CRMControlPreferenceNotification.listOfNotifyCount = 0;

			CRMControlPreferenceNotification.isOpen = true;

			CRMControlPreferenceNotification.getParamSizeLimit();

			notificationFactory.findRecords(function (result) {
				if (result) {
					CRMControlPreferenceNotification.model = result;
					CRMControlPreferenceNotification.nom_URL = CRMControlPreferenceNotification.download();
				} else {
					CRMControlPreferenceNotification.model.log_template = false;
				}
			});
		};

		this.onSelectFiles = function ($files) {
			var i, canUpload;

			for (i = 0; i < $files.length; i += 1) {

				canUpload = true;
				if (CRMControlPreferenceNotification.fileSizeLimit > 0) {
					canUpload = helper.validateUploadLimitFileSize('nav-preference-notification', $files[i].name, $files[i].size, CRMControlPreferenceNotification.fileSizeLimit);
				}

				if (canUpload) {
					CRMControlPreferenceNotification.file = $files[i];
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'info',
						title: $rootScope.i18n('nav-preference-notification', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-template-upload-success', [], 'dts/crm')
					});
					CRMControlPreferenceNotification.fileSelect = true;
				}
			}
		};


		this.isInvalidForm = function () {

			var isInvalidForm = false;

			if (CRMControlPreferenceNotification.model.log_tar_fut) {
				if (!CRMControlPreferenceNotification.model.num_dias_fut || CRMControlPreferenceNotification.model.num_dias_fut === 0) {
					isInvalidForm = true;
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('nav-preference-notification', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-invalid-num-days-fut', 'dts/crm')
					});
				}
			}

			if (!CRMControlPreferenceNotification.model.log_tar_fut && !CRMControlPreferenceNotification.model.log_tar_abert && !CRMControlPreferenceNotification.model.log_tar_atraso) {
				isInvalidForm = true;
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('nav-preference-notification', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-at-least-one-of-the options', 'dts/crm')
				});
			}


			return isInvalidForm;
		};



		this.save = function () {

			if (!CRMControlPreferenceNotification.isInvalidForm()) {

				notificationFactory.updateRecord(CRMControlPreferenceNotification.model, function (result) {
					if (result) {

						CRMControlPreferenceNotification.model = result;

						if (CRMControlPreferenceNotification.file) {
							CRMControlPreferenceNotification.model.log_livre_1 = true; /* Template customizado */

							notificationFactory.upload(CRMControlPreferenceNotification.file, function (result) {
								if (CRMUtil.isDefined(result[0])) {
									CRMControlPreferenceNotification.fileSelect = false;
									CRMControlPreferenceNotification.model = result[0];

									$rootScope.$broadcast(TOTVSEvent.showNotification, {
										type: 'success',
										title: $rootScope.i18n('nav-preference-notification', [], 'dts/crm'),
										detail: $rootScope.i18n('msg-save-template-success', [], 'dts/crm')
									});
								} else {
									CRMControlPreferenceNotification.model.log_livre_1 = false; /* Não salvou o template customizado */
								}
							});
						}

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-preference-notification', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-save-template-record', [], 'dts/crm')
						});
					}

				});
			}
		};

		this.download = function () {
			return notificationFactory.download();
		};

		this.removeTemplate = function () {
			CRMControlPreferenceNotification.file = undefined;
			CRMControlPreferenceNotification.fileSelect = false;

			if (CRMControlPreferenceNotification.model) {
				CRMControlPreferenceNotification.model.log_livre_1 = false;
				CRMControlPreferenceNotification.model.log_template = false;
			}
		};

		this.executeTaskCalendar = function () {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'btn-execute-progress-calendar',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-execute-calendar', ['crm00425'], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					notificationFactory.executeTaskCalendar(function (result) {
						if (result.l_ok) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'info',
								title: $rootScope.i18n('nav-preference-notification', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-success-creation-calendar', [], 'dts/crm')
							});
						}
					});
				}
			});
		};

		this.getHTMLTemplate = function () {
			notificationFactory.getHTMLTemplate(function (result) {
				if (result) {
					CRMControlPreferenceNotification.templateHTML = result.lc_dstemplate;
				}
			});
		};

		this.openProgressCreateCalendar = function () {
			this.openProgress("cdp/cd8600.w", "cd8600", []);
		};

		this.openProgress  = function (path, program, param) {
			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'info',
				title: $rootScope.i18n('nav-preference-notification', [], 'dts/crm'),
				detail: $rootScope.i18n('msg-open-di-flex', [], 'dts/crm')
			});
			$rootScope.openProgramProgress(path, program, param);
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-preference-notification', [], 'dts/crm'),
				viewController = 'crm.preferencenotification.list.control';

			helper.startView(viewName, viewController, CRMControlPreferenceNotification);

			helper.loadCRMContext(function () {
				CRMControlPreferenceNotification.load(false);
			});
		};

		if ($rootScope.currentuserLoaded) {	this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlPreferenceNotification = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlPreferenceNotification.init();
		});

	};

	controllerPreferenceNotificationList.$inject = [
		'$rootScope', '$scope', 'TOTVSEvent', 'crm.crm_tar_notif.factory',
		'crm.crm_param.factory', 'crm.helper', 'crm.filter.helper', '$location'
	];
	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.controller('crm.preferencenotification.list.control', controllerPreferenceNotificationList);
});
