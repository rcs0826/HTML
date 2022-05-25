/*global $, index, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1068.js',
	'/dts/crm/html/script/page/question/attribute/attribute-services.edit.js'
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
				templateUrl: '/dts/crm/html/script/page/question/question.edit.html',
				controller: 'crm.script-page-question.edit.control as controller',
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

	controller = function ($rootScope, $scope, $modalInstance, parameters, helper, legend,
							TOTVSEvent, factory, scriptHelper, modalScriptQuestionAttributeEdit) {

		var CRMControl = this;

		this.model = undefined;
		this.resultList = undefined;
		this.page = undefined;
		this.sequence = undefined;
		this.attribute = undefined;

		this.types = angular.copy(scriptHelper.questionTypes);

		this.editMode = false;

		this.isPortal =  typeof (APP_BASE_URL) !== "undefined" ? (APP_BASE_URL.indexOf('/portal/') >= 0) : false;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.validadeParameterModel = function () {

			var i, customTypes = [], model = this.model || {};

			this.editMode = (model.num_id > 0);

			if (CRMControl.editMode) {

				for (i = 0; i < CRMControl.types.length; i++) {
					if (!CRMControl.disabledEditionTypes(CRMControl.types[i].num_id)) {
						customTypes.push(CRMControl.types[i]);
					}
				}

				CRMControl.types = customTypes;
			}

			scriptHelper.parseScriptQuestType(model);
		};

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
					title: $rootScope.i18n('nav-script', [], 'dts/crm'),
					detail: $rootScope.i18n(message, [
						$rootScope.i18n('l-question', [], 'dts/crm'), item.nom_quest
					], 'dts/crm')
				});

				item.ttRemoveAttr = vo.ttRemoveAttr;

				CRMControl.close(item, isToContinue);
			};

			if (CRMControl.editMode === true) {
				message = 'msg-update-generic';
				factory.updateQuestion(CRMControl.page, vo.num_id, vo, fnAfterSave);
			} else {
				message = 'msg-save-generic';
				factory.saveQuestion(CRMControl.page, vo, fnAfterSave);
			}
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

		this.cancel = function () {
			/*
			var i, ttAtrib = [];

			CRMControl.resultList = CRMControl.resultList || [];

			if (CRMControl.model.ttQuestionarioQuestaoAtributo && CRMControl.model.ttQuestionarioQuestaoAtributo.length > 0) {

				for (i = 0; i < CRMControl.model.ttQuestionarioQuestaoAtributo.length; i++) {
					if (CRMControl.model.ttQuestionarioQuestaoAtributo[i].num_id) {
						ttAtrib.push(CRMControl.model.ttQuestionarioQuestaoAtributo[i]);
					}
				}
			}

			CRMControl.model.ttQuestionarioQuestaoAtributo = ttAtrib;
			CRMControl.resultList.push(CRMControl.model);

			$modalInstance.close(CRMControl.resultList);
			*/

			this.close();
		};

		this.isInvalidForm = function () {

			var i,
				messages = [],
				isInvalidForm = false,
				model = CRMControl.model || {},
				countMatrix;

			if (CRMUtil.isDefined(model.ttTipo) && model.ttTipo.num_id > 0) {

				if (model.ttTipo.num_id === 9) {
					if (model.dsl_quest === undefined || model.dsl_quest.trim().length === 0) {
						isInvalidForm = true;
						messages.push('l-description');
					}
				} else if (model.nom_quest === undefined || model.nom_quest.trim().length === 0) {
					isInvalidForm = true;
					messages.push('l-question');

				}

				if (model.ttTipo.num_id === 8 || model.ttTipo.num_id === 12 || model.ttTipo.num_id === 13 || model.ttTipo.num_id === 14) {
					countMatrix = {
						countCol: 0,
						countRow: 0
					};

					if (model.ttQuestionarioQuestaoAtributo) {
						for (i = 0; i < model.ttQuestionarioQuestaoAtributo.length; i++) {
							if (model.ttQuestionarioQuestaoAtributo[i].log_atrib === true) {
								countMatrix.countCol++;
							} else {
								countMatrix.countRow++;
							}
						}
					}

					if (countMatrix.countCol < 1 || countMatrix.countRow < 1) {

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							title: $rootScope.i18n('l-script', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-matrix-attribute-require-more-than-one', [], 'dts/crm')
						});
						isInvalidForm = true;
					}

				} else if (model.ttTipo.is_multi_value === true) {
					if (!angular.isArray(model.ttQuestionarioQuestaoAtributo)
							|| model.ttQuestionarioQuestaoAtributo.length < 2) {
						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							title: $rootScope.i18n('l-script', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-attribute-require-more-than-two', [], 'dts/crm')
						});
						isInvalidForm = true;
					}
				}
			} else {
				isInvalidForm = true;
				messages.push('l-type');
			}

			if (isInvalidForm && messages.length > 0) {
				helper.showInvalidFormMessage('l-script', messages);
			}

			return isInvalidForm;
		};

		this.convertToSave = function () {
			var vo = {},
				model = CRMControl.model;

			vo.num_id = model.num_id;
			vo.num_id_pag = CRMControl.page;
			vo.num_quest = model.num_quest || this.sequence;

			if (model.ttTipo) {
				vo.idi_tip_quest = model.ttTipo.num_id;
			}

			vo.nom_quest = model.nom_quest;
			vo.dsl_quest = model.dsl_quest;
			vo.val_peso = model.val_peso;
			vo.log_obrig = model.log_obrig;

			vo.ttQuestionarioQuestaoAtributo = model.ttQuestionarioQuestaoAtributo;
			vo.ttRemoveAttr = CRMControl.model.ttRemoveAttr || [];

			return vo;
		};

		this.addAttribute = function (list, isFastInclusion) {

			var i, j, attribute, model = CRMControl.model, invalid, addInList, isAddOther, msg;

			model.ttQuestionarioQuestaoAtributo = model.ttQuestionarioQuestaoAtributo || [];

			addInList = function (value) {
				invalid = false;

				if (value === undefined || value.trim().length === 0) {
					invalid = true;
				}

				for (i = 0; i < model.ttQuestionarioQuestaoAtributo.length; i++) {

					attribute = model.ttQuestionarioQuestaoAtributo[i];

					if (value === attribute.nom_atrib) {

						if (isFastInclusion === true) {
							msg = $rootScope.i18n('msg-duplicate-attributes-disregarded', [], 'dts/crm');
						} else {
							msg = $rootScope.i18n('msg-attribute-already-exists', [], 'dts/crm');
						}

						invalid = true;
						break;
					}
				}

				if (!invalid) {
					if (isFastInclusion === undefined || isFastInclusion === false) {
						isAddOther = CRMControl.log_livre_1 === true ? true : false;
						CRMControl.attribute = undefined;
						CRMControl.log_livre_1 = undefined;
					}

					model.ttQuestionarioQuestaoAtributo.push({
						nom_atrib: value,
						val_peso: 0,
						log_atrib: (CRMControl.selectedTab !== 'row'),
						log_livre_1: isAddOther
					});
				}
			};

			if (isFastInclusion === true) {
				for (j = 0; j < list.length; j++) {
					if (CRMUtil.isDefined(list[j].nom_atrib)) {
						addInList(list[j].nom_atrib);
					}
				}
			} else {
				addInList(CRMControl.attribute);
			}

			if (msg !== undefined) {
				$rootScope.$broadcast(TOTVSEvent.showNotification, {
					type: 'warning',
					title: $rootScope.i18n('l-script', [], 'dts/crm'),
					detail: msg
				});
			}
		};

		this.openFastInclusion = function () {

			var model = CRMControl.model;

			modalScriptQuestionAttributeEdit.open({
				ttQuestionarioQuestaoAtributo: model.ttQuestionarioQuestaoAtributo
			}).then(function (result) {
				if (result) {
					CRMControl.addAttribute(result, true);
				}
			});
		};

		this.removeAllAttributes = function () {

			var i, j,
				msg = '',
				hasDetour = false,
				model = CRMControl.model,
				ttDesvio = this.detour,
				removeAllFn = function () {
					model.ttRemoveAttr = model.ttRemoveAttr || [];
					for (i = 0; i < model.ttQuestionarioQuestaoAtributo.length; i++) {
						var attribute = angular.copy(model.ttQuestionarioQuestaoAtributo[i]);
						model.ttRemoveAttr.push({num_id: attribute.num_id});
					}
					model.ttQuestionarioQuestaoAtributo = [];
				};

			ttDesvio = this.detour;
			if (ttDesvio && ttDesvio.length > 0) {
				for (j = 0; j < model.ttQuestionarioQuestaoAtributo.length; j++) {

					for (i = 0; i < ttDesvio.length; i++) {
						if (model.ttQuestionarioQuestaoAtributo[j].num_id === ttDesvio[i].num_id_atrib_from) {
							hasDetour = true;
							break;
						}
					}

				}
			}

			if (hasDetour) {
				msg = 'msg-confirm-delete-all-attributes-with-detour';
			} else {
				msg = 'msg-confirm-delete-all-attributes';
			}

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n(msg, [], 'dts/crm'),
				callback: function (isPositiveResult) {
					var i;

					if (!isPositiveResult) { return; }

					if (model.num_id > 0) {
						removeAllFn();
					} else {
						model.ttQuestionarioQuestaoAtributo = [];
					}

				}
			});

		};

		this.removeAttribute = function (attr) {

			var i,
				removeFunc,
				attribute,
				ttDesvio = this.detour,
				msg = '',
				hasDetour = false;

			removeFunc = function () {

				CRMControl.model.ttRemoveAttr = CRMControl.model.ttRemoveAttr || [];

				for (i = 0; i < CRMControl.model.ttQuestionarioQuestaoAtributo.length; i++) {
					attribute = angular.copy(CRMControl.model.ttQuestionarioQuestaoAtributo[i]);

					if (attribute.nom_atrib === attr.nom_atrib) {
						if (attribute.num_id === attr.num_id) {
							CRMControl.model.ttRemoveAttr.push({num_id: attribute.num_id});
						}

						CRMControl.model.ttQuestionarioQuestaoAtributo.splice(i, 1);
						break;
					}
				}
			};

			if (ttDesvio && ttDesvio.length > 0) {
				for (i = 0; i < ttDesvio.length; i++) {
					if (attr.num_id === ttDesvio[i].num_id_atrib_from) {
						hasDetour = true;
						break;
					}
				}
			}

			if (hasDetour) {
				msg = $rootScope.i18n('msg-confirm-delete-attribute-with-detour', [attr.nom_atrib], 'dts/crm');
				$rootScope.$broadcast(TOTVSEvent.showQuestion, {
					title: 'l-confirm-delete',
					cancelLabel: 'btn-cancel',
					confirmLabel: 'btn-confirm',
					text: msg,
					callback: function (isPositiveResult) {
						var i;
						if (!isPositiveResult) { return; }
						removeFunc();
					}
				});
			} else {
				removeFunc();
			}
		};

		this.disabledEditionTypes = function (typeId) {
			return (typeId === 1 || typeId === 6 || typeId === 7 || typeId === 8  || typeId === 9 || typeId === 10 || typeId === 11 || typeId === 12 || typeId === 13 || typeId === 14);
		};

		this.hasAttributeAsOther = function () {
			var i;

			if (!angular.isArray(this.model.ttQuestionarioQuestaoAtributo)) {
				return false;
			}

			if (this.model.ttTipo.num_id === 8 || this.model.ttTipo.num_id === 12 || this.model.ttTipo.num_id === 13 || this.model.ttTipo.num_id === 14) {
				return false;
			}

			for (i = 0; i < this.model.ttQuestionarioQuestaoAtributo.length; i++) {
				if (this.model.ttQuestionarioQuestaoAtributo[i].log_livre_1 === true) {
					return false;
				}
			}

			return true;
		};

		this.isRowFilter = scriptHelper.isRowFilter;

		this.isColunmFilter = scriptHelper.isColunmFilter;

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		parameters = parameters || {};

		this.model = parameters.question ? angular.copy(parameters.question) : {};
		this.page = parameters.page ? angular.copy(parameters.page) : undefined;
		this.sequence = parameters.sequence ? angular.copy(parameters.sequence) : undefined;
		this.detour = parameters.detour ? angular.copy(parameters.detour) : undefined;

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
		'$rootScope', '$scope', '$modalInstance', 'parameters', 'crm.helper', 'crm.legend',
		'TOTVSEvent', 'crm.crm_script.factory', 'crm.script.helper', 'crm.script-question-attribute.modal.edit'
	];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************

	index.register.service('crm.script-page-question.modal.edit', modal);
	index.register.controller('crm.script-page-question.edit.control', controller);
});
