/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL */
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1080.js',
	'/dts/crm/js/api/fchcrm1082.js'
], function (index) {

	'use strict';

	var modalExpenseEdit,
		controllerExpenseEdit;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalExpenseEdit = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/expense/expense.edit.html',
				controller: 'crm.expense.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};

	modalExpenseEdit.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerExpenseEdit = function ($rootScope, $scope, parameters, legend, $modalInstance,
											factory, TOTVSEvent, helper, factoryUnitMeasurement) {

		var CRMControl = this;

		this.model = undefined;
		this.resultList = undefined;

		this.canOverrideUmd = true;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.cancel = function () {
			if (CRMControl.resultList && CRMControl.resultList.length > 0) {
				if (CRMControl.notPersist !== true) {
					$rootScope.$broadcast(CRMEvent.scopeSaveExpense, CRMControl.resultList);
				}
				$modalInstance.close(CRMControl.resultList);
			} else {
				$modalInstance.dismiss('cancel');
			}
		};

		this.onChangeType = function () {
			var type = this.model.ttTipo,
				umd  = this.model.ttUnidadeMedida;

			this.canOverrideUmd = true;
			this.model.qtd_itens_despes_realzdo = 0;
			this.model.val_despes_realzdo = 0;
			this.model.qtd_itens_despes = 0;
			this.model.val_despes_previs = 0;

			if (type && CRMUtil.isDefined(type.num_id)) {

				if (CRMUtil.isDefined(type.num_id_umd) && type.num_id_umd > 0) {
					umd = {
						num_id: type.num_id_umd,
						nom_sig_umd: type.nom_sig_umd,
						nom_unid_medid: type.nom_unid_medid
					};

					this.canOverrideUmd = false;
				}

				if (CRMUtil.isUndefined(type.log_avulsa) || type.log_avulsa === false) {
				    this.model.qtd_itens_despes_realzdo = undefined;
				    this.model.val_despes_realzdo = undefined;
				    this.model.qtd_itens_despes = undefined;
					this.model.val_despes_realzdo_unit = undefined;
				}
			}

			this.model.ttUnidadeMedida = umd;
		};

		this.save = function (isToContinue) {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave(),
				expense,
				fnAfterSave;

			if (!vo) { return; }

			fnAfterSave = function (item) {
				if (!item) { return; }
				CRMControl.afterSave(item, isToContinue);
			};

			if (CRMControl.notPersist && CRMControl.notPersist === true) {
				expense = {vo: vo, model: CRMControl.model};
				fnAfterSave(expense);
			} else {
				if (CRMControl.editMode === true) {
					factory.updateRecord(vo.num_id, vo, fnAfterSave);
				} else {
					factory.saveRecord(vo, fnAfterSave);
				}
			}
		};

		this.isInvalidForm = function () {
			var messages = [],
				type = this.model.ttTipo,
				umd = this.model.ttUnidadeMedida,
				isSeparate = false,
				isInvalidForm = false;

			if (CRMUtil.isUndefined(type) || CRMUtil.isUndefined(type.num_id)) {
				isInvalidForm = true;
				messages.push('l-type');
			} else {
				isSeparate = type.log_avulsa || false;
			}

			if (isSeparate !== true && (CRMUtil.isUndefined(umd) || CRMUtil.isUndefined(umd.num_id))) {
				isInvalidForm = true;
				messages.push('l-unit-of-measurement');
			}

			if (CRMUtil.isUndefined(this.model.dat_livre_1)) {
				isInvalidForm = true;
				messages.push('l-expense-date');
			}

			if (CRMUtil.isUndefined(this.model.val_despes_realzdo_unit) || this.model.val_despes_realzdo_unit <= 0) {
			    isInvalidForm = true;
			    messages.push('l-unit-value');
			}

			if (CRMUtil.isUndefined(this.model.val_despes_realzdo) || this.model.val_despes_realzdo <= 0) {
				isInvalidForm = true;
				messages.push('l-total-value');
			}

			if (CRMUtil.isUndefined(this.model.qtd_itens_despes_realzdo) || this.model.qtd_itens_despes_realzdo <= 0) {
				isInvalidForm = true;
				messages.push('l-quantity');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-expense', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {
			var modelToSave = {},
				model = this.model,
				parseDate;

			parseDate = function (datetime) {
				return new Date(datetime);
			};

			modelToSave.val_despes_realzdo = model.val_despes_realzdo || 0;
            modelToSave.val_livre_1 = model.val_despes_realzdo_unit || 0;
			modelToSave.qtd_itens_despes_realzdo = model.qtd_itens_despes_realzdo || 0;
			modelToSave.dsl_tip_despes = model.dsl_tip_despes;
			modelToSave.qtd_itens_despes = model.qtd_itens_despes || 0;
			modelToSave.val_despes_previs = model.val_despes_previs || 0;
			modelToSave.idi_status_despes = model.idi_status_despes || 2;
			modelToSave.num_id_campanha_acao = model.num_id_campanha_acao || 0;
			modelToSave.num_id_histor_acao = model.num_id_histor_acao || 0;
			modelToSave.dat_livre_1 = model.dat_livre_1;

			if (model.num_id && model.num_id > 0) {
				modelToSave.num_id = model.num_id;
			}

			if (CRMUtil.isDefined(model.ttTipo) && CRMUtil.isDefined(model.ttTipo.num_id)) {
				modelToSave.num_id_tip_despes = model.ttTipo.num_id || 0;
			} else {
				modelToSave.num_id_tip_despes = model.num_id_tip_despes || 0;
			}

			if (CRMUtil.isDefined(model.ttUnidadeMedida) && CRMUtil.isDefined(model.ttUnidadeMedida.num_id)) {
				modelToSave.num_id_umd = model.ttUnidadeMedida.num_id || 0;
			} else {
				modelToSave.num_id_umd = model.num_id_umd || 0;
			}

			return modelToSave;
		};

		this.afterSave = function (item, isToContinue) {
			var message,
				expenses,
				model = angular.copy(CRMControl.model);

			CRMControl.resultList = CRMControl.resultList || [];

			if (CRMUtil.isDefined(item)) {
				CRMControl.resultList.push(item);

				if (CRMControl.notPersist === true) {
					message = $rootScope.i18n('msg-save-related-expense', [$rootScope.i18n('l-expense', [], 'dts/crm'), model.ttTipo.nom_tip_despes], 'dts/crm');
				} else if (CRMControl.editMode === true) {
					message = $rootScope.i18n('msg-update-generic', [$rootScope.i18n('l-expense', [], 'dts/crm'), model.ttTipo.nom_tip_despes], 'dts/crm');
				} else {
					message = $rootScope.i18n('msg-save-generic', [$rootScope.i18n('l-expense', [], 'dts/crm'), model.ttTipo.nom_tip_despes], 'dts/crm');
				}

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('nav-expense', [], 'dts/crm'),
					detail: message
				});
			}

			if (isToContinue === true) {
				CRMControl.model = undefined;
				CRMControl.validadeParameterModel();

				CRMControl.model.num_id_histor_acao = model.num_id_histor_acao;
				CRMControl.model.idi_status_despes = model.idi_status_despes;
				CRMControl.model.num_id_campanha_acao = model.num_id_campanha_acao;

			} else if ($modalInstance) {
				if (CRMControl.notPersist !== true && CRMControl.resultList && CRMControl.resultList.length > 0) {
					$rootScope.$broadcast(CRMEvent.scopeSaveExpense, CRMControl.resultList);
				}

				$modalInstance.close(CRMControl.resultList);
			}
		};

		this.getAvailbleExpenses = function () {
			var campaignId = this.campaignId,
				actionId = this.actionId;

			CRMControl.types = [];

			factory.getAvailbleExpenses(campaignId, actionId, function (results) {
				if (results === undefined) { return; }

				CRMControl.types = results;
			});
		};

		this.getAllUnitMeasurement = function () {
			CRMControl.ttUnitMeasurement = [];

			factoryUnitMeasurement.getAll(function (results) {
				if (results === undefined) { return; }

				CRMControl.ttUnitMeasurement = results;
			});
		};

		this.loadPreferences = function (callback) {
			if (callback) { callback(); }
		};

		this.validadeParameterModel = function () {
			var period = CRMControl.period || {},
				today = new Date();

			CRMControl.model = CRMControl.model || {};
			CRMControl.editMode = CRMUtil.isDefined(CRMControl.model.num_id) ? true : false;

			if (CRMControl.editMode === false) {
				CRMControl.model.dat_livre_1 = today.getTime();
				CRMControl.model.num_id_histor_acao = CRMControl.model.num_id_histor_acao || 0;
				CRMControl.model.idi_status_despes = CRMControl.model.idi_status_despes || 1;

				if (CRMUtil.isDefined(period.startDate) && (CRMControl.model.dat_livre_1 < period.startDate)) {
					CRMControl.model.dat_livre_1 = period.startDate;
				}

				if (CRMUtil.isDefined(period.endDate) && (CRMControl.model.dat_livre_1 > period.endDate)) {
					CRMControl.model.dat_livre_1 = period.endDate;
				}
			}
		};
        
        this.onChangeQuantityUnitValue = function () {
            if (CRMControl.model && CRMControl.model.qtd_itens_despes_realzdo && CRMControl.model.val_despes_realzdo_unit) {
                CRMControl.model.val_despes_realzdo = CRMControl.model.qtd_itens_despes_realzdo * CRMControl.model.val_despes_realzdo_unit;
            }
        };
        
        this.onChangeTotalValue = function () {
            if (CRMControl.model && CRMControl.model.qtd_itens_despes_realzdo && CRMControl.model.val_despes_realzdo) {
                CRMControl.model.val_despes_realzdo_unit = CRMControl.model.val_despes_realzdo / CRMControl.model.qtd_itens_despes_realzdo;
            }
        };

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		CRMControl.model = parameters.expense ? angular.copy(parameters.expense) : {};
		CRMControl.campaignId = parameters.campaignId;
		CRMControl.actionId = parameters.actionId;
		CRMControl.period = parameters.period || {};
		CRMControl.notPersist = parameters.notPersist;

		this.init = function () {
			//this.loadPreferences(function () {
			CRMControl.validadeParameterModel();
			//});

			this.getAvailbleExpenses();
			this.getAllUnitMeasurement();
		};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControl = undefined;
		});

	};

	controllerExpenseEdit.$inject = ['$rootScope', '$scope', 'parameters', 'crm.legend', '$modalInstance',
										  'crm.crm_acao_tip_despes.factory', 'TOTVSEvent', 'crm.helper',
										  'crm.crm_unid_medid.factory'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.expense.modal.edit', modalExpenseEdit);

	index.register.controller('crm.expense.edit.control', controllerExpenseEdit);

});
