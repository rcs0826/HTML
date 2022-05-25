/*globals angular, index, define, TOTVSEvent, CRMUtil*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/html/ticket/ticket-services.list.js'
], function (index) {

	'use strict';

	var modalParametersEdit,
		controllerOpenTicketClosedModal;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
	modalParametersEdit = function ($modal) {
		this.open = function (params) {

			var template,
				instance;

			template = '/dts/crm/html/dashboard/open-ticket-closed-parameters.html';
			instance = $modal.open({
				templateUrl: template,
				controller: 'crm.dashboard.open-ticket-closed.controller.modal as controller',
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



	controllerOpenTicketClosedModal = function ($rootScope, $scope, $modalInstance, $filter, $location, $totvsprofile,
												 parameters, TOTVSEvent, helper, helperTicket, ticketFactory, userFactory,
											ticketRatingFactory, ticketFlowFactory, serviceTicketParam, modalParametersEdit) {
		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControllerConfig = this;
		this.config = {};

		this.listOfPeriod = [
			{ id: 1, name: $rootScope.i18n('l-day', [], 'dts/crm')},
			{ id: 2, name: $rootScope.i18n('l-week', [], 'dts/crm')},
			{ id: 3, name: $rootScope.i18n('l-month', [], 'dts/crm')},
			{ id: 4, name: $rootScope.i18n('l-trimester', [], 'dts/crm')},
			{ id: 5, name: $rootScope.i18n('l-semester', [], 'dts/crm')},
			{ id: 6, name: $rootScope.i18n('l-year', [], 'dts/crm')}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.parseSelectedToModel = function (list, model) {

			if (!list || !model) {
				return;
			}

			var i, x, listOfSelected = [];

			for (i = 0; i < model.length; i += 1) {
				for (x = 0; x < list.length; x += 1) {
					if (list[x].num_id === model[i].num_id) {
						listOfSelected.push(list[x]);
					}
				}
			}

			return listOfSelected;
		};

		this.getRatings = function () {
			ticketRatingFactory.getAll(function (result) {
				CRMControllerConfig.listOfRating = result;
				CRMControllerConfig.config.ttRating = CRMControllerConfig.parseSelectedToModel(CRMControllerConfig.listOfRating, CRMControllerConfig.config.ttRating);
			}, true);
		};

		this.getFlows = function () {
			ticketFlowFactory.getAll(function (result) {
				CRMControllerConfig.listOfFlow = result;
				CRMControllerConfig.config.ttFlow = CRMControllerConfig.parseSelectedToModel(CRMControllerConfig.listOfFlow, CRMControllerConfig.config.ttFlow);
			}, true);
		};

		this.getUsers = function () {
			userFactory.getOnlyResources(function (result) {
				CRMControllerConfig.listOfResponsible = result;
				CRMControllerConfig.config.ttResponsible = CRMControllerConfig.parseSelectedToModel(CRMControllerConfig.listOfResponsible, CRMControllerConfig.config.ttResponsible);
			}, true);
		};

		this.getTicketsType = function () {
			ticketFactory.getTypes(function (data) {
				if (data) {
					CRMControllerConfig.listOfType = data;
					CRMControllerConfig.config.ttType = CRMControllerConfig.parseSelectedToModel(CRMControllerConfig.listOfType, CRMControllerConfig.config.ttType);
				}
			});
		};

		this.getTicketsPriority = function () {
			ticketFactory.getPriorities(function (data) {
				if (data) {
					CRMControllerConfig.listOfPriority = data;
					CRMControllerConfig.config.ttPriority = CRMControllerConfig.parseSelectedToModel(CRMControllerConfig.listOfPriority, CRMControllerConfig.config.ttPriority);
				}
			});
		};

		this.getOrigins = function () {
			ticketFactory.getOrigins(function (data) {
				if (data) {
					CRMControllerConfig.listOfOrigin = data;
					CRMControllerConfig.config.ttOrigin = CRMControllerConfig.parseSelectedToModel(CRMControllerConfig.listOfOrigin, CRMControllerConfig.config.ttOrigin);
				}
			});
		};

		this.onChangePeriod = function (defaultDisplayType) {
			if (CRMUtil.isUndefined(CRMControllerConfig.config)) { return; }

			if (CRMUtil.isUndefined(CRMControllerConfig.config.ttPeriodType) || CRMUtil.isUndefined(CRMControllerConfig.config.ttPeriodType.id)) {
				return;
			}

			switch (CRMControllerConfig.config.ttPeriodType.id) {
			case 1:
				CRMControllerConfig.listOfDisplay = [
					{ id: 1, name: $rootScope.i18n('l-day', [], 'dts/crm')}
				];
				break;
			case 2:
				CRMControllerConfig.listOfDisplay = [
					{ id: 1, name: $rootScope.i18n('l-day', [], 'dts/crm')},
					{ id: 7, name: $rootScope.i18n('l-week', [], 'dts/crm')}
				];
				break;
			case 3:
				CRMControllerConfig.listOfDisplay = [
					{ id: 1, name: $rootScope.i18n('l-day', [], 'dts/crm')},
					{ id: 7, name: $rootScope.i18n('l-week', [], 'dts/crm')},
					{ id: 30, name: $rootScope.i18n('l-month', [], 'dts/crm')}
				];
				break;
			case 4:
				CRMControllerConfig.listOfDisplay = [
					{ id: 7, name: $rootScope.i18n('l-week', [], 'dts/crm')},
					{ id: 30, name: $rootScope.i18n('l-month', [], 'dts/crm')}
				];
				break;
			case 5:
				CRMControllerConfig.listOfDisplay = [
					{ id: 30, name: $rootScope.i18n('l-month', [], 'dts/crm')}
				];
				break;
			case 6:
				CRMControllerConfig.listOfDisplay = [
					{ id: 30, name: $rootScope.i18n('l-month', [], 'dts/crm')}
				];
				break;
			}

			if (defaultDisplayType === true) {
				CRMControllerConfig.config.ttDisplayType = CRMControllerConfig.listOfDisplay[0];
			}

		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.apply = function (doApply) {

			if (CRMControllerConfig.isInvalidForm() || !CRMControllerConfig.config) { return; }

			var closeObj = {};

			closeObj.apply = doApply;
			closeObj.customFilter = {};
			closeObj.customFilter = CRMControllerConfig.config;

			$modalInstance.close(closeObj);

		};

		this.isInvalidForm = function () {
			var messages = [],
				isInvalidForm = false,
				fields = '',
				message = '',
				isPlural,
				i;

			if (!CRMControllerConfig.config.ttPeriodType) {
				isInvalidForm = true;
				messages.push('l-opening-period');
			}

			if (!CRMControllerConfig.config.ttDisplayType) {
				isInvalidForm = true;
				messages.push('l-display-type-chart');
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

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************
		CRMControllerConfig.config = parameters.config;

		this.init = function () {
			CRMControllerConfig.onChangePeriod();
			CRMControllerConfig.getRatings();
			CRMControllerConfig.getOrigins();
			CRMControllerConfig.getTicketsPriority();
			CRMControllerConfig.getUsers();
			CRMControllerConfig.getTicketsType();
			CRMControllerConfig.getFlows();
		};

		CRMControllerConfig.init();

	};

	controllerOpenTicketClosedModal.$inject = ['$rootScope', '$scope', '$modalInstance', '$filter',
		'$location', '$totvsprofile', 'parameters', 'TOTVSEvent', 'crm.helper',
		'crm.ticket.helper', 'crm.crm_ocor.factory', 'crm.crm_usuar.factory', 'crm.crm_classif_ocor.factory',
		'crm.crm_ocor_fluxo.factory', 'crm.ticket.param-service', 'crm.dashboard.open-ticket-closed.modal.parameter'
		];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.dashboard.open-ticket-closed.modal.parameter', modalParametersEdit);
	index.register.controller('crm.dashboard.open-ticket-closed.controller.modal', controllerOpenTicketClosedModal);
});
