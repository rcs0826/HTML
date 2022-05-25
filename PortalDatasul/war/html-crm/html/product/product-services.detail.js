/*globals index, define, angular, TOTVSEvent, console, CRMEvent */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1019.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/html/product/version/version-services.edit.js',
	'/dts/crm/html/product/component/component-services.edit.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $stateParams, $location, TOTVSEvent, helper,
							factory, preferenceFactory, modalEdit, modalVersionEdit, modalComponentEdit) {

		var CRMControl = this;

		this.model = undefined;

		this.isIntegratedWithEMS = false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.canEdit = function () {
			var item = CRMControl.model;

			if (CRMControl.isIntegratedWithEMS === true && item && item.cod_item_erp && item.cod_item_erp !== '') {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('nav-product', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-validate-product-erp', [], 'dts/crm')
				});
				return false;
			} else {
				return true;
			}
		};

		this.onEdit = function () {
			if (CRMControl.canEdit() === true) {
				modalEdit.open({
					model: CRMControl.model
				}).then(function (result) {
					if (result) {
						CRMControl.model = result;
					}
				});

			}
		};

		this.addVersion = function () {
			if (!CRMControl.model.log_produt_assist_tec) { return; }

			modalVersionEdit.open({
				product: CRMControl.model
			}).then(function (result) {
				if (result) {
					if (!CRMControl.model.ttProdutoSuporteVersao) {
						CRMControl.model.ttProdutoSuporteVersao = [];
					}
					CRMControl.model.ttProdutoSuporteVersao.unshift(result);
				}
			});
		};

		this.addComponent = function () {
			if (CRMControl.model.idi_compos_produt === 1 || CRMControl.model.idi_compos_produt === 3) { return; }

			modalComponentEdit.open({
				product: CRMControl.model
			}).then(function (result) {
				if (result) {
					if (!CRMControl.model.ttProdutoSuporteComponente) {
						CRMControl.model.ttProdutoSuporteComponente = [];
					}
					CRMControl.model.ttProdutoSuporteComponente.unshift(result);
				}
			});
		};

		this.removeVersion = function (version, index) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-version', [], 'dts/crm').toLowerCase(), version.nom_vers_produt
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.removeVersion(version.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-version', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						CRMControl.model.ttProdutoSuporteVersao.splice(index, 1);
					});
				}
			});
		};

		this.removeComponent = function (component, index) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('l-component', [], 'dts/crm').toLowerCase(), component.nom_produt
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.removeComponent(component.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-component', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						CRMControl.model.ttProdutoSuporteComponente.splice(index, 1);
					});
				}
			});
		};

		this.onRemove = function () {

			if (CRMControl.canEdit() === true) {

				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-delete',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n('msg-confirm-delete', [
						$rootScope.i18n('nav-product', [], 'dts/crm').toLowerCase(), CRMControl.model.nom_produt
					], 'dts/crm'),
					callback: function (isPositiveResult) {

						if (!isPositiveResult) { return; }

						factory.deleteRecord(CRMControl.model.num_id, function (result) {

							if (!result || result.l_ok !== true) { return; }

							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'success',
								title: $rootScope.i18n('nav-product', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
							});

							$location.path('/dts/crm/product/');
						});
					}
				});

			}

		};

		this.onTechnicalAssistence = function (value) {
			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-to-update',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-update-product-support', [CRMControl.model.nom_produt], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.setTechnicalAssistence(CRMControl.model.num_id, value, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-product', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-generic', [CRMControl.model.nom_produt], 'dts/crm')
						});

						CRMControl.model.log_produt_assist_tec = value;

						if (value === false) {
							CRMControl.model.ttProdutoSuporteVersao = [];
						}
					});
				}
			});
		};

		this.loadPreferences = function (callback) {
			var count = 0, total = 1;

			preferenceFactory.isIntegratedWithEMS(function (result) {
				CRMControl.isIntegratedWithEMS = result;
				if (++count === total && callback) { callback(); }
			});
		};

		this.load = function (id) {
			factory.getRecord(id, function (result) {
				if (result) {
					CRMControl.model = result;
				}
			});
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-product', [], 'dts/crm'),
				viewController = 'crm.product.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = {};

				CRMControl.loadPreferences();

				if ($stateParams && $stateParams.id) {
					CRMControl.load($stateParams.id);
				}
			});
		};

		if ($rootScope.currentuserLoaded) { CRMControl.init(); }

		// *********************************************************************************
		// *** Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

		$scope.$on(TOTVSEvent.rootScopeInitialize, function () {
			CRMControl.init();
		});
	};

	controller.$inject = [
		'$rootScope', '$scope', '$stateParams', '$location', 'TOTVSEvent', 'crm.helper',
		'crm.crm_produt.factory', 'crm.crm_param.factory', 'crm.product.modal.edit', 'crm.product-version.modal.edit', 'crm.product-component.modal.edit'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.product.detail.control', controller);

});
