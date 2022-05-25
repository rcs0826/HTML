/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1020.js',
	'/dts/crm/js/zoom/crm_produt.js'
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
				templateUrl: '/dts/crm/html/campaign/price-table/price-table-item/price-table-item.edit.html',
				controller: 'crm.campaign-price-table-item.edit.control as controller',
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
							helper, factory, factoryProduct) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;

		this.priceTable = undefined;
		this.products = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);

			if (this.editMode) {
				model.log_tip_desc = !model.log_tip_desc;
			} else {
				model.log_tip_desc = false;
			}

			if (model.num_id_tab_preco_item > 0) {
				model.ttProduto = {
					num_id: model.num_id_tab_preco_item,
					nom_produt: model.nom_produt,
					cod_item_erp: model.cod_item_erp
				};
			}
		};

		this.save = function () {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (!vo) { return; }

			if (CRMControl.editMode === true) {
				factory.updateCampaignPriceTableItem(CRMControl.priceTable.num_id, vo.num_id, vo, CRMControl.afterSave);
			} else {
				factory.addCampaignPriceTableItem(CRMControl.priceTable.num_id, vo, CRMControl.afterSave);
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

			if (!model.ttProduto || model.ttProduto.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-product');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-produt', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model || {};

			vo.num_id = model.num_id;

			vo.log_tip_desc = !model.log_tip_desc;
			vo.val_perc_desc_campanha = model.val_perc_desc_campanha;

			vo.num_id_campanha_tab_preco = CRMControl.priceTable.num_id;

			if (model.ttProduto) {
				vo.num_id_tab_preco_item = model.ttProduto.num_id;
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
					$rootScope.i18n('l-produt', [], 'dts/crm'),
					item.nom_produt
				], 'dts/crm')
			});

			$modalInstance.close(item);
		};

		this.getProducts = function (value) {

			if (!value || value === '') { return []; }

			var filter = [{
				property: 'nom_produt',
				value: helper.parseStrictValue(value)
			}, {
				property: 'crm_tab_preco_item.num_id_tab_preco',
				value: CRMControl.priceTable.num_id_tab_preco
			}];

			factoryProduct.typeahead(filter, undefined, function (result) {
				CRMControl.products = result;
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.priceTableItem ? angular.copy(parameters.priceTableItem) : {};
		this.priceTable  = parameters.priceTable ? angular.copy(parameters.priceTable) : {};

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
		'crm.crm_campanha.factory', 'crm.crm_produt.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.campaign-price-table-item.modal.edit', modal);
	index.register.controller('crm.campaign-price-table-item.edit.control', controller);
});
