/*globals index, $, window, angular, define, TOTVSEvent, CRMEvent, CRMUtil, APP_BASE_URL*/
/*jslint plusplus: true*/
define([
	'index',
	'/dts/crm/js/crm-services.js',
	'/dts/crm/js/api/fchcrm1068.js'
], function (index) {

	'use strict';

	var modalScriptDetour,
		controllerScriptDetour;

	// *************************************************************************************
	// *** MODAL DETOUR
	// *************************************************************************************

	modalScriptDetour = function ($rootScope, $modal) {
		this.open = function (params) {

			var scope = $rootScope.$new();

			scope.isModal = true;
			scope.parameters = params;

			scope.$modalInstance = $modal.open({
				templateUrl: '/dts/crm/html/script/detour/detour.edit.html',
				controller: 'crm.script.detour.control as controller',
				backdrop: 'static',
				keyboard: false,
				size: 'lg',
				scope: scope,
				resolve: { parameters: function () { return params; } }
			});

			return scope.$modalInstance.result;
		};
	};

	modalScriptDetour.$inject = ['$rootScope', '$modal'];

	// *************************************************************************************
	// *** CONTROLLER DETOUR
	// *************************************************************************************

	controllerScriptDetour = function ($rootScope, $scope, parameters, legend, $modalInstance,
									 scriptFactory, TOTVSEvent, helper, scriptHelper) {

		var CRMControlScriptDetour = this;

		this.model = {};

		this.selectedQuestion = undefined;

		this.selectedAttribute = undefined;

		this.selectedPageTo = undefined;

		this.selectedPageFrom = undefined;

		// *********************************************************************************
		// *** Functions
		// *********************************************************************************

		this.allowedPages = function (item) {
			if (CRMControlScriptDetour.selectedPageFrom === undefined) { return false; }

			return item.num_pag > CRMControlScriptDetour.selectedPageFrom.num_pag;
		};

		this.allowedQuestion = function (item) {
			if (item.ttTipo === undefined) {
				scriptHelper.parseScriptQuestType(item);
			}

			return (item.ttTipo.is_allow_detour === true);
		};

		this.close = function () {
			$modalInstance.close(CRMControlScriptDetour.model);
		};

		this.addDetour = function () {

			if (!this.isInvalidForm()) {

				scriptFactory.addDetour(CRMControlScriptDetour.selectedAttribute.num_id, CRMControlScriptDetour.selectedPageTo.num_id, function (result) {

					if (result === undefined) { return; }

					CRMControlScriptDetour.model.ttDesvio.push(result);

					CRMControlScriptDetour.selectedQuestion = undefined;
					CRMControlScriptDetour.selectedAttribute = undefined;
					CRMControlScriptDetour.selectedPageTo = undefined;
					CRMControlScriptDetour.selectedPageFrom = undefined;

					CRMControlScriptDetour.updateModelDetour(result, result.num_id_pag_from);

					CRMControlScriptDetour.model.ttDesvio.sort(CRMControlScriptDetour.orderDetour);
				});
			}
		};

		this.isInvalidForm = function () {

			var i,
				isInvalidForm,
				messages = [];

			if (CRMControlScriptDetour.selectedPageFrom === undefined) {
				isInvalidForm = true;
				messages.push('l-page-source');
			}

			if (CRMControlScriptDetour.selectedPageTo === undefined) {
				isInvalidForm = true;
				messages.push('l-page-destination');
			}

			if (CRMControlScriptDetour.selectedQuestion === undefined) {
				isInvalidForm = true;
				messages.push('l-question');
			}

			if (CRMControlScriptDetour.selectedAttribute === undefined) {
				isInvalidForm = true;
				messages.push('l-attribute');
			}

			if (isInvalidForm) {
				helper.showInvalidFormMessage('l-script', messages);
			}

			for (i = 0; i < CRMControlScriptDetour.model.ttDesvio.length; i++) {

				if (CRMControlScriptDetour.model.ttDesvio[i].num_id_pag_from === CRMControlScriptDetour.selectedPageFrom.num_id) {

					if (CRMControlScriptDetour.model.ttDesvio[i].num_id_quest_from !== CRMControlScriptDetour.selectedQuestion.num_id) {

						$rootScope.$broadcast(TOTVSEvent.showNotification, {
							type: 'error',
							title: $rootScope.i18n('l-script', [], 'dts/crm'),
							detail: $rootScope.i18n('msg-page-already-have-detour', [CRMControlScriptDetour.model.ttDesvio[i].nom_pag_from], 'dts/crm')
						});
						//console.log("//para outra questao na mesma pagina");
						isInvalidForm = true;
					} else {

						if (CRMControlScriptDetour.selectedAttribute.num_id === CRMControlScriptDetour.model.ttDesvio[i].num_id_atrib_from) {
							$rootScope.$broadcast(TOTVSEvent.showNotification, {
								type: 'error',
								title: $rootScope.i18n('l-script', [], 'dts/crm'),
								detail: $rootScope.i18n('msg-page-attribute-already-have-detour', [CRMControlScriptDetour.selectedQuestion.nom_quest, CRMControlScriptDetour.selectedAttribute.nom_atrib], 'dts/crm')
							});
							isInvalidForm = true;
						}
					}

				}

				if (isInvalidForm === true) {
					break;
				}

			}

			return isInvalidForm;
		};

		this.removeDetour = function (detour, index) {

			if (detour === undefined || index === undefined) { return; }

			$rootScope.$broadcast(TOTVSEvent.showQuestion, {
				title: 'l-confirm-delete',
				cancelLabel: 'btn-cancel',
				confirmLabel: 'btn-confirm',
				text: $rootScope.i18n('msg-confirm-delete-detour', [detour.nom_pag_from], 'dts/crm'),
				callback: function (isPositiveResult) {

					if (!isPositiveResult) { return; }

					scriptFactory.removeDetour(detour.num_id_atrib_from, function (result) {
						if (result === undefined || result.l_ok !== true) { return; }

						CRMControlScriptDetour.model.ttDesvio.splice(index, 1);
					});

					CRMControlScriptDetour.updateModelDetour(detour, 0);
				}
			});

		};

		this.updateModelDetour = function (detour, numIdPageFrom) {
			var i, j, k, question, attr, page, script;

			script = CRMControlScriptDetour.model;

			if (script && script.ttQuestionarioPagina && script.ttQuestionarioPagina.length > 0) {

				for (i = 0; i < script.ttQuestionarioPagina.length; i++) {
					page = script.ttQuestionarioPagina[i];

					if (page && page.ttQuestionarioQuestao && page.ttQuestionarioQuestao.length > 0) {

						for (j = 0; j < page.ttQuestionarioQuestao.length; j++) {
							question = page.ttQuestionarioQuestao[j];

							if (question && question.ttQuestionarioQuestaoAtributo && question.ttQuestionarioQuestaoAtributo.length > 0) {

								for (k = 0; k < question.ttQuestionarioQuestaoAtributo.length; k++) {
									attr = question.ttQuestionarioQuestaoAtributo[k];

									if (attr && attr.num_id === detour.num_id_atrib_from) {
										attr.num_pag_desvio = numIdPageFrom;
									}

								}

							}

						}

					}

				}

			}
		};

		this.orderDetour = function (item1, item2) {
			return item1.num_id_pag_from - item2.num_id_pag_from;
		};

		this.onChangePageFrom = function () {
			CRMControlScriptDetour.selectedPageTo = undefined;
			CRMControlScriptDetour.selectedQuestion = undefined;
			CRMControlScriptDetour.selectedAttribute = undefined;
		};

		this.onChangeQuestion = function () {
			CRMControlScriptDetour.selectedAttribute = undefined;
		};

		// *********************************************************************************
		// *** Control Initialize
		// *********************************************************************************

		CRMControlScriptDetour.model = parameters.script ? angular.copy(parameters.script) : {};

		this.init = function () {

			var model = CRMControlScriptDetour.model;

			if (model.ttDesvio === undefined) {
				model.ttDesvio = [];
			}

			model.ttDesvio.sort(CRMControlScriptDetour.orderDetour);
		};

		this.init();

		// *********************************************************************************
		// *** Events Listners
		// *********************************************************************************

		$scope.$on('$destroy', function () {
			CRMControlScriptDetour = undefined;
		});

	};

	controllerScriptDetour.$inject = ['$rootScope', '$scope', 'parameters', 'crm.legend', '$modalInstance',
								   'crm.crm_script.factory', 'TOTVSEvent', 'crm.helper', 'crm.script.helper'];

	// *************************************************************************************
	// *** REGISTER
	// *************************************************************************************


	index.register.service('crm.script.modal.detour', modalScriptDetour);
	index.register.controller('crm.script.detour.control', controllerScriptDetour);

});
