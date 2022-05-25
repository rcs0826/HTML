/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/crm-components.js',
	'/dts/crm/js/api/fchcrm1051.js',
	'/dts/crm/js/api/fchcrm1052.js',
	'/dts/crm/js/zoom/crm_usuar.js',
	'/dts/crm/js/zoom/crm_propried.js',
	'/dts/crm/html/user/user-services.js',
	'/dts/crm/html/report/report-services.parameter-attribute.js'
], function (index) {

	'use strict';

	var modalReportParameter,
		controllerReportParameter;
	// *************************************************************************************
	// *** MODAL REPORT PARAMETER
	// *************************************************************************************

	modalReportParameter = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/report/report.parameter.html',
				controller: 'crm.report.parameter.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});
			return instance.result;
		};
	};

	modalReportParameter.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER REPORT PARAMETER
	// *************************************************************************************

	controllerReportParameter = function ($rootScope, $scope, $modalInstance, TOTVSEvent,
										   parameters, helper, reportFactory, reportHelper,
										   propertiesFactory, modalAttribute) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControlReportParameter = this;

		this.model    = undefined;
		this.idReport = undefined;
		this.editMode = false;

		this.openAttributes = false;

		this.types      = reportHelper.parameterTypes;
		this.properties = [];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function () {

			if (this.isInvalidForm()) { return; }

			var vo = this.convertToSave(),
				idReport = this.idReport;

			if (!vo) { return; }

			if (this.editMode) {
				reportFactory.updateParameter(vo.num_id, idReport, vo, CRMControlReportParameter.afterSave);
			} else {
				reportFactory.addParameter(idReport, vo, CRMControlReportParameter.afterSave);
			}
		};

		this.cancel = function () {
			$modalInstance.dismiss('cancel');
		};

		this.validadeParameterModel = function () {

			var reportParameter = this.model || {};

			if (!this.model.attribute) {
				this.model.attribute = {};
			}

			this.editMode = (reportParameter.num_id > 0);

			if (reportParameter.idi_tip_campo === 3) {
				reportParameter.ttProperty = {
					num_id: reportParameter.num_id_propried,
					nom_tab_crm: reportParameter.nom_tab_crm,
					nom_field_label: reportParameter.nom_field_label
				};
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				msg,
				model = this.model,
				isInvalidForm = false;

			if (!model.ttTipo) {
				isInvalidForm = true;
				messages.push('l-type');
			} else if (model.ttTipo.num_id === 3 && !model.ttProperty) {
				isInvalidForm = true;
				messages.push('l-zoom');
			}

			if (!model.nom_param || model.nom_param.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (!model.nom_apel_campo || model.nom_apel_campo.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-label');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-parameter', messages);
			} else {
				if (model.ttTipo.num_id === 6) {
					if (!model.ttParametroAtributo || model.ttParametroAtributo.length < 1) {
						isInvalidForm = true;
						msg = $rootScope.i18n('msg-report-parameter-require-one-attribute', [], 'dts/crm');
					}
				}

				if (msg && msg.length > 0) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('l-report', [], 'dts/crm'),
						detail: $rootScope.i18n(msg, [], 'dts/crm')
					});
				}

			}

			return isInvalidForm;
		};

		this.convertToSave = function () {

			var vo = {},
				model = this.model;

			if (model.num_id && model.num_id > 0) {
				vo.num_id = model.num_id;
			}

			vo.num_id_relat_web = this.idReport;
			vo.nom_param        = model.nom_param;
			vo.nom_apel_campo   = model.nom_apel_campo;
			vo.log_livre_1      = model.log_livre_1;
			vo.ttRelatorioParametroAtributoVO = [];
			vo.ttRemoverAtributo = [];

			if (model.ttTipo) {
				vo.idi_tip_campo = model.ttTipo.num_id;

				if (vo.idi_tip_campo === 6) {
					vo.ttRelatorioParametroAtributoVO = model.ttParametroAtributo || [];
					vo.ttRemoverAtributo = model.ttRemoverAtributo || [];
				}
			}

			if (model.ttProperty) {
				vo.num_id_propried = model.ttProperty.num_id;
			}

			return vo;
		};

		this.afterSave = function (reportParameter) {

			if (!reportParameter) { return; }

			var detailMsg = CRMControlReportParameter.editMode ? 'msg-update-related-generic' : 'msg-save-related-generic';

			$rootScope.$broadcast(TOTVSEvent.showNotification, {
				type: 'success',
				title: $rootScope.i18n('l-report', [], 'dts/crm'),
				detail: $rootScope.i18n(detailMsg, [
					$rootScope.i18n('l-parameter', [], 'dts/crm'),
					reportParameter.nom_param,
					$rootScope.i18n('l-report', [], 'dts/crm')
				], 'dts/crm')
			});

			$modalInstance.close(reportParameter);
		};

		this.getProperties = function (value) {
			if (!value || value === '') { return []; }
			var filter = { property: 'nom_tab_crm', value: helper.parseStrictValue(value) };
			propertiesFactory.typeahead(filter, undefined, function (result) {
				CRMControlReportParameter.properties = result;
			});
		};

		this.setAsDefaultAttribute = function (attribute) {
			var i, attributes = CRMControlReportParameter.model.ttParametroAtributo;

			if (!attributes) { return; }

			for (i = 0; i < attributes.length; i++) {
				attributes[i].log_padr = false;
			}

			attribute.log_padr = true;
		};

		this.addAttributes = function (list, isFastInclusion) {

			var i, j, invalid, addInList, msg, model = CRMControlReportParameter.model;

			model.ttParametroAtributo = model.ttParametroAtributo || [];

			addInList = function (value) {
				invalid = false;

				if (CRMUtil.isUndefined(value.nom_atrib) || value.nom_atrib.trim().length === 0) {
					invalid = true;
				} else if (value.nom_atrib.trim().length > 40) {
					invalid = true;
					msg = $rootScope.i18n('msg-field-can-not-exceed-limit-positions', [$rootScope.i18n('l-attribute', [], 'dts/crm'), 40], 'dts/crm');
				} else {
					if (CRMUtil.isUndefined(value.cod_atrib) || value.cod_atrib.trim().length === 0) {
						value.cod_atrib = value.nom_atrib;
					}

					for (i = 0; i < model.ttParametroAtributo.length; i++) {

						if (value.nom_atrib === model.ttParametroAtributo[i].nom_atrib) {

							if (isFastInclusion === true) {
								msg = $rootScope.i18n('msg-duplicate-attributes-disregarded', [], 'dts/crm');
							} else {
								msg = $rootScope.i18n('msg-attribute-already-exists', [], 'dts/crm');
							}

							invalid = true;
							break;
						} else if (value.cod_atrib === model.ttParametroAtributo[i].cod_atrib) {

							if (isFastInclusion === true) {
								msg = $rootScope.i18n('msg-attributes-duplicate-values-disregarded', [], 'dts/crm');
							} else {
								msg = $rootScope.i18n('msg-duplicate-attribute-value', [], 'dts/crm');
							}

							invalid = true;
							break;
						}
					}
				}

				if (!invalid) {
					if (isFastInclusion === undefined || isFastInclusion === false) {
						model.attribute = {};
					}

					model.ttParametroAtributo.push({
						nom_atrib: value.nom_atrib,
						log_padr: false,
						num_id_param_relat_web: model.num_id,
						//num_order,
						cod_atrib: value.cod_atrib
					});
				}
			};

			if (isFastInclusion === true) {
				for (j = 0; j < list.length; j++) {
					if (CRMUtil.isDefined(list[j])) {
						addInList(list[j]);
					}
				}
			} else {
				if (CRMUtil.isDefined(list)) {
					addInList(model.attribute);
				}
			}

			if (CRMUtil.isDefined(msg) && msg.length > 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'warning',
					title: $rootScope.i18n('l-attribute', [], 'dts/crm'),
					detail: msg
				});
			}
		};

		this.removeAttribute = function (index, isConfirmDelete) {
			var removeFunc, model = CRMControlReportParameter.model;

			if (index < 0 || index >= model.ttParametroAtributo.length) { return; }

			removeFunc = function (i) {
				if (!model.ttRemoverAtributo) {
					model.ttRemoverAtributo = [];
				}

				if (model.ttParametroAtributo[i].num_id > 0) {
					model.ttRemoverAtributo.push(angular.copy(model.ttParametroAtributo[i]));
				}

				model.ttParametroAtributo.splice(i, 1);

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-attribute', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
				});
			};

			if (isConfirmDelete) {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-delete',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n('msg-confirm-delete-item', [
						model.ttParametroAtributo[index].nom_atrib
					], 'dts/crm'),
					callback: function (isPositiveResult) {
						if (!isPositiveResult) { return; }
						removeFunc(index);
					}
				});
			} else {
				removeFunc(index);
			}
		};

		this.removeAllItens = function () {
			var i, addRemoveList, model = CRMControlReportParameter.model;

			addRemoveList = function (list) {
				if (!model.ttRemoverAtributo) {
					model.ttRemoverAtributo = [];
				}

				for (i = 0; i < list.length; i++) {
					if (CRMUtil.isDefined(list[i].num_id) && list[i].num_id > 0) {
						model.ttRemoverAtributo.push(angular.copy(list[i]));
					}
				}
			};

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete-all-attributes', [], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (!isPositiveResult) { return; }
					addRemoveList(model.ttParametroAtributo);
					model.ttParametroAtributo = undefined;
				}
			});
		};

		this.openAddAttributes = function () {
			var model = CRMControlReportParameter.model;

			modalAttribute.open({
				attributes: model.ttParametroAtributo
			}).then(function (result) {
				if (result) {
					CRMControlReportParameter.addAttributes(result, true);
				}
			});
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		this.model    = parameters.parameter ? angular.copy(parameters.parameter) : {};
		this.idReport = parameters.idReport  ? angular.copy(parameters.idReport)  : undefined;

		this.validadeParameterModel();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlReportParameter = undefined;
		});

		$scope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
			if ($modalInstance) { $modalInstance.dismiss('cancel'); }
		});
	};

	controllerReportParameter.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'TOTVSEvent', 'parameters', 'crm.helper',
		'crm.crm_relat_web.factory', 'crm.report.helper', 'crm.crm_propried.factory',
		'crm.parameter-attribute.modal.edit'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.report.modal.parameter', modalReportParameter);
	index.register.controller('crm.report.parameter.control', controllerReportParameter);

});
