/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/html/result/result-services.edit.js'
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
				templateUrl: '/dts/crm/html/campaign/action/result/result.edit.html',
				controller: 'crm.campaign-action-result.edit.control as controller',
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

	controller = function ($rootScope, $scope, $modalInstance, parameters, TOTVSEvent, helper,
							factory, modalResultEdit) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;

		this.resultList = undefined;

		this.action = undefined;
		this.results = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);

			if (model.num_id_restdo > 0) {
				model.ttResultado = {
					num_id: model.num_id_restdo,
					nom_restdo: model.nom_restdo
				};
			}
		};

		this.save = function (isToContinue) {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave(),
				message,
				fnAfterSave;

			if (!vo) { return; }

			fnAfterSave = function (item) {

				if (!item) { return; }

				if (CRMControl.editMode) {
					CRMControl.beforeClose(item, isToContinue, CRMControl.model.ttDetalhamento, message);
				} else {
					factory.getAllDetails(item.num_id_restdo, function (details) {
						CRMControl.beforeClose(item, isToContinue, details, message);
					});
				}
			};

			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateCampaignActionResult(CRMControl.action, vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.addCampaignActionResult(CRMControl.action, vo, fnAfterSave);
			}
		};

		this.close = function (item, isToContinue) {

			CRMControl.resultList = CRMControl.resultList || [];

			if (CRMUtil.isDefined(item)) {
				CRMControl.resultList.push(item);
			}

			if (isToContinue === true) {

				delete CRMControl.model.ttResultado;
				CRMControl.model.log_restdo_default = false;
				CRMControl.model.log_acumul_restdo = false;
				CRMControl.model.log_finaliza = false;
				CRMControl.validadeParameterModel();

			} else if ($modalInstance) {
				$modalInstance.close(CRMControl.resultList);
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model || {};

			if (!model.ttResultado || model.ttResultado.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-result');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-campaign-action-result', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {}, model = CRMControl.model || {};

			vo.num_id = model.num_id;
			vo.log_finaliza = model.log_finaliza;
			vo.log_acumul_restdo = model.log_acumul_restdo;
			vo.log_restdo_default = model.log_restdo_default;

			vo.num_id_campanha_acao = CRMControl.action;

			if (model.ttResultado) {
				vo.num_id_restdo = model.ttResultado.num_id;
			}

			return vo;
		};

		this.beforeClose = function (item, isToContinue, details, message) {

			item.ttDetalhamento = details || [];
			item.ttProximaAcao = CRMControl.model.ttProximaAcao || [];
			item.isOpen = CRMControl.model.isOpen;

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('l-campaign-action-result', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('l-result', [], 'dts/crm'),
					item.nom_restdo
				], 'dts/crm')
			});

			CRMControl.close(item, isToContinue);
		};

		this.getResults = function () {
			factory.getAllResults(undefined, undefined, function (result) {
				CRMControl.results = result || [];
			}, false);
		};

		this.addResult = function () {
			modalResultEdit.open(undefined).then(function (results) {

				results = results || [];

				var i, result;

				for (i = 0; i < results.length; i++) {

					result = results[i];

					if (CRMUtil.isUndefined(result)) { continue; }

					CRMControl.results.push(result);
				}

				CRMControl.model.ttResultado = result;
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.result ? angular.copy(parameters.result) : {};
		this.action  = parameters.action ? angular.copy(parameters.action) : undefined;

		this.getResults();

		this.validadeParameterModel();

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
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper',
		'crm.crm_campanha.factory', 'crm.result.modal.edit'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.campaign-action-result.modal.edit', modal);
	index.register.controller('crm.campaign-action-result.edit.control', controller);
});
