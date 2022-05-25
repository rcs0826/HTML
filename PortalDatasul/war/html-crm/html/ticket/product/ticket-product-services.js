/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, $scope*/
/*jslint plusplus: true*/

define([
	'index',
	'/dts/crm/js/api/fchcrm1006.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1045.js',
	'/dts/crm/html/ticket/product/ticket-product-services.edit.js',
	'/dts/dts-utils/js/lodash-angular.js'
], function (index) {

	'use strict';

	var controllerTicketProduct;

	controllerTicketProduct = function ($rootScope, $scope, ticketFactory, modalTicketProductEdit, TOTVSEvent, preferenceFactory, accessRestrictionFactory) {

		var CRMControlTicketProduct = this;

		this.listOfProducts = [];

		this.listOfProductCount = 0;

		this.isTicketOpen = true;

		this.productQuantity = undefined;

		this.ticket = {};

		this.isClosed = false;

		this.init = function (ticket) {
			accessRestrictionFactory.getUserRestrictions('ticket.product.tab', $rootScope.currentuser.login, function (result) {
				CRMControlTicketProduct.accessRestriction = result || {};
			});

			ticketFactory.getProducts(ticket.num_id, function (products) {
				CRMControlTicketProduct.listOfProducts = products;
				CRMControlTicketProduct.listOfProductCount = products.length;
				CRMControlTicketProduct.ticket = ticket;

				if (ticket.dat_fechto) {
					CRMControlTicketProduct.isClosed = true;
				}
			});

			preferenceFactory.getPreferenceAsInteger('QTD_PROD_OCOR', function (result) {
				CRMControlTicketProduct.productQuantity = result || 0;
			});
		};

		this.addEdit = function (product) {

			if (!product) {
				if (this.listOfProducts.length >= this.productQuantity) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'error',
						title: $rootScope.i18n('nav-ticket', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-max-product-quantity', [
							this.productQuantity
						], 'dts/crm')
					});

					return;
				}
			}

			modalTicketProductEdit.open({
				isAddTicket: false,
				num_id_ocor: CRMControlTicketProduct.ticket.num_id,
				product: angular.copy(product)
			}).then(function (result) {
				CRMControlTicketProduct.init(CRMControlTicketProduct.ticket);
			});
		};

		this.remove = function (product, index) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-product', [], 'dts/crm').toLowerCase(), product.dsl_produt
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					ticketFactory.removeProduct(product.num_id, function (result) {
						if (result.l_ok) {
							CRMControlTicketProduct.listOfProducts.splice(index, 1);
							CRMControlTicketProduct.listOfProductCount--;

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('l-product', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});
						}
					});
				}
			});
		};

		$scope.$on(CRMEvent.scopeLoadTicket, function (event, ticket) {
			CRMControlTicketProduct.init(ticket);
		});

	};

	controllerTicketProduct.$inject = [
		'$rootScope', '$scope', 'crm.crm_ocor.factory', 'crm.ticket.product.modal.edit', 'TOTVSEvent', 'crm.crm_param.factory', 'crm.crm_acess_portal.factory'
	];


	index.register.controller('crm.ticket.product.control', controllerTicketProduct);
});
