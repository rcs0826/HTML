/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1069.js',
	'/dts/crm/html/campaign-type/campaign-type-services.edit.js'
], function (index) {

	'use strict';

	var modal,
		controller;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/campaign/campaign.edit.html',
				controller: 'crm.campaign.edit.control as controller',
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
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controller = function ($rootScope, $scope, $location, $modalInstance, parameters, TOTVSEvent,
							helper, campaignFactory, campaignTypeFactory, modalCampaignTypeEdit, preferenceFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;

		this.types = undefined;
		this.isIntegratedWithGpls = false;
		this.isDefaultGPLS = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);

			if (this.editMode && model.dat_inic && model.dat_term) {
				model.initialDate = {
					startDate	: model.dat_inic,
					endDate		: model.dat_term
				};

				this.isDefaultGPLS = model.log_padr_gpls;

			} else {
				model.initialDate = {
					startDate	: new Date().getTime(),
					endDate   : new Date().getTime()
				};
			}
		};

		this.save = function () {

			if (CRMControl.isInvalidForm()) { return; }

			var persist,
				vo = CRMControl.convertToSave();

			if (!vo) { return; }

			persist = function () {
				if (CRMControl.editMode === true) {
					campaignFactory.updateRecord(vo.num_id, vo, CRMControl.afterSave);
				} else {
					campaignFactory.saveRecord(vo, CRMControl.afterSave);
				}
			};

			if (this.isDefaultGPLS === false && vo.log_padr_gpls === true) {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: $rootScope.i18n('l-confirm-save', [], 'dts/crm'),
					cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
					confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
					text: $rootScope.i18n('msg-confirm-set-default-gpls', [], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (isPositiveResult) {
							persist();
						} else {
							return;
						}
					}
				});
			} else {
				persist();
			}


		};

		this.cancel = function (campaign) {

			if ($modalInstance) {
				if (campaign) {
					$modalInstance.close(campaign);
				} else {
					$modalInstance.dismiss('cancel');
				}
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				isValidTimeRange,
				model = CRMControl.model;

			if (model.initialDate && !model.initialDate.startDate) {
				isInvalidForm = true;
				messages.push('l-date-start');
			}

			if (!model.nom_campanha || model.nom_campanha.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (!model.ttTipoCampanha || model.ttTipoCampanha.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-type-campaign');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-campaign', messages);
			}

			if (!isInvalidForm) {

				isValidTimeRange = helper.validateTimeRange(
					CRMControl.model.initialDate,
					undefined,
					new Date()
				);

				if (isValidTimeRange > -1) {

					if (isValidTimeRange === 1) {
						messages = 'msg-period-start-after-end';
						isInvalidForm = true;
					} else if (isValidTimeRange === 2) {
						messages = 'msg-period-end-before-start';
						isInvalidForm = true;
					}

					if (isInvalidForm) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type:   'error',
							title:  $rootScope.i18n('l-campaign', [], 'dts/crm'),
							detail: $rootScope.i18n(messages, [], 'dts/crm')
						});
					}
				}
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;

			vo.dat_inic = model.initialDate.startDate;
			vo.dat_term = model.initialDate.endDate;

			vo.nom_campanha = model.nom_campanha;
			vo.log_finaliza = model.log_finaliza;
			vo.log_livre_1  = model.log_livre_1; //permite despesas avulsas
			vo.log_padr_gpls = model.log_padr_gpls || false;

			vo.dsl_campanha = model.dsl_campanha;
			vo.dsl_motivo = model.dsl_motivo;

			if (model.ttTipoCampanha) {
				vo.num_id_tip_campanha = model.ttTipoCampanha.num_id;
			}

			return vo;
		};

		this.afterSave = function (campaign) {

			if (!campaign) { return; }

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('l-campaign', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('l-campaign', [], 'dts/crm'),
					campaign.nom_campanha
				], 'dts/crm')
			});

			CRMControl.model.num_id   = campaign.num_id;
			CRMControl.model.dat_inic = campaign.dat_inic;
			CRMControl.model.dat_term = campaign.dat_term;
			CRMControl.model.log_padr_gpls = campaign.log_padr_gpls;

			$modalInstance.close(CRMControl.model);

			if (CRMControl.editMode === false) {
				$location.path('/dts/crm/campaign/detail/' + campaign.num_id);
			}
		};

		this.getCampaignsTypes = function () {

			campaignTypeFactory.getAll(function (result) {

				CRMControl.types = result || [];

				var i,
					type,
					model = CRMControl.model;

				for (i = 0; i < CRMControl.types.length; i++) {

					type = CRMControl.types[i];

					if (type.num_id === model.num_id_tip_campanha) {
						model.ttTipoCampanha = type;
						break;
					}
				}
			});
		};

		this.addTypeCampaign = function () {
			modalCampaignTypeEdit.open(
				undefined
			).then(function (results) {
				results = results || [];

				var i, result;

				for (i = 0; i < results.length; i++) {

					result = results[i];

					if (CRMUtil.isUndefined(result)) { continue; }

					CRMControl.types.push(result);
				}

				CRMControl.model.ttTipoCampanha = result;
			});
		};

		this.loadPreferences = function () {
			preferenceFactory.isIntegratedWithGP(function (result) {
				CRMControl.isIntegratedWithGpls = result;
			});
		};

		this.init = function init() {
			CRMControl.validadeParameterModel();
			CRMControl.loadPreferences();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.campaign ? angular.copy(parameters.campaign) : {};

		this.getCampaignsTypes();

		CRMControl.init();

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
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper',
		'crm.crm_campanha.factory', 'crm.crm_tip_campanha.factory', 'crm.campaign-type.modal.edit', 'crm.crm_param.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.campaign.modal.edit', modal);
	index.register.controller('crm.campaign.edit.control', controller);
});
