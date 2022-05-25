/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1083.js',
	'/dts/crm/html/attribute/attribute-item-services.edit.js'
], function (index) {

	'use strict';

	var modalAttributeEdit,
		controllerAttributeEdit;

	// *************************************************************************************
	// *** MODAL EDIT
	// *************************************************************************************

	modalAttributeEdit = function ($modal) {
		this.open = function (params) {
			var instance = $modal.open({
				templateUrl: '/dts/crm/html/attribute/attribute.edit.html',
				controller: 'crm.attribute.edit.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				resolve: { parameters: function () { return params; } }
			});

			/*
			instance.rendered.then(function () {
				$('div.modal-body').css('height', ((window.innerHeight * 0.8) - 60));
			});
			*/

			return instance.result;
		};
	};

	modalAttributeEdit.$inject = ['$modal'];

	// *************************************************************************************
	// *** CONTROLLER EDIT
	// *************************************************************************************

	controllerAttributeEdit = function ($rootScope, $scope, $modalInstance, parameters, TOTVSEvent,
										 helper, factory, attributeHelper, modalAttributeItem, $timeout) {

		// *********************************************************************************
		// *** Variables
		// *********************************************************************************

		var CRMControl = this;

		this.model = undefined;
		this.editMode = false;
		this.resultList = undefined;

		this.openItens = false;

		this.listOfProcess = angular.copy(attributeHelper.process);
		this.listOfTypes = angular.copy(attributeHelper.attributeTypes);
		this.listOfAccountTypes = angular.copy(attributeHelper.accountTypes);
		this.listOfPersonTypes = angular.copy(attributeHelper.personTypes);
		this.listOfSituations = angular.copy(attributeHelper.situation);

		this.listOfDecimalPrecision = [{value: 1},
									   {value: 2},
									   {value: 3},
									   {value: 4},
									   {value: 5},
									   {value: 6},
									   {value: 7},
									   {value: 8},
									   {value: 9}];

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.save = function (isToContinue) {

			if (CRMControl.isInvalidForm()) { return; }

			var vo = CRMControl.convertToSave(),
				message,
				fnAfterSave;

			if (!vo) { return; }

			fnAfterSave = function (item) {
				if (!item) { return; }
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-custom-field', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-custom-field', [], 'dts/crm'),
						item.nom_atrib
					], 'dts/crm')
				});
				CRMControl.close(item, isToContinue);
			};
			if (CRMControl.editMode === true && vo.ttAtributo) {
				message = 'msg-update-generic';
				factory.updateRecord(vo.ttAtributo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.saveRecord(vo, fnAfterSave);
			}
		};

		this.isInvalidForm = function () {

			var messages = [],
				msg,
				dslDefault,
				addErrorMsg,
				validatePropertyExcedMaxlength,
				isInvalidForm = false,
				model = CRMControl.model,
				properties = model.properties || {},
				dDefaultValue,
				iMaxlength,
				iPrecisionDecimal;

			validatePropertyExcedMaxlength = function (char1) {
				if (!char1) { char1 = ''; }

				if (char1.length > iMaxlength) {
					return 1;
				} else if (char1.length < iMaxlength) {
					return -1;
				} else {
					return 0;
				}
			};

			addErrorMsg = function (id, param1, param2) {
				isInvalidForm = true;

				switch (id) {
				case 1:
					msg = $rootScope.i18n('msg-custom-fields-not-exceed-the-size-maximum', [param1, param2], 'dts/crm');
					break;
				case 2:
					msg = $rootScope.i18n('msg-custom-fields-conflicting-parametrization-maxlength', [param1], 'dts/crm');
					break;
				case 3:
					msg = $rootScope.i18n('msg-custom-fields-conflicting-parametrization-mask', [param1], 'dts/crm');
					break;
				case 4:
					msg = $rootScope.i18n('msg-custom-fields-multivalued-more-than-one-item', [], 'dts/crm');
					break;
				case 5:
					msg = $rootScope.i18n('msg-field-can-not-exceed-limit-positions', [param1, param2], 'dts/crm');
					break;
				}
			};

			iMaxlength = properties.num_max_length ? parseInt(properties.num_max_length, 10) : undefined;
			dDefaultValue = properties.val_default ? parseInt(properties.val_default, 10) : undefined;
			iPrecisionDecimal = (properties.ttDecimalPrecision && properties.ttDecimalPrecision.value) ? properties.ttDecimalPrecision.value : undefined;

			if (!model.nom_atrib || model.nom_atrib.trim().length === 0) {
				isInvalidForm = true;
				messages.push('l-name');
			}

			if (!model.ttProcess || model.ttProcess.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-process');
			}
			/* else if (model.ttProcess.num_id === 1) {
				if (!model.ttAccountType || model.ttAccountType.num_id < 0) {
					isInvalidForm = true;
					messages.push('l-type-account');
				} else if (!model.ttPersonType || model.ttPersonType.num_id < 0) {
					isInvalidForm = true;
					messages.push('l-nature');
				}
			} */

			if (!model.ttType || model.ttType.num_id < 1) {
				isInvalidForm = true;
				messages.push('l-type');
			}

			if (CRMControl.editMode === true) {
				if (!model.idi_sit || model.idi_sit < 1) {
					isInvalidForm = true;
					messages.push('l-Situation');
				}
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-custom-field', messages);
			} else {

				if (model.nom_atrib.trim().length > 40) {
					addErrorMsg(5, $rootScope.i18n('l-name', [], 'dts/crm'), 40);
				} else if (properties.dsl_obs && properties.dsl_obs.length > 1000) {
					addErrorMsg(5, $rootScope.i18n('l-observation', [], 'dts/crm'), 1000);
				} else if (iMaxlength && iMaxlength > 0) {

					if (iMaxlength.toString().length > 5) {
						addErrorMsg(5, $rootScope.i18n('l-maxlength', [], 'dts/crm'), 5);
					} else {

						if (validatePropertyExcedMaxlength(properties.nom_mask) === 1) {
							addErrorMsg(2, $rootScope.i18n('l-mask', [], 'dts/crm'));
						} else if (model.ttType.num_id === 8 || model.ttType.num_id === 9) {

							if (model.ttType.num_id === 8 && iMaxlength > 9) {
								addErrorMsg(1, $rootScope.i18n('l-integer', [], 'dts/crm'), '9');
							} else if (model.ttType.num_id === 9) {
								if (iMaxlength > 13) {
									addErrorMsg(1, $rootScope.i18n('l-decimal', [], 'dts/crm'), '13');
								} else if (iPrecisionDecimal && iPrecisionDecimal > 0) {
									if (iPrecisionDecimal >= iMaxlength) {
										addErrorMsg(2, $rootScope.i18n('l-decimal-precision', [], 'dts/crm'));
									} else if (properties.nom_mask && iPrecisionDecimal >= properties.nom_mask.length) {
										addErrorMsg(3, $rootScope.i18n('l-decimal-precision', [], 'dts/crm'));
									}
								}
							}

							if (dDefaultValue && dDefaultValue > 0) {
								dslDefault = dDefaultValue.toString();
								dslDefault = dslDefault.replace(",", "");
								dslDefault = dslDefault.replace(".", "");

								if (validatePropertyExcedMaxlength(dslDefault) === 1) {
									addErrorMsg(2, $rootScope.i18n('l-default', [], 'dts/crm'));
								} else if (properties.nom_mask && dslDefault.length > properties.nom_mask.length) {
									addErrorMsg(3, $rootScope.i18n('l-default', [], 'dts/crm'));
								}
							}

						}

						if (model.ttType.num_id === 1) {
							if (properties.dsl_default && properties.dsl_default.length > 0) {
								if (properties.dsl_default.length > iMaxlength) {
									addErrorMsg(2, $rootScope.i18n('l-default', [], 'dts/crm'));
								} else if (properties.nom_mask && properties.dsl_default.length > properties.nom_mask.length) {
									addErrorMsg(3, $rootScope.i18n('l-default', [], 'dts/crm'));
								} else if (iMaxlength > 15000) {
									addErrorMsg(1, $rootScope.i18n('l-text', [], 'dts/crm'), '15.000');
								}
							}
						}

					} // exceed maxlength
				}

				if ((!msg || msg.length < 1) && (model.ttType.num_id >= 2 && model.ttType.num_id <= 5)) {
					// entao ao menos 1 itens deve ser adicionado
					if (!properties.itens || properties.itens.length < 1) {
						addErrorMsg(4);
					}
				}

				if (isInvalidForm) {
					$rootScope.$broadcast(TOTVSEvent.showNotification, {
						type:   'error',
						title:  $rootScope.i18n('l-custom-field', [], 'dts/crm'),
						detail: $rootScope.i18n(msg, [], 'dts/crm')
					});
				}
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {
			var vo = {ttAtributo: {}, dsl_obs: {}},
				model = CRMControl.model,
				properties = model.properties ? angular.copy(model.properties) : {};

			vo.ttAtributo.num_id = model.num_id;
			vo.ttAtributo.nom_atrib = model.nom_atrib;
			vo.ttAtributo.idi_sit = 1; //default
			vo.ttAtributo.idi_process = 1; //default
			vo.ttAtributo.idi_tip_atrib = 1; //default
			vo.ttAtributo.idi_tip_cta = 0; //default
			vo.ttAtributo.idi_tip_pessoa = 0; //default

			if (CRMUtil.isDefined(model.ttProcess)) {
				vo.ttAtributo.idi_process = model.ttProcess.num_id || model.idi_process;
			}

			/*
			if (CRMUtil.isDefined(model.ttAccountType)) {
				vo.ttAtributo.idi_tip_cta = model.ttAccountType.num_id || model.idi_tip_cta;
			}

			if (CRMUtil.isDefined(model.ttPersonType)) {
				vo.ttAtributo.idi_tip_pessoa = model.ttPersonType.num_id || model.idi_tip_pessoa;
			}
			*/

			if (CRMUtil.isDefined(model.ttType)) {
				vo.ttAtributo.idi_tip_atrib = model.ttType.num_id || model.idi_tip_atrib;
			}

			if (CRMControl.editMode === true) {
				vo.ttAtributo.idi_sit = this.model.idi_sit || vo.ttAtributo.idi_sit;
			}

			if (vo.ttAtributo.idi_tip_atrib < 2 && vo.ttAtributo.idi_tip_atrib > 5) {
				properties.itens = undefined;
			}

			if (vo.ttAtributo.idi_tip_atrib === 1 && (properties.num_max_length === undefined || properties.num_max_length === '')) {
				properties.num_max_length = 1000;
			}

			vo.dsl_obs = properties; // JSON.stringify(properties);

			return vo;
		};

		this.onChangeDefaultOption = function (notClear) {
			var property = CRMControl.model.properties;

			if (notClear !== true) {
				property.dt_default = undefined;
				property.dsl_default = undefined;
				property.val_default = undefined;
				property.hr_default = undefined;

				if ((this.listOfDefaults && this.listOfDefaults.length > 0) && (!property.ttDefaultOption || !property.ttDefaultOption.num_id)) {
					property.ttDefaultOption = this.listOfDefaults[0];
				}
			}

		};

		this.onChangeProcess = function () {
			if (!this.model.ttProcess || this.model.ttProcess.num_id !== 1) {
				this.model.idi_tip_cta = 0;
				this.model.idi_tip_pessoa = 0;
				this.model.ttAccountType = undefined;
				this.model.ttPersonType = undefined;
			}
		};

		this.onChangeType = function (notClearFields) {
			this.allowsMaxLength = false;
			this.allowsMask = false;
			this.allowsNegativeValue = false;
			this.allowsMaxDecimal = false;
			this.model.ttDefaultOption = undefined;

			if (notClearFields !== true) {
				this.model.num_max_length = undefined;
				this.model.num_max_decimal = undefined;
				this.listOfDefaults = undefined;
			}

			if (!this.model.ttType || CRMUtil.isUndefined(this.model.ttType.num_id)) { return; }

			var typeId = this.model.ttType.num_id;

			switch (typeId) {
			case 1: /* texto */
				this.allowsMaxLength = true;
				this.allowsMask = true;
				this.listOfDefaults = undefined;
				this.listOfDefaults = [{num_id: 1, name: $rootScope.i18n('l-inform-value', [], 'dts/crm')}];
				break;
			case 6:
				this.listOfDefaults = [
					{num_id: 1, name: $rootScope.i18n('l-inform-value', [], 'dts/crm')},
					{num_id: 2, name: $rootScope.i18n('l-get-current-value-at-the-time', [], 'dts/crm')}
				];
				break;
			case 7:
				this.listOfDefaults = [
					{num_id: 1, name: $rootScope.i18n('l-inform-value', [], 'dts/crm')},
					{num_id: 2, name: $rootScope.i18n('l-get-current-value-at-the-time', [], 'dts/crm')}
				];
				break;
			case 8: /* inteiro */
				this.allowsMaxLength = true;
				this.allowsMask = false;
				this.allowsNegativeValue = false; // Componente THF N PERMITE NEGATIVO
				this.listOfDefaults = [{num_id: 1, name: $rootScope.i18n('l-inform-value', [], 'dts/crm')}];
				break;
			case 9: /* decimal */
				this.allowsMaxLength = true;
				this.allowsMask = false;
				this.allowsNegativeValue = false; // Componente THF N PERMITE NEGATIVO
				this.allowsMaxDecimal = true;
				this.listOfDefaults = [{num_id: 1, name: $rootScope.i18n('l-inform-value', [], 'dts/crm')}];
				break;
			default:
				this.allowsMaxLength = false;
				this.allowsMask = false;
				this.allowsNegativeValue = false;
				this.listOfDefaults = undefined;
			}

			this.onChangeDefaultOption(notClearFields);
		};

		this.onChangeMask = function () {

			CRMControl.model.properties.dsl_default = '';

			$timeout.cancel(CRMControl.promisse);
			$timeout.cancel(CRMControl.promisse2);

			CRMControl.promisse = $timeout(function () {
				CRMControl.controlMask = true;
			}, 1000);

			CRMControl.promisse2 = $timeout(function () {
				CRMControl.controlMask = false;
			}, 1001);

		};

		this.addItem = function (list, isFastInclusion) {

			var i, j, invalid, addInList, msg;

			CRMControl.model.properties.itens = CRMControl.model.properties.itens || [];

			addInList = function (value) {
				invalid = false;

				if (value === undefined || value.trim().length === 0) {
					invalid = true;
				} else if (value.trim().length > 40) {
					invalid = true;
					msg = $rootScope.i18n('msg-field-can-not-exceed-limit-positions', [$rootScope.i18n('l-item', [], 'dts/crm'), 40], 'dts/crm');
				} else {
					for (i = 0; i < CRMControl.model.properties.itens.length; i++) {

						if (value === CRMControl.model.properties.itens[i].name) {

							if (isFastInclusion === true) {
								msg = $rootScope.i18n('msg-duplicate-itens-disregarded', [], 'dts/crm');
							} else {
								msg = $rootScope.i18n('msg-item-already-exists', [], 'dts/crm');
							}

							invalid = true;
							break;
						}
					}
				}

				if (!invalid) {
					if (isFastInclusion === undefined || isFastInclusion === false) {
						CRMControl.model.nom_item = undefined;
					}

					CRMControl.model.properties.itens.push({
						name: value,
						log_default: false
					});
				}
			};

			if (isFastInclusion === true) {
				for (j = 0; j < list.length; j++) {
					if (CRMUtil.isDefined(list[j].name)) {
						addInList(list[j].name);
					}
				}
			} else {
				addInList(CRMControl.model.nom_item);
			}

			if (msg !== undefined && msg.length > 0) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'warning',
					title: $rootScope.i18n('l-custom-field', [], 'dts/crm'),
					detail: msg
				});
			}
		};

		this.removeItem = function (index, isConfirmDelete) {
			if (index < 0 || index >= CRMControl.model.properties.itens.length) { return; }

			var removeFunc = function (i) {
				CRMControl.model.properties.itens.splice(i, 1);

				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'success',
					title: $rootScope.i18n('l-custom-field', [], 'dts/crm'),
					detail: $rootScope.i18n('msg-record-success-removed', [], 'dts/crm')
				});
			};

			if (isConfirmDelete) {
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-delete',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: $rootScope.i18n('msg-confirm-delete-item', [
						CRMControl.model.properties.itens[index].name
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
			var i;

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: $rootScope.i18n('l-confirm-delete', [], 'dts/crm'),
				cancelLabel: $rootScope.i18n('btn-cancel', [], 'dts/crm'),
				confirmLabel: $rootScope.i18n('btn-confirm', [], 'dts/crm'),
				text: $rootScope.i18n('msg-confirm-delete-all-itens', [], 'dts/crm'),
				callback: function (isPositiveResult) {
					if (!isPositiveResult) { return; }
					CRMControl.model.properties.itens = undefined;
				}
			});
		};

		this.setAsDefaultItem = function (item) {
			var i, itens = CRMControl.model.properties.itens;

			if (!itens) { return; }

			for (i = 0; i < itens.length; i++) {
				itens[i].log_default = false;
			}

			item.log_default = true;
		};

		this.openAddItens = function () {
			var model = CRMControl.model;

			modalAttributeItem.open({
				itens: model.properties.itens
			}).then(function (result) {
				if (result) {
					CRMControl.addItem(result, true);
				}
			});
		};

		this.close = function (item, isToContinue) {

			CRMControl.resultList = CRMControl.resultList || [];

			if (CRMUtil.isDefined(item)) {
				CRMControl.resultList.push(item);
			}

			if (isToContinue === true) {
				CRMControl.model = undefined;
				CRMControl.validadeParameterModel();
			} else if ($modalInstance) {
				$modalInstance.close(CRMControl.resultList);
			}
		};

		this.validadeParameterModel = function () {
			var i, obj;

			this.model = this.model || {};
			this.model.properties = {};
			this.editMode = (this.model.num_id > 0);

			if (this.editMode === true) {
				/* posiciona processo */
				for (i = 0; i < this.listOfProcess.length; i++) {
					if (this.model.idi_process === this.listOfProcess[i].num_id) {
						this.model.ttProcess = this.listOfProcess[i];
					}
				}

				/* posiciona tipo do atributo */
				for (i = 0; i < this.listOfTypes.length; i++) {
					if (this.model.idi_tip_atrib === this.listOfTypes[i].num_id) {
						this.model.ttType = this.listOfTypes[i];
					}
				}

				/* posiciona tipo de conta */
				if (this.model.idi_tip_cta && this.model.idi_tip_cta > 0) {
					for (i = 0; i < this.listOfAccountTypes.length; i++) {
						if (this.model.idi_tip_cta === this.listOfAccountTypes[i].num_id) {
							this.model.ttAccountType = this.listOfAccountTypes[i];
						}
					}

					/* posiciona tipo de conta */
					for (i = 0; i < this.listOfPersonTypes.length; i++) {
						if (this.model.idi_tip_pessoa === this.listOfPersonTypes[i].num_id) {
							this.model.ttPersonType = this.listOfPersonTypes[i];
						}
					}
				}

				this.onChangeType(true);

				if (this.model.dsl_atrib && this.model.dsl_atrib.trim().length > 1) {
					obj = JSON.parse(this.model.dsl_atrib);
					this.model.properties = obj;
				}

			}
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.attribute ? angular.copy(parameters.attribute) : {};

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

	controllerAttributeEdit.$inject = [
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'TOTVSEvent', 'crm.helper',
		'crm.crm_atrib.factory', 'crm.attribute.helper', 'crm.attribute-item.modal.edit', '$timeout'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.attribute.modal.edit', modalAttributeEdit);
	index.register.controller('crm.attribute.edit.control', controllerAttributeEdit);
});
