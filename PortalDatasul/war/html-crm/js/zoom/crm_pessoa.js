/*global $, index, angular, define, CRMEvent*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1003.js'
], function (index) {

	'use strict';

	var serviceAccountZoom,
		serviceContactZoom,
		serviceContactEditZoom,
		serviceAccountResaleZoom,
		serviceAccountCompetitorZoom,
		serviceAllTypeAccountZoom;

	// ########################################################
	// ### ACCOUNT
	// ########################################################
	serviceAccountZoom = function ($rootScope, $injector, $filter,
									accountFactory, accountHelper, serviceLegend, helper) {

		return {

			zoomName : $rootScope.i18n('nav-account', [], 'dts/crm'),

			propertyFields : [
				{ label: $rootScope.i18n('l-cnpj', [], 'dts/crm'),          property: 'nom_cnpj' },
				{ label: $rootScope.i18n('l-cpf', [], 'dts/crm'),           property: 'nom_cpf' },
				{ label: $rootScope.i18n('l-informal-name', [], 'dts/crm'), property: 'nom_infml' },
				{ label: $rootScope.i18n('l-rg', [], 'dts/crm'),            property: 'nom_reg_geral' },
				{ label: $rootScope.i18n('l-mother-name', [], 'dts/crm'),   property: 'nom_mae_pessoa_fisic' },
				{ label: $rootScope.i18n('l-code-erp', [], 'dts/crm'),      property: 'cod_pessoa_erp' },
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),          property: 'nom_razao_social', 'default': true },
				{ label: $rootScope.i18n('l-short-name', [], 'dts/crm'),    property: 'nom_abrev'},
				{ label: $rootScope.i18n('l-type-account', [], 'dts/crm'),  property: 'idi_tip_cta', propertyList: [
					{ id: 1, name: serviceLegend.accountType.NAME(1) },
					{ id: 2, name: serviceLegend.accountType.NAME(2) },
					{ id: 4, name: serviceLegend.accountType.NAME(4) },
					{ id: 5, name: serviceLegend.accountType.NAME(5) },
					{ id: 6, name: serviceLegend.accountType.NAME(6) },
					{ id: 7, name: serviceLegend.accountType.NAME(7) },
					{ id: 8, name: serviceLegend.accountType.NAME(8) }
				]},
				{ label: $rootScope.i18n('l-phone', [], 'dts/crm'),    property: 'custom.nom_telef'}
			],

			columnDefs : [
				{
					headerName: $rootScope.i18n('l-code-erp', [], 'dts/crm'),
					width: 90,
					field: 'cod_pessoa_erp'
				}, {
					headerName: $rootScope.i18n('l-name', [], 'dts/crm'),
					field: 'nom_razao_social',
					cellRenderer: function (params) {

						var customHTML = '',
							account = params.data;

						if (account) {

							if (account.log_acesso !== true) {
								customHTML = '<span class="glyphicon glyphicon-lock"></span>';
							}

							if (account.log_matriz === true) {
								customHTML = '<span class="glyphicon glyphicon-globe"></span>';
							}
						}

						return customHTML + ' ' + params.value;
					}
				}, {
					headerName: $rootScope.i18n('l-type-account', [], 'dts/crm'),
					width: 200,
					field: 'nom_tip_cta'
				}
			],

			applyFilter : function (parameters) {

				var CRMControlAccountZoom = this,
					property,
					value,
					entity,
					type,
					options,
					filters = [],
					i;

				if (parameters && parameters.init) {
					entity = parameters.init.entity || 1;
					type = parameters.init.type || 1;
				}

				options = {
					start: (parameters.more ? this.zoomResultList.length : 0),
					entity: entity || 1, // 0. ALL 1. CONTA 2. CONTATO
					type: type || 1
				};

				property = parameters.selectedFilter.property;
				value = parameters.selectedFilterValue;

				if (property === "idi_tip_cta") {
					filters.push({ property: property, value: value.id });
				} else {
					filters.push({ property: property, value: helper.parseStrictValue(value)});
				}

				if (this.applyCompetitorFilter) {
					filters.push({property: 'log_concorrente', value: true});
				}

				if (this.applyResaleFilter) {
					filters.push({property: 'log_reven', value: true});
				}

				if (parameters.init && parameters.init.num_id_usuar_respons) {
					filters.push({property: 'num_id_usuar_respons', value: parameters.init.num_id_usuar_respons});
				}

				accountFactory.zoom(filters, options, function (result) {

					var el = $('.modal-body-zoom').prev().find('.modal-title span');
					el.html('&nbsp;(0)');

					CRMControlAccountZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlAccountZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {

						if (result[i].$length) {
							CRMControlAccountZoom.resultTotal = result[i].$length;
							el.html('&nbsp;(' + $filter('countPerPage')(result[i].$length, 25, result.length) + ')');
						}

						accountHelper.parseSex(result[i]);
						accountHelper.parsePersonType(result[i]);
						accountHelper.parseAccountType(result[i]);
						CRMControlAccountZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	};

	serviceAccountZoom.$inject = [
		'$rootScope', '$injector', '$filter', 'crm.crm_pessoa.conta.factory', 'crm.account.helper', 'crm.legend', 'crm.helper'
	];

	// ########################################################
	// ### CONTACT
	// ########################################################
	serviceContactZoom = function ($rootScope, $injector, $filter, contactFactory,
									accountHelper, serviceLegend, helper) {

		return {

			zoomName : $rootScope.i18n('l-contact', [], 'dts/crm'),

			propertyFields : [
				{ label: $rootScope.i18n('l-cnpj', [], 'dts/crm'),          property: 'nom_cnpj' },
				{ label: $rootScope.i18n('l-cpf', [], 'dts/crm'),           property: 'nom_cpf' },
				{ label: $rootScope.i18n('l-informal-name', [], 'dts/crm'), property: 'nom_infml' },
				{ label: $rootScope.i18n('l-name', [], 'dts/crm'),          property: 'nom_razao_social', 'default': true },
				{ label: $rootScope.i18n('l-short-name', [], 'dts/crm'),    property: 'nom_abrev' },
				{ label: $rootScope.i18n('l-code-erp', [], 'dts/crm'),      property: 'cod_pessoa_erp' },
				{ label: $rootScope.i18n('l-type-account', [], 'dts/crm'),  property: 'idi_tip_cta', propertyList: [
					{ id: 3, name: serviceLegend.accountType.NAME(3) },
					{ id: 6, name: serviceLegend.accountType.NAME(6) },
					{ id: 7, name: serviceLegend.accountType.NAME(7) },
					{ id: 8, name: serviceLegend.accountType.NAME(8) }
				]}
			],

			columnDefs : [
				{
					headerName: $rootScope.i18n('l-code-erp', [], 'dts/crm'),
					width: 90,
					field: 'cod_pessoa_erp'
				}, {
					headerName: $rootScope.i18n('l-name', [], 'dts/crm'),
					field: 'nom_razao_social',
					cellRenderer: function (params) {

						var customHTML = '',
							contact = params.data;

						if (contact && contact.log_acesso !== true) {
							customHTML = '<span class="glyphicon glyphicon-lock"></span>';
						}

						return customHTML + ' ' + params.value;
					}
				}, {
					headerName: $rootScope.i18n('l-type-account', [], 'dts/crm'),
					width: 200,
					field: 'nom_tip_cta'
				}
			],

			returnValue : function () {
				if (this.applyContactEdit) {
					return this.$selected.nom_razao_social;
				} else {
					return this.$selected;
				}
			},

			getObjectFromValue: function (value, init) {
				if (angular.isObject(value)) {
					return value;
				}
			},

			applyFilter : function (parameters) {

				var CRMControlContactZoom = this,
					property,
					value,
					options,
					filters = [],
					i;

				options = {
					start: (parameters.more ? this.zoomResultList.length : 0),
					entity: 2 // 0. ALL 1. CONTA 2. CONTATO 3. CONTATO & CLIENTE
				};

				if (parameters.init && parameters.init.entity && parameters.init.entity > 0) {
					options.entity = parameters.init.entity;
				}

				property = parameters.selectedFilter.property;
				value = parameters.selectedFilterValue;

				if (property === "idi_tip_cta") {
					filters.push({property: property, value: value.id});
				} else {
					filters.push({property: property, value: helper.parseStrictValue(value)});
				}

				contactFactory.zoom(filters, options, function (result) {

					var el = $('.modal-body-zoom').prev().find('.modal-title span');
					el.html('&nbsp;(0)');

					CRMControlContactZoom.resultTotal = 0;

					if (parameters.more !== true) {
						CRMControlContactZoom.zoomResultList = [];
					}

					for (i = 0; i < result.length; i++) {

						if (result[i].$length) {
							CRMControlContactZoom.resultTotal = result[i].$length;
							el.html('&nbsp;(' + $filter('countPerPage')(result[i].$length, 25) + ')');
						}

						accountHelper.parseSex(result[i]);
						accountHelper.parsePersonType(result[i]);
						accountHelper.parseAccountType(result[i]);

						CRMControlContactZoom.zoomResultList.push(result[i]);
					}
				});
			}
		};
	}; // serviceContactZoom
	serviceContactZoom.$inject = [
		'$rootScope', '$injector', '$filter', 'crm.crm_pessoa.contato.factory', 'crm.account.helper',
		'crm.legend', 'crm.helper'
	];

	// ########################################################
	// ### CONTACT EDIT
	// ########################################################
	serviceContactEditZoom = function (serviceContactZoom) {

		angular.extend(this, serviceContactZoom);

		this.applyContactEdit = true;

		return this;

	};

	serviceContactEditZoom.$inject = ['crm.crm_pessoa.contato.zoom'];

	// ########################################################
	// ### COMPETITOR
	// ########################################################
	serviceAccountCompetitorZoom = function (serviceAccountZoom) {

		angular.extend(this, serviceAccountZoom);

		this.applyCompetitorFilter = true;

		return this;

	};

	serviceAccountCompetitorZoom.$inject = ['crm.crm_pessoa.conta.zoom'];

	// ########################################################
	// ### RESALE
	// ########################################################
	serviceAccountResaleZoom = function (serviceAccountZoom) {

		angular.extend(this, serviceAccountZoom);

		this.applyResaleFilter = true;

		return this;

	};

	serviceAccountResaleZoom.$inject = ['crm.crm_pessoa.conta.zoom'];

	// ########################################################
	// ### All Type Account
	// ########################################################
	serviceAllTypeAccountZoom = function (serviceAccountZoom, serviceLegend) {

		angular.extend(this, serviceAccountZoom);


		var i,
			result = angular.copy(this),
			propertyList = [{ id: 1, name: serviceLegend.accountType.NAME(1) },
							{ id: 2, name: serviceLegend.accountType.NAME(2) },
							{ id: 3, name: serviceLegend.accountType.NAME(3) },
							{ id: 4, name: serviceLegend.accountType.NAME(4) },
							{ id: 5, name: serviceLegend.accountType.NAME(5) },
							{ id: 6, name: serviceLegend.accountType.NAME(6) },
							{ id: 7, name: serviceLegend.accountType.NAME(7) },
							{ id: 8, name: serviceLegend.accountType.NAME(8) }];

		if (result.propertyFields && angular.isArray(result.propertyFields)) {
			for (i = 0; i < result.propertyFields.length; i++) {
				if (result.propertyFields[i].property === "idi_tip_cta") {
					result.propertyFields[i].propertyList = propertyList;
				}
			}
		}

		return result;

	};

	serviceAllTypeAccountZoom.$inject = ['crm.crm_pessoa.conta.zoom', 'crm.legend'];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.factory('crm.crm_pessoa.conta.zoom',         serviceAccountZoom);
	index.register.factory('crm.crm_pessoa.contato.zoom',       serviceContactZoom);
	index.register.factory('crm.crm_pessoa.contato_edit.zoom',  serviceContactEditZoom);
	index.register.factory('crm.crm_pessoa.revenda.zoom',       serviceAccountResaleZoom);
	index.register.factory('crm.crm_pessoa.concorrente.zoom',   serviceAccountCompetitorZoom);
	index.register.factory('crm.crm_pessoa.all_type_account.zoom',   serviceAllTypeAccountZoom);

});
