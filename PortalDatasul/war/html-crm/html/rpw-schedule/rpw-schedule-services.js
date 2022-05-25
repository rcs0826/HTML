/*globals angular, index, define, TOTVSEvent, CRMURL, CRMEvent*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/bofn054.js',
	'/dts/crm/js/api/fchcrm1053.js',
	'/dts/crm/js/api/fchcrm1101.js'
], function (index) {
	'use strict';

	var modal, controller;

	// *************************************************************************************
	// *** CONTROLLER MODAL
	// *************************************************************************************

	modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/rpw-schedule/rpw-schedule.edit.html',
				controller: 'crm.rpw-schedule.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});

			return instance.result;
		};
	};

	modal.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER
	// *************************************************************************************

	controller = function (
		$rootScope,
		$scope,
		TOTVSEvent,
		helper,
		$modalInstance,
		parameters,
		$filter,
		rpwServerFactory,
		infoFactory,
		factoryRPWSchedule
	) {
		var CRMControl = this;

		this.model = {};
		this.isVisibleSchedule = true;
		this.canEditAutomaticCalendar = false;
		this.isDisableSchedule = false;
		this.hasScheduleCreated = false;
		this.serverList = [];

		this.cancel = function () {
			if ($modalInstance) {
				$modalInstance.dismiss('cancel');
			}
		};

		this.getRPWServers = function (value) {
			var options = {}, filters = [];

			options.limit = 50;

			if (value) {
				filters.push({property: 'cod_servid_exec', value: value});
			}

			rpwServerFactory.findRecords(filters, options, function (result) {
				if (result.length > 0) {
					result.forEach(item => {
						item.des_servid_exec = `${item.cod_servid_exec} - ${item.des_servid_exec}`
					});       
				}

				CRMControl.serverList = result || [];
			});
		};

		this.getRPWServersByCode = function (value) {
			var options = {}, filters = [];

			options.limit = 50;

			if (value) {
				filters.push({property: 'cod_servid_exec', value: value});
			}

			rpwServerFactory.findRecords(filters, options, function (result) {
				CRMControl.serverList = result || [];

				if (CRMControl.serverList.length === 1) {
					if (result.length > 0) {
						result.forEach(item => {
							item.des_servid_exec = `${item.cod_servid_exec} - ${item.des_servid_exec}`
						});       
					}

					CRMControl.model.RPWServer = CRMControl.serverList[0];
				}
			});
		};

		this.load = function () {
			infoFactory.getUserRPWServerName(function (result) {
				if (result) {
					CRMControl.getRPWServersByCode(result.cServerName);
				}

				CRMControl.getRPWServers();
			});

			factoryRPWSchedule.hasScheduleCreated(CRMControl.model.programName, function (result) {
				CRMControl.hasScheduleCreated = result || false;

				if (!CRMControl.hasScheduleCreated) {
					CRMControl.isDisableSchedule = true;

					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'warning',
						title:  $rootScope.i18n('l-configure-execution', [], 'dts/crm'),
						detail: $rootScope.i18n(
							'msg-invalid-automatic-schedule',
							[CRMControl.model.programName],
							'dts/crm'
						)
					});
				}
			});
		};

		this.formatDateToEvent = function (date, time) {
			if (!date) { return; }

			if (angular.isString(date) || angular.isNumber(date)) {
				date = new Date(date);
			}

			time = time.split(':');

			var start, end;

			if (time.length > 0) {
				start = time[0].trim();

				if (start.length < 2) {
					start = '0' + start;
				}
			}

			if (time.length > 1) {
				end = time[1].trim();

				if (end.length < 2) {
					end = '0' + end;
				}
			}

			return new Date(date.getFullYear(), date.getMonth(), date.getDate(), start, end);
		};

		this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				model = this.model,
				scheduleDate;

			if (!model.executeDate) {
				isInvalidForm = true;
				messages.push('l-date');
			}

			if (!model.initialHour) {
				isInvalidForm = true;
				messages.push('l-time');
			}

			if (!model.RPWServer) {
				isInvalidForm = true;
				messages.push('l-rpw-server');
			}

			scheduleDate = CRMControl.formatDateToEvent(model.executeDate, model.initialHour);

			if (scheduleDate < new Date()) {
				isInvalidForm = true;
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-configure-execution', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-invalid-date-scheduler', 'dts/crm')
				});

				return isInvalidForm;
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-configure-execution', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {
			var vo = {},
				model = CRMControl.model;

			vo.executeDate = model.executeDate;
			vo.initialHour = model.initialHour;
			vo.isAutomaticCalendar = model.isAutomaticCalendar;
			vo.RPWServer = model.RPWServer.cod_servid_exec;

			return vo;
		};

		this.save = function () {
			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (!vo) { return; }

			$modalInstance.close(vo);
		};

		this.validadeParameterModel = function () {
			var now = new Date(),
				startDate = now;

			startDate.setMinutes(now.getMinutes() + 10);

			this.model.executeDate = now;
			this.model.initialHour = $filter('date')(startDate, 'HH:mm');
			this.model.isAutomaticCalendar = false;
		};

		this.getCanEditAutomaticCalendar = function () {
			var programName = CRMControl.model.programName;

			factoryRPWSchedule.getCanEditAutomaticCalendar(programName, function (result) {
				CRMControl.canEditAutomaticCalendar = result || false;

				if (CRMControl.canEditAutomaticCalendar === false) {
					CRMControl.isDisableSchedule = false;

					$rootScope.$broadcast(TOTVSEvent.showQuestion, {
						title: 'nav-preference-notification',
						cancelLabel: 'btn-cancel',
						confirmLabel: 'btn-confirm',
						text: $rootScope.i18n('msg-validate-use-automatic-schedule', [programName], 'dts/crm'),
						callback: function (isPositiveResult) {
							if (!isPositiveResult) { return; }

							CRMControl.openProgressCreateCalendar();
						}
					});
				}

				CRMControl.model.isAutomaticCalendar = CRMControl.canEditAutomaticCalendar;
			});
		};

		this.onChangeAutomaticShedulle = function () {
			if (!CRMControl.model.isAutomaticCalendar) {
				CRMControl.getCanEditAutomaticCalendar();
			}
		};

		this.onChangeRPWServer = function () {
			CRMControl.model.isAutomaticCalendar = false;
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

		this.init = function () {
			this.load();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model.programName = parameters.programName || '';
		this.isVisibleSchedule = parameters.isVisibleSchedule 
			|| !(parameters.programName === '' 
			|| parameters.programName === undefined);

		this.validadeParameterModel();

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			$modalInstance.dismiss('cancel');
		});

	};

	controller.$inject = [
		'$rootScope',
		'$scope',
		'TOTVSEvent',
		'crm.helper',
		'$modalInstance',
		'parameters',
		'$filter',
		'crm.fn_servidor_rpw.factory',
		'crm.crm_info.factory',
		'crm.crm_backgroundruntimes.factory'
	];

	index.register.service('crm.rpw-schedule.modal.edit', modal);
	index.register.controller('crm.rpw-schedule.edit.control', controller);
});
