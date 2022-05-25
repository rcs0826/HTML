/*globals define, angular */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1117.js',
	'/dts/crm/html/prfv-range/range/range-services.tab.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $stateParams, $location, TOTVSEvent, helper,
							factory, modalEdit, legend, serviceRangeTab) {

		var CRMControl = this;

		this.model = undefined;

		angular.extend(this, serviceRangeTab);

		this.colors = [
			{num_id: 1, nom_cor: $rootScope.i18n('l-color-yellow', [], 'dts/crm')},
			{num_id: 2, nom_cor: $rootScope.i18n('l-color-orange', [], 'dts/crm')},
			{num_id: 3, nom_cor: $rootScope.i18n('l-color-red', [], 'dts/crm')},
			{num_id: 4, nom_cor: $rootScope.i18n('l-color-pink', [], 'dts/crm')},
			{num_id: 5, nom_cor: $rootScope.i18n('l-color-dark-blue', [], 'dts/crm')},
			{num_id: 6, nom_cor: $rootScope.i18n('l-color-light-blue', [], 'dts/crm')},
			{num_id: 7, nom_cor: $rootScope.i18n('l-color-green', [], 'dts/crm')},
			{num_id: 8, nom_cor: $rootScope.i18n('l-color-brown', [], 'dts/crm')},
			{num_id: 9, nom_cor: $rootScope.i18n('l-color-black', [], 'dts/crm')},
			{num_id: 10, nom_cor: $rootScope.i18n('l-color-silver', [], 'dts/crm')},
			{num_id: 11, nom_cor: $rootScope.i18n('l-color-white', [], 'dts/crm')},
			{num_id: 12, nom_cor: $rootScope.i18n('l-color-violet', [], 'dts/crm')}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.loadDefaults = function () {
			var i = 0;
			if (CRMControl.model.ttFaixa) {
				for (i = 0; i < CRMControl.model.ttFaixa.length; i++) {
					if (CRMControl.model.ttFaixa[i].idi_cor_con > 0) {
						CRMControl.model.ttFaixa[i].ttCor = CRMControl.colors[CRMControl.model.ttFaixa[i].idi_cor_con - 1];
					}
				}

			}
		};

		this.load = function (id) {
			factory.getRecord(id, function (result) {
				if (result) {
					CRMControl.model = result;
					CRMControl.loadDefaults();
				}
			});
		};

		this.onEdit = function () {
			modalEdit.open({
				range: CRMControl.model
			}).then(function (result) {
				if (result) {
					CRMControl.model = result;
					CRMControl.loadDefaults();
				}
			});
		};

		this.onRemove = function () {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-prfv-range', [], 'dts/crm').toLowerCase(), CRMControl.model.des_faixa_prfv
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(CRMControl.model.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-prfv-range', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/prfv-range/');
					});
				}
			});
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-prfv-range', [], 'dts/crm'),
				viewController = 'crm.prfv-range.detail.control';

			helper.loadCRMContext(function () {

				helper.startView(viewName, viewController, CRMControl);

				CRMControl.model = undefined;

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
		'crm.crm_prfv_faixa_cabec.factory', 'crm.prfv-range.modal.edit', 'crm.legend',
		'crm.range.service'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.prfv-range.detail.control', controller);

});
