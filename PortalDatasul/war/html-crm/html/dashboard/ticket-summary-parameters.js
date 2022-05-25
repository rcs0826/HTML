/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint continue: true*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1036.js'
], function (index) {

	'use strict';

	var modalParametersEdit,
		controllerTicketSummaryModal;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
	modalParametersEdit = function ($modal) {
		this.open = function (params) {

			var template,
				instance;

			template = '/dts/crm/html/dashboard/ticket-summary-parameters.html';
			instance = $modal.open({
				templateUrl: template,
				controller: 'crm.dashboard.ticket-summary.controller.modal as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});

			return instance.result;
		};
	};

	modalParametersEdit.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER MODAL
	// *************************************************************************************



	controllerTicketSummaryModal = function ($rootScope, $scope, $modalInstance, $filter, $location, $totvsprofile,
											parameters, TOTVSEvent, helper, ticketFactory, ticketFlowFactory) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControllerConfig = this;

		this.model = {};
		this.disclaimers = [];
		this.ttPeriodType = undefined;
		this.ttStatus = [];
		this.ttRecurso = [];
		this.ttPrioridade = [];
		this.ttOrigem = [];
		this.ttFluxo = [];
		this.status = [];
		this.priorities = [];
		this.origins = [];
		this.flows = [];
		this.resources = [];
		this.idi_agrupador = 1;

		this.periods = [
			{ value: 1, label: ($rootScope.i18n('l-day', [], 'dts/crm') + ' (' + $rootScope.i18n('l-today', [], 'dts/crm') + ')')},
			{ value: 2, label: ($rootScope.i18n('l-week', [], 'dts/crm') + ' (' + $rootScope.i18n('l-last-x-days', ['7'], 'dts/crm') + ')')},
			{ value: 3, label: ($rootScope.i18n('l-month', [], 'dts/crm') + ' (' + $rootScope.i18n('l-last-x-days', ['30'], 'dts/crm') + ')')},
			{ value: 4, label: ($rootScope.i18n('l-trimester', [], 'dts/crm') + ' (' + $rootScope.i18n('l-last-x-days', ['90'], 'dts/crm') + ')')},
			{ value: 5, label: ($rootScope.i18n('l-semester', [], 'dts/crm') + ' (' + $rootScope.i18n('l-last-x-days', ['180'], 'dts/crm') + ')')},
			{ value: 6, label: ($rootScope.i18n('l-year', [], 'dts/crm') + ' (' + $rootScope.i18n('l-last-x-days', ['365'], 'dts/crm') + ')')}
		];

		this.groups = [
			{ value: 1, label: $rootScope.i18n('l-status', [], 'dts/crm')},
			{ value: 2, label: $rootScope.i18n('l-resource', [], 'dts/crm')},
			{ value: 3, label: $rootScope.i18n('l-priority', [], 'dts/crm')},
			{ value: 4, label: $rootScope.i18n('l-origin', [], 'dts/crm')},
			{ value: 5, label: $rootScope.i18n('l-flow', [], 'dts/crm')}
		];

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.apply = function () {
			var closeObj = {}, value;

			if (CRMControllerConfig.isInvalidForm()) {
				return;
			}

			if (CRMControllerConfig.ttPeriodType) {
				CRMControllerConfig.disclaimers.push({
					property: 'period_type',
					value: CRMControllerConfig.ttPeriodType.value
				});
			}

			if (CRMControllerConfig.ttStatus && CRMControllerConfig.ttStatus.value) {
				CRMControllerConfig.disclaimers.push({
					property: 'status',
					value: CRMControllerConfig.ttStatus.value
				});
			}

			if (CRMControllerConfig.ttStatus && angular.isArray(CRMControllerConfig.ttStatus)) {
				value = helper.parseListToValues(CRMControllerConfig.ttStatus);

				if (value) {
					CRMControllerConfig.disclaimers.push({
						property: 'crm_status_ocor.num_id_status_ocor',
						value: value
					});
				}
			}

			if (CRMControllerConfig.ttRecurso && angular.isArray(CRMControllerConfig.ttRecurso)) {
				value = helper.parseListToValues(CRMControllerConfig.ttRecurso);

				if (value) {
					CRMControllerConfig.disclaimers.push({
						property: 'num_id_recur',
						value: value
					});
				}
			}

			if (CRMControllerConfig.ttPrioridade && angular.isArray(CRMControllerConfig.ttPrioridade)) {
				value = helper.parseListToValues(CRMControllerConfig.ttPrioridade);

				if (value) {
					CRMControllerConfig.disclaimers.push({
						property: 'num_id_priorid_ocor',
						value: value
					});
				}
			}

			if (CRMControllerConfig.ttOrigem && angular.isArray(CRMControllerConfig.ttOrigem)) {
				value = helper.parseListToValues(CRMControllerConfig.ttOrigem);

				if (value) {
					CRMControllerConfig.disclaimers.push({
						property: 'num_id_orig',
						value: value
					});
				}
			}

			if (CRMControllerConfig.ttFluxo && angular.isArray(CRMControllerConfig.ttFluxo)) {
				value = helper.parseListToValues(CRMControllerConfig.ttFluxo);

				if (value) {
					CRMControllerConfig.disclaimers.push({
						property: 'num_id_ocor_fluxo',
						value: value
					});
				}
			}


			if (CRMControllerConfig.model && CRMControllerConfig.model.idi_agrupador) {
				CRMControllerConfig.disclaimers.push({
					property: 'custom.idi_agrupador',
					value: CRMControllerConfig.model.idi_agrupador
				});
			}

			closeObj.disclaimers = {};
			closeObj.disclaimers = CRMControllerConfig.disclaimers;
			$modalInstance.close(closeObj);

		};

		this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				fields = '',
				message = '',
				isPlural,
				i;

			if (!CRMControllerConfig.ttPeriodType) {
				isInvalidForm = true;
				messages.push('l-opening-period');
			}

			if (!CRMControllerConfig.model.idi_agrupador) {
				isInvalidForm = true;
				messages.push('l-view-by');
			}

			if (isInvalidForm) {

				isPlural = messages.length > 1;

				message	 = 'msg-form-validation' + (isPlural ? '-plural' : '');

				for (i = 0; i < messages.length; i += 1) {
					fields += $rootScope.i18n(messages[i], [], 'dts/crm');
					if (isPlural && i !== (messages.length - 1)) {
						fields += ', ';
					}
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('l-sales-funnel', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [fields], 'dts/crm')
				});
			}


			return isInvalidForm;
		};

		this.parseDisclaimersToModel = function (disclaimers) {
			var i;

			disclaimers = disclaimers || parameters.disclaimers;

			if (disclaimers) {
				for (i = 0; i < disclaimers.length; i++) {
					if (disclaimers[i].property === 'period_type') {
						CRMControllerConfig.ttPeriodType = CRMControllerConfig.periods[disclaimers[i].value - 1];
					} else if (disclaimers[i].property === 'crm_status_ocor.num_id_status_ocor') {
						CRMControllerConfig.ttStatus = helper.parseValuesToList(disclaimers[i].value, CRMControllerConfig.status);
					} else if (disclaimers[i].property === 'num_id_recur') {
						CRMControllerConfig.ttRecurso = helper.parseValuesToList(disclaimers[i].value, CRMControllerConfig.resources);
					} else if (disclaimers[i].property === 'num_id_priorid_ocor') {
						CRMControllerConfig.ttPrioridade = helper.parseValuesToList(disclaimers[i].value, CRMControllerConfig.priorities);
					} else if (disclaimers[i].property === 'num_id_orig') {
						CRMControllerConfig.ttOrigem = helper.parseValuesToList(disclaimers[i].value, CRMControllerConfig.origins);
					} else if (disclaimers[i].property === 'num_id_ocor_fluxo') {
						CRMControllerConfig.ttFluxo = helper.parseValuesToList(disclaimers[i].value, CRMControllerConfig.flows);
					} else if (disclaimers[i].property === 'custom.idi_agrupador') {
						CRMControllerConfig.model.idi_agrupador = disclaimers[i].value;
					}
				}
			}

			if (CRMUtil.isUndefined(CRMControllerConfig.model.idi_agrupador) || CRMControllerConfig.model.idi_agrupador === undefined) {
				CRMControllerConfig.model.idi_agrupador = 1;
			}

			if (!CRMControllerConfig.ttPeriodType) {
				CRMControllerConfig.ttPeriodType = CRMControllerConfig.periods[2]; //month
			}
		};

		this.loadData = function (callback) {
			var i,
				count = 0,
				total = 5;

			ticketFactory.getStatus(function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControllerConfig.status.push({
							value: result[i].num_id,
							label: result[i].nom_status_ocor
						});
					}
				}
				if (++count === total && callback) { callback(); }
			});

			ticketFactory.getResources(function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControllerConfig.resources.push({
							value: result[i].num_id,
							label: result[i].nom_usuar
						});
					}
				}
				if (++count === total && callback) { callback(); }
			});

			ticketFactory.getPriorities(function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControllerConfig.priorities.push({
							value: result[i].num_id,
							label: result[i].nom_priorid_ocor
						});
					}
				}
				if (++count === total && callback) { callback(); }
			});

			ticketFactory.getOrigins(function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControllerConfig.origins.push({
							value: result[i].num_id,
							label: result[i].nom_orig_ocor
						});
					}
				}
				if (++count === total && callback) { callback(); }
			});

			ticketFlowFactory.getAll(function (result) {
				if (result) {
					for (i = 0; i < result.length; i++) {
						CRMControllerConfig.flows.push({
							value: result[i].num_id,
							label: result[i].nom_ocor_fluxo
						});
					}
				}
				if (++count === total && callback) { callback(); }
			});

		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.init = function () {
			CRMControllerConfig.loadData(function () {
				CRMControllerConfig.parseDisclaimersToModel();
			});
		};

		CRMControllerConfig.init();

	};

	controllerTicketSummaryModal.$inject = ['$rootScope', '$scope', '$modalInstance', '$filter',
		'$location', '$totvsprofile', 'parameters', 'TOTVSEvent', 'crm.helper', 'crm.crm_ocor.factory', 'crm.crm_ocor_fluxo.factory'
		];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.dashboard.ticket-summary.modal.parameter', modalParametersEdit);
	index.register.controller('crm.dashboard.ticket-summary.controller.modal', controllerTicketSummaryModal);
});
