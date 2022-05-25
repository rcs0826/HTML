/*global angular, define, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1002.js',
	'/dts/crm/js/api/fchcrm1004.js',
	'/dts/crm/js/api/fchcrm1037.js',
	'/dts/crm/js/api/fchcrm1046.js',
	'/dts/crm/js/api/fchcrm1054.js',
	'/dts/crm/js/api/fchcrm1056.js',
	'/dts/crm/js/api/fchcrm1060.js',
	'/dts/hub/js/api/fchhub0002.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_grp_usuar.js'
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
				templateUrl: '/dts/crm/html/account-monitoring/account-monitoring.edit.html',
				controller: 'crm.account-monitoring.edit.control as controller',
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

	controller = function ($rootScope, $scope, $location, $modalInstance, parameters, TOTVSEvent,
							helper, parameterFactory, legend, segmentationFactory, layoutFactory,
							userFactory, userGroupFactory, clientGroupFactory, hierarchyFactory,
							preferenceFactory) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;

		this.users = [];
		this.groups = [];
		this.segmentations = [];
		this.layouts = [];
		this.clientGroups = [];
		this.hierarchies = [];
		this.minimumOfDaysParam = 0;

		this.types = [
			{num_id: 1, nom_tipo: $rootScope.i18n('l-team-hierarchy', [], 'dts/crm')},
			{num_id: 2, nom_tipo: $rootScope.i18n('l-group-user', [], 'dts/crm')},
			{num_id: 3, nom_tipo: $rootScope.i18n('l-group-client', [], 'dts/crm')}
		];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.getSegmentation = function (value) {
			if (!value || value === '') { return []; }

			var filter = { property: 'nom_segmtcao_public',  value: helper.parseStrictValue(value) };

			segmentationFactory.typeahead(filter, undefined, function (result) {
				CRMControl.segmentations = result;
			});
		};

		this.getGroups = function (value) {
			if (!value || value === '') { return []; }

			var filter = { property: 'nom_grp_usuar',  value: helper.parseStrictValue(value) };

			userGroupFactory.typeahead(filter, undefined, function (result) {
				CRMControl.groups = result;
			});
		};

		this.getClientGroups = function (value) {
			if (!value || value === '') { return []; }

			var filter = { property: 'nom_grp_clien',  value: helper.parseStrictValue(value) };

			clientGroupFactory.typeahead(filter, undefined, function (result) {
				CRMControl.clientGroups = result;
			});
		};

		this.getUsers = function (value) {
			if (!value || value === '') { return []; }

			var filter = { property: 'nom_usuar',  value: helper.parseStrictValue(value) };

			userFactory.typeahead(filter, undefined, function (result) {
				CRMControl.users = result;
			});
		};

		this.getLayouts = function () {
			layoutFactory.getAll(function (result) {
				CRMControl.layouts = result;
			});
		};

		this.getHierarchies = function () {
			hierarchyFactory.getAll(undefined, undefined, function (result) {
				CRMControl.hierarchies = result;
			});
		};

		this.onChangeFilter = function () {
			CRMControl.model.ttFiltro = undefined;
		};

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

		this.loadPreferences = function (callback) {

			var count = 0, total = 1;

			preferenceFactory.getPreferenceAsInteger('DIAS_MIN_MOV_CTA', function (result) {
				CRMControl.minimumOfDaysParam = result;
				if (++count === total && callback) { callback(); }
			});

		};

		this.loadDefaults = function () {

			CRMControl.getLayouts();

			if (this.editMode) {
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
				if (CRMControl.model.num_tip_monitorar !== 1) {
					CRMControl.getHierarchies();
				}
			} else {
				CRMControl.getHierarchies();
				this.model.ttTipo = this.types[0];
			}

		};

		this.validadeParameterModel = function () {

			var model = this.model || {};

			this.editMode = (model.num_id > 0);
			this.loadPreferences();
			this.loadDefaults();
		};

		this.save = function () {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave();

			if (!vo) { return; }

			if (CRMControl.editMode === true) {
				parameterFactory.updateRecord(vo.num_id, vo, function (result) {
					if (!result) {
						return;
					}
					CRMControl.afterSave(result);
				});
			} else {
				parameterFactory.saveRecord(vo, function (result) {
					if (!result) {
						return;
					}
					CRMControl.afterSave(result);
				});
			}
		};

		this.cancel = function (parameter) {

			if ($modalInstance) {
				if (parameter) {
					$modalInstance.close(parameter);
				} else {
					$modalInstance.dismiss('cancel');
				}
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model.cod_livre_1 || model.cod_livre_1.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (!model.ttTipo || model.ttTipo.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-monitoring-type');
			}

			if (!model.ttFiltro || model.ttFiltro.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-filter');
			}

			if (!model.num_dias || model.num_dias < 1) {
				isInvalidForm = true;
				messages.push('l-days-monitoring');
			} else if (CRMControl.minimumOfDaysParam && CRMControl.minimumOfDaysParam > 0 &&
					  model.num_dias < CRMControl.minimumOfDaysParam) {

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'error',
					title: $rootScope.i18n('nav-account-monitoring', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-invalid-minimun-days-param', [
						CRMControl.minimumOfDaysParam
					], 'dts/crm')
				});
				return true;
			}

			if (!model.ttGrupo || model.ttGrupo.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-notification-user-group');
			}

			if (model.log_transf_cta === true && (!model.ttUsuario || model.ttUsuario.num_id < 1)) {
				isInvalidForm = true;
				messages.push('l-transfer-user');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-account-monitoring', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;
			vo.log_transf_cta = model.log_transf_cta;
			vo.cod_livre_1 = model.cod_livre_1;
			vo.num_dias = model.num_dias;
			vo.log_email_1 = model.log_email_1;
			vo.log_ped_cotac = model.log_ped_cotac;
			vo.log_ocor = model.log_ocor;
			vo.log_tar = model.log_tar;
			vo.log_histor = model.log_histor;
			vo.log_oportun_vda = model.log_oportun_vda;
			vo.log_cta = model.log_cta;
			vo.log_plano = model.log_plano;
			vo.log_cotac = model.log_cotac;

			if (model.ttTipo) {
				vo.num_tip_monitorar = model.ttTipo.num_id;
			}

			if (model.ttFiltro) {
				vo.num_id_filtro = model.ttFiltro.num_id;
			}
			if (model.ttSegmentacao) {
				vo.num_id_segmtcao = model.ttSegmentacao.num_id;
			}
			if (model.ttGrupo) {
				vo.num_id_grp = model.ttGrupo.num_id;
			}
			if (model.ttUsuario) {
				vo.num_id_usuar = model.ttUsuario.num_id;
			}
			if (model.ttLayout) {
				vo.num_id_layout = model.ttLayout.num_id;
			}

			return vo;
		};

		this.afterSave = function (parameter) {

			if (!parameter) { return; }

			var message;

			if (CRMControl.editMode) {
				message = 'msg-update-generic';
			} else {
				message = 'msg-save-generic';
			}

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('nav-account-monitoring', [], 'dts/crm'),
				detail: $rootScope.i18n(message, [
					$rootScope.i18n('nav-account-monitoring', [], 'dts/crm'),
					parameter.cod_livre_1
				], 'dts/crm')
			});

			$modalInstance.close(parameter);

			if (CRMControl.editMode === false) {
				$location.path('/dts/crm/account-monitoring/detail/' + parameter.num_id);
			}
		};

		this.init = function () {
			this.validadeParameterModel();
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model = parameters.parameter ? angular.copy(parameters.parameter) : {};

		this.init();

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
		'$rootScope', '$scope', '$location', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper',
		'crm.crm_monitor_account_movement.factory', 'crm.legend', 'crm.crm_segmtcao.factory',
		'crm.crm_public_layout.factory', 'crm.crm_usuar.factory', 'crm.crm_grp_usuar.factory',
		'crm.crm_grp_clien.factory', 'hub.hier_time.factory', 'crm.crm_param.factory'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.account-monitoring.modal.edit', modal);
	index.register.controller('crm.account-monitoring.edit.control', controller);
});

