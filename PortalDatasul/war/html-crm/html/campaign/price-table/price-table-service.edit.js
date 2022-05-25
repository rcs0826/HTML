/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1020.js',
	'/dts/crm/js/zoom/crm_tab_preco.js'
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
				templateUrl: '/dts/crm/html/campaign/price-table/price-table.edit.html',
				controller: 'crm.campaign-price-table.edit.control as controller',
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

	controller = function ($rootScope, $scope, $modalInstance, parameters, TOTVSEvent,
							helper, factory, factoryPriceTable) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;

		this.campaign = undefined;
		this.priceTables = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);

			if (model.num_id_tab_preco > 0) {
				model.ttTabelaPreco = {
					num_id: model.num_id_tab_preco,
					nom_tab_preco: model.nom_tab_preco
				};
			}
		};

		this.save = function () {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (!vo) { return; }

			if (CRMControl.editMode === true) {
				factory.updateCampaignPriceTable(CRMControl.campaign, vo.num_id, vo, CRMControl.afterSave);
			} else {
				factory.addCampaignPriceTable(CRMControl.campaign, vo, CRMControl.afterSave);
			}
		};

		this.cancel = function (item) {

			if ($modalInstance) {
				if (item) {
					$modalInstance.close(item);
				} else {
					$modalInstance.dismiss('cancel');
				}
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				isValidTimeRange,
				model = CRMControl.model || {};

			if (!model.ttTabelaPreco || model.ttTabelaPreco.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-campaign-price-table');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-price-table', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model || {};

			vo.num_id = model.num_id;
			vo.num_id_campanha = CRMControl.campaign;

			vo.val_perc_desc_campanha = model.val_perc_desc_campanha;

			if (model.ttTabelaPreco) {
				vo.num_id_tab_preco = model.ttTabelaPreco.num_id;
			}

			return vo;
		};

		this.afterSave = function (item) {

			if (!item) { return; }

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('l-campaign-price-table', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('l-price-table', [], 'dts/crm'),
					item.nom_tab_preco
				], 'dts/crm')
			});

			item.nom_tab_preco = CRMControl.model.ttTabelaPreco.nom_tab_preco;

			$modalInstance.close(item);
		};

		this.getPriceTables = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_tab_preco', value: helper.parseStrictValue(value) };
			factoryPriceTable.typeahead(filter, undefined, function (result) {
				CRMControl.priceTables = result;
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.priceTable ? angular.copy(parameters.priceTable) : {};
		this.campaign  = parameters.campaign ? angular.copy(parameters.campaign) : undefined;

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
		'crm.crm_campanha.factory', 'crm.crm_tab_preco.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.campaign-price-table.modal.edit', modal);
	index.register.controller('crm.campaign-price-table.edit.control', controller);
});
