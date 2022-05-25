/*globals index, define, angular, TOTVSEvent, console, CRMUtil, CRMEvent */
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1111.js',
	'/dts/crm/html/ticket-classification/products/ticket-classification-product.services.edit.js',
	'/dts/crm/js/zoom/crm_recur.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - LIST
	// *************************************************************************************
	controller = function ($scope, $rootScope, factory, TOTVSEvent, helper, modalAddProduct) {

		var ttProdutos, options = [],
			listOfProductCount,
			i,
			CRMControl = this,
			quickSearchText = "";

		this.search = function (loadMore) {
			var properties, values = [];

			properties = [];
			values = [];

			if (!loadMore) {
				CRMControl.ttProdutos = [];
				CRMControl.listOfProductCount = 0;
			}

			options = {
				start: CRMControl.ttProdutos.length,
				end: 10
			};

			if (CRMControl.quickSearchText && CRMControl.quickSearchText.trim().length > 0) {
				properties.push('custom.quick_search');
				values.push(helper.parseStrictValue(CRMControl.quickSearchText));
			}

			properties.push('num_id_classif_ocor');
			values.push(CRMControl.id);

			factory.getAllProducts(properties, values, options, function (result) {
				if (result) {
					for (i = 0; i < result.length; i = i + 1) {
						if (result[i].$length) {
							CRMControl.listOfProductCount = result[i].$length;
						}

						CRMControl.ttProdutos.push(result[i]);
					}
				}
			});
		};

		this.removeProduct = function (product, index) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-product', [], 'dts/crm').toLowerCase(), product.nom_produt
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.removeProduct(product.num_id, function (result) {
						if (result && result.l_ok) {
							CRMControl.ttProdutos.splice(index, 1);
							CRMControl.listOfProductCount = CRMControl.listOfProductCount - 1;
						}

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-product', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});
					});
				}
			});
		};

		this.addProduct = function () {
			modalAddProduct.open({
				num_id_classif_ocor: CRMControl.id
			}).then(function (result) {
				CRMControl.search(false);
			});
		};

		this.convertToSaveProductResource = function (resource, productSupportId) {
			if (!resource || !resource.num_id_recur) { return; }

			var vo = {
				"num_id_classif_ocor_item": productSupportId,
				"num_id_recur": resource.num_id_recur
			};

			return vo;
		};

		this.addResource = function (product) {
			var i,
				resources,
				vo;

			if (CRMControl.selectedResources.objSelected) {
				vo = [];

				for (i = 0; i < CRMControl.selectedResources.objSelected.length; i++) {
					vo.push(this.convertToSaveProductResource(CRMControl.selectedResources.objSelected[i], product.num_id));
				}

			} else {
				vo = this.convertToSaveProductResource(CRMControl.selectedResources, product.num_id);
			}

			factory.addResource(vo, function (result) {
				if (result) {
					CRMControl.getProductResources(product);
				}
			});

			CRMControl.selectedResources = undefined;

		};

		this.removeProductSupportResource = function (id, resources, index) {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-resource', [], 'dts/crm').toLowerCase(), resources[index].nom_usuar
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.removeResource(id, function (result) {
						if (result.l_ok) {
							resources.splice(index, 1);

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('l-resource', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});
						}
					});

				}
			});

		};

		this.openResources = function (product) {
			product.isOpen = !product.isOpen ? true : false;

			if (product.isOpen == true) {
				CRMControl.getProductResources(product);
			}
		};

		this.getProductResources = function (product) {
			factory.getProductResources(product.num_id, function (result) {
				product.ttProdutSuporRecur = result;
			});

		};

		$scope.$on(CRMEvent.scopeLoadTicketClassification, function (event, model) {
			CRMControl.id = model.num_id;
			CRMControl.search(false);
		});
	};

	// *********************************************************************************
	// *** Listners
	// *********************************************************************************
	controller.$inject = [
		'$scope', '$rootScope', 'crm.crm_classif_ocor.factory', 'TOTVSEvent', 'crm.helper', 'crm.ticket-classification-product.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################
	index.register.controller('crm.ticket-classification-product.list.control', controller);

});
