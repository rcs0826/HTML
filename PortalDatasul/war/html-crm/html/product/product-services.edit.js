/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1019.js',
	'/dts/crm/js/api/fchcrm1047.js',
	'/dts/crm/js/api/fchcrm1082.js',
	'/dts/crm/js/api/fchcrm1086.js',
	'/dts/crm/js/zoom/crm_estab.js'
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
				templateUrl: '/dts/crm/html/product/product.edit.html',
				controller: 'crm.product.edit.control as controller',
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

	controller = function ($rootScope, $scope, $location, $modalInstance, parameters,
							TOTVSEvent, helper, helperProduct, factory, currencyFactory, factoryUnitMeasurement, establishmentFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;

		this.isOpenStory = false;
		this.isOpenComplement = false;
		this.isOpenFeature = false;
		this.isOpenSellingArgument = false;

		this.listOfCurrency = [];
		this.listOfUn = [];
		this.listOfComposition = [];
		this.listOfStatus = [];
		this.listOfProductType = [];
		this.listOfMaterialFamily = [];
		this.listOfBusinessFamily = [];
		this.listOfStockGroup = [];
		this.listOfTaxClassification = [];
		this.listOfEstablishment = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {
			var model = this.model || {};
			this.editMode = (model.num_id > 0);

			if (this.editMode == true) {
				this.parseProduct(model);
			}

			this.listOfStatus = helperProduct.status;
			this.listOfComposition = helperProduct.composition;

			this.getAllCurrency();
			this.getAllUnitMeasurement();
			this.getAllMaterialFamily();
			this.getAllBusinessFamily();
			this.getAllStockGroup();
			this.getAllProductType();
			this.getAllTaxClassification();

		};

		this.parseProduct = function (model) {

			if (model.num_id_estab && model.num_id_estab > 0) {
				model.establishment = {
					num_id: model.num_id_estab,
					nom_estab: model.nom_estab,
					cod_estab_erp: model.cod_estab_erp
				};
			}

			if (model.num_id_moed && model.num_id_moed > 0) {
				model.currency = { num_id: model.num_id_moed, nom_moeda: model.nom_moed }
			}

			if (model.num_id_umd_vda && model.num_id_umd_vda > 0) {
				model.un = {
					num_id: model.num_id_umd_vda,
					nom_unid_medid: model.nom_umd_vda,
					cod_unid_medid_erp: model.cod_unid_medid_erp
				}
			}

			if (model.num_id_tip_produt && model.num_id_tip_produt > 0) {
				model.productType = { num_id: model.num_id_tip_produt, nom_tip_produt: model.nom_tip_produt }
			}

			if (model.num_id_grp_estoq && model.num_id_grp_estoq > 0) {
				model.stockGroup = { num_id: model.num_id_grp_estoq, nom_grp_estoq: model.nom_grp_estoq }
			}

			if (model.num_id_cfisc) {
				model.taxClassification = { num_id: model.num_id_cfisc, nom_classif_fisc: model.nom_classif_fisc }
			}

			if (model.num_id_familia && model.num_id_familia > 0) {
				model.materialFamily = { num_id: model.num_id_familia, nom_familia: model.nom_familia }
			}

			if (model.num_id_fc && model.num_id_fc > 0) {
				model.businessFamily = { num_id: model.num_id_fc, nom_familia_comerc: model.nom_familia_comerc }
			}

			if (model.idi_compos_produt && model.idi_compos_produt > 0) {
				model.composition = { id: model.idi_compos_produt, name: model.nom_idi_compos_produt }
			}

			if (model.idi_status_item && model.idi_status_item > 0) {
				model.status = { id: model.idi_status_item, name: model.nom_idi_status_item }
			}

		};

		this.save = function () {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (!vo) { return; }

			if (CRMControl.editMode === true) {
				factory.updateRecord(vo.num_id, vo, CRMControl.afterSave);
			} else {
				factory.saveRecord(vo, CRMControl.afterSave);
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
				model = CRMControl.model;

			if (!model.nom_produt || model.nom_produt.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (!model.un || !model.un.num_id) {
				isInvalidForm = true;
				messages.push('l-unit-of-measurement');
			}

			if (!model.productType || !model.productType.num_id) {
				isInvalidForm = true;
				messages.push('l-type');
			}

			if (!model.stockGroup || !model.stockGroup.num_id) {
				isInvalidForm = true;
				messages.push('l-stock-group');
			}

			if (!model.materialFamily || !model.materialFamily.num_id) {
				isInvalidForm = true;
				messages.push('l-material-family');
			}

			if (!model.businessFamily || !model.businessFamily.num_id) {
				isInvalidForm = true;
				messages.push('l-business-family');
			}

			if (!model.dat_impl) {
				isInvalidForm = true;
				messages.push('l-date-deployment');
			}

			if (!model.status || !model.status.id) {
				isInvalidForm = true;
				messages.push('l-status');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-product', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id || 0;
			vo.nom_produt = model.nom_produt;
			vo.cod_aux_produt = model.cod_aux_produt;
			vo.dat_impl = model.dat_impl;
			vo.val_fator_conver_unid_medid = model.val_fator_conver_unid_medid;
			vo.val_cust = model.val_cust;

			vo.log_produt_vda = model.log_produt_vda || false;
			vo.log_produt_concor = model.log_produt_concor || false;
			vo.log_produt_assist_tec = model.log_produt_assist_tec || false;

			vo.num_id_estab = (model.establishment && model.establishment.num_id) ? model.establishment.num_id : 0;
			vo.num_id_moed = (model.currency && model.currency.num_id) ? model.currency.num_id : 0;
			vo.num_id_cfisc = (model.taxClassification && model.taxClassification.num_id) ? model.taxClassification.num_id : 0;
			vo.idi_compos_produt = (model.composition && model.composition.id) ? model.composition.id : 0;

			vo.num_id_umd_vda = model.un ? model.un.num_id : 0;
			vo.num_id_tip_produt = model.productType ? model.productType.num_id : 0;
			vo.num_id_grp_estoq = model.stockGroup ? model.stockGroup.num_id : 0;
			vo.num_id_familia = model.materialFamily ? model.materialFamily.num_id : 0;
			vo.num_id_fc = model.businessFamily ? model.businessFamily.num_id : 0;
			vo.idi_status_item = model.status ? model.status.id : 0;

			vo.dsl_narrat_text_item = model.dsl_narrat_text_item;
			vo.dsl_caract_tec = model.dsl_caract_tec;
			vo.dsl_text_argum_vda = model.dsl_text_argum_vda;

			return vo;
		};

		this.afterSave = function (item) {

			if (!item || !item.num_id) { return; }

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('nav-product', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('nav-product', [], 'dts/crm'),
					item.nom_produt
				], 'dts/crm')
			});

			$modalInstance.close(item);
			if (CRMControl.editMode === false) {
				$location.path('/dts/crm/product/detail/' + item.num_id);
			}
		};

		this.getAllCurrency = function () {
			CRMControl.listOfCurrency = [];

			currencyFactory.getAll(function (result) {
				if (result === undefined) { return; }
				CRMControl.listOfCurrency = result;
			}, true);
		};

		this.getAllUnitMeasurement = function () {
			CRMControl.listOfUn = [];

			factoryUnitMeasurement.getAll(function (result) {
				if (result === undefined) { return; }
				CRMControl.listOfUn = result;
			}, true);
		};

		this.getAllMaterialFamily = function () {
			CRMControl.listOfMaterialFamily = [];

			factory.getAllMaterialFamily(function (result) {
				if (result === undefined) { return; }
				CRMControl.listOfMaterialFamily = result;
			}, true);
		};

		this.getAllBusinessFamily = function () {
			CRMControl.listOfBusinessFamily = [];

			factory.getAllBusinessFamily(function (result) {
				if (result === undefined) { return; }
				CRMControl.listOfBusinessFamily = result;
			}, true);
		};

		this.getAllStockGroup = function () {
			CRMControl.listOfStockGroup = [];

			factory.getAllStockGroup(function (result) {
				if (result === undefined) { return; }
				CRMControl.listOfStockGroup = result;
			}, true);
		};

		this.getAllProductType = function () {
			CRMControl.listOfProductType = [];

			factory.getAllProductType(function (result) {
				if (result === undefined) { return; }
				CRMControl.listOfProductType = result;
			}, true);
		};

		this.getAllTaxClassification = function () {
			CRMControl.listOfTaxClassification = [];

			factory.getAllTaxClassification(function (result) {
				if (result === undefined) { return; }
				CRMControl.listOfTaxClassification = result;
			}, true);
		};

		this.getEstablishments = function (value) {
			if (!value || value === '') {
				return [];
			}

			var filter = { property: 'type_ahead', value: helper.parseStrictValue(value) };

			establishmentFactory.typeahead(filter, undefined, function (result) {
				CRMControl.listOfEstablishment = result;
			});

		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.model ? angular.copy(parameters.model) : {};

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
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper', 'crm.product.helper', 'crm.crm_produt.factory', 'crm.crm_erp_moed.factory', 'crm.crm_unid_medid.factory', 'crm.crm_estab.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.product.modal.edit', modal);
	index.register.controller('crm.product.edit.control', controller);
});
