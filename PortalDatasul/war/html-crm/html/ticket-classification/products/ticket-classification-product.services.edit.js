/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/zoom/crm_produt_suport.js',
	'/dts/crm/js/api/fchcrm1111.js',
	'/dts/crm/js/api/fchcrm1112.js'
], function (index) {

	'use strict';

	var modal,
		controller;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************
	modal = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/ticket-classification/products/ticket-classification-product.edit.html',
				controller: 'crm.ticket-classification-product.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};

	modal.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************
	controller = function ($rootScope, $scope, TOTVSEvent, $modalInstance, factory, factoryProducts, parameters, helper) {
		var CRMControl = this,
			model,
			listOfProducts;

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.save = function (saveAndNew) {
			var vo;

			if (CRMControl.isInvalidForm()) {
				return;
			}

			vo = CRMControl.convertToSave();

			factory.saveProduct(vo, function (result) {

				if (result) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'success',
						title: $rootScope.i18n('nav-product', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-save-generic', [
							$rootScope.i18n('l-product', [], 'dts/crm'),
							result.nom_produt
						], 'dts/crm')
					});

					if (!saveAndNew) {
						$modalInstance.close(result);
					} else {
						CRMControl.model.ttProdutoSuport = undefined;
					}
				}

			});
		};

		this.isInvalidForm = function () {
			var i,
				messages = [],
				isInvalidForm = false;

			if (!CRMControl.model || !CRMControl.model.ttProdutoSuport) {
				isInvalidForm = true;
				messages.push('l-product');
			}

			if (isInvalidForm) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type:   'error',
					title:  $rootScope.i18n('nav-product', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-form-validation', [$rootScope.i18n('l-product', [], 'dts/crm')], 'dts/crm')
				});
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {
			var vo;

			vo = {
				"num_id_classif_ocor": parameters.num_id_classif_ocor,
				"num_id_produt": CRMControl.model.ttProdutoSuport.num_id,
				"cod_item_erp": CRMControl.model.ttProdutoSuport.cod_item_erp,
				"nom_produt": CRMControl.model.ttProdutoSuport.nom_produt
			};

			return vo;
		};

		this.getProducts = function (search) {
			var filters = [];

			if (search) {
				filters.push({property: 'custom.quick_search', value: helper.parseStrictValue(search)});

				factoryProducts.findRecords(filters, {}, function (result) {
					CRMControl.listOfProducts = result;
				});
			}

		};

	};

	controller.$inject = ['$rootScope', '$scope', 'TOTVSEvent', '$modalInstance', 'crm.crm_classif_ocor.factory', 'crm.crm_produt_suport.factory', 'parameters', 'crm.helper'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.ticket-classification-product.modal.edit', modal);
	index.register.controller('crm.ticket-classification-product.edit.control', controller);

});