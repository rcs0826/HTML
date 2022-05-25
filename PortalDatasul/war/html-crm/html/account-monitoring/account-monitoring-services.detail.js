/*globals define, angular */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1037.js',
	'/dts/crm/js/api/fchcrm1104.js',
	'/dts/hub/js/api/fchhub0002.js'
], function (index) {

	'use strict';

	var controller;

	// *************************************************************************************
	// *** CONTROLLER - DETAIL
	// *************************************************************************************

	controller = function ($rootScope, $scope, $stateParams, $location, TOTVSEvent, helper,
							factory, modalEdit, legend, userGroupFactory, clientGroupFactory, hierarchyFactory) {

		var CRMControl = this;

		this.model = undefined;

		this.types = [
			{num_id: 1, nom_tipo: $rootScope.i18n('l-team-hierarchy', [], 'dts/crm')},
			{num_id: 2, nom_tipo: $rootScope.i18n('l-group-user', [], 'dts/crm')},
			{num_id: 3, nom_tipo: $rootScope.i18n('l-group-client', [], 'dts/crm')}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.setFilterUserGroupById = function (id) {
			userGroupFactory.getRecord(id, function (result) {
				if (result) {
					CRMControl.model.ttFiltro = result;
				}
			});
		};

		this.setFilterClientGroupById = function (id) {
			clientGroupFactory.getRecord(id, function (result) {
				if (result) {
					CRMControl.model.ttFiltro = result;
				}
			});
		};

		this.setFilterHierarchyById = function (id) {
			hierarchyFactory.getHierarchy(id, function (result) {
				if (result) {
					CRMControl.model.ttFiltro = result[0];
				}
			});
		};

		this.loadDefaults = function () {
			var i = 0;

			if (CRMControl.model.num_tip_monitorar > 0) {
				CRMControl.model.ttTipo = CRMControl.types[CRMControl.model.num_tip_monitorar - 1];

				if (CRMControl.model.num_tip_monitorar === 1) {
					CRMControl.setFilterHierarchyById(CRMControl.model.num_id_filtro);
				} else if (CRMControl.model.num_tip_monitorar === 2) {
					CRMControl.setFilterUserGroupById(CRMControl.model.num_id_filtro);
				} else if (CRMControl.model.num_tip_monitorar === 3) {
					CRMControl.setFilterClientGroupById(CRMControl.model.num_id_filtro);
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
				parameter: CRMControl.model
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
					$rootScope.i18n('nav-account-monitoring', [], 'dts/crm').toLowerCase(), CRMControl.model.cod_livre_1
				], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					factory.deleteRecord(CRMControl.model.num_id, function (result) {

						if (!result || result.l_ok !== true) { return; }

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-account-monitoring', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
						});

						$location.path('/dts/crm/account-monitoring/');
					});
				}
			});
		};

		// *********************************************************************************
		// *** Initialize
		// *********************************************************************************

		this.init = function () {

			var viewName = $rootScope.i18n('nav-account-monitoring', [], 'dts/crm'),
				viewController = 'crm.account-monitoring.detail.control';

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
		'crm.crm_monitor_account_movement.factory', 'crm.account-monitoring.modal.edit', 'crm.legend',
		'crm.crm_grp_usuar.factory', 'crm.crm_grp_clien.factory', 'hub.hier_time.factory'
	];

	// ########################################################
	// ### Register
	// ########################################################

	index.register.controller('crm.account-monitoring.detail.control', controller);

});
