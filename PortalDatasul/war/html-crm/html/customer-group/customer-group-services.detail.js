/*globals define, angular */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1037.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $stateParams, $location, TOTVSEvent, helper,
							factory, modalEdit, legend) {

		var CRMControl = this;

		this.model = undefined;

		this.personTypes = [
			{num_id: 1, nom_tipo: legend.personalType.NAME(1)},
			{num_id: 2, nom_tipo: legend.personalType.NAME(2)},
			{num_id: 3, nom_tipo: legend.personalType.NAME(3)},
			{num_id: 4, nom_tipo: legend.personalType.NAME(4)}
		];

		this.accesses = [
			{num_id: 1, nom_niv_aces: $rootScope.i18n('l-access-general', [], 'dts/crm')},
			{num_id: 2, nom_niv_aces: $rootScope.i18n('l-access-limited', [], 'dts/crm')}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.loadDefaults = function () {
			if (CRMControl.model.idi_niv_aces > 0) {
				CRMControl.model.ttNivelAcesso = CRMControl.accesses[CRMControl.model.idi_niv_aces - 1];
			}

			if (CRMControl.model.idi_natur_clien > 0) {
				CRMControl.model.ttTipoPessoa = CRMControl.personTypes[CRMControl.model.idi_natur_clien - 1];
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
				group: CRMControl.model
			}).then(function (result) {
				if (result) {
					CRMControl.model = result;
					CRMControl.loadDefaults()
				}
			});
		};

		this.onRemove = function () {

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete', [
					$rootScope.i18n('nav-customer-group', [], 'dts/crm').toLowerCase(), CRMControl.model.nom_grp_clien
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(CRMControl.model.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-customer-group', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/customer-group/');
					});
				}
			});
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-customer-group', [], 'dts/crm'),
				viewController = 'crm.customer-group.detail.control';

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
		'crm.crm_grp_clien.factory', 'crm.customer-group.modal.edit', 'crm.legend'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.customer-group.detail.control', controller);

});
