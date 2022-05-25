/*globals index, define, TOTVSEvent, CRMControl */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/html/campaign/price-table/price-table-services.edit.js',
	'/dts/crm/html/campaign/price-table/price-table-item/price-table-item-services.edit.js'
], function (index) {

	'use strict';

	var service;

	// *************************************************************************************
	// *** PRICE TABLE TAB SERVICE|CONTROLLER
	// *************************************************************************************

	service = function ($rootScope, factory, modalPriceTableEdit, modalPriceTableItemEdit) {

		this.addEditPriceTable = function ($event, priceTable, $index) {

			var CRMControl = this;

			if ($event) {
				$event.preventDefault();
				$event.stopPropagation();
			}

			modalPriceTableEdit.open({
				campaign: CRMControl.model.num_id,
				priceTable: priceTable
			}).then(function (result) {
				if (result) {
					if ($index >= 0) {
						result.isOpen = priceTable.isOpen;
						CRMControl.model.ttTabelaPreco[$index] = result;
					} else {
						CRMControl.model.ttTabelaPreco.push(result);
					}
				}
			});
		};

		this.removePriceTable = function ($event, priceTable, $index) {

			var CRMControl = this;

			if ($event) {
				$event.preventDefault();
				$event.stopPropagation();
			}

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-campaign-price-table', [], 'dts/crm').toLowerCase(), priceTable.nom_tab_preco
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteCampaignPriceTable(priceTable.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-campaign-price-table', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						CRMControl.model.ttTabelaPreco.splice($index, 1);
					});
				}
			});
		};

		this.addEditPriceTableItem = function ($event, priceTable, priceTableItem, $index) {

			var CRMControl = this;

			modalPriceTableItemEdit.open({
				priceTable: priceTable,
				priceTableItem: priceTableItem
			}).then(function (result) {

				if (!result) { return; }

				var i;

				for (i = 0; i <= CRMControl.model.ttTabelaPreco.length; i++) {
					if (CRMControl.model.ttTabelaPreco[i].num_id === priceTable.num_id) {
						if (CRMControl.model.ttTabelaPreco[i].ttTabelaPrecoItem) {
							if ($index >= 0) {
								CRMControl.model.ttTabelaPreco[i].ttTabelaPrecoItem[$index] = result;
							} else {
								CRMControl.model.ttTabelaPreco[i].ttTabelaPrecoItem.push(result);
							}
						}
						break;
					}
				}
			});
		};

		this.removePriceTableItem = function ($event, priceTable, priceTableItem, $index) {

			var CRMControl = this;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-campaign-price-table-item', [], 'dts/crm').toLowerCase(), priceTableItem.cod_item_erp
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteCampaignPriceTableItem(priceTableItem.num_id, function (result) {

						var i;

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('l-campaign-price-table-item', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						for (i = 0; i <= CRMControl.model.ttTabelaPreco.length; i++) {
							if (CRMControl.model.ttTabelaPreco[i].num_id === priceTable.num_id) {
								if (CRMControl.model.ttTabelaPreco[i].ttTabelaPrecoItem) {
									CRMControl.model.ttTabelaPreco[i].ttTabelaPrecoItem.splice($index, 1);
								}
								break;
							}
						}
					});
				}
			});
		};
	};

	service.$inject = [
		'$rootScope', 'crm.crm_campanha.factory', 'crm.campaign-price-table.modal.edit',
		'crm.campaign-price-table-item.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.service('crm.campaign-price-table.tab.service', service);

});
