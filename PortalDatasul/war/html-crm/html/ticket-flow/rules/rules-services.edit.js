/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
/*jslint continue: true*/

define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1001.js',
	'/dts/crm/js/api/fchcrm1032.js',
	'/dts/crm/js/api/fchcrm1034.js',
	'/dts/crm/js/api/fchcrm1035.js',
	'/dts/crm/js/api/fchcrm1109.js',
	'/dts/crm/js/api/fchcrm1110.js'
], function (index) {
	'use strict';

	var controller,
		modal;

	controller = function ($rootScope, $scope, $modalInstance, $filter, parameters, factoryRules, TOTVSEvent,
							helper, factoryTicketType, factoryPriority, factoryOrigin, factoryVersion) {

		var CRMControl = this,
			status,
			ticketTypes = [],
			rule,
			type;

		this.editMode = false;

		this.attributeTypes = [{num_id: 1, name: $rootScope.i18n('l-type-ticket', [], 'dts/crm')},
							   {num_id: 2, name: $rootScope.i18n('l-priority', [], 'dts/crm')},
							   {num_id: 3, name: $rootScope.i18n('l-version', [], 'dts/crm')},
							   {num_id: 4, name: $rootScope.i18n('l-origin', [], 'dts/crm')}
							  ];

		this.logicalOperator = [{num_id: 1, name: '='},
								{num_id: 2, name: '<>'},
								{num_id: 3, name: '>='},
								{num_id: 4, name: '>'},
								{num_id: 5, name: '<='},
								{num_id: 6, name: '<'}
							   ];

		this.relationalOperator = [{num_id: 1, name: $rootScope.i18n('l-relational-or', [], 'dts/crm')},
									{num_id: 2, name: $rootScope.i18n('l-relational-and', [], 'dts/crm')}
								  ];


		this.getTicketTypes = function () {

			factoryTicketType.getAll(function (result) {

				CRMControl.ticketTypes = result || [];

				if (CRMControl.ticketTypes.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('nav-rules', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-ticket-type', [], 'dts/crm')
					});
					return;
				}
			});
		};

		this.getPriorieties = function () {

			factoryPriority.getAll(function (result) {

				CRMControl.priorieties = result || [];

				if (CRMControl.priorieties.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('nav-rules', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-ticket-priority', [], 'dts/crm')
					});
					return;
				}
			});
		};

		this.getVersions = function () {

			factoryVersion.getAll(function (result) {

				CRMControl.versions = result || [];

				if (CRMControl.versions.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('nav-rules', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-ticket-version', [], 'dts/crm')
					});
					return;
				}
			});
		};

		this.getOrigins = function () {

			factoryOrigin.getAll(function (result) {

				CRMControl.origins = result || [];

				if (CRMControl.origins.length === 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type: 'warning',
						title: $rootScope.i18n('nav-rules', [], 'dts/crm'),
						detail: $rootScope.i18n('msg-not-found-ticket-origin', [], 'dts/crm')
					});
					return;
				}
			});
		};

		this.onChangeType = function () {

			if (!this.model.ttAttributeType || !this.model.ttAttributeType.num_id) { return; }

			this.type = 'ticketType';

			switch (this.model.ttAttributeType.num_id) {
			case 2:
				this.type = 'priority';
				break;
			case 3:
				this.type = 'version';
				break;
			case 4:
				this.type = 'origin';
				break;
			}

		};

		this.close = function (isSaveAndNew, item) {
			if ($modalInstance) {
				if (item) {
					$modalInstance.close(item);
				} else {
					$modalInstance.close();
				}

			}
		};

		this.setDefaults = function () {
			this.model = {
				ttAttributeType: {
					num_id: this.rule.idi_atrib_regra,
					name: this.rule.nom_idi_atrib_regra
				},
				ttOperator: {
					num_id: this.rule.idi_operador_logic,
					name: this.rule.nom_idi_operador_logic
				},
				ttType: {
					num_id: this.rule.num_id_atrib_regra
				},
				ttRelationalOperator: {
					num_id: this.rule.idi_cond_relacto,
					name: this.rule.nom_idi_cond_relacto
				}
			};

			this.onChangeType();

			switch (this.type) {
			case 'ticketType':
				this.model.ttType.nom_tip_ocor = this.rule.nom_id_atrib_regra;
				break;
			case 'priority':
				this.model.ttType.nom_priorid_ocor = this.rule.nom_id_atrib_regra;
				break;
			case 'version':
				this.model.ttType.nom_vers_produt = this.rule.nom_id_atrib_regra;
				break;
			case 'origin':
				this.model.ttType.nom_orig_ocor = this.rule.nom_id_atrib_regra;
				break;
			}
		};

		this.init = function () {
			this.getTicketTypes();
			this.getPriorieties();
			this.getVersions();
			this.getOrigins();

			if (this.rule) {
				this.editMode = true;
				this.setDefaults();
			}
		};

		this.save = function (isSaveAndNew) {
			var vo;

			if (CRMControl.isInvalidForm()) { return; }

			vo = this.convertToSave();

			if (CRMControl.editMode) {
				factoryRules.updateRecord(vo.num_id, vo, function (result) {
					if (result) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-rules', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-update-rule', [], 'dts/crm')
						});
						CRMControl.close(false, result);
					}
				});
			} else {
				factoryRules.saveRecord(vo, function (result) {
					if (result) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'success',
							title: $rootScope.i18n('nav-rules', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-save-rule', [], 'dts/crm')
						});

						if (!isSaveAndNew) {
							CRMControl.close(false, result);
						} else {
							CRMControl.clear();
						}
					}
				});
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				isInvalidForm = false,
				model = CRMControl.model;

			if (!model || !model.ttAttributeType || model.ttAttributeType.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-attribute-type');
			}

			if (!model || !model.ttOperator || model.ttOperator.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-operator');
			}

			if (!model || !model.ttType || model.ttType.num_id < 1) {
				isInvalidForm = true;

				switch (this.type) {
				case 'ticketType':
					messages.push('l-ticket-type');
					break;
				case 'priority':
					messages.push('l-priority');
					break;
				case 'version':
					messages.push('l-version');
					break;
				case 'origin':
					messages.push('l-origin');
					break;
				}

			}

			if (!model || !model.ttRelationalOperator || model.ttRelationalOperator.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-logical-operator');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('nav-rules', messages);
			}

			return isInvalidForm;
		};

		this.clear = function () {
			delete this.model.ttAttributeType;
			delete this.model.ttOperator;
			delete this.model.ttType;
			delete this.model.ttRelationalOperator;
		};

		this.convertToSave = function () {
			var vo = {
				num_id : CRMControl.rule ? CRMControl.rule.num_id : 0,
				num_id_ocor_fluxo: parseInt(CRMControl.flowId),
				idi_atrib_regra: CRMControl.model.ttAttributeType.num_id,
				num_id_atrib_regra : CRMControl.model.ttType.num_id,
				idi_operador_logic: CRMControl.model.ttOperator.num_id,
				idi_cond_relacto: CRMControl.model.ttRelationalOperator.num_id
			};

			return vo;
		};

		this.flowId = angular.copy(parameters.flowId);
		this.rule = angular.copy(parameters.model);

		this.init();
	};

	controller.$inject = [
		'$rootScope', '$scope', '$modalInstance', '$filter', 'parameters',
		'crm.crm_ocor_fluxo_regra.factory', 'TOTVSEvent', 'crm.helper',
		'crm.crm_tip_ocor.factory', 'crm.crm_priorid_ocor.factory', 'crm.crm_orig_ocor.factory',
		'crm.crm_vers.factory'
	];

	// *************************************************************************************
	// *** MODAL EDIT RULES
	// *************************************************************************************
	modal = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/ticket-flow/rules/rules.edit.html',
				controller: 'crm.ticket-flow-rules.edit.control as controller',
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
	// *** REGISTER
	// *************************************************************************************
	index.register.service('crm.ticket-flow-rules.modal.selection', modal);
	index.register.controller('crm.ticket-flow-rules.edit.control', controller);

});
