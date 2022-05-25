/*global $, index, define, angular, TOTVSEvent, CRMUtil*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1099.js',
	'/dts/crm/html/rpw-schedule/rpw-schedule-services.js'
], function (index) {

	'use strict';

	var controllerLoadData;

	// *************************************************************************************
	// *** Controller Parametros Situação Financeira
	// *************************************************************************************

	controllerLoadData = function ($scope, $filter, $rootScope, TOTVSEvent, helper, factoryLoadData, modalScheduler) {

		var CRMControlLoadData = this;

		this.crmSelectAll =  true;
		this.erpSelectAll = true;

		this.ProgramName = undefined; //O NOME DO PROGRAMA RPW UTILIZADO PARA AGENDA AUTOMANTICA

		this.model = {
			crm: [
				{ processo: 'l-font', valor: true},
				{ processo: 'l-civil-status', valor: true},
				{ processo: 'l-contry-uf-and-city', valor: true},
				{ processo: 'l-profession', valor: true},
				{ processo: 'l-decision-level', valor: true},
				{ processo: 'l-type-phone', valor: true},
				{ processo: 'l-rating', valor: true},
				{ processo: 'l-educational-level', valor: true},
				{ processo: 'l-activity-line', valor: true},
				{ processo: 'l-occupation', valor: true},
				{ processo: 'l-best-time', valor: true},
				{ processo: 'l-type-client', valor: true},
				{ processo: 'l-type-bond', valor: true},
				{ processo: 'l-segmentation', valor: true},
				{ processo: 'l-access-control', valor: true},
				{ processo: 'l-ticket-priority', valor: false}
			],
			erp: [
				{ processo: 'l-establishment', valor: true},
				{ processo: 'l-calendar', valor: true},
				{ processo: 'l-currency-quotation', valor: true},
				{ processo: 'l-cfop', valor: true},
				{ processo: 'l-region', valor: true},
				{ processo: 'l-bearer', valor: true},
				{ processo: 'l-payment-condition', valor: true},
				{ processo: 'l-seller', valor: true},
				{ processo: 'l-group-client', valor: true},
				{ processo: 'l-unit-of-measurement', valor: true},
				{ processo: 'l-carrier', valor: true},
				{ processo: 'l-product', valor: true},
				{ processo: 'l-price-table', valor: true},
				{ processo: 'l-account', valor: true},
				{ processo: 'l-customers-x-product', valor: true},
				{ processo: 'l-account-erp-gp-status', valor: true}
			]
		};

		this.load = function () {
		};

		this.init = function () {
			var viewName = $rootScope.i18n('nav-load-data', [], 'dts/crm'),
				viewController = 'crm.load-data.list.control';

			helper.startView(viewName, viewController, CRMControlLoadData);

			helper.loadCRMContext(function () {
				CRMControlLoadData.load();
			});
		};

		this.openModalScheduler = function (callback) {

			modalScheduler.open({
				programName: this.ProgramName,
				isVisibleSchedule: false
			}).then(function (result) {
				CRMControlLoadData.model.scheduler = result;
				if (callback) { callback(result); }
			});

		};

		this.executeSchedule = function () {

			if (CRMControlLoadData.isInvalidFormSchedule()) { return; }

			this.openModalScheduler(function (schedule) {
				CRMControlLoadData.model.schedule = schedule;
				CRMControlLoadData.confirmSaveSchedule();
			});

		};

		this.saveSchedule = function () {
			var model = CRMControlLoadData.model,
				schedule = CRMControlLoadData.model.schedule;

			factoryLoadData.createScheduler(model.erp, schedule, function (result) {

				if (result.$hasError === true) { return; }

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'information',
					title: $rootScope.i18n('nav-load-data', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-erp-load-data-start', [
						$rootScope.i18n('nav-load-data')
					], 'dts/crm')
				});
			});
		};

		this.executeLoadDataCRM = function () {
			factoryLoadData.executeLoadDataCRM(CRMControlLoadData.model.crm, function (result) {

				if (result.$hasError === true) { return; }

				if (result) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('nav-load-data', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-load-data-success', [
							$rootScope.i18n('nav-load-data')
						], 'dts/crm')
					});
				}
			});
		};

		this.onChangeCrmSelectAll = function (value) {
			var index = 0;

			for (index = 0; index < this.model.crm.length; index++) {
				this.model.crm[index].valor = !value; // negando o valor porque o modelo nao chega atualizado.
			}
		};

		this.onChangeERPSelectAll = function (value) {
			var index = 0;

			for (index = 0; index < this.model.erp.length; index++) {
				this.model.erp[index].valor = !value; // negando o valor porque o modelo nao chega atualizado.
			}
		};

		this.confirmExecuteLoadDataCRM = function (index) {
			if (!CRMControlLoadData.isInvalidFormCRM()) {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'nav-load-data',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n('msg-confirm-execute-load-data', [
						$rootScope.i18n('nav-load-data', [], 'dts/crm').toLowerCase()
					], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (!isPositiveResult) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'information',
							title: $rootScope.i18n('nav-load-data', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-load-data-start', [
								$rootScope.i18n('nav-load-data')
							], 'dts/crm')
						});

						CRMControlLoadData.executeLoadDataCRM();
					}
				});
			}
		};

		this.confirmSaveSchedule = function (index) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'nav-load-data',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-execute-load-data', [
					$rootScope.i18n('nav-load-data', [], 'dts/crm').toLowerCase()
				], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (!isPositiveResult) { return; }

					CRMControlLoadData.saveSchedule();
				}
			});
		};

		this.isInvalidFormSchedule = function () {

			var isInvalidForm = false, key, i = 0;

			if (isInvalidForm === false) {
				for (key in CRMControlLoadData.model.erp) {
					if (CRMControlLoadData.model.erp[key].valor === true) {
						i++;
					}
				}

				if (i === 0) {
					isInvalidForm = true;
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('nav-load-data', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-load-data-invalid-selected-items', 'dts/crm')
					});
				}
			}

			return isInvalidForm;
		};

		this.isInvalidFormCRM = function () {

			var isInvalidForm = false, key, i = 0;

			for (key in CRMControlLoadData.model.crm) {
				if (CRMControlLoadData.model.crm[key].valor === true) {
					i++;
				}
			}

			if (i === 0) {
				isInvalidForm = true;
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('nav-load-data', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-load-data-invalid-selected-items', 'dts/crm')
				});
			}


			return isInvalidForm;
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


		if ($rootScope.currentuserLoaded) {	this.init(); }

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlLoadData = undefined;
		});

		$scope.$on(TOTVSEvent.currentuserLoaded, function () {
			CRMControlLoadData.init();
		});

	};

	controllerLoadData.$inject = ['$scope', '$filter', '$rootScope', 'TOTVSEvent', 'crm.helper', 'crm.crm_loaddata.factory', 'crm.rpw-schedule.modal.edit'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.load-data.list.control', controllerLoadData);
});
